import { NextResponse } from "next/server";
import { API_ENDPOINTS } from "@/src/config/api";
import { institutionRegistrationSchema } from "@/src/features/auth/schemas/institution-registration.schema";
import { buildInstitutionFormData, readInstitutionFormData } from "@/src/features/auth/services/institution-registration-payload";
import { apiErrorResponse, publicAuthResponse } from "@/src/lib/api/route-response";
import { backendRequest } from "@/src/lib/api/server-client";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.formData().catch(() => null);
    if (!body) {
      return NextResponse.json({ success: false, message: "يرجى إرسال بيانات المؤسسة والمستندات بصيغة صحيحة." }, { status: 400 });
    }
    const parsed = institutionRegistrationSchema.safeParse(readInstitutionFormData(body));
    if (!parsed.success) {
      const errors: Record<string, string[]> = {};
      for (const issue of parsed.error.issues) {
        const field = String(issue.path[0] === "documents" ? issue.path[1] : issue.path[0]);
        (errors[field] ??= []).push(issue.message);
      }
      return NextResponse.json({ success: false, message: "يرجى التحقق من البيانات والمستندات.", errors }, { status: 422 });
    }
    const response = await backendRequest<unknown>(API_ENDPOINTS.auth.registerInstitution, {
      method: "POST",
      headers: { Accept: "application/json" },
      body: buildInstitutionFormData(parsed.data),
    });
    return publicAuthResponse(response, 201);
  } catch (error) {
    return apiErrorResponse(error);
  }
}
