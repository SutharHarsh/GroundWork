import { and, asc, eq, gte, lte, ne } from "drizzle-orm";
import { db, t } from "@/db";
import { DEADLINE, addDays, dateIn, daysBetween, todayIn, weekStart } from "@/lib/dates";
import { isDone } from "@/lib/status";
import type { SessionUser } from "./auth";
import { getPathTree, getSessionsTotal, getStreaks, type TopicView } from "./data";

export type ScheduleItem = typeof t.scheduleItems.$inferSelect;

export async function getItemsBetween(userId: string, from: string, to: string) {
  return await db
    .select()
    .from(t.scheduleItems)
    .where(and(eq(t.scheduleItems.userId, userId), gte(t.scheduleItems.date, from), lte(t.scheduleItems.date, to)))
    .orderBy(asc(t.scheduleItems.date), asc(t.scheduleItems.sort), asc(t.scheduleItems.createdAt))
    .all();
}

export async function getOverview(user: SessionUser) {
  const tree = await getPathTree(user.id, user.pathId);
  const topics: TopicView[] = tree.flatMap((d) => d.topics);
  const today = todayIn(user.timezone);
  const done = topics.filter((x) => isDone(x.status));
  const inPlan = topics.filter((x) => x.bucket !== "continued" || isDone(x.status));
  const counts = {
    total: topics.length,
    done: done.length,
    mastered: topics.filter((x) => x.status === "mastered").length,
    learning: topics.filter((x) => x.status === "learning" || x.status === "practiced").length,
    revision: topics.filter((x) => x.status === "needs_revision").length,
    inPlan: inPlan.length,
    inPlanDone: inPlan.filter((x) => isDone(x.status)).length,
    continued: topics.filter((x) => x.bucket === "continued" && !isDone(x.status)).length,
    blocked: topics.filter((x) => x.locked).length,
  };

  // Current stage: the stage of the first planned topic that isn't done yet.
  const nextPlanned = topics.find((x) => x.bucket !== "continued" && !isDone(x.status));
  const currentDomain = nextPlanned ? tree.find((d) => d.id === nextPlanned.domainId) : undefined;

  const todayItems = (await getItemsBetween(user.id, today, today)).filter((i) => i.status !== "rescheduled");

  const ws = weekStart(today);
  const weekItems = (await getItemsBetween(user.id, ws, addDays(ws, 6))).filter((i) => i.status !== "rescheduled" || i.date < today);
  const weekPlanned = weekItems.reduce((n, i) => n + i.minutes, 0);
  const weekDone = weekItems.filter((i) => i.status === "done").reduce((n, i) => n + i.minutes, 0);

  // Pace over the last 7 days: completed vs. missed scheduled minutes.
  const past = await getItemsBetween(user.id, addDays(today, -7), addDays(today, -1));
  const pastDone = past.filter((i) => i.status === "done").reduce((n, i) => n + i.minutes, 0);
  const pastMissed = past.filter((i) => i.status === "rescheduled" || i.status === "planned").reduce((n, i) => n + i.minutes, 0);
  const pace = pastDone + pastMissed > 0 ? pastDone / (pastDone + pastMissed) : null;

  const streak = await getStreaks(user.id, user.timezone);
  const sessions = await getSessionsTotal(user.id);

  // Next recommended topic: today's first unfinished learning task, else the next planned unlocked topic.
  const firstLearn = todayItems.find((i) => i.kind === "learn" && i.status === "planned" && i.topicId);
  const next =
    (firstLearn && topics.find((x) => x.id === firstLearn.topicId && !isDone(x.status))) ||
    topics.find((x) => x.bucket !== "continued" && !isDone(x.status) && !x.locked) ||
    topics.find((x) => !isDone(x.status) && !x.locked);

  const projects = await db
    .select()
    .from(t.projects)
    .where(and(eq(t.projects.userId, user.id), ne(t.projects.status, "completed")))
    .orderBy(asc(t.projects.dueDate))
    .limit(4)
    .all();

  return {
    tree,
    topics,
    today,
    daysLeft: Math.max(0, daysBetween(today, DEADLINE)),
    counts,
    currentDomain,
    nextPlanned,
    todayItems,
    week: { planned: weekPlanned, done: weekDone },
    pace,
    streak,
    sessions,
    next,
    projects,
  };
}

/** Per-day summary for the runway strip and calendar. */
export async function getDaySummaries(user: SessionUser, from: string, to: string) {
  const items = await getItemsBetween(user.id, from, to);
  const today = todayIn(user.timezone);
  const map = new Map<string, { planned: number; done: number; missed: number; hasProject: boolean; hasAssessment: boolean; count: number }>();
  for (const i of items) {
    const s = map.get(i.date) ?? { planned: 0, done: 0, missed: 0, hasProject: false, hasAssessment: false, count: 0 };
    if (i.status === "done") s.done += i.minutes;
    else if (i.status === "rescheduled" || (i.status === "planned" && i.date < today)) s.missed += i.minutes;
    else s.planned += i.minutes;
    if (i.kind === "project") s.hasProject = true;
    if (i.kind === "assessment") s.hasAssessment = true;
    s.count++;
    map.set(i.date, s);
  }
  return map;
}

export function planStartDate(user: SessionUser) {
  return user.onboardedAt ? dateIn(user.onboardedAt, user.timezone) : todayIn(user.timezone);
}
