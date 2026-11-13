import { uid } from "@/lib/uid";
import { and, eq, gte, lt, inArray, ne, sql } from "drizzle-orm";
import { db, t, type Tx } from "@/db";
import { DEADLINE, addDays, dateIn, dateRange, dayOfWeek, daysBetween, isWeekend, todayIn, weekStart, formatMinutes } from "@/lib/dates";
import { isDone } from "@/lib/status";
import { COMMON_CRITERIA, DESIGNER_BLOCKS, FRONTEND_BLOCKS, PROJECT_LEVELS, type ProjectBlock } from "@/lib/syllabus/project-templates";

/*
 * The planner turns the syllabus into an honest, dated plan up to the deadline.
 *
 * 1. Capacity: the learner's weekday/weekend hours for each remaining day, minus time already
 *    committed (completed work today, revision tasks, tasks the learner moved by hand).
 * 2. Scope: essential topics first. If they don't all fit, every domain gets a share of the time,
 *    weighted towards foundations and AI-native skills, and topics are taken in syllabus order.
 *    Whatever does not fit is marked "Continued learning" instead of pretending it will be done.
 * 3. Packing: selected topics are laid out in syllabus order across weekdays, with daily review of the
 *    previous day's topics, a Friday mastery check, and weekends reserved for the weekly project.
 * 4. Weekend projects are generated from the topics studied (and actually completed) that week.
 */

type TopicRow = typeof t.topics.$inferSelect;
type DomainRow = typeof t.domains.$inferSelect;

interface PlanResult {
  core: number;
  stretch: number;
  continued: number;
  rescheduled: number;
}

const round5 = (n: number) => Math.max(5, Math.round(n / 5) * 5);

export function needMinutes(topic: TopicRow, progress?: { status: string; minutesSpent: number }) {
  if (progress?.status === "needs_revision") return 30;
  const spent = progress?.minutesSpent ?? 0;
  return round5(Math.max(15, topic.estMinutes - spent));
}

