import type { NotificationIcon, NotificationItem } from "@/src/components/notifications/NotificationsCenter";
import { backendProxyUrl } from "@/src/config/api";
import { apiClient } from "@/src/lib/api/client";

type NotificationRecord = {
  id: string | number;
  read_at?: string | null;
  created_at?: string | null;
  data?: {
    title?: string;
    message?: string;
    description?: string;
    action?: string;
    href?: string;
    url?: string;
    category?: string;
    icon?: string;
  };
  title?: string;
  message?: string;
  description?: string;
};

type NotificationsResponse = {
  success?: boolean;
  message?: string;
  data: NotificationRecord[] | { data: NotificationRecord[]; last_page?: number };
  meta?: { last_page?: number };
  last_page?: number;
};

const icons: NotificationIcon[] = ["bell", "calendar", "approved", "alert", "delivery", "review", "warning"];

function notificationLink(value?: string) {
  if (!value) return undefined;
  try {
    const url = new URL(value, "https://admin.local");
    return url.origin === "https://admin.local" && /^\/dashboard(?:\/|$)/.test(decodeURIComponent(url.pathname))
      ? `${url.pathname}${url.search}${url.hash}`
      : undefined;
  } catch {
    return undefined;
  }
}

function toNotificationItem(record: NotificationRecord, now = new Date()): NotificationItem {
  const data = record.data ?? {};
  const createdAt = record.created_at ? new Date(record.created_at) : null;
  const validDate = createdAt && !Number.isNaN(createdAt.getTime()) ? createdAt : null;
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const isToday = validDate?.toDateString() === now.toDateString();
  const isYesterday = validDate?.toDateString() === yesterday.toDateString();
  const href = notificationLink(data.href ?? data.url);

  return {
    id: record.id,
    title: data.title ?? record.title ?? "إشعار جديد",
    description: data.message ?? data.description ?? record.message ?? record.description ?? "",
    action: href ? data.action ?? "عرض التفاصيل" : undefined,
    href,
    category: data.category,
    time: validDate
      ? new Intl.DateTimeFormat("ar", {
          hour: "2-digit",
          minute: "2-digit",
          ...(!isToday && !isYesterday ? { year: "numeric", month: "2-digit", day: "2-digit" } : {}),
        }).format(validDate)
      : "",
    group: isToday ? "today" : isYesterday ? "yesterday" : "earlier",
    unread: record.read_at == null,
    icon: icons.includes(data.icon as NotificationIcon) ? data.icon as NotificationIcon : "bell",
  };
}

export async function getNotifications(signal?: AbortSignal) {
  const notifications: NotificationItem[] = [];
  let page = 1;
  let lastPage = 1;

  do {
    const response = await apiClient<NotificationsResponse>(
      backendProxyUrl(`/notifications?page=${page}`),
      { signal, cache: "no-store" },
    );
    const records = Array.isArray(response.data) ? response.data : response.data?.data;
    if (response.success === false || !Array.isArray(records)) {
      throw new Error(response.message || "تعذر تحميل الإشعارات.");
    }
    notifications.push(...records.map((record) => toNotificationItem(record)));
    lastPage = response.meta?.last_page
      ?? (Array.isArray(response.data) ? response.last_page : response.data.last_page)
      ?? 1;
    page += 1;
  } while (page <= lastPage);

  return notifications;
}

export async function getUnreadCount(signal?: AbortSignal) {
  const response = await apiClient<{ success?: boolean; message?: string; unread_count: number }>(
    backendProxyUrl("/notifications/unread-count"),
    { signal, cache: "no-store" },
  );
  if (response.success === false || !Number.isInteger(response.unread_count)) {
    throw new Error(response.message || "تعذر تحميل عدد الإشعارات غير المقروءة.");
  }
  return response.unread_count;
}

async function post(path: string) {
  const response = await apiClient<{ success?: boolean; message?: string }>(backendProxyUrl(path), { method: "POST" });
  if (response.success === false) throw new Error(response.message || "تعذر تحديث الإشعار.");
}

export const readNotification = (id: NotificationItem["id"]) =>
  post(`/notifications/${encodeURIComponent(String(id))}/read`);

export const readAllNotifications = () => post("/notifications/read-all");
