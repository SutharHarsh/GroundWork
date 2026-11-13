"use client";
import { useSearchParams } from "next/navigation";
import { useLocal } from "@/local/hooks";
import type { SessionUser } from "@/local/auth";
import { PageLoading } from "@/components/client/local-provider";
import Link from "next/link";
import { and, asc, desc, eq } from "drizzle-orm";
import { db, t } from "@/db";
import { formatDate, todayIn, weekStart } from "@/lib/dates";
import { PROJECT_STATUSES, PROJECT_STATUS_LABEL, isDone, type ProjectStatus } from "@/lib/status";
import { Label, PageTitle, StatusDot, cx, statusCode } from "@/components/ui";
import { ProjectWork, StartProjectButton } from "@/components/client/project-work";
import { ProofForm, ProofQuickAttach } from "@/components/client/proof-form";
import { ProofList } from "@/components/client/proof-list";
import { StartSessionButton } from "@/components/client/start-session";
import { getPathTree } from "@/local/data";
import { MAX_UPLOAD_BYTES } from "@/local/files";

type Project = typeof t.projects.$inferSelect;

const PILL: Record<string, { bg: string; fg: string; bd: string }> = {
  completed: { bg: "var(--accent)", fg: "#000", bd: "transparent" },
  under_review: { bg: "var(--ink-2)", fg: "var(--on-ink)", bd: "transparent" },
  submitted: { bg: "var(--ink-2)", fg: "var(--on-ink)", bd: "transparent" },
  in_progress: { bg: "transparent", fg: "var(--accent-text)", bd: "var(--accent-text)" },
  planned: { bg: "transparent", fg: "var(--ink-2)", bd: "var(--line-strong)" },
};

function StatusPill({ status }: { status: string }) {
  const s = PILL[status] ?? PILL.planned;
  return (
    <span className="flex h-6 items-center rounded-full border px-2.5 text-[11px] whitespace-nowrap" style={{ background: s.bg, color: s.fg, borderColor: s.bd }}>
      {PROJECT_STATUS_LABEL[status as ProjectStatus]}
    </span>
  );
}

