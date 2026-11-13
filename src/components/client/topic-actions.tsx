"use client";
import { setTopicStatus } from "@/local/actions/learning";
import { Button } from "@/components/ui";
import { useAction } from "./toast";

/** Status controls shown under the concept checklist. Mastery is only earned through the assessment. */
export function TopicActions({ topicId, status, conceptsDone, conceptsTotal }: { topicId: string; status: string; conceptsDone: number; conceptsTotal: number }) {
  const [pending, run] = useAction();
  const set = (s: string) => run(() => setTopicStatus(topicId, s));
  const allChecked = conceptsTotal === 0 || conceptsDone >= conceptsTotal;
  return (
    <div className="mt-[18px] flex flex-wrap items-center gap-2">
      {status === "not_started" && (
        <Button variant="ink" size="md" disabled={pending} onClick={() => set("learning")}>
          Start learning
        </Button>
      )}
      {(status === "learning" || status === "practiced" || status === "not_started") && (
        <Button variant={allChecked ? "ink" : "outline"} size="md" disabled={pending} onClick={() => set("completed")} title={allChecked ? undefined : "You can complete it now, but ticking every concept first is the honest bar."}>
          Mark as completed
        </Button>
      )}
      {status === "learning" && (
        <Button variant="ghost" size="md" disabled={pending} onClick={() => set("practiced")}>
          I&apos;ve practiced this
        </Button>
      )}
      {status === "needs_revision" && (
        <Button variant="ink" size="md" disabled={pending} onClick={() => set("completed")}>
          Revised, mark completed
        </Button>
      )}
      {(status === "completed" || status === "mastered") && (
        <Button variant="outline" size="md" disabled={pending} onClick={() => set("needs_revision")}>
          Flag for revision
        </Button>
      )}
      {status === "completed" && (
        <Button variant="ghost" size="md" disabled={pending} onClick={() => set("learning")}>
          Reopen
        </Button>
      )}
      {!allChecked && status !== "completed" && status !== "mastered" && (
        <span className="text-[12px] text-ink-3">
          {conceptsDone} of {conceptsTotal} concepts checked
        </span>
      )}
    </div>
  );
}
