/**
 * Runs before `next dev` and `next build`: turns each syllabus Markdown file into a small SQLite
 * file (content/<pathId>.sqlite) with the full schema and the syllabus content. The browser loads it
 * with sql.js; learner data is never part of it. Also copies the sql.js WebAssembly file to /public.
 */
import fs from "node:fs";
import path from "node:path";
import initSqlJs from "sql.js";
import { drizzle } from "drizzle-orm/sql-js";
import { migrate } from "drizzle-orm/sql-js/migrator";
import * as t from "../src/db/schema";
import { PATHS, seedPath } from "./lib/setup";

async function main() {
  const root = process.cwd();
  const wasmSrc = path.join(root, "node_modules", "sql.js", "dist", "sql-wasm.wasm");
  fs.copyFileSync(wasmSrc, path.join(root, "public", "sql-wasm.wasm"));

  const SQL = await initSqlJs({ locateFile: () => wasmSrc });
  const out = path.join(root, "content");
  fs.mkdirSync(out, { recursive: true });
  for (const p of PATHS) {
    const sqlite = new SQL.Database();
    const db = drizzle(sqlite, { schema: t });
    migrate(db, { migrationsFolder: path.join(root, "drizzle") });
    const r = seedPath(db, p);
    sqlite.run("VACUUM");
    fs.writeFileSync(path.join(out, `${p.id}.sqlite`), Buffer.from(sqlite.export()));
    sqlite.close();
    console.log(`✓ ${p.title}: ${r.domains} domains, ${r.topics} topics, ${r.resources} resources`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
