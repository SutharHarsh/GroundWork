import { and, eq } from "drizzle-orm";
import { db, t } from "@/db";
import type { SessionUser } from "./auth";
import { commit } from "./store";

export class ActionError extends Error {}

/** Ensures a topic exists and belongs to the user's learning path (server-side authorization). */
export async function ownTopic(user: SessionUser, topicId: string) {
  const topic = await db.select().from(t.topics).where(eq(t.topics.id, topicId)).get();
  if (!topic || topic.pathId !== user.pathId) throw new ActionError("That topic isn't part of your learning path.");
  return topic;
}

export async function ownProject(user: SessionUser, projectId: string) {
  const project = await db.select().from(t.projects).where(and(eq(t.projects.id, projectId), eq(t.projects.userId, user.id))).get();
  if (!project) throw new ActionError("That project doesn't exist.");
  return project;
}

export async function ownProof(user: SessionUser, proofId: string) {
  const proof = await db.select().from(t.proofs).where(and(eq(t.proofs.id, proofId), eq(t.proofs.userId, user.id))).get();
  if (!proof) throw new ActionError("That proof of work entry doesn't exist.");
  return proof;
}

export async function ownItem(user: SessionUser, itemId: string) {
  const item = await db.select().from(t.scheduleItems).where(and(eq(t.scheduleItems.id, itemId), eq(t.scheduleItems.userId, user.id))).get();
  if (!item) throw new ActionError("That task doesn't exist.");
  return item;
}

export async function ensureProgress(userId: string, topicId: string) {
  const row = await db.select().from(t.topicProgress).where(and(eq(t.topicProgress.userId, userId), eq(t.topicProgress.topicId, topicId))).get();
  if (row) return row;
  await db.insert(t.topicProgress).values({ userId, topicId, updatedAt: Date.now() }).onConflictDoNothing().run();
  return (await db.select().from(t.topicProgress).where(and(eq(t.topicProgress.userId, userId), eq(t.topicProgress.topicId, topicId))).get())!;
}

export type ActionResult = { ok: true; message?: string } | { ok: false; error: string };

export async function run(fn: () => Promise<string | void> | string | void): Promise<ActionResult> {
  try {
    const message = await fn();
    commit();
    return { ok: true, message: message ?? undefined };
  } catch (e) {
    if (e instanceof ActionError) return { ok: false, error: e.message };
    // Let Next.js redirects/notFound propagate
    if (e && typeof e === "object" && "digest" in e) throw e;
    console.error(e);
    return { ok: false, error: "Something went wrong saving that. Try again." };
  }
}
