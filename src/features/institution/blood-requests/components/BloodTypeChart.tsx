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

const MAX_BAR_HEIGHT = 170;
const MIN_BAR_HEIGHT = 14;
const EMPTY_BAR_HEIGHT = 3;

interface Props {
  summary: BloodRequestSummary;
}

export default function BloodTypeChart({ summary }: Props) {
  const normalizedValues = normalizeBloodTypeUnits(summary.units_by_blood_type);

  const values = Object.fromEntries(
    normalizedValues.map(({ blood_type, units }) => [blood_type, units]),
  ) as Record<BloodType, number>;

  const maxUnits = Math.max(
    1,
    ...DISPLAY_ORDER.map((bloodType) => values[bloodType] ?? 0),
  );

  const getBarHeight = (units: number) => {
    if (!Number.isFinite(units) || units <= 0) {
      return EMPTY_BAR_HEIGHT;
    }

    const height = Math.round((units / maxUnits) * MAX_BAR_HEIGHT);

    return Math.max(MIN_BAR_HEIGHT, Math.min(height, MAX_BAR_HEIGHT));
  };

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
          const value = values[bloodType] ?? 0;

          const height = getBarHeight(value);

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
                  height: `${height}px`,
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
