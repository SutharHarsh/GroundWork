"use client";
import { useState } from "react";
import { saveTopicNotes } from "@/local/actions/learning";
import { useAction } from "./toast";

export function NotesEditor({ topicId, initial }: { topicId: string; initial: string }) {
  const [value, setValue] = useState(initial);
  const [saved, setSaved] = useState(initial);
  const [pending, run] = useAction();
  const dirty = value !== saved;
  const save = () => run(() => saveTopicNotes(topicId, value), { onSuccess: () => setSaved(value), silent: true });
  return (
    <div className="flex flex-col gap-2">
      <textarea
        id={`notes-${topicId}`}
        aria-label="Notes"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={() => dirty && save()}
        placeholder="Write what you understood, in your own words…"
        className="min-h-[140px] resize-y rounded-[14px] border border-line bg-transparent p-[18px] text-[17px] leading-[1.55] text-ink outline-none focus:border-line-strong"
      />
      <div className="flex items-center justify-between font-mono text-[11px] text-ink-3">
        <span aria-live="polite">{pending ? "SAVING…" : dirty ? "UNSAVED CHANGES" : "SAVED"}</span>
        <button type="button" onClick={save} disabled={!dirty || pending} className="uppercase hover:text-ink disabled:opacity-40">
          Save notes
        </button>
      </div>
    </div>
  );
}
