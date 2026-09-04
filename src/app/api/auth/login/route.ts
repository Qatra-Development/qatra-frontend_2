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

    response.cookies.set(
      AUTH_COOKIE_NAME,
      backendResponse.data.token,
      authCookieOptions(rememberMe),
    );

    return response;
  } catch (error) {
    return apiErrorResponse(error);
  }
}
