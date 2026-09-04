import { API_ENDPOINTS } from "@/src/config/api";
import { forwardPublicAuth } from "@/src/lib/api/public-auth-route";
import { donorRegistrationSchema } from "@/src/features/auth/schemas/login.schema";

export async function POST(request: Request) {
  return forwardPublicAuth(request, API_ENDPOINTS.auth.registerDonor, donorRegistrationSchema, (data) => ({
    name: data.fullName,
    email: data.email,
    phone: data.phone,
    password: data.password,
    password_confirmation: data.passwordConfirmation,
    national_id: data.nationalId,
    blood_type: data.bloodType,
    country: "Palestine",
    region: data.region,
    terms_accepted: data.termsAccepted,
  }));
}
