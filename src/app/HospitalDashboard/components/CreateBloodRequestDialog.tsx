"use client";

import { useRef, useState } from "react";
import { Plus, X } from "lucide-react";

const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const storageKey = "qatra:hospital:blood-requests";
const suppliers = [
  { name: "مركز الدم الإقليمي 01", location: "بنك الدم المركزي - رام الله والبيرة - مخيم قلنديا", available: 27 },
  { name: "مركز الدم الإقليمي 04", location: "بنك الدم المركزي - الخليل", available: 30 },
  { name: "مركز الدم الإقليمي 09", location: "بنك الدم المركزي - نابلس", available: 30 },
];

export default function CreateBloodRequestDialog() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [bloodType, setBloodType] = useState("A+");
  const [urgency, setUrgency] = useState("عادي");
  const [units, setUnits] = useState(1);
  const [neededDate, setNeededDate] = useState("");
  const [neededTime, setNeededTime] = useState("");
  const [reason, setReason] = useState("");
  const [supplier, setSupplier] = useState("");
  const [suppliersOpen, setSuppliersOpen] = useState(false);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  const save = (draft: boolean) => {
    if (!draft && (!neededDate || !neededTime || !reason.trim() || !supplier)) {
      setError("يرجى تعبئة تاريخ ووقت الحاجة وسبب الطلب والجهة الموردة.");
      return;
    }
    const record = {
      id: `BR-${Date.now()}`,
      type: bloodType,
      units: `0/${units}`,
      urgency,
      status: draft ? "مسودة" : "قيد الانتظار",
      needed: neededDate && neededTime ? `${neededDate.split("-").reverse().join("/")} - ${neededTime}` : "—",
      updated: "الآن",
      reason: reason.trim(),
      supplier,
      notes: notes.trim(),
    };
    try {
      const stored = JSON.parse(localStorage.getItem(storageKey) || "[]");
      localStorage.setItem(storageKey, JSON.stringify([record, ...(Array.isArray(stored) ? stored : [])]));
      window.dispatchEvent(new Event("qatra:blood-request-created"));
      dialogRef.current?.close();
      setError("");
      setReason("");
      setNotes("");
      setNeededDate("");
      setNeededTime("");
      setSupplier("");
      setSuppliersOpen(false);
    } catch {
      setError("تعذر حفظ الطلب. حاول مجددًا.");
    }
  };

  return (
    <>
      <button type="button" onClick={() => dialogRef.current?.showModal()} className="flex items-center gap-1.5 rounded-md bg-[#B4233A] px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-[#991F32]">
        <Plus className="h-4 w-4" strokeWidth={1.8} />
        طلب دم جديد
      </button>
      <dialog ref={dialogRef} dir="rtl" aria-labelledby="create-blood-request-title" onClick={(event) => { if (event.target === dialogRef.current) dialogRef.current.close(); }} className="m-auto w-[min(460px,calc(100vw-24px))] max-h-[calc(100dvh-24px)] overflow-y-auto rounded-[14px] border-0 bg-white p-0 font-['Tajawal'] text-[#263746] shadow-[0_20px_60px_rgba(20,32,42,0.2)] backdrop:bg-[#1F2937]/55">
        <div className="px-5 pb-5 pt-4">
          <header className="flex items-start justify-between border-b border-[#edf0f2] pb-4">
            <div>
              <p className="text-[10px] font-bold text-[#9e1b32]">طلب جديد</p>
              <h2 id="create-blood-request-title" className="mt-1 text-[18px] font-bold">إنشاء طلب دم</h2>
            </div>
            <button type="button" onClick={() => dialogRef.current?.close()} aria-label="إغلاق إنشاء طلب الدم" className="rounded p-1 text-[#74828a] hover:bg-slate-100"><X className="h-4 w-4" /></button>
          </header>

          <fieldset className="mt-4">
            <legend className="mb-2 text-[11px] font-bold">فصيلة الدم</legend>
            <div className="grid grid-cols-4 gap-2">
              {bloodTypes.map((type) => <button key={type} type="button" onClick={() => setBloodType(type)} aria-pressed={bloodType === type} dir="ltr" className={`h-8 rounded-[7px] border font-sans text-[10px] ${bloodType === type ? "border-[#9e1b32] bg-[#fff3f5] font-bold text-[#9e1b32]" : "border-[#e7ebee] text-[#50616b] hover:border-[#d9a4ad]"}`}>{type}</button>)}
            </div>
          </fieldset>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div><label htmlFor="request-urgency" className="mb-1 block text-[11px] font-bold">درجة الاستعجال</label><select id="request-urgency" value={urgency} onChange={(event) => setUrgency(event.target.value)} className="h-9 w-full rounded-[7px] border border-[#e7ebee] bg-white px-2 text-[11px] outline-none focus:border-[#9e1b32]"><option>عادي</option><option>عاجل</option><option>طارئ</option></select></div>
            <div><label htmlFor="request-units" className="mb-1 block text-[11px] font-bold">عدد الوحدات</label><input id="request-units" type="number" min="1" max="999" value={units} onChange={(event) => setUnits(Math.max(1, Math.min(999, Number(event.target.value) || 1)))} dir="ltr" lang="en" className="h-9 w-full rounded-[7px] border border-[#e7ebee] px-2 text-right font-sans text-[11px] outline-none focus:border-[#9e1b32]" /></div>
            <div><label htmlFor="request-date" className="mb-1 block text-[11px] font-bold">تاريخ الحاجة</label><input id="request-date" type="date" lang="en-US" dir="ltr" value={neededDate} onChange={(event) => setNeededDate(event.target.value)} className="h-9 w-full rounded-[7px] border border-[#e7ebee] px-2 font-sans text-[11px] outline-none focus:border-[#9e1b32]" /></div>
            <div><label htmlFor="request-time" className="mb-1 block text-[11px] font-bold">وقت الحاجة</label><input id="request-time" type="time" lang="en-US" dir="ltr" value={neededTime} onChange={(event) => setNeededTime(event.target.value)} className="h-9 w-full rounded-[7px] border border-[#e7ebee] px-2 font-sans text-[11px] outline-none focus:border-[#9e1b32]" /></div>
          </div>

          <div className="mt-3"><label htmlFor="request-reason" className="mb-1 block text-[11px] font-bold">سبب الطلب</label><textarea id="request-reason" rows={2} value={reason} onChange={(event) => setReason(event.target.value)} placeholder="مثال: حالة طارئة في غرفة العمليات" className="w-full resize-none rounded-[7px] border border-[#e7ebee] px-3 py-2 text-[11px] outline-none placeholder:text-[#aab5bb] focus:border-[#9e1b32]" /></div>
          <div className="mt-3">
            <p id="request-supplier-label" className="mb-1 text-[11px] font-bold">اختر الجهة الموردة</p>
            <p className="mb-1 text-[9px] text-[#9aa6ad]">اختر جهة لتوفير الوحدات المطلوبة للطلب.</p>
            <button type="button" aria-labelledby="request-supplier-label" aria-expanded={suppliersOpen} aria-controls="request-suppliers" onClick={() => setSuppliersOpen((open) => !open)} className="flex h-9 w-full items-center justify-between rounded-[7px] border border-[#e7ebee] bg-white px-2 text-right text-[11px] text-[#536475] hover:border-[#d9a4ad] focus-visible:outline-2 focus-visible:outline-[#9e1b32]"><span>{supplier || "اختر الجهة الموردة"}</span><span aria-hidden="true">⌄</span></button>
            {suppliersOpen && (
              <div id="request-suppliers" className="mt-2">
                <div className="space-y-2" role="radiogroup" aria-label="الجهات الموردة">
                  {suppliers.map((item, index) => (
                    <label key={item.name} className={`flex cursor-pointer items-center justify-between gap-3 rounded-[9px] border px-3 py-2 transition ${supplier === item.name ? "border-[#dd596d] bg-[#fff8f9]" : "border-[#e7ebee] bg-white hover:border-[#d9a4ad]"}`}>
                      <span className="flex min-w-0 items-center gap-3">
                        <input type="radio" name="blood-request-supplier" value={item.name} checked={supplier === item.name} onChange={() => { setSupplier(item.name); setSuppliersOpen(false); }} className="h-3 w-3 accent-[#9e1b32]" />
                        <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-full text-[9px] font-bold ${supplier === item.name ? "bg-[#9e1b32] text-white" : "bg-[#f2f4f6] text-[#74828a]"}`}>{index + 1}</span>
                        <span className="min-w-0"><strong className="block truncate text-[11px]">{item.name}</strong><span className="block truncate text-[8px] text-[#98a5ac]">{item.location}</span></span>
                      </span>
                      <span className="shrink-0 text-center"><strong dir="ltr" className="block font-sans text-[12px] text-[#16845d]">{item.available}</strong><span className="text-[8px] text-[#98a5ac]">وحدة متاحة</span></span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="mt-3"><label htmlFor="request-notes" className="mb-1 block text-[11px] font-bold">ملاحظات الطلب</label><textarea id="request-notes" rows={2} value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="معلومات إضافية أو بيانات طبية تساعد المورّد" className="w-full resize-none rounded-[7px] border border-[#e7ebee] px-3 py-2 text-[11px] outline-none placeholder:text-[#aab5bb] focus:border-[#9e1b32]" /></div>
          {error && <p role="alert" className="mt-2 text-[11px] text-[#9e1b32]">{error}</p>}
          <footer className="mt-4 flex gap-2 border-t border-[#edf0f2] pt-4">
            <button type="button" onClick={() => save(false)} className="rounded-[8px] bg-[#9e1b32] px-4 py-2 text-[11px] font-bold text-white hover:bg-[#831529]">إرسال الطلب</button>
            <button type="button" onClick={() => save(true)} className="rounded-[8px] border border-[#e7ebee] px-4 py-2 text-[11px] font-bold text-[#536475] hover:bg-[#f7f9fa]">حفظ كمسودة</button>
          </footer>
        </div>
      </dialog>
    </>
  );
}
