import { apiClient } from "@/src/lib/api/client";
import { API_ENDPOINTS, BFF_ENDPOINTS } from "@/src/config/api";
import type {
  InstitutionResubmitResponse,
  InstitutionStatusResponse,
} from "../types/institution.types";

export async function getInstitutionStatus(): Promise<InstitutionStatusResponse> {
  const response = await apiClient<InstitutionStatusResponse>(
    BFF_ENDPOINTS.backend(API_ENDPOINTS.institution.status),
    {
      method: "GET",
    },
  );

  return response;
}

export function resubmitInstitution(
  payload: FormData,
): Promise<InstitutionResubmitResponse> {
  return apiClient<InstitutionResubmitResponse>(
    BFF_ENDPOINTS.backend(API_ENDPOINTS.institution.resubmit),
    { method: "POST", body: payload },
  );
}