export async function rebuildPlan(userId: string): Promise<PlanResult | null> {
  const user = await db.select().from(t.users).where(eq(t.users.id, userId)).get();
  if (!user || !user.hoursWeekday) return null;
  const today = todayIn(user.timezone);
  const now = Date.now();

  const topics = await db.select().from(t.topics).where(eq(t.topics.pathId, user.pathId)).orderBy(t.topics.sort).all();
  const domains = await db.select().from(t.domains).where(eq(t.domains.pathId, user.pathId)).all();
  const domainById = new Map(domains.map((d) => [d.id, d]));

  // Make sure every topic has a progress row.
  const existing = await db.select().from(t.topicProgress).where(eq(t.topicProgress.userId, userId)).all();
  const progress = new Map(existing.map((p) => [p.topicId, p]));
  const missing = topics.filter((tp) => !progress.has(tp.id));
  if (missing.length) {
    for (let i = 0; i < missing.length; i += 100)
      await db.insert(t.topicProgress)
        .values(missing.slice(i, i + 100).map((tp) => ({ userId, topicId: tp.id, updatedAt: now })))
        .onConflictDoNothing()
        .run();
    for (const tp of missing)
      progress.set(tp.id, { userId, topicId: tp.id, status: "not_started", planBucket: "continued", notes: "", minutesSpent: 0, startedAt: null, completedAt: null, masteredAt: null, updatedAt: now });
  }

  if (today > DEADLINE) {
    await db.update(t.users).set({ lastPlanDate: today, planNote: "The plan period has ended. Everything not yet completed is continued learning." }).where(eq(t.users.id, userId)).run();
    return { core: 0, stretch: 0, continued: topics.length, rescheduled: 0 };
  }

  return db.transaction(async (tx) => {
    // ── 1. Move unfinished past work forward ────────────────────────────────────────────
    const overdue = await tx
      .select()
      .from(t.scheduleItems)
      .where(and(eq(t.scheduleItems.userId, userId), eq(t.scheduleItems.status, "planned"), lt(t.scheduleItems.date, today)))
      .all();
    // Batched: one statement per kind of change (fast on a hosted database).
    const overduePlan = overdue.filter((i) => i.origin === "plan");
    const overdueOther = overdue.filter((i) => i.origin !== "plan");
    const rescheduled = overduePlan.filter((i) => i.kind === "learn" || i.kind === "project").length + overdueOther.length;
    if (overduePlan.length)
      await tx.update(t.scheduleItems).set({ status: "rescheduled" }).where(inArray(t.scheduleItems.id, overduePlan.map((i) => i.id))).run();
    if (overdueOther.length)
      await tx
        .update(t.scheduleItems)
        .set({ date: today, rescheduledFrom: sql`coalesce(${t.scheduleItems.rescheduledFrom}, ${t.scheduleItems.date})` })
        .where(inArray(t.scheduleItems.id, overdueOther.map((i) => i.id)))
        .run();
    await tx.delete(t.scheduleItems)
      .where(and(eq(t.scheduleItems.userId, userId), eq(t.scheduleItems.origin, "plan"), eq(t.scheduleItems.status, "planned"), gte(t.scheduleItems.date, today)))
      .run();

    // ── 2. Capacity per day ──────────────────────────────────────────────────────────────
    const days = dateRange(today, DEADLINE);
    const weekdayMin = Math.round((user.hoursWeekday ?? 0) * 60);
    const weekendMin = Math.round((user.hoursWeekend ?? user.hoursWeekday ?? 0) * 60);
    const committed = await tx
      .select()
      .from(t.scheduleItems)
      .where(and(eq(t.scheduleItems.userId, userId), gte(t.scheduleItems.date, today), ne(t.scheduleItems.status, "rescheduled")))
      .all();
    const committedByDay = new Map<string, number>();
    const committedByTopic = new Map<string, number>();
    for (const c of committed) {
      committedByDay.set(c.date, (committedByDay.get(c.date) ?? 0) + c.minutes);
      if (c.topicId && c.kind === "learn" && c.status === "planned") committedByTopic.set(c.topicId, (committedByTopic.get(c.topicId) ?? 0) + c.minutes);
    }
    const free = (d: string) => Math.max(0, (isWeekend(d) ? weekendMin : weekdayMin) - (committedByDay.get(d) ?? 0));

    const recentDone = topics.filter((tp) => {
      const p = progress.get(tp.id);
      return p?.completedAt && daysBetween(dateIn(p.completedAt, user.timezone), today) <= 3;
    });

    interface DayPlan {
      date: string;
      learnCap: number;
      reviewMin: number;
      assessMin: number;
      final: boolean;
      learn: { topicId: string; minutes: number; part: number }[];
    }
    const learnDays: DayPlan[] = [];
    let firstLearnDay = true;
    for (const d of days) {
      if (isWeekend(d)) continue;
      const cap = free(d);
      const final = d === DEADLINE;
      let reviewMin = 0;
      let assessMin = 0;
      if (!final && cap >= 30) {
        if (dayOfWeek(d) === 5) assessMin = cap >= 120 ? 30 : 15;
        else if (!firstLearnDay || recentDone.length) reviewMin = cap >= 120 ? round5(cap * 0.12) : 10;
      }
      learnDays.push({ date: d, learnCap: final ? 0 : Math.max(0, cap - reviewMin - assessMin), reviewMin, assessMin, final, learn: [] });
      firstLearnDay = false;
    }
    const L = learnDays.reduce((n, d) => n + d.learnCap, 0);

    // ── 3. Scope selection ───────────────────────────────────────────────────────────────
    const remaining = topics.filter((tp) => !isDone(progress.get(tp.id)?.status ?? "not_started"));
    const need = new Map(remaining.map((tp) => [tp.id, Math.max(0, needMinutes(tp, progress.get(tp.id)) - (committedByTopic.get(tp.id) ?? 0))]));
    const isSpecial = (tp: TopicRow) => domainById.get(tp.domainId)?.isSpecialization ?? false;
    const forced = remaining.filter((tp) => ["learning", "practiced", "needs_revision"].includes(progress.get(tp.id)?.status ?? ""));
    const essentials = remaining.filter((tp) => tp.tier === "essential" && !isSpecial(tp));
    const selected = new Set<string>(forced.map((tp) => tp.id));
    const bucket = new Map<string, "core" | "stretch" | "continued">();
    let used = forced.reduce((n, tp) => n + (need.get(tp.id) ?? 0), 0);

    const essentialTotal = essentials.filter((tp) => !selected.has(tp.id)).reduce((n, tp) => n + (need.get(tp.id) ?? 0), 0);
    if (used + essentialTotal <= L) {
      for (const tp of essentials) selected.add(tp.id);
      used += essentialTotal;
      for (const tp of essentials) bucket.set(tp.id, "core");
      for (const tp of remaining) {
        if (selected.has(tp.id) || tp.tier !== "core-senior" || isSpecial(tp)) continue;
        const n = need.get(tp.id) ?? 0;
        if (used + n > L) break;
        selected.add(tp.id);
        bucket.set(tp.id, "stretch");
        used += n;
      }
    } else {
      // Weighted per-domain budgets so every essential domain is touched, foundations and AI favoured.
      const weight = (d: DomainRow) => (d.isAi ? 1.35 : d.stageNumber <= 2 ? 1.15 : 1);
      const byDomain = new Map<string, TopicRow[]>();
      for (const tp of essentials) {
        if (selected.has(tp.id)) continue;
        byDomain.set(tp.domainId, [...(byDomain.get(tp.domainId) ?? []), tp]);
      }
      const available = Math.max(0, L - used);
      const totalWeighted = [...byDomain.entries()].reduce(
        (n, [dId, list]) => n + weight(domainById.get(dId)!) * list.reduce((m, tp) => m + (need.get(tp.id) ?? 0), 0),
        0,
      );
      let spill = 0;
      for (const [dId, list] of byDomain) {
        const effort = list.reduce((m, tp) => m + (need.get(tp.id) ?? 0), 0);
        const budget = (available * weight(domainById.get(dId)!) * effort) / Math.max(1, totalWeighted);
        let spent = 0;
        // Take a contiguous prefix of the domain so its sequence is never broken.
        for (let i = 0; i < list.length; i++) {
          const n = need.get(list[i].id) ?? 0;
          if (i > 0 && spent + n > budget * 1.1) break;
          selected.add(list[i].id);
          spent += n;
        }
        spill += budget - spent;
        used += spent;
      }
      // Use any leftover budget for the next essential topics in syllabus order.
      // Each domain only continues its own prefix; once a topic doesn't fit, that domain stops.
      const stopped = new Set<string>();
      for (const tp of essentials) {
        if (selected.has(tp.id) || stopped.has(tp.domainId)) continue;
        const n = need.get(tp.id) ?? 0;
        if (used + n > L) {
          stopped.add(tp.domainId);
          continue;
        }
        selected.add(tp.id);
        used += n;
      }
      void spill;
      for (const id of selected) bucket.set(id, "core");
    }
    for (const tp of forced) if (!bucket.has(tp.id)) bucket.set(tp.id, tp.tier === "essential" ? "core" : "stretch");

    // ── 4. Pack selected topics across weekdays in syllabus order ────────────────────────
    const order = remaining.filter((tp) => selected.has(tp.id));
    let di = 0;
    const overflow = new Set<string>();
    for (const tp of order) {
      let left = need.get(tp.id) ?? 0;
      let part = 1;
      if (left <= 0) continue;
      while (left > 0) {
        while (di < learnDays.length && learnDays[di].learnCap < 15) di++;
        if (di >= learnDays.length) {
          overflow.add(tp.id);
          break;
        }
        const day = learnDays[di];
        const chunk = Math.min(left, day.learnCap);
        day.learn.push({ topicId: tp.id, minutes: chunk, part: part++ });
        day.learnCap -= chunk;
        left -= chunk;
      }
    }
    for (const id of overflow) bucket.set(id, "continued");

    // ── 5. Persist plan buckets ──────────────────────────────────────────────────────────
    const changes = new Map<string, string[]>();
    for (const tp of topics) {
      const p = progress.get(tp.id)!;
      const next = isDone(p.status) ? (p.planBucket === "continued" ? "core" : p.planBucket) : (bucket.get(tp.id) ?? "continued");
      if (next !== p.planBucket) changes.set(next, [...(changes.get(next) ?? []), tp.id]);
    }
    for (const [next, ids] of changes)
      await tx.update(t.topicProgress).set({ planBucket: next }).where(and(eq(t.topicProgress.userId, userId), inArray(t.topicProgress.topicId, ids))).run();

    // ── 6. Write schedule items ──────────────────────────────────────────────────────────
    const items: (typeof t.scheduleItems.$inferInsert)[] = [];
    const topicById = new Map(topics.map((tp) => [tp.id, tp]));
    const partsTotal = new Map<string, number>();
    for (const d of learnDays) for (const l of d.learn) partsTotal.set(l.topicId, Math.max(partsTotal.get(l.topicId) ?? 0, l.part));

    const learnedOn = new Map<string, string[]>();
    for (const d of learnDays) learnedOn.set(d.date, [...new Set(d.learn.map((l) => l.topicId))]);

    let previousTopics = recentDone.map((tp) => tp.id);
    for (const d of learnDays) {
      let sort = 0;
      if (d.final) {
        const all = topics.filter((tp) => bucket.get(tp.id) === "core" || isDone(progress.get(tp.id)?.status ?? "")).map((tp) => tp.id);
        items.push(item(userId, d.date, "assessment", "Final mastery review and portfolio check", `Review every topic in this plan, complete outstanding mastery assessments and finalize your proof of work.`, free(d.date) || 60, { topicIds: all, sort: sort++ }));
        continue;
      }
      if (d.reviewMin && previousTopics.length) {
        const titles = previousTopics.slice(0, 4).map((id) => topicById.get(id)?.title).filter(Boolean);
        items.push(item(userId, d.date, "review", `Review: ${titles.slice(0, 2).join(", ")}${titles.length > 2 ? ` and ${previousTopics.length - 2} more` : ""}`, "Recall the key ideas from memory first, then check your notes and fill the gaps.", d.reviewMin, { topicIds: previousTopics, sort: sort++ }));
      }
      for (const l of d.learn) {
        const tp = topicById.get(l.topicId)!;
        const total = partsTotal.get(l.topicId) ?? 1;
        items.push(item(userId, d.date, "learn", tp.title, total > 1 ? `Part ${l.part} of ${total}` : "", l.minutes, { topicId: tp.id, sort: sort++ }));
      }
      if (d.assessMin) {
        const ws = weekStart(d.date);
        const weekTopics = topicsInWeek(ws, learnedOn, progress, user.timezone, topics);
        if (weekTopics.length)
          items.push(item(userId, d.date, "assessment", "Weekly mastery check", "Run mastery assessments for this week's completed topics and attach evidence.", d.assessMin, { topicIds: weekTopics, sort: sort++ }));
      }
      const learnedToday = learnedOn.get(d.date) ?? [];
      if (learnedToday.length) previousTopics = learnedToday;
    }

    // ── 7. Weekend projects ──────────────────────────────────────────────────────────────
    const onboardWeek = weekStart(user.onboardedAt ? dateIn(user.onboardedAt, user.timezone) : today);
    const blocks = user.pathId === "frontend" ? FRONTEND_BLOCKS : DESIGNER_BLOCKS;
    const existingProjects = await tx.select().from(t.projects).where(and(eq(t.projects.userId, userId), eq(t.projects.kind, "weekend"))).all();
    const regenerated = new Set<string>();
    // Titles of earlier weeks, so consecutive weekends get different projects.
    const usedTitles = new Set(existingProjects.filter((p) => (p.weekStart ?? "") < weekStart(today)).map((p) => p.title));
    for (let ws = weekStart(today); ws <= DEADLINE; ws = addDays(ws, 7)) {
      const sat = addDays(ws, 5);
      const sun = addDays(ws, 6);
      if (sun < today || sat > DEADLINE) continue;
      const weekIdx = Math.max(0, Math.floor(daysBetween(onboardWeek, ws) / 7));
      let weekTopicIds = topicsInWeek(ws, learnedOn, progress, user.timezone, topics);
      if (!weekTopicIds.length) weekTopicIds = recentDone.map((tp) => tp.id);
      if (!weekTopicIds.length) continue;
      const weekTopics = weekTopicIds.map((id) => topicById.get(id)!).filter(Boolean);
      const prior0 = existingProjects.find((p) => p.weekStart === ws);
      const spec = buildWeekendProject(user.pathId, blocks, weekIdx, weekTopics, domainById, sun, usedTitles);
      usedTitles.add(prior0 && prior0.status !== "planned" ? prior0.title : spec.title);
      const prior = existingProjects.find((p) => p.weekStart === ws);
      let projectId: string;
      if (prior) {
        projectId = prior.id;
        if (prior.status === "planned") await tx.update(t.projects).set({ ...spec, updatedAt: now }).where(eq(t.projects.id, prior.id)).run();
      } else {
        projectId = uid();
        await tx.insert(t.projects).values({ id: projectId, userId, kind: "weekend", weekStart: ws, status: "planned", createdAt: now, updatedAt: now, ...spec }).run();
      }
      regenerated.add(projectId);
      const project = prior && prior.status !== "planned" ? prior : null;
      const title = project?.title ?? spec.title;
      if (project?.status === "completed") continue;
      for (const d of [sat, sun]) {
        if (d < today || d > DEADLINE) continue;
        const cap = free(d);
        if (cap < 15) continue;
        const reviewMin = d === sun ? round5(cap * 0.35) : 0;
        items.push(item(userId, d, "project", title, d === sat ? "Plan, build and gather evidence" : "Finish, submit proof of work, self-assess and reflect", cap - reviewMin, { projectId, sort: 0 }));
        if (reviewMin) items.push(item(userId, d, "review", "Weekly review", "Revisit everything from this week; flag topics that need revision.", reviewMin, { topicIds: weekTopicIds, sort: 1 }));
      }
    }
    // Remove stale, never-started weekend projects in the future that no longer have topics.
    const stale = existingProjects.filter((p) => !regenerated.has(p.id) && p.status === "planned" && (p.weekStart ?? "") >= weekStart(today)).map((p) => p.id);
    if (stale.length) await tx.delete(t.projects).where(inArray(t.projects.id, stale)).run();

    // ── 8. Stage capstones and the final portfolio project ───────────────────────────────
    await syncCapstones(tx, user, topics, domainById, bucket, progress, learnDays, now);

    for (let i = 0; i < items.length; i += 60) await tx.insert(t.scheduleItems).values(items.slice(i, i + 60)).run();

    const counts = { core: 0, stretch: 0, continued: 0 };
    for (const tp of topics) {
      const p = progress.get(tp.id)!;
      if (isDone(p.status)) continue;
      counts[bucket.get(tp.id) ?? "continued"]++;
    }
    const plannedMinutes = items.filter((i) => i.kind === "learn").reduce((n, i) => n + i.minutes, 0);
    const note =
      rescheduled > 0
        ? `${rescheduled} unfinished ${rescheduled === 1 ? "task was" : "tasks were"} moved forward and your plan was rebalanced.`
        : `Plan updated: ${counts.core + counts.stretch} topics scheduled (${formatMinutes(plannedMinutes)}), ${counts.continued} marked as continued learning.`;
    await tx.update(t.users).set({ lastPlanDate: today, planNote: note }).where(eq(t.users.id, userId)).run();
    return { ...counts, rescheduled };
  });
}

