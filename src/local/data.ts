import { uid } from "@/lib/uid";
import { and, desc, eq, isNull } from "drizzle-orm";
import { db, t } from "@/db";
import { addDays, dateIn, todayIn } from "@/lib/dates";
import { isDone, type DisplayStatus, type TopicStatus } from "@/lib/status";
import type { SessionUser } from "./auth";

export type Topic = typeof t.topics.$inferSelect;
export type Domain = typeof t.domains.$inferSelect;
export type ParentTopic = typeof t.parentTopics.$inferSelect;
export type Progress = typeof t.topicProgress.$inferSelect;

export interface TopicView extends Topic {
  status: TopicStatus;
  display: DisplayStatus;
  bucket: string;
  minutesSpent: number;
  subtopicCount: number;
  subtopicsDone: number;
  locked: boolean;
}

export interface DomainView extends Domain {
  prereqIds: string[];
  missingPrereqs: { id: string; code: string; title: string; ratio: number }[];
  parents: (ParentTopic & { topics: TopicView[] })[];
  topics: TopicView[];
  done: number;
  mastered: number;
  inPlan: number;
}

/** Fraction of a prerequisite domain's planned topics that must be completed to unlock a dependent domain. */
export const UNLOCK_RATIO = 0.5;

/** Loads the whole syllabus tree for the user's path with progress and prerequisite locks. Memoized per request. */
export const getPathTree = (async (userId: string, pathId: string): Promise<DomainView[]> => {
  const [domains, parents, topics, prereqs, progressRows, subRows, doneRows] = await Promise.all([
    db.select().from(t.domains).where(eq(t.domains.pathId, pathId)).orderBy(t.domains.sort).all(),
    db.select().from(t.parentTopics).all(),
    db.select().from(t.topics).where(eq(t.topics.pathId, pathId)).orderBy(t.topics.sort).all(),
    db.select().from(t.domainPrereqs).all(),
    db.select().from(t.topicProgress).where(eq(t.topicProgress.userId, userId)).all(),
    db.select({ topicId: t.subtopics.topicId }).from(t.subtopics).all(),
    db
      .select({ id: t.subtopicProgress.subtopicId })
      .from(t.subtopicProgress)
      .where(and(eq(t.subtopicProgress.userId, userId), eq(t.subtopicProgress.done, true)))
      .all(),
  ]);
  const progress = new Map(progressRows.map((p) => [p.topicId, p]));
  const subCounts = new Map<string, number>();
  for (const s of subRows) subCounts.set(s.topicId, (subCounts.get(s.topicId) ?? 0) + 1);
  const subDone = new Map<string, number>();
  for (const r of doneRows) {
    const topicId = r.id.replace(/-s\d+$/, "");
    subDone.set(topicId, (subDone.get(topicId) ?? 0) + 1);
  }

  // Domain completion ratios among planned topics (used for prerequisite locking).
  const ratio = new Map<string, number>();
  for (const d of domains) {
    const dt = topics.filter((tp) => tp.domainId === d.id);
    const planned = dt.filter((tp) => (progress.get(tp.id)?.planBucket ?? "continued") !== "continued" || isDone(progress.get(tp.id)?.status ?? ""));
    const base = planned.length ? planned : dt.filter((tp) => tp.tier === "essential");
    if (!base.length) ratio.set(d.id, 1);
    else ratio.set(d.id, base.filter((tp) => isDone(progress.get(tp.id)?.status ?? "")).length / base.length);
  }

  return domains.map((d) => {
    const prereqIds = prereqs.filter((p) => p.domainId === d.id).map((p) => p.prereqDomainId);
    const missingPrereqs = prereqIds
      .map((id) => domains.find((x) => x.id === id))
      .filter((x): x is Domain => !!x && (ratio.get(x.id) ?? 0) < UNLOCK_RATIO)
      .map((x) => ({ id: x.id, code: x.code, title: x.title, ratio: ratio.get(x.id) ?? 0 }));
    const locked = missingPrereqs.length > 0;
    const views: TopicView[] = topics
      .filter((tp) => tp.domainId === d.id)
      .map((tp) => {
        const p = progress.get(tp.id);
        const status = (p?.status ?? "not_started") as TopicStatus;
        const topicLocked = locked && status === "not_started";
        return {
          ...tp,
          status,
          display: topicLocked ? "blocked" : status,
          bucket: p?.planBucket ?? "continued",
          minutesSpent: p?.minutesSpent ?? 0,
          subtopicCount: subCounts.get(tp.id) ?? 0,
          subtopicsDone: subDone.get(tp.id) ?? 0,
          locked: topicLocked,
        };
      });
    return {
      ...d,
      prereqIds,
      missingPrereqs,
      parents: parents
        .filter((p) => p.domainId === d.id)
        .sort((a, b) => a.sort - b.sort)
        .map((p) => ({ ...p, topics: views.filter((v) => v.parentId === p.id) })),
      topics: views,
      done: views.filter((v) => isDone(v.status)).length,
      mastered: views.filter((v) => v.status === "mastered").length,
      inPlan: views.filter((v) => v.bucket !== "continued" || isDone(v.status)).length,
    };
  });
});

