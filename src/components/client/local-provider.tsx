"use client";
import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { AuthUser } from "@/lib/users";
import { commit, currentUser, openLocalDb } from "@/local/store";
import { ensureFreshPlan } from "@/local/planner";
import { buttonClass } from "@/components/ui";

/**
 * Opens the learner's local database (syllabus from the server + their own data from localStorage)
 * before rendering anything that reads it. Inside the app it also enforces onboarding and refreshes
 * the daily plan.
 */
export function LocalProvider({ user, contentVersion, requireOnboarded, children }: { user: AuthUser; contentVersion: string; requireOnboarded: boolean; children: ReactNode }) {
  const router = useRouter();
  const [phase, setPhase] = useState<"loading" | "ready" | { error: string }>("loading");

  useEffect(() => {
    let alive = true;
    (async () => {
      await openLocalDb(user, contentVersion);
      const me = currentUser();
      if (requireOnboarded) {
        if (!me.onboardedAt || !me.hoursWeekday) {
          router.replace("/welcome");
          return;
        }
        const before = me.lastPlanDate;
        await ensureFreshPlan(me);
        if (currentUser().lastPlanDate !== before) commit();
      }
      if (alive) setPhase("ready");
    })().catch((e: unknown) => {
      if (alive) setPhase({ error: e instanceof Error ? e.message : String(e) });
    });
    return () => {
      alive = false;
    };
  }, [user, contentVersion, requireOnboarded, router]);

  if (phase === "ready") return children;
  if (phase !== "loading")
    return (
      <div className="grid min-h-dvh place-items-center px-6">
        <div className="flex max-w-md flex-col gap-4">
          <h1 className="text-[28px] font-extrabold">Groundwork couldn&apos;t open your data.</h1>
          <p className="text-[15px] text-ink-2">{phase.error}</p>
          <button type="button" onClick={() => window.location.reload()} className={buttonClass("accent", "md", "self-start")}>
            Try again
          </button>
        </div>
      </div>
    );
  return <FullLoading />;
}

export function FullLoading() {
  return (
    <div className="grid min-h-dvh place-items-center" role="status" aria-live="polite">
      <span className="animate-live font-mono text-[12px] text-ink-3">LOADING YOUR PLAN…</span>
    </div>
  );
}

export function PageLoading() {
  return (
    <div className="py-24" role="status" aria-live="polite">
      <span className="animate-live font-mono text-[12px] text-ink-3">LOADING…</span>
    </div>
  );
}

export function NotFoundNote() {
  return (
    <div className="flex flex-col gap-4 py-16">
      <h1 className="text-[40px] font-extrabold tracking-[-0.02em]">That topic isn&apos;t in your path.</h1>
      <Link href="/roadmap" className={buttonClass("ink", "md", "self-start")}>
        Back to the roadmap
      </Link>
    </div>
  );
}
