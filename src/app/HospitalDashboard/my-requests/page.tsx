"use client";

import { useEffect, useRef, useState } from "react";
import { BadgeCheck, Heart, MoreHorizontal, X } from "lucide-react";
import CreateBloodRequestDialog from "../components/CreateBloodRequestDialog";

const statuses = ["الكل", "مكتمل", "جاهز للتسليم", "قيد الانتظار", "مسودة", "مرفوض", "ملغي"] as const;
const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const editSuppliers = [
  { name: "مركز الدم الإقليمي 01", location: "بنك الدم المركزي - رام الله والبيرة - مخيم قلنديا", available: 27 },
  { name: "مركز الدم الإقليمي 04", location: "بنك الدم المركزي - الخليل", available: 30 },
  { name: "مركز الدم الإقليمي 09", location: "بنك الدم المركزي - نابلس", available: 30 },
];
const dateOptions = [
  { value: "custom", label: "مخصص" },
  { value: "30", label: "آخر 30 يوم" },
  { value: "7", label: "آخر 7 أيام" },
  { value: "today", label: "اليوم" },
];

const initialRequests = [
  { id: "BR-12718066", type: "O+", units: "3/3", urgency: "عادي", status: "مكتمل", needed: "10/9/2026 - 05:30 pm", updated: "الآن" },
  { id: "BR-65771443", type: "AB-", units: "3/3", urgency: "عاجل", status: "مكتمل", needed: "10/9/2026 - 05:30 pm", updated: "الآن" },
  { id: "BR-65757260", type: "AB+", units: "0/3", urgency: "طارئ", status: "ملغي", needed: "10/9/2026 - 05:30 pm", updated: "الآن" },
  { id: "BR-65733930", type: "A+", units: "0/5", urgency: "عاجل", status: "قيد الانتظار", needed: "10/9/2026 - 05:30 pm", updated: "الآن" },
  { id: "BR-65700011", type: "B+", units: "2/4", urgency: "عاجل", status: "جاهز للتسليم", needed: "09/9/2026 - 10:00 am", updated: "منذ ساعة" },
  { id: "BR-65699902", type: "O-", units: "1/2", urgency: "عاجل", status: "مرفوض", needed: "08/9/2026 - 02:15 pm", updated: "أمس" },
  { id: "BR-65680055", type: "A-", units: "3/3", urgency: "عادي", status: "مكتمل", needed: "07/9/2026 - 08:00 am", updated: "منذ يومين" },
];

const statusStyle: Record<string, string> = {
  "مكتمل": "bg-[#f1f8f8] text-[#477f83]",
  "جاهز للتسليم": "bg-[#eef2ff] text-[#4169c7]",
  "قيد الانتظار": "bg-[#fff3d9] text-[#a36b13]",
  "مسودة": "bg-[#f1f3f5] text-[#536475]",
  "مرفوض": "bg-[#fff0f2] text-[#a8203c]",
  "ملغي": "bg-[#f1f3f5] text-[#465767]",
};

