"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  ActivityChartIcon,
  Bell,
  ChevronDown,
  CircleHelp,
  House,
  InstitutionBuildingIcon,
  LogOut,
  MedicalBriefcaseIcon,
  Megaphone,
  OutlinedPlusIcon,
  UserRoundCheck,
  UsersRound,
  UserRound,
} from "./icons/HospitalDashboardIcons";
import { clearAuthenticatedUser } from "@/src/features/auth/client/user-storage";
import { logout } from "@/src/features/auth/services/auth.service";

const navigation = [
  { label: "لوحة التحكم", href: "/HospitalDashboard", icon: House },
  { label: "إدارة المخزون", href: "/HospitalDashboard/inventory", icon: MedicalBriefcaseIcon },
  { label: "الطلبات الواردة", href: "/HospitalDashboard/requests", icon: OutlinedPlusIcon },
  { label: "إدارة التبرعات", href: "#", icon: MedicalBriefcaseIcon, expandable: true },
  { label: "بيانات المؤسسة", href: "/HospitalPath", icon: InstitutionBuildingIcon },
  { label: "الملف الشخصي", href: "#", icon: UserRound },
  { label: "سجل نشاط المؤسسة", href: "#", icon: ActivityChartIcon },
  { label: "الإشعارات", href: "#", icon: Bell },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const voluntaryDonationsPath = "/HospitalDashboard/donations/voluntary";
  const donationCallsPath = "/HospitalDashboard/donations/calls";
  const upcomingDonorsPath = "/HospitalDashboard/donations/upcoming";
  const [donationsOpen, setDonationsOpen] = useState(pathname.startsWith("/HospitalDashboard/donations"));

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      clearAuthenticatedUser();
      router.replace("/login");
    }
  };

  return (
    <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-l border-slate-200/80 bg-white px-4 py-6 lg:flex">
      <Link href="/HospitalDashboard" className="mb-8 flex items-center gap-2 px-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-lg">
          <Image
            src="/img/logo.png"
            alt="قطرة"
            width={32}
            height={32}
            className="h-full w-full object-contain"
            priority
          />
        </span>
        <span className="text-xl font-bold tracking-tight text-slate-800">قطرة</span>
      </Link>

      <nav className="space-y-1.5" aria-label="القائمة الرئيسية">
        {navigation.map(({ label, href, icon: Icon, expandable }) => {
          const active = pathname === href;

          if (expandable) {
            return (
              <div key={label} className="space-y-1.5">
                <button
                  type="button"
                  onClick={() => setDonationsOpen((open) => !open)}
                  aria-expanded={donationsOpen}
                  className={`flex h-10 w-full shrink-0 items-center gap-3 rounded-full px-4 text-xs transition-colors ${
                    donationsOpen
                      ? "bg-[#fbebef] font-bold text-[#a61f36]"
                      : "font-medium text-[#b8c1c7] hover:bg-slate-50 hover:text-slate-700"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" strokeWidth={1.8} />
                  <span className="min-w-0 flex-1 truncate text-right">{label}</span>
                  <ChevronDown
                    className={`h-3.5 w-3.5 shrink-0 transition-transform ${donationsOpen ? "rotate-180" : ""}`}
                    strokeWidth={2}
                  />
                </button>

                {donationsOpen && (
                  <div className="space-y-1 pr-3">
                    <Link
                      href={voluntaryDonationsPath}
                      className={`flex h-10 w-full items-center gap-3 rounded-full px-4 text-xs ${
                        pathname === voluntaryDonationsPath
                          ? "bg-[#fbebef] font-bold text-[#a61f36]"
                          : "font-medium text-[#b8c1c7] hover:bg-slate-50 hover:text-slate-700"
                      }`}
                    >
                      <UsersRound className="h-4 w-4 shrink-0" strokeWidth={1.8} />
                      طلبات التبرع الطوعي
                    </Link>
                    <Link
                      href={donationCallsPath}
                      className={`flex h-10 w-full items-center gap-3 rounded-full px-4 text-xs ${
                        pathname === donationCallsPath
                          ? "bg-[#fbebef] font-bold text-[#a61f36]"
                          : "font-medium text-[#b8c1c7] hover:bg-slate-50 hover:text-slate-700"
                      }`}
                    >
                      <Megaphone className="h-4 w-4 shrink-0" strokeWidth={1.8} />
                      نداءات التبرع
                    </Link>
                    <Link
                      href={upcomingDonorsPath}
                      className={`flex h-10 w-full items-center gap-3 rounded-full px-4 text-xs ${
                        pathname === upcomingDonorsPath
                          ? "bg-[#fbebef] font-bold text-[#a61f36]"
                          : "font-medium text-[#b8c1c7] hover:bg-slate-50 hover:text-slate-700"
                      }`}
                    >
                      <UserRoundCheck className="h-4 w-4 shrink-0" strokeWidth={1.8} />
                      المتبرعون القادمون
                    </Link>
                  </div>
                )}
              </div>
            );
          }

          return (
          <Link
            key={label}
            href={href}
            className={`flex h-10 w-full shrink-0 items-center gap-3 rounded-full px-4 text-xs transition-colors ${
              active
                ? "bg-[#fbebef] font-bold text-[#a61f36]"
                : "font-medium text-[#b8c1c7] hover:bg-slate-50 hover:text-slate-700"
            }`}
          >
            <Icon className="h-4 w-4 shrink-0" strokeWidth={1.8} />
            <span className="min-w-0 flex-1 truncate">{label}</span>
          </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-1 border-t border-slate-100 pt-4">
        <Link href="#" className="flex h-10 w-full items-center gap-3 rounded-full px-4 text-xs font-medium text-[#b8c1c7] hover:bg-slate-50 hover:text-slate-700">
          <CircleHelp className="h-4 w-4 shrink-0" strokeWidth={1.8} />
          المساعدة
        </Link>
        <button type="button" onClick={handleLogout} className="flex h-10 w-full cursor-pointer items-center gap-3 rounded-full px-4 text-right text-xs font-medium text-[#b8c1c7] hover:bg-red-50 hover:text-[#a61f36]">
          <LogOut className="h-4 w-4 shrink-0" strokeWidth={1.8} />
          تسجيل الخروج
        </button>
      </div>
    </aside>
  );
}
