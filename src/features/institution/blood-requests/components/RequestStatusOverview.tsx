import Link from "next/link";

import { REQUEST_STATUS_OVERVIEW } from "../config/blood-request.config";

import type {
  BloodRequestDetails,
  BloodRequestSummary,
} from "../types/blood-request.types";

interface Props {
  summary: BloodRequestSummary;

  latestDraft: BloodRequestDetails | null;
}

export default function RequestStatusOverview({ summary, latestDraft }: Props) {
  const totalStatusCount =
    summary.total_requests + summary.draft_count;

  return (
    <div
      className="
        institution-card
        h-full p-5
        sm:p-6
      "
    >
      <div className="flex items-center justify-between gap-4">
        <h2
          className="
            text-lg
            font-bold
            text-[var(--admin-text-primary)]
          "
        >
          حالة طلبات المؤسسة
        </h2>

        <Link
          href="/institution/requests"
          className="
            shrink-0
            text-xs
            font-semibold
            text-[var(--admin-danger)]
            transition
            hover:opacity-80
          "
        >
          ← عرض الكل
        </Link>
      </div>

      <div className="mt-6 space-y-5">
        {REQUEST_STATUS_OVERVIEW.map((item) => {
          const value = summary.status_counts?.[item.status] ?? 0;

          const progress =
            totalStatusCount > 0 ? (value / totalStatusCount) * 100 : 0;

          return (
            <div
              key={item.status}
              className="
                  flex
                  items-center
                  gap-4
                "
            >
              <div
                className="
                    flex
                    w-[118px]
                    shrink-0
                    items-center
                    gap-2
                "
              >
                <span
                  aria-hidden="true"
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: item.color }}
                />

                <span
                  className="
                    text-xs
                    text-[var(--admin-text-secondary)]
                  "
                >
                  {item.label}
                </span>
              </div>

              <div
                aria-label={`${item.label}: ${value}`}
                className="
                    h-1.5
                    min-w-0
                    flex-1
                    overflow-hidden
                    rounded-full
                    bg-[#f0f1f2]
                  "
              >
                <span
                  className={`
                      block
                      h-full
                      rounded-full
                    `}
                  style={{
                    width: `${progress}%`,
                    backgroundColor: item.color,
                  }}
                />
              </div>

              <bdi
                dir="ltr"
                className="
                    w-8
                    shrink-0
                    text-left
                    text-xs
                    text-[var(--admin-text-primary)]
                  "
              >
                {value}
              </bdi>
            </div>
          );
        })}
      </div>

      {summary.draft_count > 0 && (
        <div
          className="
            mt-6
            rounded-xl
            border
            border-[#f1dda7]
            bg-[var(--institution-yellow-soft)]
            p-4
          "
        >
          <p
            className="
              text-xs
              font-bold
              text-[#9f741e]
            "
          >
            لديك مسودة غير مكتملة
          </p>

          {latestDraft && (
            <p
              className="
                mt-1
                text-xs
                text-[#a38444]
              "
            >
              طلب {latestDraft.units_required} وحدات{" "}
              <bdi dir="ltr">{latestDraft.blood_type}</bdi>
            </p>
          )}

          {summary.latest_draft_id && (
            <Link
              href={`/institution/requests/${summary.latest_draft_id}`}
              className="
                mt-3
                flex h-9
                items-center
                justify-center
                rounded-lg
                bg-[#ffe680]
                text-xs
                font-bold
                text-[#7e6516]
                transition

                hover:bg-[#ffdc55]
              "
            >
              أكمل الطلب ←
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
