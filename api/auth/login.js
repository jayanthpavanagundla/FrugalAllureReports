import { serializeCookie, STATE_COOKIE } from "../../lib/http.js";

// Kicks off Google sign-in: stashes a CSRF nonce + the page the visitor
// wanted, then redirects to Google's consent screen.
export default function handler(req, res) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) {
    res.status(500).send("Missing GOOGLE_CLIENT_ID environment variable.");
    return;
  }

  const origin = `https://${req.headers.host}`;
  const redirectUri = `${origin}/api/auth/callback`;

  const state = crypto.randomUUID();
  const fromParam = typeof req.query.from === "string" ? req.query.from : "/";
  const from = fromParam.startsWith("/") && !fromParam.startsWith("//") ? fromParam : "/";

  const statePayload = Buffer.from(JSON.stringify({ state, from })).toString("base64url");

  const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("scope", "openid email profile");
  authUrl.searchParams.set("state", state);
  authUrl.searchParams.set("prompt", "select_account");
  authUrl.searchParams.set("access_type", "online");

  res.setHeader(
    "Set-Cookie",
    serializeCookie(STATE_COOKIE, statePayload, { maxAge: 600 }),
  );
  res.writeHead(302, { Location: authUrl.toString() });
  res.end();
}
