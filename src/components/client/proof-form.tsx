"use client";
import { useRef, useState } from "react";
import { createProof } from "@/local/actions/work";
import { PROOF_TYPES } from "@/lib/status";
import { Field, buttonClass, inputClass } from "@/components/ui";
import { useAction } from "./toast";

type Option = { id: string; label?: string; title?: string };

/** One-line "paste a link" attach from the design. Detects GitHub / Figma / video links. */
export function ProofQuickAttach({ topicId, projectId, topicTitle }: { topicId?: string; projectId?: string; topicTitle?: string }) {
  const [url, setUrl] = useState("");
  const [err, setErr] = useState("");
  const [pending, run] = useAction();
  return (
    <div className="flex flex-col gap-1.5">
      <form autoComplete="off"
        noValidate
        className="flex items-center gap-2.5 border-b-2 border-line-strong pb-2 focus-within:border-ink"
        onSubmit={(e) => {
          e.preventDefault();
          let parsed: URL;
          try {
            parsed = new URL(url.trim());
            if (!/^https?:$/.test(parsed.protocol)) throw new Error();
          } catch {
            setErr("Paste a full link starting with https://");
            return;
          }
          setErr("");
          const host = parsed.hostname.replace(/^www\./, "");
          const type = /github\.com$/.test(host) ? "github" : /figma\.com$/.test(host) ? "figma" : /(youtube\.com|youtu\.be|loom\.com|vimeo\.com)$/.test(host) ? "video" : "live";
          const fd = new FormData();
          fd.set("title", `${host}${parsed.pathname.replace(/\/$/, "")}`.slice(0, 160) || host);
          fd.set("type", type);
          fd.set("url", parsed.toString());
          fd.set("description", topicTitle ? `Evidence for ${topicTitle}` : "");
          if (topicId) fd.set("topicId", topicId);
          if (projectId) fd.set("projectId", projectId);
          run(() => createProof(fd), { onSuccess: () => setUrl("") });
        }}
      >
        <input
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            setErr("");
          }}
          aria-label="Proof link"
          inputMode="url"
          placeholder="https://github.com/… or a live link"
          className="h-10 min-w-0 flex-1 border-0 bg-transparent p-0 text-[16px] text-ink outline-none"
        />
        <button type="submit" disabled={pending || !url.trim()} className={buttonClass("ink", "sm", "h-[34px] px-4")}>
          Attach
        </button>
      </form>
      {err && (
        <span role="alert" className="text-[13px] text-danger">
          {err}
        </span>
      )}
    </div>
  );
}

/** Full evidence form: links, uploads (screenshots, PDFs, documents) and written explanations. */
export function ProofForm({
  pathId,
  fixedTopic,
  fixedProject,
  topics,
  projects,
  uploadsEnabled = true,
  maxMb = 15,
  onDone,
}: {
  pathId: string;
  fixedTopic?: { id: string; label: string };
  fixedProject?: { id: string; title: string };
  topics?: Option[];
  projects?: Option[];
  uploadsEnabled?: boolean;
  maxMb?: number;
  onDone?: () => void;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [type, setType] = useState(pathId === "designer" ? "figma" : "github");
  const [fileName, setFileName] = useState("");
  const [pending, run] = useAction();
  const types = PROOF_TYPES.filter((p) => uploadsEnabled || p.needs !== "file");
  const kind = types.find((p) => p.value === type) ?? types[0];
  const id = (s: string) => `proof-${fixedTopic?.id ?? fixedProject?.id ?? "new"}-${s}`;
  const accept = type === "image" ? "image/png,image/jpeg,image/webp,image/gif" : type === "pdf" ? "application/pdf" : ".pdf,.doc,.docx,.ppt,.pptx,.key,.txt,.md,.png,.jpg,.jpeg,.webp,.fig,.zip";

  return (
    <form autoComplete="off"
      ref={formRef}
      className="flex flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        run(() => createProof(fd), {
          onSuccess: () => {
            formRef.current?.reset();
            setFileName("");
            onDone?.();
          },
        });
      }}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Title" htmlFor={id("title")}>
          <input id={id("title")} name="title" required minLength={3} maxLength={160} className={inputClass} placeholder={pathId === "designer" ? "Type scale and color system" : "Responsive grid layout demo"} />
        </Field>
        <Field label="Evidence type" htmlFor={id("type")}>
          <select id={id("type")} name="type" value={kind.value} onChange={(e) => setType(e.target.value)} className={inputClass}>
            {types.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </Field>
      </div>
      {kind.needs === "url" && (
        <Field label="Link" htmlFor={id("url")}>
          <input id={id("url")} name="url" type="url" required inputMode="url" placeholder="https://" className={inputClass} />
        </Field>
      )}
      {kind.needs === "file" && (
        <Field label="File" htmlFor={id("file")} hint={`Up to ${maxMb} MB. Private to your account.`}>
          <label htmlFor={id("file")} className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-line-strong px-3.5 py-3 text-[14px] text-ink-2 hover:border-ink">
            <span className="font-mono text-accent-text" aria-hidden="true">
              +
            </span>
            <span className="truncate">{fileName || "Choose a file or take a photo"}</span>
            <input id={id("file")} name="file" type="file" required accept={accept} className="sr-only" onChange={(e) => setFileName(e.target.files?.[0]?.name ?? "")} />
          </label>
        </Field>
      )}
      <Field label={kind.needs === "text" ? (type === "reflection" ? "Reflection" : "Explanation") : "Description"} htmlFor={id("description")} hint={kind.needs === "text" ? "A few sentences: what you did, how, and what you'd change." : undefined}>
        <textarea id={id("description")} name="description" rows={kind.needs === "text" ? 6 : 3} required={kind.needs === "text"} minLength={kind.needs === "text" ? 40 : 0} className={inputClass} />
      </Field>
      {fixedTopic ? (
        <input type="hidden" name="topicId" value={fixedTopic.id} />
      ) : (
        topics && (
          <Field label="Related topic" htmlFor={id("topic")}>
            <select id={id("topic")} name="topicId" className={inputClass} defaultValue="">
              <option value="">None</option>
              {topics.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label ?? t.title}
                </option>
              ))}
            </select>
          </Field>
        )
      )}
      {fixedProject ? (
        <input type="hidden" name="projectId" value={fixedProject.id} />
      ) : (
        projects && (
          <Field label="Related project" htmlFor={id("project")}>
            <select id={id("project")} name="projectId" className={inputClass} defaultValue="">
              <option value="">None</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title ?? p.label}
                </option>
              ))}
            </select>
          </Field>
        )
      )}
      <Field label="Personal reflection (optional)" htmlFor={id("reflection")}>
        <textarea id={id("reflection")} name="reflection" rows={2} className={inputClass} placeholder="What was hard? What would you do differently?" />
      </Field>
      <button type="submit" disabled={pending} className={buttonClass("accent", "md", "self-start")}>
        {pending ? "Saving…" : "Save proof of work"}
      </button>
    </form>
  );
}
