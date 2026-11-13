"use client";
import { useState } from "react";
import { saveProjectWork, setProjectStatus } from "@/local/actions/work";
import { RATING_LABELS } from "@/lib/mastery";
import { Field, buttonClass, cx, inputClass } from "@/components/ui";
import { useAction } from "./toast";

export function StartProjectButton({ projectId }: { projectId: string }) {
  const [pending, run] = useAction();
  return (
    <button type="button" disabled={pending} onClick={() => run(() => setProjectStatus(projectId, "in_progress"))} className={buttonClass("accent", "lg", "h-12")}>
      Start project
    </button>
  );
}

export function ProjectWork({
  projectId,
  status,
  criteria,
  initial,
  proofCount,
}: {
  projectId: string;
  status: string;
  criteria: string[];
  initial: { deliverableText: string; reflection: string; skills: string; selfAssessment: Record<string, number> };
  proofCount: number;
}) {
  const [deliverableText, setDeliverable] = useState(initial.deliverableText);
  const [reflection, setReflection] = useState(initial.reflection);
  const [skills, setSkills] = useState(initial.skills);
  const [selfAssessment, setSA] = useState<Record<string, number>>(initial.selfAssessment);
  const [pending, run] = useAction();
  const dirty =
    deliverableText !== initial.deliverableText || reflection !== initial.reflection || skills !== initial.skills || JSON.stringify(selfAssessment) !== JSON.stringify(initial.selfAssessment);
  const gate = [
    { ok: deliverableText.trim().length >= 20, t: "Deliverable described" },
    { ok: proofCount > 0, t: "Proof of work attached" },
    { ok: criteria.every((_, i) => selfAssessment[String(i)]), t: "Self-assessment on every criterion" },
    { ok: reflection.trim().length >= 40, t: "Reflection written" },
    { ok: skills.trim().length >= 3, t: "Skills demonstrated" },
  ];
  const canSubmit = gate.every((g) => g.ok) && !dirty;
  const locked = status === "completed";

  return (
    <div className="flex flex-col gap-6">
      <fieldset disabled={locked} className="flex flex-col gap-5">
        <Field label="Deliverable" htmlFor={`pw-d-${projectId}`} hint="What did you build or design? Put links in proof of work.">
          <textarea id={`pw-d-${projectId}`} rows={3} value={deliverableText} onChange={(e) => setDeliverable(e.target.value)} className={inputClass} />
        </Field>
        <div className="flex flex-col gap-2">
          <span className="label">Self-assessment</span>
          {criteria.map((c, i) => (
            <div key={i} role="radiogroup" aria-label={c} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-line-soft py-2.5">
              <span className="text-[14px] text-ink-2">{c}</span>
              <div className="flex gap-1.5">
                {[1, 2, 3, 4].map((v) => {
                  const on = selfAssessment[String(i)] === v;
                  return (
                    <button
                      key={v}
                      type="button"
                      role="radio"
                      aria-checked={on}
                      title={RATING_LABELS[v]}
                      onClick={() => setSA((s) => ({ ...s, [String(i)]: v }))}
                      className={cx("grid size-8 place-items-center rounded-full border font-mono text-[12px]", on ? "border-transparent bg-ink text-on-ink" : "border-line-strong text-ink-2")}
                    >
                      {v}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
          <span className="font-mono text-[10px] text-ink-3">1 NOT YET · 2 WITH HELP · 3 INDEPENDENTLY · 4 COULD TEACH IT</span>
        </div>
        <Field label="Reflection" htmlFor={`pw-r-${projectId}`}>
          <textarea id={`pw-r-${projectId}`} rows={3} value={reflection} onChange={(e) => setReflection(e.target.value)} className={inputClass} placeholder="What went well, what was hard, what you'd do differently." />
        </Field>
        <Field label="Skills demonstrated" htmlFor={`pw-s-${projectId}`}>
          <input id={`pw-s-${projectId}`} value={skills} onChange={(e) => setSkills(e.target.value)} className={inputClass} placeholder="CSS Grid, accessible forms, error states" />
        </Field>
      </fieldset>

      <div className="flex flex-col gap-2">
        <span className="label">To submit</span>
        {gate.map((g) => (
          <span key={g.t} className="text-[13px]" style={{ color: g.ok ? "var(--accent-text)" : "var(--ink-4)" }}>
            {g.ok ? "✓" : "○"} <span className="text-ink-2">{g.t}</span>
          </span>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {!locked && (
          <button type="button" disabled={pending || !dirty} onClick={() => run(() => saveProjectWork(projectId, { deliverableText, reflection, skills, selfAssessment }))} className={buttonClass("ink", "md")}>
            Save progress
          </button>
        )}
        {(status === "planned" || status === "in_progress") && (
          <button type="button" disabled={pending || !canSubmit} onClick={() => run(() => setProjectStatus(projectId, "submitted"))} title={dirty ? "Save your changes first" : undefined} className={buttonClass("accent", "md")}>
            Submit project
          </button>
        )}
        {status === "submitted" && (
          <button type="button" disabled={pending} onClick={() => run(() => setProjectStatus(projectId, "under_review"))} className={buttonClass("outline", "md")}>
            Mark under review
          </button>
        )}
        {(status === "submitted" || status === "under_review") && (
          <button type="button" disabled={pending} onClick={() => run(() => setProjectStatus(projectId, "completed"))} className={buttonClass("accent", "md")}>
            Mark completed
          </button>
        )}
        {(status === "submitted" || status === "under_review" || status === "completed") && (
          <button type="button" disabled={pending} onClick={() => run(() => setProjectStatus(projectId, "in_progress"))} className={buttonClass("ghost", "md")}>
            Reopen
          </button>
        )}
      </div>
    </div>
  );
}
