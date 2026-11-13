import { commit } from "../store";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db, t } from "@/db";
import { safeZone } from "@/lib/dates";
import { requireOnboardedUser, requireUser } from "../auth";
import { ActionError, run } from "../guards";
import { rebuildPlan } from "../planner";

const availability = z.object({
  hoursWeekday: z.coerce.number().min(0.5, "Plan at least 30 minutes on weekdays.").max(12, "12 hours a day is the maximum."),
  hoursWeekend: z.coerce.number().min(0, "Weekend hours can't be negative.").max(14, "14 hours a day is the maximum."),
  timezone: z.string().min(1).max(64),
});

export type OnboardingState = { error?: string; done?: boolean };

export async function completeOnboarding(_prev: OnboardingState, formData: FormData): Promise<OnboardingState> {
  const user = await requireUser();
  const parsed = availability.safeParse({
    hoursWeekday: formData.get("hoursWeekday"),
    hoursWeekend: formData.get("hoursWeekend"),
    timezone: formData.get("timezone") || "UTC",
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  await db.update(t.users)
    .set({
      hoursWeekday: parsed.data.hoursWeekday,
      hoursWeekend: parsed.data.hoursWeekend,
      timezone: safeZone(parsed.data.timezone),
      onboardedAt: user.onboardedAt ?? Date.now(),
      lastPlanDate: null,
    })
    .where(eq(t.users.id, user.id))
    .run();
  await rebuildPlan(user.id);
  commit();
  return { done: true };
}

export async function updateAvailability(input: { hoursWeekday: number; hoursWeekend: number; timezone: string }) {
  return run(async () => {
    const user = await requireOnboardedUser();
    const parsed = availability.safeParse(input);
    if (!parsed.success) throw new ActionError(parsed.error.issues[0].message);
    await db.update(t.users)
      .set({ hoursWeekday: parsed.data.hoursWeekday, hoursWeekend: parsed.data.hoursWeekend, timezone: safeZone(parsed.data.timezone) })
      .where(eq(t.users.id, user.id))
      .run();
    const r = await rebuildPlan(user.id);
    return r ? `Plan rebuilt: ${r.core + r.stretch} topics scheduled, ${r.continued} continued learning` : "Saved";
  });
}

export async function replanNow() {
  return run(async () => {
    const user = await requireOnboardedUser();
    const r = await rebuildPlan(user.id);
    return r ? `Plan rebuilt: ${r.core + r.stretch} topics scheduled, ${r.continued} continued learning` : "Plan rebuilt";
  });
}
