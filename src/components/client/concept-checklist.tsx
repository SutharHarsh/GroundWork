"use client";
import { useOptimistic, useTransition } from "react";
import { toggleSubtopic } from "@/local/actions/learning";
import { cx } from "@/components/ui";
import { useToast } from "./toast";

type Sub = { id: string; title: string; concepts: string[]; done: boolean };

export function ConceptChecklist({ subtopics, disabled }: { subtopics: Sub[]; disabled?: boolean }) {
  const toast = useToast();
  const [, start] = useTransition();
  const [items, setOptimistic] = useOptimistic(subtopics, (state, u: { id: string; done: boolean }) => state.map((s) => (s.id === u.id ? { ...s, done: u.done } : s)));
  const done = items.filter((s) => s.done).length;
  return (
    <div className="flex flex-col">
      <div className="flex items-baseline justify-between pb-3">
        <h2 className="label">Concepts</h2>
        <span className="tnum font-mono text-[12px]" aria-live="polite">
          {done} of {items.length}
        </span>
      </div>
      <div className="mb-1.5 h-[3px] bg-track">
        <div className="h-full bg-accent transition-[width] duration-300" style={{ width: `${items.length ? (done / items.length) * 100 : 0}%` }} />
      </div>
      <ul>
        {items.map((s, i) => (
          <li key={s.id}>
            <label className={cx("grid cursor-pointer grid-cols-[24px_32px_minmax(0,1fr)] items-start gap-3 border-b border-line-soft py-4", disabled && "cursor-not-allowed opacity-50")}>
              <input
                type="checkbox"
                className="peer sr-only"
                checked={s.done}
                disabled={disabled}
                onChange={(e) => {
                  const next = e.target.checked;
                  start(async () => {
                    setOptimistic({ id: s.id, done: next });
                    const r = await toggleSubtopic(s.id, next);
                    if (!r.ok) toast("error", r.error);
                  });
                }}
              />
              <span
                aria-hidden="true"
                className={cx(
                  "grid size-5 place-items-center rounded-md border-[1.5px] text-[12px] text-black peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[var(--focus)]",
                  s.done ? "border-accent bg-accent" : "border-ink-4",
                )}
              >
                {s.done ? "✓" : ""}
              </span>
              <span className="pt-0.5 font-mono text-[12px] text-ink-3">{String(i + 1).padStart(2, "0")}</span>
              <span className={cx("flex flex-col gap-1", s.done && "opacity-55")}>
                <span className="text-[17px]">{s.title}</span>
                {s.concepts.length > 0 && (
                  <span className="flex flex-col gap-0.5 text-[14px] leading-normal text-ink-2">
                    {s.concepts.map((c, k) => (
                      <span key={k} className={cx(c.startsWith("— ") && "pl-4 text-ink-3")}>
                        {c.replace(/^— /, "")}
                      </span>
                    ))}
                  </span>
                )}
              </span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
