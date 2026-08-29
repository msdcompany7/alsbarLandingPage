import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/lib/firebase/session";
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLoginPage = pathname === "/admin/login";
  const session = request.cookies.get(SESSION_COOKIE)?.value;

  if (isLoginPage && session) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  if (!isLoginPage && pathname.startsWith("/admin") && !session) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
