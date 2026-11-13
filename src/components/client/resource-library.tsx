"use client";
import { useMemo, useState } from "react";
import { updateResourceState } from "@/local/actions/work";
import { buttonClass, cx, inputClass } from "@/components/ui";
import { usePersistentState } from "@/lib/persistent";
import { useAction } from "./toast";

type Resource = {
  id: string;
  name: string;
  url: string;
  extraUrls: string[];
  creator: string;
  type: string;
  what: string;
  category: string;
  section: string;
  domainId: string | null;
  domainLabel: string | null;
  bookmarked: boolean;
  read: boolean;
  note: string;
};

export function ResourceLibrary({ resources, categories, domains, initialDomain }: { resources: Resource[]; categories: string[]; domains: { id: string; label: string }[]; initialDomain: string }) {
  const [cat, setCat] = usePersistentState("resources.category", "All");
  const [show, setShow] = usePersistentState<"all" | "saved" | "unread">("resources.show", "all");
  const [domain, setDomain] = useState(initialDomain);
  const [q, setQ] = useState("");
  const counts = useMemo(() => {
    const m = new Map<string, number>();
    for (const r of resources) m.set(r.category, (m.get(r.category) ?? 0) + 1);
    return m;
  }, [resources]);
  const query = q.trim().toLowerCase();
  const list = resources.filter(
    (r) =>
      (cat === "All" || r.category === cat) &&
      (!domain || r.domainId === domain) &&
      (show === "all" || (show === "saved" ? r.bookmarked : !r.read)) &&
      (!query || `${r.name} ${r.creator} ${r.what} ${r.type}`.toLowerCase().includes(query)),
  );

  return (
    <div className="grid items-start gap-12 md:grid-cols-[220px_minmax(0,1fr)]">
      <nav aria-label="Resource categories" className="flex flex-col gap-0.5 md:sticky md:top-9">
        <span className="label pb-3">Categories</span>
        {["All", ...categories].map((c) => (
          <button
            key={c}
            type="button"
            aria-pressed={cat === c}
            onClick={() => setCat(c)}
            className={cx("flex cursor-pointer items-center justify-between gap-2.5 py-2 text-left text-[14px] transition-colors hover:text-ink", cat === c ? "text-ink" : "text-ink-3")}
          >
            <span className="flex items-center gap-2.5">
              <span aria-hidden="true" className={cx("size-1.5 rounded-full", cat === c ? "bg-accent" : "bg-transparent")} />
              {c}
            </span>
            <span className="font-mono text-[11px] text-ink-4">{c === "All" ? resources.length : (counts.get(c) ?? 0)}</span>
          </button>
        ))}
        <span className="label pt-6 pb-2">Show</span>
        {(
          [
            ["all", "Everything"],
            ["saved", "Saved"],
            ["unread", "Unread"],
          ] as const
        ).map(([k, l]) => (
          <button key={k} type="button" aria-pressed={show === k} onClick={() => setShow(k)} className={cx("py-1.5 text-left text-[14px] hover:text-ink", show === k ? "text-ink" : "text-ink-3")}>
            {show === k ? "● " : "○ "}
            {l}
          </button>
        ))}
      </nav>

      <div className="flex min-w-0 flex-col gap-7">
        <div className="flex flex-col gap-2.5">
          <span className="font-mono text-[12px] text-ink-3">RESOURCES · {resources.length} FROM THE SYLLABUS</span>
          <h1 className="text-[clamp(44px,5vw,64px)] leading-none font-extrabold tracking-[-0.02em]">
            The <em className="font-medium text-muted not-italic">reading list.</em>
          </h1>
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-4 border-b-2 border-line-strong pb-2 focus-within:border-ink">
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              aria-label="Search resources"
              placeholder="Search by title or author…"
              className="h-11 min-w-0 flex-1 border-0 bg-transparent p-0 text-[20px] text-ink caret-accent-text outline-none"
            />
            <span aria-live="polite" className="font-mono text-[11px] whitespace-nowrap text-ink-3">
              {list.length} {list.length === 1 ? "RESOURCE" : "RESOURCES"}
            </span>
          </div>
          <select aria-label="Domain" value={domain} onChange={(e) => setDomain(e.target.value)} className="h-9 max-w-[320px] rounded-full border border-line-strong bg-transparent px-3.5 text-[13px] text-ink-2 outline-none">
            <option value="">All domains and the directory</option>
            {domains.map((d) => (
              <option key={d.id} value={d.id}>
                {d.label}
              </option>
            ))}
          </select>
        </div>
        <ul className="flex flex-col">
          {list.map((r) => (
            <ResourceRow key={r.id} r={r} />
          ))}
          {!list.length && <li className="py-8 text-[15px] text-ink-3">Nothing matches. Try another category or search.</li>}
        </ul>
      </div>
    </div>
  );
}

