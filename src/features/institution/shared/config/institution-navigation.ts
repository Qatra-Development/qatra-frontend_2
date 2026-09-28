import {
  Bell,
  Building2,
  ClipboardList,
  History,
  LayoutDashboard,
  UserRound,
  type LucideIcon,
} from "lucide-react";

export interface InstitutionNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const INSTITUTION_NAV_ITEMS: InstitutionNavItem[] = [
  {
    label: "لوحة التحكم",

    href: "/institution/dashboard",

    icon: LayoutDashboard,
  },

  {
    label: "طلباتي",

    href: "/institution/requests",

    icon: ClipboardList,
  },

  {
    label: "بيانات المؤسسة",

    href: "/institution/details",

    icon: Building2,
  },

  {
    label: "الملف الشخصي",

    href: "/institution/profile",

    icon: UserRound,
  },

  {
    label: "سجل نشاط المؤسسة",

    href: "/institution/activity",

    icon: History,
  },

  {
    label: "الإشعارات",

    href: "/institution/notifications",

    icon: Bell,
  },
];

export function isInstitutionRouteActive(pathname: string, href: string) {
  if (href === "/institution/dashboard") {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function getCurrentInstitutionRoute(pathname: string) {
  return (
    [...INSTITUTION_NAV_ITEMS]
      .sort((a, b) => b.href.length - a.href.length)
      .find((item) => isInstitutionRouteActive(pathname, item.href)) ??
    INSTITUTION_NAV_ITEMS[0]
  );
}
