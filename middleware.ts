import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const loginToken = request.cookies.get("loginToken")?.value; 

  // Define protected and public routes
  const protectedPaths = ["/dashboard", "reset-password"];
  const publicPaths = [
    "/login",
    "/forgot-password",
    "/validate-forgot-password",
  ];

  // Redirect root path to /login
  if (request.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If no loginToken and trying to access a protected route, redirect to /login
  if (!loginToken && protectedPaths.includes(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If loginToken exists and trying to access a public route, redirect to /dashboard
  if (loginToken && publicPaths.includes(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Allow access to other routes
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
