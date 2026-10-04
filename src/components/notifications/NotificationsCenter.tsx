"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Bell,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronLeft,
  CircleAlert,
  BriefcaseMedical,
  Sun,
  TriangleAlert,
} from "lucide-react";

export type NotificationIcon =
  | "bell"
  | "calendar"
  | "approved"
  | "alert"
  | "delivery"
  | "review"
  | "warning";
export type NotificationGroup = "today" | "yesterday" | "earlier";

export interface NotificationItem {
  id: string | number;
  title: string;
  description: string;
  action?: string;
  href?: string;
  category?: string;
  time: string;
  group: NotificationGroup;
  unread: boolean;
  icon: NotificationIcon;
}

interface NotificationsCenterProps {
  notifications: NotificationItem[];
  dashboardKey: string;
  fullWidth?: boolean;
  spacious?: boolean;
  eyebrow?: string;
  title?: string;
  description?: string;
  unreadCount?: number;
  onRead?: (id: NotificationItem["id"]) => Promise<void>;
  onReadAll?: () => Promise<void>;
}

function NoticeIcon({ type }: { type: NotificationIcon }) {
  const isRed = type === "bell" || type === "alert" || type === "warning";
  const isDelivery = type === "delivery";
  const isReview = type === "review";
  const iconClass = "h-[21px] w-[21px]";

  return (
    <span
      className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl sm:h-12 sm:w-12 sm:rounded-[14px] ${
        isRed
          ? "bg-[#fbeaec] text-[#c32640]"
          : isDelivery
            ? "bg-[#edf5fa] text-[#4c7f99]"
            : isReview
              ? "bg-[#f0f4f4] text-[#7c8c8f]"
              : "bg-[#e8f3f1] text-[#178879]"
      }`}
    >
      {type === "bell" && <Bell className={iconClass} strokeWidth={2.4} />}
      {type === "calendar" && <CalendarDays className={iconClass} strokeWidth={2.4} />}
      {type === "approved" && <CheckCircle2 className={iconClass} strokeWidth={2.4} />}
      {type === "alert" && <CircleAlert className={iconClass} strokeWidth={2.4} />}
      {type === "delivery" && <BriefcaseMedical className={iconClass} strokeWidth={2.4} />}
      {type === "review" && <Sun className="h-6 w-6" strokeWidth={2.5} />}
      {type === "warning" && <TriangleAlert className="h-[21px] w-[21px]" strokeWidth={2.3} />}
    </span>
  );
}

function NotificationRow({
  item,
  onRead,
}: {
  item: NotificationItem;
  onRead: (id: NotificationItem["id"]) => void;
}) {
  return (
    <article
      className={`group flex min-h-[92px] items-center gap-4 px-4 py-4 transition-colors sm:px-6 lg:px-8 ${
        item.unread ? "bg-[#f3f9f7]" : "bg-white hover:bg-[#fbfcfc]"
      }`}
    >
      <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4">
        <NoticeIcon type={item.icon} />

        <div className="min-w-0 text-right">
          <div className="flex items-center gap-2">
            <h3
              className={`truncate text-[13px] text-[#28383e] sm:text-[15px] ${
                item.unread ? "font-bold" : "font-medium"
              }`}
            >
              {item.title}
            </h3>
            {item.unread && <span className="h-2 w-2 shrink-0 rounded-full bg-[#bd2440]" />}
          </div>

          <p className="mt-1 truncate text-[11px] leading-5 text-[#899397] sm:text-[13px]">
            {item.description}
          </p>

          <div className="mt-1 flex flex-wrap items-center gap-x-2 text-[10px] sm:text-[11px]">
            {item.action && item.href && (
              <Link href={item.href} className="font-semibold text-[#157b70] hover:underline">
                {item.action} <span aria-hidden="true">←</span>
              </Link>
            )}
            {item.action && item.category && <span className="text-[#d5d9da]">|</span>}
            {item.category && <span className="text-[#879296]">{item.category}</span>}
            <span className="text-[#879296]">{item.time}</span>
          </div>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-4 sm:gap-6">
        {item.unread && (
          <button
            type="button"
            onClick={() => onRead(item.id)}
            className="hidden items-center gap-1 text-[11px] font-medium text-[#178879] transition-opacity hover:opacity-70 sm:flex"
          >
            <Check className="h-3.5 w-3.5" strokeWidth={2.2} />
            تحديد كمقروء
          </button>
        )}
        <ChevronLeft
          aria-hidden="true"
          className="h-5 w-5 text-[#18272c] transition-transform group-hover:-translate-x-0.5"
          strokeWidth={1.8}
        />
      </div>
    </article>
  );
}

export default function NotificationsCenter({
  notifications: initialNotifications,
  dashboardKey,
  fullWidth = false,
  spacious = false,
  eyebrow = "آخر التحديثات",
  title = "مركز الإشعارات",
  description = "الإشعارات الخاصة بحسابك والعمليات المهمة",
  unreadCount: suppliedUnreadCount,
  onRead,
  onReadAll,
}: NotificationsCenterProps) {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const unreadCount = suppliedUnreadCount ?? notifications.filter((item) => item.unread).length;
  const visible = notifications.filter((item) => filter === "all" || item.unread);
  const managed = onRead !== undefined;
  const [source, setSource] = useState({ dashboardKey, initialNotifications });

  // عند الانتقال بين أنواع الداشبورد نحمّل إشعارات الصفحة الجديدة،
  // ولا نحتفظ بحالة الصفحة السابقة داخل المكوّن المشترك.
  if (source.dashboardKey !== dashboardKey || source.initialNotifications !== initialNotifications) {
    setSource({ dashboardKey, initialNotifications });
    setNotifications(initialNotifications);
    if (!managed) setFilter("all");
  }

  const markAsRead = (id: NotificationItem["id"]) => {
    if (onRead) {
      void onRead(id);
      return;
    }
    setNotifications((items) =>
      items.map((item) => (item.id === id ? { ...item, unread: false } : item)),
    );
  };

  const markAllAsRead = () => {
    if (onReadAll) {
      void onReadAll();
      return;
    }
    setNotifications((items) => items.map((item) => ({ ...item, unread: false })));
  };

  const renderGroup = (group: NotificationGroup, label: string) => {
    const items = visible.filter((item) => item.group === group);
    if (!items.length) return null;

    return (
      <section className="border-t border-[rgba(159,174,174,0.12)] first:border-t-0">
        <h2 className={`bg-[#fbfcfc] px-4 text-[11px] font-semibold text-[#65747a] sm:px-6 lg:px-8 ${spacious ? "flex h-[42px] items-center" : "py-2.5"}`}>
          {label}
        </h2>
        <div className="divide-y divide-[rgba(159,174,174,0.105)]">
          {items.map((item) => (
            <div key={item.id} className={spacious ? "[&>article]:min-h-[110px]" : undefined}>
              <NotificationRow item={item} onRead={markAsRead} />
            </div>
          ))}
        </div>
      </section>
    );
  };

  return (
    <div
      className={`mx-auto w-full px-2 pb-16 pt-[15px] font-tajawal sm:px-3 lg:px-4 ${
        fullWidth ? "max-w-none" : "max-w-[1240px]"
      }`}
    >
      <div className="mb-7 flex items-end justify-between gap-4">
        <div>
          <p className="mb-1 text-[11px] font-bold text-[#a71933]">{eyebrow}</p>
          <h1 className="text-[26px] font-bold leading-tight text-[#26373e]">{title}</h1>
          <p className="mt-1 text-xs font-normal text-[#849197]">{description}</p>
        </div>

        <button
          type="button"
          onClick={markAllAsRead}
          disabled={unreadCount === 0}
          className="hidden h-9 min-w-[158px] items-center justify-center gap-2 rounded-lg border border-[#ddd8d1] bg-white px-4 text-xs font-bold text-[#263640] shadow-[0_1px_2px_rgba(38,54,64,0.025)] transition hover:border-[#cbc5bd] hover:bg-[#fdfcfb] disabled:cursor-default disabled:opacity-45 sm:flex"
        >
          <Check className="h-4 w-4" strokeWidth={1.7} />
          تحديد الكل كمقروء
        </button>
      </div>

      <div className={`overflow-hidden rounded-[18px] border border-[rgba(138,158,158,0.185)] bg-white shadow-[0_3px_15px_rgba(30,50,55,0.022)] ${spacious ? "min-h-[372px]" : ""}`}>
        <div className={`flex items-center gap-5 border-b border-[rgba(159,174,174,0.105)] px-4 sm:px-6 lg:px-8 ${spacious ? "h-[70px]" : "h-[64px]"}`}>
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={`flex h-11 items-center gap-3 rounded-2xl text-[15px] transition ${
              filter === "all"
                ? "bg-[#e8f3f1] px-3.5 font-bold text-[#126356]"
                : "px-1 font-normal text-[#687773]"
            }`}
          >
            <span
              className={
                filter === "all"
                  ? "grid h-8 min-w-8 place-items-center rounded-full bg-white px-1 text-[15px] font-bold text-[#126356]"
                  : "font-normal"
              }
            >
              {notifications.length}
            </span>
            <span>الكل</span>
          </button>

          <button
            type="button"
            onClick={() => setFilter("unread")}
            className={`flex h-11 items-center gap-3 rounded-2xl px-1 text-[15px] transition ${
              filter === "unread"
                ? "bg-[#e8f3f1] px-3.5 font-bold text-[#126356]"
                : "font-normal text-[#687773]"
            }`}
          >
            <span className={filter === "unread" ? "grid h-8 min-w-8 place-items-center rounded-full bg-white font-bold" : "font-normal"}>
              {unreadCount}
            </span>
            <span>غير المقروءة</span>
          </button>
        </div>

        {visible.length ? (
          <div>
            {renderGroup("today", "اليوم")}
            {renderGroup("yesterday", "أمس")}
            {renderGroup("earlier", "إشعارات سابقة")}
          </div>
        ) : (
          <div className="py-16 text-center text-sm text-[#849197]">
            لا توجد إشعارات غير مقروءة
          </div>
        )}
      </div>
    </div>
  );
}
