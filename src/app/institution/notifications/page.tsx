"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import NotificationsCenter, {
  type NotificationItem,
} from "@/src/components/notifications/NotificationsCenter";
import { getApiErrorMessage } from "@/src/lib/api/errors";
import styles from "./notifications.module.css";
import {
  getNotifications,
  getUnreadCount,
  readNotification,
  readAllNotifications,
} from "./notification-api";

export default function InstitutionNotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reload, setReload] = useState(0);
  const pending = useRef(false);
  const readIds = useRef(new Set<NotificationItem["id"]>());

  useEffect(() => {
    const controller = new AbortController();
    Promise.all([
      getNotifications(controller.signal),
      getUnreadCount(controller.signal),
    ])
      .then(([items, count]) => {
        if (controller.signal.aborted) return;
        readIds.current = new Set(items.filter((item) => !item.unread).map((item) => item.id));
        setNotifications(items);
        setUnreadCount(count);
      })
      .catch((failure) => {
        if (!controller.signal.aborted) setError(getApiErrorMessage(failure));
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [reload]);

  async function markAsRead(id: NotificationItem["id"]) {
    if (pending.current || readIds.current.has(id) || !notifications.some((item) => item.id === id && item.unread)) return;
    pending.current = true;
    try {
      await readNotification(id);
      readIds.current.add(id);
      setNotifications((items) => items.map((item) => item.id === id ? { ...item, unread: false } : item));
      setUnreadCount((count) => Math.max(0, count - 1));
    } catch (failure) {
      toast.error(getApiErrorMessage(failure));
    } finally {
      pending.current = false;
    }
  }

  async function markAllAsRead() {
    if (pending.current || unreadCount === 0) return;
    pending.current = true;
    try {
      await readAllNotifications();
      notifications.forEach((item) => readIds.current.add(item.id));
      setNotifications((items) => items.map((item) => ({ ...item, unread: false })));
      setUnreadCount(0);
    } catch (failure) {
      toast.error(getApiErrorMessage(failure));
    } finally {
      pending.current = false;
    }
  }

  return (
    <section dir="rtl" className={`${styles.page} space-y-6`} aria-busy={loading}>
      {loading || error || notifications.length === 0 ? (
        <>
          <div>
            <h1 className="text-2xl font-bold text-[var(--admin-text-primary)] sm:text-3xl">الإشعارات</h1>
            <p className="mt-2 text-sm text-[var(--admin-text-muted)]">تابع تحديثات طلبات الدم والإشعارات الخاصة بمؤسستك</p>
          </div>
          <div className="rounded-[18px] border border-[var(--admin-border)] bg-white px-6 py-16 text-center">
            <p role={error ? "alert" : "status"} className="text-sm text-[var(--admin-text-muted)]">
              {loading ? "جارٍ تحميل الإشعارات..." : error ?? "لا توجد إشعارات حاليًا"}
            </p>
            {error && (
              <button type="button" className="admin-btn-primary mt-4" onClick={() => { setError(null); setLoading(true); setReload((value) => value + 1); }}>
                إعادة المحاولة
              </button>
            )}
          </div>
        </>
      ) : (
        <div className={styles.center}>
          <NotificationsCenter
            dashboardKey="institution"
            fullWidth
            spacious
            title="الإشعارات"
            description="تابع تحديثات طلبات الدم والإشعارات الخاصة بمؤسستك"
            notifications={notifications}
            unreadCount={unreadCount}
            onRead={markAsRead}
            onReadAll={markAllAsRead}
          />
        </div>
      )}
    </section>
  );
}
