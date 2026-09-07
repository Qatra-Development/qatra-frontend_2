import { apiClient } from "@/src/lib/api/client";
import { BFF_ENDPOINTS } from "@/src/config/api";
import type { LoginPayload, LoginResponse, PublicAuthResponse } from "../types/auth.types";
import type { InstitutionRegistrationData } from "../types/institution-registration.types";
import { buildInstitutionFormData } from "./institution-registration-payload";

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  return apiClient<LoginResponse>(BFF_ENDPOINTS.auth.login, {
    method: "POST",
    body: payload,
  });
}

export async function logout(): Promise<void> {
  await apiClient<{ success: true }>(BFF_ENDPOINTS.auth.logout, { method: "POST" });
}

export function registerDonor(payload: object): Promise<PublicAuthResponse> {
  return apiClient(BFF_ENDPOINTS.auth.registerDonor, { method: "POST", body: payload });
}

export function registerInstitution(payload: InstitutionRegistrationData): Promise<PublicAuthResponse> {
  return apiClient(BFF_ENDPOINTS.auth.registerInstitution, { method: "POST", body: buildInstitutionFormData(payload) });
}

export function verifyInstitutionEmail(payload: { email: string; code: string }): Promise<PublicAuthResponse> {
  return apiClient(BFF_ENDPOINTS.auth.verifyInstitutionEmail, { method: "POST", body: payload });
}

export function resendInstitutionVerificationCode(payload: { email: string }): Promise<PublicAuthResponse> {
  return apiClient(BFF_ENDPOINTS.auth.resendInstitutionVerificationCode, { method: "POST", body: payload });
}

export function verifyDonorEmail(payload: object): Promise<PublicAuthResponse> {
  return apiClient(BFF_ENDPOINTS.auth.verifyDonorEmail, { method: "POST", body: payload });
}

export function resendDonorVerificationCode(payload: object): Promise<PublicAuthResponse> {
  return apiClient(BFF_ENDPOINTS.auth.resendDonorVerificationCode, { method: "POST", body: payload });
}

export function requestPasswordReset(payload: object): Promise<PublicAuthResponse> {
  return apiClient(BFF_ENDPOINTS.auth.forgotPassword, { method: "POST", body: payload });
}

export function resetPassword(payload: object): Promise<PublicAuthResponse> {
  return apiClient(BFF_ENDPOINTS.auth.resetPassword, { method: "POST", body: payload });
}
