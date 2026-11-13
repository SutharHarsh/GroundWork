/** Learning objectives and practical exercises derived from a topic's own subtopics and concepts. */

const lower = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);
const short = (s: string) => s.replace(/\s*\(.*?\)\s*/g, " ").replace(/[:;].*$/, "").trim();

export function objectivesFor(pathId: string, title: string, subtopics: { title: string }[]): string[] {
  const subs = subtopics.slice(0, 5).map((s) => short(s.title));
  const out = subs.map((s) => (pathId === "frontend" ? `Explain and use ${lower(s)}` : `Explain and apply ${lower(s)}`));
  out.push(
    pathId === "frontend"
      ? `Build a small working example that demonstrates ${lower(title)} without copying it`
      : `Apply ${lower(title)} in a real design and justify the decision`,
  );
  return out;
}

export function exercisesFor(pathId: string, title: string, subtopics: { title: string }[]): { title: string; body: string }[] {
  const s = subtopics.map((x) => lower(short(x.title)));
  const pick = (i: number) => s[i % Math.max(1, s.length)] ?? lower(title);
  if (pathId === "frontend") {
    return [
      { title: "Explain it", body: `Without notes, write a 150-word explanation of ${lower(title)} that covers ${pick(0)} and ${pick(1)}. Then check it against the resources and fix what was wrong.` },
      { title: "Build it", body: `Create a minimal demo (a local repo, CodePen or StackBlitz) that exercises ${pick(1)}${s.length > 2 ? ` and ${pick(2)}` : ""}. Commit it and keep the link as proof of work.` },
      { title: "Break it", body: `Introduce a bug or an edge case around ${pick(s.length > 3 ? 3 : 0)}, then find and fix it with DevTools, logs or a test. Write down the root cause.` },
      { title: "Teach it", body: `Record a 3-minute walkthrough or write a short post explaining ${lower(title)} to a junior developer, including one trade-off.` },
    ];
  }
  return [
    { title: "Explain it", body: `In your own words, describe ${lower(title)} and why it matters, referring to ${pick(0)} and ${pick(1)}.` },
    { title: "Apply it", body: `Design a small screen or component in Figma that deliberately applies ${pick(1)}${s.length > 2 ? ` and ${pick(2)}` : ""}. Annotate where each one shows up.` },
    { title: "Critique it", body: `Find two real products that handle ${lower(title)} differently. Critique each with specific principles and say which works better and why.` },
    { title: "Show it", body: `Put the work on a Figma page or in a short case-study note and link it here as proof of work, with a sentence on what you'd change next time.` },
  ];
}

const STOP = new Set("a an and the of to for in on with by from at is are as or your you it its into how what why when be this that their them they".split(" "));
function words(text: string) {
  return new Set(
    text
      .toLowerCase()
      .replace(/[^a-z0-9+#.\s-]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 2 && !STOP.has(w)),
  );
}

/** Ranks domain resources by word overlap with the topic and its subtopics. */
export function rankResources<T extends { name: string; what: string }>(topicText: string, resources: T[]): (T & { score: number })[] {
  const tw = words(topicText);
  return resources
    .map((r, i) => {
      const rw = words(`${r.name} ${r.what}`);
      let score = 0;
      for (const w of rw) if (tw.has(w)) score += 1;
      return { ...r, score: score + (resources.length - i) * 0.001 };
    })
    .sort((a, b) => b.score - a.score);
}
