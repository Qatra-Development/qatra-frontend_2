"use client";

import { MoreHorizontal } from "./icons/HospitalDashboardIcons";
import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { BadgeCheck, Check, Heart } from "lucide-react";

const requests = [
  { id: "AP-1788459982317", hospital: "مركز الدم الإقليمي 01", createdBy: "مسجل المؤسسة الرئيسية 01", type: "B+", units: 5, urgency: "طارئ", status: "منتهي", date: "13 سبتمبر 2026، 03:24 م" },
  { id: "BR-65771443", hospital: "المستشفى التخصصي 01", createdBy: "مسجل المؤسسة الرئيسية 01", type: "AB-", units: 3, urgency: "عادي", status: "مكتمل", date: "الآن" },
  { id: "BR-65757260", hospital: "المستشفى التخصصي 01", createdBy: "مسجل المؤسسة الرئيسية 01", type: "AB-", units: 1, urgency: "طارئ", status: "ملغي", date: "الآن" },
  { id: "BR-65733930", hospital: "المستشفى التخصصي 01", createdBy: "مسجل المؤسسة الرئيسية 01", type: "A+", units: 5, urgency: "عادي", status: "قيد الاستجابة", date: "الآن" },
];

const incomingNeedDate = "10/9/2026 - 05:30 pm";
const availableUnits = [
  { id: "BU-005", expires: "22-09-2026" },
  { id: "BU-006", expires: "23-09-2026" },
  { id: "BU-007", expires: "24-09-2026" },
  { id: "BU-008", expires: "25-09-2026" },
  { id: "BU-009", expires: "26-09-2026" },
].sort((a, b) => {
  const [dayA, monthA, yearA] = a.expires.split("-").map(Number);
  const [dayB, monthB, yearB] = b.expires.split("-").map(Number);
  return Date.UTC(yearA, monthA - 1, dayA) - Date.UTC(yearB, monthB - 1, dayB);
});

type RequestStatus = "pending" | "waiting" | "completed";
type RequestState = Record<string, { status: RequestStatus; unitIds: string[] }>;
const storageKey = "qatra:BloodBankDashboard:incoming-requests";
const statusLabels: Record<RequestStatus, string> = {
  pending: "قيد الاستجابة",
  waiting: "مقبول بانتظار الإرسال",
  completed: "مكتمل",
};

interface LatestRequestsProps {
  showHeader?: boolean;
  toolbar?: ReactNode | ((counts: Record<RequestStatus, number>) => ReactNode);
  incomingMode?: boolean;
  statusOverride?: string;
}

