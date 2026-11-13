import type { SQLJsDatabase } from "drizzle-orm/sql-js";
import type * as schema from "./schema";

/**
 * The learner's database, running in the browser (sql.js). It is set up by `openLocalDb` in
 * src/local/store.ts before any page renders; every query in src/local reads this binding.
 */
export type Db = SQLJsDatabase<typeof schema>;
export let db: Db = undefined as unknown as Db;
export function setDb(next: Db) {
  db = next;
}

export type Tx = Parameters<Parameters<Db["transaction"]>[0]>[0];
export * as t from "./schema";
