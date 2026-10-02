"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import NotificationsCenter, { type NotificationItem } from "@/src/components/notifications/NotificationsCenter";
import { getApiErrorMessage } from "@/src/lib/api/errors";
import { getNotifications, getUnreadCount, readNotification, readAllNotifications } from "./notification-api";

export default function BloodBankNotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const pending = useRef(false);
  const readIds = useRef(new Set<NotificationItem["id"]>());

  useEffect(() => {
    const controller = new AbortController();
    Promise.all([getNotifications(controller.signal), getUnreadCount(controller.signal)])
      .then(([items, count]) => {
        if (controller.signal.aborted) return;
        setNotifications(items);
        setUnreadCount(count);
      })
      .catch((error) => {
        if (!controller.signal.aborted) toast.error(getApiErrorMessage(error));
      });
    return () => controller.abort();
  }, []);

  async function markAsRead(id: NotificationItem["id"]) {
    if (pending.current || readIds.current.has(id) || !notifications.some((item) => item.id === id && item.unread)) return;
    pending.current = true;
    try {
      await readNotification(id);
      readIds.current.add(id);
      setNotifications((items) => items.map((item) => item.id === id ? { ...item, unread: false } : item));
      setUnreadCount((count) => Math.max(0, count - 1));
    } catch (error) {
      toast.error(getApiErrorMessage(error));
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
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      pending.current = false;
    }
  }

  return (
    <NotificationsCenter
      dashboardKey="blood-bank"
      notifications={notifications}
      unreadCount={unreadCount}
      onRead={markAsRead}
      onReadAll={markAllAsRead}
      description="الإشعارات الخاصة بنداءات التبرع والمواعيد ومخزون الدم"
    />
  );
}
