"use client";
import { useLocal } from "@/local/hooks";
import type { SessionUser } from "@/local/auth";
import { PageLoading } from "@/components/client/local-provider";
import Link from "next/link";
import { DEADLINE, addDays, daysBetween, formatDate, formatMinutes, weekStart } from "@/lib/dates";
import { ButtonLink, Ledger, STATUS_STYLE, statusCode } from "@/components/ui";
import { RunwayDots, type RunwayCell } from "@/components/client/runway-dots";
import { TaskRows } from "@/components/client/task-list";
import { StartSessionButton } from "@/components/client/start-session";
import { getRecentActivity } from "@/local/data";
import { enrichItems } from "@/local/items";
import { getDaySummaries, getOverview, planStartDate } from "@/local/stats";

function greeting(tz: string) {
  const hour = Number(new Intl.DateTimeFormat("en-US", { hour: "numeric", hourCycle: "h23", timeZone: tz }).format(new Date()));
  return hour < 5 ? "Good evening" : hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
}

const ACTIVITY_KIND: Record<string, string> = {
  session: "Session",
  topic_completed: "Completed",
  proof: "Proof",
  mastery: "Assessment",
  project_submitted: "Submitted",
  project_completed: "Project",
};

async function build(user: SessionUser) {
  const o = await getOverview(user);
  const start = planStartDate(user) < o.today ? planStartDate(user) : o.today;
  const gridStart = weekStart(start);
  const [summaries, activity, items] = await Promise.all([getDaySummaries(user, gridStart, DEADLINE), getRecentActivity(user.id, 6), enrichItems(o.todayItems, o.tree, user.id)]);

  // Runway: one dot per day from the plan's first week to December 31.
  const cells: RunwayCell[] = [];
  for (let d = gridStart; d <= addDays(weekStart(DEADLINE), 6); d = addDays(d, 1)) {
    const s = summaries.get(d);
    const weekend = [0, 6].includes(new Date(`${d}T00:00:00Z`).getUTCDay());
    let kind: RunwayCell["kind"] = "study";
    let title = `${formatDate(d)}`;
    if (d < start || d > DEADLINE) {
      kind = "outside";
      title = d > DEADLINE ? `${formatDate(d)}: after the deadline` : `${formatDate(d)}: before your plan`;
    } else if (d === o.today) {
      kind = "today";
      title = `${formatDate(d)}: today${s ? `, ${formatMinutes(s.done)} of ${formatMinutes(s.done + s.planned + s.missed)} done` : ""}`;
    } else if (d === DEADLINE) {
      kind = "deadline";
      title = `${formatDate(d)}: deadline`;
    } else if (d < o.today) {
      const total = (s?.done ?? 0) + (s?.missed ?? 0);
      kind = !s || total === 0 ? "rest" : s.done === 0 ? "missed" : s.done < total * 0.75 ? "partial" : "done";
      title = `${formatDate(d)}: ${kind === "rest" ? "nothing scheduled" : `${formatMinutes(s?.done ?? 0)} done${s?.missed ? `, ${formatMinutes(s.missed)} moved forward` : ""}`}`;
    } else {
      kind = weekend ? "weekend" : "study";
      title = `${formatDate(d)}: ${s ? formatMinutes(s.planned) : "nothing"} scheduled${weekend ? ", weekend project" : ""}`;
    }
    cells.push({ date: d, kind, title });
  }

  const totalWeeks = Math.max(1, Math.ceil((daysBetween(weekStart(start), DEADLINE) + 1) / 7));
  const weekNo = Math.min(totalWeeks, Math.floor(daysBetween(weekStart(start), o.today) / 7) + 1);
  const pct = (a: number, b: number) => (b ? Math.round((a / b) * 100) : 0);
  const track =
    o.pace == null
      ? "Your plan starts today. Finish today's tasks and you're on track."
      : o.pace >= 0.85
        ? `On track. ${pct(o.pace, 1)}% of the last seven days' scheduled work is done.`
        : o.pace >= 0.6
          ? `Slightly behind: ${pct(o.pace, 1)}% of the last seven days' work is done. Unfinished tasks moved forward.`
          : `Behind: only ${pct(o.pace, 1)}% of the last seven days' work is done. Consider fewer daily hours in Settings so the plan stays honest.`;
  const nextDomain = o.next ? o.tree.find((d) => d.id === o.next!.domainId) : undefined;
  const firstName = user.name.split(" ")[0];
  const dateLine = new Intl.DateTimeFormat("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric", timeZone: "UTC" })
    .format(new Date(`${o.today}T00:00:00Z`))
    .replace(/,/g, "")
    .toUpperCase();

  return (
    <div className="flex max-w-[1240px] flex-col gap-12">
      <div className="flex justify-between font-mono text-[12px] text-ink-3">
        <span>
          {dateLine} · WEEK {weekNo} OF {totalWeeks}
        </span>
        <span>OVERVIEW</span>
      </div>

      <div className="grid items-end gap-8 lg:grid-cols-[minmax(0,1fr)_auto]">
        <div className="flex flex-col gap-4">
          <h1 className="text-[clamp(48px,6vw,80px)] leading-[0.95] font-extrabold tracking-[-0.03em]">
            {greeting(user.timezone)}, <em className="font-medium text-muted not-italic">{firstName}.</em>
          </h1>
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-[14px] text-ink-2">
            <span>{user.pathId === "frontend" ? "AI-Native Frontend Developer" : "AI-Native Product Designer"}</span>
            {o.currentDomain && (
              <>
                <span className="text-ink-4">/</span>
                <span>{o.currentDomain.stage}</span>
                <span className="text-ink-4">/</span>
                <span>
                  Domain {o.currentDomain.code} · {o.currentDomain.title}
                </span>
              </>
            )}
          </div>
        </div>
        <div className="flex items-end gap-3.5">
          <span className="numeral tnum text-[clamp(120px,14vw,200px)] leading-[0.78]">{o.daysLeft}</span>
          <span className="pb-1.5 font-mono text-[11px] leading-normal text-ink-3">
            DAYS UNTIL
            <br />
            DECEMBER 31
          </span>
        </div>
      </div>

      {user.planNote && <p className="-mt-6 font-mono text-[12px] text-ink-3">{user.planNote.toUpperCase()}</p>}

      {o.next && (
        <section aria-labelledby="next-move" className="grid items-center gap-6 border-t border-b border-t-accent border-b-line py-8 lg:grid-cols-[minmax(0,1fr)_auto]">
          <div className="flex flex-col gap-2.5">
            <span id="next-move" className="label text-accent-text">
              Next move
            </span>
            <Link href={`/roadmap/${o.next.id}`} className="text-[clamp(36px,4vw,52px)] leading-none font-bold tracking-[-0.02em] hover:underline hover:decoration-2 hover:underline-offset-4">
              {o.next.title}
            </Link>
            <span className="text-[14px] text-ink-2">
              {nextDomain ? `Domain ${nextDomain.code}` : ""} · {STATUS_STYLE[statusCode(o.next.status, o.next.bucket, o.next.locked)].label} · {o.next.subtopicsDone} of {o.next.subtopicCount} concepts · about{" "}
              {formatMinutes(Math.max(15, o.next.estMinutes - o.next.minutesSpent))} left
            </span>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {!o.next.locked && <StartSessionButton topicId={o.next.id} label="Start session" size="lg" />}
            <ButtonLink href={`/roadmap/${o.next.id}`} variant="outline" size="lg">
              Open workspace
            </ButtonLink>
          </div>
        </section>
      )}

      <section aria-label="The runway" className="grid items-start gap-12 pt-2 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <RunwayDots cells={cells} />
        <div className="flex flex-col gap-5">
          <h2 className="flex flex-col gap-0.5 text-[40px] leading-none tracking-[-0.04em]">
            <span className="font-extrabold uppercase">The runway</span>
            <span className="font-medium text-muted">
              {formatDate(start, { month: "short", day: "numeric" })} – Dec 31
            </span>
          </h2>
          <p className="max-w-[440px] text-[16px] leading-normal text-ink-2">{track}</p>
          <ul className="flex flex-col gap-2.5 text-[13px] text-ink-2">
            <LegendDot style={{ background: "var(--ink)" }}>Done</LegendDot>
            <LegendDot style={{ background: "var(--ink-3)" }}>Partly done</LegendDot>
            <LegendDot style={{ background: "var(--danger)" }}>Missed, moved forward</LegendDot>
            <LegendDot style={{ background: "var(--accent)" }}>Today</LegendDot>
            <LegendDot style={{ background: "var(--dot)" }}>Scheduled study day</LegendDot>
            <LegendDot style={{ border: "1.5px solid var(--ink-2)" }}>Weekend project day</LegendDot>
          </ul>
        </div>
      </section>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,380px),1fr))] gap-12">
        <section aria-labelledby="today-title" className="flex flex-col gap-1.5">
          <div className="flex items-baseline justify-between border-b border-line pb-3">
            <h2 id="today-title" className="text-[30px] font-bold tracking-[-0.02em]">
              Today
            </h2>
            <Link href="/today" className="font-mono text-[11px] text-accent-text hover:underline">
              OPEN PLANNER →
            </Link>
          </div>
          <TaskRows items={items} today={o.today} compact empty="Nothing scheduled today. Revise, add proof of work, or pick a topic from the roadmap." />
        </section>
        <section aria-labelledby="activity-title" className="flex flex-col gap-1.5">
          <div className="border-b border-line pb-3">
            <h2 id="activity-title" className="text-[30px] font-bold tracking-[-0.02em]">
              Recent activity
            </h2>
          </div>
          {activity.length ? (
            <ol>
              {activity.map((a) => {
                const failed = a.type === "mastery" && a.label.startsWith("Assessed");
                const dot = failed ? "var(--danger)" : a.type === "session" || a.type === "mastery" ? "var(--accent)" : "var(--ink-2)";
                return (
                  <li key={a.id} className="grid grid-cols-[96px_14px_minmax(0,1fr)] items-start gap-3 py-3">
                    <span className="pt-[3px] font-mono text-[11px] text-ink-3 uppercase">
                      {a.date === o.today
                        ? `Today ${new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: user.timezone }).format(new Date(a.createdAt))}`
                        : formatDate(a.date, { month: "short", day: "numeric" })}
                    </span>
                    <span className="mt-[5px] size-[9px] rounded-full" style={{ background: dot }} aria-hidden="true" />
                    <div className="flex flex-col gap-0.5">
                      <span className="font-mono text-[12px] text-ink-3">
                        {failed ? "Assessment · not yet" : a.label.startsWith("Mastered") ? "Mastered" : (ACTIVITY_KIND[a.type] ?? "Activity")}
                      </span>
                      <span className="text-[15px]">
                        {a.label.replace(/^(Studied|Completed|Submitted proof: |Submitted|Mastered|Assessed) ?/, "")}
                        {a.minutes ? ` · ${formatMinutes(a.minutes)}` : ""}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ol>
          ) : (
            <p className="py-3 text-[14px] text-ink-3">Sessions, proof of work and assessments will show up here.</p>
          )}
        </section>
      </div>

      <Ledger
        items={[
          { k: "Topics completed", v: `${o.counts.inPlanDone}/${o.counts.inPlan}`, s: "in this plan" },
          { k: "Mastered", v: o.counts.mastered, s: "with evidence", tone: "accent" },
          { k: "Learning now", v: o.counts.learning, s: "topics in progress" },
          { k: "Needs revision", v: o.counts.revision, s: "scheduled again", tone: "danger" },
          { k: "This week", v: `${pct(o.week.done, o.week.planned)}%`, s: "of scheduled time" },
          { k: "Streak", v: `${o.streak.current}d`, s: `longest ${o.streak.longest} ${o.streak.longest === 1 ? "day" : "days"}`, tone: "accent" },
          { k: "Learning time", v: `${Math.round(o.sessions.minutes / 60)}h`, s: `since ${formatDate(start, { month: "short", day: "numeric" })}` },
          { k: "Continued", v: o.counts.continued, s: "topics for 2027", tone: "muted" },
        ]}
      />
    </div>
  );
}

function LegendDot({ style, children }: { style: React.CSSProperties; children: React.ReactNode }) {
  return (
    <li className="flex items-center gap-2.5">
      <span className="box-border size-3.5 rounded-full" style={style} aria-hidden="true" />
      {children}
    </li>
  );
}

export default function View() {
  const node = useLocal((user) => build(user), []);
  return node ?? <PageLoading />;
}
