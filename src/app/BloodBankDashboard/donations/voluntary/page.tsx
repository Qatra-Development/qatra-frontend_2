const donationRequests = [
  {
    bloodType: "O+",
    name: "أحمد خالد",
    status: "بانتظار رد المؤسسة",
    statusStyle: "bg-[#fff4dc] text-[#b67b20]",
    action: "قبول وتحديد موعد",
  },
  {
    bloodType: "B+",
    name: "أحمد خالد",
    status: "تم قبول الموعد",
    statusStyle: "bg-[#edf8f6] text-[#398c7f]",
    proposedDate: "12/10/2026 - 05:30 pm",
    location: "بنك الدم المركزي - خان يونس",
  },
];

export default function VoluntaryDonationRequestsPage() {
  return (
    <div className="mx-auto max-w-[1240px]">
      <section className="mb-6 text-right">
        <h1 className="text-xl font-extrabold text-[#22343c]">طلبات التبرع الطوعي</h1>
        <p className="mt-2 text-xs text-[#8a959a]">
          طلبات المتبرعين طوعياً، يمكنك قبولها وتحديد موعد لكل تبرع
        </p>
      </section>

      <section className="space-y-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_5px_20px_rgba(28,50,58,0.035)]">
        {donationRequests.map((request) => (
          <article
            key={request.bloodType}
            className="flex min-h-[116px] items-center gap-5 rounded-2xl border border-[#e8ecee] bg-white px-5 py-5 shadow-[0_2px_8px_rgba(28,50,58,0.025)]"
          >
            <div className="grid h-16 w-16 shrink-0 place-items-center rounded-[22px] bg-[#fff0f2] font-['Tajawal'] text-lg font-extrabold text-[#b4233a]">
              {request.bloodType}
            </div>

            <div className="min-w-0 flex-1 text-right">
              <div className="mb-1.5 flex flex-wrap items-center gap-2">
                <h2 className="text-sm font-extrabold text-[#34464d]">{request.name}</h2>
                <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold ${request.statusStyle}`}>
                  <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
                  {request.status}
                </span>
              </div>

              <p className="text-xs font-extrabold text-[#34464d]">
                أحمد خالد يرغب بالتبرع طوعياً بفصيلة {request.bloodType}
              </p>
              <p className="mt-1 text-[10px] text-[#939ea3]">
                الهاتف: 0561000001 · أرسل: 13/9/2026، 03:20 م
              </p>

              {request.proposedDate && (
                <div className="mt-3 rounded-lg bg-[#f1f8f7] px-4 py-2.5 text-[11px] font-bold leading-6 text-[#65a69b]">
                  <p>الموعد المقترح: {request.proposedDate}</p>
                  <p>المكان: {request.location}</p>
                </div>
              )}
            </div>

            {request.action && (
              <button
                type="button"
                className="h-10 shrink-0 rounded-lg bg-[#a90f2d] px-5 text-[11px] font-extrabold text-white shadow-[0_5px_12px_rgba(169,15,45,0.22)] transition hover:bg-[#901027]"
              >
                {request.action}
              </button>
            )}
          </article>
        ))}
      </section>
    </div>
  );
}