function item(
  userId: string,
  date: string,
  kind: string,
  title: string,
  detail: string,
  minutes: number,
  extra: { topicId?: string; topicIds?: string[]; projectId?: string; sort?: number },
): typeof t.scheduleItems.$inferInsert {
  return {
    id: uid(),
    userId,
    date,
    kind,
    title,
    detail,
    minutes: Math.max(5, Math.round(minutes)),
    topicId: extra.topicId ?? null,
    topicIds: JSON.stringify(extra.topicIds ?? []),
    projectId: extra.projectId ?? null,
    origin: "plan",
    status: "planned",
    sort: extra.sort ?? 0,
    createdAt: Date.now(),
  };
}

function topicsInWeek(
  ws: string,
  learnedOn: Map<string, string[]>,
  progress: Map<string, { status: string; completedAt: number | null }>,
  tz: string,
  topics: TopicRow[],
): string[] {
  const end = addDays(ws, 6);
  const ids = new Set<string>();
  for (const tp of topics) {
    const p = progress.get(tp.id);
    if (p?.completedAt) {
      const d = dateIn(p.completedAt, tz);
      if (d >= ws && d <= end) ids.add(tp.id);
    }
  }
  for (let d = ws; d <= addDays(ws, 4); d = addDays(d, 1)) for (const id of learnedOn.get(d) ?? []) ids.add(id);
  const order = new Map(topics.map((tp, i) => [tp.id, i]));
  return [...ids].sort((a, b) => (order.get(a) ?? 0) - (order.get(b) ?? 0));
}

