// Small cookie helpers + shared cookie names. Pure JS — safe in both the
// Edge (middleware) and Node.js (api/) runtimes.

export const SESSION_COOKIE = "ah_session"; // signed proof the visitor is approved
export const DENIED_COOKIE = "ah_denied"; // email of a signed-in but not-approved visitor
export const STATE_COOKIE = "ah_oauth"; // short-lived CSRF nonce + return path

export function parseCookies(header) {
  const out = {};
  if (!header) return out;
  for (const part of header.split(";")) {
    const idx = part.indexOf("=");
    if (idx === -1) continue;
    const key = part.slice(0, idx).trim();
    if (!key) continue;
    out[key] = decodeURIComponent(part.slice(idx + 1).trim());
  }
  return out;
}

export function serializeCookie(name, value, opts = {}) {
  const parts = [`${name}=${encodeURIComponent(value)}`];
  parts.push(`Path=${opts.path || "/"}`);
  if (opts.maxAge != null) parts.push(`Max-Age=${Math.floor(opts.maxAge)}`);
  parts.push(`SameSite=${opts.sameSite || "Lax"}`);
  if (opts.httpOnly !== false) parts.push("HttpOnly");
  if (opts.secure !== false) parts.push("Secure");
  return parts.join("; ");
}

export function clearCookie(name) {
  return serializeCookie(name, "", { maxAge: 0 });
}
