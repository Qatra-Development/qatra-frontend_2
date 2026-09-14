import ReviewInfoSection from "../ReviewInfoSection";
import ReviewerIdentity from "../ReviewerIdentity";

import type { AdminInstitution } from "../../../types/institutions.types";

import {
  calculateReviewProgress,
  formatReviewDate,
  formatReviewDateTime,
} from "../../lib/review.utils";

import { STATUS_LABELS } from "../../config/review.config";

import { getServiceScopeLabel } from "../../../lib/institutions.utils";

interface Props {
  institution: AdminInstitution;
}

export default function RequestInformationStep({ institution }: Props) {
  const progress = calculateReviewProgress(institution.created_at);

  return (
    <div className="space-y-5">
      <div
        className="
          grid
          gap-5
          lg:grid-cols-2
        "
      >
        <ReviewInfoSection
          title="بيانات طلب الاعتماد"
          rows={[
            {
              label: "رقم طلب الاعتماد",
              value: "غير متوفر",
            },
            {
              label: "تاريخ تقديم الطلب",
              value: formatReviewDate(institution.created_at),
            },
            {
              label: "نوع الطلب",
              value: "اعتماد مؤسسة صحية",
            },
            {
              label: "المسار المختار",
              value: getServiceScopeLabel(institution.service_scope),
            },
            {
              label: "حالة الطلب",
              value: (
                <span
                  className="
                    rounded-full
                    bg-[var(--admin-status-pending-bg)]
                    px-3 py-1
                    text-[10px]
                    font-semibold
                    text-[var(--admin-status-pending-text)]
                  "
                >
                  {STATUS_LABELS[institution.status] ?? institution.status}
                </span>
              ),
            },
            {
              label: "المرحلة الحالية",
              value: "المرحلة 3 من 4",
            },
          ]}
        />

        <ReviewInfoSection
          title="سجل الإجراءات"
          rows={[
            {
              label: "تاريخ الاستلام",
              value: formatReviewDateTime(institution.created_at),
            },
            {
              label: "بدء المراجعة",
              value: institution.verified_at
                ? formatReviewDateTime(institution.verified_at)
                : "غير متوفر",
            },
            {
              label: "المراجع المسؤول",
              value: <ReviewerIdentity verifier={institution.verifier} />,
            },
            {
              label: "آخر تحديث",
              value: formatReviewDateTime(institution.updated_at),
            },
            {
              label: "ملاحظات داخلية",
              value: institution.review_notes || "لا توجد ملاحظات بعد",
            },
          ]}
        />
      </div>

      <section className="admin-section">
        <div className="admin-section-header">المدة الزمنية للمراجعة</div>

        <div
          className="
            flex flex-col
            gap-5
            px-5 py-5
            lg:flex-row
            lg:items-center
          "
        >
          <div
            className="
              flex
              shrink-0
              flex-wrap
              gap-x-8 gap-y-2
              text-xs
              text-[var(--admin-text-secondary)]
            "
          >
            <span>
              الحد الأقصى: <strong>{progress.maxDays} يومًا</strong>
            </span>

            <span>
              المتبقي: <strong>{progress.remainingDays} يومًا</strong>
            </span>
          </div>

          <div className="flex min-w-0 flex-1 items-center gap-4">
            <div
              className="
                h-2
                flex-1
                overflow-hidden
                rounded-full
                bg-[#eceef1]
              "
            >
              <div
                className="
                  h-full
                  rounded-full
                  bg-[var(--admin-danger)]
                  transition-all
                  duration-300
                "
                style={{
                  width: `${progress.percentage}%`,
                }}
              />
            </div>

            <span
              className="
                w-10
                shrink-0
                text-left
                text-xs
                font-semibold
                text-[var(--admin-danger)]
              "
            >
              {progress.percentage}%
            </span>
          </div>

          <span
            className="
              shrink-0
              text-xs
              text-[var(--admin-text-secondary)]
            "
          >
            المدة المنقضية: <strong>{progress.elapsedDays} أيام</strong>
          </span>
        </div>
      </section>
    </div>
  );
}
