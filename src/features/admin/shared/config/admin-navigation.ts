import {
  Bell,
  Building2,
  ChartNoAxesCombined,
  FileCheck2,
  HeartHandshake,
  Hospital,
  LayoutDashboard,
  Megaphone,
  UserRound,
  UsersRound,
  type LucideIcon,
} from "lucide-react";

export interface AdminNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  {
    label: "لوحة التحكم",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "طلبات الاعتماد",
    href: "/dashboard/approval-requests",
    icon: FileCheck2,
  },
  {
    label: "المؤسسات",
    href: "/dashboard/institutions",
    icon: Building2,
  },
  {
    label: "بنوك الدم",
    href: "/dashboard/blood-banks",
    icon: Hospital,
  },
  {
    label: "طلبات الدم",
    href: "/dashboard/blood-requests",
    icon: HeartHandshake,
  },
  {
    label: "المتبرعون",
    href: "/dashboard/donors",
    icon: UsersRound,
  },
  {
    label: "حملات التبرع",
    href: "/dashboard/campaigns",
    icon: Megaphone,
  },
  {
    label: "الاحصائيات",
    href: "/dashboard/statistics",
    icon: ChartNoAxesCombined,
  },
  {
    label: "الملف الشخصي",
    href: "/dashboard/profile",
    icon: UserRound,
  },
  {
    label: "الإشعارات",
    href: "/dashboard/notifications",
    icon: Bell,
  },
];

export function isAdminRouteActive(pathname: string, href: string): boolean {
  if (href === "/dashboard") {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function getCurrentAdminRoute(pathname: string) {
  return (
    [...ADMIN_NAV_ITEMS]
      .sort((a, b) => b.href.length - a.href.length)
      .find((item) => isAdminRouteActive(pathname, item.href)) ??
    ADMIN_NAV_ITEMS[0]
  );
}
