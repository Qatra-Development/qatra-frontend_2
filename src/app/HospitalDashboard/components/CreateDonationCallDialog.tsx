"use client";

import { useRef, useState } from "react";
import { CircleAlert } from "lucide-react";
import { Plus } from "./icons/HospitalDashboardIcons";

const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

type CreateDonationCallDialogProps = {
  initialBloodType?: string;
  triggerLabel?: string;
  triggerClassName?: string;
  onOpen?: () => void;
};

export default function CreateDonationCallDialog({
  initialBloodType = "B+",
  triggerLabel = "نداء تبرع",
  triggerClassName = "flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-[#35464d] shadow-sm transition hover:bg-slate-50",
  onOpen,
}: CreateDonationCallDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [bloodType, setBloodType] = useState(initialBloodType);

  return (
    <>
      <button
        type="button"
        onClick={() => { setBloodType(initialBloodType); onOpen?.(); dialogRef.current?.showModal(); }}
        className={triggerClassName}
      >
        <Plus className="h-4 w-4" strokeWidth={1.8} />
        {triggerLabel}
      </button>

      <dialog
        ref={dialogRef}
        dir="rtl"
        aria-labelledby="create-donation-call-title"
        onClick={(event) => {
          if (event.target === dialogRef.current) dialogRef.current.close();
        }}
        className="m-auto w-[min(540px,calc(100vw-32px))] max-h-[calc(100dvh-24px)] overflow-y-auto rounded-[14px] border-0 bg-white p-0 font-['Tajawal'] text-[#263A44] shadow-[0_20px_60px_rgba(20,32,42,0.2)] backdrop:bg-[#1F2937]/45"
      >
        <form className="flex min-h-[475px] flex-col px-3 pb-3 pt-2 sm:min-h-[610px] sm:px-7 sm:pb-5 sm:pt-4" onSubmit={(event) => event.preventDefault()}>
          <header className="-mx-3 flex items-start justify-between border-b border-[#EFF1F2] px-3 pb-3 sm:-mx-7 sm:px-7 sm:pb-4">
            <div>
              <p className="text-[10px] font-bold text-[#B4233A]">نداء جديد</p>
              <h2 id="create-donation-call-title" className="mt-1 text-[14px] font-bold text-[#263A44] sm:text-[18px]">إنشاء نداء تبرع بالدم</h2>
            </div>
            <button type="button" onClick={() => dialogRef.current?.close()} aria-label="إغلاق النافذة" className="grid h-7 w-7 place-items-center rounded-md text-sm text-[#87939A] hover:bg-slate-100">×</button>
          </header>

          <section className="mt-3 sm:mt-5">
            <label htmlFor="donation-call-title" className="mb-1.5 block text-[9px] font-bold text-[#53636C] sm:text-[11px]">عنوان نداء التبرع</label>
            <input id="donation-call-title" type="text" placeholder="مثال: حاجة عاجلة لمتبرعين بفصيلة O+" className="h-7 w-full rounded-[7px] border border-[#E7EAED] bg-white px-3 text-[9px] text-[#53636C] outline-none placeholder:text-[#B5BDC1] focus:border-[#B4233A] sm:h-10 sm:text-[11px]" />
          </section>

          <section className="mt-3 sm:mt-5">
            <p id="donation-blood-type-label" className="mb-2 text-[9px] font-bold text-[#53636C] sm:mb-2.5 sm:text-[11px]">فصيلة الدم المطلوبة</p>
            <div role="group" aria-labelledby="donation-blood-type-label" className="grid grid-cols-4 gap-2">
              {bloodTypes.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setBloodType(type)}
                  aria-pressed={bloodType === type}
                  className={`h-7 rounded-md border text-[9px] font-bold transition-colors sm:h-9 sm:text-[11px] ${bloodType === type ? "border-[#9E1B32] bg-[#9E1B32] text-white" : "border-[#E7EAED] bg-white text-[#53636C] hover:bg-[#FFF4F5]"}`}
                  dir="ltr"
                >
                  {type}
                </button>
              ))}
            </div>
          </section>

          <section className="mt-3 grid grid-cols-2 gap-2 sm:mt-5 sm:gap-4">
            <div>
              <label htmlFor="donation-urgency" className="mb-2 block text-[9px] font-bold text-[#53636C] sm:text-[11px]">درجة الاستعجال</label>
              <select id="donation-urgency" defaultValue="" className="h-7 w-full rounded-[8px] border border-[#E7EAED] bg-white px-3 text-[9px] text-[#53636C] outline-none focus:border-[#B4233A] sm:h-10 sm:text-[11px]">
                <option value="" disabled>اختر الدرجة</option>
                <option value="normal">عادي</option>
                <option value="urgent">عاجل</option>
                <option value="emergency">طارئ</option>
              </select>
            </div>
            <div>
              <label htmlFor="required-units" className="mb-2 block text-[9px] font-bold text-[#53636C] sm:text-[11px]">عدد الوحدات المطلوبة</label>
              <input id="required-units" type="number" min="1" placeholder="أدخل العدد" lang="en" className="h-7 w-full rounded-[8px] border border-[#E7EAED] bg-white px-3 text-right font-sans text-[9px] text-[#53636C] outline-none placeholder:text-[#B5BDC1] focus:border-[#B4233A] sm:h-10 sm:text-[11px]" />
            </div>
          </section>

          <section className="mt-3 grid grid-cols-2 gap-2 sm:mt-5 sm:gap-4">
            <div>
              <label htmlFor="donation-date" className="mb-2 block text-[9px] font-bold text-[#53636C] sm:text-[11px]">تاريخ التبرع</label>
              <input id="donation-date" type="date" lang="en" dir="ltr" className="h-7 w-full rounded-[8px] border border-[#E7EAED] bg-white px-2 font-sans text-[9px] text-[#697982] outline-none focus:border-[#B4233A] sm:h-10 sm:text-[10px]" />
            </div>
            <div>
              <label htmlFor="donation-time" className="mb-2 block text-[9px] font-bold text-[#53636C] sm:text-[11px]">وقت التبرع</label>
              <input id="donation-time" type="time" lang="en" dir="ltr" className="h-7 w-full rounded-[8px] border border-[#E7EAED] bg-white px-2 font-sans text-[9px] text-[#697982] outline-none focus:border-[#B4233A] sm:h-10 sm:text-[10px]" />
            </div>
          </section>

          <section className="mt-3 sm:mt-5">
            <label htmlFor="donation-location" className="mb-2 block text-[9px] font-bold text-[#53636C] sm:text-[11px]">مكان التبرع</label>
            <input id="donation-location" type="text" placeholder="شارع القدس الرئيسي، رام الله والبيرة" className="h-7 w-full rounded-[8px] border border-[#E7EAED] bg-white px-3 text-[9px] text-[#53636C] outline-none placeholder:text-[#B5BDC1] focus:border-[#B4233A] sm:h-10 sm:text-[11px]" />
          </section>

          <section className="mt-3 sm:mt-5">
            <label htmlFor="donation-reason" className="mb-2 block text-[9px] font-bold text-[#53636C] sm:text-[11px]">تفاصيل النداء</label>
            <textarea id="donation-reason" rows={3} placeholder="تعليمات أو معلومات إضافية للمتبرعين" className="w-full resize-none rounded-[8px] border border-[#E7EAED] bg-white px-3 py-2.5 text-[9px] text-[#53636C] outline-none placeholder:text-[#B5BDC1] focus:border-[#B4233A] sm:text-[11px]" />
          </section>

          <div className="mt-auto flex min-h-[60px] w-full items-center justify-start gap-2 overflow-hidden rounded-[16px] bg-[#F4F9FA] px-3 text-[#80A2A6] sm:px-4">
            <CircleAlert className="h-4 w-4 shrink-0 text-[#3F7379] sm:h-5 sm:w-5" strokeWidth={2} aria-hidden="true" />
            <p className="min-w-0 whitespace-nowrap text-right text-[clamp(5px,1.8vw,10px)] font-bold leading-none">عندما يقبل المتبرع سيصله موعد ومكان التبرع المحددان هنا. يظهر النداء فقط للفصائل المتوافقة</p>
          </div>

          <footer className="mt-3 flex items-center justify-start gap-2 sm:mt-5">
            <button type="submit" className="rounded-[8px] bg-[#9E1B32] px-3 py-1.5 text-[9px] font-bold text-white hover:bg-[#831529] sm:px-5 sm:py-2.5 sm:text-[11px]">نشر النداء العاجل</button>
            <button type="button" onClick={() => dialogRef.current?.close()} className="rounded-[8px] border border-[#E7EAED] bg-white px-3 py-1.5 text-[9px] font-bold text-[#53636C] hover:bg-slate-50 sm:px-5 sm:py-2.5 sm:text-[11px]">إلغاء</button>
          </footer>
        </form>
      </dialog>
    </>
  );
}
