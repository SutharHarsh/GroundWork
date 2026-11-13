"use client";
import { useParams } from "next/navigation";
import { useLocal } from "@/local/hooks";
import type { SessionUser } from "@/local/auth";
import { NotFoundNote, PageLoading } from "@/components/client/local-provider";
import Link from "next/link";
import { and, desc, eq, inArray } from "drizzle-orm";
import { db, t } from "@/db";
import { dateIn, formatDate, formatMinutes } from "@/lib/dates";
import { MASTERY_CRITERIA, RATING_LABELS } from "@/lib/mastery";
import { PROJECT_STATUS_LABEL, type ProjectStatus } from "@/lib/status";
import { exercisesFor, objectivesFor, rankResources } from "@/lib/topic-content";
import { Label, STATUS_STYLE, StatusDot, cx, statusCode } from "@/components/ui";
import { ConceptChecklist } from "@/components/client/concept-checklist";
import { MasteryForm } from "@/components/client/mastery-form";
import { NotesEditor } from "@/components/client/notes-editor";
import { LogTimeForm } from "@/components/client/planner-forms";
import { ProofForm, ProofQuickAttach } from "@/components/client/proof-form";
import { ProofList } from "@/components/client/proof-list";
import { StartSessionButton } from "@/components/client/start-session";
import { TopicActions } from "@/components/client/topic-actions";
import { getPathTree } from "@/local/data";
import { MAX_UPLOAD_BYTES } from "@/local/files";

