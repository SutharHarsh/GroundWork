import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Brand } from "@/components/ui";
import { DEADLINE, daysBetween, todayIn } from "@/lib/dates";
import { getSessionUser } from "@/server/auth";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Sign in" };

export default async function LoginPage() {
  if (await getSessionUser()) redirect("/");
  const daysLeft = Math.max(0, daysBetween(todayIn("UTC"), DEADLINE));

  return (
    <main className="relative min-h-dvh overflow-hidden">
      <div aria-hidden="true" className="numeral pointer-events-none absolute -top-[70px] -right-2.5 hidden text-[600px] leading-none text-ink lg:block">
        {daysLeft}
      </div>
      <div className="absolute top-11 left-[clamp(20px,5vw,56px)]">
        <Brand />
      </div>
      <div className="relative box-content flex w-[460px] max-w-full flex-col gap-[30px] px-[clamp(20px,5vw,56px)] pt-[150px] pb-20">
        <h1 className="text-[clamp(56px,9vw,84px)] leading-[0.95] font-extrabold tracking-[-0.03em]">
          {daysLeft} days.
          <br />
          <em className="font-medium text-muted not-italic">Go.</em>
        </h1>
        <LoginForm />
      </div>
    </main>
  );
}
