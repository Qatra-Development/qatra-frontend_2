import type {
  BloodRequestFormValues,
  BloodRequestSummary,
  BloodType,
  CreateBloodRequestPayload,
  DraftBloodRequestPayload,
} from "../types/blood-request.types";

import { INSTITUTION_TYPE_LABELS } from "../config/blood-request.config";

export function combineDateTimeToIso(
  date: string,
  time: string,
): string | undefined {
  if (!date || !time) {
    return undefined;
  }

  const value = new Date(`${date}T${time}:00`);

  if (Number.isNaN(value.getTime())) {
    return undefined;
  }

  return value.toISOString();
}

export function buildCreatePayload(
  form: BloodRequestFormValues,
): CreateBloodRequestPayload {
  return {
    blood_type: form.blood_type as BloodType,

    units_required: Number(form.units_required),

    priority: form.priority as "normal" | "urgent" | "emergency",

    description: form.description.trim(),

    needed_at: combineDateTimeToIso(form.needed_date, form.needed_time)!,

    ...(form.notes.trim()
      ? {
          notes: form.notes.trim(),
        }
      : {}),

    recipient_ids: form.recipient_ids,
  };
}

export function buildDraftPayload(
  form: BloodRequestFormValues,
): DraftBloodRequestPayload {
  const payload: DraftBloodRequestPayload = {};

  if (form.blood_type) {
    payload.blood_type = form.blood_type;
  }

  const units = Number(form.units_required);

  if (Number.isInteger(units) && units > 0) {
    payload.units_required = units;
  }

  if (form.priority) {
    payload.priority = form.priority;
  }

  if (form.description.trim()) {
    payload.description = form.description.trim();
  }

  const neededAt = combineDateTimeToIso(form.needed_date, form.needed_time);

  if (neededAt) {
    payload.needed_at = neededAt;
  }

  if (form.notes.trim()) {
    payload.notes = form.notes.trim();
  }

  if (form.recipient_ids.length) {
    payload.recipient_ids = form.recipient_ids;
  }

  return payload;
}

export function normalizeBloodTypeUnits(
  value: BloodRequestSummary["units_by_blood_type"],
): Record<BloodType, number> {
  const result = {
    "A+": 0,
    "A-": 0,
    "B+": 0,
    "B-": 0,
    "AB+": 0,
    "AB-": 0,
    "O+": 0,
    "O-": 0,
  } satisfies Record<BloodType, number>;

  if (Array.isArray(value)) {
    value.forEach((item) => {
      result[item.blood_type] =
        item.units ?? item.units_required ?? item.total ?? 0;
    });

    return result;
  }

  Object.entries(value ?? {}).forEach(([key, amount]) => {
    if (key in result) {
      result[key as BloodType] = Number(amount) || 0;
    }
  });

  return result;
}

export function formatRequestDate(value?: string | null) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("ar-EG", {
    timeZone: "Asia/Jerusalem",

    year: "numeric",
    month: "2-digit",
    day: "2-digit",

    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function getInstitutionTypeLabel(value: string) {
  return INSTITUTION_TYPE_LABELS[value] ?? value;
}
