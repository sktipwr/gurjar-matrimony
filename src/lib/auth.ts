/**
 * Edge-compatible auth helpers (Web Crypto API — works in middleware & API routes).
 * Cookie value = HMAC-SHA256(SITE_PASSWORD, COOKIE_SECRET)
 * → nobody can forge it without knowing both env vars.
 */

export const COOKIE_NAME = "gm_auth";
export const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

async function hmac(message: string, secret: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** Compute the expected cookie token from env vars */
export async function expectedToken(): Promise<string> {
  const password = process.env.SITE_PASSWORD ?? "";
  const secret   = process.env.COOKIE_SECRET  ?? "fallback-dev-secret";
  return hmac(password, secret);
}

/** Constant-time string comparison to prevent timing attacks */
export function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}
