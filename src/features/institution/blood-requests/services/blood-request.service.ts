import { API_ENDPOINTS, backendProxyUrl } from "@/src/config/api";

import type {
  ApiResponse,
  BloodRequestDetails,
  BloodRequestListFilters,
  BloodRequestListItem,
  BloodRequestListResult,
  BloodRequestMutationResult,
  BloodRequestSummary,
  CancelBloodRequestPayload,
  CreateBloodRequestPayload,
  DraftBloodRequestPayload,
  InstitutionDashboardData,
  PaginatedApiResponse,
  SubmitBloodRequestPayload,
  SupplierApiResponse,
  SupplierResult,
  UpdateBloodRequestPayload,
} from "../types/blood-request.types";

export class BloodRequestApiError extends Error {
  status: number;

  fieldErrors?: Record<string, string[]>;

  constructor(
    message: string,
    status: number,
    fieldErrors?: Record<string, string[]>,
  ) {
    super(message);

    this.name = "BloodRequestApiError";
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

async function requestJson<
  TResponse extends {
    success: boolean;
    message?: string;
    errors?: Record<string, string[]>;
  },
>(url: string, options: RequestInit = {}): Promise<TResponse> {
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

  const body = (await response.json().catch(() => null)) as TResponse | null;

  if (!response.ok || !body || body.success === false) {
    throw new BloodRequestApiError(
      body?.message || "تعذر تنفيذ الطلب. حاول مرة أخرى.",
      response.status,
      body?.errors,
    );
  }

  return body;
}

function buildListQuery(filters: BloodRequestListFilters) {
  const query = new URLSearchParams();

  if (filters.search?.trim()) {
    query.set("search", filters.search.trim());
  }

  if (filters.blood_type) {
    query.set("blood_type", filters.blood_type);
  }

  if (filters.priority) {
    query.set("priority", filters.priority);
  }

  if (filters.status) {
    query.set("status", filters.status);
  }

  if (filters.date_from) {
    query.set("date_from", filters.date_from);
  }

  if (filters.date_to) {
    query.set("date_to", filters.date_to);
  }

  if (filters.date_field) {
    query.set("date_field", filters.date_field);
  }

  if (filters.sort) {
    query.set("sort", filters.sort);
  }

  if (filters.page) {
    query.set("page", String(filters.page));
  }

  if (filters.per_page) {
    query.set("per_page", String(filters.per_page));
  }

  return query.toString();
}

/*
|--------------------------------------------------------------------------
| List
|--------------------------------------------------------------------------
*/

export async function getBloodRequests(
  filters: BloodRequestListFilters = {},
  signal?: AbortSignal,
): Promise<BloodRequestListResult> {
  const query = buildListQuery({
    sort: "newest",
    page: 1,
    per_page: 15,
    ...filters,
  });

  const response = await requestJson<
    PaginatedApiResponse<BloodRequestListItem>
  >(
    `${backendProxyUrl(API_ENDPOINTS.institutionBloodRequests.base)}?${query}`,
    {
      method: "GET",
      signal,
    },
  );

  return {
    items: response.data,
    meta: response.meta,
  };
}

/*
|--------------------------------------------------------------------------
| Summary
|--------------------------------------------------------------------------
*/

export async function getBloodRequestSummary(signal?: AbortSignal) {
  const response = await requestJson<ApiResponse<BloodRequestSummary>>(
    backendProxyUrl(API_ENDPOINTS.institutionBloodRequests.summary),
    {
      method: "GET",
      signal,
    },
  );

  return response.data;
}

/*
|--------------------------------------------------------------------------
| Latest
|--------------------------------------------------------------------------
*/

export async function getLatestBloodRequests(signal?: AbortSignal) {
  const result = await getBloodRequests(
    {
      sort: "newest",
      per_page: 20,
      page: 1,
    },
    signal,
  );

  return result.items
    .filter((request) => request.status !== "draft")
    .slice(0, 4);
}

/*
|--------------------------------------------------------------------------
| Details
|--------------------------------------------------------------------------
*/

export async function getBloodRequestDetails(
  requestId: number | string,
  signal?: AbortSignal,
) {
  const response = await requestJson<ApiResponse<BloodRequestDetails>>(
    backendProxyUrl(API_ENDPOINTS.institutionBloodRequests.detail(requestId)),
    {
      method: "GET",
      signal,
    },
  );

  return response.data;
}

/*
|--------------------------------------------------------------------------
| Dashboard
|--------------------------------------------------------------------------
*/

export async function getInstitutionDashboardData(
  signal?: AbortSignal,
): Promise<InstitutionDashboardData> {
  const [summary, requests] = await Promise.all([
    getBloodRequestSummary(signal),
    getLatestBloodRequests(signal),
  ]);

  let latestDraft: BloodRequestDetails | null = null;

  if (summary.latest_draft_id !== null) {
    try {
      latestDraft = await getBloodRequestDetails(
        summary.latest_draft_id,
        signal,
      );
    } catch {
      // Dashboard should still render.
    }
  }

  return {
    summary,
    latestRequests: requests,
    latestDraft,
  };
}

/*
|--------------------------------------------------------------------------
| Suppliers
|--------------------------------------------------------------------------
*/

export async function getBloodSuppliers(
  bloodType: string,
  unitsRequired: number,
  signal?: AbortSignal,
): Promise<SupplierResult> {
  const query = new URLSearchParams({
    blood_type: bloodType,
    units_required: String(unitsRequired),
    availability: "full",
    per_page: "100",
    page: "1",
  });

  const response = await requestJson<SupplierApiResponse>(
    `${backendProxyUrl(
      API_ENDPOINTS.institutionBloodRequests.suppliers,
    )}?${query.toString()}`,
    {
      method: "GET",
      signal,
    },
  );

  return {
    items: response.data,
    meta: response.meta,
  };
}

/*
|--------------------------------------------------------------------------
| Create
|--------------------------------------------------------------------------
*/

export async function createBloodRequest(payload: CreateBloodRequestPayload) {
  const response = await requestJson<ApiResponse<BloodRequestDetails>>(
    backendProxyUrl(API_ENDPOINTS.institutionBloodRequests.base),
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  );

  return {
    request: response.data,
    message: response.message,
  } satisfies BloodRequestMutationResult;
}

/*
|--------------------------------------------------------------------------
| Draft
|--------------------------------------------------------------------------
*/

export async function saveBloodRequestDraft(payload: DraftBloodRequestPayload) {
  const response = await requestJson<ApiResponse<BloodRequestDetails>>(
    backendProxyUrl(API_ENDPOINTS.institutionBloodRequests.drafts),
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  );

  return {
    request: response.data,
    message: response.message,
  } satisfies BloodRequestMutationResult;
}

/*
|--------------------------------------------------------------------------
| Update
|--------------------------------------------------------------------------
*/

export async function updateBloodRequest(
  requestId: number | string,
  payload: UpdateBloodRequestPayload,
) {
  const response = await requestJson<ApiResponse<BloodRequestDetails>>(
    backendProxyUrl(API_ENDPOINTS.institutionBloodRequests.detail(requestId)),
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    },
  );

  return response.data;
}

/*
|--------------------------------------------------------------------------
| Cancel
|--------------------------------------------------------------------------
*/

export async function cancelBloodRequest(
  requestId: number | string,
  payload: CancelBloodRequestPayload,
) {
  const response = await requestJson<ApiResponse<BloodRequestDetails>>(
    backendProxyUrl(API_ENDPOINTS.institutionBloodRequests.cancel(requestId)),
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  );

  return response.data;
}

/*
|--------------------------------------------------------------------------
| Submit Draft
|--------------------------------------------------------------------------
*/

export async function submitBloodRequestDraft(
  requestId: number | string,
  payload: SubmitBloodRequestPayload,
) {
  const response = await requestJson<ApiResponse<BloodRequestDetails>>(
    backendProxyUrl(API_ENDPOINTS.institutionBloodRequests.submit(requestId)),
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  );

  return response.data;
}
