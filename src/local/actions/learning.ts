import { uid } from "@/lib/uid";
import { and, eq, inArray } from "drizzle-orm";
import { z } from "zod";
import { db, t } from "@/db";
import { DEADLINE, addDays, todayIn } from "@/lib/dates";
import { MASTERY_CRITERIA, MASTERY_THRESHOLD, MIN_EXPLANATION_CHARS } from "@/lib/mastery";
import { isDone } from "@/lib/status";
import { requireOnboardedUser, type SessionUser } from "../auth";
import { getPathTree, recordActivity } from "../data";
import { ActionError, ensureProgress, ownItem, ownTopic, run } from "../guards";

const MEANINGFUL_SESSION_MIN = 10;

async function assertUnlocked(user: SessionUser, topicId: string) {
  const tree = await getPathTree(user.id, user.pathId);
  for (const d of tree) {
    const v = d.topics.find((x) => x.id === topicId);
    if (v?.locked)
      throw new ActionError(`Finish more of ${d.missingPrereqs.map((m) => `Domain ${m.code} (${m.title})`).join(" and ")} first — at least half of its planned topics.`);
  }
}

/* ── Topic status ─────────────────────────────────────────────────────────── */

const statusSchema = z.enum(["not_started", "learning", "practiced", "completed", "needs_revision"]);

export async function setTopicStatus(topicId: string, statusRaw: string) {
  return run(async () => {
    const user = await requireOnboardedUser();
    const topic = await ownTopic(user, topicId);
    const status = statusSchema.parse(statusRaw);
    const current = await ensureProgress(user.id, topicId);
    if (current.status === "not_started" && status !== "not_started") await assertUnlocked(user, topicId);
    if (current.status === "mastered" && status !== "needs_revision") throw new ActionError("This topic is mastered. Flag it for revision if you need to revisit it.");
    const now = Date.now();
    const patch: Partial<typeof t.topicProgress.$inferInsert> = { status, updatedAt: now };
    if (status !== "not_started" && !current.startedAt) patch.startedAt = now;
    if (status === "completed" && !current.completedAt) patch.completedAt = now;
    if (status === "not_started") Object.assign(patch, { startedAt: null, completedAt: null });
    await db.update(t.topicProgress).set(patch).where(and(eq(t.topicProgress.userId, user.id), eq(t.topicProgress.topicId, topicId))).run();

    const today = todayIn(user.timezone);
    if (status === "completed" && !isDone(current.status)) {
      // Spaced revision: +2 and +7 days (within the plan period).
      for (const offset of [2, 7]) {
        const date = addDays(today, offset);
        if (date > DEADLINE) continue;
        await db.insert(t.scheduleItems)
          .values({ id: uid(), userId: user.id, date, kind: "review", topicId, topicIds: JSON.stringify([topicId]), title: `Revise: ${topic.title}`, detail: offset === 2 ? "First spaced revision — recall before re-reading." : "Second spaced revision — explain it out loud or teach it.", minutes: 15, origin: "revision", status: "planned", createdAt: now })
          .run();
      }
      // Today's planned learning for this topic is done.
      await db.update(t.scheduleItems)
        .set({ status: "done", completedAt: now })
        .where(and(eq(t.scheduleItems.userId, user.id), eq(t.scheduleItems.topicId, topicId), eq(t.scheduleItems.kind, "learn"), eq(t.scheduleItems.status, "planned"), eq(t.scheduleItems.date, today)))
        .run();
      await recordActivity(user, { type: "topic_completed", label: `Completed ${topic.title}`, refId: topicId, countsForStreak: false });
    }
    if (status === "needs_revision") {
      const date = addDays(today, 1) <= DEADLINE ? addDays(today, 1) : today;
      await db.insert(t.scheduleItems)
        .values({ id: uid(), userId: user.id, date, kind: "review", topicId, topicIds: JSON.stringify([topicId]), title: `Revise: ${topic.title}`, detail: "Flagged for revision.", minutes: 30, origin: "revision", status: "planned", createdAt: now })
        .run();
    }
  });
}

