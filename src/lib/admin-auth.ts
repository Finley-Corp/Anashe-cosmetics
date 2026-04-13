import crypto from "node:crypto";

export const ADMIN_SESSION_COOKIE = "anashe_admin_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 8; // 8 hours

function getAdminSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    throw new Error("ADMIN_SESSION_SECRET is not set");
  }
  return secret;
}

function sign(payload: string) {
  return crypto
    .createHmac("sha256", getAdminSecret())
    .update(payload)
    .digest("hex");
}

export function createAdminSessionToken() {
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_MAX_AGE_SECONDS;
  const payload = `${expiresAt}`;
  const signature = sign(payload);
  return `${payload}.${signature}`;
}

export function verifyAdminSessionToken(token: string | undefined | null) {
  if (!token) return false;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;

  const expected = sign(payload);
  const sigBuf = Buffer.from(signature);
  const expBuf = Buffer.from(expected);
  if (sigBuf.length !== expBuf.length) return false;
  if (!crypto.timingSafeEqual(sigBuf, expBuf)) return false;

  const expiresAt = Number(payload);
  if (!Number.isFinite(expiresAt)) return false;
  if (expiresAt < Math.floor(Date.now() / 1000)) return false;

  return true;
}

export function getSessionMaxAge() {
  return SESSION_MAX_AGE_SECONDS;
}
