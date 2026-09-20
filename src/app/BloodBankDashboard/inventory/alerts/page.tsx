"use client";

import { useState } from "react";
import CreateDonationCallDialog from "../../components/CreateDonationCallDialog";

const filters = [
  { id: "all", label: "الكل", count: 12 },
  { id: "low", label: "مخزون منخفض", count: 3 },
  { id: "expiring", label: "قريبة من الانتهاء", count: 7 },
  { id: "expired", label: "منتهية الصلاحية", count: 2 },
] as const;

const alerts = [
  { id: "low", title: "مخزون منخفض", emphasis: "مخزون الدم", summary: "منخفض لبعض الفصائل، راجع المخزون والتبرعات", details: ["AB+ — 13 وحدة متاحة", "B- — 22 وحدة متاحة", "A- — 31 وحدة متاحة"] },
  { id: "expiring", title: "وحدات قريبة من انتهاء الصلاحية", emphasis: "قريب الانتهاء", summary: "وحدات تحتاج إلى استخدام أو إجراء قريباً", details: ["وحدات تحتاج إلى الاستخدام خلال 30 يومًا", "راجع تواريخ انتهاء الوحدات في إدارة المخزون"] },
  { id: "expired", title: "وحدات منتهية الصلاحية", emphasis: "إدارة الوحدات", summary: "وحدات لم تعد صالحة للاستخدام", details: ["راجع الوحدات المنتهية واستبعدها من المخزون"] },
] as const;

const lowStocks = [
  { type: "O-", units: 5, width: "20%", color: "#d52242", status: "منخفض جداً" },
  { type: "B-", units: 8, width: "35%", color: "#f5a623", status: "منخفض" },
  { type: "A-", units: 9, width: "40%", color: "#f5a623", status: "منخفض" },
];

const expiringUnits = [
  { id: "BU-024", type: "A+", expires: "2026-09-20", status: "متبقي يومان" },
  { id: "BU-031", type: "O-", expires: "2026-09-21", status: "متبقي 3 أيام" },
  { id: "BU-045", type: "B+", expires: "2026-09-22", status: "متبقي 4 أيام" },
];

const expiredUnits = [
  { id: "BU-012", type: "AB+", expires: "2026-09-16", status: "منتهية منذ يومين" },
  { id: "BU-019", type: "O+", expires: "2026-09-13", status: "منتهية منذ 5 أيام" },
];

