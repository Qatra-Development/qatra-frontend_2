"use client";

import Link from "next/link";

import { CircleHelp, Droplet, LogOut } from "lucide-react";

import { usePathname, useRouter } from "next/navigation";

import { useState } from "react";

import {
  INSTITUTION_NAV_ITEMS,
  isInstitutionRouteActive,
} from "../config/institution-navigation";
import { logout } from "@/src/features/auth/services/auth.service";
import Image from "next/image";

export default function InstitutionSidebar() {
  const pathname = usePathname();

  const router = useRouter();

  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    if (loggingOut) {
      return;
    }

    try {
      setLoggingOut(true);

      await logout();

      router.replace("/login");

      router.refresh();
    } finally {
      setLoggingOut(false);
    }
  }

  return (
    <aside
      dir="rtl"
      className="
        fixed inset-y-0 right-0 z-40
        hidden w-[248px]
        flex-col
        border-l
        border-[var(--admin-border-soft)]
        bg-white
        px-5 py-7
        lg:flex
      "
    >
      <Link
        href="/institution/dashboard"
        className="
          mb-10
          flex items-center
          gap-2 px-3
        "
      >
        {/* <Droplet
          className="
            h-8 w-8
            text-[var(--admin-danger)]
          "
          strokeWidth={1.8}
        /> */}
        <Image
          src={"/img/logo.png"}
          width={800}
          height={800}
          alt="qatra-logo"
          className="w-8"
        />

        <span
          className="
            text-xl font-bold
            text-[var(--admin-text-primary)]
          "
        >
          قطرة
        </span>
      </Link>

      <nav className="space-y-1">
        {INSTITUTION_NAV_ITEMS.map((item) => {
          const Icon = item.icon;

          const active = isInstitutionRouteActive(pathname, item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                  group
                  flex h-11
                  items-center
                  gap-3
                  rounded-xl
                  px-4
                  text-sm
                  transition

                  ${
                    active
                      ? `
                        bg-[var(--admin-danger-soft)]
                        font-semibold
                        text-[var(--admin-danger)]
                      `
                      : `
                        text-[#a9b2bf]
                        hover:bg-[var(--admin-danger-soft)]
                        hover:text-[var(--admin-danger)]
                      `
                  }
                `}
            >
              <Icon
                className="
                    h-[17px]
                    w-[17px]
                  "
                strokeWidth={1.8}
              />

              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-1">
        <Link
          href="/institution/help"
          className="
            flex h-11
            items-center gap-3
            rounded-xl px-4
            text-sm
            text-[#a9b2bf]
            transition
            hover:bg-gray-50
            hover:text-[var(--admin-text-primary)]
          "
        >
          <CircleHelp className="h-[18px] w-[18px]" />
          المساعدة
        </Link>

        <button
          type="button"
          disabled={loggingOut}
          onClick={handleLogout}
          className="
            flex h-11 w-full
            items-center gap-3
            rounded-xl px-4
            text-sm
            text-[#a9b2bf]
            transition

            hover:bg-[var(--admin-danger-soft)]
            hover:text-[var(--admin-danger)]

            disabled:opacity-50
          "
        >
          <LogOut className="h-[18px] w-[18px]" />

          {loggingOut ? "جاري تسجيل الخروج..." : "تسجيل الخروج"}
        </button>
      </div>
    </aside>
  );
}
