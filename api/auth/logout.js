import { clearCookie, SESSION_COOKIE, DENIED_COOKIE } from "../../lib/http.js";

// Clears both cookies and sends the visitor back through Google sign-in
// (useful for switching to a different account).
export default function handler(req, res) {
  res.setHeader("Set-Cookie", [clearCookie(SESSION_COOKIE), clearCookie(DENIED_COOKIE)]);
  res.writeHead(302, { Location: "/api/auth/login" });
  res.end();
}
