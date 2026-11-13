"use client";
import { eq } from "drizzle-orm";
import { db, t } from "@/db";
import { Brand } from "@/components/ui";
import { DEADLINE, dateRange, isWeekend, todayIn } from "@/lib/dates";
import { useLocal } from "@/local/hooks";
import { getPath } from "@/local/data";
import { FullLoading } from "@/components/client/local-provider";
import { OnboardingForm } from "./onboarding-form";

export function WelcomeView() {
  const data = useLocal(async (user) => {
    const [path, topics, domains] = await Promise.all([
      getPath(user.pathId),
      db.select().from(t.topics).where(eq(t.topics.pathId, user.pathId)).orderBy(t.topics.sort).all(),
      db.select().from(t.domains).where(eq(t.domains.pathId, user.pathId)).all(),
    ]);
    const special = new Set(domains.filter((d) => d.isSpecialization).map((d) => d.id));
    const essential = topics.filter((x) => x.tier === "essential" && !special.has(x.domainId));
    const days = dateRange(todayIn(user.timezone), DEADLINE);
    const weekdays = days.filter((d) => !isWeekend(d)).length;
    return { user, path, topics, essential, days, weekdays };
  }, []);
  if (!data) return <FullLoading />;
  const { user, path, topics, essential, days, weekdays } = data;

  return (
    <main className="flex min-h-dvh flex-col gap-12 px-[clamp(20px,5vw,56px)] pt-11 pb-14">
      <div className="flex items-center justify-between">
        <Brand />
        <span className="font-mono text-[12px] text-ink-3">{user.onboardedAt ? "SETTINGS" : "SETUP · 1 OF 1"}</span>
      </div>
      <div className="flex max-w-[820px] flex-col gap-3.5">
        <span className="font-mono text-[12px] text-accent-text uppercase">
          Welcome, {user.name.split(" ")[0]} · {path.role}
        </span>
        <h1 className="text-[clamp(44px,7vw,72px)] leading-none font-extrabold tracking-[-0.03em] text-pretty">
          How much time can you <em className="font-medium text-muted not-italic">really</em> give this?
        </h1>
        <p className="max-w-[600px] text-[17px] leading-[1.55] text-ink-2">
          Be honest. The plan only schedules what fits, and the rest moves to continued learning in 2027. You can change this later in Settings.
        </p>
      </div>
      <OnboardingForm
        weekdays={weekdays}
        weekendDays={days.length - weekdays}
        totalTopics={topics.length}
        essentialMinutes={essential.map((x) => x.estMinutes)}
        initialWeekday={user.hoursWeekday ?? undefined}
        initialWeekend={user.hoursWeekend ?? undefined}
      />
    </main>
  );
}
