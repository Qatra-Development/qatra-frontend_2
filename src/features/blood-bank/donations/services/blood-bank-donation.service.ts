import { API_ENDPOINTS, backendProxyUrl } from "@/src/config/api";

import type {
  ApiResponse,
  CompleteDonationPayload,
  CreateDonationCallPayload,
  DonationCall,
  DonationCallFilters,
  DonationCallResponseFilters,
  DonationCallResponsesResponse,
  DonationCallsResponse,
  DonationProcess,
  DonationProcessFilters,
  DonationProcessesResponse,
  MatchingDonorFilters,
  MatchingDonorsResponse,
  ScheduleDonationPayload,
  VoluntaryDonationFilters,
  VoluntaryDonationRequestsResponse,
} from "../types/donation.types";

interface ApiErrorPayload {
  success?: false;
  message?: string;
  errors?: Record<string, string[]>;
  data?: unknown;
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
    const errorPayload = payload as ApiErrorPayload | null;

    throw new Error(
      errorPayload?.message || "تعذر تنفيذ الطلب. حاول مرة أخرى.",
    );
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

function buildQuery(
  params: Record<string, string | number | boolean | undefined>,
) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === "") {
      return;
    }

    searchParams.set(key, String(value));
  });

  const query = searchParams.toString();

  return query ? `?${query}` : "";
}

/* ---------------------------------
   Voluntary donation requests
---------------------------------- */

export async function getVoluntaryDonationRequests(
  filters: VoluntaryDonationFilters = {},
  signal?: AbortSignal,
) {
  const query = buildQuery({
    search: filters.search,
    region: filters.region,
    blood_type: filters.blood_type,
    status: filters.status,
    page: filters.page ?? 1,
    per_page: filters.per_page ?? 15,
  });

  return requestJson<VoluntaryDonationRequestsResponse>(
    `${backendProxyUrl(
      API_ENDPOINTS.bloodBankDonations.voluntaryRequests,
    )}${query}`,
    {
      method: "GET",
      signal,
    },
  );
}

export async function scheduleVoluntaryDonationRequest(
  requestId: number,
  payload: ScheduleDonationPayload,
) {
  return requestJson<ApiResponse<DonationProcess>>(
    backendProxyUrl(
      API_ENDPOINTS.bloodBankDonations.scheduleVoluntaryRequest(requestId),
    ),
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  );
}

export async function declineVoluntaryDonationRequest(
  requestId: number,
  reason: string,
) {
  return requestJson<
    ApiResponse<{
      id: number;
      status: "declined";
      decline_reason: string;
    }>
  >(
    backendProxyUrl(
      API_ENDPOINTS.bloodBankDonations.declineVoluntaryRequest(requestId),
    ),
    {
      method: "POST",
      body: JSON.stringify({
        reason,
      }),
    },
  );
}

/* ---------------------------------
   Donation processes
---------------------------------- */

export async function getDonationProcesses(
  filters: DonationProcessFilters = {},
  signal?: AbortSignal,
) {
  const query = buildQuery({
    status: filters.status,
    blood_type: filters.blood_type,
    search: filters.search,
    scheduled_from: filters.scheduled_from,
    scheduled_to: filters.scheduled_to,
    page: filters.page ?? 1,
    per_page: filters.per_page ?? 15,
  });

  return requestJson<DonationProcessesResponse>(
    `${backendProxyUrl(
      API_ENDPOINTS.bloodBankDonations.donationProcesses,
    )}${query}`,
    {
      method: "GET",
      signal,
    },
  );
}

export async function getDonationProcess(
  processId: number,
  signal?: AbortSignal,
) {
  return requestJson<ApiResponse<DonationProcess>>(
    backendProxyUrl(
      API_ENDPOINTS.bloodBankDonations.donationProcess(processId),
    ),
    {
      method: "GET",
      signal,
    },
  );
}

export async function completeDonationProcess(
  processId: number,
  payload: CompleteDonationPayload,
) {
  return requestJson<ApiResponse<DonationProcess>>(
    backendProxyUrl(
      API_ENDPOINTS.bloodBankDonations.completeDonationProcess(processId),
    ),
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  );
}

export async function cancelDonationProcess(processId: number, reason: string) {
  return requestJson<ApiResponse<DonationProcess>>(
    backendProxyUrl(
      API_ENDPOINTS.bloodBankDonations.cancelDonationProcess(processId),
    ),
    {
      method: "POST",
      body: JSON.stringify({
        reason,
      }),
    },
  );
}

/* ---------------------------------
   Donation calls
---------------------------------- */

export async function getDonationCalls(
  filters: DonationCallFilters = {},
  signal?: AbortSignal,
) {
  const query = buildQuery({
    search: filters.search,
    status: filters.status,
    blood_type: filters.blood_type,
    priority: filters.priority,
    page: filters.page ?? 1,
    per_page: filters.per_page ?? 15,
  });

  return requestJson<DonationCallsResponse>(
    `${backendProxyUrl(
      API_ENDPOINTS.bloodBankDonations.donationCalls,
    )}${query}`,
    {
      method: "GET",
      signal,
    },
  );
}

export async function createDonationCall(payload: CreateDonationCallPayload) {
  return requestJson<ApiResponse<DonationCall>>(
    backendProxyUrl(API_ENDPOINTS.bloodBankDonations.donationCalls),
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  );
}

export async function getDonationCall(callId: number, signal?: AbortSignal) {
  return requestJson<ApiResponse<DonationCall>>(
    backendProxyUrl(API_ENDPOINTS.bloodBankDonations.donationCall(callId)),
    {
      method: "GET",
      signal,
    },
  );
}

