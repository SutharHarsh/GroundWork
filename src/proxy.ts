import { NextResponse, type NextRequest } from "next/server";
import { RENEW_WHEN_DAYS_LEFT, SESSION_COOKIE, SESSION_DAYS, cookieOptions, makeSessionToken, readSessionToken } from "@/server/session";

/**
 * Sends visitors without a valid signed session to the login screen, and renews sessions that are
 * getting old (sliding expiry), so an active learner stays signed in.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = readSessionToken(request.cookies.get(SESSION_COOKIE)?.value);
  if (!session) {
    if (pathname === "/login" || pathname.startsWith("/api/")) return NextResponse.next();
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.search = "";
    return NextResponse.redirect(url);
  }
  // Old project links: projects now open in the projects page's detail panel.
  const legacy = pathname.match(/^\/projects\/([^/]+)$/);
  if (legacy) {
    const url = request.nextUrl.clone();
    url.pathname = "/projects";
    url.search = `?p=${legacy[1]}`;
    return NextResponse.redirect(url);
  }
  const res = NextResponse.next();
  if (session.expiresAt - Date.now() < RENEW_WHEN_DAYS_LEFT * 86_400_000) {
    const expiresAt = Date.now() + SESSION_DAYS * 86_400_000;
    res.cookies.set(SESSION_COOKIE, makeSessionToken(session.user.id, expiresAt), cookieOptions(expiresAt));
  }
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon.svg|sql-wasm.wasm).*)"],
};
