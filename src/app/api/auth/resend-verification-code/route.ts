import { API_ENDPOINTS } from "@/src/config/api";
import { forwardPublicAuth } from "@/src/lib/api/public-auth-route";
import { forgotPasswordSchema } from "@/src/features/auth/schemas/login.schema";

export async function POST(request: Request) {
  return forwardPublicAuth(request, API_ENDPOINTS.auth.resendDonorVerificationCode, forgotPasswordSchema, (data) => data);
}
