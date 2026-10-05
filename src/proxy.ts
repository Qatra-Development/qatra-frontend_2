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
  "/verify",
]);

function getDashboardPath(
  accountType?: string,
  institutionStatus?: string,
  serviceScope?: string,
) {
  if (accountType === "health_authority_admin") {
    return "/dashboard";
  }

  if (accountType === "health_institution") {
    /*
     * المؤسسة غير المعتمدة تبقى في flow المتابعة
     * ولا تدخل Dashboard المؤسسة.
     */
    if (institutionStatus !== "approved") {
      return "/HospitalPath";
    }

    /*
     * مؤسسة معتمدة وتطلب الدم فقط.
     */
    if (serviceScope === "blood_request_only") {
      return "/institution/dashboard";
    }

    /*
     * مؤسسة تقدم خدمات بنك الدم فقط.
     */
    if (serviceScope === "blood_bank_services_only") {
      return "/BloodBankDashboard";
    }

    /*
     * مؤسسة تجمع بين طلب الدم وخدمات بنك الدم.
     */
    if (serviceScope === "blood_request_and_blood_bank") {
      return "/HospitalDashboard";
    }

    /*
     * Fallback آمن في حال كانت البيانات ناقصة.
     */
    return "/HospitalPath";
  }

  if (accountType === "donor") {
    return "/donor/dashboard";
  }

  return "/";
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAuthenticated = request.cookies.has(AUTH_COOKIE_NAME);

  const accountType = request.cookies.get("account_type")?.value;

  const institutionStatus = request.cookies.get("institution_status")?.value;

  const serviceScope = request.cookies.get("service_scope")?.value;

  const dashboardPath = getDashboardPath(
    accountType,
    institutionStatus,
    serviceScope,
  );

  /*
   * Protected routes
   */
  const isProtectedRoute =
    pathname === "/dashboard" ||
    pathname.startsWith("/dashboard/") ||
    pathname === "/HospitalDashboard" ||
    pathname.startsWith("/HospitalDashboard/") ||
    pathname === "/BloodBankDashboard" ||
    pathname.startsWith("/BloodBankDashboard/") ||
    pathname === "/HospitalPath" ||
    pathname.startsWith("/HospitalPath/") ||
    pathname === "/institution" ||
    pathname.startsWith("/institution/") ||
    pathname === "/donor" ||
    pathname.startsWith("/donor/");

  /*
   * أي صفحة محمية تحتاج تسجيل دخول.
   */
  if (isProtectedRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  /*
   * المستخدم المسجل إذا حاول الرجوع
   * إلى صفحات تسجيل الدخول / التسجيل.
   */
  if (AUTH_ROUTES.has(pathname) && isAuthenticated) {
    return NextResponse.redirect(new URL(dashboardPath, request.url));
  }

  /*
   * منع المستخدم من دخول Dashboard
   * لا يخص نوع حسابه.
   */

  if (isAuthenticated) {
    /*
     * Admin routes
     */
    if (
      (pathname === "/dashboard" || pathname.startsWith("/dashboard/")) &&
      accountType !== "health_authority_admin"
    ) {
      return NextResponse.redirect(new URL(dashboardPath, request.url));
    }

    /*
     * Institution blood request dashboard
     */
    if (
      (pathname === "/institution" || pathname.startsWith("/institution/")) &&
      dashboardPath !== "/institution/dashboard"
    ) {
      return NextResponse.redirect(new URL(dashboardPath, request.url));
    }

    /*
     * Blood bank dashboard
     */
    if (
      (pathname === "/HospitalDashboard" ||
        pathname.startsWith("/HospitalDashboard/")) &&
      dashboardPath !== "/HospitalDashboard"
    ) {
      return NextResponse.redirect(new URL(dashboardPath, request.url));
    }

    /*
     * Dashboard بنك الدم.
     */
    if (
      (pathname === "/BloodBankDashboard" ||
        pathname.startsWith("/BloodBankDashboard/")) &&
      dashboardPath !== "/BloodBankDashboard"
    ) {
      return NextResponse.redirect(new URL(dashboardPath, request.url));
    }

    /*
     * HospitalPath فقط للمؤسسة
     * التي لم يتم اعتمادها بعد.
     */
    if (
      (pathname === "/HospitalPath" || pathname.startsWith("/HospitalPath/")) &&
      dashboardPath !== "/HospitalPath"
    ) {
      return NextResponse.redirect(new URL(dashboardPath, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/institution/:path*",
    "/HospitalDashboard/:path*",
    "/BloodBankDashboard/:path*",
    "/HospitalPath/:path*",
    "/donor/:path*",

    "/login",
    "/logIn",
    "/ForgotPassword",
    "/PasswordReset",
    "/VerifyReset",
    "/select-path",
    "/donarPath",
    "/HospitalRegister",
    "/HospitalDocuments",
    "/verify",
  ],
};
