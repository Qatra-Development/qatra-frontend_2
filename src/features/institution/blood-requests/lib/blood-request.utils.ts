import {
  PRIORITY_LABELS,
  REQUEST_STATUS_LABELS,
} from "../config/blood-request.config";

import { BLOOD_TYPES } from "../types/blood-request.types";

import type {
  BloodRequestDatePreset,
  BloodRequestDetails,
  BloodRequestFormValues,
  BloodRequestListFilters,
  BloodRequestSummary,
  BloodRequestUiFilters,
  CreateBloodRequestPayload,
  DraftBloodRequestPayload,
} from "../types/blood-request.types";

const APP_TIMEZONE = "Asia/Jerusalem";

export function formatRequestDateTime(value?: string | null) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("ar-EG-u-nu-latn", {
    timeZone: APP_TIMEZONE,
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

export function formatRequestDate(value?: string | null) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-CA", {
    timeZone: APP_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export function formatTableDateTime(value?: string | null) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: APP_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(date);

  return parts.replace(",", " -");
}

export function formatRelativeTime(value?: string | null) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  const diff = Date.now() - date.getTime();

  const minutes = Math.floor(diff / 60_000);

  if (minutes < 1) {
    return "الآن";
  }

  if (minutes < 60) {
    return `منذ ${minutes} دقيقة`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    if (hours === 1) {
      return "منذ ساعة";
    }

    return `منذ ${hours} ساعات`;
  }

  const days = Math.floor(hours / 24);

  if (days === 1) {
    return "أمس";
  }

  if (days === 2) {
    return "منذ يومين";
  }

  return `منذ ${days} أيام`;
}

