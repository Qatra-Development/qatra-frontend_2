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

  /*
   * Protected routes
   *
   * - /dashboard        -> Health Authority Admin
   * - /HospitalPath     -> Existing institution flow
   * - /institution      -> New institution dashboard
   */
  const isProtectedRoute =
    pathname === "/dashboard" ||
    pathname.startsWith("/dashboard/") ||
    pathname === "/HospitalPath" ||
    pathname.startsWith("/HospitalPath/") ||
    pathname === "/institution" ||
    pathname.startsWith("/institution/");

  /*
   * Any protected page requires authentication.
   */
  if (isProtectedRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  /*
   * Prevent authenticated users from returning
   * to authentication / registration pages.
   */
  if (AUTH_ROUTES.has(pathname) && isAuthenticated) {
    if (accountType === "health_authority_admin") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    if (
      accountType === "health_institution" ||
      accountType === "institution" ||
      accountType === "hospital"
    ) {
      return NextResponse.redirect(
        new URL("/institution/dashboard", request.url),
      );
    }

    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/institution/:path*",

    "/login",
    "/logIn",
    "/ForgotPassword",
    "/PasswordReset",
    "/VerifyReset",
    "/select-path",
    "/donarPath",
    "/HospitalRegister",
    "/HospitalPath/:path*",
    "/HospitalDocuments",
    "/personal-info",
    "/verify",
  ],
};
