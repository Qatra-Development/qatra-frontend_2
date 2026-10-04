"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import NotificationsCenter, { type NotificationItem } from "@/src/components/notifications/NotificationsCenter";
import { getNotifications, getUnreadCount, readAllNotifications, readNotification } from "./notification-api";

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const pending = useRef(false);

  useEffect(() => {
    const controller = new AbortController();
    Promise.all([getNotifications(controller.signal), getUnreadCount(controller.signal)])
      .then(([items, count]) => {
        setNotifications(items);
        setUnreadCount(count);
      })
      .catch((cause) => {
        if (!controller.signal.aborted) setError(cause instanceof Error ? cause.message : "تعذر تحميل الإشعارات.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, []);

  async function markAsRead(id: NotificationItem["id"]) {
    if (pending.current || !notifications.some((item) => item.id === id && item.unread)) return;
    pending.current = true;
    try {
      await readNotification(id);
      setNotifications((items) => items.map((item) => item.id === id ? { ...item, unread: false } : item));
      setUnreadCount((count) => Math.max(0, count - 1));
    } catch (cause) {
      toast.error(cause instanceof Error ? cause.message : "تعذر تحديث الإشعار.");
    } finally {
      pending.current = false;
    }
  }

  async function markAllAsRead() {
    if (pending.current || unreadCount === 0) return;
    pending.current = true;
    try {
      await readAllNotifications();
      setNotifications((items) => items.map((item) => ({ ...item, unread: false })));
      setUnreadCount(0);
    } catch (cause) {
      toast.error(cause instanceof Error ? cause.message : "تعذر تحديث الإشعارات.");
    } finally {
      pending.current = false;
    }
  }

  if (loading || error) {
    return (
      <div dir="rtl" className="space-y-6">
        <section>
          <h1 className="text-2xl font-bold text-brand-blue sm:text-3xl">الإشعارات</h1>
          <p className="mt-2 text-sm text-[#8c95a1]">متابعة آخر إشعارات وتحديثات النظام</p>
        </section>
        <section className="flex min-h-[480px] items-center justify-center rounded-[20px] border border-[#eceef1] bg-white p-6 text-sm text-[#8c95a1] shadow-[0_8px_25px_rgba(15,23,42,0.06)]">
          {loading ? "جارٍ تحميل الإشعارات..." : error}
        </section>
      </div>
    );
  }

  return (
    <NotificationsCenter
      dashboardKey="admin"
      fullWidth
      spacious
      eyebrow="آخر التحديثات"
      title="الإشعارات"
      description="متابعة آخر إشعارات وتحديثات النظام"
      notifications={notifications}
      unreadCount={unreadCount}
      onRead={markAsRead}
      onReadAll={markAllAsRead}
    />
  );
}
