import { NextResponse } from "next/server";
import {
  checkLoginLockout,
  recordFailedLogin,
  resetLoginLockout,
} from "@/lib/login-lockout";
import {
  createSessionCookie,
  isAdminDecodedToken,
  SESSION_COOKIE,
} from "@/lib/firebase/auth-server";
import { getAdminAuth } from "@/lib/firebase/admin";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { idToken?: string };
    const idToken = body.idToken?.trim();

    if (!idToken) {
      return NextResponse.json({ error: "Missing idToken" }, { status: 400 });
    }

    const auth = getAdminAuth();
    const decoded = await auth.verifyIdToken(idToken);
    const email = decoded.email?.toLowerCase() ?? "";

    const lockout = checkLoginLockout(email);
    if (!lockout.allowed) {
      return NextResponse.json(
        { error: "Too many login attempts" },
        { status: 429 },
      );
    }

    if (!isAdminDecodedToken(decoded)) {
      recordFailedLogin(email);
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    resetLoginLockout(email);
    const sessionCookie = await createSessionCookie(idToken);
    const response = NextResponse.json({ ok: true });
    response.cookies.set(SESSION_COOKIE, sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 5,
    });

    return response;
  } catch {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }
}