async function build(user: SessionUser, sp: { p?: string }) {
  const today = todayIn(user.timezone);
  const { p: selectedParam } = sp;
  const [all, tree] = await Promise.all([
    db.select().from(t.projects).where(eq(t.projects.userId, user.id)).orderBy(asc(t.projects.dueDate), asc(t.projects.sort)).all(),
    getPathTree(user.id, user.pathId),
  ]);
  const weeks = all.filter((p) => p.kind === "weekend").sort((a, b) => (a.weekStart ?? "").localeCompare(b.weekStart ?? ""));
  const caps = all.filter((p) => p.kind !== "weekend").sort((a, b) => a.sort - b.sort);
  const tag = (p: Project) => (p.kind === "weekend" ? `W${weeks.indexOf(p) + 1}` : p.kind === "final" ? "FINAL" : `S${p.sort + 1}`);
  const thisWeek = weeks.find((p) => p.weekStart === weekStart(today));
  const sel = all.find((p) => p.id === selectedParam) ?? thisWeek ?? weeks.find((p) => p.status !== "completed") ?? all[0];

  const topicMap = new Map(tree.flatMap((d) => d.topics.map((tp) => [tp.id, { ...tp, domainCode: d.code }])));
  const proofs = sel ? await db.select().from(t.proofs).where(and(eq(t.proofs.userId, user.id), eq(t.proofs.projectId, sel.id))).orderBy(desc(t.proofs.submittedAt)).all() : [];

  const row = (p: Project, big: boolean) => (
    <Link
      key={p.id}
      href={`/projects?p=${p.id}`}
      scroll={false}
      aria-current={sel?.id === p.id ? "true" : undefined}
      className={cx("grid grid-cols-[44px_minmax(0,1fr)_auto] items-center gap-3 border-b border-line-soft px-3 py-3.5 transition-colors hover:bg-raised", sel?.id === p.id && "bg-raised")}
    >
      <span className={big ? "text-[20px] font-extrabold" : "font-mono text-[10px] text-ink-3"}>{tag(p)}</span>
      <span className="flex min-w-0 flex-col gap-[3px]">
        <span className="text-[15px]">{p.title}</span>
        <span className="text-[12px] text-ink-3">
          {p.kind === "weekend" ? `Due ${formatDate(p.dueDate, { month: "short", day: "numeric" })} · ${p.level}` : `${p.level} · due ${formatDate(p.dueDate, { month: "short", day: "numeric" })}`}
          {p === thisWeek && <span className="ml-1.5 text-accent-text">THIS WEEKEND</span>}
          {p.status !== "completed" && p.dueDate < today && <span className="ml-1.5 text-danger">OVERDUE</span>}
        </span>
      </span>
      <StatusPill status={p.status} />
    </Link>
  );

  return (
    <div className="flex max-w-[1320px] flex-col gap-9">
      <PageTitle eyebrow="Projects · build, don't just learn" title="Every weekend," muted="something real." />
      <div className="grid items-start gap-10 min-[1340px]:grid-cols-[minmax(0,380px)_minmax(0,1fr)]">
        <div className="flex flex-col gap-7">
          <div className="flex flex-col">
            <Label className="border-b border-line pb-2.5">Weekend projects · harder each week</Label>
            {weeks.length ? weeks.map((p) => row(p, true)) : <p className="py-4 text-[14px] text-ink-3">Weekend projects appear as your plan runs.</p>}
          </div>
          <div className="flex flex-col">
            <Label className="border-b border-line pb-2.5">Capstones and final portfolio</Label>
            {caps.map((p) => row(p, false))}
          </div>
        </div>

        {sel && (
          <section aria-label={sel.title} className="flex flex-col gap-[30px] rounded-[24px] border border-line bg-panel p-6 sm:p-9 min-[1340px]:sticky min-[1340px]:top-9">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex min-w-0 flex-col gap-2.5">
                <span className="font-mono text-[12px] text-accent-text uppercase">
                  {tag(sel)} · due {formatDate(sel.dueDate, { month: "short", day: "numeric" })} · {sel.level}
                </span>
                <h2 className="text-[clamp(30px,4vw,46px)] leading-none font-extrabold tracking-[-0.03em] [overflow-wrap:anywhere]">{sel.title}</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {sel.status === "planned" && <StartProjectButton projectId={sel.id} />}
                {sel.status !== "completed" && <StartSessionButton projectId={sel.id} label="Start session" variant="outline" size="md" className="h-12" />}
              </div>
            </div>

            <div className="grid grid-cols-5 gap-1.5" aria-label={`Status: ${PROJECT_STATUS_LABEL[sel.status as ProjectStatus]}`}>
              {PROJECT_STATUSES.map((s, i) => {
                const pi = PROJECT_STATUSES.indexOf(sel.status as ProjectStatus);
                return (
                  <div key={s} className="flex flex-col gap-2">
                    <div className="h-1" style={{ background: i <= pi ? "var(--accent)" : "var(--line)" }} />
                    <span className="text-[12px]" style={{ color: i === pi ? "var(--ink)" : "var(--ink-3)" }}>
                      {PROJECT_STATUS_LABEL[s]}
                    </span>
                  </div>
                );
              })}
            </div>

            <p className="text-[22px] leading-[1.35] font-medium tracking-[-0.01em] text-pretty">{sel.problem}</p>
            <span className="font-mono text-[11px] text-ink-3">
              {sel.status === "planned" ? "UPDATES WITH YOUR PLAN UNTIL YOU START IT" : "FROZEN: STARTED PROJECTS DON'T CHANGE WHEN THE PLAN REBUILDS"}
            </span>

            {(JSON.parse(sel.topicIds) as string[]).length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {(JSON.parse(sel.topicIds) as string[]).slice(0, 14).map((id) => {
                  const tp = topicMap.get(id);
                  if (!tp) return null;
                  return (
                    <Link key={id} href={`/roadmap/${id}`} className="inline-flex h-7 items-center gap-2 rounded-full border border-line-strong px-3 text-[12px] text-ink-2 hover:text-ink">
                      <StatusDot code={statusCode(tp.status, tp.bucket, tp.locked)} size={8} />
                      {tp.title}
                    </Link>
                  );
                })}
              </div>
            )}

            <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-8">
              <div className="flex flex-col">
                <Label className="pb-2">Requirements</Label>
                {(JSON.parse(sel.requirements) as string[]).map((r, i) => (
                  <div key={i} className="grid grid-cols-[28px_minmax(0,1fr)] gap-2 border-b border-line-soft py-2.5 text-[14px] leading-[1.45]">
                    <span className="pt-0.5 font-mono text-[11px] text-ink-4">{String(i + 1).padStart(2, "0")}</span>
                    <span>{r}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <Label>Deliverables</Label>
                  {(JSON.parse(sel.deliverables) as string[]).map((d) => (
                    <span key={d} className="text-[14px]">
                      → {d}
                    </span>
                  ))}
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Evaluation</Label>
                  {(JSON.parse(sel.criteria) as string[]).map((c) => (
                    <span key={c} className="text-[14px] text-ink-2">
                      ◇ {c}
                    </span>
                  ))}
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Topics done</Label>
                  <span className="text-[14px] text-ink-2">
                    {(JSON.parse(sel.topicIds) as string[]).filter((id) => isDone(topicMap.get(id)?.status ?? "")).length} of {(JSON.parse(sel.topicIds) as string[]).length} related topics completed
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3.5 border-t border-line pt-6">
              <Label>Proof of work</Label>
              <ProofList compact proofs={proofs.map((p) => ({ ...p, topicTitle: p.topicId ? (topicMap.get(p.topicId)?.title ?? null) : null, projectTitle: null }))} />
              {sel.status !== "completed" && <ProofQuickAttach projectId={sel.id} />}
              {sel.status !== "completed" && (
                <details className="rounded-[14px] border border-line">
                  <summary className="px-4 py-3 text-[14px] text-ink-2 hover:text-ink">More evidence types: screenshots, files, written explanations</summary>
                  <div className="border-t border-line p-4">
                    <ProofForm
                      pathId={user.pathId}
                      fixedProject={{ id: sel.id, title: sel.title }}
                      topics={(JSON.parse(sel.topicIds) as string[]).map((id) => ({ id, label: topicMap.get(id)?.title ?? id }))}
                      uploadsEnabled={true}
                      maxMb={Math.round(MAX_UPLOAD_BYTES / 1024 / 1024)}
                    />
                  </div>
                </details>
              )}
            </div>

            <div className="flex flex-col gap-4 border-t border-line pt-6">
              <Label>Your submission</Label>
              <ProjectWork
                key={sel.id}
                projectId={sel.id}
                status={sel.status}
                criteria={JSON.parse(sel.criteria) as string[]}
                initial={{ deliverableText: sel.deliverableText, reflection: sel.reflection, skills: sel.skills, selfAssessment: JSON.parse(sel.selfAssessment) as Record<string, number> }}
                proofCount={proofs.length}
              />
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default function View() {
  const params = useSearchParams();
  const key = params.toString();
  const node = useLocal((user) => build(user, Object.fromEntries(params.entries())), [key]);
  return node ?? <PageLoading />;
}
