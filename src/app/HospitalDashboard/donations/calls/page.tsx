import { Plus } from "lucide-react";

const donationCalls = [
  {
    id: 1,
    bloodType: "A−",
    units: 3,
    status: "مفتوح",
    statusStyle: "bg-[#eef7ff] text-[#3a8fca]",
    responses: "يوجد استجابة واحدة تم قبولها",
  },
  {
    id: 2,
    bloodType: "AB+",
    units: 9,
    status: "مفتوح",
    statusStyle: "bg-[#eef7ff] text-[#3a8fca]",
    responses: "يوجد استجابتان من أصل 13",
    donor: "سماء محمد علي",
    accepted: true,
  },
  {
    id: 3,
    bloodType: "AB+",
    units: 5,
    status: "مغلق",
    statusStyle: "bg-[#f0f2f3] text-[#7e8a8f]",
    responses: "يوجد استجابة واحدة تم قبولها",
    donor: "سماء محمد علي",
    donated: true,
  },
];

export default function DonationCallsPage() {
  return (
    <div className="mx-auto max-w-[1240px]">
      <section className="mb-6 flex items-end justify-between gap-4">
        <div className="text-right">
          <h1 className="text-xl font-extrabold text-[#22343c]">نداءات التبرع</h1>
          <p className="mt-2 text-xs text-[#8a959a]">
            متابعة النداءات والاستجابات من المتبرعين
          </p>
        </div>

        <button
          type="button"
          className="flex h-10 shrink-0 items-center gap-2 rounded-lg bg-[#a90f2d] px-4 text-xs font-extrabold text-white shadow-[0_5px_12px_rgba(169,15,45,0.22)] transition hover:bg-[#901027]"
        >
          <Plus className="h-4 w-4" strokeWidth={2} />
          إنشاء نداء
        </button>
      </section>

      <section className="space-y-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_5px_20px_rgba(28,50,58,0.035)]">
        {donationCalls.map((call) => (
          <article
            key={call.id}
            className="flex min-h-[145px] items-center gap-5 rounded-2xl border border-[#e8ecee] bg-white px-5 py-5 shadow-[0_2px_8px_rgba(28,50,58,0.025)]"
          >
            <div className="grid h-16 w-16 shrink-0 place-items-center rounded-[22px] bg-[#fff0f2] font-['Tajawal'] text-lg font-extrabold text-[#b4233a]">
              {call.bloodType}
            </div>

            <div className="min-w-0 flex-1 text-right">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <h2 className="text-sm font-extrabold text-[#34464d]">
                  مستشفى بنك الدم التجريبي 01
                </h2>
                <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold ${call.statusStyle}`}>
                  <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
                  {call.status}
                </span>
              </div>

              <p className="text-xs font-extrabold text-[#34464d]">
                مطلوب {call.units} وحدات من الفصيلة {call.bloodType} - عاجل
              </p>
              <p className="mt-1 text-[10px] text-[#939ea3]">
                تم إنشاء النداء بتاريخ 13/9/2026، 03:20 م
              </p>
              <p className="mt-3 text-[10px] font-bold text-[#65767c]">{call.responses}</p>

              {call.donor && (
                <div className="mt-2 flex min-h-10 flex-wrap items-center justify-between gap-3 rounded-lg border border-[#edf0f1] bg-[#fbfcfc] px-4 py-2">
                  <div>
                    <p className="text-[10px] font-extrabold text-[#3e5057]">{call.donor}</p>
                    <p className="mt-1 text-[9px] text-[#98a3a7]">تم إرسال الطلب بتاريخ 13/9/2026</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {call.accepted && (
                      <>
                        <span className="rounded-full bg-[#eef7ff] px-2.5 py-1 text-[9px] font-bold text-[#428bbb]">
                          موعد مؤكد
                        </span>
                        <button type="button" className="h-8 rounded-md bg-[#a90f2d] px-4 text-[9px] font-bold text-white">
                          تم التبرع
                        </button>
                      </>
                    )}
                    {call.donated && (
                      <span className="rounded-full bg-[#e9fbf4] px-2.5 py-1 text-[9px] font-bold text-[#2ba77c]">
                        تم التبرع
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
