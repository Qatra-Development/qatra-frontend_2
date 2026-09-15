const upcomingDonors = [
  { id: 1, bloodType: "O+", name: "أحمد خالد", time: "05:30 pm" },
  { id: 2, bloodType: "O+", name: "أحمد خالد", time: "01:00 pm" },
  { id: 3, bloodType: "O+", name: "أحمد خالد", time: "09:30 am" },
];

export default function UpcomingDonorsPage() {
  return (
    <div className="mx-auto max-w-[1240px]">
      <section className="mb-6 text-right">
        <h1 className="text-xl font-extrabold text-[#22343c]">المتبرعون القادمون</h1>
        <p className="mt-2 text-xs text-[#8a959a]">
          طلبات المتبرعين ومواعيد حضورهم وحالة كل تبرع
        </p>
      </section>

      <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_5px_20px_rgba(28,50,58,0.035)]">
        <h2 className="mb-5 text-base font-extrabold text-[#34464d]">
          مواعيد التبرع الطوعي المقبولة
        </h2>

        <div className="space-y-3">
          {upcomingDonors.map((donor) => (
            <article
              key={donor.id}
              className="flex min-h-[140px] items-center gap-5 rounded-2xl border border-[#e8ecee] bg-white px-5 py-5 shadow-[0_2px_8px_rgba(28,50,58,0.025)]"
            >
              <div className="grid h-16 w-16 shrink-0 place-items-center rounded-[22px] bg-[#fff0f2] font-['Tajawal'] text-lg font-extrabold text-[#b4233a]">
                {donor.bloodType}
              </div>

              <div className="min-w-0 flex-1 text-right">
                <div className="mb-1.5 flex flex-wrap items-center gap-2">
                  <h3 className="text-sm font-extrabold text-[#34464d]">{donor.name}</h3>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#edf8f6] px-2.5 py-1 text-[10px] font-bold text-[#398c7f]">
                    <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
                    تم قبول الموعد
                  </span>
                </div>

                <p className="text-xs font-extrabold text-[#34464d]">
                  أحمد خالد يرغب بالتبرع طوعياً بفصيلة {donor.bloodType}
                </p>
                <p className="mt-1 text-[10px] text-[#939ea3]">
                  الهاتف: 0561000001 · أرسل: 13/9/2026، 03:20 م
                </p>

                <div className="mt-3 rounded-lg bg-[#f1f8f7] px-4 py-2.5 text-[11px] font-bold leading-6 text-[#65a69b]">
                  <p>الموعد المقترح: 12/10/2026 - {donor.time}</p>
                  <p>المكان: بنك الدم المركزي - خان يونس</p>
                </div>
              </div>

              <button
                type="button"
                className="h-10 shrink-0 rounded-lg bg-[#a90f2d] px-5 text-[11px] font-extrabold text-white shadow-[0_5px_12px_rgba(169,15,45,0.22)] transition hover:bg-[#901027]"
              >
                تم التبرع
              </button>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
