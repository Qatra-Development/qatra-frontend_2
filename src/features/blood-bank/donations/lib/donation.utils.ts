import type { BloodType, BloodTypeCounts } from "../types/donation.types";

export function formatDonationDateTime(value?: string | null) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("ar-EG", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export function buildScheduledAt(date: string, time: string) {
  if (!date || !time) {
    return null;
  }

  const value = new Date(`${date}T${time}:00`);

  if (Number.isNaN(value.getTime())) {
    return null;
  }

  return value.toISOString();
}

export function createEmptyBloodTypeCounts(): BloodTypeCounts {
  return {
    "A+": 0,
    "A-": 0,
    "B+": 0,
    "B-": 0,
    "AB+": 0,
    "AB-": 0,
    "O+": 0,
    "O-": 0,
  };
}

export function bloodTypeCount(
  counts: BloodTypeCounts | undefined,
  bloodType: BloodType,
) {
  return counts?.[bloodType] ?? 0;
}