export async function toggleSubtopic(subtopicId: string, done: boolean) {
  return run(async () => {
    const user = await requireOnboardedUser();
    const sub = await db.select().from(t.subtopics).where(eq(t.subtopics.id, subtopicId)).get();
    if (!sub) throw new ActionError("That subtopic doesn't exist.");
    await ownTopic(user, sub.topicId);
    const progress = await ensureProgress(user.id, sub.topicId);
    if (done && progress.status === "not_started") {
      await assertUnlocked(user, sub.topicId);
      await db.update(t.topicProgress).set({ status: "learning", startedAt: Date.now(), updatedAt: Date.now() }).where(and(eq(t.topicProgress.userId, user.id), eq(t.topicProgress.topicId, sub.topicId))).run();
    }
    await db.insert(t.subtopicProgress)
      .values({ userId: user.id, subtopicId, done, updatedAt: Date.now() })
      .onConflictDoUpdate({ target: [t.subtopicProgress.userId, t.subtopicProgress.subtopicId], set: { done, updatedAt: Date.now() } })
      .run();
  });
}

export async function saveTopicNotes(topicId: string, notes: string) {
  return run(async () => {
    const user = await requireOnboardedUser();
    await ownTopic(user, topicId);
    await ensureProgress(user.id, topicId);
    await db.update(t.topicProgress)
      .set({ notes: notes.slice(0, 20000), updatedAt: Date.now() })
      .where(and(eq(t.topicProgress.userId, user.id), eq(t.topicProgress.topicId, topicId)))
      .run();
    return "Notes saved";
  });
}

/* ── Learning sessions ────────────────────────────────────────────────────── */

async function finishSession(user: SessionUser, sessionId: string, minutes: number, note: string) {
  const s = await db.select().from(t.learningSessions).where(and(eq(t.learningSessions.id, sessionId), eq(t.learningSessions.userId, user.id))).get();
  if (!s) throw new ActionError("That session doesn't exist.");
  const clamped = Math.max(0, Math.min(600, Math.round(minutes)));
  await db.update(t.learningSessions).set({ endedAt: Date.now(), minutes: clamped, note: note.slice(0, 2000) }).where(eq(t.learningSessions.id, s.id)).run();
  await applySessionEffects(user, { topicId: s.topicId, projectId: s.projectId, minutes: clamped, sessionId: s.id });
  return clamped;
}

async function applySessionEffects(user: SessionUser, s: { topicId: string | null; projectId: string | null; minutes: number; sessionId: string }) {
  let label = "Learning session";
  if (s.topicId) {
    const topic = await db.select().from(t.topics).where(eq(t.topics.id, s.topicId)).get();
    const p = await ensureProgress(user.id, s.topicId);
    await db.update(t.topicProgress)
      .set({
        minutesSpent: p.minutesSpent + s.minutes,
        status: p.status === "not_started" && s.minutes > 0 ? "learning" : p.status,
        startedAt: p.startedAt ?? Date.now(),
        updatedAt: Date.now(),
      })
      .where(and(eq(t.topicProgress.userId, user.id), eq(t.topicProgress.topicId, s.topicId)))
      .run();
    if (topic) label = topic.title;
  } else if (s.projectId) {
    const project = await db.select().from(t.projects).where(eq(t.projects.id, s.projectId)).get();
    if (project) label = project.title;
  }
  if (s.minutes > 0)
    await recordActivity(user, { type: "session", label: `Studied ${label}`, refId: s.sessionId, minutes: s.minutes, countsForStreak: s.minutes >= MEANINGFUL_SESSION_MIN });
}

export async function startSession(input: { topicId?: string | null; projectId?: string | null; scheduleItemId?: string | null }) {
  return run(async () => {
    const user = await requireOnboardedUser();
    if (input.topicId) {
      await ownTopic(user, input.topicId);
      const p = await ensureProgress(user.id, input.topicId);
      if (p.status === "not_started") await assertUnlocked(user, input.topicId);
    }
    if (input.projectId) {
      const pr = await db.select().from(t.projects).where(and(eq(t.projects.id, input.projectId), eq(t.projects.userId, user.id))).get();
      if (!pr) throw new ActionError("That project doesn't exist.");
    }
    if (input.scheduleItemId) await ownItem(user, input.scheduleItemId);
    const active = (await db.select().from(t.learningSessions).where(eq(t.learningSessions.userId, user.id)).all()).find((s) => !s.endedAt);
    if (active) await finishSession(user, active.id, (Date.now() - active.startedAt) / 60000, active.note);
    await db.insert(t.learningSessions)
      .values({ id: uid(), userId: user.id, topicId: input.topicId ?? null, projectId: input.projectId ?? null, scheduleItemId: input.scheduleItemId ?? null, startedAt: Date.now() })
      .run();
    return "Session started";
  });
}

