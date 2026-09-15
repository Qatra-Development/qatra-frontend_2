import {
  INSTITUTION_TYPE_LABELS,
  SERVICE_SCOPE_LABELS,
} from "../config/institutions.config";

import type {
  AdminInstitution,
  ServiceScopeFilter,
} from "../types/institutions.types";

export function getInstitutionTypeLabel(value: string): string {
  return INSTITUTION_TYPE_LABELS[value] ?? value;
}

export function getServiceScopeLabel(value: string): string {
  return SERVICE_SCOPE_LABELS[value] ?? value;
}

function normalizeSearchText(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u064B-\u065F]/g, "")
    .replace(/[أإآ]/g, "ا")
    .replace(/ى/g, "ي");
}

export function filterInstitutions(
  institutions: AdminInstitution[],
  searchQuery: string,
  serviceScope: ServiceScopeFilter,
): AdminInstitution[] {
  const normalizedSearch = normalizeSearchText(searchQuery);

  return institutions.filter((institution) => {
    const matchesSearch =
      !normalizedSearch ||
      normalizeSearchText(institution.institution_name).includes(
        normalizedSearch,
      );

    const matchesService =
      serviceScope === "all" || institution.service_scope === serviceScope;

    return matchesSearch && matchesService;
  });
}