export default function MyRequestsPage() {
  const filterDialogRef = useRef<HTMLDialogElement>(null);
  const requestDialogRef = useRef<HTMLDialogElement>(null);
  const editRequestDialogRef = useRef<HTMLDialogElement>(null);
  const [selectedRequest, setSelectedRequest] = useState<(typeof initialRequests)[number] | null>(null);
  const [isCancellingRequest, setIsCancellingRequest] = useState(false);
  const [cancellationReason, setCancellationReason] = useState("");
  const [editBloodType, setEditBloodType] = useState("A+");
  const [editUrgency, setEditUrgency] = useState("عاجل");
  const [editUnits, setEditUnits] = useState(1);
  const [editNeededDate, setEditNeededDate] = useState("");
  const [editNeededTime, setEditNeededTime] = useState("");
  const [editReason, setEditReason] = useState("");
  const [editSupplier, setEditSupplier] = useState(editSuppliers[0].name);
  const [savedRequests, setSavedRequests] = useState<typeof initialRequests>([]);
  useEffect(() => {
    const loadRequests = () => {
      try {
        const stored = JSON.parse(localStorage.getItem("qatra:hospital:blood-requests") || "[]");
        setSavedRequests(Array.isArray(stored) ? stored : []);
      } catch {
        setSavedRequests([]);
      }
    };
    loadRequests();
    window.addEventListener("qatra:blood-request-created", loadRequests);
    return () => window.removeEventListener("qatra:blood-request-created", loadRequests);
  }, []);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<(typeof statuses)[number]>("الكل");
  const [draftStatus, setDraftStatus] = useState<(typeof statuses)[number]>("مكتمل");
  const [draftType, setDraftType] = useState("A+");
  const [draftUrgency, setDraftUrgency] = useState("عاجل");
  const [draftDate, setDraftDate] = useState("30");
  const [draftFrom, setDraftFrom] = useState("");
  const [draftTo, setDraftTo] = useState("");
  const [appliedType, setAppliedType] = useState("");
  const [appliedUrgency, setAppliedUrgency] = useState("");
  const [appliedDate, setAppliedDate] = useState("");
  const [appliedFrom, setAppliedFrom] = useState("");
  const [appliedTo, setAppliedTo] = useState("");
  const visibleRequests = [...savedRequests, ...initialRequests].filter((request) =>
    (status === "الكل" || request.status === status) &&
    (!appliedType || request.type === appliedType) &&
    (!appliedUrgency || request.urgency === appliedUrgency) &&
    (!appliedDate || (() => {
      const [day, month, year] = request.needed.split(" - ")[0].split("/").map(Number);
      const requestDate = new Date(year, month - 1, day);
      if (appliedDate === "custom") return (!appliedFrom || requestDate >= new Date(`${appliedFrom}T00:00:00`)) && (!appliedTo || requestDate <= new Date(`${appliedTo}T23:59:59`));
      const daysAgo = (Date.now() - requestDate.getTime()) / 86_400_000;
      return daysAgo >= 0 && daysAgo < (appliedDate === "today" ? 1 : Number(appliedDate));
    })()) &&
    request.id.toLowerCase().includes(search.trim().toLowerCase()),
  );

  const applyFilters = () => {
    setStatus(draftStatus);
    setAppliedType(draftType);
    setAppliedUrgency(draftUrgency);
    setAppliedDate(draftDate);
    setAppliedFrom(draftFrom);
    setAppliedTo(draftTo);
    filterDialogRef.current?.close();
  };

  const resetFilters = () => {
    setSearch("");
    setDraftStatus("الكل");
    setDraftType("");
    setDraftUrgency("");
    setDraftDate("");
    setDraftFrom("");
    setDraftTo("");
    setStatus("الكل");
    setAppliedType("");
    setAppliedUrgency("");
    setAppliedDate("");
    setAppliedFrom("");
    setAppliedTo("");
    filterDialogRef.current?.close();
  };

  const openRequestDetails = (request: (typeof initialRequests)[number]) => {
    setSelectedRequest(request);
    setIsCancellingRequest(false);
    setCancellationReason("");
    requestDialogRef.current?.showModal();
  };

  const openEditRequest = () => {
    if (!selectedRequest) return;
    const [datePart = "", timePart = ""] = selectedRequest.needed.split(" - ");
    const [day, month, year] = datePart.split("/");
    setEditBloodType(selectedRequest.type);
    setEditUrgency(selectedRequest.urgency);
    setEditUnits(Number(selectedRequest.units.split("/")[1]) || 1);
    setEditNeededDate(year && month && day ? `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}` : "");
    setEditNeededTime(timePart.replace(/\s*(am|pm)$/i, ""));
    setEditReason("حالة طارئة في غرفة العمليات");
    setEditSupplier(editSuppliers[0].name);
    requestDialogRef.current?.close();
    editRequestDialogRef.current?.showModal();
  };

  return (
    <div className="mx-auto max-w-[1240px] pt-[4px] font-['Tajawal']">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-extrabold leading-[26px] text-[#172a3a]">طلباتي</h1>
          <p className="mt-1 text-[11px] text-[#9aa6ad]">متابعة طلبات الدم الخاصة بمؤسستك فقط</p>
        </div>
        <CreateBloodRequestDialog />
      </div>

      <div className="mt-[13px] flex items-center gap-[7px]">
        <label htmlFor="my-requests-search" className="sr-only">ابحث برقم طلب الدم</label>
        <input id="my-requests-search" type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="ابحث برقم طلب الدم..." className="h-[32px] w-[264px] max-w-[calc(100%-64px)] rounded-[10px] border border-[#e5ebee] bg-white px-[12px] text-[10px] text-[#536475] outline-none placeholder:text-[#9daab1] focus:border-[#9e1b32]" />
        <button type="button" onClick={() => filterDialogRef.current?.showModal()} aria-haspopup="dialog" className="flex h-[32px] items-center justify-center gap-[6px] rounded-[8px] border border-[#e1e6ed] bg-white px-[11px] text-[10px] font-medium text-[#536475] shadow-[0_1px_2px_rgba(30,36,50,0.02)]"><span>الفلاتر</span><svg className="h-[13px] w-[13px]" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3 6h18M7 12h10m-7 6h4" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" /></svg></button>
      </div>

      <nav aria-label="تصفية طلباتي حسب الحالة" className="mt-[9px] flex flex-wrap gap-[5px]">
        {[...statuses].reverse().map((item) => <button key={item} type="button" onClick={() => setStatus(item)} aria-pressed={status === item} className={`rounded-full px-[10px] py-[5px] text-[10px] transition ${status === item ? "border border-[#e8ecef] bg-white font-bold text-[#536475] shadow-sm" : "text-[#99a7ae] hover:bg-white/70"}`}>{item}</button>)}
      </nav>

      <section aria-label="قائمة طلباتي" className="mt-[17px] rounded-[14px] border border-[#e8ecef] bg-white px-[12px] pb-[17px] pt-[12px] shadow-[0_3px_12px_rgba(30,36,50,0.025)]">
        <div className="overflow-x-auto">
          {visibleRequests.length > 0 ? <table className="w-full min-w-[670px] table-fixed border-separate border-spacing-0 text-right text-[10px] text-[#687982]">
            <thead className="bg-[#f3f8f9] font-bold text-[#60717a]"><tr>
              <th className="w-[15%] rounded-r-[9px] px-[8px] py-[10px]">رقم الطلب</th>
              <th className="w-[9%] px-[8px] py-[10px]">الفصيلة</th>
              <th className="w-[9%] px-[8px] py-[10px]">الوحدات</th>
              <th className="w-[10%] px-[8px] py-[10px]">الاستعجال</th>
              <th className="w-[14%] px-[8px] py-[10px]">الحالة</th>
              <th className="w-[21%] px-[8px] py-[10px]">تاريخ الحاجة</th>
              <th className="w-[12%] px-[8px] py-[10px]">آخر تحديث</th>
              <th className="w-[10%] rounded-l-[9px] px-[8px] py-[10px]" aria-label="الإجراءات" />
            </tr></thead>
            <tbody>{visibleRequests.map((request) => <tr key={request.id} onClick={() => openRequestDetails(request)} className="h-[39px] cursor-pointer">
              <td dir="ltr" className="border-b border-[#f1f3f4] px-[8px] text-right font-sans text-[9px] font-bold text-[#9e1b32]">{request.id}</td>
              <td dir="ltr" className="border-b border-[#f1f3f4] px-[8px] text-right font-sans font-bold text-[#263746]">{request.type}</td>
              <td dir="ltr" className="border-b border-[#f1f3f4] px-[8px] text-right font-sans">{request.units}</td>
              <td className={`border-b border-[#f1f3f4] px-[8px] ${request.urgency === "طارئ" ? "font-bold text-[#ae2440]" : ""}`}>{request.urgency}</td>
              <td className="border-b border-[#f1f3f4] px-[8px]"><span className={`inline-flex items-center gap-[4px] whitespace-nowrap rounded-full px-[7px] py-[4px] text-[9px] font-bold ${statusStyle[request.status]}`}><span className="h-[4px] w-[4px] rounded-full bg-current" />{request.status}</span></td>
              <td dir="ltr" className="whitespace-nowrap border-b border-[#f1f3f4] px-[8px] text-right font-sans text-[9px]">{request.needed}</td>
              <td className="border-b border-[#f1f3f4] px-[8px]">{request.updated}</td>
              <td className="border-b border-[#f1f3f4] px-[8px]"><button type="button" onClick={(event) => { event.stopPropagation(); openRequestDetails(request); }} aria-label={`خيارات الطلب ${request.id}`} className="rounded p-1 text-[#263746] hover:bg-[#f3f6f7]"><MoreHorizontal className="h-[14px] w-[14px]" /></button></td>
            </tr>)}</tbody>
          </table> : <div className="flex min-h-[145px] flex-col items-center justify-center gap-[9px] text-center">
            <span className="grid h-[25px] w-[25px] place-items-center rounded-full border border-[#dfe6eb] text-[#b1bcc4]"><X className="h-[15px] w-[15px]" strokeWidth={1.5} /></span>
            <p className="text-[14px] text-[#7f8f99]">لا توجد طلبات تطابق الفلاتر المحددة</p>
            <button type="button" onClick={resetFilters} className="rounded-[7px] border border-[#e5eaee] bg-white px-[10px] py-[5px] text-[11px] text-[#60717a] hover:bg-[#f7f9fa]">إعادة ضبط الفلاتر</button>
          </div>}
        </div>
      </section>
      <dialog ref={requestDialogRef} dir="rtl" aria-labelledby="request-details-title" onClick={(event) => { if (event.target === requestDialogRef.current) requestDialogRef.current.close(); }} className="m-auto w-[min(405px,calc(100vw-16px))] max-h-[calc(100dvh-16px)] overflow-y-auto rounded-[13px] border-0 bg-white p-0 font-['Tajawal'] text-[#263A44] shadow-[0_20px_60px_rgba(20,32,42,0.2)] backdrop:bg-[#1F2937]/55">
        {selectedRequest && (
          <div className="flex min-h-[392px] flex-col px-[15px] pb-[18px] pt-[14px]">
            <header className="-mx-[15px] flex items-start justify-between border-b border-[#f5f6f7] px-[15px] pb-[14px]">
              <div>
                <span className="block text-[10px] font-bold text-[#9E1B32]">طلب دم</span>
                <h2 id="request-details-title" className="mt-0.5 text-[15px] font-bold leading-6 text-[#243746]">تفاصيل الطلب <span dir="ltr" className="inline-block font-sans text-[14px]">{selectedRequest.id}</span></h2>
                <p className="mt-0.5 text-[9px] text-[#9aa5aa]">آخر تحديث: {selectedRequest.updated}</p>
              </div>
              <button type="button" onClick={() => requestDialogRef.current?.close()} aria-label="إغلاق تفاصيل الطلب" className="grid h-6 w-6 place-items-center rounded text-[13px] text-[#263A44] hover:bg-slate-100">×</button>
            </header>

            <div className="mt-[18px] grid grid-cols-2 gap-[11px]">
              <article className="relative box-border flex h-[91px] flex-col items-start rounded-[18px] border border-[#ECEEF0] bg-white p-[12px] shadow-[0_3px_10px_rgba(30,36,50,0.024)]">
                <div><p className="text-[10px] text-[#98a3aa]">الفصيلة</p><p dir="ltr" className="mt-1 text-right font-sans text-[20px] font-bold leading-6 text-[#172a3a]">{selectedRequest.type}</p><p className="mt-1 text-[9px] text-[#42887f]">طلب {selectedRequest.urgency}</p></div>
                <span className="absolute left-[12px] top-[12px] grid h-[28px] w-[28px] place-items-center rounded-[8px] bg-[#fbf0f2] text-[#b72d48]"><Heart size={15} strokeWidth={1.8} /></span>
              </article>
              <article className="relative box-border flex h-[91px] flex-col items-start rounded-[18px] border border-[#ECEEF0] bg-white p-[12px] shadow-[0_3px_10px_rgba(30,36,50,0.024)]">
                <div><p className="text-[10px] text-[#98a3aa]">التغطية</p><p dir="ltr" className="mt-1 text-right font-sans text-[20px] font-bold leading-6 text-[#172a3a]">{selectedRequest.units}</p><p className="mt-1 text-[9px] text-[#42887f]">وحدة</p></div>
                <span className="absolute left-[12px] top-[12px] grid h-[28px] w-[28px] place-items-center rounded-[8px] bg-[#f0f5f5] text-[#13a789]"><BadgeCheck size={16} strokeWidth={1.8} /></span>
              </article>
            </div>

            <dl className="mt-[12px] divide-y divide-[#f5f6f7] text-[10px]">
              <div className="grid grid-cols-2 py-[9px]"><div><dt className="font-bold text-[#243746]">الجهة الموردة</dt><dd className="mt-0.5 text-[9px] text-[#9aa5aa]">مركز بنك الدم</dd></div><div><dt className="font-bold text-[#243746]">تاريخ إنشاء الطلب</dt><dd dir="ltr" className="mt-0.5 text-right text-[9px] text-[#9aa5aa]">{selectedRequest.needed.split(" - ")[0]}</dd></div></div>
              <div className="py-[10px]"><dt className="font-bold text-[#243746]">سبب الطلب</dt><dd className="mt-0.5 text-[9px] text-[#9aa5aa]">طلب وحدات دم لتلبية الاحتياجات</dd></div>
            </dl>

            {isCancellingRequest && (
              <div className="mt-[7px]">
                <label htmlFor="cancellation-reason" className="mb-[6px] block text-[10px] font-bold text-[#243746]">سبب الإلغاء: <span className="text-[#9E1B32]">*</span></label>
                <textarea id="cancellation-reason" value={cancellationReason} onChange={(event) => setCancellationReason(event.target.value)} rows={3} placeholder="حالة طارئة في غرفة العمليات" className="w-full resize-none rounded-[7px] border border-[#e7a3ae] px-[10px] py-[8px] text-[9px] text-[#536475] outline-none placeholder:text-[#9aa5aa] focus:border-[#9E1B32]" />
              </div>
            )}

            <footer className="mt-auto flex gap-2 pt-4">
              {isCancellingRequest ? (
                <>
                  <button type="button" onClick={openEditRequest} className="h-[33px] rounded-[8px] border border-[#e5e9ec] px-[13px] text-[10px] font-bold text-[#263A44] hover:bg-slate-50">تعديل الطلب</button>
                  <button type="button" disabled={!cancellationReason.trim()} className="h-[33px] rounded-[8px] bg-[#9E1B32] px-[16px] text-[10px] font-bold text-white shadow-[0_3px_7px_rgba(158,27,50,0.16)] hover:bg-[#831529] disabled:cursor-not-allowed disabled:opacity-50">إلغاء الطلب</button>
                </>
              ) : (
                <>
                  <button type="button" onClick={openEditRequest} className="h-[33px] rounded-[8px] bg-[#9E1B32] px-[16px] text-[10px] font-bold text-white shadow-[0_3px_7px_rgba(158,27,50,0.16)] hover:bg-[#831529]">تعديل الطلب</button>
                  <button type="button" onClick={() => setIsCancellingRequest(true)} className="h-[33px] rounded-[8px] border border-[#e5e9ec] px-[13px] text-[10px] font-bold text-[#263A44] hover:bg-slate-50">إلغاء الطلب</button>
                </>
              )}
            </footer>
          </div>
        )}
      </dialog>
      <dialog ref={editRequestDialogRef} dir="rtl" aria-labelledby="edit-request-title" onClick={(event) => { if (event.target === editRequestDialogRef.current) editRequestDialogRef.current.close(); }} className="m-auto w-[min(460px,calc(100vw-24px))] max-h-[calc(100dvh-24px)] overflow-y-auto rounded-[14px] border-0 bg-white p-0 font-['Tajawal'] text-[#263746] shadow-[0_20px_60px_rgba(20,32,42,0.2)] backdrop:bg-[#1F2937]/55">
        <div className="px-5 pb-5 pt-4">
          <header className="flex items-start justify-between border-b border-[#f5f6f7] pb-4">
            <div><p className="text-[10px] font-bold text-[#9e1b32]">طلب موجود</p><h2 id="edit-request-title" className="mt-1 text-[18px] font-bold">تعديل طلب دم</h2></div>
            <button type="button" onClick={() => editRequestDialogRef.current?.close()} aria-label="إغلاق تعديل طلب الدم" className="rounded p-1 text-[#74828a] hover:bg-slate-100"><X className="h-4 w-4" /></button>
          </header>

          <fieldset className="mt-4"><legend className="mb-2 text-[11px] font-bold">فصيلة الدم</legend><div className="grid grid-cols-4 gap-2">{bloodTypes.map((type) => <button key={type} type="button" onClick={() => setEditBloodType(type)} aria-pressed={editBloodType === type} dir="ltr" className={`h-8 rounded-[7px] border font-sans text-[10px] ${editBloodType === type ? "border-[#c51f3d] bg-[#c51f3d] font-bold text-white" : "border-[#e7ebee] text-[#50616b] hover:border-[#d9a4ad]"}`}>{type}</button>)}</div></fieldset>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div><label htmlFor="edit-request-urgency" className="mb-1 block text-[11px] font-bold">درجة الاستعجال</label><select id="edit-request-urgency" value={editUrgency} onChange={(event) => setEditUrgency(event.target.value)} className="h-9 w-full rounded-[7px] border border-[#e7ebee] bg-white px-2 text-[11px] text-[#9e1b32] outline-none focus:border-[#9e1b32]"><option>عادي</option><option>عاجل</option><option>طارئ</option></select></div>
            <div><label htmlFor="edit-request-units" className="mb-1 block text-[11px] font-bold">عدد الوحدات</label><input id="edit-request-units" type="number" min="1" max="999" value={editUnits} onChange={(event) => setEditUnits(Math.max(1, Math.min(999, Number(event.target.value) || 1)))} dir="ltr" className="h-9 w-full rounded-[7px] border border-[#e7ebee] px-2 text-right font-sans text-[11px] text-[#9e1b32] outline-none focus:border-[#9e1b32]" /></div>
            <div><label htmlFor="edit-request-date" className="mb-1 block text-[11px] font-bold">تاريخ الحاجة</label><input id="edit-request-date" type="date" lang="en-US" dir="ltr" value={editNeededDate} onChange={(event) => setEditNeededDate(event.target.value)} className="h-9 w-full rounded-[7px] border border-[#e7ebee] px-2 font-sans text-[11px] outline-none focus:border-[#9e1b32]" /></div>
            <div><label htmlFor="edit-request-time" className="mb-1 block text-[11px] font-bold">وقت الحاجة</label><input id="edit-request-time" type="time" lang="en-US" dir="ltr" value={editNeededTime} onChange={(event) => setEditNeededTime(event.target.value)} className="h-9 w-full rounded-[7px] border border-[#e7ebee] px-2 font-sans text-[11px] outline-none focus:border-[#9e1b32]" /></div>
          </div>

          <div className="mt-3"><label htmlFor="edit-request-reason" className="mb-1 block text-[11px] font-bold">سبب الطلب</label><textarea id="edit-request-reason" rows={2} value={editReason} onChange={(event) => setEditReason(event.target.value)} placeholder="مثال: حالة طارئة في غرفة العمليات" className="w-full resize-none rounded-[7px] border border-[#e7ebee] px-3 py-2 text-[11px] outline-none placeholder:text-[#aab5bb] focus:border-[#9e1b32]" /></div>

          <fieldset className="mt-3"><legend className="text-[11px] font-bold">اختر الجهة الموردة</legend><p className="mb-2 mt-1 text-[9px] text-[#9aa6ad]">اختر جهة الدم المحلية الأقرب لك التي لديها تغطية كافية ومتاحة.</p><div className="space-y-2">{editSuppliers.map((item, index) => <label key={item.name} className={`flex cursor-pointer items-center justify-between gap-3 rounded-[9px] border px-3 py-2 ${editSupplier === item.name ? "border-[#dd596d] bg-[#fff8f9]" : "border-[#e7ebee] bg-white"}`}><span className="flex min-w-0 items-center gap-3"><input type="radio" name="edit-request-supplier" checked={editSupplier === item.name} onChange={() => setEditSupplier(item.name)} className="h-3 w-3 accent-[#9e1b32]" /><span className={`grid h-5 w-5 shrink-0 place-items-center rounded-full text-[9px] font-bold ${editSupplier === item.name ? "bg-[#9e1b32] text-white" : "bg-[#f2f4f6] text-[#74828a]"}`}>{index + 1}</span><span className="min-w-0"><strong className="block truncate text-[11px]">{item.name}</strong><span className="block truncate text-[8px] text-[#98a5ac]">{item.location}</span></span></span><span className="shrink-0 text-center"><strong dir="ltr" className="block font-sans text-[12px] text-[#16845d]">{item.available}</strong><span className="text-[8px] text-[#98a5ac]">وحدة متاحة</span></span></label>)}</div></fieldset>

          <footer className="mt-4 flex gap-2 border-t border-[#f5f6f7] pt-4"><button type="button" onClick={() => editRequestDialogRef.current?.close()} className="rounded-[8px] bg-[#9e1b32] px-4 py-2 text-[11px] font-bold text-white hover:bg-[#831529]">تعديل الطلب</button><button type="button" onClick={() => editRequestDialogRef.current?.close()} className="rounded-[8px] border border-[#e7ebee] px-4 py-2 text-[11px] font-bold text-[#536475] hover:bg-[#f7f9fa]">إلغاء التعديل</button></footer>
        </div>
      </dialog>
      <dialog ref={filterDialogRef} dir="rtl" aria-labelledby="my-requests-filters-title" className="fixed inset-y-0 left-auto right-0 m-0 h-dvh max-h-none w-[min(320px,100vw)] max-w-none border-0 bg-white p-0 text-[#263746] shadow-[-8px_0_30px_rgba(20,32,42,0.12)] backdrop:bg-[#253040]/55">
        <div className="flex h-full flex-col font-['Tajawal']">
          <header className="flex h-[48px] shrink-0 items-center justify-between border-b border-[#e9edf0] px-[18px]">
            <h2 id="my-requests-filters-title" className="text-[14px] font-bold">الفلاتر</h2>
            <button type="button" onClick={() => filterDialogRef.current?.close()} aria-label="إغلاق الفلاتر" className="text-[21px] font-light text-[#667781]">×</button>
          </header>

          <div className="min-h-0 flex-1 overflow-y-auto px-[18px] pt-[17px]">
            <div><label htmlFor="request-status-filter" className="mb-[8px] block text-[12px] font-bold">الحالة</label><select id="request-status-filter" value={draftStatus} onChange={(event) => setDraftStatus(event.target.value as (typeof statuses)[number])} className="h-[32px] w-full rounded-[8px] border border-[#e5eaed] bg-white px-[10px] text-[11px] text-[#60717a] outline-none focus:border-[#9e1b32]">{statuses.map((item) => <option key={item} value={item}>{item}</option>)}</select></div>

            <fieldset className="mt-[20px]"><legend className="mb-[9px] text-[12px] font-bold">فصيلة الدم</legend><div className="grid grid-cols-6 gap-[5px]">{bloodTypes.map((type) => <button key={type} type="button" onClick={() => setDraftType(draftType === type ? "" : type)} aria-pressed={draftType === type} dir="ltr" className={`h-[25px] rounded-[6px] border font-sans text-[9px] ${draftType === type ? "border-[#9e1b32] bg-[#9e1b32] font-bold text-white" : "border-[#e9edf0] bg-white text-[#5e7080]"}`}>{type}</button>)}</div></fieldset>

            <div className="mt-[20px]"><label htmlFor="request-urgency-filter" className="mb-[8px] block text-[12px] font-bold">الأولوية</label><select id="request-urgency-filter" value={draftUrgency} onChange={(event) => setDraftUrgency(event.target.value)} className="h-[32px] w-full rounded-[8px] border border-[#e5eaed] bg-white px-[10px] text-[11px] text-[#60717a] outline-none focus:border-[#9e1b32]"><option value="">الكل</option><option value="عادي">عادي</option><option value="عاجل">عاجل</option><option value="طارئ">طارئ</option></select></div>

            <fieldset className="mt-[20px]"><legend className="mb-[9px] text-[12px] font-bold">تاريخ الطلب</legend><div className="flex flex-wrap gap-[5px]">{dateOptions.map((item) => <button key={item.value} type="button" onClick={() => setDraftDate(draftDate === item.value ? "" : item.value)} aria-pressed={draftDate === item.value} className={`h-[27px] rounded-[6px] border px-[8px] text-[10px] ${draftDate === item.value ? "border-[#9e1b32] bg-[#9e1b32] font-bold text-white" : "border-[#e9edf0] bg-white text-[#667781]"}`}>{item.label}</button>)}</div>{draftDate === "custom" && <div className="mt-[9px] grid grid-cols-2 gap-[7px]"><label className="text-[10px] text-[#667781]">من<input type="date" value={draftFrom} onChange={(event) => setDraftFrom(event.target.value)} className="mt-1 h-[30px] w-full rounded-[6px] border border-[#e9edf0] px-1 font-sans text-[9px]" /></label><label className="text-[10px] text-[#667781]">إلى<input type="date" value={draftTo} onChange={(event) => setDraftTo(event.target.value)} className="mt-1 h-[30px] w-full rounded-[6px] border border-[#e9edf0] px-1 font-sans text-[9px]" /></label></div>}</fieldset>
          </div>

          <footer className="flex shrink-0 gap-[8px] border-t border-[#e9edf0] px-[18px] py-[14px]"><button type="button" onClick={applyFilters} className="h-[36px] flex-1 rounded-[8px] bg-[#9e1b32] text-[12px] font-bold text-white">تطبيق الفلاتر</button><button type="button" onClick={resetFilters} className="h-[36px] flex-1 rounded-[8px] border border-[#e5eaed] bg-white text-[12px] text-[#536475]">إعادة ضبط</button></footer>
        </div>
      </dialog>
    </div>
  );
}
