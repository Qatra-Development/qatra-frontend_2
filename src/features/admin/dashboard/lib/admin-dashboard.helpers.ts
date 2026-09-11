import type {
  AdminInstitution,
  InstitutionStatus,
} from "../types/admin-dashboard.types";

export const institutionStatusLabels: Record<InstitutionStatus, string> = {
  pending_verification: "قيد التحقق",
  pending_review: "قيد المراجعة",
  needs_completion: "غير مكتمل",
  approved: "مقبول",
  rejected: "مرفوض",
};

export const institutionTypeLabels: Record<string, string> = {
  central_hospital: "مستشفى مركزي",
  field_hospital: "مستشفى ميداني",
  health_center: "مركز صحي",
  blood_bank_association: "بنك دم",
  independent_blood_center: "مركز دم مستقل",
};

export const serviceScopeLabels: Record<string, string> = {
  blood_request_only: "طلب وحدات دم",
  blood_bank_services_only: "خدمات بنك الدم",
  blood_request_and_blood_bank: "طلب وخدمات بنك الدم",
};

export function getInstitutionStatusLabel(status: InstitutionStatus) {
  return institutionStatusLabels[status] ?? status;
}

export function getInstitutionTypeLabel(type?: string | null) {
  if (!type) return "—";

  return institutionTypeLabels[type] ?? type;
}

export function getServiceScopeLabel(scope?: string | null) {
  if (!scope) return "—";

  return serviceScopeLabels[scope] ?? scope;
}

export function getInstitutionAddress(institution: AdminInstitution) {
  const parts = [institution.governorate, institution.address].filter(Boolean);

  return parts.length ? parts.join("، ") : "—";
}

export function getInstitutionTimestamp(institution: AdminInstitution) {
  const date = institution.updated_at ?? institution.created_at;

  if (!date) {
    return institution.id;
  }

  const timestamp = new Date(date).getTime();

  return Number.isNaN(timestamp) ? institution.id : timestamp;
}
