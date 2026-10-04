import type { NotificationIcon, NotificationItem } from "@/src/components/notifications/NotificationsCenter";
import { backendProxyUrl } from "@/src/config/api";
import { apiClient } from "@/src/lib/api/client";

type NotificationRecord = {
  id: string | number;
  type?: string;
  unread?: boolean;
  read_at?: string | null;
  created_at?: string | null;
  data?: Record<string, unknown> | string;
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

function safeHref(value?: string) {
  if (!value) return undefined;
  try {
    const url = new URL(value, "https://hospital-path.local");
    return url.origin === "https://hospital-path.local" && /^\/HospitalPath(?:\/|$)/.test(decodeURIComponent(url.pathname))
      ? `${url.pathname}${url.search}${url.hash}`
      : undefined;
  } catch {
    return undefined;
  }
}

function notificationTime(date: Date | null, now: Date, isToday: boolean, isYesterday: boolean) {
  if (!date) return "";
  const minutes = Math.max(0, Math.floor((now.getTime() - date.getTime()) / 60_000));
  if (isToday) {
    if (minutes < 1) return "الآن";
    if (minutes < 60) return `منذ ${minutes} دقيقة`;
    const hours = Math.floor(minutes / 60);
    return hours === 1 ? "منذ ساعة" : `منذ ${hours} ساعات`;
  }
  return new Intl.DateTimeFormat("ar", {
    hour: "2-digit",
    minute: "2-digit",
    ...(!isYesterday ? { year: "numeric", month: "2-digit", day: "2-digit" } : {}),
  }).format(date);
}

function toNotificationItem(record: NotificationRecord, now = new Date()): NotificationItem {
  let data: Record<string, unknown> = {};
  if (typeof record.data === "string") {
    try {
      const parsed = JSON.parse(record.data) as unknown;
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) data = parsed as Record<string, unknown>;
    } catch {
      data = { message: record.data };
    }
  } else if (record.data) {
    data = record.data;
  }
  const stringValue = (...values: unknown[]) =>
    values.find((value): value is string => typeof value === "string" && value.trim().length > 0)?.trim() ?? "";
  const type = stringValue(data.type, data.notification_type, record.type).toLowerCase();
  const status = stringValue(data.status, data.institution_status, data.application_status).toLowerCase();
  const rejected = status === "rejected" || type.includes("reject");
  const approved = status === "approved" || type.includes("approv");
  const pending = ["pending", "under_review", "in_review"].includes(status) || type.includes("review");
  const fallbackTitle = rejected
    ? "تم رفض طلب تسجيل المؤسسة"
    : approved
      ? "تم اعتماد المؤسسة"
      : pending
        ? "طلب تسجيل المؤسسة قيد المراجعة"
        : "تحديث على طلب اعتماد المؤسسة";
  const fallbackDescription = rejected
    ? stringValue(data.rejection_reason, data.reason) || "تم رفض تسجيل المؤسسة. يمكنك مراجعة الملاحظات وتحديث بيانات الطلب."
    : approved
      ? "تمت الموافقة على طلب اعتماد مؤسستك بنجاح."
      : pending
        ? "نعمل على مراجعة بيانات المؤسسة، وسنرسل تحديثًا عند اكتمال المراجعة."
        : "يوجد تحديث جديد على طلب اعتماد مؤسستك.";
  const createdAt = record.created_at ? new Date(record.created_at) : null;
  const validDate = createdAt && !Number.isNaN(createdAt.getTime()) ? createdAt : null;
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const isToday = validDate?.toDateString() === now.toDateString();
  const isYesterday = validDate?.toDateString() === yesterday.toDateString();
  const href = safeHref(stringValue(data.href, data.action_url, data.url)) ?? "/HospitalPath";
  const suppliedIcon = stringValue(data.icon);

  return {
    id: record.id,
    title: stringValue(record.title, data.title, data.subject, data.heading) || fallbackTitle,
    description: stringValue(record.description, record.message, data.description, data.message, data.body, data.content, data.text) || fallbackDescription,
    action: stringValue(data.action_label, data.action) || (pending ? "عرض الحالة" : "عرض التفاصيل"),
    href,
    category: stringValue(data.category) || (pending ? "حالة التسجيل" : "طلب الاعتماد"),
    time: notificationTime(validDate, now, isToday, isYesterday),
    group: isToday ? "today" : isYesterday ? "yesterday" : "earlier",
    unread: typeof record.unread === "boolean" ? record.unread : record.read_at == null,
    icon: icons.includes(suppliedIcon as NotificationIcon)
      ? suppliedIcon as NotificationIcon
      : rejected ? "warning" : approved ? "approved" : "review",
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
    if (response.success === false || !Array.isArray(records)) throw new Error(response.message || "تعذر تحميل الإشعارات.");
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

export const readNotification = (id: NotificationItem["id"]) => post(`/notifications/${encodeURIComponent(String(id))}/read`);
export const readAllNotifications = () => post("/notifications/read-all");
