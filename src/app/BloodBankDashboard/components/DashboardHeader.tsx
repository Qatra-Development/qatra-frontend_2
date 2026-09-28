"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, UserRound } from "./icons/HospitalDashboardIcons";

const dashboardPath = "/BloodBankDashboard";
const pageNames: Record<string, string> = {
  inventory: "إدارة المخزون",
  "inventory/alerts": "تنبيهات المخزون",
  requests: "الطلبات الواردة",
  "my-requests": "طلباتي",
  donations: "إدارة التبرعات",
  "donations/voluntary": "طلبات التبرع الطوعي",
  "donations/calls": "نداءات التبرع",
  "donations/upcoming": "المتبرعون القادمون",
};

export default function DashboardHeader() {
  const pathname = usePathname();
  const segments = pathname.slice(dashboardPath.length).split("/").filter(Boolean);
  const crumbs = segments.map((_, index) => {
    const path = segments.slice(0, index + 1).join("/");
    return { label: pageNames[path] ?? segments[index], href: `${dashboardPath}/${path}` };
  });

  return (
    <header className="bg-[#f7f9fa] px-5 pt-5 lg:px-7 lg:pt-7">
      <div className="mx-auto max-w-[1240px]">
        <div className="flex items-center justify-between pb-6">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <Link href={dashboardPath} className="flex items-center gap-2 lg:hidden">
              <Image src="/img/logo.png" alt="قطرة" width={30} height={30} />
              <span className="font-bold">قطرة</span>
            </Link>
            <nav className="flex min-w-0 items-center gap-2 whitespace-nowrap text-xs text-[#7d898e]" aria-label="مسار الصفحة">
              <Link href={dashboardPath} className="hover:text-[#9e1b32]">قطرة</Link>
              <span className="text-[#aeb7bb]" aria-hidden="true" dir="ltr">‹</span>
              {crumbs.length === 0
                ? <span className="font-medium text-[#303e44]" aria-current="page">لوحة التحكم</span>
                : <Link href={dashboardPath} className="hover:text-[#9e1b32]">لوحة التحكم</Link>}
              {crumbs.map((crumb, index) => (
                <span key={crumb.href} className="flex items-center gap-2">
                  <span className="text-[#aeb7bb]" aria-hidden="true" dir="ltr">‹</span>
                  {index === crumbs.length - 1
                    ? <span className="font-medium text-[#303e44]" aria-current="page">{crumb.label}</span>
                    : crumb.href === `${dashboardPath}/donations`
                      ? <span>{crumb.label}</span>
                      : <Link href={crumb.href} className="hover:text-[#9e1b32]">{crumb.label}</Link>}
                </span>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <button
              className="relative flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50 hover:text-slate-700"
              aria-label="الإشعارات"
              type="button"
            >
              <svg
                className="h-4 w-4"
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
              <span className="absolute left-1.5 top-1 h-2 w-2 rounded-full bg-[#83141f]" />
            </button>
            <span className="hidden h-8 w-px bg-[#e5e9eb] sm:block" />
            <button className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 shadow-sm sm:flex">
              <ChevronDown className="h-4 w-4 text-[#607078]" strokeWidth={1.7} />
              <span className="mr-auto text-left">
                <span className="block text-xs font-bold text-[#26373e]">أحمد محمد</span>
                <span className="mt-0.5 block text-[10px] text-[#7f8b91]">مدير النظام</span>
              </span>
              <span className="grid h-8 w-8 place-items-center rounded-full border border-slate-100 bg-[#faecee] text-[#83141f]">
                <UserRound className="h-4 w-4" />
              </span>
            </button>
            <button className="grid h-10 w-10 place-items-center rounded-lg border border-slate-200 text-slate-500 lg:hidden" aria-label="فتح القائمة">
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>

      </div>
    </header>
  );
}
