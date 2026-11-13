import "server-only";
import fs from "node:fs";
import path from "node:path";

/** Build-time fingerprint of the syllabus files, so pages never touch the filesystem. */
export const CONTENT_VERSION = process.env.GROUNDWORK_CONTENT_VERSION || "dev";

/** The prebuilt syllabus database for a path (see scripts/build-content.ts). Used only by /api/content. */
const cache = new Map<string, Buffer>();
export function readContent(pathId: string): Buffer {
  const hit = cache.get(pathId);
  if (hit && process.env.NODE_ENV === "production") return hit;
  const bytes = fs.readFileSync(path.join(/*turbopackIgnore: true*/ process.cwd(), "content", `${pathId}.sqlite`));
  cache.set(pathId, bytes);
  return bytes;
}