export default function LatestRequests({ showHeader = true, toolbar, incomingMode = false, statusOverride }: LatestRequestsProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const unitsDialogRef = useRef<HTMLDialogElement>(null);
  const [selectedRequest, setSelectedRequest] = useState<(typeof requests)[number] | null>(null);
  const [selectedUnits, setSelectedUnits] = useState<string[]>([]);
  const [requestStates, setRequestStates] = useState<RequestState>({});
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) setRequestStates(JSON.parse(saved) as RequestState);
    } catch {
      // Keep the demo requests usable if browser storage is unavailable.
    }
  }, []);
  const updateRequest = (id: string, status: RequestStatus, unitIds: string[]) => {
    setRequestStates((current) => {
      const next = { ...current, [id]: { status, unitIds } };
      try { localStorage.setItem(storageKey, JSON.stringify(next)); } catch {}
      return next;
    });
  };
  const getStatus = (id: string): RequestStatus => requestStates[id]?.status ?? "pending";
  const selectedStatus = selectedRequest ? getStatus(selectedRequest.id) : "pending";
  const waitingForSending = incomingMode && selectedStatus === "waiting";
  const completed = incomingMode && selectedStatus === "completed";
  const canOpenDetails = incomingMode;
  const filteredRequests = incomingMode
    ? requests.filter((request) => statusLabels[getStatus(request.id)] === statusOverride)
    : requests;
  const counts = requests.reduce<Record<RequestStatus, number>>((result, request) => {
    result[getStatus(request.id)] += 1;
    return result;
  }, { pending: 0, waiting: 0, completed: 0 });
  const reservedUnitIds = new Set(Object.values(requestStates).flatMap((state) => state.unitIds));
  const selectableUnits = availableUnits.filter((unit) => !reservedUnitIds.has(unit.id));

  const openDetails = (request: (typeof requests)[number]) => {
    setSelectedRequest(request);
    dialogRef.current?.showModal();
  };

  const openUnitsDialog = () => {
    setSelectedUnits([]);
    dialogRef.current?.close();
    unitsDialogRef.current?.showModal();
  };

  const toggleUnit = (id: string) => {
    setSelectedUnits((current) => current.includes(id)
      ? current.filter((unitId) => unitId !== id)
      : current.length < (selectedRequest?.units ?? 0) ? [...current, id] : current);
  };

  return (
    <>
    <section className={`${showHeader ? "mt-5" : ""} overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_5px_20px_rgba(28,50,58,0.035)]`}>
      {showHeader && (
        <div className="px-5 py-4">
          <h2 className="text-sm font-bold text-slate-700">أحدث الطلبات والتبرعات</h2>
          <p className="mt-1 text-[10px] text-slate-400">آخر العمليات المسجلة في النظام</p>
        </div>
      )}
      {typeof toolbar === "function" ? toolbar(counts) : toolbar}

      <div className="overflow-x-auto px-5 pb-5">
        <table className="w-full min-w-[900px] border-separate border-spacing-0 text-right text-[10px]">
          <thead className={`bg-[#eaf2f1] ${incomingMode ? "text-[#172A3A]" : "text-[#53646b]"}`}>
            <tr>
              <th className="rounded-r-lg px-4 py-3 font-extrabold">{incomingMode ? "المرجع" : "رقم الطلب"}</th>
              <th className="px-4 py-3 font-extrabold">المؤسسة</th>
              <th className="px-4 py-3 font-extrabold">أنشأه</th>
              <th className="px-4 py-3 text-center font-extrabold">الفصيلة</th>
              <th className="px-4 py-3 text-center font-extrabold">التغطية</th>
              <th className="px-4 py-3 font-extrabold">الاستعجال</th>
              <th className="px-4 py-3 font-extrabold">الحالة</th>
              <th className="px-4 py-3 font-extrabold">{incomingMode ? "تاريخ الحاجة" : "آخر تحديث"}</th>
              <th className="w-12 rounded-l-lg px-3 py-3" aria-label="الإجراءات" />
            </tr>
          </thead>
          <tbody>
            {filteredRequests.map((request) => {
              const displayedStatus = incomingMode ? statusLabels[getStatus(request.id)] : request.status;
              const waiting = displayedStatus === "قيد الاستجابة" || displayedStatus === "مقبول بانتظار الإرسال";

              return (
              <tr
                key={request.id}
                onClick={canOpenDetails ? () => openDetails(request) : undefined}
                onKeyDown={canOpenDetails ? (event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    openDetails(request);
                  }
                } : undefined}
                role={canOpenDetails ? "button" : undefined}
                tabIndex={canOpenDetails ? 0 : undefined}
                aria-label={canOpenDetails ? `عرض تفاصيل الطلب ${request.id}` : undefined}
                className={`text-[#536168] transition hover:bg-slate-50/70 ${canOpenDetails ? "cursor-pointer focus-visible:outline-2 focus-visible:outline-[#9E1B32]" : ""}`}
              >
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
                <td
                  className={`whitespace-nowrap border-b border-slate-100 px-4 py-3 text-[#65747a] ${incomingMode ? "text-right text-[12px]" : "text-[9px]"}`}
                  dir={incomingMode ? "ltr" : undefined}
                >
                  {incomingMode ? incomingNeedDate : request.date}
                </td>
                <td className="border-b border-slate-100 px-3 py-3 text-center">
                  <button type="button" onClick={canOpenDetails ? (event) => { event.stopPropagation(); openDetails(request); } : undefined} className="rounded p-1 text-slate-500 transition hover:bg-slate-100" aria-label={`خيارات الطلب ${request.id}`}>
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </td>
              </tr>
              );
            })}
            {filteredRequests.length === 0 && (
              <tr><td colSpan={9} className="px-4 py-8 text-center text-xs text-[#84929a]">لا توجد طلبات في هذه الحالة</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
    <dialog
      ref={dialogRef}
      dir="rtl"
      aria-labelledby="incoming-request-title"
      onClick={(event) => { if (event.target === dialogRef.current) dialogRef.current.close(); }}
      className="m-auto w-[min(405px,100vw)] max-h-[100dvh] overflow-y-auto rounded-[12px] border-0 bg-white p-0 font-['Tajawal'] text-[#263A44] shadow-[0_20px_60px_rgba(20,32,42,0.2)] backdrop:bg-[#1F2937]/55"
    >
      {selectedRequest && (
        <div className="flex min-h-[392px] flex-col px-[15px] pb-[18px] pt-[14px]">
          <header className="-mx-[15px] flex items-start justify-between border-b border-[#eef0f2] px-[15px] pb-[14px]">
            <div>
              <span className="flex h-[15px] w-[47px] shrink-0 flex-row items-start justify-end p-0 text-[10px] font-bold text-[#9E1B32]">طلب الدم</span>
              <h2 id="incoming-request-title" className="mt-0.5 text-[15px] font-bold leading-6 text-[#243746]">تفاصيل الطلب <span dir="ltr" className="inline-block font-sans text-[14px]">{selectedRequest.id}</span></h2>
              <p className="mt-0.5 text-[9px] text-[#9aa5aa]">آخر تحديث: 25/9/2025</p>
            </div>
            <button type="button" onClick={() => dialogRef.current?.close()} aria-label="إغلاق تفاصيل الطلب" className="grid h-6 w-6 place-items-center rounded text-[13px] text-[#263A44] hover:bg-slate-100">×</button>
          </header>

          <div className="mt-[18px] grid grid-cols-2 gap-[11px]">
            <article className="relative box-border flex h-[91px] grow flex-col items-start rounded-[18px] border border-[#ECEEF0] bg-white p-[12px] shadow-[0_3px_10px_rgba(30,36,50,0.024)]">
              <div><p className="text-[10px] text-[#98a3aa]">الفصيلة</p><p dir="ltr" className="mt-1 text-right font-sans text-[20px] font-bold leading-6 text-[#172a3a]">{selectedRequest.type}</p><p className="mt-1 text-[9px] text-[#42887f]">طلب {selectedRequest.urgency}</p></div>
              <span className="absolute left-[12px] top-[12px] grid h-[28px] w-[28px] place-items-center rounded-[8px] bg-[#fbf0f2] text-[#b72d48]"><Heart size={15} strokeWidth={1.8} /></span>
            </article>
            <article className="relative box-border flex h-[91px] grow flex-col items-start rounded-[18px] border border-[#ECEEF0] bg-white p-[12px] shadow-[0_3px_10px_rgba(30,36,50,0.024)]">
              <div><p className="text-[10px] text-[#98a3aa]">التغطية</p><p dir="ltr" className="mt-1 text-right font-sans text-[20px] font-bold leading-6 text-[#172a3a]">{selectedRequest.units}/{selectedRequest.units}</p><p className="mt-1 text-[9px] text-[#42887f]">وحدة</p></div>
              <span className="absolute left-[12px] top-[12px] grid h-[28px] w-[28px] place-items-center rounded-[8px] bg-[#f0f5f5] text-[#13a789]"><BadgeCheck size={16} strokeWidth={1.8} /></span>
            </article>
          </div>

          <dl className="mt-[12px] divide-y divide-[#edf0f1] text-[10px]">
            <div className="grid grid-cols-3 py-[9px]"><div><dt className="font-bold text-[#243746]">الجهة الموردة</dt><dd className="mt-0.5 text-[9px] text-[#9aa5aa]">مركز الدم الإقليمي 01</dd></div><div className="-translate-x-[12px] justify-self-center text-right font-['Tajawal']"><dt className="text-[10px] font-bold text-[#243746]">تاريخ إنشاء الطلب</dt><dd dir="ltr" className="mt-0.5 text-right text-[9px] text-[#9aa5aa]">24/9/2026</dd></div></div>
            <div className="py-[10px]"><dt className="font-bold text-[#243746]">سبب الطلب</dt><dd className="mt-0.5 text-[9px] text-[#9aa5aa]">حالة طارئة في غرفة العمليات</dd></div>
          </dl>

          {!completed && (
            <footer className="mt-auto flex gap-2 pt-4">
              {waitingForSending ? (
                <button type="button" onClick={() => { if (selectedRequest) updateRequest(selectedRequest.id, "completed", requestStates[selectedRequest.id]?.unitIds ?? []); dialogRef.current?.close(); }} className="h-[33px] rounded-[8px] bg-[#9E1B32] px-[16px] text-[10px] font-bold text-white shadow-[0_3px_7px_rgba(158,27,50,0.16)] hover:bg-[#831529]">تم الإرسال</button>
              ) : (
                <>
                  <button type="button" onClick={openUnitsDialog} className="h-[33px] rounded-[8px] bg-[#9E1B32] px-[16px] text-[10px] font-bold text-white shadow-[0_3px_7px_rgba(158,27,50,0.16)] hover:bg-[#831529]">قبول الطلب</button>
                  <button type="button" onClick={() => dialogRef.current?.close()} className="h-[33px] rounded-[8px] border border-[#e5e9ec] px-[13px] text-[10px] font-bold text-[#263A44] hover:bg-slate-50">إلغاء الطلب</button>
                </>
              )}
            </footer>
          )}
        </div>
      )}
    </dialog>
    <dialog
      ref={unitsDialogRef}
      dir="rtl"
      aria-labelledby="select-units-title"
      onClick={(event) => { if (event.target === unitsDialogRef.current) unitsDialogRef.current.close(); }}
      className="m-auto w-[min(433px,calc(100vw-14px))] max-h-[calc(100dvh-14px)] overflow-y-auto rounded-[13px] border-0 bg-white p-0 font-['Tajawal'] text-[#263A44] shadow-[0_20px_60px_rgba(20,32,42,0.2)] backdrop:bg-[#1F2937]/55"
    >
      {selectedRequest && (
        <div className="flex min-h-[452px] flex-col px-[17px] pb-[18px] pt-[24px]">
          <header className="-mx-[17px] flex items-start justify-between border-b border-[#eceff1] px-[17px] pb-[17px]">
            <div>
              <span className="flex h-[15px] w-[47px] shrink-0 flex-row items-start justify-end p-0 text-[10px] font-bold text-[#9E1B32]">طلب الدم</span>
              <h2 id="select-units-title" className="mt-0.5 whitespace-nowrap font-['Tajawal'] text-[18px] font-extrabold leading-[25px] text-[#243746]">اختيار وحجز الوحدات للطلب <span dir="ltr" className="inline-block font-sans text-[16px] font-bold">{selectedRequest.id}</span></h2>
              <p className="mt-0.5 text-[9px] text-[#9aa5aa]">آخر تحديث: 25/9/2025</p>
            </div>
            <button type="button" onClick={() => unitsDialogRef.current?.close()} aria-label="إغلاق اختيار الوحدات" className="grid h-6 w-6 place-items-center rounded text-[13px] hover:bg-slate-100">×</button>
          </header>

          <p className="mt-[18px] whitespace-nowrap text-right font-['Tajawal'] text-[9px] font-normal text-[#85939b]">حدد {selectedRequest.units} وحدات متاحة من الفصيلة المطلوبة، الوحدة المحجوزة لن تكون متاحة لطلب آخر</p>
          <div className="mt-[12px] flex h-[36px] items-center justify-between rounded-[12px] border border-[#e9edef] bg-[#f7fafb] px-[10px]">
            <span className="font-['Tajawal'] text-[9px] font-normal text-[#84929a]">اختر {selectedRequest.units} وحدات للمتابعة</span>
            <span className="inline-flex items-center gap-[10px] font-['Tajawal'] text-[15px] font-bold text-[#9E1B32]"><span dir="ltr">{selectedUnits.length} / {selectedRequest.units}</span><span className="text-[9px] font-normal text-[#84929a]">تم اختيارها</span></span>
          </div>

          <div className="mt-[10px] flex flex-col gap-[5px]">
            {selectableUnits.map((unit) => (
              <label key={unit.id} className={`flex h-[36px] cursor-pointer items-center justify-between rounded-[11px] border px-[10px] text-[9px] transition ${selectedUnits.includes(unit.id) ? "border-[#d45c70] bg-[#fffafb]" : "border-[#e9edef] hover:border-[#d8e0e3]"}`}>
                <span className="flex items-center gap-[7px]">
                  <input type="checkbox" checked={selectedUnits.includes(unit.id)} onChange={() => toggleUnit(unit.id)} disabled={!selectedUnits.includes(unit.id) && selectedUnits.length >= selectedRequest.units} className="sr-only" />
                  <span aria-hidden="true" className={`grid h-[11px] w-[11px] place-items-center rounded-full border ${selectedUnits.includes(unit.id) ? "border-[#9E1B32] bg-[#9E1B32] text-white" : "border-[#d7e0e4] bg-white"}`}>
                    {selectedUnits.includes(unit.id) && <Check size={8} strokeWidth={3} />}
                  </span>
                  <strong dir="ltr" className="font-sans text-[9px] text-[#263A44]">{unit.id}</strong>
                  <span dir="ltr" className="font-sans text-[8px] text-[#9aa5aa]">{selectedRequest.type}</span>
                  <span className="rounded bg-[#e8f7f3] px-1 py-0.5 text-[8px] font-semibold text-[#248e73]">متاحة</span>
                </span>
                <span className="whitespace-nowrap font-['Tajawal'] text-[11px] font-normal text-[#7d8b96]">تنتهي <span dir="ltr" className="inline-block">{unit.expires}</span></span>
              </label>
            ))}
          </div>

          <footer className="mt-auto flex gap-[7px] pt-[14px]">
            <button type="button" disabled={selectedUnits.length !== selectedRequest.units} onClick={() => { updateRequest(selectedRequest.id, "waiting", selectedUnits); unitsDialogRef.current?.close(); }} className="h-[33px] rounded-[9px] bg-[#9E1B32] px-[20px] text-[10px] font-bold text-white disabled:cursor-not-allowed disabled:bg-[#dfc9ce]">تأكيد حجز الوحدات</button>
            <button type="button" onClick={() => { unitsDialogRef.current?.close(); dialogRef.current?.showModal(); }} className="h-[33px] rounded-[9px] border border-[#e5e9ec] px-[15px] text-[10px] font-bold text-[#263A44] hover:bg-slate-50">رجوع</button>
          </footer>
        </div>
      )}
    </dialog>
    </>
  );
}
