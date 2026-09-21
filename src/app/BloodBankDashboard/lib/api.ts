import { backendProxyUrl } from "@/src/config/api";

export type BloodUnit = {
  id: number;
  unit_code: string;
  blood_type: string;
  status: "available" | "reserved" | "delivered" | "expired" | "discarded";
  collected_at: string;
  expires_at: string;
  days_until_expiration: number;
  notes: string | null;
};

export type BloodRequest = {
  id: number;
  request_number: string;
  requesting_institution: { id: number; name: string; governorate?: string; phone?: string };
  blood_type: string;
  units_required: number;
  units_reserved: number;
  units_provided: number;
  priority: "normal" | "urgent" | "emergency";
  needed_at: string;
  status: string;
  recipient_status: string;
  description?: string | null;
  notes?: string | null;
  available_actions?: Record<"accept" | "reject" | "start_preparing" | "reserve_units" | "mark_ready" | "complete", boolean>;
};

export type BloodDashboard = {
  inventory_summary: { total: number; available: number; reserved: number; delivered: number; expired: number; discarded: number };
  inventory_by_blood_type: Record<string, { available: number; reserved: number; delivered: number; expired: number; discarded: number }>;
  requests_summary: { incoming: number; accepted: number; preparing: number; ready: number; completed: number };
  low_stock: { blood_type: string; available_units: number; threshold: number }[];
  expiring_units_count: number;
  settings: { low_stock_threshold: number; expiring_soon_days: number };
};

type Envelope<T> = { success: boolean; data: T; message?: string; errors?: Record<string, string[]>; meta?: { current_page: number; last_page: number; per_page: number; total: number } };

export async function bankApi<T>(path: string, init?: RequestInit): Promise<Envelope<T>> {
  const response = await fetch(backendProxyUrl(`/blood-bank${path}`), {
    ...init,
    headers: { Accept: "application/json", "Content-Type": "application/json", ...init?.headers },
    cache: "no-store",
  });
  const result = await response.json().catch(() => null) as Envelope<T> | null;
  if (response.status === 401) {
    window.location.assign("/login");
    throw new Error("يرجى تسجيل الدخول مجددًا.");
  }
  if (!response.ok || !result?.success) {
    const fieldMessage = result?.errors && Object.values(result.errors).flat().find(Boolean);
    throw new Error(response.status === 403 ? "هذا الحساب غير مخوّل لخدمات بنك الدم." : fieldMessage || result?.message || "تعذّر إتمام الطلب. يرجى المحاولة مجددًا.");
  }
  return result;
}

export async function bankListAll<T>(path: string): Promise<T[]> {
  const separator = path.includes("?") ? "&" : "?";
  const first = await bankApi<T[]>(`${path}${separator}per_page=100&page=1`);
  const all = [...first.data];
  for (let page = 2; page <= (first.meta?.last_page ?? 1); page++) {
    all.push(...(await bankApi<T[]>(`${path}${separator}per_page=100&page=${page}`)).data);
  }
  return all;
}

export const dateLabel = (value?: string | null) => value
  ? new Date(value).toLocaleDateString("en-GB")
  : "—";
