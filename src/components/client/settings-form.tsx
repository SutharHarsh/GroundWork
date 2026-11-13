"use client";
import { useEffect, useMemo, useState } from "react";
import { replanNow, updateAvailability } from "@/local/actions/settings";
import { buttonClass, cx } from "@/components/ui";
import { THEME_KEY, applyTheme, usePersistentState, type ThemeChoice } from "@/lib/persistent";
import { useAction } from "./toast";

const COMMON_ZONES = ["Asia/Kolkata", "Europe/London", "America/New_York", "Asia/Singapore", "UTC"];

function HourStepper({ label, noun, value, onChange, min, max, className }: { label: string; noun: string; value: number; onChange: (v: number) => void; min: number; max: number; className?: string }) {
  const set = (v: number) => onChange(Math.round(Math.min(max, Math.max(min, v)) * 2) / 2);
  const btn = "size-[42px] rounded-full border border-line-strong text-[18px] transition-colors hover:border-accent-text disabled:opacity-40";
  return (
    <div className={cx("flex items-center justify-between gap-4 py-6", className)}>
      <div className="flex flex-col gap-1">
        <span className="label">{label}</span>
        <span className="numeral tnum text-[72px] leading-[0.9] text-ink" aria-live="polite">
          {Number.isInteger(value) ? value : value.toFixed(1)}
        </span>
      </div>
      <div className="flex gap-1.5">
        <button type="button" onClick={() => set(value - 0.5)} disabled={value <= min} aria-label={`Fewer ${noun}`} className={btn}>
          −
        </button>
        <button type="button" onClick={() => set(value + 0.5)} disabled={value >= max} aria-label={`More ${noun}`} className={btn}>
          +
        </button>
      </div>
    </div>
  );
}

export function SettingsForm({
  hoursWeekday,
  hoursWeekend,
  timezone,
  split,
}: {
  hoursWeekday: number;
  hoursWeekend: number;
  timezone: string;
  split: { total: number; core: number; stretch: number; continued: number; done: number; hours: number };
}) {
  const [wd, setWd] = useState(hoursWeekday);
  const [we, setWe] = useState(hoursWeekend);
  const [tz, setTz] = useState(timezone);
  const [theme, setTheme] = usePersistentState<ThemeChoice>(THEME_KEY, "system");
  const [pending, run] = useAction();
  const [rebuilt, setRebuilt] = useState("");
  const dirty = wd !== hoursWeekday || we !== hoursWeekend || tz !== timezone;

  useEffect(() => applyTheme(theme), [theme]);

  const zones = useMemo(() => {
    let all: string[] = [];
    try {
      all = (Intl as unknown as { supportedValuesOf?: (k: string) => string[] }).supportedValuesOf?.("timeZone") ?? [];
    } catch {
      all = [];
    }
    const head = Array.from(new Set([timezone, ...COMMON_ZONES]));
    return [...head, ...all.filter((z) => !head.includes(z))];
  }, [timezone]);

  const pct = (n: number) => `${split.total ? (n / split.total) * 100 : 0}%`;
  const rebuild = () =>
    run(() => (dirty ? updateAvailability({ hoursWeekday: wd, hoursWeekend: we, timezone: tz }) : replanNow()), {
      onSuccess: () => {
        const n = new Date();
        setRebuilt(`Plan rebuilt at ${String(n.getHours()).padStart(2, "0")}:${String(n.getMinutes()).padStart(2, "0")}.`);
      },
    });

  return (
    <div className="flex flex-col gap-10">
      <div className="grid grid-cols-1 border-y border-line sm:grid-cols-2">
        <HourStepper label="Weekday hours" noun="weekday hours" value={wd} onChange={setWd} min={0.5} max={12} className="border-line sm:border-r sm:pr-6 max-sm:border-b" />
        <HourStepper label="Weekend hours" noun="weekend hours" value={we} onChange={setWe} min={0} max={14} className="sm:pl-6" />
      </div>

      <div className="flex flex-col gap-3">
        <span className="label">Scope split · {split.total} topics</span>
        <div className="flex h-3 bg-track" role="img" aria-label={`${split.core} topics in this plan, ${split.stretch} stretch goals, ${split.continued} continued learning, ${split.done} already completed`}>
          <div style={{ width: pct(split.done) }} className="bg-ink" />
          <div style={{ width: pct(split.core) }} className="bg-accent" />
          <div style={{ width: pct(split.stretch) }} className="bg-ink-4" />
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-1 text-[13px] text-ink-2">
          {split.done > 0 && <span>{split.done} completed</span>}
          <span>
            <span className="text-accent-text">{split.core}</span> in this plan
          </span>
          <span>{split.stretch} stretch goals</span>
          <span>{split.continued} continued learning (2027)</span>
          <span>≈{split.hours} study hours</span>
        </div>
        {dirty && <p className="text-[13px] text-accent-text">New hours apply when you rebuild the plan below.</p>}
      </div>

      <div className="grid items-center gap-3 border-t border-line pt-5 sm:grid-cols-[200px_minmax(0,1fr)] sm:gap-5">
        <label htmlFor="set-tz" className="text-[15px]">
          Timezone
        </label>
        <select id="set-tz" value={tz} onChange={(e) => setTz(e.target.value)} className="h-11 w-full max-w-[300px] rounded-xl border border-line-strong bg-panel px-3.5 text-[14px] text-ink">
          {zones.map((z) => (
            <option key={z} value={z}>
              {z}
            </option>
          ))}
        </select>
      </div>

      <div className="grid items-center gap-3 border-t border-line pt-5 sm:grid-cols-[200px_minmax(0,1fr)] sm:gap-5">
        <span id="theme-label" className="text-[15px]">
          Theme
        </span>
        <div role="radiogroup" aria-labelledby="theme-label" className="flex gap-1 justify-self-start rounded-full border border-line p-1">
          {(
            [
              ["dark", "Dark"],
              ["light", "Light"],
              ["system", "System"],
            ] as const
          ).map(([k, l]) => (
            <button
              key={k}
              type="button"
              role="radio"
              aria-checked={theme === k}
              onClick={() => setTheme(k)}
              className={cx("h-[34px] rounded-full px-[18px] text-[13px] transition-colors", theme === k ? "bg-ink text-on-ink" : "text-ink-2 hover:text-ink")}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3 border-t border-line pt-5">
        <span className="text-[14px] leading-normal text-ink-2">Changing hours or timezone rebuilds the plan. Unfinished work moves forward; started projects stay frozen. The plan also rebuilds itself once a day.</span>
        <button type="button" onClick={rebuild} disabled={pending} className={buttonClass("accent", "lg", "self-start")}>
          {pending ? "Rebuilding…" : dirty ? "Save and rebuild plan" : "Rebuild plan now"}
        </button>
        {rebuilt && (
          <span role="status" className="text-[13px] text-accent-text">
            {rebuilt}
          </span>
        )}
      </div>
    </div>
  );
}
