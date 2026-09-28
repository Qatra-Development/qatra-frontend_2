import type { BloodDashboard } from "../lib/api";

export default function BloodInventory({ dashboard }: { dashboard: BloodDashboard | null }) {
  const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O-", "O+"].map(type => {
    const units = dashboard?.inventory_by_blood_type[type]?.available ?? 0;
    const level = !dashboard ? "available" : units <= 1 ? "critical" : units <= 4 ? "low" : "available";
    return { type, units: dashboard ? units : "—", state: !dashboard ? "—" : level === "critical" ? "مخزون حرج" : level === "low" ? "مخزون منخفض" : "وحدة متاحة", percent: Math.min(100, units / 5 * 100), level };
  });
  return (
    <article className="flex h-full min-h-[269px] w-full flex-col rounded-[18px] bg-white px-4 pb-4 pt-[14px] shadow-[0_5px_20px_rgba(28,50,58,0.025)]">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-[15px] font-bold leading-6 text-[#233640]">المخزون حسب الفصيلة</h2>
        <p className="text-[10px] text-[#A6AFB4]">بيانات محدثة لحظياً</p>
      </div>
      <div className="mt-[17px] grid flex-1 auto-rows-fr grid-cols-2 gap-[5px] sm:grid-cols-4">
        {bloodTypes.map((blood) => {
          const low = blood.level === "low";
          const critical = blood.level === "critical";
          return (
            <div key={blood.type} className="relative flex min-h-[97px] flex-col rounded-[11px] border border-[rgba(238,241,242,0.45)] px-[9px] pb-[8px] pt-[10px] text-center">
              <span
                className="absolute left-[54.04px] top-[13.8px] h-6 w-[18px] text-center font-['Tajawal'] text-[16px] font-extrabold leading-6 text-[#9E1B32]"
                dir="ltr"
              >
                {blood.type}
              </span>
              <strong className="mt-[42px] block text-[20px] font-bold leading-6 text-[#203540]">{blood.units}</strong>
              <span className={`mt-[9px] min-h-[17px] whitespace-nowrap text-[11px] leading-[17px] ${
                critical ? "font-bold text-[#B4233A]" : low ? "font-medium text-[#A97727]" : "text-[#A6AFB4]"
              }`}>{blood.state}</span>
              <div className="mt-auto h-[4px] overflow-hidden rounded-full bg-[#F0F4F4]" dir="ltr">
                <div
                  className={`h-full rounded-full ${critical ? "bg-[#C92443]" : low ? "bg-[#F4A62A]" : "bg-[#15996E]"}`}
                  style={{ width: `${blood.percent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </article>
  );
}
