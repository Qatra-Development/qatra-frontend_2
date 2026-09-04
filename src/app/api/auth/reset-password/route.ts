import { API_ENDPOINTS } from "@/src/config/api";
import { forwardPublicAuth } from "@/src/lib/api/public-auth-route";
import { resetPasswordSchema } from "@/src/features/auth/schemas/login.schema";

export async function POST(request: Request) {
  return forwardPublicAuth(request, API_ENDPOINTS.auth.resetPassword, resetPasswordSchema, (data) => ({
    email: data.email,
    code: data.code,
    password: data.password,
    password_confirmation: data.passwordConfirmation,
  }));
}
