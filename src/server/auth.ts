import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { DUMMY_HASH, hashPassword, verifyPassword } from "@/lib/password";
import { USERS, type AuthUser } from "@/lib/users";
import { SESSION_COOKIE, SESSION_DAYS, cookieOptions, makeSessionToken, readSessionToken } from "./session";

const MAX_FAILED = 5;
const LOCK_WINDOW_MS = 15 * 60 * 1000;

/** Failed sign-ins per username, in memory (per server instance). */
const failures = new Map<string, number[]>();
/** scrypt hashes of the env passwords, computed once; plaintext is never kept beyond the env var. */
const hashes = new Map<string, string>();

function storedHash(envName: string): string | null {
  const pw = process.env[envName];
  if (!pw) return null;
  const cached = hashes.get(envName);
  if (cached) return cached;
  const h = hashPassword(pw);
  hashes.set(envName, h);
  return h;
}

/** Verifies credentials server-side with rate limiting. */
export async function verifyCredentials(usernameRaw: string, password: string): Promise<{ userId: string } | { error: string }> {
  const username = usernameRaw.trim().replace(/\s+/g, " ").toLowerCase();
  const now = Date.now();
  const recent = (failures.get(username) ?? []).filter((at) => at > now - LOCK_WINDOW_MS);
  if (recent.length >= MAX_FAILED) return { error: "Too many attempts. Wait 15 minutes, then try again." };

  const user = USERS.find((u) => u.username === username);
  const hash = user ? storedHash(user.passwordEnv) : null;
  const ok = verifyPassword(password, hash ?? DUMMY_HASH) && !!user && !!hash;
  if (!ok || !user) {
    failures.set(username, [...recent, now]);
    return { error: "That username and password don't match. Check both and try again." };
  }
  failures.delete(username);
  return { userId: user.id };
}

export async function createSession(userId: string) {
  const expiresAt = Date.now() + SESSION_DAYS * 86_400_000;
  (await cookies()).set(SESSION_COOKIE, makeSessionToken(userId, expiresAt), cookieOptions(expiresAt));
}

export async function destroySession() {
  (await cookies()).delete(SESSION_COOKIE);
}

/** Reads and verifies the signed session cookie. Memoized per request. */
export const getSessionUser = cache(async (): Promise<AuthUser | null> => {
  return readSessionToken((await cookies()).get(SESSION_COOKIE)?.value)?.user ?? null;
});

export async function requireUser(): Promise<AuthUser> {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  return user;
}