export const getPath = (async (pathId: string) => {
  return (await db.select().from(t.paths).where(eq(t.paths.id, pathId)).get())!;
});

/** Writes an activity record. Only meaningful learning events count towards streaks. */
export async function recordActivity(
  user: Pick<SessionUser, "id" | "timezone">,
  a: { type: string; label: string; refId?: string | null; minutes?: number; countsForStreak: boolean },
) {
  await db
    .insert(t.activities)
    .values({
      id: uid(),
      userId: user.id,
      date: todayIn(user.timezone),
      type: a.type,
      refId: a.refId ?? null,
      label: a.label,
      minutes: a.minutes ?? 0,
      countsForStreak: a.countsForStreak,
      createdAt: Date.now(),
    })
    .run();
}

export interface StreakStats {
  current: number;
  longest: number;
  activeDays: number;
  byDate: Map<string, { minutes: number; events: number }>;
}

export const getStreaks = (async (userId: string, timezone: string): Promise<StreakStats> => {
  const rows = await db.select().from(t.activities).where(eq(t.activities.userId, userId)).all();
  const byDate = new Map<string, { minutes: number; events: number }>();
  for (const r of rows) {
    if (!r.countsForStreak) continue;
    const cur = byDate.get(r.date) ?? { minutes: 0, events: 0 };
    cur.minutes += r.minutes;
    cur.events += 1;
    byDate.set(r.date, cur);
  }
  const dates = [...byDate.keys()].sort();
  let longest = 0;
  let run = 0;
  let prev = "";
  for (const d of dates) {
    run = prev && addDays(prev, 1) === d ? run + 1 : 1;
    longest = Math.max(longest, run);
    prev = d;
  }
  const today = todayIn(timezone);
  let cursor = byDate.has(today) ? today : addDays(today, -1);
  let current = 0;
  while (byDate.has(cursor)) {
    current++;
    cursor = addDays(cursor, -1);
  }
  return { current, longest, activeDays: dates.length, byDate };
});

export async function getRecentActivity(userId: string, limit = 8) {
  return db.select().from(t.activities).where(eq(t.activities.userId, userId)).orderBy(desc(t.activities.createdAt)).limit(limit).all();
}

export async function getSessionsTotal(userId: string) {
  const rows = await db
    .select({ minutes: t.learningSessions.minutes, endedAt: t.learningSessions.endedAt })
    .from(t.learningSessions)
    .where(eq(t.learningSessions.userId, userId))
    .all();
  const finished = rows.filter((r) => r.endedAt);
  return { count: finished.length, minutes: finished.reduce((n, r) => n + r.minutes, 0) };
}

export async function getActiveTimer(userId: string) {
  return db
    .select()
    .from(t.learningSessions)
    .where(and(eq(t.learningSessions.userId, userId), isNull(t.learningSessions.endedAt)))
    .get();
}

export function dateOfTs(ts: number, tz: string) {
  return dateIn(ts, tz);
}
