import { MoreHorizontal } from "lucide-react";
import type { ReactNode } from "react";

const requests = [
  { id: "AP-1788459982317", hospital: "مركز الدم الإقليمي 01", createdBy: "مسجل المؤسسة الرئيسية 01", type: "B+", units: 5, urgency: "طارئ", status: "منتهي", date: "13 سبتمبر 2026، 03:24 م" },
  { id: "BR-65771443", hospital: "المستشفى التخصصي 01", createdBy: "مسجل المؤسسة الرئيسية 01", type: "AB-", units: 3, urgency: "عادي", status: "مكتمل", date: "الآن" },
  { id: "BR-65757260", hospital: "المستشفى التخصصي 01", createdBy: "مسجل المؤسسة الرئيسية 01", type: "AB-", units: 1, urgency: "طارئ", status: "ملغي", date: "الآن" },
  { id: "BR-65733930", hospital: "المستشفى التخصصي 01", createdBy: "مسجل المؤسسة الرئيسية 01", type: "A+", units: 5, urgency: "عادي", status: "قيد الاستجابة", date: "الآن" },
];

interface LatestRequestsProps {
  showHeader?: boolean;
  toolbar?: ReactNode;
  incomingMode?: boolean;
  statusOverride?: string;
}

export default function LatestRequests({ showHeader = true, toolbar, incomingMode = false, statusOverride }: LatestRequestsProps) {
  return (
    <section className={`${showHeader ? "mt-5" : ""} overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_5px_20px_rgba(28,50,58,0.035)]`}>
      {showHeader && (
        <div className="px-5 py-4">
          <h2 className="text-sm font-bold text-slate-700">أحدث الطلبات والتبرعات</h2>
          <p className="mt-1 text-[10px] text-slate-400">آخر العمليات المسجلة في النظام</p>
        </div>
      )}
      {toolbar}

      <div className="overflow-x-auto px-5 pb-5">
        <table className="w-full min-w-[900px] border-separate border-spacing-0 text-right text-[10px]">
          <thead className="bg-[#eaf2f1] text-[#53646b]">
            <tr>
              <th className="rounded-r-lg px-4 py-3 font-extrabold">رقم الطلب</th>
              <th className="px-4 py-3 font-extrabold">المؤسسة</th>
              <th className="px-4 py-3 font-extrabold">أنشأه</th>
              <th className="px-4 py-3 text-center font-extrabold">الفصيلة</th>
              <th className="px-4 py-3 text-center font-extrabold">التغطية</th>
              <th className="px-4 py-3 font-extrabold">الاستعجال</th>
              <th className="px-4 py-3 font-extrabold">الحالة</th>
              <th className="px-4 py-3 font-extrabold">آخر تحديث</th>
              <th className="w-12 rounded-l-lg px-3 py-3" aria-label="الإجراءات" />
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => {
              const displayedStatus = statusOverride ?? (incomingMode ? "قيد الاستجابة" : request.status);
              const waiting = displayedStatus === "قيد الاستجابة" || displayedStatus === "بانتظار الإرسال";

              return (
              <tr key={request.id} className="text-[#536168] transition hover:bg-slate-50/70">
                <td className="border-b border-slate-100 px-4 py-3 font-bold text-[#a61f36]" dir="ltr">{request.id}</td>
                <td className="border-b border-slate-100 px-4 py-3 font-medium text-[#4e5e65]">{request.hospital}</td>
                <td className="border-b border-slate-100 px-4 py-3 text-[#65747a]">{request.createdBy}</td>
                <td className="border-b border-slate-100 px-4 py-3 text-center font-extrabold text-[#22343c]" dir="ltr">{request.type}</td>
                <td className="border-b border-slate-100 px-4 py-3 text-center text-[#35464d]">{request.units}</td>
                <td className="border-b border-slate-100 px-4 py-3">
                  {request.urgency === "طارئ" ? (
                    <span className="flex h-4 w-8 flex-none items-center text-right font-['Tajawal'] text-[13.1px] font-extrabold leading-4 text-[#9E1B32]">
                      طارئ
                    </span>
                  ) : (
                    <span className="font-semibold text-[#596970]">{request.urgency}</span>
                  )}
                </td>
                <td className="border-b border-slate-100 px-4 py-3">
                  <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-[9px] font-semibold ${
                    waiting
                      ? "bg-[#f9e8c8] text-[#9b6a1e]"
                      : displayedStatus === "مكتمل"
                        ? "bg-[#edf7f5] text-[#277b70]"
                        : "bg-[#f0f2f3] text-[#7c898f]"
                  }`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${
                      waiting
                        ? "bg-[#c58a32]"
                        : displayedStatus === "مكتمل"
                          ? "bg-[#4a9a8e]"
                          : "bg-[#aab3b7]"
                    }`} />
                    {displayedStatus === "مكتمل" ? (
                      <span className="flex h-[13px] w-[34px] flex-none items-center text-right font-['Tajawal'] text-[11.2px] font-bold leading-[13px] text-[#138A62]">
                        مكتمل
                      </span>
                    ) : (
                      displayedStatus
                    )}
                  </span>
                </td>
                <td className="whitespace-nowrap border-b border-slate-100 px-4 py-3 text-[9px] text-[#65747a]">{request.date}</td>
                <td className="border-b border-slate-100 px-3 py-3 text-center">
                  <button className="rounded p-1 text-slate-500 transition hover:bg-slate-100" aria-label={`خيارات الطلب ${request.id}`}>
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </td>
              </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
