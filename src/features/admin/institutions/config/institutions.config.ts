import type {
  InstitutionStatus,
  InstitutionsTab,
  ServiceScopeFilter,
} from "../types/institutions.types";

export const INSTITUTIONS_TABS: {
  value: InstitutionsTab;
  label: string;
}[] = [
  {
    value: "approved",
    label: "المؤسسات المعتمدة",
  },
  {
    value: "removed",
    label: "سجل المؤسسات المزالة",
  },
];

/**
 * Backend does not currently expose a "removed" status.
 * Until it does, rejected institutions are used for this tab.
 */
export const TAB_BACKEND_STATUS: Record<InstitutionsTab, InstitutionStatus> = {
  approved: "approved",
  removed: "rejected",
};

export const SERVICE_SCOPE_OPTIONS: {
  value: ServiceScopeFilter;
  label: string;
}[] = [
  {
    value: "all",
    label: "نطاق الخدمة",
  },
  {
    value: "blood_request_only",
    label: "طلب وحدات دم",
  },
  {
    value: "blood_bank_services_only",
    label: "خدمات بنك الدم",
  },
  {
    value: "blood_request_and_blood_bank",
    label: "طلب وتصدير وحدات دم",
  },
];

export const INSTITUTION_TYPE_LABELS: Record<string, string> = {
  central_hospital: "مستشفى مركزي",
  field_hospital: "مستشفى ميداني",
  health_center: "مركز صحي",
  blood_bank_association: "بنك دم",
  independent_blood_center: "مركز دم مستقل",
};

export const SERVICE_SCOPE_LABELS: Record<string, string> = {
  blood_request_only: "طلب وحدات دم",
  blood_bank_services_only: "تصدير وحدات دم",
  blood_request_and_blood_bank: "طلب وتصدير وحدات دم",
};
