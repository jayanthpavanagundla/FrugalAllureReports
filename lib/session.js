// Stateless signed session token: "<base64url(payload)>.<base64url(hmac)>".
// Uses Web Crypto (crypto.subtle), which exists in both the Edge runtime
// (middleware) and Node.js 18+ (api/ routes), so one implementation covers both.

const ENCODER = new TextEncoder();
const DECODER = new TextDecoder();

function b64urlEncode(input) {
  const bytes = input instanceof Uint8Array ? input : new Uint8Array(input);
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function b64urlDecode(str) {
  let s = str.replace(/-/g, "+").replace(/_/g, "/");
  while (s.length % 4) s += "=";
  const bin = atob(s);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

async function hmacKey(secret) {
  return crypto.subtle.importKey(
    "raw",
    ENCODER.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

export async function createSessionToken(payload, secret, ttlSeconds = 60 * 60 * 24 * 7) {
  const body = { ...payload, exp: Math.floor(Date.now() / 1000) + ttlSeconds };
  const data = b64urlEncode(ENCODER.encode(JSON.stringify(body)));
  const sig = await crypto.subtle.sign("HMAC", await hmacKey(secret), ENCODER.encode(data));
  return `${data}.${b64urlEncode(sig)}`;
}

export async function verifySessionToken(token, secret) {
  if (!token || typeof token !== "string" || !token.includes(".")) return null;
  const [data, sig] = token.split(".");
  if (!data || !sig) return null;

  let valid = false;
  try {
    valid = await crypto.subtle.verify(
      "HMAC",
      await hmacKey(secret),
      b64urlDecode(sig),
      ENCODER.encode(data),
    );
  } catch {
    return null;
  }
  if (!valid) return null;

  let body;
  try {
    body = JSON.parse(DECODER.decode(b64urlDecode(data)));
  } catch {
    return null;
  }
  if (!body || typeof body.exp !== "number" || body.exp < Math.floor(Date.now() / 1000)) {
    return null;
  }
  return body;
}
