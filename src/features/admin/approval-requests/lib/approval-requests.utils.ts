import {
  GOVERNORATE_LABELS,
  INSTITUTION_TYPE_LABELS,
} from "../config/approval-requests.config";

import type {
  ApprovalInstitution,
  ServiceScopeFilter,
} from "../types/approval-requests.types";

export function getInstitutionTypeLabel(type: string): string {
  return INSTITUTION_TYPE_LABELS[type] ?? type;
}

export function getGovernorateLabel(governorate: string): string {
  return GOVERNORATE_LABELS[governorate] ?? governorate;
}

export function formatSubmissionDate(dateValue: string): string {
  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "تاريخ غير متوفر";
  }

  return new Intl.DateTimeFormat("ar-EG", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function normalizeArabicSearchText(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u064B-\u065F]/g, "")
    .replace(/[أإآ]/g, "ا")
    .replace(/ى/g, "ي");
}

export function filterApprovalInstitutions(
  institutions: ApprovalInstitution[],
  searchQuery: string,
  serviceScope: ServiceScopeFilter,
): ApprovalInstitution[] {
  const normalizedSearch = normalizeArabicSearchText(searchQuery);

  return institutions.filter((institution) => {
    const matchesSearch =
      !normalizedSearch ||
      normalizeArabicSearchText(institution.institution_name).includes(
        normalizedSearch,
      );

    const matchesService =
      serviceScope === "all" || institution.service_scope === serviceScope;

    return matchesSearch && matchesService;
  });
}
