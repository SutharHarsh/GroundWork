"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { stopSession } from "@/local/actions/learning";
import { useAction } from "./toast";

export type TimerInfo = { startedAt: number; label: string; topicId: string | null; projectId: string | null };

export function formatElapsed(sec: number) {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  return h ? `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}` : `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

/** The floating "session running" pill from the design: red dot, title, timer, Stop and log. */
export function SessionPill({ timer }: { timer: TimerInfo }) {
  const [now, setNow] = useState(() => Date.now());
  const [pending, run] = useAction();
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);
  const elapsed = Math.max(0, Math.floor((now - timer.startedAt) / 1000));
  const href = timer.topicId ? `/roadmap/${timer.topicId}` : timer.projectId ? `/projects?p=${timer.projectId}` : "/today";
  return (
    <div
      role="status"
      className="fixed bottom-[88px] left-1/2 z-20 flex max-w-[calc(100%-24px)] -translate-x-1/2 items-center gap-4 rounded-full bg-ink py-2.5 pr-2.5 pl-5 text-on-ink shadow-[0_12px_40px_rgba(0,0,0,.45)] md:bottom-6"
    >
      <span className="animate-live size-[9px] shrink-0 rounded-full bg-danger" aria-hidden="true" />
      <Link href={href} className="max-w-[240px] truncate text-[14px] font-medium hover:underline">
        {timer.label}
      </Link>
      <span className="tnum font-mono text-[15px]" aria-label={`Running for ${formatElapsed(elapsed)}`}>
        {formatElapsed(elapsed)}
      </span>
      <button
        type="button"
        disabled={pending}
        onClick={() => run(() => stopSession(""))}
        className="h-[38px] shrink-0 rounded-full bg-bg px-[18px] text-[13px] whitespace-nowrap text-accent-text disabled:opacity-60"
      >
        Stop and log
      </button>
    </div>
  );
}
