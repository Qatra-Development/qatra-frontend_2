"use client";

import { useEffect, useRef, useState } from "react";
import { Plus, X } from "lucide-react";
import { createBloodRequest, getBloodSuppliers, saveBloodRequestDraft } from "@/src/features/institution/blood-requests/services/blood-request.service";
import { buildCreatePayload, buildDraftPayload } from "@/src/features/institution/blood-requests/lib/blood-request.utils";
import { createBloodRequestSchema } from "@/src/features/institution/blood-requests/schemas/blood-request.schema";
import type { BloodRequestFormValues, BloodSupplier } from "@/src/features/institution/blood-requests/types/blood-request.types";

const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const storageKey = "qatra:hospital:blood-requests";

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
  const pending = useRef(false);
  const [isOpen, setIsOpen] = useState(false);
  const [supplierId, setSupplierId] = useState<number | null>(null);
  const [supplierResult, setSupplierResult] = useState<{ key: string; items: BloodSupplier[] }>({ key: "", items: [] });
  const supplierKey = `${bloodType}:${units}`;
  const suppliersLoading = isOpen && supplierResult.key !== supplierKey;
  const suppliers = (supplierResult.key === supplierKey ? supplierResult.items : []).map((item) => ({
    id: item.id,
    name: item.institution_name,
    location: item.address || item.governorate,
    available: item.available_units,
  }));

  useEffect(() => {
    if (!isOpen) return;
    const controller = new AbortController();
    getBloodSuppliers(bloodType, units, controller.signal).then((result) => {
      if (controller.signal.aborted) return;
      setSupplierResult({ key: `${bloodType}:${units}`, items: result.items });
      setSupplier("");
      setSupplierId(null);
    }).catch((cause) => {
      if (!controller.signal.aborted) {
        setSupplierResult({ key: `${bloodType}:${units}`, items: [] });
        setError(cause instanceof Error ? cause.message : "تعذر تحميل الجهات الموردة.");
      }
    });
    return () => controller.abort();
  }, [isOpen, bloodType, units]);

  const closeDialog = () => {
    if (!pending.current) dialogRef.current?.close();
  };

  const save = async (draft: boolean) => {
    if (pending.current) return;
    if (!draft && (!neededDate || !neededTime || !reason.trim() || !supplier)) {
      setError("يرجى تعبئة تاريخ ووقت الحاجة وسبب الطلب والجهة الموردة.");
      return;
    }
    try {
      const recipientIds = suppliers.some((item) => item.id === supplierId) && supplierId !== null ? [supplierId] : [];
      const form: BloodRequestFormValues = {
        blood_type: bloodType as BloodRequestFormValues["blood_type"],
        units_required: String(units),
        priority: urgency === "طارئ" ? "emergency" : urgency === "عاجل" ? "urgent" : "normal",
        needed_date: neededDate,
        needed_time: neededTime,
        description: reason,
        notes,
        recipient_ids: recipientIds,
      };
      if (!draft) {
        const validation = createBloodRequestSchema.safeParse(form);
        if (!validation.success) {
          setError(validation.error.issues[0]?.message || "يرجى التحقق من بيانات الطلب.");
          return;
        }
      }
      pending.current = true;
      setError("");
      const result = draft
        ? await saveBloodRequestDraft(buildDraftPayload(form))
        : await createBloodRequest(buildCreatePayload(form));
      const request = result.request;
      const record = {
        id: request.request_number,
        backendId: request.id,
        type: request.blood_type,
        units: `${request.units_provided}/${request.units_required}`,
        urgency: request.priority_label,
        status: request.status_label,
        needed: request.needed_at ? new Date(request.needed_at).toLocaleString("en-GB", { hour12: true }).replace(", ", " - ") : "—",
        updated: "الآن",
        reason: request.description,
        supplier,
        notes: request.notes || "",
      };
      // Keep the existing list in sync using the confirmed server response.
      try {
        const stored = JSON.parse(localStorage.getItem(storageKey) || "[]");
        localStorage.setItem(storageKey, JSON.stringify([record, ...(Array.isArray(stored) ? stored : [])]));
      } catch {
        // A local cache failure must not turn a successful API request into a retry.
      }
      window.dispatchEvent(new Event("qatra:blood-request-created"));
      dialogRef.current?.close();
      setError("");
      setReason("");
      setNotes("");
      setNeededDate("");
      setNeededTime("");
      setSupplier("");
      setSupplierId(null);
      setSuppliersOpen(false);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "تعذر حفظ الطلب. حاول مجددًا.");
    } finally {
      pending.current = false;
    }
  };

  return (
    <>
      <button type="button" onClick={() => { setError(""); setSupplier(""); setSupplierId(null); setSupplierResult({ key: "", items: [] }); setIsOpen(true); dialogRef.current?.showModal(); }} className="flex items-center gap-1.5 rounded-md bg-[#B4233A] px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-[#991F32]">
        <Plus className="h-4 w-4" strokeWidth={1.8} />
        طلب دم جديد
      </button>
      <dialog ref={dialogRef} dir="rtl" aria-labelledby="create-blood-request-title" onClose={() => setIsOpen(false)} onCancel={(event) => { if (pending.current) event.preventDefault(); }} onClick={(event) => { if (event.target === dialogRef.current) closeDialog(); }} className="m-auto w-[min(460px,calc(100vw-24px))] max-h-[calc(100dvh-24px)] overflow-y-auto rounded-[14px] border-0 bg-white p-0 font-['Tajawal'] text-[#263746] shadow-[0_20px_60px_rgba(20,32,42,0.2)] backdrop:bg-[#1F2937]/55">
        <div className="px-5 pb-5 pt-4">
          <header className="flex items-start justify-between border-b border-[#edf0f2] pb-4">
            <div>
              <p className="text-[10px] font-bold text-[#9e1b32]">طلب جديد</p>
              <h2 id="create-blood-request-title" className="mt-1 text-[18px] font-bold">إنشاء طلب دم</h2>
            </div>
            <button type="button" onClick={closeDialog} aria-label="إغلاق إنشاء طلب الدم" className="rounded p-1 text-[#74828a] hover:bg-slate-100"><X className="h-4 w-4" /></button>
          </header>

          <fieldset className="mt-4">
            <legend className="mb-2 text-[11px] font-bold">فصيلة الدم</legend>
            <div className="grid grid-cols-4 gap-2">
              {bloodTypes.map((type) => <button key={type} type="button" onClick={() => setBloodType(type)} aria-pressed={bloodType === type} dir="ltr" className={`h-8 rounded-[7px] border font-sans text-[10px] ${bloodType === type ? "border-[#B4233A] bg-[#B4233A] font-bold text-white" : "border-[#e7ebee] text-[#50616b] hover:border-[#d9a4ad]"}`}>{type}</button>)}
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
                  {suppliersLoading && <p className="py-2 text-center text-[10px] text-[#74828a]">جارٍ تحميل الجهات الموردة...</p>}
                  {!suppliersLoading && suppliers.length === 0 && <p className="py-2 text-center text-[10px] text-[#74828a]">لا توجد جهة تستطيع توفير كامل الكمية المطلوبة.</p>}
                  {suppliers.map((item, index) => (
                    <label key={item.id} className={`flex cursor-pointer items-center justify-between gap-3 rounded-[9px] border px-3 py-2 transition ${supplierId === item.id ? "border-[#dd596d] bg-[#fff8f9]" : "border-[#e7ebee] bg-white hover:border-[#d9a4ad]"}`}>
                      <span className="flex min-w-0 items-center gap-3">
                        <input type="radio" name="blood-request-supplier" value={item.name} checked={supplierId === item.id} onChange={() => { setSupplier(item.name); setSupplierId(item.id); setSuppliersOpen(false); }} className="h-3 w-3 accent-[#9e1b32]" />
                        <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-full text-[9px] font-bold ${supplierId === item.id ? "bg-[#9e1b32] text-white" : "bg-[#f2f4f6] text-[#74828a]"}`}>{index + 1}</span>
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
