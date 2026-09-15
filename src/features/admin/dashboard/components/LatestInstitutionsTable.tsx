import Link from "next/link";

import DashboardCard from "./DashboardCard";

import {
  getInstitutionAddress,
  getInstitutionStatusLabel,
  getInstitutionTypeLabel,
  getServiceScopeLabel,
} from "../lib/admin-dashboard.helpers";

import type {
  AdminInstitution,
  InstitutionStatus,
} from "../types/admin-dashboard.types";

interface Props {
  institutions: AdminInstitution[];
}

const statusStyles: Record<InstitutionStatus, string> = {
  approved: "bg-[#ddfaec] text-[#49aa7d]",

  needs_completion: "bg-[#fff1d8] text-[#b7852f]",

  rejected: "bg-[#ffe1e2] text-[#d44950]",

  pending_review: "bg-[#fff1d8] text-[#b7852f]",

  pending_verification: "bg-[#eef2f6] text-[#6d7887]",
};

export default function LatestInstitutionsTable({ institutions }: Props) {
  return (
    <DashboardCard className="overflow-hidden p-5 sm:p-6">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-bold text-brand-blue sm:text-xl">
          طلبات الاعتماد المعروضة
        </h2>

        <Link
          href="/dashboard/approval-requests"
          className="text-sm font-medium text-brand-red transition hover:text-brand-red-dark"
        >
          عرض الكل
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[920px] border-separate border-spacing-0 text-right">
          <thead>
            <tr className="bg-[#edf6f5]">
              <TableHead first>اسم المؤسسة</TableHead>

              <TableHead>نوع المؤسسة</TableHead>

              <TableHead>رقم التعريف</TableHead>

              <TableHead>نطاق الخدمة</TableHead>

              <TableHead>العنوان</TableHead>

              <TableHead last>حالة المؤسسة</TableHead>
            </tr>
          </thead>

          <tbody>
            {institutions.map((institution) => (
              <tr key={institution.id} className="group">
                <TableCell>
                  <Link
                    href={`/dashboard/approval-requests/${institution.id}`}
                    className="font-bold text-brand-blue transition group-hover:text-brand-red"
                  >
                    {institution.institution_name}
                  </Link>
                </TableCell>

                <TableCell>
                  {getInstitutionTypeLabel(institution.institution_type)}
                </TableCell>

                <TableCell>
                  <span dir="ltr">{institution.license_number || "—"}</span>
                </TableCell>

                <TableCell>
                  {getServiceScopeLabel(institution.service_scope)}
                </TableCell>

                <TableCell>{getInstitutionAddress(institution)}</TableCell>

                <TableCell>
                  <span
                    className={`
                        inline-flex rounded-full
                        px-3 py-1
                        text-[11px] font-medium
                        ${statusStyles[institution.status]}
                      `}
                  >
                    {getInstitutionStatusLabel(institution.status)}
                  </span>
                </TableCell>
              </tr>
            ))}

            {!institutions.length && (
              <tr>
                <td
                  colSpan={6}
                  className="py-12 text-center text-sm text-gray-400"
                >
                  لا توجد طلبات اعتماد حالياً.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </DashboardCard>
  );
}

function TableHead({
  children,
  first,
  last,
}: {
  children: React.ReactNode;
  first?: boolean;
  last?: boolean;
}) {
  return (
    <th
      className={`
        px-4 py-3
        text-xs font-bold text-brand-blue

        ${first ? "rounded-r-xl" : ""}
        ${last ? "rounded-l-xl" : ""}
      `}
    >
      {children}
    </th>
  );
}

function TableCell({ children }: { children: React.ReactNode }) {
  return (
    <td className="border-b border-[#eee8e4] px-4 py-4 text-xs text-[#536273]">
      {children}
    </td>
  );
}
