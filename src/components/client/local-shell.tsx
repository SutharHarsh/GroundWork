"use client";
import type { ReactNode } from "react";
import { eq } from "drizzle-orm";
import { db, t } from "@/db";
import { DEADLINE, daysBetween, todayIn } from "@/lib/dates";
import { useLocal } from "@/local/hooks";
import { getActiveTimer } from "@/local/data";
import { AppShell } from "./nav";
import { FullLoading } from "./local-provider";

/** Loads the sidebar's data (timer, topics for the command palette) from the local database. */
export function LocalShell({ children }: { children: ReactNode }) {
  const shell = useLocal(async (user) => {
    const [timer, topics] = await Promise.all([
      getActiveTimer(user.id),
      db.select({ id: t.topics.id, code: t.topics.code, title: t.topics.title }).from(t.topics).where(eq(t.topics.pathId, user.pathId)).orderBy(t.topics.sort).all(),
    ]);
    let timerLabel: string | null = null;
    if (timer?.topicId) timerLabel = topics.find((x) => x.id === timer.topicId)?.title ?? null;
    else if (timer?.projectId) timerLabel = db.select({ title: t.projects.title }).from(t.projects).where(eq(t.projects.id, timer.projectId)).get()?.title ?? null;
    const initials = user.name
      .split(" ")
      .map((p) => p[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
    return {
      user: { name: user.name, initials, pathLabel: user.pathId === "frontend" ? "Frontend path" : "Design path", daysLeft: Math.max(0, daysBetween(todayIn(user.timezone), DEADLINE)) },
      timer: timer ? { startedAt: timer.startedAt, label: timerLabel ?? "Learning session", topicId: timer.topicId, projectId: timer.projectId } : null,
      topics,
    };
  }, []);
  if (!shell) return <FullLoading />;
  return (
    <AppShell user={shell.user} timer={shell.timer} topics={shell.topics}>
      {children}
    </AppShell>
  );
}
