"use client";
import initSqlJs, { type Database, type SqlJsStatic } from "sql.js";
import { drizzle } from "drizzle-orm/sql-js";
import { eq } from "drizzle-orm";
import * as schema from "@/db/schema";
import { db, setDb } from "@/db";
import type { AuthUser } from "@/lib/users";
import { getFile, putFile } from "./files";

/**
 * Local-first data store.
 * - The syllabus (read-only) is downloaded from /api/content as a SQLite file and opened with sql.js.
 * - Everything the learner adds (progress, notes, sessions, plan, proofs, projects) is saved as JSON in
 *   localStorage under `groundwork:data:<userId>`, and layered on top of the syllabus at startup.
 * - Uploaded files are stored in IndexedDB (see ./files.ts).
 * Nothing the learner adds is ever sent to the server.
 */
const USER_TABLES = [
  "users",
  "topic_progress",
  "subtopic_progress",
  "learning_sessions",
  "mastery_assessments",
  "proofs",
  "projects",
  "schedule_items",
  "resource_states",
  "activities",
] as const;

type TableDump = { columns: string[]; rows: unknown[][] };
export type Backup = { app: "groundwork"; format: 1; userId: string; pathId: string; exportedAt: string; tables: Record<string, TableDump>; files?: Record<string, { name: string; mime: string; dataUrl: string }> };

export type LocalUser = typeof schema.users.$inferSelect;

let sqlJs: Promise<SqlJsStatic> | null = null;
let state: { user: AuthUser; raw: Database; contentVersion: string } | null = null;
let opening: { key: string; promise: Promise<void> } | null = null;
let version = 0;
const listeners = new Set<() => void>();

const storageKey = (userId: string) => `groundwork:data:${userId}`;

export function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
export const getVersion = () => version;
function bump() {
  version++;
  for (const l of listeners) l();
}

export const isOpen = (userId: string) => state?.user.id === userId;

/* ── dump / load of the learner's tables ───────────────────────────────── */

function columnsOf(raw: Database, table: string): string[] {
  const res = raw.exec(`PRAGMA table_info(${table})`);
  return res[0]?.values.map((r) => String(r[1])) ?? [];
}

function dump(raw: Database): Record<string, TableDump> {
  const out: Record<string, TableDump> = {};
  for (const table of USER_TABLES) {
    const res = raw.exec(`SELECT * FROM ${table}`);
    out[table] = res[0] ? { columns: res[0].columns, rows: res[0].values as unknown[][] } : { columns: columnsOf(raw, table), rows: [] };
  }
  return out;
}

function load(raw: Database, tables: Record<string, TableDump> | undefined) {
  if (!tables) return;
  raw.run("BEGIN");
  try {
    for (const table of USER_TABLES) {
      const data = tables[table];
      raw.run(`DELETE FROM ${table}`);
      if (!data?.rows.length) continue;
      const have = new Set(columnsOf(raw, table));
      const idx = data.columns.map((c, i) => [c, i] as const).filter(([c]) => have.has(c));
      if (!idx.length) continue;
      const stmt = raw.prepare(`INSERT OR REPLACE INTO ${table} (${idx.map(([c]) => `"${c}"`).join(",")}) VALUES (${idx.map(() => "?").join(",")})`);
      for (const row of data.rows) stmt.run(idx.map(([, i]) => (row[i] ?? null) as string | number | null));
      stmt.free();
    }
    raw.run("COMMIT");
  } catch (e) {
    raw.run("ROLLBACK");
    throw e;
  }
}

function readSaved(userId: string): Record<string, TableDump> | undefined {
  try {
    const text = window.localStorage.getItem(storageKey(userId));
    if (!text) return undefined;
    return (JSON.parse(text) as { tables: Record<string, TableDump> }).tables;
  } catch {
    return undefined;
  }
}

function ensureUserRow(raw: Database, user: AuthUser) {
  raw.run("INSERT OR IGNORE INTO users (id, name, username, password_hash, path_id, created_at) VALUES (?, ?, ?, '', ?, ?)", [user.id, user.name, user.name.toLowerCase(), user.pathId, Date.now()]);
  raw.run("UPDATE users SET name = ?, path_id = ? WHERE id = ?", [user.name, user.pathId, user.id]);
}

/* ── open / save ───────────────────────────────────────────────────────── */