function ResourceRow({ r }: { r: Resource }) {
  const [pending, run] = useAction();
  const [noteOpen, setNoteOpen] = useState(false);
  const [note, setNote] = useState(r.note);
  return (
    <li className="border-b border-line py-[18px]">
      <div className="grid items-center gap-5 md:grid-cols-[minmax(0,1fr)_150px_auto]">
        <div className={cx("flex min-w-0 flex-col gap-1", r.read && "opacity-60")}>
          <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-[22px] leading-[1.15] font-bold tracking-[-0.02em] hover:underline">
            {r.name}
          </a>
          <span className="text-[13px] text-ink-3">{[r.creator, r.what].filter(Boolean).join(" · ")}</span>
          {r.note && !noteOpen && <p className="mt-1 border-l-2 border-accent pl-2.5 text-[13px] whitespace-pre-wrap text-ink-2">{r.note}</p>}
        </div>
        <div className="flex flex-col gap-[3px] font-mono text-[11px] text-ink-3">
          <span>{r.category}</span>
          <span className="truncate">{r.domainLabel ?? "Cross-cutting"}</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            disabled={pending}
            aria-pressed={r.bookmarked}
            onClick={() => run(() => updateResourceState(r.id, { bookmarked: !r.bookmarked }), { silent: true })}
            className={cx(buttonClass("outline", "sm", "h-8 px-3 text-[12px]"), r.bookmarked ? "text-accent-text" : "text-ink-3")}
          >
            {r.bookmarked ? "★ Saved" : "☆ Save"}
          </button>
          <button
            type="button"
            disabled={pending}
            aria-pressed={r.read}
            onClick={() => run(() => updateResourceState(r.id, { read: !r.read }), { silent: true })}
            className={cx(buttonClass("outline", "sm", "h-8 px-3 text-[12px]"), r.read ? "text-ink" : "text-ink-3")}
          >
            {r.read ? "✓ Read" : "Mark read"}
          </button>
          <button type="button" onClick={() => setNoteOpen((o) => !o)} aria-expanded={noteOpen} className={buttonClass("ghost", "sm", "h-8 px-2.5 text-[12px]")}>
            Note
          </button>
        </div>
      </div>
      {noteOpen && (
        <form autoComplete="off"
          className="mt-3 flex flex-col gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            run(() => updateResourceState(r.id, { note }), { onSuccess: () => setNoteOpen(false) });
          }}
        >
          <textarea aria-label={`Note for ${r.name}`} rows={3} value={note} onChange={(e) => setNote(e.target.value)} className={inputClass} autoFocus />
          <div className="flex gap-2">
            <button type="submit" disabled={pending} className={buttonClass("ink", "sm")}>
              Save note
            </button>
            <button type="button" onClick={() => setNoteOpen(false)} className={buttonClass("ghost", "sm")}>
              Cancel
            </button>
          </div>
        </form>
      )}
    </li>
  );
}
