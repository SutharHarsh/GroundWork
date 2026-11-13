"use server";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createSession, destroySession, verifyCredentials } from "../auth";

export type LoginState = { error?: string; fieldErrors?: { username?: string; password?: string }; username?: string };

const schema = z.object({
  username: z.string().trim().min(1, "Enter your username.").max(80),
  password: z.string().min(1, "Enter your password.").max(200),
});

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const parsed = schema.safeParse({ username: formData.get("username"), password: formData.get("password") });
  const username = String(formData.get("username") ?? "");
  if (!parsed.success) {
    const f = parsed.error.flatten().fieldErrors;
    return { username, fieldErrors: { username: f.username?.[0], password: f.password?.[0] } };
  }
  const result = await verifyCredentials(parsed.data.username, parsed.data.password);
  if ("error" in result) return { username, error: result.error };
  await createSession(result.userId);
  redirect("/");
}

export async function logout() {
  await destroySession();
  redirect("/login");
}
