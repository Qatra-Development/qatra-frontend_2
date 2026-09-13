import Link from "next/link";

import { Building2, SearchX } from "lucide-react";

import {
  getInstitutionTypeLabel,
  getServiceScopeLabel,
} from "../lib/institutions.utils";

import type {
  AdminInstitution,
  InstitutionsTab,
} from "../types/institutions.types";

interface Props {
  institutions: AdminInstitution[];

  activeTab: InstitutionsTab;

  hasFilters: boolean;
}

export default function InstitutionsTable({
  institutions,
  activeTab,
  hasFilters,
}: Props) {
  if (!institutions.length) {
    return (
      <InstitutionsEmptyState activeTab={activeTab} hasFilters={hasFilters} />
    );
  }

  return (
    <div className="overflow-x-auto">
      <table
        dir="rtl"
        className="
          w-full
          min-w-[850px]
          border-separate
          border-spacing-0
          text-right
        "
      >
        <thead>
          <tr className="bg-[#edf6f5]">
            <TableHeading first>اسم المؤسسة</TableHeading>

            <TableHeading>نوع المؤسسة</TableHeading>

            <TableHeading>رقم التعريف</TableHeading>

            <TableHeading>نطاق الخدمة</TableHeading>

            <TableHeading last>عرض المؤسسة</TableHeading>
          </tr>
        </thead>

        <tbody>
          {institutions.map((institution) => (
            <tr
              key={institution.id}
              className="
                  group
                  transition-colors
                  hover:bg-[#fdfdfd]
                "
            >
              <TableCell>
                <div className="flex items-center gap-2.5">
                  <div
                    className="
                        flex h-8 w-8
                        shrink-0
                        items-center
                        justify-center
                        rounded-lg
                        bg-[#fff1f3]
                        text-brand-red
                      "
                  >
                    <Building2 className="h-4 w-4" strokeWidth={1.6} />
                  </div>

                  <Link
                    href={`/dashboard/institutions/${institution.id}`}
                    className="
                        font-bold
                        text-brand-blue
                        transition-colors

                        group-hover:text-brand-red
                      "
                  >
                    {institution.institution_name}
                  </Link>
                </div>
              </TableCell>

              <TableCell>
                {getInstitutionTypeLabel(institution.institution_type)}
              </TableCell>

              <TableCell>
                <bdi dir="ltr" className="font-medium">
                  {institution.license_number}
                </bdi>
              </TableCell>

              <TableCell>
                {getServiceScopeLabel(institution.service_scope)}
              </TableCell>

              <TableCell>
                <Link
                  href={`/dashboard/institutions/${institution.id}`}
                  className="
                      inline-flex
                      h-8 min-w-[58px]
                      items-center
                      justify-center
                      rounded-md
                      border
                      border-brand-red
                      px-3
                      text-[11px]
                      font-semibold
                      text-brand-red
                      transition-all

                      hover:bg-brand-red
                      hover:text-white

                      active:scale-[0.97]
                    "
                >
                  عرض
                </Link>
              </TableCell>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TableHeading({
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
        h-11
        px-5
        text-xs
        font-bold
        text-brand-blue

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
    <td
      className="
        border-b
        border-[#ebe8e5]
        px-5 py-4
        text-xs
        text-[#536273]
      "
    >
      {children}
    </td>
  );
}

function InstitutionsEmptyState({
  activeTab,
  hasFilters,
}: {
  activeTab: InstitutionsTab;
  hasFilters: boolean;
}) {
  let title: string;
  let description: string;

  if (hasFilters) {
    title = "لا توجد نتائج";

    description = "لم نجد مؤسسات تطابق البحث أو نطاق الخدمة المحدد.";
  } else if (activeTab === "removed") {
    title = "لا توجد مؤسسات في السجل";

    description = "لا توجد مؤسسات مزالة مسجلة في الوقت الحالي.";
  } else {
    title = "لا توجد مؤسسات معتمدة";

    description = "لم يتم اعتماد أي مؤسسة صحية حتى الآن.";
  }

  return (
    <div
      className="
        flex min-h-[300px]
        flex-col
        items-center
        justify-center
        px-6
        text-center
      "
    >
      <div
        className="
          flex h-14 w-14
          items-center
          justify-center
          rounded-2xl
          bg-[#fff2f3]
          text-brand-red
        "
      >
        <SearchX className="h-6 w-6" strokeWidth={1.7} />
      </div>

      <h3
        className="
          mt-4
          text-base
          font-bold
          text-brand-blue
        "
      >
        {title}
      </h3>

      <p
        className="
          mt-2
          max-w-sm
          text-sm
          leading-6
          text-[#8c95a1]
        "
      >
        {description}
      </p>
    </div>
  );
}
