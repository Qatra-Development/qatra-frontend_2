"use client";

import Link from "next/link";
import { Bell, IncomingRequestsIcon, InventoryManagementIcon, TriangleAlert } from "./icons/HospitalDashboardIcons";
import type { BloodDashboard } from "../lib/api";

const actions = [
  {
    label: "مخزون منخفض",
    description: "عرض التفاصيل",
    icon: TriangleAlert,
    href: "/BloodBankDashboard/inventory/alerts",
    hoverClass: "hover:bg-[#FFF8E8]",
    iconClass: "bg-[#F6DEA0] text-[#A97727]",
  },
  {
    label: "الطلبات الواردة",
    description: "مراجعة وقبول",
    icon: IncomingRequestsIcon,
    href: "/BloodBankDashboard/requests",
    hoverClass: "hover:bg-[#F1FAFD]",
    iconClass: "bg-[#E7F5FA] text-[#69AFC5]",
  },
  {
    label: "إدارة المخزون",
    description: "عرض وتحديث",
    icon: InventoryManagementIcon,
    href: "/BloodBankDashboard/inventory",
    hoverClass: "hover:bg-[#EAF8F0]",
    iconClass: "bg-[#D7F3E2] text-[#148A55]",
  },
];

export default function DashboardUtilities({ dashboard }: { dashboard: BloodDashboard | null }) {
  const alerts = dashboard?.low_stock.filter(item => item.available_units <= 4).map(item => ({ type: item.blood_type, units: item.available_units, expiry: `الحد الأدنى: ${item.threshold} وحدات` })) ?? [];
  return (
    <section className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
      <article className="h-fit w-full self-start rounded-[18px] bg-white px-[15px] pb-[20px] pt-[12px] shadow-[0_5px_20px_rgba(28,50,58,0.025)]">
        <div className="border-b border-[rgba(238,241,242,0.45)] px-1 pb-[13px] text-right">
          <h2 className="text-[14px] font-bold leading-6 text-[#203540]">إجراءات سريعة</h2>
          <p className="mt-0.5 text-[9px] text-[#A6AFB4]">الوصول الفوري للأدوات الأساسية</p>
        </div>
        <div className="mt-[12px] grid grid-cols-3 gap-[7px]">
          {actions.map(({ label, description, icon: Icon, href, hoverClass, iconClass }) => (
            <Link
              key={label}
              href={href}
              className={`flex min-h-[100px] cursor-pointer flex-col items-center justify-center rounded-[11px] border border-[rgba(238,241,242,0.45)] transition-colors ${hoverClass} focus-visible:outline-2 focus-visible:outline-[#9e1b32]`}
            >
              <span className={`grid h-[31px] w-[31px] place-items-center rounded-[9px] ${iconClass}`}>
                <Icon className="h-4 w-4" strokeWidth={1.7} />
              </span>
              <strong className="mt-[8px] text-[11px] font-bold text-[#263A44]">{label}</strong>
              <span className="mt-0.5 text-[9px] text-[#A6AFB4]">{description}</span>
            </Link>
          ))}
        </div>
      </article>

      <article className="min-h-[260px] rounded-[18px] bg-white px-[10px] pb-[18px] pt-[7px] shadow-[0_5px_20px_rgba(28,50,58,0.025)]">
        <div className="flex items-start justify-between px-[8px]">
          <div className="text-right">
            <h2 className="text-[14px] font-bold leading-6 text-[#203540]">تنبيهات المخزون</h2>
            <p className="mt-0.5 text-[10px] leading-4 text-[#A6AFB4]">يتطلب مراجعة فورية</p>
          </div>
          <div className="mt-[7px] flex items-center gap-[5px]" dir="ltr">
            <span className="grid h-7 w-7 place-items-center rounded-[8px] bg-[#FFF0F2] text-[#B4233A]">
              <Bell className="h-[15px] w-[15px]" strokeWidth={1.7} />
            </span>
            <span className="inline-flex h-[18px] items-center rounded-full bg-[#B4233A] px-2 text-[9px] font-bold text-white" dir="rtl">
              {dashboard ? alerts.length + dashboard.expiring_units_count : "—"} تنبيه
            </span>
          </div>
        </div>

        <div className="mt-[7px] border-t border-[rgba(238,241,242,0.45)] pt-[10px]">
          <div className="mb-[9px] flex items-center justify-end gap-[5px] px-[8px] text-[9px] text-[#67767D]" dir="ltr">
            <span>قرب انتهاء الصلاحية</span>
            <span className="h-[5px] w-[5px] rounded-full bg-[#C58A2A]" />
          </div>
        </div>

        <div className="mx-[8px] space-y-[10px]">
          {alerts.map((alert) => (
            <div key={alert.type} className="flex h-[54px] items-center justify-between rounded-[11px] border-l-[3px] border-[#D38317] bg-[#FFF8E8] px-[14px] py-[8px]">
              <strong className="text-[15px] font-bold text-[#203540]" dir="ltr">{alert.type}</strong>
              <div className="text-left">
                <div className="flex items-baseline gap-1" dir="rtl">
                  <strong className="text-[16px] font-bold text-[#A66E17]">{alert.units}</strong>
                  <span className="text-[9px] text-[#A6AFB4]">وحدة</span>
                </div>
                <span className="mt-0.5 block text-[9px] text-[#A6AFB4]">{alert.expiry}</span>
              </div>
            </div>
          ))}
          {dashboard && alerts.length === 0 && <p className="text-xs text-[#A6AFB4]">لا توجد فصائل منخفضة المخزون</p>}
        </div>
      </article>
    </section>
  );
}
