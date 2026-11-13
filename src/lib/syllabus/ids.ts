/** Deterministic, URL-safe IDs for syllabus content so progress survives re-seeding. */
export function pathPrefix(pathId: string) {
  return pathId === "frontend" ? "fe" : "pd";
}
const slug = (code: string) => code.replace(/\./g, "-");
export const domainId = (pathId: string, code: string) => `${pathPrefix(pathId)}-d${slug(code)}`;
export const parentId = (pathId: string, code: string) => `${pathPrefix(pathId)}-p${slug(code)}`;
export const topicId = (pathId: string, code: string) => `${pathPrefix(pathId)}-t${slug(code)}`;
export const subtopicId = (topicId: string, index: number) => `${topicId}-s${index}`;
