"use client";
import Link from "next/link";
import { deleteProof, setProofReview } from "@/local/actions/work";
import { PROOF_TYPES, REVIEW_LABEL, REVIEW_STATUSES } from "@/lib/status";
import { cx } from "@/components/ui";
import { useFileUrl } from "@/local/hooks";
import { useAction } from "./toast";

export type ProofView = {
  id: string;
  title: string;
  description: string;
  type: string;
  url: string | null;
  fileName: string | null;
  filePath: string | null;
  mime: string | null;
  reflection: string;
  reviewStatus: string;
  submittedAt: number;
  topicId: string | null;
  projectId: string | null;
  topicTitle: string | null;
  projectTitle: string | null;
};

export const PROOF_GLYPH: Record<string, string> = { github: "{ }", live: "↗", figma: "◇", video: "▶", link: "↗", image: "▣", pdf: "PDF", document: "DOC", writing: "¶", reflection: "~" };
export const REVIEW_COLOR: Record<string, string> = { accepted: "var(--accent-text)", submitted: "var(--ink-2)", under_review: "var(--ink-2)", needs_changes: "var(--danger)" };

function host(url: string | null) {
  if (!url) return null;
  try {
    return new URL(url).hostname.replace(/^www\./, "") + new URL(url).pathname.replace(/\/$/, "");
  } catch {
    return url;
  }
}

/** Archive rows from the design: number · glyph · title/meta · date/status. */
export function ProofList({ proofs, compact, startIndex }: { proofs: ProofView[]; compact?: boolean; startIndex?: number }) {
  if (!proofs.length) return <p className="py-3 text-[14px] text-ink-3">{compact ? "No evidence yet. Mastery needs at least one proof of work." : "No evidence of this type yet."}</p>;
  return (
    <ul className="flex flex-col">
      {proofs.map((p, i) => (
        <ProofRow key={p.id} proof={p} n={(startIndex ?? proofs.length) - i} compact={compact} />
      ))}
    </ul>
  );
}

function ProofRow({ proof, n, compact }: { proof: ProofView; n: number; compact?: boolean }) {
  const [pending, run] = useAction();
  const typeLabel = PROOF_TYPES.find((t) => t.value === proof.type)?.label ?? proof.type;
  const fileHref = useFileUrl(proof.fileName ? proof.filePath : null);
  const sub = host(proof.url) ?? proof.fileName ?? (proof.description ? proof.description.slice(0, 60) : null);
  const date = new Date(proof.submittedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });

  if (compact)
    return (
      <li className="flex items-center justify-between gap-3 border-b border-line-soft py-3 text-[14px]">
        <span className="min-w-0 truncate">
          <span className="mr-2.5 font-mono text-[11px] text-accent-text uppercase">{typeLabel}</span>
          {proof.url ? (
            <a href={proof.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
              {sub}
            </a>
          ) : fileHref ? (
            <a href={fileHref} target="_blank" rel="noopener noreferrer" className="hover:underline">
              {proof.title}
            </a>
          ) : (
            proof.title
          )}
        </span>
        <span className="shrink-0 font-mono text-[11px] text-ink-3 uppercase">{date}</span>
      </li>
    );

  return (
    <li className="grid grid-cols-[56px_minmax(0,1fr)] items-center gap-5 border-b border-line py-5 md:grid-cols-[44px_72px_minmax(0,1fr)_auto]">
      <span className="hidden font-mono text-[12px] text-ink-4 md:block">{String(n).padStart(2, "0")}</span>
      <span className="grid h-14 w-[56px] place-items-center rounded-xl border border-line text-[22px] font-bold tracking-[-0.02em] text-accent-text md:w-[72px]" aria-hidden="true">
        {fileHref && proof.mime?.startsWith("image/") ? (
          // eslint-disable-next-line @next/next/no-img-element -- file from this browser's own storage
          <img src={fileHref} alt="" className="size-full rounded-xl object-cover" loading="lazy" />
        ) : (
          (PROOF_GLYPH[proof.type] ?? "↗")
        )}
      </span>
      <div className="flex min-w-0 flex-col gap-1">
        <span className="text-[24px] leading-[1.1] font-bold tracking-[-0.02em]">
          {proof.url ? (
            <a href={proof.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
              {proof.title}
            </a>
          ) : fileHref ? (
            <a href={fileHref} target="_blank" rel="noopener noreferrer" className="hover:underline">
              {proof.title}
            </a>
          ) : (
            proof.title
          )}
        </span>
        <span className="text-[12px] text-ink-3">
          {[typeLabel, sub, proof.projectTitle].filter(Boolean).join(" · ")}
        </span>
        {proof.topicTitle && (
          <span className="text-[12px] text-ink-2">
            Demonstrates:{" "}
            <Link href={`/roadmap/${proof.topicId}`} className="hover:underline">
              {proof.topicTitle}
            </Link>
          </span>
        )}
        {proof.description && proof.type !== "github" && proof.type !== "live" && <p className="mt-1 line-clamp-3 text-[14px] text-ink-2">{proof.description}</p>}
      </div>
      <div className="col-span-full flex flex-wrap items-center gap-3 md:col-auto md:flex-col md:items-end md:gap-1.5">
        <span className="font-mono text-[11px] text-ink-3 uppercase">{date}</span>
        <label className="sr-only" htmlFor={`rv-${proof.id}`}>
          Review status of {proof.title}
        </label>
        <select
          id={`rv-${proof.id}`}
          value={proof.reviewStatus}
          disabled={pending}
          onChange={(e) => run(() => setProofReview(proof.id, e.target.value), { silent: true })}
          className="cursor-pointer appearance-none border-0 bg-transparent p-0 text-right font-mono text-[11px] outline-none"
          style={{ color: REVIEW_COLOR[proof.reviewStatus] ?? "var(--ink-2)" }}
        >
          {REVIEW_STATUSES.map((s) => (
            <option key={s} value={s}>
              ● {REVIEW_LABEL[s]}
            </option>
          ))}
        </select>
        <button
          type="button"
          disabled={pending}
          onClick={() => {
            if (window.confirm(`Delete "${proof.title}"? Any uploaded file is removed too.`)) run(() => deleteProof(proof.id));
          }}
          className={cx("font-mono text-[11px] text-ink-3 uppercase hover:text-danger")}
        >
          Delete
        </button>
      </div>
    </li>
  );
}

/** An image stored in this browser (proof screenshots). */
export function LocalFileImage({ fileKey, alt, className }: { fileKey: string | null; alt: string; className?: string }) {
  const src = useFileUrl(fileKey);
  // eslint-disable-next-line @next/next/no-img-element -- file from this browser's own storage
  return src ? <img src={src} alt={alt} className={className} /> : null;
}
