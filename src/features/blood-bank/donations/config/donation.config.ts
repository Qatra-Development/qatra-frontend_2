import type {
  BloodType,
  DonationCallStatus,
  DonationPriority,
  DonationProcessStatus,
  VoluntaryDonationRequestStatus,
} from "../types/donation.types";

export const BLOOD_TYPE_FILTERS: BloodType[] = [
  "AB-",
  "A-",
  "B-",
  "O-",
  "AB+",
  "A+",
  "B+",
  "O+",
];

export const VOLUNTARY_STATUS_LABELS: Record<
  VoluntaryDonationRequestStatus,
  string
> = {
  pending: "بانتظار رد المؤسسة",
  scheduled: "تم تحديد الموعد",
  completed: "تم التبرع",
  declined: "مرفوض",
  cancelled: "ملغي",
};

export const DONATION_PROCESS_STATUS_LABELS: Record<
  DonationProcessStatus,
  string
> = {
  awaiting_contact: "بانتظار التواصل",
  scheduled: "تم تحديد الموعد",
  completed: "تم التبرع",
  cancelled: "ملغي",
};

export const DONATION_CALL_STATUS_LABELS: Record<DonationCallStatus, string> = {
  active: "نشط",
  fulfilled: "مكتمل",
  closed: "مغلق",
  cancelled: "ملغي",
};

export const DONATION_PRIORITY_LABELS: Record<DonationPriority, string> = {
  normal: "عادي",
  urgent: "عاجل",
  emergency: "عاجل جدًا",
};

export const REGION_OPTIONS = [
  { value: "North Gaza", label: "شمال غزة" },
  { value: "Gaza", label: "غزة" },
  {
    value: "Deir Al-Balah",
    label: "دير البلح",
  },
  {
    value: "Khan Yunis",
    label: "خان يونس",
  },
  { value: "Rafah", label: "رفح" },

  { value: "Jenin", label: "جنين" },
  { value: "Tubas", label: "طوباس" },
  { value: "Tulkarm", label: "طولكرم" },
  { value: "Nablus", label: "نابلس" },
  { value: "Qalqilya", label: "قلقيلية" },
  { value: "Salfit", label: "سلفيت" },

  {
    value: "Ramallah",
    label: "رام الله والبيرة",
  },

  {
    value: "Jericho",
    label: "أريحا والأغوار",
  },

  { value: "Jerusalem", label: "القدس" },
  { value: "Bethlehem", label: "بيت لحم" },
  { value: "Hebron", label: "الخليل" },
] as const;
