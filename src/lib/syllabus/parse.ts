/**
 * Parses a Groundwork syllabus Markdown file into structured, trackable learning units.
 * The Markdown files are the single source of truth; this parser preserves every domain,
 * parent topic, topic, subtopic and concept in the original order.
 */

export type Tier = "essential" | "core-senior" | "optional";

export interface ParsedSubtopic {
  title: string;
  concepts: string[];
}
export interface ParsedTopic {
  code: string;
  title: string;
  tier: Tier;
  estMinutes: number;
  subtopics: ParsedSubtopic[];
}
export interface ParsedParent {
  code: string;
  title: string;
  tier: Tier;
  topics: ParsedTopic[];
}
export interface ParsedResource {
  section: string;
  category: ResourceCategory;
  name: string;
  type: string;
  creator: string;
  url: string;
  extraUrls: string[];
  what: string;
  domainCode: string | null;
}
export interface ParsedDomain {
  code: string;
  title: string;
  stage: string;
  stageNumber: number;
  labelText: string;
  depthText: string;
  prereqText: string;
  prereqCodes: string[];
  whyText: string;
  notesMd: string;
  isSpecialization: boolean;
  isAi: boolean;
  parents: ParsedParent[];
}
export interface ParsedSyllabus {
  title: string;
  introMd: string;
  sequenceMd: string;
  timelessMd: string;
  capstones: { stage: string; text: string }[];
  domains: ParsedDomain[];
  resources: ParsedResource[];
}

export type ResourceCategory =
  | "Documentation"
  | "Courses"
  | "Books"
  | "YouTube & talks"
  | "Blogs & articles"
  | "Podcasts"
  | "Research papers"
  | "Tools & communities"
  | "Industry experts";

export const RESOURCE_CATEGORIES: ResourceCategory[] = [
  "Documentation",
  "Courses",
  "Books",
  "YouTube & talks",
  "Blogs & articles",
  "Podcasts",
  "Research papers",
  "Tools & communities",
  "Industry experts",
];

const DASH = /[–—-]/;

export function categorize(type: string, section: string): ResourceCategory {
  const s = `${type} ${section}`.toLowerCase();
  if (/expert|person/.test(section.toLowerCase())) return "Industry experts";
  if (/podcast/.test(s)) return "Podcasts";
  if (/research paper|research study|paper/.test(s)) return "Research papers";
  if (/youtube|talk|video|playlist/.test(s)) return "YouTube & talks";
  if (/\bbook\b|books|online book|book series|zines/.test(s) && !/handbook/.test(s)) return "Books";
  if (/course|tutorial|exercises|interactive|certificate|academy|games?\b|practice/.test(s)) return "Courses";
  if (/official|docs|documentation|specification|standard|guidelines|design system|reference|vocabulary|method/.test(s))
    return "Documentation";
  if (/blog|article|newsletter|essay|guide|writing|substack|series|comic|case stud|publication/.test(s))
    return "Blogs & articles";
  return "Tools & communities";
}

/** Rough learning-effort estimate in minutes for one topic. */
export function estimateMinutes(subtopics: ParsedSubtopic[], depthText: string, tier: Tier): number {
  const conceptCount = subtopics.reduce((n, s) => n + s.concepts.length, 0);
  let minutes = 20 + subtopics.length * 9 + conceptCount * 3;
  const depth = Number(/D([1-4])/.exec(depthText)?.[1] ?? 2);
  minutes *= depth >= 4 ? 1.35 : depth === 3 ? 1.15 : 1;
  if (tier === "core-senior") minutes *= 1.1;
  return Math.max(30, Math.min(240, Math.round(minutes / 15) * 15));
}

/** "AI FOUNDATIONS AND AI ENGINEERING" → "AI foundations and AI engineering" */
function sentenceCase(text: string): string {
  const keep = new Set(["AI", "UX", "UI", "CSS", "HTML", "CS"]);
  const words = text.split(/\s+/).map((w, i) => {
    if (keep.has(w)) return w;
    const lower = w.toLowerCase();
    return i === 0 ? lower.charAt(0).toUpperCase() + lower.slice(1) : lower;
  });
  return words.join(" ");
}

function cleanInline(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\[(.+?)\]\((.+?)\)/g, "$1")
    .trim();
}

function splitRow(line: string): string[] {
  const inner = line.trim().replace(/^\|/, "").replace(/\|$/, "");
  return inner.split("|").map((c) => c.trim());
}

function isSeparatorRow(line: string) {
  return /^\|\s*:?-{3,}/.test(line.trim());
}

function parseTier(label: string): Tier | null {
  const l = label.toLowerCase();
  if (l.includes("core-senior")) return "core-senior";
  if (l.includes("optional")) return "optional";
  if (l.includes("essential")) return "essential";
  return null;
}

