"use client";

import { useEffect, useState } from "react";
import { AUTH_USER_STORAGE_KEY } from "@/src/lib/auth/constants";

export interface HeaderProps {
  userName?: string;
  userRole?: string;
}

export default function Header({
  userName: propUserName,
  userRole: propUserRole,
}: HeaderProps) {
  const [userName, setUserName] = useState<string>(propUserName || "أحمد محمد");
  const [userRole, setUserRole] = useState<string>(propUserRole || "مدير النظام");

  useEffect(() => {
    if (propUserName) {
      setUserName(propUserName);
      if (propUserRole) setUserRole(propUserRole);
      return;
    }

    try {
      const stored = localStorage.getItem(AUTH_USER_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.user?.name) {
          setUserName(parsed.user.name);
        }
        if (parsed?.user?.account_type === "health_institution" || parsed?.institution) {
          setUserRole("الممثل الرسمي");
        }
      }
    } catch {
      // Ignore parse error
    }
  }, [propUserName, propUserRole]);
  return (
    <header
      className="flex items-center justify-between pb-6"
      data-purpose="top-navigation-bar"
    >
      {/* Breadcrumbs (Right in RTL) */}
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-1.5 text-xs text-slate-400 font-medium"
      >
        <span className="hover:text-slate-600 cursor-pointer">قطرة</span>
        <span className="text-slate-300">&gt;</span>
        <span className="text-slate-600 font-semibold">طلبات الاعتماد</span>
      </nav>

      {/* User Profile & Notifications (Left in RTL) */}
      <div className="flex items-center gap-3">
        <button
          aria-label="الإشعارات"
          className="relative w-8 h-8 rounded-full bg-white flex items-center justify-center text-slate-500 shadow-sm border border-slate-200 hover:border-slate-300 hover:text-slate-700 hover:bg-slate-50 transition-all cursor-pointer"
          type="button"
        >
          <svg
            className="w-4 h-4"
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
          <span className="absolute top-1 left-1.5 w-2 h-2 rounded-full bg-[#83141f]" />
        </button>

        <span className="hidden h-8 w-px bg-[#e5e9eb] sm:block" />

        <div className="flex items-center bg-white px-3.5 py-1.5 rounded-full shadow-sm border border-slate-200 cursor-pointer hover:border-slate-300 transition-all">
          <svg
            className="w-4 h-4 text-slate-400 ml-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M19 9l-7 7-7-7"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
          </svg>
          <div className="text-right ml-3">
            <div className="text-xs font-bold text-slate-800 leading-tight">
              {userName}
            </div>
            <div className="text-[10px] text-slate-400">{userRole}</div>
          </div>
          <div className="w-8 h-8 rounded-full overflow-hidden bg-[#faecee] border border-slate-100 flex-shrink-0 flex items-center justify-center text-[#83141f] font-bold text-xs">
            {userName ? userName.slice(0, 1) : "ق"}
          </div>
        </div>
      </div>
    </header>
  );
}
