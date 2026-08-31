import { next } from "@vercel/edge";
import { isAllowed } from "./lib/allowlist.js";
import { verifySessionToken } from "./lib/session.js";
import { parseCookies, SESSION_COOKIE, DENIED_COOKIE } from "./lib/http.js";
import { deniedPage } from "./lib/denied-page.js";

// Run on every request EXCEPT the auth endpoints themselves and the Vite build
// assets (gating those adds nothing — an unapproved visitor is redirected before
// the HTML that would request them ever loads). The Allure report folders
// (/OnlineSales, /All-APIs-report, …) are NOT excluded, so they stay protected.
export const config = {
  matcher: ["/((?!api/auth|assets/|favicon\\.svg|favicon\\.ico|robots\\.txt).*)"],
};

export default async function middleware(request) {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    return new Response(
      "Auth is not configured: the AUTH_SECRET environment variable is missing.",
      { status: 500, headers: { "content-type": "text/plain; charset=utf-8" } },
    );
  }

  const cookies = parseCookies(request.headers.get("cookie"));
  const session = await verifySessionToken(cookies[SESSION_COOKIE], secret);

  // Approved: let the request through untouched.
  if (session && isAllowed(session.email)) {
    return next();
  }

  // Signed in with Google, but not on the allow list → show the message.
  const deniedEmail = cookies[DENIED_COOKIE];
  if (deniedEmail) {
    return new Response(deniedPage(deniedEmail), {
      status: 403,
      headers: {
        "content-type": "text/html; charset=utf-8",
        "cache-control": "no-store",
      },
    });
  }

  // Never signed in → start the Google sign-in flow, remembering where they were.
  const url = new URL(request.url);
  const login = new URL("/api/auth/login", url.origin);
  login.searchParams.set("from", url.pathname + url.search);
  return Response.redirect(login, 302);
}
