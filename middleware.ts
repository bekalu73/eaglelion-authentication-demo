import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const loginToken = request.cookies.get("loginToken")?.value; // Read token from cookies

  const protectedPaths = ["/dashboard"];
  const publicPaths = [
    "/login",
    "/forgot-password",
    "/validate-forgot-password",
  ];

  if (!loginToken && protectedPaths.includes(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (loginToken && publicPaths.includes(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
