"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, ChevronDown, ChevronLeft } from "lucide-react";

import { getCurrentAdminRoute } from "../config/admin-navigation";
import { useAdminUser } from "../hooks/useAdminUser";

const ACCOUNT_TYPE_LABELS: Record<string, string> = {
  health_authority_admin: "مدير النظام",
  health_institution: "مؤسسة صحية",
  donor: "متبرع",
};

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("");
}

export default function AdminTopbar() {
  const pathname = usePathname();
  const user = useAdminUser();

  const currentRoute = getCurrentAdminRoute(pathname);

  const name = user?.name || "أحمد محمد";

  const role =
    (user?.account_type && ACCOUNT_TYPE_LABELS[user.account_type]) ||
    "مدير النظام";

  return (
    <header
      dir="rtl"
      className="
        sticky top-0 z-30
        bg-[#f7f8fa]/90
        px-4 pt-5 pb-3
        backdrop-blur-md
        sm:px-6
        xl:px-8
      "
    >
      <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-400">قطرة</span>

          <ChevronLeft className="h-4 w-4 text-gray-300" />

          <span className="font-medium text-brand-blue">
            {currentRoute.label}
          </span>
        </div>

        <div dir="ltr" className="flex items-center gap-4">
          <Link
            href="/dashboard/notifications"
            aria-label="الإشعارات"
            className="
              flex h-10 w-10 items-center justify-center
              rounded-full border border-gray-100
              bg-white text-gray-500
              shadow-sm transition
              hover:text-brand-red
            "
          >
            <Bell className="h-[17px] w-[17px]" strokeWidth={1.8} />
          </Link>

          <Link
            href="/dashboard/profile"
            className="
              flex min-w-[190px] items-center gap-3
              rounded-full border border-gray-100
              bg-white py-1.5 pr-2 pl-4
              shadow-sm transition
              hover:shadow-md
            "
          >
            <div
              className="
                flex h-10 w-10 shrink-0
                items-center justify-center
                rounded-full bg-[#f3e6e8]
                text-sm font-bold text-brand-red
              "
            >
              {getInitials(name)}
            </div>

            <div dir="rtl" className="min-w-0 flex-1 text-right">
              <p className="truncate text-sm font-bold text-brand-blue">
                {name}
              </p>

              <p className="truncate text-[11px] text-gray-400">{role}</p>
            </div>

            <ChevronDown className="h-4 w-4 text-gray-400" />
          </Link>
        </div>
      </div>
    </header>
  );
}
