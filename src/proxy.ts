import { NextResponse, type NextRequest } from "next/server";
import { AUTH_COOKIE_NAME } from "@/src/lib/auth/constants";

const AUTH_ROUTES = new Set([
  "/login",
  "/logIn",
  "/ForgotPassword",
  "/PasswordReset",
  "/VerifyReset",
  "/select-path",
  "/donarPath",
  "/personal-info",
  "/verify",
]);

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuthenticated = request.cookies.has(AUTH_COOKIE_NAME);

  const isDashboardRoute = pathname === "/dashboard" || pathname.startsWith("/dashboard/");

  if (isDashboardRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (AUTH_ROUTES.has(pathname) && isAuthenticated) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/login",
    "/logIn",
    "/ForgotPassword",
    "/PasswordReset",
    "/VerifyReset",
    "/select-path",
    "/donarPath",
    "/personal-info",
    "/verify",
  ],
};