export function buildWeekendProject(
  pathId: string,
  blocks: Record<string, ProjectBlock>,
  weekIdx: number,
  weekTopics: TopicRow[],
  domainById: Map<string, DomainRow>,
  dueDate: string,
  usedTitles: Set<string> = new Set(),
) {
  const minutesByDomain = new Map<string, number>();
  for (const tp of weekTopics) minutesByDomain.set(tp.domainId, (minutesByDomain.get(tp.domainId) ?? 0) + tp.estMinutes);
  const ranked = [...minutesByDomain.entries()].sort((a, b) => b[1] - a[1]).map(([id]) => domainById.get(id)!).filter(Boolean);
  // Prefer the most-studied domain whose project hasn't been used on an earlier weekend.
  const primary = ranked.find((d) => blocks[d.code] && !usedTitles.has(blocks[d.code].title)) ?? ranked[0];
  const baseBlock = blocks[primary.code] ?? genericBlock(primary.title);
  const repeat = usedTitles.has(baseBlock.title);
  const block = repeat ? { ...baseBlock, title: `${baseBlock.title}, extended` } : baseBlock;
  const secondary = ranked.filter((d) => d !== primary).slice(0, 2).map((d) => blocks[d.code]).filter(Boolean);
  const level = PROJECT_LEVELS[Math.min(weekIdx, PROJECT_LEVELS.length - 1)];
  const topicTitles = weekTopics.slice(0, 8).map((tp) => tp.title);

  const requirements = [...block.requirements, ...secondary.map((b) => b.requirements[0])];
  requirements.push(`Apply these topics from your week: ${topicTitles.join("; ")}`);
  if (weekIdx >= 2) requirements.push("Explain your key decisions and trade-offs in writing");
  if (weekIdx >= 4) requirements.push(pathId === "frontend" ? "Include automated checks (tests, type-check or lint) that pass" : "Validate the work with at least one real person and record what you learned");
  if (weekIdx >= 5) requirements.push("Present it as a portfolio-ready piece with context, process and outcome");

  return {
    level,
    title: block.title,
    problem: `${repeat ? "Take last weekend's work further with this week's new topics. " : ""}${block.brief} This project is built from what you studied this week, so every requirement maps to a topic in your roadmap.`,
    objectives: JSON.stringify(weekTopics.slice(0, 6).map((tp) => `Demonstrate ${tp.title.charAt(0).toLowerCase()}${tp.title.slice(1)} in working, explainable form`)),
    topicIds: JSON.stringify(weekTopics.map((tp) => tp.id)),
    requirements: JSON.stringify(requirements),
    deliverables: JSON.stringify([...block.deliverables, "At least one proof-of-work entry linked to this project", "Self-assessment, reflection and skills demonstrated"]),
    criteria: JSON.stringify([...block.criteria, ...(COMMON_CRITERIA[pathId] ?? [])]),
    dueDate,
  };
}

