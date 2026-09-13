import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { DecodedIdToken } from "firebase-admin/auth";
import { getAdminAuth } from "@/lib/firebase/admin";
import { SESSION_COOKIE, SESSION_EXPIRES_MS } from "@/lib/firebase/session";

export { SESSION_COOKIE } from "@/lib/firebase/session";
function getAllowedAdminEmails() {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminDecodedToken(decoded: DecodedIdToken) {
  if (decoded.admin === true) {
    return true;
  }

  const email = decoded.email?.toLowerCase();
  if (!email) {
    return false;
  }

  return getAllowedAdminEmails().includes(email);
}

export async function createSessionCookie(idToken: string) {
  const auth = getAdminAuth();
  return auth.createSessionCookie(idToken, { expiresIn: SESSION_EXPIRES_MS });
}

export async function verifySessionCookie(sessionCookie: string | undefined) {
  if (!sessionCookie) {
    return null;
  }

  try {
    const auth = getAdminAuth();
    const decoded = await auth.verifySessionCookie(sessionCookie, true);
    if (!isAdminDecodedToken(decoded)) {
      return null;
    }
    return decoded;
  } catch {
    return null;
  }
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  return verifySessionCookie(cookieStore.get(SESSION_COOKIE)?.value);
}

export async function requireAdminSession() {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }
  return session;
}

export async function requireAdmin() {
  const session = await getAdminSession();
  if (!session) {
    throw new Error("Unauthorized");
  }
  return session;
}
