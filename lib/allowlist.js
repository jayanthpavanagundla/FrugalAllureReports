// ─────────────────────────────────────────────────────────────────────────────
// ACCESS CONTROL LIST
// Only the Google accounts listed here can open the site. Everyone else signs
// in successfully with Google but then sees the "request access" screen.
//
// To change who has access: edit ALLOWED_EMAILS below, then redeploy.
// Matching is case-insensitive and ignores surrounding whitespace.
// ─────────────────────────────────────────────────────────────────────────────
export const ALLOWED_EMAILS = [
  "pavanagundla.jayanth@frugaltesting.com",
  "bharti@frugaltesting.com",
  "suhail@frugaltestingin.com",
  "rupesh@frugaltesting.com",
  "info@frugaltesting.com",
];

// Where "Request access" emails are sent (the mailto: button on the denied page).
export const ACCESS_REQUEST_CONTACT = "pavanagundla.jayanth@frugaltesting.com";

const NORMALIZED = new Set(
  ALLOWED_EMAILS.map((e) => String(e).trim().toLowerCase()).filter(Boolean),
);

export function isAllowed(email) {
  if (!email) return false;
  return NORMALIZED.has(String(email).trim().toLowerCase());
}
