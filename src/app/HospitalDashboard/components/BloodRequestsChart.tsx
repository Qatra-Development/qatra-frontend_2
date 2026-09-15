const chartData = [
  { day: "السبت", value: 9 },
  { day: "الأحد", value: 5 },
  { day: "الاثنين", value: 1 },
  { day: "الثلاثاء", value: 1 },
  { day: "الأربعاء", value: 4 },
];

export default function BloodRequestsChart() {
  return (
    <article className="rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_5px_20px_rgba(28,50,58,0.035)]">
      <div>
        <h2 className="text-sm font-bold text-slate-700">حركة الطلبات والتبرعات خلال آخر أسبوع</h2>
        <p className="mt-1 text-[10px] text-slate-400">مقارنة عدد الطلبات اليومية</p>
      </div>
      <div className="mt-7 flex h-[148px] items-end justify-around gap-4 border-b border-slate-100 px-2">
        {chartData.map(({ day, value }, index) => (
          <div key={day} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
            <span className="text-[9px] font-semibold text-slate-500">{value}</span>
            <div
              className={`w-2.5 rounded-t-full ${index === 0 || index === 4 ? "bg-[#9e1d35]" : "bg-[#df9aa7]"}`}
              style={{ height: `${Math.max(value * 10, 5)}px` }}
            />
            <span className="pb-2 text-[9px] text-slate-400">{day}</span>
          </div>
        ))}
      </div>
    </article>
  );
}
