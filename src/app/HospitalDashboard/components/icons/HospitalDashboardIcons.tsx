import type { SVGProps } from "react";

export {
  BadgeCheck,
  Bell,
  ChevronDown,
  CircleHelp,
  House,
  LogOut,
  Megaphone,
  Menu,
  MoreHorizontal,
  Plus,
  TriangleAlert,
  UserRound,
  UserRoundCheck,
  UsersRound,
} from "lucide-react";

type DashboardIconProps = {
  className?: string;
  strokeWidth?: number;
};

export function OutlinedPlusIcon({ className }: DashboardIconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M9.75 2.25h-3.5v4H2.25v3.5h4v4h3.5v-4h4v-3.5h-4v-4Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

export function MedicalBriefcaseIcon({ className }: DashboardIconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" aria-hidden="true">
      <path fill="currentColor" d="M6 2.25A1.75 1.75 0 0 0 4.25 4v.5H3A1.75 1.75 0 0 0 1.25 6.25v6A1.75 1.75 0 0 0 3 14h10a1.75 1.75 0 0 0 1.75-1.75v-6A1.75 1.75 0 0 0 13 4.5h-1.25V4A1.75 1.75 0 0 0 10 2.25H6Zm0 2.25V4c0-.14.11-.25.25-.25h3.5c.14 0 .25.11.25.25v.5H6Z" />
      <rect x="3" y="6.25" width="10" height="6" rx=".65" fill="white" />
      <path fill="currentColor" d="M8.85 7.25h-1.7v1.6h-1.6v1.7h1.6v1.6h1.7v-1.6h1.6v-1.7h-1.6v-1.6Z" />
    </svg>
  );
}

export function InstitutionBuildingIcon({ className }: DashboardIconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M6 5V3.25h4V5h2.25c.55 0 1 .45 1 1v7.25H2.75V6c0-.55.45-1 1-1H6Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M5.25 7.25h.5M7.75 7.25h.5m2.5 0h-.5m-5 2.5h.5m2 0h.5m2 0h.5m-3 3.5V12h.5v1.25" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

export function ActivityChartIcon({ className }: DashboardIconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M2.5 2.75v10.5h11M4.25 10.5l2.6-2.75 2.05 1.7 3.35-3.7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IncomingRequestsIcon({ className }: DashboardIconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M9.6 1.5H6.4v4.9H1.5v3.2h4.9v4.9h3.2V9.6h4.9V6.4H9.6V1.5Z" fill="#E7F5FA" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

export function InventoryManagementIcon({ className }: DashboardIconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M5.5 5.25V4.5c0-.69.56-1.25 1.25-1.25h2.5c.69 0 1.25.56 1.25 1.25v.75M3 5.25h10c.69 0 1.25.56 1.25 1.25v6.25C14.25 13.44 13.69 14 13 14H3c-.69 0-1.25-.56-1.25-1.25V6.5c0-.69.56-1.25 1.25-1.25Z" stroke="currentColor" strokeWidth="1.55" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 7.5v4M6 9.5h4" stroke="currentColor" strokeWidth="1.55" strokeLinecap="round" />
    </svg>
  );
}

export function IncomingRequestsStatsIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9.5" stroke="currentColor" strokeWidth="2.2" />
      <path d="M14 5.75h-4v4H6v4.5h4v4h4v-4h4v-4.5h-4v-4Z" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function NumberStepperUpIcon({ className }: DashboardIconProps) {
  return (
    <svg className={className} viewBox="0 0 8 5" fill="none" aria-hidden="true">
      <path d="M1.5 4 4 1.5 6.5 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function NumberStepperDownIcon({ className }: DashboardIconProps) {
  return (
    <svg className={className} viewBox="0 0 8 5" fill="none" aria-hidden="true">
      <path d="m1.5 1 2.5 2.5L6.5 1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