async function build(user: SessionUser, sp: { topicId: string }) {
  const { topicId } = sp;
  const tree = await getPathTree(user.id, user.pathId);
  const domain = tree.find((d) => d.topics.some((x) => x.id === topicId));
  if (!domain) return <NotFoundNote />; // also hides other learners' paths
  const topic = domain.topics.find((x) => x.id === topicId)!;
  const parent = domain.parents.find((p) => p.id === topic.parentId)!;
  const allTopics = tree.flatMap((d) => d.topics);
  const idx = allTopics.findIndex((x) => x.id === topicId);
  const prev = allTopics[idx - 1];
  const next = allTopics[idx + 1];

  const subtopics = await db.select().from(t.subtopics).where(eq(t.subtopics.topicId, topicId)).orderBy(t.subtopics.sort).all();
  const [doneRows, progress, domainResources, projectsAll, myProofs, assessments, sessions] = await Promise.all([
    db
      .select({ id: t.subtopicProgress.subtopicId })
      .from(t.subtopicProgress)
      .where(and(eq(t.subtopicProgress.userId, user.id), eq(t.subtopicProgress.done, true), inArray(t.subtopicProgress.subtopicId, subtopics.map((s) => s.id).concat("_"))))
      .all(),
    db.select().from(t.topicProgress).where(and(eq(t.topicProgress.userId, user.id), eq(t.topicProgress.topicId, topicId))).get(),
    db.select().from(t.resources).where(and(eq(t.resources.pathId, user.pathId), eq(t.resources.domainId, domain.id))).all(),
    db.select().from(t.projects).where(eq(t.projects.userId, user.id)).all(),
    db.select().from(t.proofs).where(eq(t.proofs.userId, user.id)).orderBy(desc(t.proofs.submittedAt)).all(),
    db
      .select()
      .from(t.masteryAssessments)
      .where(and(eq(t.masteryAssessments.userId, user.id), eq(t.masteryAssessments.topicId, topicId)))
      .orderBy(desc(t.masteryAssessments.createdAt))
      .all(),
    db
      .select()
      .from(t.learningSessions)
      .where(and(eq(t.learningSessions.userId, user.id), eq(t.learningSessions.topicId, topicId)))
      .orderBy(desc(t.learningSessions.startedAt))
      .all(),
  ]);
  const subDone = new Set(doneRows.map((r) => r.id));
  const subs = subtopics.map((s) => ({ id: s.id, title: s.title, concepts: JSON.parse(s.concepts) as string[], done: subDone.has(s.id) }));
  const objectives = objectivesFor(user.pathId, topic.title, subs);
  const exercises = exercisesFor(user.pathId, topic.title, subs);
  const ranked = rankResources(`${topic.title} ${parent.title} ${subtopics.map((s) => `${s.title} ${s.concepts}`).join(" ")}`, domainResources);
  const projects = projectsAll.filter((p) => (JSON.parse(p.topicIds) as string[]).includes(topicId));
  const topicProofs = myProofs.filter((p) => p.topicId === topicId);
  const finishedSessions = sessions.filter((s) => s.endedAt);
  const code = statusCode(topic.status, topic.bucket, topic.locked);
  const criteria = MASTERY_CRITERIA[user.pathId];
  const byId = new Map(tree.map((d) => [d.id, d]));

  return (
    <div className="grid max-w-[1400px] items-start gap-10 min-[1100px]:grid-cols-[220px_minmax(0,1fr)_300px]">
      <nav aria-label="Topics in this domain" className="hidden flex-col gap-1 min-[1100px]:sticky min-[1100px]:top-9 min-[1100px]:flex">
        <Link href={`/roadmap#${domain.id}`} className="label px-2.5 pb-2.5 hover:text-ink">
          Domain {domain.code} · {domain.title}
        </Link>
        {domain.topics.map((s) => (
          <Link
            key={s.id}
            href={`/roadmap/${s.id}`}
            aria-current={s.id === topicId ? "page" : undefined}
            className={cx("grid grid-cols-[12px_minmax(0,1fr)] items-center gap-2.5 rounded-lg px-2.5 py-2 transition-colors hover:bg-raised", s.id === topicId && "bg-hover")}
          >
            <StatusDot code={statusCode(s.status, s.bucket, s.locked)} size={10} />
            <span className={cx("text-[13px] leading-[1.3]", s.id === topicId ? "text-ink" : "text-ink-2")}>{s.title}</span>
          </Link>
        ))}
      </nav>

      <article className="flex min-w-0 flex-col gap-11">
        <div className="flex flex-col gap-3.5">
          <span className="font-mono text-[12px] text-ink-3 uppercase">
            <Link href="/roadmap" className="hover:text-ink">
              Roadmap
            </Link>{" "}
            · Domain {domain.code} · {domain.title} · {topic.code}
          </span>
          <h1 className="text-[clamp(44px,5.5vw,76px)] leading-[0.95] font-extrabold tracking-[-0.03em] text-pretty">{topic.title}</h1>
          <div className="flex flex-wrap items-center gap-2.5 text-[14px]">
            <StatusDot code={code} size={14} />
            <span style={{ color: STATUS_STYLE[code].fg }}>{STATUS_STYLE[code].label}</span>
            <span className="text-ink-3">· {topic.bucket === "stretch" ? "Stretch goal" : topic.bucket === "continued" ? "Continued learning (2027)" : "In this plan"}</span>
            <span className="text-ink-3">· Part of {parent.title}</span>
          </div>
          {domain.whyText && <p className="max-w-[70ch] text-[15px] leading-relaxed text-ink-2">{domain.whyText.split("\n\n")[0]}</p>}
          {topic.locked && (
            <p className="font-mono text-[12px] text-danger">
              ⊘ BLOCKED: COMPLETE HALF OF THE PLANNED TOPICS IN {domain.missingPrereqs.map((m) => `DOMAIN ${m.code} (${Math.round(m.ratio * 100)}%)`).join(" AND ")} FIRST.
            </p>
          )}
        </div>

        <section aria-labelledby="obj" className="flex flex-col gap-3.5">
          <h2 id="obj" className="label">
            Learning objectives
          </h2>
          {objectives.map((o) => (
            <p key={o} className="text-[22px] leading-[1.35] font-medium tracking-[-0.01em] text-pretty">
              {o}
            </p>
          ))}
        </section>

        <section className="flex flex-col">
          {subs.length ? <ConceptChecklist subtopics={subs} disabled={topic.locked} /> : <p className="text-[14px] text-ink-3">This topic has no listed subtopics.</p>}
          {!topic.locked && <TopicActions topicId={topic.id} status={topic.status} conceptsDone={subs.filter((s) => s.done).length} conceptsTotal={subs.length} />}
        </section>

        <section aria-labelledby="practice" className="flex flex-col gap-3.5">
          <h2 id="practice" className="label">
            Practice
          </h2>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-px border border-line bg-line">
            {exercises.map((x, i) => (
              <div key={x.title} className="flex flex-col gap-2.5 bg-bg p-5">
                <span className="flex justify-between font-mono text-[11px] text-accent-text uppercase">
                  <span>{x.title}</span>
                  <span className="text-ink-4">{String(i + 1).padStart(2, "0")}</span>
                </span>
                <span className="text-[15px] leading-normal">{x.body}</span>
              </div>
            ))}
          </div>
        </section>

        <section aria-labelledby="notes" className="flex flex-col gap-3">
          <h2 id="notes" className="label">
            Notes
          </h2>
          <NotesEditor topicId={topic.id} initial={progress?.notes ?? ""} />
        </section>

        <section id="proof" aria-labelledby="proof-title" className="flex scroll-mt-8 flex-col gap-3.5">
          <h2 id="proof-title" className="label">
            Proof of work
          </h2>
          <ProofList
            compact
            proofs={topicProofs.map((p) => ({ ...p, topicTitle: null, projectTitle: projectsAll.find((x) => x.id === p.projectId)?.title ?? null }))}
          />
          <ProofQuickAttach topicId={topic.id} topicTitle={topic.title} />
          <details className="rounded-[14px] border border-line">
            <summary className="px-4 py-3 text-[14px] text-ink-2 hover:text-ink">More evidence types: screenshots, files, written explanations</summary>
            <div className="border-t border-line p-4">
              <ProofForm
                pathId={user.pathId}
                fixedTopic={{ id: topic.id, label: topic.title }}
                projects={projectsAll.map((p) => ({ id: p.id, title: p.title }))}
                uploadsEnabled={true}
                maxMb={Math.round(MAX_UPLOAD_BYTES / 1024 / 1024)}
              />
            </div>
          </details>
        </section>

        <div id="mastery" className="scroll-mt-8">
          <MasteryForm topicId={topic.id} criteria={criteria} status={topic.status} proofs={myProofs.map((p) => ({ id: p.id, title: p.title, type: p.type, linked: p.topicId === topic.id }))} />
          {assessments.length > 0 && (
            <div className="mt-6 flex flex-col">
              <Label className="pb-2">Assessment history</Label>
              {assessments.map((a) => {
                const r = JSON.parse(a.ratings) as Record<string, number>;
                return (
                  <div key={a.id} className="border-b border-line-soft py-3 text-[14px]">
                    <div className="flex justify-between gap-3">
                      <span className={a.passed ? "text-accent-text" : "text-danger"}>{a.passed ? "Mastered" : "Not yet"}</span>
                      <span className="font-mono text-[11px] text-ink-3">{formatDate(dateIn(a.createdAt, user.timezone)).toUpperCase()}</span>
                    </div>
                    <p className="mt-1 text-[12px] text-ink-3">{criteria.map((c) => `${c.label}: ${RATING_LABELS[r[c.key] ?? 0] || "—"}`).join(" · ")}</p>
                    <p className="mt-1.5 whitespace-pre-wrap text-ink-2">{a.explanation}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <nav aria-label="Adjacent topics" className="grid grid-cols-2 border-t border-line">
          {prev ? (
            <Link href={`/roadmap/${prev.id}`} className="flex flex-col gap-1 py-[18px]">
              <span className="font-mono text-[11px] text-ink-3">← PREVIOUS</span>
              <span className="text-[15px]">{prev.title}</span>
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link href={`/roadmap/${next.id}`} className="flex flex-col items-end gap-1 py-[18px] text-right">
              <span className="font-mono text-[11px] text-ink-3">NEXT →</span>
              <span className="text-[15px]">{next.title}</span>
            </Link>
          )}
        </nav>
      </article>

      <aside className="flex flex-col gap-[26px] min-[1100px]:sticky min-[1100px]:top-9" aria-label="Topic context">
        {!topic.locked && <StartSessionButton topicId={topic.id} label="Start timed session" size="lg" className="w-full" />}
        <div className="grid grid-cols-2 border-y border-line">
          <div className="flex flex-col gap-1 border-r border-line py-3.5">
            <span className="label text-[10px]">Time logged</span>
            <span className="text-[24px] font-semibold">{formatMinutes(progress?.minutesSpent ?? 0)}</span>
          </div>
          <div className="flex flex-col gap-1 py-3.5 pl-3.5">
            <span className="label text-[10px]">Estimate</span>
            <span className="text-[24px] font-semibold">{formatMinutes(topic.estMinutes)}</span>
          </div>
        </div>
        {finishedSessions.length > 0 && (
          <div className="flex flex-col gap-1.5">
            <Label className="text-[10px]">Sessions</Label>
            {finishedSessions.slice(0, 5).map((s) => (
              <div key={s.id} className="flex justify-between text-[13px]">
                <span className="text-ink-2">{formatDate(dateIn(s.startedAt, user.timezone))}</span>
                <span className="tnum font-mono">{formatMinutes(s.minutes)}</span>
              </div>
            ))}
          </div>
        )}
        {domain.prereqIds.length > 0 && (
          <div className="flex flex-col gap-2.5">
            <Label className="text-[10px]">Prerequisites</Label>
            {domain.prereqIds.map((id) => {
              const pd = byId.get(id);
              if (!pd) return null;
              const planned = pd.topics.filter((x) => x.bucket !== "continued" || ["completed", "mastered", "needs_revision"].includes(x.status));
              const pct = planned.length ? Math.round((planned.filter((x) => ["completed", "mastered", "needs_revision"].includes(x.status)).length / planned.length) * 100) : 0;
              return (
                <Link key={id} href={`/roadmap#${id}`} className="flex justify-between gap-2.5 text-[13px] hover:underline">
                  <span className="text-ink-2">
                    Domain {pd.code}: {pd.title}
                  </span>
                  <span className="font-mono">{pct}%</span>
                </Link>
              );
            })}
          </div>
        )}
        <div className="flex flex-col gap-1">
          <Label className="pb-1.5 text-[10px]">Resources · ranked</Label>
          {ranked.slice(0, 6).map((r) => (
            <a key={r.id} href={r.url} target="_blank" rel="noopener noreferrer" className="flex flex-col gap-[3px] border-b border-line-soft py-2.5 hover:underline">
              <span className="text-[14px] leading-[1.35]">{r.name} ↗</span>
              <span className="text-[12px] text-ink-3">
                {[r.creator, r.category].filter(Boolean).join(" · ")}
              </span>
            </a>
          ))}
          {!ranked.length && <span className="text-[13px] text-ink-3">No linked resources for this domain yet.</span>}
          {ranked.length > 6 && (
            <Link href={`/resources?domain=${domain.id}`} className="pt-2 font-mono text-[11px] text-accent-text hover:underline">
              ALL {ranked.length} FOR DOMAIN {domain.code} →
            </Link>
          )}
        </div>
        {projects.length > 0 && (
          <div className="flex flex-col gap-2">
            <Label className="text-[10px]">Related projects</Label>
            {projects.map((p) => (
              <Link key={p.id} href={`/projects?p=${p.id}`} className="flex flex-col text-[13px] hover:underline">
                <span>{p.title}</span>
                <span className="text-[12px] text-ink-3">
                  {PROJECT_STATUS_LABEL[p.status as ProjectStatus]} · due {formatDate(p.dueDate)}
                </span>
              </Link>
            ))}
          </div>
        )}
        <details className="rounded-[14px] border border-line">
          <summary className="px-4 py-3 text-[13px] text-ink-2 hover:text-ink">Log time without a timer</summary>
          <div className="border-t border-line p-4">
            <LogTimeForm fixedTopicId={topic.id} />
          </div>
        </details>
      </aside>
    </div>
  );
}

export default function TopicView() {
  const { topicId } = useParams<{ topicId: string }>();
  const node = useLocal((user) => build(user, { topicId }), [topicId]);
  return node ?? <PageLoading />;
}
