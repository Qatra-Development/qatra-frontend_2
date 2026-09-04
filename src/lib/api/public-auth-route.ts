import "server-only";

import { NextResponse } from "next/server";
import type { z } from "zod";
import { apiErrorResponse } from "./route-response";
import { backendRequest } from "./server-client";

type PublicAuthPayload = { success?: boolean; message?: string };

export async function forwardPublicAuth<TSchema extends z.ZodType>(
  request: Request,
  endpoint: string,
  schema: TSchema,
  mapPayload: (payload: z.output<TSchema>) => object,
): Promise<NextResponse> {
  try {
    const requestBody = await request.json().catch(() => null);
    const parsed = schema.safeParse(requestBody);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "يرجى التحقق من البيانات المدخلة.",
          errors: parsed.error.flatten().fieldErrors,
        },
        { status: 422 },
      );
    }

    const response = await backendRequest<PublicAuthPayload>(endpoint, {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify(mapPayload(parsed.data)),
    });

    if (response.success === false) {
      return NextResponse.json(
        { success: false, message: response.message ?? "تعذر إتمام الطلب." },
        { status: 422 },
      );
    }

    return NextResponse.json(response);
  } catch (error) {
    return apiErrorResponse(error);
  }
}
