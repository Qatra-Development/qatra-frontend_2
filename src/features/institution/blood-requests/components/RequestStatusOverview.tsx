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
  return (
    <div
      className="
        institution-card
        h-full p-5
        sm:p-6
      "
    >
      <h2
        className="
          text-lg
          font-bold
          text-[var(--admin-text-primary)]
        "
      >
        حالة طلبات المؤسسة
      </h2>

      <div className="mt-6 space-y-5">
        {REQUEST_STATUS_OVERVIEW.map((item) => {
          const value = summary.status_counts?.[item.status] ?? 0;

          return (
            <div
              key={item.status}
              className="
                  grid
                  grid-cols-[110px_minmax(70px,1fr)_32px]
                  items-center
                  gap-4
                "
            >
              <span
                className="
                    text-xs
                    text-[var(--admin-text-secondary)]
                  "
              >
                {item.label}
              </span>

              <div
                className="
                    flex
                    justify-end
                  "
              >
                <span
                  className={`
                      h-[3px]
                      rounded-full
                      ${item.className}
                    `}
                  style={{
                    width: `${Math.max(20, Math.min(value * 7, 100))}%`,
                  }}
                />
              </div>

              <strong
                className="
                    text-xs
                    text-[var(--admin-text-primary)]
                  "
              >
                {value}
              </strong>
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
