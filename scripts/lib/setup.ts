/**
 * Builds the read-only syllabus database for each learning path (content/<pathId>.sqlite).
 * The browser downloads it, then layers the learner's own data (kept in localStorage) on top.
 * Content IDs are deterministic, so rebuilding after editing a syllabus keeps learners' progress.
 */
import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { eq, inArray } from "drizzle-orm";
import type { SQLJsDatabase } from "drizzle-orm/sql-js";
import * as t from "../../src/db/schema";
import { parseSyllabus } from "../../src/lib/syllabus/parse";
import { domainId, parentId, pathPrefix, subtopicId, topicId } from "../../src/lib/syllabus/ids";
import { PATHS } from "../../src/lib/users";

export { PATHS };
type Db = SQLJsDatabase<typeof t>;

export function syllabusDir() {
  return path.resolve(process.env.SYLLABUS_DIR ?? path.join(process.cwd(), "syllabus"));
}

function insertChunked<T>(rows: T[], insert: (chunk: T[]) => unknown, size = 80) {
  for (let i = 0; i < rows.length; i += size) insert(rows.slice(i, i + size));
}

export function seedPath(db: Db, p: (typeof PATHS)[number]) {
  const md = fs.readFileSync(path.join(syllabusDir(), p.file), "utf8");
  const s = parseSyllabus(md);
  const prefix = pathPrefix(p.id);

  const domains: (typeof t.domains.$inferInsert)[] = [];
  const prereqs: (typeof t.domainPrereqs.$inferInsert)[] = [];
  const parents: (typeof t.parentTopics.$inferInsert)[] = [];
  const topics: (typeof t.topics.$inferInsert)[] = [];
  const subs: (typeof t.subtopics.$inferInsert)[] = [];
  const resources: (typeof t.resources.$inferInsert)[] = [];

  let topicSort = 0;
  s.domains.forEach((d, di) => {
    const dId = domainId(p.id, d.code);
    domains.push({
      id: dId,
      pathId: p.id,
      code: d.code,
      title: d.title,
      stage: d.stage,
      stageNumber: d.stageNumber,
      labelText: d.labelText,
      depthText: d.depthText,
      prereqText: d.prereqText,
      whyText: d.whyText,
      notesMd: d.notesMd,
      isSpecialization: d.isSpecialization,
      isAi: d.isAi,
      sort: di,
    });
    for (const code of new Set(d.prereqCodes))
      if (code !== d.code && s.domains.some((x) => x.code === code)) prereqs.push({ domainId: dId, prereqDomainId: domainId(p.id, code) });
    d.parents.forEach((par, pi) => {
      const pId = parentId(p.id, par.code);
      parents.push({ id: pId, domainId: dId, code: par.code, title: par.title, tier: par.tier, sort: pi });
      for (const tp of par.topics) {
        const tId = topicId(p.id, tp.code);
        topics.push({ id: tId, pathId: p.id, domainId: dId, parentId: pId, code: tp.code, title: tp.title, tier: tp.tier, estMinutes: tp.estMinutes, sort: topicSort++ });
        tp.subtopics.forEach((st, si) => subs.push({ id: subtopicId(tId, si), topicId: tId, title: st.title, concepts: JSON.stringify(st.concepts), sort: si }));
      }
    });
  });

  const seen = new Set<string>();
  s.resources.forEach((r, ri) => {
    if (!r.url || seen.has(r.url)) return;
    seen.add(r.url);
    const dCode = r.domainCode && s.domains.some((d) => d.code === r.domainCode) ? r.domainCode : null;
    resources.push({
      id: `${prefix}-r-${createHash("sha1").update(`${r.url}|${r.name}`).digest("hex").slice(0, 12)}`,
      pathId: p.id,
      domainId: dCode ? domainId(p.id, dCode) : null,
      section: r.section,
      category: r.category,
      name: r.name,
      type: r.type,
      creator: r.creator,
      url: r.url,
      extraUrls: JSON.stringify(r.extraUrls),
      what: r.what,
      sort: ri,
    });
  });

  const pathRow = { title: p.title, role: p.role, sourceFile: p.file, introMd: s.introMd, sequenceMd: s.sequenceMd, timelessMd: s.timelessMd, capstones: JSON.stringify(s.capstones) };

  const oldDomains = db.select({ id: t.domains.id }).from(t.domains).where(eq(t.domains.pathId, p.id)).all().map((d) => d.id);
  const oldTopics = db.select({ id: t.topics.id }).from(t.topics).where(eq(t.topics.pathId, p.id)).all().map((x) => x.id);
  for (let i = 0; i < oldTopics.length; i += 400) db.delete(t.subtopics).where(inArray(t.subtopics.topicId, oldTopics.slice(i, i + 400))).run();
  if (oldDomains.length) {
    db.delete(t.parentTopics).where(inArray(t.parentTopics.domainId, oldDomains)).run();
    db.delete(t.domainPrereqs).where(inArray(t.domainPrereqs.domainId, oldDomains)).run();
  }
  db.delete(t.topics).where(eq(t.topics.pathId, p.id)).run();
  db.delete(t.domains).where(eq(t.domains.pathId, p.id)).run();
  db.delete(t.resources).where(eq(t.resources.pathId, p.id)).run();

  db.insert(t.paths).values({ id: p.id, ...pathRow }).onConflictDoUpdate({ target: t.paths.id, set: pathRow }).run();
  insertChunked(domains, (c) => db.insert(t.domains).values(c).run());
  insertChunked(prereqs, (c) => db.insert(t.domainPrereqs).values(c).onConflictDoNothing().run());
  insertChunked(parents, (c) => db.insert(t.parentTopics).values(c).run());
  insertChunked(topics, (c) => db.insert(t.topics).values(c).run());
  insertChunked(subs, (c) => db.insert(t.subtopics).values(c).run());
  insertChunked(resources, (c) => db.insert(t.resources).values(c).onConflictDoNothing().run(), 50);
  return { domains: domains.length, topics: topics.length, resources: resources.length };
}