function genericBlock(domainTitle: string): ProjectBlock {
  return {
    title: `${domainTitle} practice project`,
    brief: `Apply this week's ${domainTitle.toLowerCase()} topics to a small, real piece of work.`,
    requirements: ["Choose a realistic problem that needs this week's topics", "Produce a working deliverable"],
    deliverables: ["The deliverable and a short write-up"],
    criteria: ["Topics applied correctly"],
  };
}

async function syncCapstones(
  tx: Tx,
  user: typeof t.users.$inferSelect,
  topics: TopicRow[],
  domainById: Map<string, DomainRow>,
  bucket: Map<string, string>,
  progress: Map<string, { status: string }>,
  learnDays: { date: string; learn: { topicId: string }[] }[],
  now: number,
) {
  const path = await tx.select().from(t.paths).where(eq(t.paths.id, user.pathId)).get();
  if (!path) return;
  const capstones = JSON.parse(path.capstones) as { stage: string; text: string }[];
  const existing = await tx.select().from(t.projects).where(and(eq(t.projects.userId, user.id), inArray(t.projects.kind, ["capstone", "final"]))).all();
  const lastDayFor = new Map<string, string>();
  for (const d of learnDays) for (const l of d.learn) lastDayFor.set(l.topicId, d.date);

  for (const [i, c] of capstones.entries()) {
    const stageNumber = Number(/\d+/.exec(c.stage)?.[0] ?? 0);
    const stageTopics = topics.filter((tp) => domainById.get(tp.domainId)?.stageNumber === stageNumber);
    const inPlan = stageTopics.filter((tp) => bucket.get(tp.id) === "core" || bucket.get(tp.id) === "stretch" || ["completed", "mastered", "needs_revision"].includes(progress.get(tp.id)?.status ?? ""));
    const due = inPlan.map((tp) => lastDayFor.get(tp.id)).filter(Boolean).sort().pop() ?? DEADLINE;
    const dueDate = due > DEADLINE ? DEADLINE : due;
    const level = inPlan.length < stageTopics.length / 3 ? "Portfolio-quality project (partly continued learning)" : "Portfolio-quality project";
    const spec = {
      title: `${c.stage} capstone`,
      level,
      problem: c.text,
      objectives: JSON.stringify([`Integrate the ${c.stage.toLowerCase()} topics into one complete, deployed piece of work`]),
      topicIds: JSON.stringify(inPlan.slice(0, 40).map((tp) => tp.id)),
      requirements: JSON.stringify([c.text, "Cover the topics from this stage that are in your plan", "Document decisions, trade-offs and what you would do next"]),
      deliverables: JSON.stringify(["Live link or file", "Proof of work entries", "Self-assessment and reflection"]),
      criteria: JSON.stringify(COMMON_CRITERIA[user.pathId] ?? []),
      dueDate,
    };
    const prior = existing.find((p) => p.kind === "capstone" && p.sort === i);
    if (!prior) await tx.insert(t.projects).values({ id: uid(), userId: user.id, kind: "capstone", status: "planned", sort: i, createdAt: now, updatedAt: now, ...spec }).run();
    else if (prior.status === "planned") await tx.update(t.projects).set({ ...spec, updatedAt: now }).where(eq(t.projects.id, prior.id)).run();
  }

  if (!existing.some((p) => p.kind === "final")) {
    await tx.insert(t.projects)
      .values({
        id: uid(),
        userId: user.id,
        kind: "final",
        level: "Portfolio-quality project",
        title: "Foundation portfolio",
        problem: `By ${DEADLINE}, assemble a verifiable body of work: your strongest projects, the topics you can demonstrate, and an honest continuation plan for everything still in progress.`,
        objectives: JSON.stringify(["Show what you can independently demonstrate", "Link every mastery claim to evidence", "Write a continuation plan for 2027"]),
        topicIds: "[]",
        requirements: JSON.stringify(["Select your 3–5 strongest projects and explain each", "Link proof of work for every mastered topic", "Write a continuation plan from the topics marked as continued learning"]),
        deliverables: JSON.stringify(["Portfolio page or document", "Continuation plan"]),
        criteria: JSON.stringify(["Every claim is backed by evidence", "Honest about gaps"]),
        dueDate: DEADLINE,
        status: "planned",
        sort: 99,
        createdAt: now,
        updatedAt: now,
      })
      .run();
  }
}

/** Rebuilds the plan once per day, so unfinished work is moved forward automatically. */
export async function ensureFreshPlan(user: { id: string; timezone: string; lastPlanDate: string | null; hoursWeekday: number | null }) {
  if (!user.hoursWeekday) return;
  const today = todayIn(user.timezone);
  if (user.lastPlanDate === today) return;
  await rebuildPlan(user.id);
}
