"use client";
import { useState } from "react";
import { submitMastery } from "@/local/actions/learning";
import { MASTERY_THRESHOLD, MIN_EXPLANATION_CHARS, RATING_LABELS, type Criterion } from "@/lib/mastery";
import { buttonClass, cx } from "@/components/ui";
import { useAction } from "./toast";

export function MasteryForm({ topicId, criteria, status, proofs }: { topicId: string; criteria: Criterion[]; status: string; proofs: { id: string; title: string; type: string; linked: boolean }[] }) {
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [explanation, setExplanation] = useState("");
  // Linked proofs are selected by default (including ones added after this form mounted); user choices override.
  const [overrides, setOverrides] = useState<Record<string, boolean>>({});
  const selected = new Set(proofs.filter((p) => overrides[p.id] ?? p.linked).map((p) => p.id));
  const [pending, run] = useAction();
  const ready = ["completed", "needs_revision"].includes(status);
  const allRated = criteria.every((c) => ratings[c.key]);
  const len = explanation.trim().length;
  const canSubmit = ready && allRated && len >= MIN_EXPLANATION_CHARS;
  const sorted = [...proofs].sort((a, b) => Number(b.linked) - Number(a.linked));

  const note =
    status === "mastered"
      ? "Mastered, with evidence on record. If it gets rusty, flag it for revision and reassess."
      : ready
        ? "Rate yourself honestly. Every criterion at 3 or above, a written explanation and linked proof of work earn mastery."
        : "Locked until the topic is completed. Mastery is assessed separately, with evidence.";

  return (
    <section aria-labelledby="mastery-title" className="flex flex-col gap-[18px] rounded-[20px] border border-accent p-7">
      <div className="flex flex-col gap-1.5">
        <h2 id="mastery-title" className="text-[34px] font-extrabold tracking-[-0.02em]">
          Mastery assessment
        </h2>
        <p className="text-[14px] leading-normal text-ink-2">{note}</p>
      </div>
      {status !== "mastered" && (
        <form autoComplete="off"
          className="flex flex-col"
          onSubmit={(e) => {
            e.preventDefault();
            if (!canSubmit) return;
            run(() => submitMastery({ topicId, ratings, explanation, proofIds: [...selected] }), {
              onSuccess: () => {
                setRatings({});
                setExplanation("");
              },
            });
          }}
        >
          <fieldset disabled={!ready} className={cx("flex flex-col", !ready && "opacity-35")}>
            {criteria.map((c) => {
              const v = ratings[c.key];
              return (
                <div key={c.key} role="radiogroup" aria-label={c.label} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3.5 border-b border-line-soft py-3 sm:grid-cols-[minmax(0,1fr)_auto_110px]">
                  <span className="text-[15px]" title={c.prompt}>
                    {c.label}
                  </span>
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4].map((n) => {
                      const on = v === n;
                      return (
                        <button
                          key={n}
                          type="button"
                          role="radio"
                          aria-checked={on}
                          title={RATING_LABELS[n]}
                          onClick={() => setRatings((r) => ({ ...r, [c.key]: n }))}
                          className="grid size-9 place-items-center rounded-full border font-mono text-[13px] transition-colors"
                          style={{
                            background: on ? (n >= MASTERY_THRESHOLD ? "var(--accent)" : "var(--danger)") : "transparent",
                            color: on ? "#000" : "var(--ink-2)",
                            borderColor: on ? "transparent" : "var(--line-strong)",
                          }}
                        >
                          {n}
                        </button>
                      );
                    })}
                  </div>
                  <span className="hidden text-right font-mono text-[11px] text-ink-3 sm:block">{v ? RATING_LABELS[v] : "—"}</span>
                </div>
              );
            })}
            <textarea
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              aria-label="Written explanation"
              placeholder={`Explain the topic as if teaching it. At least ${MIN_EXPLANATION_CHARS} characters.`}
              className="mt-4 min-h-[100px] resize-y rounded-xl border border-line bg-transparent p-3.5 text-[15px] leading-normal text-ink outline-none focus:border-line-strong"
            />
            <span className="mt-1.5 font-mono text-[11px] text-ink-3">
              {len} / {MIN_EXPLANATION_CHARS} CHARACTERS
            </span>
            <div className="mt-4 flex flex-col gap-2">
              <span className="label">Evidence</span>
              {sorted.length ? (
                <ul className="flex max-h-48 flex-col overflow-auto">
                  {sorted.map((p) => (
                    <li key={p.id}>
                      <label className="flex cursor-pointer items-center gap-3 border-b border-line-soft py-2.5 text-[14px]">
                        <input type="checkbox" checked={selected.has(p.id)} onChange={(e) => setOverrides((o) => ({ ...o, [p.id]: e.target.checked }))} className="size-4 accent-[var(--accent)]" />
                        <span className="min-w-0 flex-1 truncate">{p.title}</span>
                        {p.linked && <span className="font-mono text-[10px] text-ink-3">LINKED</span>}
                      </label>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-[13px] text-danger">Attach proof of work above first. Mastery can&apos;t be claimed without evidence.</p>
              )}
            </div>
          </fieldset>
          <p className="mt-4 text-[13px] text-ink-3" aria-live="polite">
            {!ready ? "" : !allRated ? "Rate every criterion." : len < MIN_EXPLANATION_CHARS ? "Write a little more." : selected.size === 0 ? "Will be saved and flagged for revision until evidence is attached." : criteria.every((c) => (ratings[c.key] ?? 0) >= MASTERY_THRESHOLD) ? "This meets the mastery bar." : "Saved and flagged for revision on the criteria below 3."}
          </p>
          <button type="submit" disabled={pending || !canSubmit} className={buttonClass("accent", "lg", "mt-3 self-start")}>
            Submit assessment
          </button>
        </form>
      )}
    </section>
  );
}
