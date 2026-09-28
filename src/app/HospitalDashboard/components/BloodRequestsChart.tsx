"use client";

import { useEffect, useState } from "react";
import { bankApi, type BloodDashboard } from "../lib/api";

export default function BloodRequestsChart() {
  const [dashboard, setDashboard] = useState<BloodDashboard | null>(null);
  useEffect(() => {
    const load = () => { void bankApi<BloodDashboard>("/dashboard").then(result => setDashboard(result.data)).catch(() => setDashboard(null)); };
    load();
    window.addEventListener("hospital:inventory-changed", load);
    return () => window.removeEventListener("hospital:inventory-changed", load);
  }, []);
  const counts = dashboard?.requests_summary;
  const total = (counts?.incoming ?? 0) + (counts?.accepted ?? 0) + (counts?.preparing ?? 0) + (counts?.ready ?? 0);
  const requestStates = [
    { label: "طلبات جديدة", value: counts?.incoming, status: "Pending", barColor: "#A97727", badgeBackground: "#F8E9CB", badgeColor: "#A97727" },
    { label: "مقبولة", value: counts?.accepted, status: "Accepted", barColor: "#438487", badgeBackground: "#EDF5F5", badgeColor: "#438487" },
    { label: "قيد التجهيز", value: counts?.preparing, status: "Preparing", barColor: "#AE1F3B", badgeBackground: "#FBECEF", badgeColor: "#AE1F3B" },
    { label: "جاهزة", value: counts?.ready, status: "Ready", barColor: "#18B982", badgeBackground: "#E9FAF4", badgeColor: "#159D70" },
  ].map(state => ({ ...state, percent: total ? (state.value ?? 0) / total * 100 : 0 }));
  return (
    <article className="min-h-[368px] rounded-[20px] bg-white px-[22px] pb-[26px] pt-[21px] shadow-[0_5px_20px_rgba(28,50,58,0.025)]">
      <header className="text-right">
        <h2 className="text-[17px] font-bold leading-6 text-[#233640]">حالة الطلبات الواردة</h2>
        <p className="mt-1 text-[12px] leading-5 text-[#A6AFB4]">تفاصيل الحالات المسجلة</p>
      </header>

      <div className="mt-[31px] space-y-[25px]">
        {requestStates.map((state) => (
          <div key={state.status}>
            <div className="flex min-h-6 items-center justify-between">
              <span className="text-[14px] font-medium text-[#263A44]">{state.label}</span>
              <div className="flex items-center gap-[9px]" dir="ltr">
                <strong className="text-[20px] font-bold leading-6 text-[#203540]">{state.value ?? "—"}</strong>
                <span
                  className="inline-flex h-6 items-center gap-[5px] rounded-full px-[10px] text-[10px] font-bold"
                  style={{ backgroundColor: state.badgeBackground, color: state.badgeColor }}
                >
                  {state.status}
                  <span className="h-[5px] w-[5px] rounded-full bg-current" />
                </span>
              </div>
            </div>
            <div className="mr-auto mt-[12px] h-[5px] w-[90%] overflow-hidden rounded-full bg-[#F1F5F5]" dir="ltr">
              <div className="h-full rounded-full" style={{ width: `${state.percent}%`, backgroundColor: state.barColor }} />
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}
