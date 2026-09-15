import type { ReviewStepId } from "../types/review.types";

import type { InstitutionDocumentType } from "../../types/institutions.types";

export const REVIEW_MAX_DAYS = 30;

export const REVIEW_STEPS: {
  id: ReviewStepId;
  label: string;
  nextLabel?: string;
}[] = [
  {
    id: 1,
    label: "بيانات المؤسسة",
    nextLabel: "الخدمات والوثائق",
  },
  {
    id: 2,
    label: "الخدمات والوثائق",
    nextLabel: "معلومات الطلب",
  },
  {
    id: 3,
    label: "معلومات الطلب",
    nextLabel: "قرار الاعتماد",
  },
  {
    id: 4,
    label: "القبول",
  },
];

export const DOCUMENT_LABELS: Record<InstitutionDocumentType, string> = {
  practice_license: "رخصة مزاولة المهنة",

  commercial_registration: "السجل التجاري",

  representative_authorization: "تفويض ممثل المؤسسة",

  quality_safety_certificate: "شهادة الجودة والسلامة",
};

export const REQUIRED_DOCUMENT_TYPES: InstitutionDocumentType[] = [
  "practice_license",
  "commercial_registration",
  "representative_authorization",
  "quality_safety_certificate",
];

export const STATUS_LABELS: Record<string, string> = {
  pending_verification: "بانتظار التحقق",

  pending_review: "قيد المراجعة",

  needs_completion: "مطلوب استكمال",

  approved: "معتمدة",

  rejected: "مرفوضة",
};
