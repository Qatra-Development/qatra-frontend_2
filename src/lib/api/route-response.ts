import { NextResponse } from "next/server";
import { z } from "zod";
import { ApiError } from "./errors";

const publicAuthResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
  errors: z.record(z.string(), z.array(z.string())).optional(),
}).passthrough();

export function publicAuthResponse(payload: unknown, successStatus = 200): NextResponse {
  const parsed = publicAuthResponseSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: "تعذر قراءة استجابة خدمة الخادم. يرجى المحاولة لاحقًا." },
      { status: 502 },
    );
  }

  const response = parsed.data;
  if (!response.success) {
    return NextResponse.json(
      { success: false, message: response.message || "تعذر إتمام الطلب.", errors: response.errors },
      { status: 422 },
    );
  }

  return NextResponse.json(response, { status: successStatus });
}

export function apiErrorResponse(error: unknown): NextResponse {
  if (error instanceof ApiError) {
    return NextResponse.json(
      { success: false, message: error.message, errors: error.fieldErrors },
      { status: error.status ?? 502 },
    );
  }

  return NextResponse.json(
    { success: false, message: "حدث خطأ غير متوقع. يرجى المحاولة لاحقًا." },
    { status: 500 },
  );
}
