"use client";
import { TipHost } from "./charts";

export interface RunwayCell {
  date: string;
  kind: "done" | "partial" | "missed" | "rest" | "today" | "study" | "weekend" | "deadline" | "outside";
  title: string;
}

const STYLE: Record<RunwayCell["kind"], React.CSSProperties> = {
  done: { background: "var(--ink)", border: "1.5px solid var(--ink)" },
  partial: { background: "var(--ink-3)", border: "1.5px solid var(--ink-3)" },
  missed: { background: "var(--danger)", border: "1.5px solid var(--danger)" },
  rest: { background: "transparent", border: "1.5px solid var(--line)" },
  today: { background: "var(--accent)", border: "1.5px solid var(--accent)" },
  study: { background: "var(--dot)", border: "1.5px solid var(--dot)" },
  weekend: { background: "transparent", border: "1.5px solid var(--ink-2)" },
  deadline: { background: "transparent", border: "1.5px solid var(--accent)" },
  outside: { background: "transparent", border: "1.5px solid transparent" },
};

/** The runway: one dot per day, Monday-first weeks, from the plan's first week to December 31. */
export function RunwayDots({ cells }: { cells: RunwayCell[] }) {
  const days = ["M", "T", "W", "T", "F", "S", "S"];
  return (
    <TipHost className="w-full max-w-[440px]">
      <div className="grid grid-cols-7 gap-2" role="list" aria-label="Daily plan from your first week to December 31">
        {days.map((d, i) => (
          <span key={i} aria-hidden="true" className="text-center font-mono text-[10px] text-ink-3">
            {d}
          </span>
        ))}
        {cells.map((c) => (
          <span
            key={c.date}
            role="listitem"
            tabIndex={c.kind === "outside" ? -1 : 0}
            aria-label={c.title}
            data-tip-value={c.kind === "outside" ? undefined : c.title.split(": ")[1]}
            data-tip-label={c.title.split(": ")[0]}
            className="box-border aspect-square rounded-full"
            style={STYLE[c.kind]}
          />
        ))}
      </div>
    </TipHost>
  );
}
