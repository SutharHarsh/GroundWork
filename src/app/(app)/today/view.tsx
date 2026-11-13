"use client";
import { useSearchParams } from "next/navigation";
import { useLocal } from "@/local/hooks";
import type { SessionUser } from "@/local/auth";
import { PageLoading } from "@/components/client/local-provider";
import Link from "next/link";
import { DEADLINE, addDays, formatMinutes, isWeekend, todayIn } from "@/lib/dates";
import { isDone } from "@/lib/status";
import { Track } from "@/components/ui";
import { TaskRows } from "@/components/client/task-list";
import { LogTimeForm, QuickAddTask } from "@/components/client/planner-forms";
import { getPathTree } from "@/local/data";
import { enrichItems } from "@/local/items";
import { getItemsBetween } from "@/local/stats";

const GROUPS = [
  { kinds: ["learn"], name: "Learning", empty: "No new topics today." },
  { kinds: ["review"], name: "Revision", empty: "Nothing to revise today." },
  { kinds: ["assessment"], name: "Assessments", empty: "No mastery check today." },
  { kinds: ["project"], name: "Project work", empty: "Projects run on weekends." },
  { kinds: ["custom"], name: "Your tasks", empty: "Add your own below." },
];

async function build(user: SessionUser, sp: { date?: string }) {
  const today = todayIn(user.timezone);
  const { date: dateParam } = sp;
  const date = dateParam && /^\d{4}-\d{2}-\d{2}$/.test(dateParam) ? dateParam : today;
  const [tree, raw] = await Promise.all([getPathTree(user.id, user.pathId), getItemsBetween(user.id, date, date)]);
  const items = await enrichItems(
    raw.filter((i) => i.status !== "rescheduled"),
    tree,
    user.id,
  );
  const moved = raw.filter((i) => i.status === "rescheduled");
  const total = items.reduce((n, i) => n + i.minutes, 0);
  const done = items.filter((i) => i.status === "done").reduce((n, i) => n + i.minutes, 0);
  const capacity = Math.round(((isWeekend(date) ? user.hoursWeekend : user.hoursWeekday) ?? 0) * 60);
  const topicOptions = tree
    .filter((d) => !d.isSpecialization)
    .flatMap((d) => d.topics.filter((tp) => !isDone(tp.status) && !tp.locked).map((tp) => ({ id: tp.id, label: `${tp.code} ${tp.title}` })));
  const [weekday, rest] = new Intl.DateTimeFormat("en-GB", { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" })
    .format(new Date(`${date}T00:00:00Z`))
    .split(/,? (?=\d)/);
  const isToday = date === today;

  return (
    <div className="flex max-w-[1000px] flex-col gap-9">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="flex flex-col gap-2.5">
          <span className="font-mono text-[12px] text-ink-3">{isToday ? "TODAY · DAILY PLANNER" : date < today ? "PAST DAY · DAILY PLANNER" : "UPCOMING · DAILY PLANNER"}</span>
          <h1 className="text-[clamp(44px,5vw,64px)] leading-none font-extrabold tracking-[-0.02em]">
            {weekday}, <em className="font-medium text-muted not-italic">{rest}</em>
          </h1>
        </div>
        <nav aria-label="Change day" className="flex gap-2">
          <Link href={`/today?date=${addDays(date, -1)}`} aria-label="Previous day" className="grid size-10 place-items-center rounded-full border border-line-strong hover:border-accent-text">
            ←
          </Link>
          {!isToday && (
            <Link href="/today" className="grid h-10 place-items-center rounded-full border border-line-strong px-4 text-[13px] hover:border-accent-text">
              Today
            </Link>
          )}
          <Link href={`/today?date=${addDays(date, 1)}`} aria-label="Next day" className="grid size-10 place-items-center rounded-full border border-line-strong hover:border-accent-text">
            →
          </Link>
        </nav>
      </div>

      <div className="flex flex-col gap-2.5">
        <div className="flex justify-between text-[14px] text-ink-2">
          <span>{total ? `${formatMinutes(done)} of ${formatMinutes(total)} done` : date > DEADLINE ? "After the plan's deadline." : "Nothing scheduled."}</span>
          <span className="font-mono text-[12px]">CAPACITY {formatMinutes(capacity).replace(" min", "M").replace(" h", "H").toUpperCase()}</span>
        </div>
        <Track value={done} max={Math.max(total, capacity, 1)} label="Day progress" />
      </div>

      {GROUPS.map((g) => {
        const list = items.filter((i) => g.kinds.includes(i.kind));
        if (!list.length && g.kinds[0] === "custom") return null;
        return (
          <section key={g.name} aria-labelledby={`g-${g.kinds[0]}`} className="flex flex-col">
            <div className="flex items-baseline justify-between border-b border-line pb-2.5">
              <h2 id={`g-${g.kinds[0]}`} className="text-[28px] font-bold tracking-[-0.02em]">
                {g.name}
              </h2>
              <span className="font-mono text-[11px] text-ink-3">
                {list.filter((i) => i.status === "done").length}/{list.length}
              </span>
            </div>
            <TaskRows items={list} today={today} empty={g.empty} />
          </section>
        );
      })}

      <QuickAddTask date={date < today ? today : date} />
      {moved.length > 0 && (
        <p aria-live="polite" className="text-[13px] text-ink-3">
          {moved.length} unfinished {moved.length === 1 ? "task was" : "tasks were"} moved forward from this day: {moved.map((m) => m.title).join(", ")}.
        </p>
      )}

      <details className="rounded-[20px] border border-line bg-panel">
        <summary className="flex items-center justify-between px-6 py-4">
          <span className="text-[15px] font-medium">Log off-plan study</span>
          <span className="font-mono text-[11px] text-ink-3">COUNTS TOWARDS YOUR STREAK</span>
        </summary>
        <div className="border-t border-line px-6 py-5">
          <LogTimeForm topics={topicOptions} />
        </div>
      </details>
    </div>
  );
}

export default function View() {
  const params = useSearchParams();
  const key = params.toString();
  const node = useLocal((user) => build(user, Object.fromEntries(params.entries())), [key]);
  return node ?? <PageLoading />;
}
