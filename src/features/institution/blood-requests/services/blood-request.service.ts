import { API_ENDPOINTS, backendProxyUrl } from "@/src/config/api";

import type {
  ApiResponse,
  BloodRequestDetails,
  BloodRequestListItem,
  BloodRequestSummary,
  CreateBloodRequestPayload,
  DraftBloodRequestPayload,
  InstitutionDashboardData,
  SupplierResult,
} from "../types/blood-request.types";
import { SupplierApiResponse } from "../config/blood-request.config";

/*
|--------------------------------------------------------------------------
| Request Helper
|--------------------------------------------------------------------------
*/

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
    throw new Error(body?.message || "تعذر تنفيذ الطلب.");
  }

  return body;
}

/*
|--------------------------------------------------------------------------
| Dashboard Summary
|--------------------------------------------------------------------------
*/

export async function getBloodRequestSummary(
  signal?: AbortSignal,
): Promise<BloodRequestSummary> {
  const response = await requestJson<BloodRequestSummary>(
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
| Latest Requests
|--------------------------------------------------------------------------
*/

export async function getLatestBloodRequests(
  signal?: AbortSignal,
): Promise<BloodRequestListItem[]> {
  const query = new URLSearchParams({
    sort: "newest",
    per_page: "20",
    page: "1",
  });

  const response = await requestJson<BloodRequestListItem[]>(
    `${backendProxyUrl(
      API_ENDPOINTS.institutionBloodRequests.base,
    )}?${query.toString()}`,
    {
      method: "GET",
      signal,
    },
  );

  return response.data
    .filter((request) => request.status !== "draft")
    .slice(0, 4);
}

/*
|--------------------------------------------------------------------------
| Request Details
|--------------------------------------------------------------------------
*/

export async function getBloodRequestDetails(
  requestId: number | string,
  signal?: AbortSignal,
): Promise<BloodRequestDetails> {
  const response = await requestJson<BloodRequestDetails>(
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
| Institution Dashboard
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
      /*
       * Failure to fetch the latest draft should not
       * prevent the dashboard from being displayed.
       */
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

  const url = `${backendProxyUrl(
    API_ENDPOINTS.institutionBloodRequests.suppliers,
  )}?${query.toString()}`;

  const response = await fetch(url, {
    method: "GET",

    headers: {
      Accept: "application/json",
    },

    signal,
    cache: "no-store",
  });

  const body = (await response
    .json()
    .catch(() => null)) as SupplierApiResponse | null;

  if (!response.ok || !body || body.success === false) {
    throw new Error(body?.message || "تعذر تحميل الجهات الموردة.");
  }

  return {
    items: body.data,
    meta: body.meta,
  };
}

/*
|--------------------------------------------------------------------------
| Create Request
|--------------------------------------------------------------------------
*/

export async function createBloodRequest(payload: CreateBloodRequestPayload) {
  return requestJson<BloodRequestDetails>(
    backendProxyUrl(API_ENDPOINTS.institutionBloodRequests.base),
    {
      method: "POST",

      body: JSON.stringify(payload),
    },
  );
}

/*
|--------------------------------------------------------------------------
| Save Draft
|--------------------------------------------------------------------------
*/

export async function saveBloodRequestDraft(payload: DraftBloodRequestPayload) {
  return requestJson<BloodRequestDetails>(
    backendProxyUrl(API_ENDPOINTS.institutionBloodRequests.drafts),
    {
      method: "POST",

      body: JSON.stringify(payload),
    },
  );
}
