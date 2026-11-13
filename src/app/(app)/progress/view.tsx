"use client";
import { useLocal } from "@/local/hooks";
import type { SessionUser } from "@/local/auth";
import { PageLoading } from "@/components/client/local-provider";
import { and, eq } from "drizzle-orm";
import { db, t } from "@/db";
import { DEADLINE, addDays, dateIn, dateRange, daysBetween, formatDate, todayIn, weekStart } from "@/lib/dates";
import { PROJECT_STATUSES, PROJECT_STATUS_LABEL, PROOF_TYPES, isDone } from "@/lib/status";
import { Ledger, PageTitle, Track } from "@/components/ui";
import { DataTable, DomainBars, HeatDots, HeatLegend, PaceChart, WeekBars, type HeatCell } from "@/components/client/charts";
import { getPathTree, getSessionsTotal, getStreaks } from "@/local/data";
import { getItemsBetween, planStartDate } from "@/local/stats";

async function build(user: SessionUser) {
  const today = todayIn(user.timezone);
  const start = planStartDate(user) < today ? planStartDate(user) : today;
  const [tree, progress, streak, sessions, sessionRows, projects, proofs, reviewItems, planItems] = await Promise.all([
    getPathTree(user.id, user.pathId),
    db.select().from(t.topicProgress).where(eq(t.topicProgress.userId, user.id)).all(),
    getStreaks(user.id, user.timezone),
    getSessionsTotal(user.id),
    db.select().from(t.learningSessions).where(eq(t.learningSessions.userId, user.id)).all(),
    db.select().from(t.projects).where(eq(t.projects.userId, user.id)).all(),
    db.select().from(t.proofs).where(eq(t.proofs.userId, user.id)).all(),
    db
      .select()
      .from(t.scheduleItems)
      .where(and(eq(t.scheduleItems.userId, user.id), eq(t.scheduleItems.kind, "review"), eq(t.scheduleItems.status, "planned")))
      .all(),
    getItemsBetween(user.id, weekStart(start), DEADLINE),
  ]);
  const topics = tree.flatMap((d) => d.topics);
  const done = topics.filter((x) => isDone(x.status));
  const mastered = topics.filter((x) => x.status === "mastered");
  const inPlan = topics.filter((x) => x.bucket !== "continued" || isDone(x.status));
  const inPlanDone = inPlan.filter((x) => isDone(x.status)).length;
  const pct = (a: number, b: number) => (b ? Math.round((a / b) * 100) : 0);
  const finished = sessionRows.filter((s) => s.endedAt);

  // Heatmap: last 12 weeks ending this week.
  const heatEnd = addDays(weekStart(today), 6);
  const heatStart = addDays(weekStart(today), -77);
  const weeks: HeatCell[][] = [];
  for (let ws = heatStart; ws <= heatEnd; ws = addDays(ws, 7)) {
    const w: HeatCell[] = [];
    for (let i = 0; i < 7; i++) {
      const d = addDays(ws, i);
      const a = streak.byDate.get(d);
      const m = a?.minutes ?? 0;
      w.push({
        date: d,
        label: formatDate(d, { weekday: "short", month: "short", day: "numeric" }),
        minutes: m,
        events: a?.events ?? 0,
        level: !a ? 0 : m >= 180 ? 4 : m >= 120 ? 3 : m >= 60 ? 2 : 1,
        state: d > today ? "future" : d < start && !a ? "before" : "active",
      });
    }
    weeks.push(w);
  }

  // Completed vs planned pace.
  const completedDates = progress.filter((p) => p.completedAt && isDone(p.status)).map((p) => dateIn(p.completedAt!, user.timezone));
  const before = completedDates.filter((d) => d < start).length;
  const days = dateRange(start, DEADLINE);
  const span = Math.max(1, days.length - 1);
  const points = days.map((d, i) => ({ label: formatDate(d), actual: d <= today ? completedDates.filter((c) => c <= d).length : null, plan: Math.round(before + ((inPlan.length - before) * i) / span) }));

  // Hours per week: logged for past/current weeks, scheduled for future weeks.
  const weekBars = [];
  for (let ws = weekStart(start), n = 1; ws <= weekStart(DEADLINE); ws = addDays(ws, 7), n++) {
    const end = addDays(ws, 6);
    const logged = finished.filter((s) => {
      const d = dateIn(s.startedAt, user.timezone);
      return d >= ws && d <= end;
    }).reduce((a, s) => a + s.minutes, 0);
    const scheduled = planItems.filter((i) => i.date >= ws && i.date <= end && i.status !== "rescheduled").reduce((a, i) => a + i.minutes, 0);
    weekBars.push({ key: ws, label: `Week of ${formatDate(ws, { month: "short", day: "numeric" })}`, short: `W${n}`, logged: logged / 60, scheduled: scheduled / 60, past: end < today, current: ws <= today && today <= end });
  }

  const totalDays = Math.max(1, daysBetween(start, DEADLINE));
  const elapsed = Math.min(totalDays, Math.max(0, daysBetween(start, today)));
  const last28 = dateRange(addDays(today, -27), today).filter((d) => streak.byDate.has(d)).length;
  const backlog = topics.filter((x) => x.status === "needs_revision").length + reviewItems.filter((i) => i.date <= today).length;

  return (
    <div className="flex max-w-[1240px] flex-col gap-12">
      <PageTitle eyebrow="Progress · computed from logged work" title="How it's" muted="actually going." />

      <Ledger
        min={160}
        size={34}
        items={[
          { k: "Plan completed", v: `${pct(inPlanDone, inPlan.length)}%`, s: `${inPlanDone} of ${inPlan.length} planned topics` },
          { k: "Syllabus", v: `${pct(done.length, topics.length)}%`, s: `${done.length} of ${topics.length} topics` },
          { k: "Mastered", v: mastered.length, s: `${pct(mastered.length, Math.max(1, done.length))}% of completed`, tone: "accent" },
          { k: "Learning time", v: `${Math.round(sessions.minutes / 60)}h`, s: `${sessions.count} sessions` },
          { k: "Streak", v: `${streak.current}d`, s: `longest ${streak.longest}, ${(last28 / 4).toFixed(1)} days a week`, tone: "accent" },
          { k: "Revision backlog", v: backlog, s: "reviews due and flagged topics", tone: backlog ? "danger" : "ink" },
        ]}
      />

      <section aria-labelledby="deadline" className="flex flex-col gap-4">
        <h2 id="deadline" className="text-[30px] font-extrabold">
          Deadline progress
        </h2>
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between font-mono text-[11px] text-ink-3">
            <span>TIME ELAPSED · DAY {elapsed} OF {totalDays}</span>
            <span>{pct(elapsed, totalDays)}%</span>
          </div>
          <div className="h-2 bg-track">
            <div className="h-full bg-ink" style={{ width: `${pct(elapsed, totalDays)}%` }} />
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between font-mono text-[11px] text-ink-3">
            <span>PLANNED TOPICS COMPLETED</span>
            <span>{pct(inPlanDone, inPlan.length)}%</span>
          </div>
          <Track value={inPlanDone} max={inPlan.length} label="Planned topics completed" />
        </div>
      </section>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] gap-12">
        <section aria-labelledby="heat" className="flex flex-col gap-4">
          <h2 id="heat" className="text-[30px] font-extrabold">
            Activity · last 12 weeks
          </h2>
          <HeatDots weeks={weeks} />
          <div className="flex justify-between font-mono text-[11px] text-ink-3 uppercase">
            <span>{formatDate(heatStart, { month: "short", day: "numeric" })}</span>
            <span>Plan start · {formatDate(start, { month: "short", day: "numeric" })}</span>
            <span>{formatDate(heatEnd, { month: "short", day: "numeric" })}</span>
          </div>
          <HeatLegend />
          <p className="text-[12px] text-ink-3">A day counts only with a 10-minute session, a submitted project or proof, or a mastery assessment.</p>
        </section>

        <section aria-labelledby="pace" className="flex flex-col gap-4">
          <h2 id="pace" className="text-[30px] font-extrabold">
            Topics completed vs planned pace
          </h2>
          <PaceChart points={points} target={inPlan.length} />
          <div className="flex gap-[18px] text-[12px] text-ink-2">
            <span className="flex items-center gap-1.5">
              <span className="h-0.5 w-3.5 bg-ink" />
              Completed
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3.5 border-t-2 border-dashed border-ink-4" />
              Planned pace to Dec 31
            </span>
          </div>
          <DataTable caption="Cumulative topics completed by day" head={["Date", "Completed", "Planned pace"]} rows={points.filter((p) => p.actual != null).map((p) => [p.label, p.actual ?? "", p.plan])} />
        </section>

        <section aria-labelledby="hours" className="flex flex-col gap-4">
          <h2 id="hours" className="text-[30px] font-extrabold">
            Hours per week
          </h2>
          <WeekBars weeks={weekBars} />
          <span className="text-[12px] text-ink-3">Saffron: logged. Grey: still scheduled.</span>
          <DataTable caption="Hours per week" head={["Week", "Logged h", "Scheduled h"]} rows={weekBars.map((w) => [w.label, w.logged.toFixed(1), w.scheduled.toFixed(1)])} />
        </section>

        <section aria-labelledby="domains" className="flex flex-col gap-3">
          <h2 id="domains" className="text-[30px] font-extrabold">
            Completion by domain
          </h2>
          <DomainBars
            rows={tree
              .filter((d) => !d.isSpecialization)
              .map((d) => ({ key: d.id, name: `${d.code}. ${d.title}`, mastered: d.mastered, completed: d.done - d.mastered, total: d.topics.length }))}
          />
          <div className="flex gap-[18px] text-[12px] text-ink-2">
            <span className="flex items-center gap-1.5">
              <span className="size-2.5 bg-accent" />
              Mastered
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-2.5 bg-ink-2" />
              Completed
            </span>
          </div>
        </section>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] gap-12">
        <section aria-labelledby="proj" className="flex flex-col">
          <h2 id="proj" className="pb-3 text-[30px] font-extrabold">
            Projects
          </h2>
          <dl className="border-t border-line">
            {PROJECT_STATUSES.map((s) => (
              <div key={s} className="flex justify-between border-b border-line-soft py-2.5 text-[14px]">
                <dt className="text-ink-2">{PROJECT_STATUS_LABEL[s]}</dt>
                <dd className="tnum font-mono">{projects.filter((p) => p.status === s).length}</dd>
              </div>
            ))}
          </dl>
        </section>
        <section aria-labelledby="proofs" className="flex flex-col">
          <h2 id="proofs" className="pb-3 text-[30px] font-extrabold">
            Proof of work
          </h2>
          <dl className="border-t border-line">
            {PROOF_TYPES.filter((p) => proofs.some((x) => x.type === p.value)).map((p) => (
              <div key={p.value} className="flex justify-between border-b border-line-soft py-2.5 text-[14px]">
                <dt className="text-ink-2">{p.label}</dt>
                <dd className="tnum font-mono">{proofs.filter((x) => x.type === p.value).length}</dd>
              </div>
            ))}
            {!proofs.length && <p className="py-3 text-[14px] text-ink-3">No submissions yet.</p>}
          </dl>
        </section>
      </div>
    </div>
  );
}

export default function View() {
  const node = useLocal((user) => build(user), []);
  return node ?? <PageLoading />;
}
