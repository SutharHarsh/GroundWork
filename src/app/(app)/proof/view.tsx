"use client";
import { useSearchParams } from "next/navigation";
import { useLocal } from "@/local/hooks";
import type { SessionUser } from "@/local/auth";
import { PageLoading } from "@/components/client/local-provider";
import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { db, t } from "@/db";
import { PROOF_TYPES, REVIEW_LABEL } from "@/lib/status";
import { PageTitle, buttonClass, chipClass } from "@/components/ui";
import { ProofForm } from "@/components/client/proof-form";
import { LocalFileImage, PROOF_GLYPH, REVIEW_COLOR, ProofList } from "@/components/client/proof-list";
import { getPathTree } from "@/local/data";
import { MAX_UPLOAD_BYTES } from "@/local/files";

const CHIPS: { key: string; label: string; types: string[] }[] = [
  { key: "all", label: "All", types: [] },
  { key: "github", label: "GitHub", types: ["github"] },
  { key: "figma", label: "Figma", types: ["figma"] },
  { key: "live", label: "Live link", types: ["live", "link"] },
  { key: "screenshot", label: "Screenshot", types: ["image"] },
  { key: "written", label: "Written", types: ["writing"] },
  { key: "files", label: "Files", types: ["pdf", "document"] },
  { key: "video", label: "Video", types: ["video"] },
  { key: "reflection", label: "Reflection", types: ["reflection"] },
];

async function build(user: SessionUser, sp: { f?: string; add?: string }) {
  const [tree, projects, all] = await Promise.all([
    getPathTree(user.id, user.pathId),
    db.select({ id: t.projects.id, title: t.projects.title }).from(t.projects).where(eq(t.projects.userId, user.id)).all(),
    db.select().from(t.proofs).where(eq(t.proofs.userId, user.id)).orderBy(desc(t.proofs.submittedAt)).all(),
  ]);
  const topicTitles = new Map(tree.flatMap((d) => d.topics.map((tp) => [tp.id, tp.title])));
  const projectTitles = new Map(projects.map((p) => [p.id, p.title]));
  const chip = CHIPS.find((c) => c.key === sp.f) ?? CHIPS[0];
  const list = all.filter((p) => chip.key === "all" || chip.types.includes(p.type));
  const views = list.map((p) => ({ ...p, topicTitle: p.topicId ? (topicTitles.get(p.topicId) ?? null) : null, projectTitle: p.projectId ? (projectTitles.get(p.projectId) ?? null) : null }));
  const feature = views[0];
  const topicsWithEvidence = new Set(all.map((p) => p.topicId).filter(Boolean)).size;
  const topicOptions = tree.flatMap((d) => d.topics.filter((tp) => tp.status !== "not_started" || tp.bucket !== "continued").map((tp) => ({ id: tp.id, label: `${tp.code} ${tp.title}` })));
  const visibleChips = CHIPS.filter((c) => c.key === "all" || c.key !== "figma" || user.pathId === "designer" || all.some((p) => p.type === "figma"));

  return (
    <div className="flex max-w-[1240px] flex-col gap-9">
      <PageTitle
        eyebrow="Proof of work · the archive"
        title="Everything you've"
        muted="actually made."
        sub={`${all.length} ${all.length === 1 ? "entry" : "entries"} across ${topicsWithEvidence} ${topicsWithEvidence === 1 ? "topic" : "topics"}. Mastery needs evidence; this is where it lives.`}
        actions={
          <Link href={sp.add ? `/proof${chip.key !== "all" ? `?f=${chip.key}` : ""}` : `/proof?add=1${chip.key !== "all" ? `&f=${chip.key}` : ""}`} className={buttonClass("accent", "lg", "h-[50px]")} scroll={false}>
            {sp.add ? "Close" : "+ Add proof"}
          </Link>
        }
      />

      {sp.add && (
        <section aria-label="Add proof of work" className="rounded-[20px] border border-line bg-panel p-6 sm:p-8">
          <ProofForm pathId={user.pathId} topics={topicOptions} projects={projects} uploadsEnabled={true} maxMb={Math.round(MAX_UPLOAD_BYTES / 1024 / 1024)} />
        </section>
      )}

      <nav aria-label="Filter by evidence type" className="flex flex-wrap gap-1.5">
        {visibleChips.map((c) => (
          <Link key={c.key} href={c.key === "all" ? "/proof" : `/proof?f=${c.key}`} scroll={false} aria-current={chip.key === c.key ? "true" : undefined} className={chipClass(chip.key === c.key)}>
            {c.label}
          </Link>
        ))}
      </nav>

      {feature && (
        <section aria-label="Latest evidence" className="grid items-center gap-10 border-t border-b border-t-accent border-b-line py-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
          <div className="relative grid aspect-[16/10] place-items-center overflow-hidden rounded-[20px] border border-line bg-panel">
            {feature.fileName && feature.mime?.startsWith("image/") ? (
              <LocalFileImage fileKey={feature.filePath} alt={feature.title} className="size-full object-cover" />
            ) : (
              <span className="numeral text-[160px] text-ink" aria-hidden="true">
                {PROOF_GLYPH[feature.type] ?? "↗"}
              </span>
            )}
            <span className="absolute bottom-4 left-[18px] font-mono text-[11px] text-ink-3">{feature.url ? new URL(feature.url).hostname.replace(/^www\./, "") : (feature.fileName ?? "WRITTEN")}</span>
          </div>
          <div className="flex flex-col gap-4">
            <span className="font-mono text-[12px] text-accent-text uppercase">
              {String(list.length).padStart(2, "0")} · {PROOF_TYPES.find((x) => x.value === feature.type)?.label} · {new Date(feature.submittedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" })}
            </span>
            <h2 className="text-[clamp(32px,4vw,48px)] leading-none font-extrabold tracking-[-0.02em]">
              {feature.url ? (
                <a href={feature.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  {feature.title}
                </a>
              ) : (
                feature.title
              )}
            </h2>
            {(feature.projectTitle || feature.description) && <span className="text-[14px] text-ink-2">{feature.projectTitle ?? feature.description.slice(0, 180)}</span>}
            {feature.topicTitle && (
              <div className="flex flex-wrap gap-1.5">
                <Link href={`/roadmap/${feature.topicId}`} className="inline-flex h-7 items-center rounded-full border border-line-strong px-3 text-[12px] text-ink-2 hover:text-ink">
                  {feature.topicTitle}
                </Link>
              </div>
            )}
            <span className="font-mono text-[12px]" style={{ color: REVIEW_COLOR[feature.reviewStatus] ?? "var(--ink-2)" }}>
              ● {REVIEW_LABEL[feature.reviewStatus]}
            </span>
          </div>
        </section>
      )}

      <ProofList proofs={views} startIndex={views.length} />
    </div>
  );
}

export default function View() {
  const params = useSearchParams();
  const key = params.toString();
  const node = useLocal((user) => build(user, Object.fromEntries(params.entries())), [key]);
  return node ?? <PageLoading />;
}
