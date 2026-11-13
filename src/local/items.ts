import { eq } from "drizzle-orm";
import { db, t } from "@/db";
import type { DomainView } from "./data";
import type { ScheduleItem } from "./stats";

export interface ItemView {
  id: string;
  date: string;
  kind: string;
  title: string;
  detail: string;
  minutes: number;
  status: string;
  origin: string;
  rescheduledFrom: string | null;
  href: string | null;
  topicId: string | null;
  projectId: string | null;
  topicStatus: string | null;
  locked: boolean;
  lockReason: string | null;
  context: string | null;
  reviewTopics: { id: string; title: string }[];
}

export async function enrichItems(items: ScheduleItem[], tree: DomainView[], userId: string): Promise<ItemView[]> {
  const topicIndex = new Map<string, { title: string; status: string; locked: boolean; domain: DomainView }>();
  for (const d of tree) for (const tp of d.topics) topicIndex.set(tp.id, { title: tp.title, status: tp.status, locked: tp.locked, domain: d });
  const projectTitles = new Map((await db.select({ id: t.projects.id, title: t.projects.title }).from(t.projects).where(eq(t.projects.userId, userId)).all()).map((p) => [p.id, p.title]));
  return items.map((i) => {
    const tp = i.topicId ? topicIndex.get(i.topicId) : undefined;
    const ids = JSON.parse(i.topicIds) as string[];
    return {
      id: i.id,
      date: i.date,
      kind: i.kind,
      title: i.kind === "project" ? (projectTitles.get(i.projectId ?? "") ?? i.title) : i.title,
      detail: i.detail,
      minutes: i.minutes,
      status: i.status,
      origin: i.origin,
      rescheduledFrom: i.rescheduledFrom,
      href: i.topicId ? `/roadmap/${i.topicId}` : i.projectId ? `/projects/${i.projectId}` : ids.length === 1 ? `/roadmap/${ids[0]}` : null,
      topicId: i.topicId,
      projectId: i.projectId,
      topicStatus: tp?.status ?? null,
      locked: !!tp?.locked,
      lockReason: tp?.locked ? `Locked until you complete half of ${tp.domain.missingPrereqs.map((m) => `Domain ${m.code}`).join(" and ")}` : null,
      context: tp ? `Domain ${tp.domain.code}: ${tp.domain.title}` : null,
      reviewTopics: ids.slice(0, 12).map((id) => ({ id, title: topicIndex.get(id)?.title ?? id })),
    };
  });
}
