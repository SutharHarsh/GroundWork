import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { USERS, type AuthUser } from "@/lib/users";

/**
 * Stateless sessions: the cookie holds `userId.expiry.signature`, signed with HMAC-SHA256.
 * The key comes from SESSION_SECRET, or is derived from the server-only passwords, so changing a
 * password signs everyone out. Nothing about sessions is stored in a database.
 */
export const SESSION_DAYS = 60;
export const RENEW_WHEN_DAYS_LEFT = 45;

function key() {
  const material = process.env.SESSION_SECRET || USERS.map((u) => process.env[u.passwordEnv] ?? "").join("\u0000");
  return createHash("sha256").update(`groundwork-session|${material}`).digest();
}

export const SESSION_COOKIE = "gw_session";

const sign = (payload: string) => createHmac("sha256", key()).update(payload).digest("base64url");

export function makeSessionToken(userId: string, expiresAt: number) {
  const payload = `${userId}.${expiresAt}`;
  return `${payload}.${sign(payload)}`;
}

/** Returns the user and expiry for a valid, unexpired token; otherwise null. */
export function readSessionToken(token: string | undefined): { user: AuthUser; expiresAt: number } | null {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [userId, exp, sig] = parts;
  const expected = Buffer.from(sign(`${userId}.${exp}`));
  const actual = Buffer.from(sig);
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return null;
  const expiresAt = Number(exp);
  if (!Number.isFinite(expiresAt) || expiresAt < Date.now()) return null;
  const u = USERS.find((x) => x.id === userId);
  if (!u || !process.env[u.passwordEnv]) return null;
  return { user: { id: u.id, name: u.name, pathId: u.pathId }, expiresAt };
}

export const cookieOptions = (expiresAt: number) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production" && process.env.INSECURE_COOKIES !== "1",
  sameSite: "lax" as const,
  path: "/",
  expires: new Date(expiresAt),
});
