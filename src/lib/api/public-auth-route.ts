import "server-only";

import { NextResponse } from "next/server";
import type { z } from "zod";
import { apiErrorResponse, publicAuthResponse } from "./route-response";
import { backendRequest } from "./server-client";

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

    const response = await backendRequest<unknown>(endpoint, {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify(mapPayload(parsed.data)),
    });

    return publicAuthResponse(response);
  } catch (error) {
    return apiErrorResponse(error);
  }
}
