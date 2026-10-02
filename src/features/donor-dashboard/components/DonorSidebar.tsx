"use client";

import Link from "next/link";

import {
  Bell,
  CircleHelp,
  Home,
  LogOut,
  Megaphone,
  UserRound,
  ChartNoAxesColumnIncreasing,
} from "lucide-react";

import { usePathname } from "next/navigation";
import { useLogout } from "@/src/features/auth/hooks/use-logout";
import Image from "next/image";

const navigation = [
  {
    label: "لوحة التحكم",
    href: "/donor/dashboard",
    icon: Home,
  },

  {
    label: "نداءات التبرع",
    href: "/donor/calls",
    icon: Megaphone,
  },

  {
    label: "سجل تبرعاتي",
    href: "/donor/history",
    icon: ChartNoAxesColumnIncreasing,
  },

  {
    label: "الملف الشخصي",
    href: "#",
    icon: UserRound,
  },

  {
    label: "الإشعارات",
    href: "/donor/notifications",
    icon: Bell,
  },
];

export default function DonorSidebar() {
  const pathname = usePathname();
  const { handleLogout, isLoggingOut } = useLogout();

  return (
    <aside
      className="
        fixed inset-y-0 right-0
        z-40 hidden
        w-[260px]
        border-l
        border-[#edf0f1]
        bg-white
        lg:flex
        lg:flex-col
      "
    >
      <div
        className="
          flex h-[105px]
          items-center
          px-8
        "
      >
        <Link
          href="/donor/dashboard"
          className="
            flex items-center
            gap-2
          "
        >
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
        </Link>
      </div>

      <nav
        className="
          flex-1
          px-4 pt-2
        "
      >
        <div className="space-y-2">
          {navigation.map(({ label, href, icon: Icon }) => {
            const active =
              href === "/donor/dashboard"
                ? pathname === "/donor/dashboard"
                : pathname.startsWith(href);

            return (
              <Link
                key={label}
                href={href}
                className={`
                    flex h-[52px]
                    items-center
                    gap-4
                    rounded-2xl
                    px-5
                    text-sm
                    font-semibold
                    transition
                    ${
                      active
                        ? "bg-[#fcedf0] text-[#ad1e38]"
                        : "text-[#b1bbc0] hover:bg-slate-50 hover:text-[#6b7980]"
                    }
                  `}
              >
                <Icon className="h-[18px] w-[18px]" strokeWidth={1.7} />

                {label}
              </Link>
            );
          })}
        </div>
      </nav>

      <div
        className="
          space-y-2
          px-4 pb-8
        "
      >
        <button
          type="button"
          className="
            flex h-[50px]
            w-full items-center
            gap-4 rounded-2xl
            px-5 text-sm
            font-semibold
            text-[#aab4b9]
          "
        >
          <CircleHelp className="h-[18px] w-[18px]" />
          المساعدة
        </button>

        <button
          type="button"
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="
            flex h-[50px]
            w-full items-center
            gap-4 rounded-2xl
            px-5 text-sm
            font-semibold
            text-[#aab4b9]
            disabled:cursor-wait disabled:opacity-60
          "
        >
          <LogOut className="h-[18px] w-[18px]" />
          {isLoggingOut ? "جاري تسجيل الخروج..." : "تسجيل الخروج"}
        </button>
      </div>
    </aside>
  );
}
