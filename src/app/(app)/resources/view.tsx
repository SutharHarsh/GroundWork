"use client";
import { useSearchParams } from "next/navigation";
import { useLocal } from "@/local/hooks";
import type { SessionUser } from "@/local/auth";
import { PageLoading } from "@/components/client/local-provider";
import { asc, eq } from "drizzle-orm";
import { db, t } from "@/db";
import { RESOURCE_CATEGORIES } from "@/lib/syllabus/parse";
import { ResourceLibrary } from "@/components/client/resource-library";

async function build(user: SessionUser, sp: { domain?: string }) {
  const { domain } = sp;
  const [resources, domains, stateRows] = await Promise.all([
    db.select().from(t.resources).where(eq(t.resources.pathId, user.pathId)).orderBy(asc(t.resources.sort)).all(),
    db.select({ id: t.domains.id, code: t.domains.code, title: t.domains.title }).from(t.domains).where(eq(t.domains.pathId, user.pathId)).orderBy(asc(t.domains.sort)).all(),
    db.select().from(t.resourceStates).where(eq(t.resourceStates.userId, user.id)).all(),
  ]);
  const states = new Map(stateRows.map((s) => [s.resourceId, s]));
  const domainLabel = new Map(domains.map((d) => [d.id, `Domain ${d.code} · ${d.title}`]));
  const rows = resources.map((r) => {
    const s = states.get(r.id);
    return {
      id: r.id,
      name: r.name,
      url: r.url,
      extraUrls: JSON.parse(r.extraUrls) as string[],
      creator: r.creator,
      type: r.type,
      what: r.what,
      category: r.category,
      section: r.section,
      domainId: r.domainId,
      domainLabel: r.domainId ? (domainLabel.get(r.domainId) ?? null) : null,
      bookmarked: s?.bookmarked ?? false,
      read: s?.read ?? false,
      note: s?.note ?? "",
    };
  });
  const usedCats = RESOURCE_CATEGORIES.filter((c) => rows.some((r) => r.category === c));
  return (
    <div className="max-w-[1240px]">
      <ResourceLibrary
        resources={rows}
        categories={usedCats}
        domains={domains.map((d) => ({ id: d.id, label: `Domain ${d.code} · ${d.title}` }))}
        initialDomain={domain && domains.some((d) => d.id === domain) ? domain : ""}
      />
    </div>
  );
}

export default function View() {
  const params = useSearchParams();
  const key = params.toString();
  const node = useLocal((user) => build(user, Object.fromEntries(params.entries())), [key]);
  return node ?? <PageLoading />;
}
