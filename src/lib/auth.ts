import { timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const SESSION_COOKIE = "admin_session";
const SESSION_DURATION = 60 * 60 * 24 * 7; // 7 days in seconds

export async function verifyPassword(password: string): Promise<boolean> {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  try {
    const a = Buffer.from(password);
    const b = Buffer.from(expected);
    // Pad to same length before comparing to avoid length leak
    if (a.length !== b.length) {
      timingSafeEqual(b, b); // dummy call to keep timing consistent
      return false;
    }
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

async function hmacSign(value: string): Promise<string> {
  const secret = process.env.SESSION_SECRET ?? process.env.ADMIN_PASSWORD;
  if (!secret) throw new Error("SESSION_SECRET or ADMIN_PASSWORD must be set");
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(value),
  );
  return Buffer.from(signature).toString("hex");
}

export async function createSession(): Promise<string> {
  const token = crypto.randomUUID();
  const expiresAt = Date.now() + SESSION_DURATION * 1000;
  const payload = `${token}.${expiresAt}`;
  const signature = await hmacSign(payload);
  const signedToken = `${payload}.${signature}`;
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, signedToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_DURATION,
    path: "/",
  });
  return signedToken;
}

export async function verifySessionToken(signedToken: string): Promise<boolean> {
  const lastDot = signedToken.lastIndexOf(".");
  if (lastDot === -1) return false;
  const payload = signedToken.slice(0, lastDot);
  const sig = signedToken.slice(lastDot + 1);

  // Validate HMAC signature
  const expectedSig = await hmacSign(payload).catch(() => null);
  if (!expectedSig) return false;

  try {
    const sigBuf = Buffer.from(sig, "hex");
    const expectedBuf = Buffer.from(expectedSig, "hex");
    if (sigBuf.length !== expectedBuf.length) return false;
    if (!timingSafeEqual(sigBuf, expectedBuf)) return false;
  } catch {
    return false;
  }

  // Validate expiry timestamp embedded in payload
  const parts = payload.split(".");
  const expiresAt = Number(parts[parts.length - 1]);
  if (!Number.isFinite(expiresAt) || Date.now() > expiresAt) return false;

  return true;
}

export async function getSession(): Promise<string | null> {
  const cookieStore = await cookies();
  const signedToken = cookieStore.get(SESSION_COOKIE)?.value ?? null;
  if (!signedToken) return null;
  const valid = await verifySessionToken(signedToken);
  return valid ? signedToken : null;
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function requireAuth(): Promise<void> {
  const session = await getSession();
  if (!session) {
    redirect("/admin/login");
  }
}
