"use client";
import { useRef, useState, type ReactNode } from "react";
import { cx } from "@/components/ui";

/* Charts in the design's language: ink + saffron, dots and thin bars, hover/focus tooltips, data tables. */

type Tip = { x: number; y: number; value: string; label: string } | null;

/** Hosts a single tooltip for any descendant carrying data-tip-value / data-tip-label. */
export function TipHost({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [tip, setTip] = useState<Tip>(null);
  const show = (el: Element | null) => {
    const target = el?.closest<HTMLElement>("[data-tip-value]");
    const host = ref.current;
    if (!target || !host) return setTip(null);
    const r = target.getBoundingClientRect();
    const h = host.getBoundingClientRect();
    setTip({ x: r.left - h.left + r.width / 2, y: r.top - h.top, value: target.dataset.tipValue ?? "", label: target.dataset.tipLabel ?? "" });
  };
  return (
    <div ref={ref} className={cx("relative", className)} onPointerOver={(e) => show(e.target as Element)} onPointerLeave={() => setTip(null)} onFocus={(e) => show(e.target as Element)} onBlur={() => setTip(null)}>
      {children}
      {tip && (
        <div role="tooltip" className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-full rounded-xl bg-ink px-3 py-2 text-left whitespace-nowrap text-on-ink shadow-[0_8px_24px_rgba(0,0,0,.25)]" style={{ left: Math.max(70, tip.x), top: tip.y - 8 }}>
          <div className="tnum text-[13px] font-semibold">{tip.value}</div>
          <div className="font-mono text-[10px] uppercase opacity-70">{tip.label}</div>
        </div>
      )}
    </div>
  );
}

export function DataTable({ caption, head, rows }: { caption: string; head: string[]; rows: (string | number)[][] }) {
  return (
    <details className="text-sm">
      <summary className="font-mono text-[11px] text-ink-3 hover:text-ink">SHOW DATA TABLE</summary>
      <div className="mt-2 max-h-72 overflow-auto rounded-xl border border-line">
        <table className="w-full text-[13px]">
          <caption className="sr-only">{caption}</caption>
          <thead className="sticky top-0 bg-panel text-left text-ink-2">
            <tr>
              {head.map((h) => (
                <th key={h} scope="col" className="px-3 py-1.5 font-medium">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="tnum divide-y divide-line">
            {rows.map((r, i) => (
              <tr key={i}>
                {r.map((c, j) => (
                  <td key={j} className="px-3 py-1.5 text-ink-2">
                    {c}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  );
}

/* ── Activity heatmap (dots, ink ramp) ─────────────────────────────────── */

export interface HeatCell {
  date: string;
  label: string;
  minutes: number;
  events: number;
  level: 0 | 1 | 2 | 3 | 4;
  state: "before" | "active" | "future";
}
const HEAT = ["var(--track)", "var(--line-strong)", "var(--ink-3)", "var(--ink-2)", "var(--ink)"];

export function HeatDots({ weeks }: { weeks: HeatCell[][] }) {
  return (
    <TipHost>
      <div className="flex gap-1" role="grid" aria-label="Daily learning activity, last 12 weeks">
        {weeks.map((w, wi) => (
          <div key={wi} role="row" className="flex max-w-6 flex-1 flex-col gap-1">
            {w.map((c) => (
              <span
                key={c.date}
                role="gridcell"
                tabIndex={c.state === "future" ? -1 : 0}
                aria-label={`${c.label}: ${c.state === "future" ? "upcoming" : c.state === "before" ? "before your plan" : c.events ? `${c.minutes} minutes` : "no activity"}`}
                data-tip-value={c.state === "future" ? "Upcoming" : c.state === "before" ? "Before your plan" : c.events ? `${c.minutes} min` : "No activity"}
                data-tip-label={c.label}
                className="box-border aspect-square rounded-full"
                style={
                  c.state === "future"
                    ? { border: "1px solid var(--line)" }
                    : c.state === "before"
                      ? { background: "var(--panel)", border: "1px solid var(--panel)" }
                      : { background: HEAT[c.level], border: `1px solid ${HEAT[c.level]}` }
                }
              />
            ))}
          </div>
        ))}
      </div>
    </TipHost>
  );
}

export function HeatLegend() {
  return (
    <div className="flex items-center gap-1.5 text-[12px] text-ink-3">
      Less
      {HEAT.map((c) => (
        <span key={c} className="size-3 rounded-full" style={{ background: c }} />
      ))}
      More
    </div>
  );
}

/* ── Completed vs planned pace ─────────────────────────────────────────── */

export function PaceChart({ points, target }: { points: { label: string; actual: number | null; plan: number }[]; target: number }) {
  const [hover, setHover] = useState<number | null>(null);
  const W = 600;
  const H = 210;
  const top = Math.max(target, 1, ...points.map((p) => p.actual ?? 0));
  const x = (i: number) => (points.length <= 1 ? 0 : (i / (points.length - 1)) * W);
  const y = (v: number) => 200 - (v / top) * 190;
  const actual = points.map((p, i) => (p.actual == null ? null : `${x(i)},${y(p.actual)}`)).filter(Boolean).join(" ");
  const lastIdx = points.reduce((n, p, i) => (p.actual != null ? i : n), -1);
  const hv = hover != null ? points[hover] : null;
  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full overflow-visible"
        role="img"
        aria-label={`Topics completed against the planned pace: ${lastIdx >= 0 ? points[lastIdx].actual : 0} completed so far, ${target} planned by December 31.`}
        onPointerMove={(e) => {
          const r = (e.currentTarget as SVGSVGElement).getBoundingClientRect();
          setHover(Math.max(0, Math.min(points.length - 1, Math.round(((e.clientX - r.left) / r.width) * (points.length - 1)))));
        }}
        onPointerLeave={() => setHover(null)}
      >
        <line x1="0" y1="200" x2={W} y2="200" stroke="var(--line)" />
        <polyline points={points.map((p, i) => `${x(i)},${y(p.plan)}`).join(" ")} fill="none" stroke="var(--ink-4)" strokeWidth="2" strokeDasharray="4 5" />
        {actual && <polyline points={actual} fill="none" stroke="var(--ink)" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />}
        {lastIdx >= 0 && <circle cx={x(lastIdx)} cy={y(points[lastIdx].actual!)} r="5" fill="var(--ink)" />}
        {hover != null && <line x1={x(hover)} x2={x(hover)} y1="0" y2="200" stroke="var(--line-strong)" />}
      </svg>
      {hv && hover != null && (
        <div role="tooltip" className="pointer-events-none absolute top-0 rounded-xl bg-ink px-3 py-2 text-[12px] text-on-ink" style={{ left: `min(calc(${(hover / Math.max(1, points.length - 1)) * 100}% + 8px), calc(100% - 150px))` }}>
          <div className="font-mono text-[10px] uppercase opacity-70">{hv.label}</div>
          <div>
            <span className="tnum font-semibold">{hv.actual ?? "—"}</span> completed
          </div>
          <div>
            <span className="tnum font-semibold">{hv.plan}</span> planned pace
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Hours per week ────────────────────────────────────────────────────── */

export function WeekBars({ weeks }: { weeks: { key: string; label: string; short: string; logged: number; scheduled: number; past: boolean; current: boolean }[] }) {
  const max = Math.max(1, ...weeks.map((w) => (w.past || w.current ? w.logged : w.scheduled)));
  return (
    <TipHost>
      <div className="flex h-[180px] items-end gap-2">
        {weeks.map((w) => {
          const v = w.past || w.current ? w.logged : w.scheduled;
          return (
            <div key={w.key} className="flex h-full flex-1 flex-col items-center justify-end gap-1.5">
              <span className="font-mono text-[10px] text-ink-3">{Math.round(v)}h</span>
              <div
                tabIndex={0}
                data-tip-value={w.past || w.current ? `${w.logged.toFixed(1)} h logged` : `${w.scheduled.toFixed(1)} h scheduled`}
                data-tip-label={w.label}
                aria-label={`${w.label}: ${w.past || w.current ? `${w.logged.toFixed(1)} hours logged` : `${w.scheduled.toFixed(1)} hours scheduled`}`}
                className="box-border w-full rounded-t"
                style={{ height: `${Math.max(v ? 3 : 0, (v / max) * 100)}%`, background: w.past || w.current ? "var(--accent)" : "var(--line)", outline: w.current ? "1px solid var(--accent-text)" : undefined }}
              />
              <span className="font-mono text-[10px] text-ink-3">{w.short}</span>
            </div>
          );
        })}
      </div>
    </TipHost>
  );
}

/* ── Completion by domain (mastered + completed, stacked) ──────────────── */

export function DomainBars({ rows }: { rows: { key: string; name: string; mastered: number; completed: number; total: number }[] }) {
  return (
    <TipHost>
      <ul className="flex flex-col gap-3">
        {rows.map((d) => (
          <li key={d.key} className="grid grid-cols-[minmax(0,1fr)_120px_44px] items-center gap-3 text-[13px]">
            <span className="truncate text-ink-2" title={d.name}>
              {d.name}
            </span>
            <div tabIndex={0} data-tip-value={`${d.mastered} mastered, ${d.completed} completed`} data-tip-label={`of ${d.total} topics`} aria-label={`${d.name}: ${d.mastered} mastered, ${d.completed} completed of ${d.total}`} className="flex h-2 bg-track">
              <div style={{ width: `${(d.mastered / Math.max(1, d.total)) * 100}%`, background: "var(--accent)" }} />
              <div style={{ width: `${(d.completed / Math.max(1, d.total)) * 100}%`, background: "var(--ink-2)" }} />
            </div>
            <span className="tnum text-right font-mono text-[11px]">
              {d.mastered + d.completed}/{d.total}
            </span>
          </li>
        ))}
      </ul>
    </TipHost>
  );
}
