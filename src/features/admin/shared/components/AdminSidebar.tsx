"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { CircleHelp, Droplet, LogOut } from "lucide-react";
import { useState } from "react";

import {
  ADMIN_NAV_ITEMS,
  isAdminRouteActive,
} from "../config/admin-navigation";
import { endAuthenticatedSession } from "@/src/features/auth/client/session";
import Image from "next/image";

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) return;

    try {
      setIsLoggingOut(true);

      await endAuthenticatedSession();

      router.replace("/login");
      router.refresh();
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <aside
      dir="rtl"
      className="
        fixed inset-y-0 right-0 z-40
        hidden w-[248px] flex-col
        border-l border-gray-100 bg-white
        px-5 py-7
        lg:flex
      "
    >
      <Link href="/dashboard" className="mb-10 flex items-center gap-2 px-3">
        <Image
          className="w-8 text-brand-red"
          src={"/img/logo.png"}
          width={600}
          height={600}
          alt="logo"
        />

        <span className="text-xl font-bold text-brand-blue">قطرة</span>
      </Link>

      <nav className="space-y-1">
        {ADMIN_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = isAdminRouteActive(pathname, item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                group flex h-11 items-center gap-3
                rounded-xl px-4 text-sm
                transition-all duration-200

                ${
                  active
                    ? "bg-[#fdf0f2] font-semibold text-brand-red"
                    : "text-[#a9b2bf] hover:bg-[#fff6f7] hover:text-brand-red"
                }
              `}
            >
              <Icon
                className={`
                  h-[17px] w-[17px]
                  transition-colors
                  ${
                    active
                      ? "text-brand-red"
                      : "text-[#b7c0ca] group-hover:text-brand-red"
                  }
                `}
                strokeWidth={1.8}
              />

              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-1">
        <Link
          href="/dashboard/help"
          className="
            group flex h-11 items-center gap-3
            rounded-xl px-4 text-sm text-[#a9b2bf]
            transition-colors
            hover:bg-gray-50 hover:text-brand-blue
          "
        >
          <CircleHelp className="h-[18px] w-[18px]" strokeWidth={1.7} />

          <span>المساعدة</span>
        </Link>

        <button
          type="button"
          disabled={isLoggingOut}
          onClick={handleLogout}
          className="
            group flex h-11 w-full items-center gap-3
            rounded-xl px-4 text-sm text-[#a9b2bf]
            transition-colors
            hover:bg-[#fff6f7] hover:text-brand-red
            disabled:pointer-events-none disabled:opacity-60
          "
        >
          <LogOut className="h-[18px] w-[18px]" strokeWidth={1.7} />

          <span>{isLoggingOut ? "جاري تسجيل الخروج..." : "تسجيل الخروج"}</span>
        </button>
      </div>
    </aside>
  );
}
