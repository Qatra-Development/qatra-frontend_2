import Link from "next/link";

import DashboardCard from "./DashboardCard";

import {
  getInstitutionStatusLabel,
  getInstitutionTypeLabel,
} from "../lib/admin-dashboard.helpers";

import type { AdminInstitution } from "../types/admin-dashboard.types";

interface LatestReviewCardProps {
  institution: AdminInstitution | null;
}

export default function LatestReviewCard({
  institution,
}: LatestReviewCardProps) {
  if (!institution) {
    return (
      <DashboardCard className="h-full p-5 sm:p-6">
        <h2 className="text-lg font-bold text-brand-blue">طلب قيد المراجعة</h2>

        <div className="flex min-h-[260px] items-center justify-center text-sm text-gray-400">
          لا توجد طلبات حالياً
        </div>
      </DashboardCard>
    );
  }

  return (
    <DashboardCard className="h-full p-5 sm:p-6">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-bold text-brand-blue">طلب قيد المراجعة</h2>

        <span className="rounded-full bg-[#fff1d8] px-3 py-1 text-[11px] font-medium text-[#b7852f]">
          {getInstitutionStatusLabel(institution.status)}
        </span>
      </div>

      <div className="divide-y divide-gray-100">
        <InfoRow label="الاسم" value={institution.institution_name} />

        <InfoRow
          label="نوع المؤسسة"
          value={getInstitutionTypeLabel(institution.institution_type)}
        />

        <InfoRow
          label="رقم التعريف"
          value={institution.license_number || "—"}
          ltr
        />

        <InfoRow
          label="حالة الطلب"
          value={getInstitutionStatusLabel(institution.status)}
        />
      </div>

      <Link
        href={`/dashboard/approval-requests/${institution.id}`}
        className="
          mt-7 flex h-11 w-full
          items-center justify-center
          rounded-lg bg-brand-red
          text-sm font-bold text-white
          transition-colors
          hover:bg-brand-red-dark
        "
      >
        عرض بيانات المؤسسة
      </Link>
    </DashboardCard>
  );
}

function InfoRow({
  label,
  value,
  ltr = false,
}: {
  label: string;
  value: string;
  ltr?: boolean;
}) {
  return (
    <div className="flex min-h-12 items-center justify-between gap-4 py-3">
      <span className="text-xs text-gray-400">{label}</span>

      <span
        dir={ltr ? "ltr" : undefined}
        className="text-sm font-semibold text-brand-blue"
      >
        {value}
      </span>
    </div>
  );
}