/** "[Essential] (12.1–12.8), [Core-Senior] (12.9–12.11)" → resolver for a parent code. */
function tierResolver(labelText: string) {
  const re = /\[(Essential|Core-Senior|Optional)\]\s*(?:\(|for\s+)?(\d+\.\d+)?(?:\s*[–—-]\s*(\d+\.\d+))?/g;
  const ranges: { tier: Tier; from: number; to: number }[] = [];
  const bare: Tier[] = [];
  for (const m of labelText.matchAll(re)) {
    const tier = parseTier(m[1])!;
    if (m[2]) {
      const from = Number(m[2].split(".")[1]);
      const to = m[3] ? Number(m[3].split(".")[1]) : from;
      ranges.push({ tier, from, to });
    } else bare.push(tier);
  }
  const fallback: Tier = bare[0] ?? (ranges.length ? ranges[ranges.length - 1].tier : "essential");
  return (parentCode: string, parentTitle: string): Tier => {
    const explicit = /\((Core-Senior|Optional[^)]*)\)/i.exec(parentTitle);
    if (explicit) return parseTier(explicit[1])!;
    const n = Number(parentCode.split(".")[1]);
    const hit = ranges.find((r) => n >= r.from && n <= r.to);
    if (hit) return hit.tier;
    if (ranges.length) {
      const maxRange = Math.max(...ranges.map((r) => r.to));
      // parents after the last range inherit the last range's tier (e.g. "for depth" sections)
      if (n > maxRange) return bare.find((b) => b !== "essential") ?? ranges[ranges.length - 1].tier;
    }
    return fallback;
  };
}

/** Parses "Domains 1–4. No prior programming…" → ["1","2","3","4"]. Only the first sentence counts. */
export function parsePrereqCodes(prereqText: string): string[] {
  const firstSentence = prereqText.split(/\.\s/)[0].replace(/\.\s*$/, "");
  if (!/Domains?\s+\d/.test(firstSentence)) return [];
  const withoutParens = firstSentence.replace(/\([^)]*\)/g, "");
  const out = new Set<string>();
  const body = withoutParens.slice(withoutParens.search(/Domains?\s+\d/));
  for (const m of body.matchAll(/(?<![\d.])(\d+)(?![\d.])(?:\s*[–—]\s*(\d+)(?![\d.]))?/g)) {
    const a = Number(m[1]);
    const b = m[2] ? Number(m[2]) : a;
    for (let i = a; i <= b; i++) out.add(String(i));
  }
  return [...out];
}

const AI_TITLE = /\bAI\b|Machine Learning|LLM|AI-/;

