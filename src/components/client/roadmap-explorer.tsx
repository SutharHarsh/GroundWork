"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { setTopicStatus } from "@/local/actions/learning";
import { STATUS_STYLE, StatusDot, buttonClass, chipClass, cx, statusCode, type StatusCode } from "@/components/ui";
import { usePersistentState } from "@/lib/persistent";
import { formatMinutes } from "@/lib/dates";
import { useAction } from "./toast";

export interface RoadmapTopic {
  id: string;
  code: string;
  title: string;
  status: string;
  bucket: string;
  locked: boolean;
  est: number;
  search: string;
}
export interface RoadmapDomain {
  id: string;
  code: string;
  title: string;
  stage: string;
  stageNumber: number;
  isSpecialization: boolean;
  missingPrereqs: { code: string; title: string; pct: number }[];
  prereqs: { code: string; title: string; pct: number }[];
  inPlan: number;
  topics: RoadmapTopic[];
}

const FILTERS = [
  ["all", "All"],
  ["in", "In this plan"],
  ["active", "In progress"],
  ["stretch", "Stretch"],
  ["2027", "2027"],
] as const;
const LEGEND: StatusCode[] = ["M", "C", "P", "L", "R", "N", "S", "X"];

export function RoadmapExplorer({ pathTitle, domains, initialSel, totalConcepts }: { pathTitle: string; domains: RoadmapDomain[]; initialSel: string | null; totalConcepts: number }) {
  const [filter, setFilter] = usePersistentState<string>("roadmap.filter", "all");
  const [open, setOpen] = usePersistentState<string | null>("roadmap.openDomain", domains.find((d) => d.topics.some((t) => t.id === initialSel))?.id ?? null);
  const [q, setQ] = useState("");
  const [sel, setSel] = useState<string | null>(initialSel);
  const [pending, run] = useAction();

  const all = useMemo(() => domains.flatMap((d) => d.topics.map((t) => ({ ...t, domain: d }))), [domains]);
  const query = q.trim().toLowerCase();
  const match = (t: RoadmapTopic) => {
    const c = statusCode(t.status, t.bucket, t.locked);
    const okF =
      filter === "all" ||
      (filter === "in" && !["S", "X"].includes(c)) ||
      (filter === "stretch" && c === "S") ||
      (filter === "2027" && c === "X") ||
      (filter === "active" && ["L", "P", "R"].includes(c));
    return okF && (!query || t.search.includes(query));
  };
  const stages = [...new Map(domains.map((d) => [d.stage, d.stageNumber])).entries()];
  const selected = all.find((t) => t.id === sel) ?? null;
  const planned = all.filter((t) => !["S", "X"].includes(statusCode(t.status, t.bucket)));
  const doneCount = all.filter((t) => ["completed", "mastered", "needs_revision"].includes(t.status)).length;
  const matching = all.filter(match).length;

  return (
    <div className="grid items-start gap-10 xl:grid-cols-[minmax(0,1fr)_320px]">
      <div className="flex min-w-0 flex-col gap-8">
        <div className="flex flex-col gap-2.5">
          <span className="font-mono text-[12px] text-ink-3 uppercase">Roadmap · {pathTitle}</span>
          <h1 className="text-[clamp(44px,5vw,64px)] leading-none font-extrabold tracking-[-0.02em]">
            The whole syllabus, <em className="font-medium text-muted not-italic">one cell per topic.</em>
          </h1>
          <span className="text-[14px] text-ink-2">
            {all.length} topics and {totalConcepts} concepts across {domains.filter((d) => !d.isSpecialization).length} domains. {planned.length} in this plan, {doneCount} done.
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter topics">
            {FILTERS.map(([k, l]) => (
              <button key={k} type="button" aria-pressed={filter === k} onClick={() => setFilter(k)} className={chipClass(filter === k)}>
                {l}
              </button>
            ))}
          </div>
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            aria-label="Search topics"
            placeholder="Search topics and concepts…"
            className="h-9 w-[260px] max-w-full rounded-full border border-line-strong bg-transparent px-3.5 text-[14px] text-ink outline-none focus:border-accent-text"
          />
        </div>

        <ul className="flex flex-wrap gap-x-[18px] gap-y-2 text-[12px] text-ink-2" aria-label="Legend">
          {LEGEND.map((c) => (
            <li key={c} className="flex items-center gap-[7px]">
              <StatusDot code={c} size={12} />
              {STATUS_STYLE[c].label}
            </li>
          ))}
        </ul>
        <p className="sr-only" aria-live="polite">
          {matching} matching topics
        </p>

        {stages.map(([stage, n]) => {
          const list = domains.filter((d) => d.stage === stage);
          return (
            <section key={stage} aria-label={stage} className="grid gap-5 md:grid-cols-[96px_minmax(0,1fr)]">
              <div className="flex flex-col gap-1.5 self-start md:sticky md:top-6">
                <span className="numeral text-[80px] text-ink" aria-hidden="true">
                  {n === 99 ? "S" : String(n).padStart(2, "0")}
                </span>
                <span className="font-mono text-[10px] tracking-[0.06em] text-ink-3 uppercase">{stage.replace(/^Stage \d+: /, "")}</span>
              </div>
              <div className="flex flex-col border-t border-line">
                {list.map((d) => {
                  const isOpen = open === d.id || (!!query && d.topics.some(match));
                  const pd = d.topics.filter((t) => !["S", "X"].includes(statusCode(t.status, t.bucket)));
                  const pct = pd.length ? Math.round((pd.filter((t) => ["completed", "mastered", "needs_revision"].includes(t.status)).length / pd.length) * 100) : 0;
                  const locked = d.missingPrereqs.length > 0;
                  return (
                    <div key={d.id} id={d.id} className="scroll-mt-24 border-b border-line">
                      <button
                        type="button"
                        onClick={() => setOpen(open === d.id ? null : d.id)}
                        aria-expanded={isOpen}
                        className="grid w-full cursor-pointer grid-cols-[28px_minmax(0,1fr)_40px_16px] items-center gap-3.5 py-4 text-left sm:grid-cols-[34px_minmax(0,1fr)_auto_48px_20px]"
                      >
                        <span className="font-mono text-[12px] text-ink-3">{d.code.padStart(2, "0")}</span>
                        <span className="flex min-w-0 flex-col gap-[3px]">
                          <span className={cx("text-[16px]", locked ? "text-ink-3" : "text-ink")}>{d.title}</span>
                          <span className="text-[12px] text-ink-3">
                            {d.inPlan} in plan · {d.topics.length} topics
                          </span>
                          {locked && <span className="font-mono text-[11px] text-danger">⊘ Unlocks after Domain {d.missingPrereqs.map((m) => `${m.code} (${m.pct}%)`).join(", ")}</span>}
                        </span>
                        <span className="hidden max-w-[220px] flex-wrap justify-end gap-1 sm:flex" aria-hidden="true">
                          {d.topics.map((t) => (
                            <span key={t.id} title={`${t.title} · ${STATUS_STYLE[statusCode(t.status, t.bucket, t.locked)].label}`} className={cx("rounded-full transition-opacity", sel === t.id && "outline-2 outline-offset-2 outline-ink")} style={{ opacity: match(t) ? 1 : 0.18 }}>
                              <StatusDot code={statusCode(t.status, t.bucket, t.locked)} size={14} />
                            </span>
                          ))}
                        </span>
                        <span className="text-right font-mono text-[12px]">{pct}%</span>
                        <span className="text-center font-mono text-[16px] text-ink-3" aria-hidden="true">
                          {isOpen ? "▾" : "▸"}
                        </span>
                      </button>
                      {isOpen && (
                        <div className="flex flex-col pb-4 sm:pl-12">
                          {d.topics.filter(match).map((t) => {
                            const c = statusCode(t.status, t.bucket, t.locked);
                            return (
                              <button
                                key={t.id}
                                type="button"
                                onClick={() => setSel(t.id)}
                                aria-pressed={sel === t.id}
                                className={cx("grid cursor-pointer grid-cols-[14px_minmax(0,1fr)_auto] items-center gap-3.5 rounded-lg px-3 py-[9px] text-left transition-colors hover:bg-raised", sel === t.id && "bg-hover")}
                              >
                                <StatusDot code={c} size={12} />
                                <span className="text-[14px]">
                                  <span className="mr-2 font-mono text-[11px] text-ink-3">{t.code}</span>
                                  {t.title}
                                </span>
                                <span className="font-mono text-[11px]" style={{ color: STATUS_STYLE[c].fg }}>
                                  {STATUS_STYLE[c].label}
                                </span>
                              </button>
                            );
                          })}
                          {!d.topics.some(match) && <p className="px-3 py-2 text-[13px] text-ink-3">No topics in this domain match the filter.</p>}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      <aside className="flex flex-col gap-[22px] rounded-[20px] border border-line bg-panel p-6 xl:sticky xl:top-9" aria-label="Selected topic">
        <span className="label">Selected topic</span>
        {selected ? (
          <>
            <div className="flex flex-col gap-2">
              <Link href={`/roadmap/${selected.id}`} className="text-[34px] leading-[1.05] font-bold tracking-[-0.02em] hover:underline">
                {selected.title}
              </Link>
              <span className="text-[13px] text-ink-3">
                {selected.code} · Domain {selected.domain.code}: {selected.domain.title} · {formatMinutes(selected.est)}
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <StatusDot code={statusCode(selected.status, selected.bucket, selected.locked)} size={14} />
              <span className="text-[14px]" style={{ color: STATUS_STYLE[statusCode(selected.status, selected.bucket, selected.locked)].fg }}>
                {STATUS_STYLE[statusCode(selected.status, selected.bucket, selected.locked)].label}
              </span>
              <span className="text-[12px] text-ink-3">· {selected.bucket === "stretch" ? "Stretch goal" : selected.bucket === "continued" ? "Continued learning (2027)" : "In this plan"}</span>
            </div>
            {!selected.locked && selected.status !== "mastered" && (
              <div className="flex flex-col gap-2">
                <span className="label text-[10px]">Set status</span>
                <div className="flex flex-wrap gap-1.5">
                  {(
                    [
                      ["not_started", "Not started"],
                      ["learning", "Learning"],
                      ["practiced", "Practiced"],
                      ["completed", "Completed"],
                    ] as const
                  ).map(([s, l]) => (
                    <button
                      key={s}
                      type="button"
                      disabled={pending}
                      aria-pressed={selected.status === s}
                      onClick={() => run(() => setTopicStatus(selected.id, s))}
                      className={cx(chipClass(selected.status === s), "h-[30px] px-3 text-[12px]")}
                    >
                      {l}
                    </button>
                  ))}
                </div>
                <span className="text-[12px] text-ink-3">Mastered is earned through an assessment, not set by hand.</span>
              </div>
            )}
            {selected.domain.prereqs.length > 0 && (
              <div className="flex flex-col gap-2">
                <span className="label text-[10px]">Prerequisites</span>
                {selected.domain.prereqs.map((p) => (
                  <div key={p.code} className="flex justify-between gap-2.5 text-[13px]">
                    <span className="text-ink-2">
                      Domain {p.code}: {p.title}
                    </span>
                    <span className="font-mono">{p.pct}%</span>
                  </div>
                ))}
              </div>
            )}
            <Link href={`/roadmap/${selected.id}`} className={buttonClass("accent", "lg", "w-full")}>
              Open workspace ↗
            </Link>
          </>
        ) : (
          <p className="text-[14px] text-ink-3">Choose a topic to see its status, prerequisites and workspace.</p>
        )}
      </aside>
    </div>
  );
}
