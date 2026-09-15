import { API_ENDPOINTS, BFF_ENDPOINTS } from "@/src/config/api";
import { getInstitutionTimestamp } from "../lib/admin-dashboard.helpers";

import type {
  AdminDashboardData,
  AdminInstitution,
  InstitutionPage,
  InstitutionStatus,
} from "../types/admin-dashboard.types";

const DASHBOARD_STATUSES: InstitutionStatus[] = [
  "pending_verification",
  "pending_review",
  "needs_completion",
  "approved",
  "rejected",
];

interface LaravelPaginator<T> {
  data?: T[];
  total?: number;

  meta?: {
    total?: number;
  };
}

interface LaravelApiResponse<T> {
  success?: boolean;
  message?: string;
  data?: T;

  meta?: {
    total?: number;
  };
}

function normalizeInstitutionListResponse(raw: unknown): InstitutionPage {
  const response = raw as LaravelApiResponse<
    LaravelPaginator<AdminInstitution> | AdminInstitution[]
  >;

  if (response.success === false) {
    throw new Error(response.message || "تعذر تحميل بيانات المؤسسات.");
  }

  if (Array.isArray(response.data)) {
    return {
      items: response.data,
      total: response.meta?.total ?? response.data.length,
    };
  }

  const paginator = response.data;

  if (paginator && !Array.isArray(paginator)) {
    const items = Array.isArray(paginator.data) ? paginator.data : [];

    return {
      items,
      total:
        paginator.total ??
        paginator.meta?.total ??
        response.meta?.total ??
        items.length,
    };
  }

  return {
    items: [],
    total: 0,
  };
}

async function fetchInstitutionsByStatus(
  status: InstitutionStatus,
  signal?: AbortSignal,
): Promise<InstitutionPage> {
  const params = new URLSearchParams({
    status,
    per_page: "5",
    page: "1",
  });

  const url = `${BFF_ENDPOINTS.backend(
    API_ENDPOINTS.admin.institutions,
  )}?${params.toString()}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
    cache: "no-store",
    signal,
  });

  const body: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const errorBody = body as {
      message?: string;
    } | null;

    throw new Error(errorBody?.message || "تعذر تحميل بيانات لوحة التحكم.");
  }

  return normalizeInstitutionListResponse(body);
}

export async function getAdminDashboard(
  signal?: AbortSignal,
): Promise<AdminDashboardData> {
  const results = await Promise.all(
    DASHBOARD_STATUSES.map(async (status) => {
      const page = await fetchInstitutionsByStatus(status, signal);

      return {
        status,
        page,
      };
    }),
  );

  const pages = Object.fromEntries(
    results.map(({ status, page }) => [status, page]),
  ) as Record<InstitutionStatus, InstitutionPage>;

  const total = DASHBOARD_STATUSES.reduce(
    (sum, status) => sum + pages[status].total,
    0,
  );

  const allInstitutions = results
    .flatMap(({ page }) => page.items)
    .filter(
      (institution, index, array) =>
        array.findIndex((item) => item.id === institution.id) === index,
    )
    .sort((a, b) => getInstitutionTimestamp(b) - getInstitutionTimestamp(a));

  const latestInstitutions = allInstitutions.slice(0, 5);

  const lastReview =
    pages.pending_review.items[0] ?? latestInstitutions[0] ?? null;

  return {
    stats: {
      total,
      pendingReview: pages.pending_review.total,
      approved: pages.approved.total,
      rejected: pages.rejected.total,
    },

    latestInstitutions,
    lastReview,
  };
}
