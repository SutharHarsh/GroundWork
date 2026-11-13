import Link from "next/link";
import type { ComponentProps, CSSProperties, ReactNode } from "react";

export function cx(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

/* ── Brand ─────────────────────────────────────────────────────────────── */

export function Brand({ round, className }: { round?: boolean; className?: string }) {
  return (
    <span className={cx("inline-flex items-center gap-2.5", className)}>
      <span aria-hidden="true" className={cx("size-3 bg-accent", round && "rounded-full")} />
      <span className="text-[15px] font-semibold tracking-[-0.01em]">Groundwork</span>
    </span>
  );
}

/* ── Buttons (pills) ───────────────────────────────────────────────────── */

type Variant = "accent" | "ink" | "outline" | "ghost" | "danger";
const variants: Record<Variant, string> = {
  accent: "bg-accent text-black font-semibold hover:bg-accent-hover disabled:opacity-50",
  ink: "bg-ink text-on-ink font-medium hover:opacity-85 disabled:opacity-40",
  outline: "border border-line-strong text-ink hover:border-accent-text hover:text-accent-text disabled:opacity-50",
  ghost: "text-ink-3 hover:text-ink disabled:opacity-50",
  danger: "border border-line-strong text-danger hover:border-danger disabled:opacity-50",
};
const sizes = {
  xs: "h-7 px-3 text-[12px] gap-1.5",
  sm: "h-8 px-3.5 text-[13px] gap-1.5",
  md: "h-11 px-5 text-[14px] gap-2",
  lg: "h-[52px] px-7 text-[16px] gap-2",
  xl: "h-[60px] px-9 text-[18px] gap-2",
};

export function buttonClass(variant: Variant = "outline", size: keyof typeof sizes = "md", extra?: string) {
  return cx(
    "inline-flex shrink-0 items-center justify-center rounded-full whitespace-nowrap transition-[background,color,border-color,opacity] duration-150 select-none disabled:cursor-not-allowed",
    variants[variant],
    sizes[size],
    extra,
  );
}

export function Button({ variant = "outline", size = "md", className, ...props }: ComponentProps<"button"> & { variant?: Variant; size?: keyof typeof sizes }) {
  return <button type="button" {...props} className={buttonClass(variant, size, className)} />;
}

export function ButtonLink({ variant = "outline", size = "md", className, ...props }: ComponentProps<typeof Link> & { variant?: Variant; size?: keyof typeof sizes }) {
  return <Link {...props} className={buttonClass(variant, size, className)} />;
}

/* ── Type ──────────────────────────────────────────────────────────────── */

export function Label({ children, className, as: As = "span", id }: { children: ReactNode; className?: string; as?: "span" | "h2" | "h3" | "p" | "div"; id?: string }) {
  return (
    <As id={id} className={cx("label", className)}>
      {children}
    </As>
  );
}

/** Page heading: mono eyebrow, heavy headline with a lighter muted continuation. */
export function PageTitle({ eyebrow, title, muted, sub, actions }: { eyebrow?: ReactNode; title: ReactNode; muted?: ReactNode; sub?: ReactNode; actions?: ReactNode }) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-6">
      <div className="flex min-w-0 flex-col gap-2.5">
        {eyebrow && <span className="font-mono text-[12px] tracking-[0.02em] text-ink-3 uppercase">{eyebrow}</span>}
        <h1 className="text-[clamp(40px,5vw,64px)] leading-none font-extrabold tracking-[-0.025em] text-pretty">
          {title}
          {muted && (
            <>
              {" "}
              <em className="font-medium text-muted not-italic">{muted}</em>
            </>
          )}
        </h1>
        {sub && <p className="text-[14px] text-ink-2">{sub}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </header>
  );
}

export function SectionTitle({ children, action, id }: { children: ReactNode; action?: ReactNode; id?: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-line pb-3">
      <h2 id={id} className="text-[28px] leading-none font-bold tracking-[-0.02em]">
        {children}
      </h2>
      {action}
    </div>
  );
}

/* ── Status dots (shape-coded, from the design) ─────────────────────────── */

export type StatusCode = "M" | "C" | "P" | "L" | "R" | "N" | "S" | "X" | "B";

export const STATUS_STYLE: Record<StatusCode, { label: string; fg: string }> = {
  M: { label: "Mastered", fg: "var(--accent-text)" },
  C: { label: "Completed", fg: "var(--ink)" },
  P: { label: "Practiced", fg: "var(--ink)" },
  L: { label: "Learning", fg: "var(--ink)" },
  R: { label: "Needs revision", fg: "var(--danger)" },
  N: { label: "Not started", fg: "var(--ink-2)" },
  S: { label: "Stretch goal", fg: "var(--ink-3)" },
  X: { label: "Continued learning (2027)", fg: "var(--ink-3)" },
  B: { label: "Blocked by prerequisites", fg: "var(--ink-3)" },
};

/** Maps a topic's status, plan bucket and lock state to a design status code. */
export function statusCode(status: string, bucket?: string, locked?: boolean): StatusCode {
  if (status === "mastered") return "M";
  if (status === "completed") return "C";
  if (status === "needs_revision") return "R";
  if (status === "practiced") return "P";
  if (status === "learning") return "L";
  if (locked) return "B";
  if (bucket === "stretch") return "S";
  if (bucket === "continued") return "X";
  return "N";
}

