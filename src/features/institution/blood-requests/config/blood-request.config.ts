import type {
  BloodRequestPriority,
  BloodRequestStatus,
  BloodType,
} from "../types/blood-request.types";

export const BLOOD_TYPE_OPTIONS: BloodType[] = [
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
  "O+",
  "O-",
];

export const PRIORITY_OPTIONS: {
  value: BloodRequestPriority;
  label: string;
}[] = [
  {
    value: "normal",
    label: "عادي",
  },
  {
    value: "urgent",
    label: "عاجل",
  },
  {
    value: "emergency",
    label: "طارئ",
  },
];

export const PRIORITY_LABELS: Record<BloodRequestPriority, string> = {
  normal: "عادي",
  urgent: "عاجل",
  emergency: "طارئ",
};

export const STATUS_LABELS: Record<BloodRequestStatus, string> = {
  draft: "جديد",
  pending: "قيد الاستجابة",
  accepted: "مقبول بانتظار الإرسال",
  preparing: "قيد التجهيز",
  ready: "جاهز للإرسال",
  completed: "مكتمل",
  rejected: "مرفوض",
  cancelled: "ملغي",
};

export const INSTITUTION_TYPE_LABELS: Record<string, string> = {
  central_hospital: "مستشفى مركزي",

  field_hospital: "مستشفى ميداني",

  health_center: "مركز صحي",

  blood_bank_association: "بنك دم",

  independent_blood_center: "مركز دم مستقل",
};

export const REQUEST_STATUS_OVERVIEW = [
  {
    status: "completed",
    label: "مكتمل",
    className: "bg-[var(--institution-green)]",
  },
  {
    status: "accepted",
    label: "مقبول بانتظار الإرسال",
    className: "bg-[#b99b61]",
  },
  {
    status: "pending",
    label: "قيد الاستجابة",
    className: "bg-[var(--institution-blue)]",
  },
  {
    status: "draft",
    label: "جديد",
    className: "bg-[var(--institution-yellow)]",
  },
  {
    status: "cancelled",
    label: "ملغي",
    className: "bg-[#9299a2]",
  },
] satisfies {
  status: BloodRequestStatus;
  label: string;
  className: string;
}[];