export default function InventoryAlertsPage() {
  const [activeFilter, setActiveFilter] = useState<(typeof filters)[number]["id"]>("all");
  const [expanded, setExpanded] = useState<Record<"low" | "expiring" | "expired", boolean>>({ low: true, expiring: true, expired: true });
  const [selectedCallType, setSelectedCallType] = useState<string | null>(null);
  const visibleAlerts = alerts.filter((alert) => activeFilter === "all" || alert.id === activeFilter);

  return (
    <div className="mx-auto max-w-[1240px] pt-[46px] font-['Tajawal']">
      <header className="text-right">
        <h1 className="text-[22px] font-extrabold leading-[28px] text-[#223442]">تنبيهات المخزون</h1>
        <p className="mt-[2px] text-[11px] leading-[16px] text-[#98a4aa]">راجع التنبيهات التي تحتاج إلى إجراء</p>
      </header>

      <section aria-label="ملخص تنبيهات المخزون" className="mt-[28px] grid grid-cols-2 gap-[22px] sm:grid-cols-4">
        {[filters[0], filters[3], filters[2], filters[1]].map((item) => (
          <button key={item.id} type="button" onClick={() => { setActiveFilter(item.id); setExpanded({ low: true, expiring: true, expired: true }); }} aria-pressed={activeFilter === item.id} className={`flex h-[78px] w-full items-center justify-between rounded-[12px] border bg-white px-[16px] text-right shadow-[0_4px_11px_rgba(30,36,50,0.025)] transition hover:shadow-[0_5px_14px_rgba(30,36,50,0.07)] focus-visible:outline-2 focus-visible:outline-[#9e1b32] ${item.id === "low" ? "border-[#f2e2ca]" : item.id === "expiring" ? "border-[#f4d6ae]" : item.id === "expired" ? "border-[#f4c9d0]" : "border-[#e7edf0]"}`}>
            <strong className={`font-sans text-[23px] font-bold ${item.id === "expired" ? "text-[#b4233a]" : item.id === "expiring" || item.id === "low" ? "text-[#a87527]" : "text-[#223442]"}`}>{item.count}</strong>
            <span className="text-[12px] text-[#697982]">{item.id === "all" ? "إجمالي التنبيهات" : item.id === "expiring" ? "قريبة من انتهاء الصلاحية" : item.id === "low" ? "فصائل منخفضة" : item.label}</span>
          </button>
        ))}
      </section>

      <nav aria-label="تصفية التنبيهات" className="mt-[20px] flex flex-wrap items-center gap-[7px]">
        {filters.map((item) => (
          <button key={item.id} type="button" onClick={() => { setActiveFilter(item.id); setExpanded({ low: true, expiring: true, expired: true }); }} aria-pressed={activeFilter === item.id} className={`rounded-full px-[12px] py-[6px] text-[10px] font-semibold transition ${activeFilter === item.id ? "bg-[#9e1b32] text-white" : "border border-[#e8ecef] bg-white text-[#8a989f] hover:border-[#d3dade]"}`}>
            {item.count} {item.label}
          </button>
        ))}
      </nav>

      <section aria-label="قائمة تنبيهات المخزون" className="mt-[18px] space-y-[18px] sm:space-y-[23px]">
        {visibleAlerts.map((alert) => (
          <article key={alert.id} className="overflow-hidden rounded-[12px] border border-[#edf0f2] bg-white shadow-[0_2px_8px_rgba(30,36,50,0.02)] sm:rounded-[18px]">
            <button type="button" onClick={() => setExpanded((current) => ({ ...current, [alert.id]: !current[alert.id] }))} aria-expanded={expanded[alert.id]} className="flex min-h-[30px] w-full items-center justify-between gap-3 px-[10px] text-right sm:min-h-[58px] sm:px-[19px]">
              <span className="flex items-center gap-[6px] whitespace-nowrap text-[10px] font-bold text-[#263746] sm:gap-[9px] sm:text-[16px]"><span className="text-[12px] font-normal text-[#6b7c87] sm:text-[18px]">{expanded[alert.id] ? "−" : "+"}</span>{alert.title}</span>
              <span className="text-left text-[7px] text-[#98a4aa] sm:text-[12px]">{alert.id === "low" ? "فصائل وصلت إلى الحد الأدنى أو اقتربت منه" : alert.id === "expiring" ? alert.summary : <><span className="font-semibold text-[#b4233a]">{alert.emphasis}</span> {alert.summary}</>}</span>
            </button>
            {expanded[alert.id] && (alert.id === "low" ? (
              <div className="mx-[10px] border-t border-[#f0f2f3] pb-[5px] pt-[3px] sm:mx-[19px] sm:pb-[12px] sm:pt-[8px]">
                {lowStocks.map((stock, index) => (
                  <div key={stock.type} className="grid min-h-[44px] grid-cols-[23px_66px_minmax(0,1fr)_76px] items-center gap-x-[6px] py-1 sm:min-h-[89px] sm:grid-cols-[45px_90px_minmax(0,1fr)_155px] sm:gap-x-[17px] sm:py-2">
                    <span dir="ltr" className="text-right font-sans text-[10px] font-bold text-[#9e1b32] sm:text-[18px]">{stock.type}</span>
                    <span className={`justify-self-start whitespace-nowrap rounded-full px-[6px] py-[3px] text-[7px] font-medium sm:px-[13px] sm:py-[7px] sm:text-[11px] ${index === 0 ? "bg-[#fff0f2] text-[#a51e35]" : "bg-[#fff8e9] text-[#a57224]"}`}>• {stock.status}</span>
                    <div className="min-w-0"><div className="mb-[3px] flex items-center justify-between gap-1 text-[6px] sm:mb-[7px] sm:gap-2 sm:text-[11px]"><span className="text-[#9aa6ae]">الحد الأدنى: {index === 0 ? 10 : index === 1 ? 12 : 15} وحدة</span><span className="whitespace-nowrap font-semibold text-[#263746]">{stock.units} وحدات متاحة</span></div><div dir="ltr" className="h-[2px] overflow-hidden rounded-full bg-[#eef3f5] sm:h-[4px]"><div className="ml-auto h-full rounded-full" style={{ width: stock.width === "20%" ? "48%" : stock.width === "35%" ? "67%" : "60%", backgroundColor: stock.color }} /></div></div>
                    <div className="justify-self-start"><CreateDonationCallDialog initialBloodType={stock.type} onOpen={() => setSelectedCallType(stock.type)} triggerLabel="إنشاء نداء تبرع" triggerClassName={`flex items-center gap-[2px] whitespace-nowrap rounded-[6px] border px-[5px] py-[5px] text-[7px] font-bold [&_svg]:h-[8px] [&_svg]:w-[8px] sm:gap-1 sm:rounded-[11px] sm:px-[17px] sm:py-[10px] sm:text-[14px] sm:[&_svg]:h-4 sm:[&_svg]:w-4 ${selectedCallType === stock.type ? "border-[#9e1b32] bg-[#9e1b32] text-white shadow-[0_4px_9px_rgba(158,27,50,0.15)]" : "border-[#e1e7ed] bg-white text-[#536475]"}`} /></div>
                  </div>
                ))}
              </div>
            ) : <AlertTable units={alert.id === "expiring" ? expiringUnits : expiredUnits} expired={alert.id === "expired"} />)}
          </article>
        ))}
      </section>
    </div>
  );
}

