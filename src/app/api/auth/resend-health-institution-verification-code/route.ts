import { API_ENDPOINTS } from "@/src/config/api";
import { forgotPasswordSchema } from "@/src/features/auth/schemas/login.schema";
import { forwardPublicAuth } from "@/src/lib/api/public-auth-route";

export async function POST(request: Request) {
  return forwardPublicAuth(request, API_ENDPOINTS.auth.resendInstitutionVerificationCode, forgotPasswordSchema, (data) => data);
}
