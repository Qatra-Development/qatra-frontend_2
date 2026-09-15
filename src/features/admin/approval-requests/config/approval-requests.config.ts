import type {
  ApprovalRequestStatus,
  ServiceScopeFilter,
} from "../types/approval-requests.types";

export interface ApprovalRequestTab {
  status: ApprovalRequestStatus;
  label: string;
}

export const APPROVAL_REQUEST_TABS: ApprovalRequestTab[] = [
  {
    status: "pending_review",
    label: "قيد المراجعة",
  },
  {
    status: "rejected",
    label: "المرفوضة",
  },
];

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
    label: "طلب وخدمات بنك الدم",
  },
];

export const INSTITUTION_TYPE_LABELS: Record<string, string> = {
  central_hospital: "مستشفى مركزي",
  field_hospital: "مستشفى ميداني",
  health_center: "مركز صحي",
  blood_bank_association: "بنك دم",
  independent_blood_center: "مركز دم مستقل",
};

export const GOVERNORATE_LABELS: Record<string, string> = {
  Gaza: "غزة",
  "North Gaza": "شمال غزة",
  "Deir al-Balah": "دير البلح",
  "Khan Yunis": "خانيونس",
  Rafah: "رفح",
};