function inputDate(date: Date) {
  const year = date.getFullYear();

  const month = String(date.getMonth() + 1).padStart(2, "0");

  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function presetDateRange(preset?: BloodRequestDatePreset) {
  if (!preset) {
    return {};
  }

  const today = new Date();

  if (preset === "today") {
    const value = inputDate(today);

    return {
      date_from: value,
      date_to: value,
    };
  }

  if (preset === "last7" || preset === "last30") {
    const start = new Date(today);

    const numberOfDays = preset === "last7" ? 7 : 30;

    start.setDate(start.getDate() - (numberOfDays - 1));

    return {
      date_from: inputDate(start),
      date_to: inputDate(today),
    };
  }

  return {};
}

export function toApiFilters(
  filters: BloodRequestUiFilters,
  search: string,
  page: number,
): BloodRequestListFilters {
  const presetRange =
    filters.date_preset && filters.date_preset !== "custom"
      ? presetDateRange(filters.date_preset)
      : {};

  return {
    search: search.trim() || undefined,

    blood_type: filters.blood_type,

    priority: filters.priority,

    status: filters.status,

    date_from:
      filters.date_preset === "custom"
        ? filters.date_from
        : presetRange.date_from,

    date_to:
      filters.date_preset === "custom" ? filters.date_to : presetRange.date_to,

    date_field: filters.date_preset ? "created_at" : undefined,

    sort: "newest",

    page,

    per_page: 15,
  };
}

export function countAppliedFilters(filters: BloodRequestUiFilters) {
  let count = 0;

  if (filters.status) count += 1;
  if (filters.blood_type) count += 1;
  if (filters.priority) count += 1;
  if (filters.date_preset) count += 1;

  return count;
}

export function getDatePresetLabel(preset: BloodRequestDatePreset) {
  switch (preset) {
    case "today":
      return "اليوم";

    case "last7":
      return "آخر 7 أيام";

    case "last30":
      return "آخر 30 يوم";

    case "custom":
      return "فترة مخصصة";
  }
}

export function getFilterLabels(filters: BloodRequestUiFilters) {
  return {
    status: filters.status ? REQUEST_STATUS_LABELS[filters.status] : undefined,

    blood_type: filters.blood_type,

    priority: filters.priority ? PRIORITY_LABELS[filters.priority] : undefined,

    date: filters.date_preset
      ? getDatePresetLabel(filters.date_preset)
      : undefined,
  };
}

export function requestToFormValues(
  request: BloodRequestDetails,
): BloodRequestFormValues {
  const neededAt = new Date(request.needed_at);

  const date = Number.isNaN(neededAt.getTime())
    ? ""
    : [
        neededAt.getFullYear(),
        String(neededAt.getMonth() + 1).padStart(2, "0"),
        String(neededAt.getDate()).padStart(2, "0"),
      ].join("-");

  const time = Number.isNaN(neededAt.getTime())
    ? ""
    : [
        String(neededAt.getHours()).padStart(2, "0"),
        String(neededAt.getMinutes()).padStart(2, "0"),
      ].join(":");

  return {
    blood_type: request.blood_type,

    units_required: String(request.units_required),

    priority: request.priority,

    needed_date: date,
    needed_time: time,

    description: request.description,

    notes: request.notes ?? "",

    recipient_ids: request.recipient_ids ?? [],
  };
}

export function emptyBloodRequestForm(): BloodRequestFormValues {
  return {
    blood_type: "",

    units_required: "",

    priority: "",

    needed_date: "",
    needed_time: "",

    description: "",
    notes: "",

    recipient_ids: [],
  };
}

export function neededAtFromForm(date: string, time: string) {
  if (!date || !time) {
    return null;
  }

  const parsed = new Date(`${date}T${time}:00`);

  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return parsed.toISOString();
}

/*
|--------------------------------------------------------------------------
| Create Payload
|--------------------------------------------------------------------------
*/

export function buildCreatePayload(
  form: BloodRequestFormValues,
): CreateBloodRequestPayload {
  if (!form.blood_type) {
    throw new Error("فصيلة الدم مطلوبة.");
  }

  if (!form.priority) {
    throw new Error("درجة الاستعجال مطلوبة.");
  }

  const unitsRequired = Number(form.units_required);

  if (!Number.isInteger(unitsRequired) || unitsRequired <= 0) {
    throw new Error("عدد الوحدات غير صحيح.");
  }

  const neededAt = neededAtFromForm(form.needed_date, form.needed_time);

  if (!neededAt) {
    throw new Error("تاريخ ووقت الحاجة غير صحيحين.");
  }

  const description = form.description.trim();

  if (!description) {
    throw new Error("سبب الطلب مطلوب.");
  }

  if (form.recipient_ids.length === 0) {
    throw new Error("يجب اختيار جهة موردة واحدة على الأقل.");
  }

  return {
    blood_type: form.blood_type,

    units_required: unitsRequired,

    priority: form.priority,

    description,

    needed_at: neededAt,

    ...(form.notes.trim()
      ? {
          notes: form.notes.trim(),
        }
      : {}),

    recipient_ids: form.recipient_ids,
  };
}

/*
|--------------------------------------------------------------------------
| Draft Payload
|--------------------------------------------------------------------------
*/

export function buildDraftPayload(
  form: BloodRequestFormValues,
): DraftBloodRequestPayload {
  const payload: DraftBloodRequestPayload = {};

  if (form.blood_type) {
    payload.blood_type = form.blood_type;
  }

  const unitsRequired = Number(form.units_required);

  if (
    form.units_required.trim() &&
    Number.isInteger(unitsRequired) &&
    unitsRequired > 0
  ) {
    payload.units_required = unitsRequired;
  }

  if (form.priority) {
    payload.priority = form.priority;
  }

  const description = form.description.trim();

  if (description) {
    payload.description = description;
  }

  const neededAt = neededAtFromForm(form.needed_date, form.needed_time);

  if (neededAt) {
    payload.needed_at = neededAt;
  }

  const notes = form.notes.trim();

  if (notes) {
    payload.notes = notes;
  }

  payload.recipient_ids = [...form.recipient_ids];

  return payload;
}

/*
|--------------------------------------------------------------------------
| Blood Type Chart
|--------------------------------------------------------------------------
*/

export function normalizeBloodTypeUnits(
  unitsByBloodType: BloodRequestSummary["units_by_blood_type"],
) {
  return BLOOD_TYPES.map((bloodType) => ({
    blood_type: bloodType,
    units: unitsByBloodType[bloodType] ?? 0,
  }));
}
