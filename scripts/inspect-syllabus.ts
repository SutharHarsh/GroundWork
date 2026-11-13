/** Prints a structural summary of both syllabus files — used to verify nothing is dropped by the parser. */
import fs from "node:fs";
import path from "node:path";
import { parseSyllabus } from "../src/lib/syllabus/parse";

const dir = process.env.SYLLABUS_DIR ?? path.resolve(process.cwd(), "syllabus");
for (const f of ["ai-native-frontend-developer.md", "ai-native-product-designer.md"]) {
  const s = parseSyllabus(fs.readFileSync(path.join(dir, f), "utf8"));
  const topics = s.domains.flatMap((d) => d.parents.flatMap((p) => p.topics));
  const subs = topics.flatMap((t) => t.subtopics);
  const tierMin: Record<string, number> = {};
  for (const t of topics) tierMin[t.tier] = (tierMin[t.tier] ?? 0) + t.estMinutes;
  console.log(f, {
    domains: s.domains.length,
    parents: s.domains.reduce((n, d) => n + d.parents.length, 0),
    topics: topics.length,
    subtopics: subs.length,
    concepts: subs.reduce((n, x) => n + x.concepts.length, 0),
    resources: s.resources.length,
    capstones: s.capstones.length,
    introChars: s.introMd.length,
    sequenceChars: s.sequenceMd.length,
    timelessChars: s.timelessMd.length,
    hoursByTier: Object.fromEntries(Object.entries(tierMin).map(([k, v]) => [k, Math.round(v / 60)])),
  });
  if (process.argv.includes("--domains"))
    for (const d of s.domains)
      console.log(
        `  ${d.code.padEnd(3)} st${d.stageNumber} ai=${d.isAi ? 1 : 0} prereq=[${d.prereqCodes}] tiers=${[...new Set(d.parents.map((p) => p.tier))]} parents=${d.parents.length} topics=${d.parents.reduce((n, p) => n + p.topics.length, 0)} empty=[${d.parents
          .flatMap((p) => p.topics)
          .filter((t) => !t.subtopics.length)
          .map((t) => t.code)}] ${d.title.slice(0, 44)}`,
      );
  const noUrl = s.resources.filter((r) => !r.url);
  if (noUrl.length) console.log("  resources without URL:", noUrl.map((r) => r.name));
  const cats: Record<string, number> = {};
  for (const r of s.resources) cats[r.category] = (cats[r.category] ?? 0) + 1;
  console.log("  categories", cats);
}
