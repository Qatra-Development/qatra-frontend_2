import Link from "next/link";

import { Building2 } from "lucide-react";

import {
  formatSubmissionDate,
  getGovernorateLabel,
  getInstitutionTypeLabel,
} from "../lib/approval-requests.utils";

import type { ApprovalInstitution } from "../types/approval-requests.types";

interface ApprovalRequestCardProps {
  institution: ApprovalInstitution;
}

export default function ApprovalRequestCard({
  institution,
}: ApprovalRequestCardProps) {
  const isRejected = institution.status === "rejected";

  return (
    <article
      dir="rtl"
      className="
        flex flex-col
        gap-5
        rounded-2xl
        border border-[#e8eaee]
        bg-white
        px-4 py-4
        transition-all
        duration-200

        hover:border-[#dedfe3]
        hover:shadow-[0_8px_24px_rgba(20,32,50,0.06)]

        sm:flex-row
        sm:items-center
        sm:justify-between
        sm:px-5
      "
    >
      <div className="flex min-w-0 items-start gap-4">
        <div
          className="
            flex h-12 w-12
            shrink-0
            items-center justify-center
            rounded-xl
            bg-[#fff0f2]
            text-brand-red
          "
        >
          <Building2 className="h-5 w-5" strokeWidth={1.7} />
        </div>

        <div className="min-w-0">
          <h3
            className="
              truncate
              text-sm
              font-bold
              text-brand-blue

              sm:text-[15px]
            "
          >
            {institution.institution_name}
          </h3>

          <div
            className="
              mt-1.5
              flex flex-wrap
              items-center
              gap-x-1.5 gap-y-1
              text-[11px]
              text-[#8c95a1]
            "
          >
            <span>{getInstitutionTypeLabel(institution.institution_type)}</span>

            <span aria-hidden="true">·</span>

            <span>{getGovernorateLabel(institution.governorate)}</span>

            <span aria-hidden="true">·</span>

            <span>
              ترخيص <bdi>{institution.license_number}</bdi>
            </span>
          </div>

          <p
            className="
              mt-1.5
              text-[10px]
              text-[#a7aeb7]
            "
          >
            أُرسل {formatSubmissionDate(institution.created_at)}
          </p>
        </div>
      </div>

      <div
        className="
          flex shrink-0
          items-center
          justify-between
          gap-4

          sm:justify-end
        "
      >
        <span
          className={`
            inline-flex
            items-center
            gap-1.5
            rounded-full
            px-3 py-1.5
            text-[11px]
            font-semibold

            ${
              isRejected
                ? "bg-[#fff0f1] text-[#cf3446]"
                : "bg-[#fff7dd] text-[#c18a17]"
            }
          `}
        >
          <span
            className={`
              h-1.5 w-1.5
              rounded-full

              ${isRejected ? "bg-[#cf3446]" : "bg-[#e3a92e]"}
            `}
          />

          {isRejected ? "مرفوضة" : "قيد المراجعة"}
        </span>

        <Link
          href={`/dashboard/approval-requests/${institution.id}`}
          className="
            inline-flex
            h-10
            min-w-[108px]
            items-center
            justify-center
            rounded-lg
            bg-brand-red
            px-5
            text-xs
            font-bold
            text-white
            shadow-sm
            transition-all

            hover:bg-brand-red-dark
            hover:shadow-md

            active:scale-[0.98]
          "
        >
          عرض الطلب
        </Link>
      </div>
    </article>
  );
}
