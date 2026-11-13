"use client";
import { useRef, useState } from "react";
import { exportBackup, importBackup } from "@/local/store";
import { buttonClass } from "@/components/ui";
import { useToast } from "./toast";

/** Download / restore everything this learner has added. The data lives only in this browser. */
export function BackupPanel() {
  const toast = useToast();
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const download = async () => {
    setBusy(true);
    try {
      const { fileName, blob } = await exportBackup();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      toast("ok", "Backup downloaded");
    } catch (e) {
      toast("error", e instanceof Error ? e.message : "Couldn't create the backup.");
    } finally {
      setBusy(false);
    }
  };

  const restore = async (file: File | undefined) => {
    if (!file) return;
    if (!window.confirm("Restoring replaces everything currently saved in this browser with the backup. Continue?")) return;
    setBusy(true);
    try {
      toast("ok", await importBackup(await file.text()));
    } catch (e) {
      toast("error", e instanceof Error ? e.message : "Couldn't restore that backup.");
    } finally {
      setBusy(false);
      if (input.current) input.current.value = "";
    }
  };

  return (
    <section aria-labelledby="backup" className="flex flex-col gap-3 border-t border-line pt-5">
      <h2 id="backup" className="text-[15px]">
        Your data
      </h2>
      <p className="max-w-[640px] text-[14px] leading-normal text-ink-2">
        Everything you add is saved only in this browser. Download a backup regularly, and use it to restore your progress or move it to another device or browser.
      </p>
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={download} disabled={busy} className={buttonClass("ink", "md")}>
          Download backup
        </button>
        <button type="button" onClick={() => input.current?.click()} disabled={busy} className={buttonClass("outline", "md")}>
          Restore from backup
        </button>
        <input ref={input} type="file" accept="application/json,.json" className="sr-only" aria-label="Backup file" onChange={(e) => restore(e.target.files?.[0])} />
      </div>
    </section>
  );
}
