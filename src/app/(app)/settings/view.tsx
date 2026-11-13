"use client";
import { useLocal } from "@/local/hooks";
import type { SessionUser } from "@/local/auth";
import { PageLoading } from "@/components/client/local-provider";
import { PageTitle } from "@/components/ui";
import { SettingsForm } from "@/components/client/settings-form";
import { BackupPanel } from "@/components/client/backup-panel";
import { getPath, getPathTree } from "@/local/data";
import { isDone } from "@/lib/status";

async function build(user: SessionUser) {
  const [path, tree] = await Promise.all([getPath(user.pathId), getPathTree(user.id, user.pathId)]);
  const topics = tree.flatMap((d) => d.topics);
  const remaining = topics.filter((x) => !isDone(x.status));
  const count = (b: string) => remaining.filter((x) => x.bucket === b).length;
  const coreMinutes = remaining.filter((x) => x.bucket === "core").reduce((n, x) => n + x.estMinutes, 0);
  return (
    <div className="flex max-w-[880px] flex-col gap-10">
      <PageTitle eyebrow="Settings" title="Your" muted="availability." />
      <SettingsForm
        hoursWeekday={user.hoursWeekday ?? 3}
        hoursWeekend={user.hoursWeekend ?? 4}
        timezone={user.timezone}
        split={{ total: topics.length, core: count("core"), stretch: count("stretch"), continued: count("continued"), done: topics.length - remaining.length, hours: Math.round(coreMinutes / 60) }}
      />
      {user.planNote && <p className="text-[13px] text-ink-3">{user.planNote}</p>}
      <BackupPanel />
      <section aria-labelledby="account" className="flex flex-col gap-2 border-t border-line pt-5">
        <h2 id="account" className="label">
          Account
        </h2>
        <p className="text-[14px] text-ink-2">
          Signed in as <strong className="font-semibold text-ink">{user.name}</strong>, {path.role}. Your learning data stays in this browser.
        </p>
        <p className="font-mono text-[11px] text-ink-3">SYLLABUS · {path.sourceFile}</p>
      </section>
    </div>
  );
}

export default function View() {
  const node = useLocal((user) => build(user), []);
  return node ?? <PageLoading />;
}
