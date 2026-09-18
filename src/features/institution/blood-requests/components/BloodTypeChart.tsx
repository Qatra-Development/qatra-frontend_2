import { normalizeBloodTypeUnits } from "../lib/blood-request.utils";

import type {
  BloodRequestSummary,
  BloodType,
} from "../types/blood-request.types";

const DISPLAY_ORDER: BloodType[] = [
  "AB-",
  "AB+",
  "B-",
  "B+",
  "O-",
  "O+",
  "A-",
  "A+",
];

interface Props {
  summary: BloodRequestSummary;
}

export default function BloodTypeChart({ summary }: Props) {
  const values = normalizeBloodTypeUnits(summary.units_by_blood_type);

  const max = Math.max(...Object.values(values), 1);

  return (
    <div
      className="
        institution-card
        h-full p-5
        sm:p-6
      "
    >
      <div
        className="
          flex
          items-start
          justify-between
          gap-4
        "
      >
        <div>
          <h2
            className="
              text-lg
              font-bold
              text-[var(--admin-text-primary)]
            "
          >
            الوحدات المطلوبة حسب الفصيلة
          </h2>

          <p
            className="
              mt-1
              text-xs
              text-[var(--admin-text-muted)]
            "
          >
            إجمالي ما طلبته المؤسسة خلال الأسبوع الماضي
          </p>
        </div>

        <span
          className="
            rounded-lg
            border
            border-[var(--admin-border)]
            px-3 py-1.5
            text-[11px]
            text-[var(--admin-text-muted)]
          "
        >
          آخر {summary.chart_period_days} أيام
        </span>
      </div>

      <div
        dir="ltr"
        className="
          mt-8
          grid h-[220px]
          grid-cols-8
          items-end
          gap-3
        "
      >
        {DISPLAY_ORDER.map((bloodType, index) => {
          const value = values[bloodType];

          const height =
            value === 0 ? 3 : Math.max(14, Math.round((value / max) * 170));

          const strong = index % 2 === 1;

          return (
            <div
              key={bloodType}
              className="
                  flex h-full
                  flex-col
                  items-center
                  justify-end
                "
            >
              <span
                className="
                    mb-2
                    text-[10px]
                    font-bold
                    text-[var(--admin-text-primary)]
                  "
              >
                {value}
              </span>

              <div
                className={`
                    w-full
                    max-w-[24px]
                    rounded-t-lg
                    ${
                      strong
                        ? "bg-[var(--institution-chart-primary)]"
                        : "bg-[var(--institution-chart-soft)]"
                    }
                  `}
                style={{
                  height,
                }}
              />

              <span
                className="
                    mt-3
                    text-[10px]
                    text-[var(--admin-text-muted)]
                  "
              >
                {bloodType}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