function AlertTable({ units, expired = false }: { units: { id: string; type: string; expires: string; status: string }[]; expired?: boolean }) {
  return <div className="mx-[10px] overflow-x-auto border-t border-[#f0f2f3] px-[10px] pb-[7px] pt-[5px] sm:mx-[12px] sm:px-[14px] sm:pb-[12px] sm:pt-[8px]"><table className={`w-full min-w-[440px] table-fixed text-right text-[7px] sm:text-[11px] ${expired ? "border-separate border-spacing-y-[4px]" : ""}`}>
    <thead className="text-[7px] text-[#98a6b0] sm:text-[10px]"><tr><th className="w-1/4 pb-[6px] font-medium">رقم الوحدة</th><th className="w-1/4 pb-[6px] font-medium">الفصيلة</th><th className="w-1/4 pb-[6px] font-medium">تاريخ الانتهاء</th><th className="w-1/4 pb-[6px] font-medium">{expired ? "الحالة" : "المدة المتبقية"}</th></tr></thead>
    <tbody>{units.map((unit, index) => <tr key={unit.id} className={`h-[28px] text-[#72818c] sm:h-[34px] ${expired ? "bg-[#fffafb]" : ""}`}><td dir="ltr" className={`text-right font-sans text-[7px] font-bold text-[#263746] sm:text-[11px] ${expired ? "rounded-r-[9px] border-y border-r border-[#faedf0] pr-[8px]" : ""}`}>{unit.id}</td><td dir="ltr" className={`text-right font-sans text-[8px] font-bold text-[#9e1b32] sm:text-[12px] ${expired ? "border-y border-[#faedf0]" : ""}`}>{unit.type}</td><td dir="ltr" className={`text-right font-sans text-[7px] sm:text-[11px] ${expired ? "border-y border-[#faedf0]" : ""}`}>{unit.expires}</td><td className={expired ? "rounded-l-[9px] border-y border-l border-[#faedf0]" : ""}><span className={`inline-block rounded-full px-[6px] py-[3px] text-[7px] font-medium sm:px-[10px] sm:py-[4px] sm:text-[10px] ${expired || index === 0 ? "bg-[#fff0f2] text-[#b4233a]" : "bg-[#fff8e8] text-[#a87527]"}`}>● {unit.status}</span></td></tr>)}</tbody>
  </table></div>;
}
