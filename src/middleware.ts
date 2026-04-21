import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

async function isValidSession(signedToken: string): Promise<boolean> {
  const lastDot = signedToken.lastIndexOf(".");
  if (lastDot === -1) return false;
  const payload = signedToken.slice(0, lastDot);
  const sig = signedToken.slice(lastDot + 1);

  const secret = process.env.SESSION_SECRET ?? process.env.ADMIN_PASSWORD;
  if (!secret) return false;

  try {
    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"],
    );
    const sigBytes = Uint8Array.from(
      sig.match(/.{1,2}/g)?.map((b) => Number.parseInt(b, 16)) ?? [],
    );
    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      sigBytes,
      new TextEncoder().encode(payload),
    );
    if (!valid) return false;
  } catch {
    return false;
  }

  // Check expiry timestamp embedded in payload
  const parts = payload.split(".");
  const expiresAt = Number(parts[parts.length - 1]);
  if (!Number.isFinite(expiresAt) || Date.now() > expiresAt) return false;

  return true;
}

export async function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get("admin_session");
  const isLoginPage = request.nextUrl.pathname === "/admin/login";

  if (!sessionCookie) {
    if (!isLoginPage) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    return NextResponse.next();
  }

  const valid = await isValidSession(sessionCookie.value);

  if (!valid) {
    const response = NextResponse.redirect(new URL("/admin/login", request.url));
    response.cookies.delete("admin_session");
    return response;
  }

  if (isLoginPage) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/admin/:path*",
};
