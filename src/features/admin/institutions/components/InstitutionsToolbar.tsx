"use client";

import { ChevronDown, Search } from "lucide-react";

import { SERVICE_SCOPE_OPTIONS } from "../config/institutions.config";

import type { ServiceScopeFilter } from "../types/institutions.types";

interface Props {
  searchQuery: string;

  onSearchChange: (value: string) => void;

  serviceScope: ServiceScopeFilter;

  onServiceScopeChange: (value: ServiceScopeFilter) => void;
}

export default function InstitutionsToolbar({
  searchQuery,
  onSearchChange,
  serviceScope,
  onServiceScopeChange,
}: Props) {
  return (
    <div
      dir="rtl"
      className="
        flex w-full flex-col gap-3
        sm:w-auto sm:flex-row
        sm:items-center
      "
    >
      <div className="relative w-full sm:w-[285px]">
        <input
          type="search"
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="بحث باسم المؤسسة..."
          aria-label="بحث باسم المؤسسة"
          className="
            h-11 w-full
            rounded-xl
            border border-[#e7e9ed]
            bg-white
            pr-4 pl-11
            text-sm
            text-brand-blue
            outline-none
            transition

            placeholder:text-[#a9b0ba]

            focus:border-brand-red/40
            focus:ring-2
            focus:ring-brand-red/10
          "
        />

        <Search
          className="
            absolute
            top-1/2 left-4
            h-[17px] w-[17px]
            -translate-y-1/2
            text-[#7f8a97]
          "
          strokeWidth={1.8}
        />
      </div>

      <div className="relative w-full sm:w-[165px]">
        <select
          value={serviceScope}
          onChange={(event) =>
            onServiceScopeChange(event.target.value as ServiceScopeFilter)
          }
          aria-label="نطاق الخدمة"
          className="
            h-11 w-full
            cursor-pointer
            appearance-none
            rounded-xl
            border border-[#e7e9ed]
            bg-white
            pr-4 pl-10
            text-sm
            text-[#66717f]
            outline-none
            transition

            focus:border-brand-red/40
            focus:ring-2
            focus:ring-brand-red/10
          "
        >
          {SERVICE_SCOPE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <ChevronDown
          className="
            pointer-events-none
            absolute
            top-1/2 left-3.5
            h-4 w-4
            -translate-y-1/2
            text-[#7f8a97]
          "
          strokeWidth={1.8}
        />
      </div>
    </div>
  );
}
