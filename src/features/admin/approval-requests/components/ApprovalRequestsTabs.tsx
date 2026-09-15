"use client";

import { APPROVAL_REQUEST_TABS } from "../config/approval-requests.config";

import type { ApprovalRequestStatus } from "../types/approval-requests.types";

interface ApprovalRequestsTabsProps {
  activeStatus: ApprovalRequestStatus;

  counts: Record<ApprovalRequestStatus, number>;

  onChange: (status: ApprovalRequestStatus) => void;
}

export default function ApprovalRequestsTabs({
  activeStatus,
  counts,
  onChange,
}: ApprovalRequestsTabsProps) {
  return (
    <div
      dir="rtl"
      role="tablist"
      aria-label="حالة طلبات الاعتماد"
      className="
        flex items-end
        border-b border-[#e7e9ed]
      "
    >
      {APPROVAL_REQUEST_TABS.map((tab) => {
        const active = activeStatus === tab.status;

        return (
          <button
            key={tab.status}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(tab.status)}
            className={`
                relative
                flex min-w-[145px]
                items-center
                justify-center
                gap-2
                px-5 py-4
                text-sm
                transition-colors

                ${
                  active
                    ? "font-bold text-brand-red"
                    : "font-medium text-[#8c95a1] hover:text-brand-blue"
                }
              `}
          >
            <span>{tab.label}</span>

            <span
              className={`
                  flex h-6 min-w-6
                  items-center justify-center
                  rounded-full
                  px-1.5
                  text-[11px]
                  font-semibold

                  ${
                    active
                      ? "bg-[#fff0f2] text-brand-red"
                      : "bg-[#f5f6f7] text-[#8c95a1]"
                  }
                `}
            >
              {counts[tab.status]}
            </span>

            {active && (
              <span
                aria-hidden="true"
                className="
                    absolute
                    right-0 bottom-[-1px]
                    h-[2px] w-full
                    rounded-full
                    bg-brand-red
                  "
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