export function parseSyllabus(markdown: string): ParsedSyllabus {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const result: ParsedSyllabus = {
    title: "",
    introMd: "",
    sequenceMd: "",
    timelessMd: "",
    capstones: [],
    domains: [],
    resources: [],
  };

  type Mode =
    | "none"
    | "intro"
    | "sequence"
    | "capstones"
    | "domain"
    | "parent"
    | "topic"
    | "resources"
    | "notes"
    | "special"
    | "directory"
    | "timeless";
  let mode: Mode = "none";
  let stage = { name: "", number: 0 };
  let domain: ParsedDomain | null = null;
  let parent: ParsedParent | null = null;
  let topic: ParsedTopic | null = null;
  let resolveTier: (code: string, title: string) => Tier = () => "essential";
  let directorySection = "";
  let tableHeader: string[] | null = null;
  const introLines: string[] = [];
  const sequenceLines: string[] = [];
  const timelessLines: string[] = [];

  const finishTopic = () => {
    if (topic && domain) topic.estMinutes = estimateMinutes(topic.subtopics, domain.depthText, topic.tier);
    topic = null;
  };
  const ensureSyntheticTopic = () => {
    if (!topic && parent) {
      topic = { code: `${parent.code}.0`, title: parent.title.replace(/\s*\(.*\)\s*$/, ""), tier: parent.tier, estMinutes: 0, subtopics: [] };
      parent.topics.push(topic);
    }
  };
  const newDomain = (code: string, title: string, special: boolean): ParsedDomain => ({
    code,
    title,
    stage: special ? "Optional specializations" : stage.name,
    stageNumber: special ? 99 : stage.number,
    labelText: special ? "[Optional]" : "",
    depthText: "",
    prereqText: "",
    prereqCodes: [],
    whyText: "",
    notesMd: "",
    isSpecialization: special,
    isAi: AI_TITLE.test(title),
    parents: [],
  });

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // ── Top-level part headings ───────────────────────────────
    if (/^# /.test(line)) {
      finishTopic();
      if (!result.title) {
        result.title = line.slice(2).trim();
        continue;
      }
      const stageMatch = /^# STAGE (\d+) — (.+)$/.exec(line);
      if (stageMatch) {
        stage = { number: Number(stageMatch[1]), name: `Stage ${stageMatch[1]}: ${sentenceCase(stageMatch[2].trim())}` };
        mode = "none";
        domain = null;
        continue;
      }
      domain = null;
      parent = null;
      if (/^# Part I —/.test(line)) mode = "intro";
      else if (/^# Part III —/.test(line)) mode = "sequence";
      else if (/^# Part V —/.test(line)) mode = "directory";
      else if (/^# Part VI —/.test(line)) mode = "timeless";
      else mode = "none";
      continue;
    }

    if (mode === "intro") {
      introLines.push(line);
      continue;
    }
    if (mode === "timeless") {
      if (!/^\*This syllabus/.test(trimmed)) timelessLines.push(line);
      continue;
    }

    if (mode === "sequence" || mode === "capstones") {
      if (/^## Building while learning/.test(line)) {
        mode = "capstones";
        sequenceLines.push(line);
        continue;
      }
      if (mode === "capstones") {
        const cap = /^- (Stage \d+):\s*(.+)$/.exec(trimmed);
        if (cap) result.capstones.push({ stage: cap[1], text: cap[2].trim() });
      }
      sequenceLines.push(line);
      continue;
    }

    // ── Domains ───────────────────────────────────────────────
    const domainMatch = /^## Domain (\d+): (.+)$/.exec(line);
    if (domainMatch) {
      finishTopic();
      domain = newDomain(domainMatch[1], domainMatch[2].trim(), false);
      result.domains.push(domain);
      parent = null;
      mode = "domain";
      continue;
    }
    if (/^## Optional Specializations/.test(line)) {
      finishTopic();
      mode = "special";
      domain = null;
      continue;
    }

    if (mode === "special") {
      const sm = /^### (S\d+)\. (.+)$/.exec(line);
      if (sm) {
        finishTopic();
        domain = newDomain(sm[1], sm[2].trim(), true);
        result.domains.push(domain);
        parent = { code: `${sm[1]}.1`, title: sm[2].trim(), tier: "optional", topics: [] };
        domain.parents.push(parent);
        topic = { code: `${sm[1]}.1.1`, title: sm[2].trim(), tier: "optional", estMinutes: 0, subtopics: [] };
        parent.topics.push(topic);
        continue;
      }
      if (!domain) continue;
      const field = /^- \*\*(Prerequisites|Concepts|Resources):\*\*\s*(.+)$/.exec(trimmed);
      if (field) {
        const [, key, value] = field;
        if (key === "Prerequisites") {
          domain.prereqText = value;
          domain.prereqCodes = parsePrereqCodes(value);
        } else if (key === "Concepts" && topic) {
          for (const c of value.split(/;\s*/)) {
            const t = cleanInline(c.replace(/\.$/, ""));
            if (t) (topic as ParsedTopic).subtopics.push({ title: t, concepts: [] });
          }
        } else if (key === "Resources") {
          for (const chunk of value.split(/\s+·\s+(?=[^·]*https?:)/)) {
            const m = /^(.*?)\s+—\s+(https?:\S+)/.exec(chunk.trim());
            if (m) {
              const name = m[1].trim();
              const creator = /\(([^)]+)\)/.exec(name)?.[1] ?? "";
              result.resources.push({
                section: domain.title,
                category: categorize(/book/i.test(name) ? "book" : "docs", ""),
                name: name.replace(/\s*\([^)]*\)/, "").trim(),
                type: "",
                creator,
                url: m[2].replace(/[.,]$/, ""),
                extraUrls: [],
                what: `${domain.title} specialization`,
                domainCode: domain.code,
              });
            }
          }
        }
      }
      continue;
    }

    if (mode === "directory") {
      const sec = /^## (.+)$/.exec(line);
      if (sec) {
        directorySection = sec[1].trim();
        tableHeader = null;
        continue;
      }
      if (trimmed.startsWith("|")) {
        if (isSeparatorRow(trimmed)) continue;
        const cells = splitRow(trimmed);
        if (!tableHeader) {
          tableHeader = cells;
          continue;
        }
        result.resources.push(directoryRow(tableHeader, cells, directorySection));
      } else if (trimmed === "") {
        // keep header while inside table blocks; tables are separated by headings
      }
      continue;
    }

    if (!domain) continue;

    // ── Inside a domain ───────────────────────────────────────
    if (/^\*\*Label:\*\*/.test(trimmed)) {
      const fields = trimmed.split(/\s+·\s+(?=\*\*)/);
      for (const f of fields) {
        const m = /^\*\*(Label|Depth target|Prerequisites):\*\*\s*(.+)$/.exec(f);
        if (!m) continue;
        if (m[1] === "Label") domain.labelText = m[2].trim();
        if (m[1] === "Depth target") domain.depthText = m[2].trim();
        if (m[1] === "Prerequisites") {
          domain.prereqText = m[2].trim();
          domain.prereqCodes = parsePrereqCodes(m[2]);
        }
      }
      resolveTier = tierResolver(domain.labelText);
      continue;
    }
    const why = /^\*\*(Why it matters|Current version context[^*]*):\*\*\s*(.+)$/.exec(trimmed);
    if (why) {
      domain.whyText = domain.whyText ? `${domain.whyText}\n\n${why[2]}` : why[2];
      continue;
    }

    if (/^### Resources/.test(line)) {
      finishTopic();
      mode = "resources";
      tableHeader = null;
      continue;
    }
    if (/^### Timeless/.test(line)) {
      finishTopic();
      mode = "notes";
      continue;
    }
    const parentMatch = /^### (\d+\.\d+) (.+)$/.exec(line);
    if (parentMatch) {
      finishTopic();
      const title = parentMatch[2].trim();
      parent = { code: parentMatch[1], title, tier: resolveTier(parentMatch[1], title), topics: [] };
      domain.parents.push(parent);
      mode = "parent";
      continue;
    }
    const topicMatch = /^#### (\d+\.\d+\.\d+) (.+)$/.exec(line);
    if (topicMatch && parent) {
      finishTopic();
      topic = { code: topicMatch[1], title: topicMatch[2].trim(), tier: parent.tier, estMinutes: 0, subtopics: [] };
      parent.topics.push(topic);
      mode = "topic";
      continue;
    }

    if (mode === "notes") {
      if (trimmed) domain.notesMd += `${line}\n`;
      continue;
    }

    if (mode === "resources") {
      if (trimmed.startsWith("|")) {
        if (isSeparatorRow(trimmed)) continue;
        const cells = splitRow(trimmed);
        if (!tableHeader) {
          tableHeader = cells;
          continue;
        }
        const row = directoryRow(tableHeader, cells, `Domain ${domain.code}: ${domain.title}`);
        row.domainCode = domain.code;
        result.resources.push(row);
      }
      continue;
    }

    if ((mode === "parent" || mode === "topic") && parent) {
      if (trimmed.startsWith("|")) {
        if (isSeparatorRow(trimmed)) continue;
        const cells = splitRow(trimmed);
        if (cells[0] === "Category" || cells[0] === "Average") continue; // table header rows
        ensureSyntheticTopic();
        (topic as unknown as ParsedTopic).subtopics.push({ title: cleanInline(cells[0]), concepts: cells.slice(1).map(cleanInline).filter(Boolean) });
        continue;
      }
      const bullet = /^(\s*)- (.+)$/.exec(line);
      if (bullet) {
        ensureSyntheticTopic();
        const current = topic as unknown as ParsedTopic;
        const indent = bullet[1].length;
        const text = cleanInline(bullet[2]);
        if (indent === 0) current.subtopics.push({ title: text, concepts: [] });
        else {
          const last = current.subtopics[current.subtopics.length - 1];
          if (last) last.concepts.push(indent >= 4 ? `— ${text}` : text);
          else current.subtopics.push({ title: text, concepts: [] });
        }
      }
    }
  }
  finishTopic();
  // Finalize estimates for specialization topics & synthetic topics
  for (const d of result.domains)
    for (const p of d.parents)
      for (const tp of p.topics) if (!tp.estMinutes) tp.estMinutes = estimateMinutes(tp.subtopics, d.depthText, tp.tier);

  result.introMd = introLines.join("\n").trim();
  result.sequenceMd = sequenceLines.join("\n").trim();
  result.timelessMd = timelessLines.join("\n").replace(/\n---\s*$/, "").trim();
  return result;
}

function directoryRow(header: string[], cells: string[], section: string): ParsedResource {
  const col = (...names: string[]) => {
    const idx = header.findIndex((h) => names.some((n) => h.toLowerCase() === n.toLowerCase()));
    return idx >= 0 ? (cells[idx] ?? "") : "";
  };
  const urlCell = col("URL");
  const urls = [...urlCell.matchAll(/https?:\/\/[^\s|·]+/g)].map((m) => m[0].replace(/[.,]$/, ""));
  const type = col("Type");
  const name = cleanInline(cells[0] ?? "");
  const creator = col("Creator / Org", "Organization", "Author", "Creator", "Speaker", "Hosts", "Author / Org");
  const related = col("Relevant domains", "Relevant domain");
  const what = col("What to learn", "Use for", "Strengths", "Why", "Focus", "Known for") || (related ? `Relevant to domains ${related}` : "");
  const firstDomain = /(\d+)/.exec(related)?.[1] ?? null;
  return {
    section,
    category: categorize(type || section, section),
    name,
    type: type || section,
    creator,
    url: urls[0] ?? "",
    extraUrls: urls.slice(1),
    what,
    domainCode: firstDomain,
  };
}

export const __test = { tierResolver, DASH };
