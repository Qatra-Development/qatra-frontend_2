import { backendProxyUrl } from "@/src/config/api";
import { apiClient } from "@/src/lib/api/client";
import type { NotificationIcon, NotificationItem } from "@/src/components/notifications/NotificationsCenter";

type NotificationRecord = {
  id: string | number;
  read_at?: string | null;
  created_at?: string | null;
  data?: { title?: string; message?: string; description?: string; action?: string; url?: string; href?: string; category?: string; icon?: string };
  title?: string;
  message?: string;
  description?: string;
};
type ListResponse = {
  success?: boolean;
  message?: string;
  data: NotificationRecord[] | { data: NotificationRecord[]; last_page?: number };
  meta?: { last_page?: number };
  last_page?: number;
};
const icons: NotificationIcon[] = ["bell", "calendar", "approved", "alert", "delivery", "review", "warning"];

function displayText(value: string): string {
  return value.replace(/(?:\u{1F389}|\u2705|\u{1FA78})\uFE0F?/gu, "").trim();
}

export function toNotificationItem(record: NotificationRecord, now = new Date()): NotificationItem {
  const data = record.data ?? {};
  const date = record.created_at ? new Date(record.created_at) : null;
  const validDate = date && !Number.isNaN(date.getTime()) ? date : null;
  const sameDay = validDate?.toDateString() === now.toDateString();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const recent = sameDay || validDate?.toDateString() === yesterday.toDateString();
  const target = data.href ?? data.url;
  let href: string | undefined;
  if (typeof target === "string" && /^\/institution(?:\/|$)/.test(target)) {
    try {
      const normalized = new URL(target, "https://institution.local");
      if (normalized.origin === "https://institution.local" && /^\/institution(?:\/|$)/.test(decodeURIComponent(normalized.pathname))) {
        href = normalized.pathname + normalized.search + normalized.hash;
      }
    } catch {
      // Keep the notification visible even if its optional link is malformed.
    }
  }
  return {
    id: record.id,
    title: displayText(data.title ?? record.title ?? "إشعار"),
    description: displayText(data.message ?? data.description ?? record.message ?? record.description ?? ""),
    action: href ? displayText(data.action ?? "عرض التفاصيل") : undefined,
    href,
    category: data.category === undefined ? undefined : displayText(data.category),
    time: validDate ? new Intl.DateTimeFormat("ar", {
      hour: "2-digit", minute: "2-digit",
      ...(!recent ? { year: "numeric", month: "2-digit", day: "2-digit" } : {}),
    }).format(validDate) : "",
    group: sameDay ? "today" : recent ? "yesterday" : "earlier",
    unread: record.read_at == null,
    icon: icons.includes(data.icon as NotificationIcon) ? data.icon as NotificationIcon : "bell",
  };
}

export async function getNotifications(signal?: AbortSignal) {
  const items: NotificationItem[] = [];
  let page = 1;
  let lastPage = 1;
  do {
    const response = await apiClient<ListResponse>(backendProxyUrl(`/notifications?page=${page}`), { signal, cache: "no-store" });
    const records = Array.isArray(response.data) ? response.data : response.data?.data;
    if (response.success === false || !Array.isArray(records)) throw new Error(response.message || "تعذر تحميل الإشعارات.");
    if (records.some((record) => !record || !["string", "number"].includes(typeof record.id))) throw new Error("استجابة الإشعارات لا تحتوي معرّفات صالحة.");
    items.push(...records.map((record) => toNotificationItem(record)));
    lastPage = response.meta?.last_page ?? (Array.isArray(response.data) ? response.last_page : response.data.last_page) ?? 1;
    if (!Number.isInteger(lastPage) || lastPage < page) throw new Error("استجابة ترقيم صفحات الإشعارات غير صالحة.");
    page += 1;
  } while (page <= lastPage);
  return items;
}

export async function getUnreadCount(signal?: AbortSignal) {
  const response = await apiClient<{ success?: boolean; message?: string; unread_count: number }>(backendProxyUrl("/notifications/unread-count"), { signal, cache: "no-store" });
  if (response.success === false || !Number.isInteger(response.unread_count) || response.unread_count < 0) throw new Error(response.message || "تعذر تحميل عدد الإشعارات غير المقروءة.");
  return response.unread_count;
}
async function markRead(path: string) {
  const response = await apiClient<{ success?: boolean; message?: string }>(backendProxyUrl(path), { method: "POST" });
  if (response?.success === false) throw new Error(response.message || "تعذر تحديد الإشعارات كمقروءة.");
}
export const readNotification = (id: NotificationItem["id"]) => markRead(`/notifications/${encodeURIComponent(String(id))}/read`);
export const readAllNotifications = () => markRead("/notifications/read-all");
