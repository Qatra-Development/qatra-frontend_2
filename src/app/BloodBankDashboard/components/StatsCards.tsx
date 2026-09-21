import { BadgeCheck, IncomingRequestsStatsIcon, Megaphone, TriangleAlert } from "./icons/HospitalDashboardIcons";
import type { BloodDashboard } from "../lib/api";

const stats = [
  { label: "الطلبات الواردة", value: "48", icon: IncomingRequestsStatsIcon, color: "#607078", bg: "#f0f3f4" },
  { label: "بحاجة لاستجابة", value: "14", icon: TriangleAlert, color: "#d9a231", bg: "#fff5d9" },
  { label: "إجمالي وحدات الدم المتاحة", value: "175", icon: BadgeCheck, color: "#16B985", bg: "#F0FDF4" },
  { label: "نداءات التبرع", value: "8", icon: Megaphone, color: "#a91f38", bg: "#fbecef" },
];

export default function StatsCards({ dashboard }: { dashboard: BloodDashboard | null }) {
  const summary = dashboard?.requests_summary;
  const values = [summary ? summary.incoming + summary.accepted + summary.preparing + summary.ready + summary.completed : null, summary?.incoming, dashboard?.inventory_summary.available, null];
  return (
    <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label="ملخص الطلبات">
      {stats.map(({ label, icon: Icon, color, bg }, index) => (
        <article key={label} className="relative min-h-[120px] overflow-hidden rounded-xl border border-[#f0f2f3] bg-white px-5 py-5 shadow-[0_5px_20px_rgba(28,50,58,0.025)]">
          <div className="relative z-10 flex w-full items-center justify-between text-xs font-medium text-[#58676d]">
            <span className="order-0 flex h-4 w-auto flex-none grow-0 items-center whitespace-nowrap text-right font-['Tajawal'] text-[11px] font-medium leading-4 text-[#594142]">
              {label}
            </span>
            <Icon
              className={`h-[17px] w-[17px] shrink-0 ${label === "نداءات التبرع" ? "-scale-x-100" : ""}`}
              style={{ color }}
              strokeWidth={label === "إجمالي وحدات الدم المتاحة" ? 2.5 : 1.7}
            />
          </div>
          <strong className="absolute bottom-5 right-5 z-10 text-xl font-bold leading-none text-[#26373d]">{index === 3 ? "—" : values[index] ?? "—"}</strong>
          <span
            className={`absolute order-0 flex-none grow-0 rounded-full ${
              label === "إجمالي وحدات الدم المتاحة"
                ? "-bottom-8 -right-7 z-0 h-[86px] w-[86px] opacity-50"
                : "-bottom-8 -right-7 h-[86px] w-[86px]"
            }`}
            style={{ backgroundColor: bg }}
          />
        </article>
      ))}
    </section>
  );
}
