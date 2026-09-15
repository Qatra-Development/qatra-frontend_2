import { API_ENDPOINTS, BFF_ENDPOINTS } from "@/src/config/api";
import { TAB_BACKEND_STATUS } from "../config/institutions.config";

import type {
  AdminInstitution,
  InstitutionCollection,
  InstitutionsApiResponse,
  InstitutionsDataset,
  InstitutionsTab,
} from "../types/institutions.types";

const PER_PAGE = 100;

async function fetchInstitutionsPage(
  tab: InstitutionsTab,
  page: number,
  signal?: AbortSignal,
) {
  const status = TAB_BACKEND_STATUS[tab];

  const searchParams = new URLSearchParams({
    status,
    page: String(page),
    per_page: String(PER_PAGE),
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
    .catch(() => null)) as InstitutionsApiResponse | null;

  if (!response.ok || !body || body.success === false) {
    throw new Error(body?.message || "تعذر تحميل بيانات المؤسسات.");
  }

  return body.data;
}

export async function getInstitutionsByTab(
  tab: InstitutionsTab,
  signal?: AbortSignal,
): Promise<InstitutionCollection> {
  const firstPage = await fetchInstitutionsPage(tab, 1, signal);

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
    remainingPages.map((page) => fetchInstitutionsPage(tab, page, signal)),
  );

  const items: AdminInstitution[] = [
    ...firstPage.data,
    ...pages.flatMap((page) => page.data),
  ];

  return {
    items,
    total: firstPage.total,
  };
}

export async function getInstitutions(
  signal?: AbortSignal,
): Promise<InstitutionsDataset> {
  const [approved, removed] = await Promise.all([
    getInstitutionsByTab("approved", signal),

    getInstitutionsByTab("removed", signal),
  ]);

  return {
    approved,
    removed,
  };
}