export async function stopSession(note: string) {
  return run(async () => {
    const user = await requireOnboardedUser();
    const active = (await db.select().from(t.learningSessions).where(eq(t.learningSessions.userId, user.id)).all()).find((s) => !s.endedAt);
    if (!active) throw new ActionError("No session is running.");
    const minutes = await finishSession(user, active.id, (Date.now() - active.startedAt) / 60000, note);
    if (active.scheduleItemId) {
      const item = await db.select().from(t.scheduleItems).where(eq(t.scheduleItems.id, active.scheduleItemId)).get();
      if (item && item.status === "planned" && minutes >= item.minutes * 0.8)
        await db.update(t.scheduleItems).set({ status: "done", completedAt: Date.now() }).where(eq(t.scheduleItems.id, item.id)).run();
    }
    return minutes >= MEANINGFUL_SESSION_MIN ? `Logged ${minutes} minutes` : `Logged ${minutes} minutes — sessions under ${MEANINGFUL_SESSION_MIN} minutes don't count towards your streak`;
  });
}

const logSchema = z.object({
  topicId: z.string().nullable().optional(),
  projectId: z.string().nullable().optional(),
  minutes: z.coerce.number().int().min(1, "Enter at least 1 minute.").max(600, "A single session can be at most 10 hours."),
  note: z.string().max(2000).optional().default(""),
});

export async function logSession(input: z.input<typeof logSchema>) {
  return run(async () => {
    const user = await requireOnboardedUser();
    const parsed = logSchema.safeParse(input);
    if (!parsed.success) throw new ActionError(parsed.error.issues[0].message);
    const { topicId, projectId, minutes, note } = parsed.data;
    if (topicId) {
      await ownTopic(user, topicId);
      const p = await ensureProgress(user.id, topicId);
      if (p.status === "not_started") await assertUnlocked(user, topicId);
    }
    const id = uid();
    const now = Date.now();
    await db.insert(t.learningSessions).values({ id, userId: user.id, topicId: topicId ?? null, projectId: projectId ?? null, startedAt: now - minutes * 60000, endedAt: now, minutes, note }).run();
    await applySessionEffects(user, { topicId: topicId ?? null, projectId: projectId ?? null, minutes, sessionId: id });
    return `Logged ${minutes} minutes`;
  });
}

/* ── Daily planner ────────────────────────────────────────────────────────── */

export async function completeItem(itemId: string, minutesRaw: number) {
  return run(async () => {
    const user = await requireOnboardedUser();
    const item = await ownItem(user, itemId);
    if (item.status === "done") return;
    const minutes = Math.max(0, Math.min(600, Math.round(Number(minutesRaw) || 0)));
    const topicIds = JSON.parse(item.topicIds) as string[];
    const topicId = item.topicId ?? (item.kind === "review" && topicIds.length === 1 ? topicIds[0] : null);
    if (topicId) {
      const p = await ensureProgress(user.id, topicId);
      if (p.status === "not_started") await assertUnlocked(user, topicId);
    }
    if (minutes > 0) {
      const id = uid();
      const now = Date.now();
      await db.insert(t.learningSessions).values({ id, userId: user.id, topicId, projectId: item.projectId, scheduleItemId: item.id, startedAt: now - minutes * 60000, endedAt: now, minutes, note: item.title }).run();
      await applySessionEffects(user, { topicId, projectId: item.projectId, minutes, sessionId: id });
    }
    await db.update(t.scheduleItems).set({ status: "done", completedAt: Date.now() }).where(eq(t.scheduleItems.id, item.id)).run();
    return minutes ? `Done — ${minutes} minutes logged` : "Marked as done";
  });
}

export async function reopenItem(itemId: string) {
  return run(async () => {
    const user = await requireOnboardedUser();
    await ownItem(user, itemId);
    await db.update(t.scheduleItems).set({ status: "planned", completedAt: null }).where(eq(t.scheduleItems.id, itemId)).run();
  });
}

export async function rescheduleItem(itemId: string, date: string) {
  return run(async () => {
    const user = await requireOnboardedUser();
    const item = await ownItem(user, itemId);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new ActionError("Choose a valid date.");
    const today = todayIn(user.timezone);
    if (date < today) throw new ActionError("Choose today or a later date.");
    await db.update(t.scheduleItems)
      .set({ date, origin: item.origin === "plan" ? "user" : item.origin, status: "planned", rescheduledFrom: item.rescheduledFrom ?? item.date })
      .where(eq(t.scheduleItems.id, item.id))
      .run();
    return "Task moved";
  });
}

const customSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Choose a date."),
  title: z.string().trim().min(2, "Give the task a name.").max(140),
  minutes: z.coerce.number().int().min(5, "Plan at least 5 minutes.").max(600),
  topicId: z.string().optional().nullable(),
});