function dotStyle(code: StatusCode, size: number): CSSProperties {
  const b = size >= 12 ? 1.5 : 1.25;
  switch (code) {
    case "M":
      return { background: "var(--accent)", border: `${b}px solid var(--accent)`, boxShadow: `0 0 0 2px var(--bg), 0 0 0 ${2 + b}px var(--accent)` };
    case "C":
      return { background: "var(--ink)", border: `${b}px solid var(--ink)` };
    case "P":
      return { background: "transparent", border: `${Math.max(2.5, size * 0.25)}px solid var(--ink)` };
    case "L":
      return { background: "linear-gradient(to top, var(--ink) 50%, transparent 50%)", border: `${b}px solid var(--ink)` };
    case "R":
      return { background: "var(--danger)", border: `${b}px solid var(--danger)` };
    case "S":
      return { background: "transparent", border: `${b}px dashed var(--ink-4)` };
    case "X":
      return { background: "transparent", border: `${b}px solid var(--line-strong)` };
    case "B":
      return { background: "var(--dot)", border: `${b}px solid var(--dot)`, opacity: 0.45 };
    default:
      return { background: "var(--dot)", border: `${b}px solid var(--dot)` };
  }
}

export function StatusDot({ code, size = 12, className, title }: { code: StatusCode; size?: number; className?: string; title?: string }) {
  return (
    <span
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
      aria-label={title}
      title={title}
      className={cx("inline-block shrink-0 rounded-full", className)}
      style={{ width: size, height: size, boxSizing: "border-box", ...dotStyle(code, size) }}
    />
  );
}

export function StatusText({ code, className }: { code: StatusCode; className?: string }) {
  return (
    <span className={cx("inline-flex items-center gap-2.5 text-[14px]", className)}>
      <StatusDot code={code} size={13} />
      <span style={{ color: STATUS_STYLE[code].fg }}>{STATUS_STYLE[code].label}</span>
    </span>
  );
}

/* ── Chips, tracks, ledgers ────────────────────────────────────────────── */

export function chipClass(active: boolean, extra?: string) {
  return cx(
    "inline-flex h-8 shrink-0 items-center rounded-full border px-3.5 text-[13px] whitespace-nowrap transition-colors",
    active ? "border-ink bg-ink text-on-ink" : "border-line-strong text-ink-2 hover:text-ink",
    extra,
  );
}

export function Track({ value, max = 100, className, height = 8, label }: { value: number; max?: number; className?: string; height?: number; label?: string }) {
  const pct = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;
  return (
    <div role="progressbar" aria-valuemin={0} aria-valuemax={max} aria-valuenow={Math.round(value)} aria-label={label} className={cx("w-full bg-track", className)} style={{ height }}>
      <div className="h-full bg-accent transition-[width] duration-500" style={{ width: `${pct}%` }} />
    </div>
  );
}

export interface LedgerItem {
  k: string;
  v: ReactNode;
  s?: ReactNode;
  tone?: "ink" | "accent" | "danger" | "muted";
}

export function Ledger({ items, min = 150, size = 30 }: { items: LedgerItem[]; min?: number; size?: number }) {
  const tone = { ink: "text-ink", accent: "text-accent-text", danger: "text-danger", muted: "text-ink-3" };
  return (
    <dl className="grid border-t border-line" style={{ gridTemplateColumns: `repeat(auto-fit, minmax(${min}px, 1fr))` }}>
      {items.map((l) => (
        <div key={l.k} className="flex flex-col gap-1.5 border-b border-line py-[18px] pr-4">
          <dt className="label text-[10px]">{l.k}</dt>
          <dd className={cx("tnum leading-none font-semibold tracking-[-0.02em]", tone[l.tone ?? "ink"])} style={{ fontSize: size }}>
            {l.v}
          </dd>
          {l.s && <dd className="text-[12px] text-ink-3">{l.s}</dd>}
        </div>
      ))}
    </dl>
  );
}

/* ── Inputs ────────────────────────────────────────────────────────────── */

/** Underlined, borderless input (the design's primary form style). */
export const underlineWrap = "flex flex-col gap-1 border-b-2 border-line-strong pb-2 focus-within:border-ink";
export const underlineInput = "h-11 w-full border-0 bg-transparent p-0 text-[22px] text-ink caret-accent-text outline-none";

/** Boxed input for secondary forms. */
export const inputClass =
  "w-full rounded-xl border border-line-strong bg-transparent px-3.5 py-2.5 text-[15px] text-ink outline-none transition-colors placeholder:text-ink-4 focus:border-ink disabled:opacity-60";

export function Field({ label, htmlFor, hint, error, children, className }: { label: string; htmlFor: string; hint?: ReactNode; error?: string; children: ReactNode; className?: string }) {
  return (
    <div className={cx("flex flex-col gap-1.5", className)}>
      <label htmlFor={htmlFor} className="label">
        {label}
      </label>
      {children}
      {hint && !error && <p className="text-[12.5px] text-ink-3">{hint}</p>}
      {error && (
        <p id={`${htmlFor}-error`} className="text-[13px] text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

export function EmptyNote({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cx("py-4 text-[14px] text-ink-3", className)}>{children}</p>;
}

/** A row that reads like "TODAY 08:40 · …" — mono date column. */
export function MonoDate({ children }: { children: ReactNode }) {
  return <span className="font-mono text-[11px] text-ink-3 uppercase">{children}</span>;
}
