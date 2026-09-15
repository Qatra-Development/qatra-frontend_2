"use client";

import { useState } from "react";
import LatestRequests from "../components/LatestRequests";

const filters = [
  { label: "قيد الاستجابة", count: 5, status: "قيد الاستجابة", dot: "bg-[#d95769]" },
  { label: "مقبول بانتظار الارسال", count: 3, status: "بانتظار الإرسال", dot: "bg-[#9aa5aa]" },
  { label: "مكتمل", count: 3, status: "مكتمل", dot: "bg-[#9aa5aa]" },
];

export default function IncomingRequestsPage() {
  const [activeFilter, setActiveFilter] = useState(filters[0].label);
  const selectedFilter = filters.find((filter) => filter.label === activeFilter) ?? filters[0];

  return (
    <div className="mx-auto max-w-[1240px]">
      <section className="mb-6">
        <h1 className="text-xl font-bold text-[#22343c]">طلبات الدم الواردة</h1>
        <p className="mt-2 text-xs text-[#8a959a]">تابع حالة الطلبات وتصنيفها حسب الأولوية</p>
      </section>

      <LatestRequests
        showHeader={false}
        incomingMode
        statusOverride={selectedFilter.status}
        toolbar={
          <div className="px-5 pt-5">
            <div className="flex flex-wrap items-center justify-center gap-1.5 border-b border-slate-100 pb-4">
              {filters.map((filter) => (
                <button
                  key={filter.label}
                  type="button"
                  onClick={() => setActiveFilter(filter.label)}
                  className={`flex h-8 items-center gap-2 rounded-full border px-4 text-[10px] font-semibold transition ${
                    activeFilter === filter.label
                      ? "border-[#f2dce1] bg-[#fff7f8] text-[#a61f36] shadow-sm"
                      : "border-transparent bg-[#f4f6f6] text-[#68777d] hover:bg-[#edf1f1]"
                  }`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${filter.dot}`} />
                  {filter.label}
                  <span className={`grid h-4 min-w-4 place-items-center rounded-full px-1 text-[8px] ${
                    activeFilter === filter.label ? "bg-[#f8dfe4] text-[#a61f36]" : "bg-[#e5e9ea] text-[#77858a]"
                  }`}>
                    {filter.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        }
      />
    </div>
  );
}
