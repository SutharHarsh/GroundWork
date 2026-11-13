"use client";
import { currentUser, type LocalUser } from "./store";

/** The signed-in learner's local profile row. Sign-in itself is verified on the server (src/server/auth.ts). */
export type SessionUser = LocalUser;
export async function requireOnboardedUser(): Promise<SessionUser> {
  return currentUser();
}
export const requireUser = requireOnboardedUser;
