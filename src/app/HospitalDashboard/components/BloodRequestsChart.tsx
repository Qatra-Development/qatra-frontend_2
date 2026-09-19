const requestStates = [
  { label: "طلبات جديدة", value: 14, status: "Pending", percent: 28, barColor: "#A97727", badgeBackground: "#F8E9CB", badgeColor: "#A97727" },
  { label: "مقبولة", value: 26, status: "Accepted", percent: 53, barColor: "#438487", badgeBackground: "#EDF5F5", badgeColor: "#438487" },
  { label: "قيد التجهيز", value: 8, status: "Preparing", percent: 16, barColor: "#AE1F3B", badgeBackground: "#FBECEF", badgeColor: "#AE1F3B" },
  { label: "جاهزة", value: 5, status: "Ready", percent: 10, barColor: "#18B982", badgeBackground: "#E9FAF4", badgeColor: "#159D70" },
];

export default function BloodRequestsChart() {
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
                <strong className="text-[20px] font-bold leading-6 text-[#203540]">{state.value}</strong>
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
