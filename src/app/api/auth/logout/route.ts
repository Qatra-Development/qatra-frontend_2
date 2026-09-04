import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { API_ENDPOINTS } from "@/src/config/api";
import { ApiError } from "@/src/lib/api/errors";
import { backendRequest } from "@/src/lib/api/server-client";
import { AUTH_COOKIE_NAME } from "@/src/lib/auth/cookies";

export const runtime = "nodejs";

export async function POST() {
  const token = (await cookies()).get(AUTH_COOKIE_NAME)?.value;

  try {
    if (token) {
      await backendRequest(API_ENDPOINTS.auth.logout, {
        method: "POST",
        headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
      });
    }
  } catch (error) {
    // A missing logout endpoint must not prevent clearing this browser's session.
    if (!(error instanceof ApiError) || error.status !== 404) {
      const response = NextResponse.json(
        { success: false, message: "تعذر إنهاء الجلسة في الخادم." },
        { status: 502 },
      );
      response.cookies.delete(AUTH_COOKIE_NAME);
      return response;
    }
  }

  const response = NextResponse.json({ success: true, message: "تم تسجيل الخروج بنجاح." });
  response.cookies.delete(AUTH_COOKIE_NAME);
  return response;
}
