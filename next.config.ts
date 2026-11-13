import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import type { NextConfig } from "next";

/** Fingerprint of the built syllabus files (scripts/build-content.ts runs before dev and build). */
function contentVersion() {
  try {
    const h = createHash("sha256");
    for (const id of ["frontend", "designer"]) h.update(fs.readFileSync(path.join(process.cwd(), "content", `${id}.sqlite`)));
    return h.digest("hex").slice(0, 16);
  } catch {
    return "dev";
  }
}

/**
 * Groundwork is local-first: sign-in is verified on the server, the syllabus is served as a small
 * SQLite file (content/*.sqlite, built by scripts/build-content.ts), and everything a learner adds
 * is stored in their own browser. Cache Components / Partial Prefetching are not used.
 */
const nextConfig: NextConfig = {
  // Lets a test build live next to a running dev server (e.g. NEXT_DIST_DIR=.next-test).
  distDir: process.env.NEXT_DIST_DIR ?? ".next",
  cacheComponents: false,
  partialPrefetching: false,
  env: { GROUNDWORK_CONTENT_VERSION: contentVersion() },
  // The syllabus databases are read at runtime by /api/content.
  outputFileTracingIncludes: { "/api/content": ["./content/**"] },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
  turbopack: {
    // sql.js references Node's fs/path only when it runs under Node; the browser build never needs them.
    resolveAlias: {
      fs: { browser: "./src/lib/empty-module.ts" },
      path: { browser: "./src/lib/empty-module.ts" },
      crypto: { browser: "./src/lib/empty-module.ts" },
    },
    rules: {
      // Only our own stylesheets: running Tailwind over Next's generated next/font CSS breaks its font URLs.
      "*.css": {
        condition: { not: "foreign" },
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
