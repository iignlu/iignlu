import crypto from "node:crypto";
import { cookies } from "next/headers";

/**
 * Admin authentication.
 *
 * One owner, one password — so this is a signed session cookie rather
 * than a whole auth provider. The cookie holds an expiry stamped with an
 * HMAC over ADMIN_SESSION_SECRET, so it cannot be forged or extended
 * from the browser, and it carries no password material.
 */

const COOKIE = "tuvana_admin";
const MAX_AGE_SECONDS = 60 * 60 * 12;

function secret(): string {
  const s = process.env.ADMIN_SESSION_SECRET;
  if (!s || s.length < 16) {
    throw new Error("ADMIN_SESSION_SECRET is missing or too short (need 16+ chars)");
  }
  return s;
}

export function isAdminConfigured(): boolean {
  return Boolean(
    process.env.ADMIN_PASSWORD &&
      process.env.ADMIN_SESSION_SECRET &&
      process.env.ADMIN_SESSION_SECRET.length >= 16,
  );
}

/** Constant-time compare so a wrong password leaks nothing through timing. */
export function verifyPassword(candidate: string): boolean {
  const expected = process.env.ADMIN_PASSWORD ?? "";
  if (!expected) return false;
  const a = Buffer.from(candidate);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

function sign(payload: string): string {
  return crypto.createHmac("sha256", secret()).update(payload).digest("hex");
}

export function createSessionToken(): string {
  const expiresAt = Date.now() + MAX_AGE_SECONDS * 1000;
  const payload = String(expiresAt);
  return `${payload}.${sign(payload)}`;
}

export function verifySessionToken(token: string | undefined): boolean {
  if (!token) return false;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;

  const expected = sign(payload);
  const given = Buffer.from(signature);
  const want = Buffer.from(expected);
  if (given.length !== want.length) return false;
  if (!crypto.timingSafeEqual(given, want)) return false;

  const expiresAt = Number(payload);
  return Number.isFinite(expiresAt) && expiresAt > Date.now();
}

export async function isAdminAuthenticated(): Promise<boolean> {
  if (!isAdminConfigured()) return false;
  try {
    const jar = await cookies();
    return verifySessionToken(jar.get(COOKIE)?.value);
  } catch {
    return false;
  }
}

export const ADMIN_COOKIE = COOKIE;
export const ADMIN_COOKIE_MAX_AGE = MAX_AGE_SECONDS;
