"use client";
import { useState } from "react";
import { addCustomTask, logSession } from "@/local/actions/learning";
import { Field, buttonClass, cx, inputClass } from "@/components/ui";
import { useAction } from "./toast";

type TopicOption = { id: string; label: string };

/** The design's "+ Add your own task" underline row. */
export function QuickAddTask({ date }: { date: string }) {
  const [title, setTitle] = useState("");
  const [minutes, setMinutes] = useState("30");
  const [pending, run] = useAction();
  return (
    <form autoComplete="off"
      className="flex items-center gap-2.5 border-b-2 border-line-strong pb-2 focus-within:border-ink"
      onSubmit={(e) => {
        e.preventDefault();
        if (title.trim().length < 2) return;
        run(() => addCustomTask({ date, title, minutes: Number(minutes) }), { onSuccess: () => setTitle("") });
      }}
    >
      <span className="font-mono text-[14px] text-accent-text" aria-hidden="true">
        +
      </span>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        aria-label="Add your own task"
        placeholder="Add your own task"
        maxLength={140}
        className="h-10 min-w-0 flex-1 border-0 bg-transparent p-0 text-[16px] text-ink outline-none"
      />
      <label className="flex items-center gap-1.5 font-mono text-[11px] text-ink-3">
        <input type="number" min={5} max={600} value={minutes} onChange={(e) => setMinutes(e.target.value)} aria-label="Minutes" className="tnum h-8 w-14 rounded-full border border-line-strong bg-transparent px-2 text-center text-[12px] text-ink outline-none" />
        MIN
      </label>
      <button type="submit" disabled={pending || title.trim().length < 2} className={buttonClass("ink", "sm", "h-[34px] px-4")}>
        Add
      </button>
    </form>
  );
}

export function LogTimeForm({ topics, fixedTopicId, fixedProjectId }: { topics?: TopicOption[]; fixedTopicId?: string; fixedProjectId?: string }) {
  const [topicId, setTopicId] = useState(fixedTopicId ?? "");
  const [minutes, setMinutes] = useState("30");
  const [note, setNote] = useState("");
  const [pending, run] = useAction();
  const id = (s: string) => `log-${s}-${fixedTopicId ?? fixedProjectId ?? "x"}`;
  return (
    <form autoComplete="off"
      className="flex flex-col gap-3.5"
      onSubmit={(e) => {
        e.preventDefault();
        run(() => logSession({ topicId: topicId || null, projectId: fixedProjectId ?? null, minutes: Number(minutes), note }), { onSuccess: () => setNote("") });
      }}
    >
      {!fixedTopicId && topics && (
        <Field label="Topic" htmlFor={id("topic")}>
          <select id={id("topic")} value={topicId} onChange={(e) => setTopicId(e.target.value)} className={inputClass}>
            <option value="">General study (no topic)</option>
            {topics.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
        </Field>
      )}
      <Field label="Minutes" htmlFor={id("min")}>
        <input id={id("min")} type="number" min={1} max={600} required value={minutes} onChange={(e) => setMinutes(e.target.value)} className={cx(inputClass, "tnum")} />
      </Field>
      <Field label="What did you do? (optional)" htmlFor={id("note")}>
        <textarea id={id("note")} rows={2} value={note} onChange={(e) => setNote(e.target.value)} className={inputClass} />
      </Field>
      <button type="submit" disabled={pending} className={buttonClass("ink", "md", "self-start")}>
        Log time
      </button>
    </form>
  );
}
