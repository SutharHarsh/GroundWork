"use client";
import Link from "next/link";
import { useState } from "react";
import { completeItem, deleteTask, reopenItem, rescheduleItem, startSession } from "@/local/actions/learning";
import { buttonClass, cx, inputClass } from "@/components/ui";
import { addDays, formatDate } from "@/lib/dates";
import type { ItemView } from "@/local/items";
import { useAction } from "./toast";

const KIND: Record<string, string> = { learn: "Learn", review: "Revision", assessment: "Assessment", project: "Project", custom: "Your task" };

/** Task rows from the design: check · title/meta · minutes · Start / Move. Wired to the real schedule. */
export function TaskRows({ items, today, compact, empty }: { items: ItemView[]; today: string; compact?: boolean; empty?: string }) {
  if (!items.length) return <p className="py-4 text-[14px] text-ink-3">{empty ?? "Nothing here."}</p>;
  return (
    <ul>
      {items.map((item) => (
        <TaskRow key={item.id} item={item} today={today} compact={compact} />
      ))}
    </ul>
  );
}

function TaskRow({ item, today, compact }: { item: ItemView; today: string; compact?: boolean }) {
  const [mode, setMode] = useState<"idle" | "log" | "move">("idle");
  const [minutes, setMinutes] = useState(String(item.minutes));
  const [date, setDate] = useState(addDays(today, 1));
  const [pending, run] = useAction();
  const done = item.status === "done";
  const overdue = !done && item.date < today;
  const meta = [
    compact ? KIND[item.kind] : null,
    item.kind === "learn" && item.detail ? item.detail : null,
    item.context,
    overdue ? `Overdue since ${formatDate(item.date)}` : item.rescheduledFrom ? `Moved from ${formatDate(item.rescheduledFrom)}` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  const toggle = () => {
    if (done) run(() => reopenItem(item.id), { silent: true });
    else run(() => completeItem(item.id, item.minutes));
  };

  return (
    <li className="border-b border-line-soft py-3.5">
      <div className={cx("grid items-center gap-3.5", compact ? "grid-cols-[28px_minmax(0,1fr)_auto]" : "grid-cols-[28px_minmax(0,1fr)_auto] sm:grid-cols-[28px_minmax(0,1fr)_auto_auto]")}>
        <button
          type="button"
          onClick={toggle}
          disabled={pending || item.locked}
          aria-label={done ? `Mark "${item.title}" as not done` : `Mark "${item.title}" as done, logging ${item.minutes} minutes`}
          className={cx(
            "grid size-[22px] place-items-center rounded-md border-[1.5px] text-[13px] leading-none text-black transition-colors disabled:cursor-not-allowed disabled:opacity-40",
            done ? "border-accent bg-accent" : "border-ink-4 hover:border-ink",
          )}
        >
          {done ? "✓" : ""}
        </button>
        <div className={cx("flex min-w-0 flex-col gap-[3px]", done && "opacity-50")}>
          <span className={cx("text-[16px]", compact && "text-[15px]", done && "line-through")}>
            {item.href ? (
              <Link href={item.href} className="hover:underline hover:underline-offset-4">
                {item.title}
              </Link>
            ) : (
              item.title
            )}
          </span>
          {meta && <span className={cx("text-[12px]", overdue ? "text-danger" : "text-ink-3")}>{meta}</span>}
          {!compact && item.kind !== "learn" && item.detail && !done && <span className="text-[13px] text-ink-2">{item.detail}</span>}
          {item.locked && <span className="font-mono text-[11px] text-danger">⊘ {item.lockReason}</span>}
          {!compact && item.reviewTopics.length > 1 && !done && (
            <span className="mt-1 flex flex-wrap gap-1.5">
              {item.reviewTopics.slice(0, 6).map((r) => (
                <Link key={r.id} href={`/roadmap/${r.id}`} className="inline-flex h-6 items-center rounded-full border border-line-strong px-2.5 text-[11.5px] text-ink-2 hover:text-ink">
                  {r.title}
                </Link>
              ))}
            </span>
          )}
        </div>
        <span className="font-mono text-[12px] text-ink-3">{compact ? `${item.minutes}m` : `${item.minutes} min`}</span>
        {!compact && !done && (
          <div className="col-start-2 col-end-[-1] flex gap-1.5 sm:col-auto">
            {(item.topicId || item.projectId) && !item.locked && (
              <button
                type="button"
                disabled={pending}
                onClick={() => run(() => startSession({ topicId: item.topicId, projectId: item.projectId, scheduleItemId: item.id }))}
                className={buttonClass("outline", "sm", "h-8 px-3.5 text-[12px]")}
              >
                Start
              </button>
            )}
            <button type="button" onClick={() => setMode(mode === "log" ? "idle" : "log")} className={buttonClass("ghost", "sm", "h-8 px-3 text-[12px]")} aria-expanded={mode === "log"}>
              Log time
            </button>
            <button type="button" onClick={() => setMode(mode === "move" ? "idle" : "move")} className={buttonClass("ghost", "sm", "h-8 px-3 text-[12px]")} aria-expanded={mode === "move"}>
              Move →
            </button>
            {item.kind === "custom" && (
              <button type="button" disabled={pending} onClick={() => run(() => deleteTask(item.id))} className={buttonClass("ghost", "sm", "h-8 px-3 text-[12px] hover:text-danger")}>
                Delete
              </button>
            )}
          </div>
        )}
      </div>
      {mode === "log" && !done && (
        <form autoComplete="off"
          className="mt-3 ml-[42px] flex flex-wrap items-end gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            run(() => completeItem(item.id, Number(minutes)), { onSuccess: () => setMode("idle") });
          }}
        >
          <label className="flex flex-col gap-1">
            <span className="label">Minutes spent</span>
            <input type="number" min={0} max={600} value={minutes} onChange={(e) => setMinutes(e.target.value)} className={cx(inputClass, "tnum h-10 w-28 py-1")} autoFocus />
          </label>
          <button type="submit" disabled={pending} className={buttonClass("ink", "sm", "h-10")}>
            Mark done
          </button>
          <button type="button" onClick={() => setMode("idle")} className={buttonClass("ghost", "sm", "h-10")}>
            Cancel
          </button>
        </form>
      )}
      {mode === "move" && !done && (
        <form autoComplete="off"
          className="mt-3 ml-[42px] flex flex-wrap items-end gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            run(() => rescheduleItem(item.id, date), { onSuccess: () => setMode("idle") });
          }}
        >
          <label className="flex flex-col gap-1">
            <span className="label">Move to</span>
            <input type="date" min={today} value={date} onChange={(e) => setDate(e.target.value)} className={cx(inputClass, "h-10 py-1")} />
          </label>
          <button type="submit" disabled={pending} className={buttonClass("ink", "sm", "h-10")}>
            Move task
          </button>
          <button type="button" onClick={() => setMode("idle")} className={buttonClass("ghost", "sm", "h-10")}>
            Cancel
          </button>
        </form>
      )}
    </li>
  );
}
