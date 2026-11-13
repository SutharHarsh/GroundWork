"use client";
import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { completeOnboarding, type OnboardingState } from "@/local/actions/settings";
import { buttonClass } from "@/components/ui";

export function OnboardingForm(props: {
  weekdays: number;
  weekendDays: number;
  totalTopics: number;
  essentialMinutes: number[];
  initialWeekday?: number;
  initialWeekend?: number;
}) {
  const router = useRouter();
  const [state, action, pending] = useActionState<OnboardingState, FormData>(completeOnboarding, {});
  useEffect(() => {
    if (state.done) router.replace("/");
  }, [state.done, router]);
  const [wd, setWd] = useState(props.initialWeekday ?? 3);
  const [we, setWe] = useState(props.initialWeekend ?? 4);
  const tzInput = useRef<HTMLInputElement>(null);
  const tzLabel = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    // The browser's timezone is only known on the client; write it straight into the form.
    const zone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
    if (tzInput.current) tzInput.current.value = zone;
    if (tzLabel.current) tzLabel.current.textContent = zone.toUpperCase();
  }, []);

  // Estimate: weekdays carry learning (~85% after daily review); count essential topics that fit in syllabus order.
  const learnMinutes = props.weekdays * wd * 60 * 0.85;
  let used = 0;
  let fits = 0;
  for (const m of props.essentialMinutes) {
    if (used + m > learnMinutes) break;
    used += m;
    fits++;
  }
  const hours = Math.round(learnMinutes / 60 + props.weekendDays * we);
  const pct = Math.round((fits / Math.max(1, props.totalTopics)) * 100);

  return (
    <form autoComplete="off" action={action} className="flex flex-col gap-12">
      <input ref={tzInput} type="hidden" name="timezone" defaultValue="UTC" />
      <input type="hidden" name="hoursWeekday" value={wd} />
      <input type="hidden" name="hoursWeekend" value={we} />
      <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] border-y border-line">
        <Stepper label={`Weekday hours · ${props.weekdays} days`} value={wd} onChange={setWd} min={0.5} max={12} className="border-line py-8 pr-8 sm:border-r" />
        <Stepper label={`Weekend hours · ${props.weekendDays} days`} value={we} onChange={setWe} min={0} max={14} className="py-8 sm:px-8" />
      </div>
      <div className="flex max-w-[820px] flex-col gap-3.5">
        <p aria-live="polite" className="text-[22px] leading-[1.4]">
          <span className="text-accent-text">
            About {fits} of {props.totalTopics} topics
          </span>{" "}
          fit before December 31, roughly {hours} study hours. {props.totalTopics - fits} move to continued learning.
        </p>
        <div className="flex h-2.5 bg-track">
          <div className="bg-accent transition-[width] duration-300" style={{ width: `${pct}%` }} />
        </div>
        <span className="font-mono text-[12px] text-ink-3">
          TIMEZONE DETECTED · <span ref={tzLabel}>…</span>
        </span>
      </div>
      {state.error && (
        <p role="alert" className="text-[14px] text-danger">
          {state.error}
        </p>
      )}
      <div>
        <button type="submit" disabled={pending} className={buttonClass("accent", "xl")}>
          {pending ? "Building your plan…" : "Build my plan ↗"}
        </button>
      </div>
    </form>
  );
}

export function Stepper({ label, value, onChange, min, max, step = 0.5, className, size = "lg" }: { label: string; value: number; onChange: (v: number) => void; min: number; max: number; step?: number; className?: string; size?: "lg" | "md" }) {
  const set = (v: number) => onChange(Math.round(Math.min(max, Math.max(min, v)) * 2) / 2);
  const btn = size === "lg" ? "size-[52px] text-[22px]" : "size-[42px] text-[18px]";
  return (
    <div className={`flex flex-col gap-3 ${className ?? ""}`}>
      <span className="label">{label}</span>
      <div className="flex items-center gap-6">
        <button type="button" onClick={() => set(value - step)} disabled={value <= min} aria-label={`Fewer ${label.split(" ·")[0].toLowerCase()}`} className={`${btn} rounded-full border border-line-strong transition-colors hover:border-accent-text disabled:opacity-40`}>
          −
        </button>
        <span className={`numeral tnum min-w-[110px] text-center text-ink ${size === "lg" ? "text-[clamp(88px,16vw,140px)]" : "text-[72px]"}`} aria-live="polite">
          {Number.isInteger(value) ? value : value.toFixed(1)}
        </span>
        <button type="button" onClick={() => set(value + step)} disabled={value >= max} aria-label={`More ${label.split(" ·")[0].toLowerCase()}`} className={`${btn} rounded-full border border-line-strong transition-colors hover:border-accent-text disabled:opacity-40`}>
          +
        </button>
      </div>
    </div>
  );
}
