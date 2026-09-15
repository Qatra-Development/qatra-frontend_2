import { Check } from "lucide-react";

import { REVIEW_STEPS } from "../config/review.config";

import type { ReviewStepId } from "../types/review.types";

interface Props {
  currentStep: ReviewStepId;
}

export default function ReviewStepper({ currentStep }: Props) {
  return (
    <div
      dir="rtl"
      className="
        border-b
        border-[var(--admin-border)]
        px-4
        pb-5
        sm:px-6
      "
    >
      <div
        className="
          grid
          grid-cols-4
          gap-3
        "
      >
        {REVIEW_STEPS.map((step, index) => {
          const completed = currentStep > step.id;

          const active = currentStep === step.id;

          return (
            <div
              key={step.id}
              className="
                  relative
                  flex
                  min-w-0
                  flex-col
                  items-center
                "
            >
              {index < REVIEW_STEPS.length - 1 && (
                <div
                  className={`
                      absolute
                      top-[15px]
                      right-[calc(50%+24px)]
                      h-px
                      w-[calc(100%-48px)]
                      ${
                        completed
                          ? "bg-[var(--admin-danger)]"
                          : "bg-[var(--admin-border)]"
                      }
                    `}
                />
              )}

              <div
                className={`
                    relative z-10
                    flex h-8 w-8
                    items-center
                    justify-center
                    rounded-full
                    text-[11px]
                    font-bold
                    transition-colors

                    ${
                      completed || active
                        ? `
                          bg-[var(--admin-danger)]
                          text-white
                        `
                        : `
                          bg-[#f2f3f5]
                          text-[#b7bdc5]
                        `
                    }
                  `}
              >
                {completed ? <Check className="h-4 w-4" /> : step.id}
              </div>

              <span
                className={`
                    mt-2
                    text-center
                    text-[11px]
                    font-semibold

                    ${
                      active || completed
                        ? "text-[var(--admin-danger)]"
                        : "text-[#b8bec6]"
                    }
                  `}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
