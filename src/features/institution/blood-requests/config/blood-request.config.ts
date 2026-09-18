import {
  BLOOD_TYPES,
  type BloodRequestPriority,
  type BloodRequestStatus,
  type BloodRequestStatusFilter,
} from "../types/blood-request.types";

/*
|--------------------------------------------------------------------------
| Blood Types
|--------------------------------------------------------------------------
*/

export const BLOOD_TYPE_OPTIONS = BLOOD_TYPES.map((value) => ({
  value,
  label: value,
}));

/*
|--------------------------------------------------------------------------
| Priorities
|--------------------------------------------------------------------------
*/

export const PRIORITY_OPTIONS: Array<{
  value: BloodRequestPriority;
  label: string;
}> = [
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

/*
|--------------------------------------------------------------------------
| Request Status Tabs
|--------------------------------------------------------------------------
*/

export interface RequestStatusTab {
  value?: BloodRequestStatusFilter;
  label: string;
}

export const REQUEST_STATUS_TABS: RequestStatusTab[] = [
  {
    value: undefined,
    label: "الكل",
  },
  {
    value: "cancelled",
    label: "ملغي",
  },
  {
    value: "rejected",
    label: "مرفوض",
  },
  {
    value: "pending",
    label: "قيد الانتظار",
  },
  {
    value: "ready",
    label: "جاهزة للتسليم",
  },
  {
    value: "completed",
    label: "مكتمل",
  },
];

/*
|--------------------------------------------------------------------------
| Status Labels
|--------------------------------------------------------------------------
*/

export const REQUEST_STATUS_LABELS: Record<BloodRequestStatusFilter, string> = {
  draft: "مسودة",
  pending: "قيد الانتظار",
  accepted: "مقبول",
  preparing: "قيد التجهيز",
  ready: "جاهز للتسليم",
  completed: "مكتمل",
  rejected: "مرفوض",
  cancelled: "ملغي",
  processing: "قيد المعالجة",
};

/*
|--------------------------------------------------------------------------
| Dashboard Status Overview
|--------------------------------------------------------------------------
*/

export const REQUEST_STATUS_OVERVIEW = [
  {
    key: "completed",
    status: "completed",
    value: "completed",
    label: "مكتمل",
    color: "#50caa1",
  },
  {
    key: "accepted",
    status: "accepted",
    value: "accepted",
    label: "مقبول",
    color: "#b89455",
  },
  {
    key: "pending",
    status: "pending",
    value: "pending",
    label: "قيد الانتظار",
    color: "#5f91a6",
  },
  {
    key: "draft",
    status: "draft",
    value: "draft",
    label: "مسودة",
    color: "#f4b33c",
  },
  {
    key: "cancelled",
    status: "cancelled",
    value: "cancelled",
    label: "ملغي",
    color: "#9299a2",
  },
] as const satisfies ReadonlyArray<{
  key: BloodRequestStatus;
  status: BloodRequestStatus;
  value: BloodRequestStatus;
  label: string;
  color: string;
}>;

/*
|--------------------------------------------------------------------------
| Request Progress
|--------------------------------------------------------------------------
*/

export const REQUEST_PROGRESS_STEPS: Array<{
  status: Extract<
    BloodRequestStatus,
    "pending" | "accepted" | "preparing" | "ready" | "completed"
  >;
  label: string;
}> = [
  {
    status: "pending",
    label: "قيد الانتظار",
  },
  {
    status: "accepted",
    label: "مقبول",
  },
  {
    status: "preparing",
    label: "قيد التجهيز",
  },
  {
    status: "ready",
    label: "جاهز للتسليم",
  },
  {
    status: "completed",
    label: "مكتمل",
  },
];
