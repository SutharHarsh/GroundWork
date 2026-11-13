import { getSessionUser } from "@/server/auth";
import { CONTENT_VERSION, readContent } from "@/server/content";

/** Serves the signed-in learner's syllabus database (only their own path). */
export async function GET(request: Request) {
  const user = await getSessionUser();
  if (!user) return new Response("Not signed in", { status: 401 });
  const bytes = readContent(user.pathId);
  const version = CONTENT_VERSION;
  const q = new URL(request.url).searchParams;
  // Long-lived cache only for a URL that names this exact version and path (two learners can share a browser).
  const exact = q.get("v") === version && q.get("path") === user.pathId;
  return new Response(new Uint8Array(bytes), {
    headers: {
      "Content-Type": "application/vnd.sqlite3",
      "Cache-Control": exact ? "private, max-age=31536000, immutable" : "private, no-cache",
      ETag: `"${version}-${user.pathId}"`,
    },
  });
}
