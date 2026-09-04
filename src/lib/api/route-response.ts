import { NextResponse } from "next/server";
import { ApiError } from "./errors";

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
