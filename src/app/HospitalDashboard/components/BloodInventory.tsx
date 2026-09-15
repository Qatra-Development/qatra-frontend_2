const bloodTypes = [
  { type: "A+", units: 31, state: "متوفر", percent: 80 },
  { type: "A-", units: 23, state: "متوفر", percent: 65 },
  { type: "B+", units: 27, state: "متوفر", percent: 72 },
  { type: "B-", units: 22, state: "منخفض", percent: 43 },
  { type: "AB+", units: 24, state: "متوفر", percent: 62 },
  { type: "AB-", units: 16, state: "منخفض", percent: 35 },
  { type: "O+", units: 31, state: "متوفر", percent: 78 },
  { type: "O-", units: 25, state: "متوفر", percent: 59 },
];

export default function BloodInventory() {
  return (
    <article className="rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_5px_20px_rgba(28,50,58,0.035)]">
      <div className="mb-5">
        <div>
          <h2 className="text-sm font-bold text-slate-700">حالة المخزون</h2>
          <p className="mt-1 text-[10px] text-slate-400">بيانات محدثة لحظيًا</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4">
        {bloodTypes.map((blood) => {
          const low = blood.state === "منخفض";
          return (
            <div key={blood.type} className="text-center">
              <span className="text-xs font-bold text-[#a61f36]">{blood.type}</span>
              <strong className="mt-2 block text-lg text-slate-700">{blood.units}</strong>
              <span className={`text-[9px] ${low ? "text-amber-500" : "text-slate-400"}`}>{blood.state}</span>
              <div className="mt-2 h-1 overflow-hidden rounded-full bg-slate-100">
                <div className={`h-full rounded-full ${low ? "bg-amber-400" : "bg-[#2aa77b]"}`} style={{ width: `${blood.percent}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </article>
  );
}
