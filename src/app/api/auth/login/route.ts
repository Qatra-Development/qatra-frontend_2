import { NextResponse } from "next/server";
import { API_ENDPOINTS } from "@/src/config/api";
import { apiErrorResponse } from "@/src/lib/api/route-response";
import { backendRequest } from "@/src/lib/api/server-client";
import { AUTH_COOKIE_NAME, authCookieOptions } from "@/src/lib/auth/cookies";
import { loginRequestSchema } from "@/src/features/auth/schemas/login.schema";
import type { BackendLoginResponse } from "@/src/features/auth/types/auth.types";

export const runtime = "nodejs";

function isSuccessfulLogin(
  response: BackendLoginResponse,
): response is Extract<BackendLoginResponse, { success: true }> {
  return response.success && Boolean(response.data?.token && response.data.user);
}

export async function POST(request: Request) {
  try {
    const requestBody = await request.json().catch(() => null);
    const payload = loginRequestSchema.safeParse(requestBody);

    if (!payload.success) {
      return NextResponse.json(
        {
          success: false,
          message: "يرجى التحقق من بيانات تسجيل الدخول.",
          errors: payload.error.flatten().fieldErrors,
        },
        { status: 422 },
      );
    }

    const { identifier, password, rememberMe } = payload.data;
    const backendResponse = await backendRequest<BackendLoginResponse>(
      API_ENDPOINTS.auth.login,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ login: identifier, password }),
      },
    );

    if (!isSuccessfulLogin(backendResponse)) {
      return NextResponse.json(
        {
          success: false,
          message: backendResponse.message || "بيانات تسجيل الدخول غير صحيحة.",
        },
        { status: 401 },
      );
    }

    const response = NextResponse.json({
      success: true,
      message: backendResponse.message,
      data: {
        user: backendResponse.data.user,
        institution: backendResponse.data.institution,
      },
    });

    const accountType =
      backendResponse.data.user?.account_type ||
      (backendResponse.data.institution ? "health_institution" : "donor");

    response.cookies.set(
      AUTH_COOKIE_NAME,
      backendResponse.data.token,
      authCookieOptions(rememberMe),
    );

    response.cookies.set("account_type", accountType, {
      path: "/",
      sameSite: "lax",
      maxAge: rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24,
    });

    const institution = backendResponse.data.institution;
    const destination =
      accountType === "health_authority_admin"
        ? "/dashboard"
        : institution?.status === "approved" &&
            institution.service_scope === "blood_bank_services_only"
          ? "/BloodBankDashboard"
          : accountType === "health_institution" ||
              accountType === "institution" ||
              accountType === "hospital" ||
              Boolean(institution)
            ? "/HospitalPath"
            : "/";

    response.cookies.set("login_destination", destination, {
      path: "/",
      sameSite: "lax",
      maxAge: rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24,
    });

    return response;
  } catch (error) {
    return apiErrorResponse(error);
  }
}
