import { API_ENDPOINTS, backendProxyUrl } from "@/src/config/api";
import type {
  AdminInstitution,
  InstitutionDocumentStatus,
} from "../../types/institutions.types";

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

async function requestJson<T>(
  url: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  const response = await fetch(url, {
    ...options,

    headers: {
      Accept: "application/json",

      ...(options.body
        ? {
            "Content-Type": "application/json",
          }
        : {}),

      ...options.headers,
    },

    cache: "no-store",
  });

  const body = (await response
    .json()
    .catch(() => null)) as ApiResponse<T> | null;

  if (!response.ok || !body || body.success === false) {
    throw new Error(body?.message || "حدث خطأ أثناء تنفيذ العملية.");
  }

  return body;
}

export async function getInstitutionForReview(
  institutionId: number | string,
  signal?: AbortSignal,
): Promise<AdminInstitution> {
  const response = await requestJson<AdminInstitution>(
    backendProxyUrl(API_ENDPOINTS.admin.institution(institutionId)),
    {
      method: "GET",
      signal,
    },
  );

  return response.data;
}

export async function updateDocumentStatus(
  institutionId: number | string,
  documentId: number | string,
  status: InstitutionDocumentStatus,
) {
  return requestJson(
    backendProxyUrl(API_ENDPOINTS.admin.document(institutionId, documentId)),
    {
      method: "PATCH",

      body: JSON.stringify({
        status,
      }),
    },
  );
}

export async function fetchInstitutionDocument(
  institutionId: number | string,
  documentId: number | string,
): Promise<Blob> {
  const response = await fetch(
    backendProxyUrl(
      API_ENDPOINTS.admin.downloadDocument(institutionId, documentId),
    ),
    {
      method: "GET",
      headers: {
        Accept: "*/*",
      },
      cache: "no-store",
    },
  );

  if (!response.ok) {
    const body = await response.json().catch(() => null);

    throw new Error(body?.message || "تعذر تحميل المستند.");
  }

  return response.blob();
}

export async function approveInstitution(institutionId: number | string) {
  return requestJson(
    backendProxyUrl(API_ENDPOINTS.admin.approveInstitution(institutionId)),
    {
      method: "POST",
    },
  );
}

export async function requestInstitutionCompletion(
  institutionId: number | string,
  reviewNotes: string,
) {
  return requestJson(
    backendProxyUrl(API_ENDPOINTS.admin.requestCompletion(institutionId)),
    {
      method: "POST",

      body: JSON.stringify({
        review_notes: reviewNotes,
      }),
    },
  );
}

export async function rejectInstitution(
  institutionId: number | string,
  reason: string,
) {
  return requestJson(
    backendProxyUrl(API_ENDPOINTS.admin.rejectInstitution(institutionId)),
    {
      method: "POST",

      body: JSON.stringify({
        reason,
      }),
    },
  );
}
