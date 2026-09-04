import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { apiErrorResponse } from "@/src/lib/api/route-response";
import { backendRequest } from "@/src/lib/api/server-client";
import { AUTH_COOKIE_NAME } from "@/src/lib/auth/cookies";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ path: string[] }> };

async function forward(request: Request, context: RouteContext): Promise<NextResponse> {
  const token = (await cookies()).get(AUTH_COOKIE_NAME)?.value;

  if (!token) {
    return NextResponse.json(
      { success: false, message: "يجب تسجيل الدخول أولًا." },
      { status: 401 },
    );
  }

  try {
    const { path } = await context.params;
    const method = request.method;
    const body = ["GET", "HEAD"].includes(method) ? undefined : await request.text();
    const contentType = request.headers.get("content-type");
    const query = new URL(request.url).search;
    const payload = await backendRequest<unknown>(`/${path.join("/")}${query}`, {
      method,
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        ...(contentType ? { "Content-Type": contentType } : {}),
      },
      body: body || undefined,
    });

    return NextResponse.json(payload);
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export const GET = forward;
export const POST = forward;
export const PUT = forward;
export const PATCH = forward;
export const DELETE = forward;
