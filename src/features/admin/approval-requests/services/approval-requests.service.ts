import { API_ENDPOINTS, BFF_ENDPOINTS } from "@/src/config/api";
import type {
  ApprovalInstitution,
  ApprovalRequestsApiResponse,
  ApprovalRequestsCollection,
  ApprovalRequestStatus,
} from "../types/approval-requests.types";

const PER_PAGE = 100;

async function fetchApprovalRequestsPage(
  status: ApprovalRequestStatus,
  page: number,
  signal?: AbortSignal,
): Promise<ApprovalRequestsApiResponse["data"]> {
  const searchParams = new URLSearchParams({
    status,
    per_page: String(PER_PAGE),
    page: String(page),
  });

  const url = `${BFF_ENDPOINTS.backend(
    API_ENDPOINTS.admin.institutions,
  )}?${searchParams.toString()}`;

  const response = await fetch(url, {
    method: "GET",

    headers: {
      Accept: "application/json",
    },

    cache: "no-store",
    signal,
  });

  const body = (await response
    .json()
    .catch(() => null)) as ApprovalRequestsApiResponse | null;

  if (!response.ok || !body || body.success === false) {
    throw new Error(body?.message || "تعذر تحميل طلبات الاعتماد.");
  }

  return body.data;
}

export async function getApprovalRequestsByStatus(
  status: ApprovalRequestStatus,
  signal?: AbortSignal,
): Promise<ApprovalRequestsCollection> {
  const firstPage = await fetchApprovalRequestsPage(status, 1, signal);

  if (firstPage.last_page <= 1) {
    return {
      items: firstPage.data,
      total: firstPage.total,
    };
  }

  const remainingPages = Array.from(
    {
      length: firstPage.last_page - 1,
    },
    (_, index) => index + 2,
  );

  const pages = await Promise.all(
    remainingPages.map((page) =>
      fetchApprovalRequestsPage(status, page, signal),
    ),
  );

  const items: ApprovalInstitution[] = [
    ...firstPage.data,

    ...pages.flatMap((page) => page.data),
  ];

  return {
    items,
    total: firstPage.total,
  };
}

export async function getApprovalRequests(signal?: AbortSignal) {
  const [pendingReview, rejected] = await Promise.all([
    getApprovalRequestsByStatus("pending_review", signal),

    getApprovalRequestsByStatus("rejected", signal),
  ]);

  return {
    pending_review: pendingReview,
    rejected,
  };
}
