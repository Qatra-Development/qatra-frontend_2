import { CalendarDays, Files } from "lucide-react";

import type { AdminInstitution } from "../../types/institutions.types";

import { STATUS_LABELS } from "../config/review.config";

import { formatReviewDate } from "../lib/review.utils";

import { getInstitutionTypeLabel } from "../../lib/institutions.utils";

interface Props {
  institution: AdminInstitution;
}

export default function ReviewHeader({ institution }: Props) {
  return (
    <section
      dir="rtl"
      className="
        flex flex-col
        gap-5
        lg:flex-row
        lg:items-end
        lg:justify-between
      "
    >
      <div>
        <h1 className="admin-page-title">{institution.institution_name}</h1>

        <div
          className="
            mt-2
            flex flex-wrap
            items-center
            gap-2
            text-sm
            text-[var(--admin-text-muted)]
          "
        >
          <span>{getInstitutionTypeLabel(institution.institution_type)}</span>

          <span>·</span>

          <span>رقم الترخيص:</span>

          <bdi
            dir="ltr"
            className="
              font-medium
              text-[var(--admin-text-secondary)]
            "
          >
            {institution.license_number}
          </bdi>
        </div>
      </div>

      <div
        className="
          flex flex-wrap
          items-center
          gap-2
        "
      >
        <HeaderBadge
          className="
            bg-[var(--admin-status-pending-bg)]
            text-[var(--admin-status-pending-text)]
          "
        >
          {STATUS_LABELS[institution.status] ?? institution.status}
        </HeaderBadge>

        <HeaderBadge
          className="
            bg-[#eef5ff]
            text-[#5679aa]
          "
        >
          <CalendarDays className="h-3.5 w-3.5" />

          {formatReviewDate(institution.created_at)}
        </HeaderBadge>

        <HeaderBadge
          className="
            bg-[var(--admin-status-success-bg)]
            text-[var(--admin-status-success-text)]
          "
        >
          <Files className="h-3.5 w-3.5" />
          {institution.documents.length} وثائق مرفوعة
        </HeaderBadge>
      </div>
    </section>
  );
}

function HeaderBadge({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`
        inline-flex
        items-center
        gap-1.5
        rounded-full
        px-3 py-1.5
        text-[11px]
        font-semibold
        ${className}
      `}
    >
      {children}
    </span>
  );
}
