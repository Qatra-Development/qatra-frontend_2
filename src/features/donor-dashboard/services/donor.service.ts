import { API_ENDPOINTS, backendProxyUrl } from "@/src/config/api";

import type {
  ApiResponse,
  CreateVoluntaryDonationPayload,
  CurrentUser,
  DonationCallsResponse,
  DonationHistoryResponse,
  DonationInstitution,
  DonationInstitutionsResponse,
  DonorAvailability,
  DonorDonationCall,
  DonorVoluntaryDonationRequest,
} from "../types/donor.types";

interface ApiErrorPayload {
  success?: false;
  message?: string;
  errors?: Record<string, string[]>;
}

async function requestJson<T>(
  url: string,
  options: RequestInit = {},
): Promise<T> {
  const headers = new Headers(options.headers);

  headers.set("Accept", "application/json");

  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(url, {
    ...options,
    headers,
    cache: "no-store",
  });

  const payload = (await response.json().catch(() => null)) as
    | T
    | ApiErrorPayload
    | null;

  if (!response.ok || !payload) {
    const error = payload as ApiErrorPayload | null;

    throw new Error(error?.message || "تعذر تنفيذ الطلب.");
  }

  if (
    typeof payload === "object" &&
    payload !== null &&
    "success" in payload &&
    payload.success === false
  ) {
    throw new Error(
      (payload as ApiErrorPayload).message || "تعذر تنفيذ الطلب.",
    );
  }

  return payload as T;
}

export async function getCurrentUser(signal?: AbortSignal) {
  return requestJson<ApiResponse<CurrentUser>>(
    backendProxyUrl(API_ENDPOINTS.auth.me),
    {
      method: "GET",
      signal,
    },
  );
}

export async function getDonorAvailability(signal?: AbortSignal) {
  return requestJson<ApiResponse<DonorAvailability>>(
    backendProxyUrl(API_ENDPOINTS.donor.availability),
    {
      method: "GET",
      signal,
    },
  );
}

export async function updateDonorAvailability(
  acceptsDonationRequests: boolean,
) {
  return requestJson<ApiResponse<DonorAvailability>>(
    backendProxyUrl(API_ENDPOINTS.donor.availability),
    {
      method: "PATCH",

      body: JSON.stringify({
        accepts_donation_requests: acceptsDonationRequests,
      }),
    },
  );
}

export async function getDonorDonationCalls(
  targeted?: boolean,
  signal?: AbortSignal,
) {
  const query = new URLSearchParams({
    per_page: "100",
    page: "1",
  });

  if (targeted !== undefined) {
    query.set("targeted", targeted ? "1" : "0");
  }

  return requestJson<DonationCallsResponse>(
    `${backendProxyUrl(API_ENDPOINTS.donor.donationCalls)}?${query.toString()}`,
    {
      method: "GET",
      signal,
    },
  );
}

export async function getDonorDonationCall(
  callId: number,
  signal?: AbortSignal,
) {
  return requestJson<ApiResponse<DonorDonationCall>>(
    backendProxyUrl(API_ENDPOINTS.donor.donationCall(callId)),
    {
      method: "GET",
      signal,
    },
  );
}

export async function respondToDonationCall(
  callId: number,
  responseStatus: "interested" | "declined",
) {
  return requestJson<
    ApiResponse<{
      id: number;
      donation_call_id: number;
      response_status: "interested" | "declined";
      responded_at: string;
    }>
  >(backendProxyUrl(API_ENDPOINTS.donor.respondToDonationCall(callId)), {
    method: "POST",

    body: JSON.stringify({
      response_status: responseStatus,
      note: null,
    }),
  });
}

export async function getAllDonationInstitutions(
  signal?: AbortSignal,
): Promise<DonationInstitution[]> {
  const first = await requestJson<DonationInstitutionsResponse>(
    `${backendProxyUrl(
      API_ENDPOINTS.donor.donationInstitutions,
    )}?page=1&per_page=100`,
    {
      method: "GET",
      signal,
    },
  );

  const items = [...first.data];

  for (let page = 2; page <= first.meta.last_page; page += 1) {
    const response = await requestJson<DonationInstitutionsResponse>(
      `${backendProxyUrl(
        API_ENDPOINTS.donor.donationInstitutions,
      )}?page=${page}&per_page=100`,
      {
        method: "GET",
        signal,
      },
    );

    items.push(...response.data);
  }

  return items;
}

export async function createVoluntaryDonationRequest(
  payload: CreateVoluntaryDonationPayload,
) {
  return requestJson<ApiResponse<DonorVoluntaryDonationRequest>>(
    backendProxyUrl(API_ENDPOINTS.donor.voluntaryDonationRequests),
    {
      method: "POST",

      body: JSON.stringify(payload),
    },
  );
}

export async function getDonationHistory(page = 1, signal?: AbortSignal) {
  return requestJson<DonationHistoryResponse>(
    `${backendProxyUrl(
      API_ENDPOINTS.donor.donationHistory,
    )}?page=${page}&per_page=15`,
    {
      method: "GET",
      signal,
    },
  );
}