export async function addCustomTask(input: z.input<typeof customSchema>) {
  return run(async () => {
    const user = await requireOnboardedUser();
    const parsed = customSchema.safeParse(input);
    if (!parsed.success) throw new ActionError(parsed.error.issues[0].message);
    if (parsed.data.topicId) await ownTopic(user, parsed.data.topicId);
    await db.insert(t.scheduleItems)
      .values({ id: uid(), userId: user.id, date: parsed.data.date, kind: "custom", topicId: parsed.data.topicId || null, title: parsed.data.title, minutes: parsed.data.minutes, origin: "user", status: "planned", sort: 50, createdAt: Date.now() })
      .run();
    return "Task added";
  });
}

export async function deleteTask(itemId: string) {
  return run(async () => {
    const user = await requireOnboardedUser();
    const item = await ownItem(user, itemId);
    if (item.kind !== "custom") throw new ActionError("Only tasks you added yourself can be deleted. Move planned tasks to another day instead.");
    await db.delete(t.scheduleItems).where(eq(t.scheduleItems.id, item.id)).run();
  });
}

/* ── Mastery ──────────────────────────────────────────────────────────────── */

export async function submitMastery(input: { topicId: string; ratings: Record<string, number>; explanation: string; proofIds: string[] }) {
  return run(async () => {
    const user = await requireOnboardedUser();
    const topic = await ownTopic(user, input.topicId);
    const progress = await ensureProgress(user.id, topic.id);
    if (!isDone(progress.status)) throw new ActionError("Mark the topic as completed before assessing mastery.");
    const criteria = MASTERY_CRITERIA[user.pathId] ?? [];
    const ratings: Record<string, number> = {};
    for (const c of criteria) {
      const v = Number(input.ratings?.[c.key]);
      if (!Number.isInteger(v) || v < 1 || v > 4) throw new ActionError(`Rate "${c.label}".`);
      ratings[c.key] = v;
    }
    const explanation = String(input.explanation ?? "").trim();
    if (explanation.length < MIN_EXPLANATION_CHARS)
      throw new ActionError(`Explain the topic in your own words (at least ${MIN_EXPLANATION_CHARS} characters).`);
    const proofIds = [...new Set(input.proofIds ?? [])];
    const proofs = proofIds.length
      ? await db.select().from(t.proofs).where(and(eq(t.proofs.userId, user.id), inArray(t.proofs.id, proofIds))).all()
      : [];
    if (proofs.length !== proofIds.length) throw new ActionError("One of the selected proof entries doesn't exist.");

    const weak = criteria.filter((c) => ratings[c.key] < MASTERY_THRESHOLD);
    const passed = weak.length === 0 && proofs.length > 0;
    const now = Date.now();
    await db.insert(t.masteryAssessments)
      .values({ id: uid(), userId: user.id, topicId: topic.id, ratings: JSON.stringify(ratings), explanation, proofIds: JSON.stringify(proofIds), passed, createdAt: now })
      .run();
    // Link selected proofs to this topic if they weren't linked yet.
    for (const p of proofs) if (!p.topicId) await db.update(t.proofs).set({ topicId: topic.id, updatedAt: now }).where(eq(t.proofs.id, p.id)).run();

    await db.update(t.topicProgress)
      .set(passed ? { status: "mastered", masteredAt: now, updatedAt: now } : { status: "needs_revision", updatedAt: now })
      .where(and(eq(t.topicProgress.userId, user.id), eq(t.topicProgress.topicId, topic.id)))
      .run();
    if (!passed) {
      const date = addDays(todayIn(user.timezone), 1) <= DEADLINE ? addDays(todayIn(user.timezone), 1) : todayIn(user.timezone);
      await db.insert(t.scheduleItems)
        .values({ id: uid(), userId: user.id, date, kind: "review", topicId: topic.id, topicIds: JSON.stringify([topic.id]), title: `Revise: ${topic.title}`, detail: weak.length ? `Strengthen: ${weak.map((w) => w.label.toLowerCase()).join(", ")}` : "Attach proof of work, then reassess.", minutes: 30, origin: "revision", status: "planned", createdAt: now })
        .run();
    }
    await recordActivity(user, { type: "mastery", label: `${passed ? "Mastered" : "Assessed"} ${topic.title}`, refId: topic.id, countsForStreak: true });
    if (passed) return "Mastery recorded";
    if (!proofs.length) return "Assessment saved. Mastery needs at least one linked proof of work — the topic is flagged for revision.";
    return `Assessment saved. Not yet mastered: ${weak.map((w) => w.label.toLowerCase()).join(", ")}. A revision task was added.`;
  });
}
