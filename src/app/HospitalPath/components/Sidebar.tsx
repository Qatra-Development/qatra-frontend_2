"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { logout } from "@/src/features/auth/services/auth.service";
import { clearAuthenticatedUser } from "@/src/features/auth/client/user-storage";
import { toast } from "sonner";

export default function Sidebar() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      clearAuthenticatedUser();
      toast.success("تم تسجيل الخروج بنجاح.");
      router.replace("/login");
    } catch {
      clearAuthenticatedUser();
      router.replace("/login");
    }
  };

  return (
    <aside
      className="w-60 bg-white border-l border-slate-200/80 flex flex-col justify-between py-6 px-4 flex-shrink-0 min-h-full"
      data-purpose="main-sidebar"
    >
      {/* Top Branding & Navigation */}
      <div>
        {/* Brand Logo Header */}
        <div className="flex items-center justify-start gap-2 px-3 pb-8">
          {/* Qatrah Logo */}
          <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
            <Image
              src="/img/logo.png"
              alt="شعار قطرة"
              width={32}
              height={32}
              className="w-full h-full object-contain"
              priority
            />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-800">
            قطرة
          </span>
        </div>

        {/* Primary Navigation Links */}
        <nav className="space-y-1.5" data-purpose="sidebar-nav">
          {/* Active Tab: حالة الطلب */}
          <Link
            href="/HospitalPath"
            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-[#faecee] text-[#83141f] font-bold text-xs shadow-2xs transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <svg
                className="w-4 h-4 text-[#83141f]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
              </svg>
              <span>حالة الطلب</span>
            </div>
          </Link>

          {/* Inactive Tab: الملف الشخصي */}
          <Link
            href="#"
            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-50 font-medium text-xs transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <svg
                className="w-4 h-4 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
              </svg>
              <span>الملف الشخصي</span>
            </div>
          </Link>

          {/* Inactive Tab: الإشعارات */}
          <Link
            href="#"
            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-50 font-medium text-xs transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <svg
                className="w-4 h-4 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
              </svg>
              <span>الإشعارات</span>
            </div>
          </Link>
        </nav>
      </div>

      {/* Bottom Utility Navigation */}
      <div
        className="border-t border-slate-100 pt-4 space-y-1.5"
        data-purpose="sidebar-footer-nav"
      >
        {/* المساعدة */}
        <Link
          href="#"
          className="flex items-center justify-between px-3.5 py-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-50 font-medium text-xs transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <svg
              className="w-4 h-4 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
            <span>المساعدة</span>
          </div>
        </Link>

        {/* تسجيل الخروج */}
        <button
          onClick={handleLogout}
          type="button"
          className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-slate-400 hover:text-red-700 hover:bg-red-50 font-medium text-xs transition-colors cursor-pointer text-right"
        >
          <div className="flex items-center gap-2.5">
            <svg
              className="w-4 h-4 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
            <span>تسجيل الخروج</span>
          </div>
        </button>
      </div>
    </aside>
  );
}