export async function closeDonationCall(callId: number) {
  return requestJson<ApiResponse<DonationCall>>(
    backendProxyUrl(API_ENDPOINTS.bloodBankDonations.closeCall(callId)),
    {
      method: "POST",
    },
  );
}

export async function cancelDonationCall(callId: number, reason: string) {
  return requestJson<ApiResponse<DonationCall>>(
    backendProxyUrl(API_ENDPOINTS.bloodBankDonations.cancelCall(callId)),
    {
      method: "POST",
      body: JSON.stringify({
        reason,
      }),
    },
  );
}

/* ---------------------------------
   Matching donors
---------------------------------- */

export async function getMatchingDonors(
  callId: number,
  filters: MatchingDonorFilters = {},
  signal?: AbortSignal,
) {
  const query = buildQuery({
    search: filters.search,
    region: filters.region,
    blood_type: filters.blood_type,
    invitation_status: filters.invitation_status,
    page: filters.page ?? 1,
    per_page: filters.per_page ?? 15,
  });

  return requestJson<MatchingDonorsResponse>(
    `${backendProxyUrl(
      API_ENDPOINTS.bloodBankDonations.matchingDonors(callId),
    )}${query}`,
    {
      method: "GET",
      signal,
    },
  );
}

export async function inviteDonationCallDonors(
  callId: number,
  donorIds: number[],
) {
  return requestJson<
    ApiResponse<{
      sent_count: number;
      donor_ids: number[];
      channel: "in_app";
      sms_status: "not_implemented";
    }>
  >(backendProxyUrl(API_ENDPOINTS.bloodBankDonations.invitations(callId)), {
    method: "POST",
    body: JSON.stringify({
      donor_ids: donorIds,
    }),
  });
}

/* ---------------------------------
   Call responses
---------------------------------- */

export async function getDonationCallResponses(
  callId: number,
  filters: DonationCallResponseFilters = {},
  signal?: AbortSignal,
) {
  const query = buildQuery({
    response_status: filters.response_status,
    blood_type: filters.blood_type,
    region: filters.region,
    page: filters.page ?? 1,
    per_page: filters.per_page ?? 15,
  });

  return requestJson<DonationCallResponsesResponse>(
    `${backendProxyUrl(
      API_ENDPOINTS.bloodBankDonations.responses(callId),
    )}${query}`,
    {
      method: "GET",
      signal,
    },
  );
}

export async function scheduleDonationCallResponse(
  responseId: number,
  payload: ScheduleDonationPayload,
) {
  return requestJson<ApiResponse<DonationProcess>>(
    backendProxyUrl(
      API_ENDPOINTS.bloodBankDonations.scheduleCallResponse(responseId),
    ),
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  );
}

export async function getAllDonationProcesses(
  filters: DonationProcessFilters = {},
  signal?: AbortSignal,
) {
  const firstResponse = await getDonationProcesses(
    {
      ...filters,
      page: 1,
      per_page: 100,
    },
    signal,
  );

  const processes = [...firstResponse.data];

  for (let page = 2; page <= firstResponse.meta.last_page; page += 1) {
    const response = await getDonationProcesses(
      {
        ...filters,
        page,
        per_page: 100,
      },
      signal,
    );

    processes.push(...response.data);
  }

  return processes;
}

export async function getAllVoluntaryDonationRequests(
  filters: VoluntaryDonationFilters = {},
  signal?: AbortSignal,
) {
  const firstResponse = await getVoluntaryDonationRequests(
    {
      ...filters,
      page: 1,
      per_page: 100,
    },
    signal,
  );

  const requests = [...firstResponse.data];

  for (let page = 2; page <= firstResponse.meta.last_page; page += 1) {
    const response = await getVoluntaryDonationRequests(
      {
        ...filters,
        page,
        per_page: 100,
      },
      signal,
    );

    requests.push(...response.data);
  }

  return requests;
}

export async function getAllDonationCalls(
  filters: DonationCallFilters = {},
  signal?: AbortSignal,
) {
  const firstResponse = await getDonationCalls(
    {
      ...filters,
      page: 1,
      per_page: 100,
    },
    signal,
  );

  const calls = [...firstResponse.data];

  for (let page = 2; page <= firstResponse.meta.last_page; page += 1) {
    const response = await getDonationCalls(
      {
        ...filters,
        page,
        per_page: 100,
      },
      signal,
    );

    calls.push(...response.data);
  }

  return {
    data: calls,
    meta: firstResponse.meta,
  };
}

export async function getAllDonationCallResponses(
  callId: number,
  filters: DonationCallResponseFilters = {},
  signal?: AbortSignal,
) {
  const firstResponse = await getDonationCallResponses(
    callId,
    {
      ...filters,
      page: 1,
      per_page: 100,
    },
    signal,
  );

  const responses = [...firstResponse.data];

  for (let page = 2; page <= firstResponse.meta.last_page; page += 1) {
    const response = await getDonationCallResponses(
      callId,
      {
        ...filters,
        page,
        per_page: 100,
      },
      signal,
    );

    responses.push(...response.data);
  }

  return {
    data: responses,
    meta: firstResponse.meta,
  };
}

export async function getAllMatchingDonors(
  callId: number,
  filters: MatchingDonorFilters = {},
  signal?: AbortSignal,
) {
  const firstResponse = await getMatchingDonors(
    callId,
    {
      ...filters,
      page: 1,
      per_page: 100,
    },
    signal,
  );

  const donors = [...firstResponse.data];

  for (let page = 2; page <= firstResponse.meta.last_page; page += 1) {
    const response = await getMatchingDonors(
      callId,
      {
        ...filters,
        page,
        per_page: 100,
      },
      signal,
    );

    donors.push(...response.data);
  }

  return {
    data: donors,
    meta: firstResponse.meta,
  };
}
