"use client";
import { useLocal } from "@/local/hooks";
import type { SessionUser } from "@/local/auth";
import { PageLoading } from "@/components/client/local-provider";
import { db, t } from "@/db";
import { RoadmapExplorer, type RoadmapDomain } from "@/components/client/roadmap-explorer";
import { renderSyllabusMarkdown } from "@/lib/markdown";
import { isDone } from "@/lib/status";
import { getPath, getPathTree } from "@/local/data";

async function build(user: SessionUser) {
  const [path, tree, subtopics] = await Promise.all([
    getPath(user.pathId),
    getPathTree(user.id, user.pathId),
    db.select({ topicId: t.subtopics.topicId, title: t.subtopics.title }).from(t.subtopics).all(),
  ]);
  const subIndex = new Map<string, string[]>();
  for (const s of subtopics) subIndex.set(s.topicId, [...(subIndex.get(s.topicId) ?? []), s.title]);
  const byId = new Map(tree.map((d) => [d.id, d]));
  const pct = (id: string) => {
    const d = byId.get(id);
    if (!d) return 0;
    const planned = d.topics.filter((x) => x.bucket !== "continued" || isDone(x.status));
    return planned.length ? Math.round((planned.filter((x) => isDone(x.status)).length / planned.length) * 100) : 0;
  };

  const domains: RoadmapDomain[] = tree.map((d) => ({
    id: d.id,
    code: d.code,
    title: d.title,
    stage: d.stage,
    stageNumber: d.stageNumber,
    isSpecialization: d.isSpecialization,
    missingPrereqs: d.missingPrereqs.map((m) => ({ code: m.code, title: m.title, pct: Math.round(m.ratio * 100) })),
    prereqs: d.prereqIds.map((id) => ({ code: byId.get(id)?.code ?? "", title: byId.get(id)?.title ?? "", pct: pct(id) })),
    inPlan: d.inPlan,
    topics: d.topics.map((tp) => ({
      id: tp.id,
      code: tp.code,
      title: tp.title,
      status: tp.status,
      bucket: tp.bucket,
      locked: tp.locked,
      est: tp.estMinutes,
      search: `${tp.code} ${tp.title} ${(subIndex.get(tp.id) ?? []).join(" ")}`.toLowerCase(),
    })),
  }));
  const all = tree.flatMap((d) => d.topics);
  const initialSel = all.find((x) => x.bucket !== "continued" && !isDone(x.status) && !x.locked)?.id ?? all[0]?.id ?? null;

  return (
    <div className="flex max-w-[1320px] flex-col gap-12">
      <RoadmapExplorer pathTitle={path.title} domains={domains} initialSel={initialSel} totalConcepts={all.reduce((n, x) => n + x.subtopicCount, 0)} />
      <details className="rounded-[20px] border border-line bg-panel">
        <summary className="flex items-center justify-between px-6 py-5">
          <span className="text-[18px] font-semibold tracking-[-0.01em]">About this profession and the learning sequence</span>
          <span className="label">From the syllabus</span>
        </summary>
        <div className="border-t border-line px-6 py-6">
          <div className="prose-gw" dangerouslySetInnerHTML={{ __html: renderSyllabusMarkdown(path.introMd) }} />
          <div className="prose-gw" dangerouslySetInnerHTML={{ __html: renderSyllabusMarkdown(path.sequenceMd) }} />
          <h2 className="mt-8 mb-2 text-[1.2rem] font-bold">Timeless knowledge vs. current tools</h2>
          <div className="prose-gw" dangerouslySetInnerHTML={{ __html: renderSyllabusMarkdown(path.timelessMd) }} />
        </div>
      </details>
    </div>
  );
}

export default function View() {
  const node = useLocal((user) => build(user), []);
  return node ?? <PageLoading />;
}