export function openLocalDb(user: AuthUser, contentVersion: string): Promise<void> {
  const key = `${user.id}|${contentVersion}`;
  if (state && `${state.user.id}|${state.contentVersion}` === key) return Promise.resolve();
  if (opening?.key === key) return opening.promise;
  const promise = (async () => {
    sqlJs ??= initSqlJs({ locateFile: () => "/sql-wasm.wasm" });
    const [SQL, res] = await Promise.all([sqlJs, fetch(`/api/content?v=${contentVersion}&path=${user.pathId}`)]);
    if (res.status === 401) {
      window.location.assign(new URL("/login", window.location.origin).toString());
      return;
    }
    if (!res.ok) throw new Error(`Couldn't load the syllabus (${res.status}).`);
    const raw = new SQL.Database(new Uint8Array(await res.arrayBuffer()));
    load(raw, readSaved(user.id));
    ensureUserRow(raw, user);
    state?.raw.close();
    state = { user, raw, contentVersion };
    setDb(drizzle(raw, { schema }));
    bump();
  })().finally(() => {
    opening = null;
  });
  opening = { key, promise };
  return promise;
}

/** Saves the learner's data to localStorage and re-renders every view. Called after each change. */
export function commit() {
  if (!state) return;
  const text = JSON.stringify({ format: 1, savedAt: Date.now(), tables: dump(state.raw) });
  try {
    window.localStorage.setItem(storageKey(state.user.id), text);
  } catch {
    bump();
    throw new Error("This browser's storage is full. Download a backup in Settings, then free some space.");
  }
  bump();
}

/** Another tab saved: reload from storage so every open tab shows the same data. */
if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (!state || e.key !== storageKey(state.user.id) || !e.newValue) return;
    try {
      load(state.raw, (JSON.parse(e.newValue) as { tables: Record<string, TableDump> }).tables);
      ensureUserRow(state.raw, state.user);
      bump();
    } catch {
      // ignore a malformed write from another tab
    }
  });
}

export function currentUser(): LocalUser {
  if (!state) throw new Error("Local data isn't loaded yet.");
  return db.select().from(schema.users).where(eq(schema.users.id, state.user.id)).get()!;
}

/* ── backup ────────────────────────────────────────────────────────────── */

const toDataUrl = (blob: Blob) =>
  new Promise<string>((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = () => reject(r.error);
    r.readAsDataURL(blob);
  });

export async function exportBackup(): Promise<{ fileName: string; blob: Blob }> {
  if (!state) throw new Error("Local data isn't loaded yet.");
  const tables = dump(state.raw);
  const files: NonNullable<Backup["files"]> = {};
  const proofs = db.select({ filePath: schema.proofs.filePath }).from(schema.proofs).all();
  for (const p of proofs) {
    if (!p.filePath?.startsWith("idb:")) continue;
    const f = await getFile(p.filePath);
    if (f) files[p.filePath] = { name: f.name, mime: f.mime, dataUrl: await toDataUrl(f.blob) };
  }
  const backup: Backup = { app: "groundwork", format: 1, userId: state.user.id, pathId: state.user.pathId, exportedAt: new Date().toISOString(), tables, files };
  const stamp = new Date().toISOString().slice(0, 10);
  return { fileName: `groundwork-${state.user.id}-${stamp}.json`, blob: new Blob([JSON.stringify(backup)], { type: "application/json" }) };
}

export async function importBackup(text: string): Promise<string> {
  if (!state) throw new Error("Local data isn't loaded yet.");
  let backup: Backup;
  try {
    backup = JSON.parse(text) as Backup;
  } catch {
    throw new Error("That file isn't a Groundwork backup.");
  }
  if (backup?.app !== "groundwork" || !backup.tables) throw new Error("That file isn't a Groundwork backup.");
  if (backup.userId !== state.user.id) throw new Error("That backup belongs to another learner.");
  for (const [key, f] of Object.entries(backup.files ?? {})) {
    const blob = await (await fetch(f.dataUrl)).blob();
    await putFile(key, { blob, name: f.name, mime: f.mime });
  }
  load(state.raw, backup.tables);
  ensureUserRow(state.raw, state.user);
  commit();
  return `Backup from ${new Date(backup.exportedAt).toLocaleDateString()} restored`;
}
