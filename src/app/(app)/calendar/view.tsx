"use client";
import { useSearchParams } from "next/navigation";
import { useLocal } from "@/local/hooks";
import type { SessionUser } from "@/local/auth";
import { PageLoading } from "@/components/client/local-provider";
import Link from "next/link";
import { and, eq, gte, lte } from "drizzle-orm";
import { db, t } from "@/db";
import { DEADLINE, addDays, addMonths, formatMinutes, monthStart, todayIn, weekStart } from "@/lib/dates";
import { cx } from "@/components/ui";
import { getItemsBetween, planStartDate } from "@/local/stats";

const KIND: Record<string, { dot: string; label: string }> = {
  learn: { dot: "var(--ink-2)", label: "Learn" },
  review: { dot: "var(--ink-3)", label: "Revision" },
  assessment: { dot: "var(--accent)", label: "Mastery check" },
  project: { dot: "var(--ink)", label: "Project" },
  custom: { dot: "var(--ink-4)", label: "Your task" },
};

async function build(user: SessionUser, sp: { m?: string; d?: string }) {
  const today = todayIn(user.timezone);
  const start = planStartDate(user) < today ? planStartDate(user) : today;
  const sel = sp.d && /^\d{4}-\d{2}-\d{2}$/.test(sp.d) ? sp.d : today;
  const month = sp.m && /^\d{4}-\d{2}$/.test(sp.m) ? `${sp.m}-01` : monthStart(sel);
  const gridStart = weekStart(month);
  const monthEnd = addDays(addMonths(month, 1), -1);
  const gridEnd = addDays(weekStart(monthEnd), 6);
  const [items, projects] = await Promise.all([
    getItemsBetween(user.id, gridStart, gridEnd),
    db
      .select()
      .from(t.projects)
      .where(and(eq(t.projects.userId, user.id), gte(t.projects.dueDate, gridStart), lte(t.projects.dueDate, gridEnd)))
      .all(),
  ]);

  // Months shown as tabs: from the plan's first month to December.
  const tabs: string[] = [];
  for (let m = monthStart(start); m <= monthStart(DEADLINE); m = addMonths(m, 1)) tabs.push(m);
  if (!tabs.includes(month)) tabs.push(month);

  const days: string[] = [];
  for (let d = gridStart; d <= gridEnd; d = addDays(d, 1)) days.push(d);
  const byDay = new Map<string, typeof items>();
  for (const i of items) byDay.set(i.date, [...(byDay.get(i.date) ?? []), i]);

  const cellStyle = (d: string) => {
    const list = (byDay.get(d) ?? []).filter((i) => i.status !== "rescheduled" || d < today);
    const weekend = [0, 6].includes(new Date(`${d}T00:00:00Z`).getUTCDay());
    if (d.slice(0, 7) !== month.slice(0, 7)) return { bg: "transparent", bd: "transparent", fg: "var(--ink-4)" };
    if (d === today) return { bg: "var(--accent)", bd: "var(--accent)", fg: "#000" };
    if (d === DEADLINE) return { bg: "transparent", bd: "var(--accent)", fg: "var(--ink)" };
    if (d < start || d > DEADLINE) return { bg: "transparent", bd: "var(--line)", fg: "var(--ink-4)" };
    if (d < today) {
      if (!list.length) return { bg: "transparent", bd: "var(--line)", fg: "var(--ink-3)" };
      const done = list.some((i) => i.status === "done");
      return done ? { bg: "var(--ink)", bd: "var(--ink)", fg: "var(--on-ink)" } : { bg: "var(--danger)", bd: "var(--danger)", fg: "var(--on-ink)" };
    }
    if (weekend) return { bg: "transparent", bd: "var(--ink-2)", fg: "var(--ink-2)" };
    return { bg: "var(--dot)", bd: "var(--dot)", fg: "var(--ink-3)" };
  };

  const selItems = (byDay.get(sel) ?? []).filter((i) => i.status !== "rescheduled");
  const selMoved = (byDay.get(sel) ?? []).filter((i) => i.status === "rescheduled");
  const selProjects = projects.filter((p) => p.dueDate === sel);
  const selDate = new Date(`${sel}T00:00:00Z`);
  const fmt = (o: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat("en-GB", { ...o, timeZone: "UTC" }).format(selDate);
  const q = (m: string, d?: string) => `/calendar?m=${m.slice(0, 7)}${d ? `&d=${d}` : ""}`;

  return (
    <div className="grid max-w-[1200px] items-start gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      <div className="flex w-full max-w-[500px] flex-col gap-7">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[12px] text-ink-3">CALENDAR · LIVE PLAN</span>
          <nav aria-label="Month" className="flex gap-1 rounded-full border border-line p-1">
            {tabs.map((m) => (
              <Link
                key={m}
                href={q(m)}
                aria-current={m === month ? "true" : undefined}
                className={cx("grid h-8 place-items-center rounded-full px-4 text-[13px]", m === month ? "bg-ink text-on-ink" : "text-ink-2 hover:text-ink")}
              >
                {new Intl.DateTimeFormat("en-GB", { month: "short", timeZone: "UTC" }).format(new Date(`${m}T00:00:00Z`))}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex flex-col">
          <span className="numeral -ml-[0.04em] text-[clamp(120px,16vw,190px)] leading-[0.8]" aria-hidden="true">
            {selDate.getUTCDate()}
          </span>
          <div className="mt-[22px] flex items-baseline justify-between">
            <span className="text-[30px] font-extrabold tracking-[-0.02em] uppercase">{fmt({ month: "long" })}</span>
            <span className="text-[30px] font-bold text-ink-3">{fmt({ weekday: "short" })}</span>
          </div>
          <span className="text-[30px] leading-[1.1] font-medium text-muted">{fmt({ year: "numeric" })}</span>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
            <span key={i} aria-hidden="true" className="text-center font-mono text-[10px] text-ink-3">
              {d}
            </span>
          ))}
          {days.map((d) => {
            const s = cellStyle(d);
            const inMonth = d.slice(0, 7) === month.slice(0, 7);
            const label = new Intl.DateTimeFormat("en-GB", { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" }).format(new Date(`${d}T00:00:00Z`));
            return inMonth ? (
              <Link
                key={d}
                href={q(month, d)}
                scroll={false}
                aria-label={label}
                aria-current={d === sel ? "date" : undefined}
                className="box-border grid aspect-square place-items-center rounded-full border-[1.5px] font-mono text-[11px]"
                style={{ background: s.bg, borderColor: s.bd, color: s.fg, boxShadow: d === sel ? "0 0 0 3px var(--bg), 0 0 0 4.5px var(--ink)" : undefined }}
              >
                {Number(d.slice(8))}
              </Link>
            ) : (
              <span key={d} aria-hidden="true" />
            );
          })}
        </div>
        <ul className="flex flex-wrap gap-x-4 gap-y-2 text-[12px] text-ink-2" aria-label="Legend">
          {[
            ["var(--ink)", "", "Done"],
            ["var(--danger)", "", "Moved forward"],
            ["var(--accent)", "", "Today"],
            ["var(--dot)", "", "Study day"],
            ["transparent", "1.5px solid var(--ink-2)", "Weekend project"],
          ].map(([bg, bd, l]) => (
            <li key={l} className="flex items-center gap-1.5">
              <span className="box-border size-2.5 rounded-full" style={{ background: bg, border: bd || undefined }} />
              {l}
            </li>
          ))}
        </ul>
      </div>

      <section aria-labelledby="sel-day" className="flex flex-col pt-2">
        <span className="label pb-2.5">Selected day</span>
        <h1 id="sel-day" className="border-b-[1.5px] border-ink pb-[18px] text-[44px] leading-none font-extrabold tracking-[-0.04em]">
          {fmt({ weekday: "long" })} {selDate.getUTCDate()} {fmt({ month: "short" })}
        </h1>
        {selProjects.map((p) => (
          <Link key={p.id} href={`/projects?p=${p.id}`} className="flex items-center gap-3.5 border-b border-line py-4 text-[17px] text-accent-text hover:underline">
            <span className="size-3 shrink-0 rounded-full bg-accent" aria-hidden="true" />
            {p.title} due
          </Link>
        ))}
        {sel === DEADLINE && <div className="flex items-center gap-3.5 border-b border-line py-4 text-[17px] text-accent-text">Plan deadline</div>}
        {selItems.map((i) => {
          const done = i.status === "done";
          const overdue = !done && i.date < today;
          const href = i.topicId ? `/roadmap/${i.topicId}` : i.projectId ? `/projects?p=${i.projectId}` : `/today?date=${i.date}`;
          return (
            <Link key={i.id} href={href} className="flex items-center gap-3.5 border-b border-line py-4 text-[17px] hover:underline">
              <span className="size-3 shrink-0 rounded-full" style={{ background: done ? "var(--ink)" : overdue ? "var(--danger)" : KIND[i.kind]?.dot }} aria-hidden="true" />
              <span className={cx("min-w-0 flex-1", done && "text-ink-3 line-through")}>
                {done ? "✓ " : ""}
                {i.title}
              </span>
              <span className="shrink-0 font-mono text-[11px] text-ink-3 uppercase">
                {KIND[i.kind]?.label} · {formatMinutes(i.minutes)}
              </span>
            </Link>
          );
        })}
        {selMoved.length > 0 && <div className="flex items-center gap-3.5 border-b border-line py-4 text-[15px] text-danger">→ {selMoved.length} unfinished {selMoved.length === 1 ? "task" : "tasks"} moved forward</div>}
        {!selItems.length && !selMoved.length && !selProjects.length && <p className="py-4 text-[15px] text-ink-3">{sel < start || sel > DEADLINE ? "Outside the plan window." : "Nothing scheduled."}</p>}
        {sel >= start && sel <= DEADLINE && (
          <Link href={`/today?date=${sel}`} className="pt-5 font-mono text-[11px] text-accent-text hover:underline">
            OPEN IN PLANNER →
          </Link>
        )}
      </section>
    </div>
  );
}

export default function View() {
  const params = useSearchParams();
  const key = params.toString();
  const node = useLocal((user) => build(user, Object.fromEntries(params.entries())), [key]);
  return node ?? <PageLoading />;
}
