import { REVIEW_MAX_DAYS } from "../config/review.config";

import type { RequestedService, ReviewProgress } from "../types/review.types";

import type {
  AdminInstitution,
  InstitutionVerifier,
  ServiceScope,
} from "../../types/institutions.types";

export function formatReviewDate(value?: string | null): string {
  if (!value) return "غير متوفر";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "غير متوفر";
  }

  return new Intl.DateTimeFormat("ar-EG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

export function formatReviewDateTime(value?: string | null): string {
  if (!value) return "غير متوفر";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "غير متوفر";
  }

  return new Intl.DateTimeFormat("ar-EG", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export function calculateReviewProgress(createdAt: string): ReviewProgress {
  const created = new Date(createdAt);

  const now = new Date();

  if (Number.isNaN(created.getTime())) {
    return {
      maxDays: REVIEW_MAX_DAYS,
      elapsedDays: 0,
      remainingDays: REVIEW_MAX_DAYS,
      percentage: 0,
    };
  }

  const diff = now.getTime() - created.getTime();

  const elapsedDays = Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));

  const remainingDays = Math.max(REVIEW_MAX_DAYS - elapsedDays, 0);

  const percentage = Math.min(
    Math.round((elapsedDays / REVIEW_MAX_DAYS) * 100),
    100,
  );

  return {
    maxDays: REVIEW_MAX_DAYS,
    elapsedDays,
    remainingDays,
    percentage,
  };
}

export function getRequestedServices(scope: ServiceScope): RequestedService[] {
  const services: RequestedService[] = [];

  if (
    scope === "blood_request_only" ||
    scope === "blood_request_and_blood_bank"
  ) {
    services.push({
      key: "blood_request",
      title: "طلب الدم",
      description: "تمكين المؤسسة من طلب وحدات الدم من بنوك الدم المعتمدة.",
    });
  }

  if (
    scope === "blood_bank_services_only" ||
    scope === "blood_request_and_blood_bank"
  ) {
    services.push({
      key: "blood_bank",
      title: "بنك الدم",
      description: "تشغيل وإدارة بنك الدم الخاص بالمؤسسة.",
    });
  }

  return services;
}

export function getDocumentExtension(filePath: string): string {
  const extension = filePath.split(".").pop()?.toUpperCase();

  return extension || "ملف";
}

export function getDocumentFileName(filePath: string): string {
  return filePath.split("/").pop() || "document";
}

export function getReviewerName(verifier: InstitutionVerifier | null): string {
  return verifier?.name || verifier?.user?.name || "لم يتم تعيين مراجع";
}

export function getReviewerImage(
  verifier: InstitutionVerifier | null,
): string | null {
  return (
    verifier?.avatar_url ||
    verifier?.image_url ||
    verifier?.profile_photo_url ||
    verifier?.user?.avatar_url ||
    verifier?.user?.image_url ||
    verifier?.user?.profile_photo_url ||
    null
  );
}

export function getInitial(name: string): string {
  const value = name.trim();

  return value ? value.charAt(0) : "؟";
}

export function areRequiredDocumentsApproved(
  institution: AdminInstitution,
): boolean {
  const required = new Set([
    "practice_license",
    "commercial_registration",
    "representative_authorization",
    "quality_safety_certificate",
  ]);

  const documents = institution.documents.filter((document) =>
    required.has(document.document_type),
  );

  return (
    documents.length === 4 &&
    documents.every((document) => document.status === "approved")
  );
}
