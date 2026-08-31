import { isAllowed } from "../../lib/allowlist.js";
import { createSessionToken } from "../../lib/session.js";
import {
  parseCookies,
  serializeCookie,
  clearCookie,
  SESSION_COOKIE,
  DENIED_COOKIE,
  STATE_COOKIE,
} from "../../lib/http.js";

const SESSION_TTL = 60 * 60 * 24 * 7; // 7 days
const DENIED_TTL = 60 * 60 * 6; // 6 hours

// Google redirects here after the consent screen. We swap the code for an
// id_token, read the verified email, and either mint a session cookie (approved)
// or a "denied" cookie the middleware turns into the request-access page.
export default async function handler(req, res) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const authSecret = process.env.AUTH_SECRET;
  if (!clientId || !clientSecret || !authSecret) {
    res
      .status(500)
      .send("Auth is not fully configured (GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET / AUTH_SECRET).");
    return;
  }

  const { code, state, error } = req.query;
  if (error) {
    res.writeHead(302, { Location: "/api/auth/login" });
    res.end();
    return;
  }

  // Validate the CSRF nonce and recover the return path.
  const cookies = parseCookies(req.headers.cookie);
  let from = "/";
  try {
    const parsed = JSON.parse(
      Buffer.from(cookies[STATE_COOKIE] || "", "base64url").toString("utf8"),
    );
    if (!parsed || parsed.state !== state) throw new Error("state mismatch");
    if (typeof parsed.from === "string" && parsed.from.startsWith("/") && !parsed.from.startsWith("//")) {
      from = parsed.from;
    }
  } catch {
    res.status(400).send("Invalid or expired sign-in request. Please try signing in again.");
    return;
  }

  if (!code || typeof code !== "string") {
    res.status(400).send("Missing authorization code.");
    return;
  }

  // Exchange the code for tokens (server-to-server, authenticated with our secret).
  const origin = `https://${req.headers.host}`;
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: `${origin}/api/auth/callback`,
      grant_type: "authorization_code",
    }),
  });
  if (!tokenRes.ok) {
    res.status(502).send("Could not complete sign-in with Google (token exchange failed).");
    return;
  }

  const tokens = await tokenRes.json();
  const idToken = tokens.id_token;
  if (!idToken || idToken.split(".").length !== 3) {
    res.status(502).send("Google did not return a valid id_token.");
    return;
  }

  // The id_token arrived directly from Google's token endpoint over TLS, so per
  // Google's guidance we can trust its contents without re-verifying the JWT
  // signature. We still sanity-check the audience.
  let claims;
  try {
    claims = JSON.parse(Buffer.from(idToken.split(".")[1], "base64url").toString("utf8"));
  } catch {
    res.status(502).send("Could not read the Google id_token.");
    return;
  }
  if (claims.aud !== clientId) {
    res.status(401).send("Google id_token audience mismatch.");
    return;
  }

  const email = String(claims.email || "").toLowerCase();
  const emailVerified = claims.email_verified === true || claims.email_verified === "true";

  if (email && emailVerified && isAllowed(email)) {
    const token = await createSessionToken({ email }, authSecret, SESSION_TTL);
    res.setHeader("Set-Cookie", [
      clearCookie(STATE_COOKIE),
      clearCookie(DENIED_COOKIE),
      serializeCookie(SESSION_COOKIE, token, { maxAge: SESSION_TTL }),
    ]);
    res.writeHead(302, { Location: from });
    res.end();
    return;
  }

  // Signed in fine, but not approved.
  res.setHeader("Set-Cookie", [
    clearCookie(STATE_COOKIE),
    clearCookie(SESSION_COOKIE),
    serializeCookie(DENIED_COOKIE, email || "unknown", { maxAge: DENIED_TTL }),
  ]);
  res.writeHead(302, { Location: "/" });
  res.end();
}
