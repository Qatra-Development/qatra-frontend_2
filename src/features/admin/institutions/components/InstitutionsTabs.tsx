"use client";

import { INSTITUTIONS_TABS } from "../config/institutions.config";

import type { InstitutionsTab } from "../types/institutions.types";

interface Props {
  activeTab: InstitutionsTab;

  counts: Record<InstitutionsTab, number>;

  onChange: (value: InstitutionsTab) => void;
}

export default function InstitutionsTabs({
  activeTab,
  counts,
  onChange,
}: Props) {
  return (
    <div
      role="tablist"
      aria-label="قائمة المؤسسات"
      className="
        inline-flex
        items-center
        rounded-full
        bg-[#f4f4f5]
        p-1
      "
    >
      {INSTITUTIONS_TABS.map((tab) => {
        const active = activeTab === tab.value;

        return (
          <button
            key={tab.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(tab.value)}
            className={`
                flex h-9
                items-center
                justify-center
                gap-2
                rounded-full
                px-5
                text-xs
                font-semibold
                transition-all
                duration-200

                ${
                  active
                    ? `
                      bg-white
                      text-brand-red
                      shadow-sm
                    `
                    : `
                      text-[#8c95a1]
                      hover:text-brand-blue
                    `
                }
              `}
          >
            <span>{tab.label}</span>

            <span
              className={`
                  flex h-5 min-w-5
                  items-center
                  justify-center
                  rounded-full
                  px-1.5
                  text-[10px]

                  ${
                    active
                      ? "bg-[#fff0f2] text-brand-red"
                      : "bg-[#e9eaec] text-[#7d8793]"
                  }
                `}
            >
              {counts[tab.value]}
            </span>
          </button>
        );
      })}
    </div>
  );
}
