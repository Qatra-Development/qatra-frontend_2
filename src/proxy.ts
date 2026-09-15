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
  "/HospitalRegister",
  "/HospitalDocuments",
  "/personal-info",
  "/verify",
]);

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuthenticated = request.cookies.has(AUTH_COOKIE_NAME);
  const accountType = request.cookies.get("account_type")?.value;

  const isProtectedRoute =
    pathname === "/dashboard" ||
    pathname.startsWith("/dashboard/") ||
    pathname === "/HospitalPath" ||
    pathname.startsWith("/HospitalPath/");

  if (isProtectedRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (AUTH_ROUTES.has(pathname) && isAuthenticated) {
    if (
      accountType === "health_institution" ||
      accountType === "institution" ||
      accountType === "hospital"
    ) {
      return NextResponse.redirect(new URL("/HospitalPath", request.url));
    }
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
    "/HospitalRegister",
    "/HospitalPath",
    "/HospitalDocuments",
    "/personal-info",
    "/verify",
  ],
};
