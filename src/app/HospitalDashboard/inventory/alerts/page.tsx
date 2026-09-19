"use client";

import { useState } from "react";

const filters = [
  { id: "all", label: "كل التنبيهات", count: 12 },
  { id: "low", label: "مخزون منخفض", count: 3 },
  { id: "expiring", label: "قريبة من الانتهاء", count: 7 },
  { id: "expired", label: "منتهية الصلاحية", count: 2 },
] as const;

const alerts = [
  { id: "low", title: "مخزون منخفض", emphasis: "مخزون الدم", summary: "منخفض لبعض الفصائل، راجع المخزون والتبرعات", details: ["AB+ — 13 وحدة متاحة", "B- — 22 وحدة متاحة", "A- — 31 وحدة متاحة"] },
  { id: "expiring", title: "وحدات قريبة من انتهاء الصلاحية", emphasis: "قريب الانتهاء", summary: "7 وحدات تحتاج إلى مراجعة تواريخ الصلاحية", details: ["وحدات تحتاج إلى الاستخدام خلال 30 يومًا", "راجع تواريخ انتهاء الوحدات في إدارة المخزون"] },
  { id: "expired", title: "وحدات منتهية الصلاحية", emphasis: "انتهاء الصلاحية", summary: "وحدتان لم تعودا متاحتين للاستخدام", details: ["راجع الوحدات المنتهية واستبعدها من المخزون"] },
] as const;

export default function InventoryAlertsPage() {
  const [activeFilter, setActiveFilter] = useState<(typeof filters)[number]["id"]>("all");
  const [expanded, setExpanded] = useState<string | null>(null);
  const visibleAlerts = alerts.filter((alert) => activeFilter === "all" || alert.id === activeFilter);

  return (
    <div className="mx-auto max-w-[1240px] pt-[46px] font-['Tajawal']">
      <header className="text-right">
        <h1 className="text-[22px] font-extrabold leading-[28px] text-[#223442]">تنبيهات المخزون</h1>
        <p className="mt-[2px] text-[11px] leading-[16px] text-[#98a4aa]">راجع التنبيهات التي تحتاج إلى إجراء</p>
      </header>

      <section aria-label="ملخص تنبيهات المخزون" className="mt-[28px] grid grid-cols-2 gap-[22px] sm:grid-cols-4">
        {[filters[0], filters[3], filters[2], filters[1]].map((item) => (
          <button key={item.id} type="button" onClick={() => { setActiveFilter(item.id); setExpanded(null); }} aria-pressed={activeFilter === item.id} className={`flex h-[78px] w-full items-center justify-between rounded-[12px] border bg-white px-[16px] text-right shadow-[0_4px_11px_rgba(30,36,50,0.025)] transition hover:shadow-[0_5px_14px_rgba(30,36,50,0.07)] focus-visible:outline-2 focus-visible:outline-[#9e1b32] ${item.id === "low" ? "border-[#f2e2ca]" : item.id === "expiring" ? "border-[#f4d6ae]" : item.id === "expired" ? "border-[#f4c9d0]" : "border-[#e7edf0]"}`}>
            <strong className={`font-sans text-[23px] font-bold ${item.id === "expired" ? "text-[#b4233a]" : item.id === "expiring" || item.id === "low" ? "text-[#a87527]" : "text-[#223442]"}`}>{item.count}</strong>
            <span className="text-[12px] text-[#697982]">{item.id === "all" ? "إجمالي التنبيهات" : item.id === "expiring" ? "قريبة من انتهاء الصلاحية" : item.id === "low" ? "فصائل منخفضة" : item.label}</span>
          </button>
        ))}
      </section>

      <nav aria-label="تصفية التنبيهات" className="mt-[20px] flex flex-wrap items-center gap-[7px]">
        {filters.map((item) => (
          <button key={item.id} type="button" onClick={() => { setActiveFilter(item.id); setExpanded(null); }} aria-pressed={activeFilter === item.id} className={`rounded-full px-[12px] py-[6px] text-[10px] font-semibold transition ${activeFilter === item.id ? "bg-[#9e1b32] text-white" : "border border-[#e8ecef] bg-white text-[#8a989f] hover:border-[#d3dade]"}`}>
            {item.count} {item.label}
          </button>
        ))}
      </nav>

      <section aria-label="قائمة تنبيهات المخزون" className="mt-[18px] space-y-[23px]">
        {visibleAlerts.map((alert) => (
          <article key={alert.id} className="overflow-hidden rounded-[11px] border border-[#edf0f2] bg-white shadow-[0_2px_8px_rgba(30,36,50,0.02)]">
            <button type="button" onClick={() => setExpanded(expanded === alert.id ? null : alert.id)} aria-expanded={expanded === alert.id} className="flex min-h-[62px] w-full items-center justify-between gap-3 px-[14px] text-right">
              <span className="flex items-center gap-[8px] text-[15px] font-bold text-[#263746]"><span className="text-[18px] font-normal text-[#50626c]">{expanded === alert.id ? "−" : "+"}</span>{alert.title}</span>
              <span className="text-left text-[12px] text-[#98a4aa]"><span className="font-semibold text-[#b4233a]">{alert.emphasis}</span> {alert.summary}</span>
            </button>
            {expanded === alert.id && (
              <ul className="border-t border-[#f0f2f3] px-[24px] py-[10px] text-[11px] leading-6 text-[#65747d]">
                {alert.details.map((detail) => <li key={detail}>• {detail}</li>)}
              </ul>
            )}
          </article>
        ))}
      </section>
    </div>
  );
}
