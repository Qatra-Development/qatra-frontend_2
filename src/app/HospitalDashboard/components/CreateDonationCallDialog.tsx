"use client";

import { useRef, useState } from "react";
import { Plus } from "./icons/HospitalDashboardIcons";

const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function CreateDonationCallDialog() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [bloodType, setBloodType] = useState("B+");

  return (
    <>
      <button
        type="button"
        onClick={() => dialogRef.current?.showModal()}
        className="flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-[#35464d] shadow-sm transition hover:bg-slate-50"
      >
        <Plus className="h-4 w-4" strokeWidth={1.8} />
        نداء تبرع
      </button>

      <dialog
        ref={dialogRef}
        dir="rtl"
        aria-labelledby="create-donation-call-title"
        onClick={(event) => {
          if (event.target === dialogRef.current) dialogRef.current.close();
        }}
        className="m-auto w-[min(540px,calc(100vw-32px))] max-h-[calc(100dvh-24px)] overflow-y-auto rounded-[14px] border-0 bg-white p-0 text-[#263A44] shadow-[0_20px_60px_rgba(20,32,42,0.2)] backdrop:bg-[#1F2937]/45"
      >
        <form className="px-6 pb-5 pt-4 sm:px-7" onSubmit={(event) => event.preventDefault()}>
          <header className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-bold text-[#B4233A]">نداء تبرع جديد</p>
              <h2 id="create-donation-call-title" className="mt-1 text-[18px] font-bold text-[#263A44]">إنشاء نداء تبرع بالدم</h2>
            </div>
            <button type="button" onClick={() => dialogRef.current?.close()} aria-label="إغلاق النافذة" className="grid h-7 w-7 place-items-center rounded-md text-sm text-[#87939A] hover:bg-slate-100">×</button>
          </header>

          <section className="mt-6">
            <p id="donation-blood-type-label" className="mb-2.5 text-[11px] font-bold text-[#53636C]">فصيلة الدم المطلوبة</p>
            <div role="group" aria-labelledby="donation-blood-type-label" className="grid grid-cols-4 gap-2">
              {bloodTypes.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setBloodType(type)}
                  aria-pressed={bloodType === type}
                  className={`h-9 rounded-md border text-[11px] font-bold transition-colors ${bloodType === type ? "border-[#9E1B32] bg-[#9E1B32] text-white" : "border-[#E7EAED] bg-white text-[#53636C] hover:bg-[#FFF4F5]"}`}
                  dir="ltr"
                >
                  {type}
                </button>
              ))}
            </div>
          </section>

          <section className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="donation-urgency" className="mb-2 block text-[11px] font-bold text-[#53636C]">درجة الاستعجال</label>
              <select id="donation-urgency" defaultValue="" className="h-10 w-full rounded-[8px] border border-[#E7EAED] bg-white px-3 text-[11px] text-[#53636C] outline-none focus:border-[#B4233A]">
                <option value="" disabled>اختر الدرجة</option>
                <option value="normal">عادي</option>
                <option value="urgent">عاجل</option>
                <option value="emergency">طارئ</option>
              </select>
            </div>
            <div>
              <label htmlFor="required-units" className="mb-2 block text-[11px] font-bold text-[#53636C]">عدد الوحدات المطلوبة</label>
              <input id="required-units" type="number" min="1" placeholder="أدخل العدد" lang="en" className="h-10 w-full rounded-[8px] border border-[#E7EAED] bg-white px-3 text-right font-sans text-[11px] text-[#53636C] outline-none placeholder:text-[#B5BDC1] focus:border-[#B4233A]" />
            </div>
          </section>

          <section className="mt-5">
            <label htmlFor="donation-deadline" className="mb-2 block text-[11px] font-bold text-[#53636C]">موعد التبرع</label>
            <input id="donation-deadline" type="datetime-local" lang="en" dir="ltr" className="h-10 w-full rounded-[8px] border border-[#E7EAED] bg-white px-3 font-sans text-[10px] text-[#697982] outline-none focus:border-[#B4233A]" />
          </section>

          <section className="mt-5">
            <label htmlFor="donation-location" className="mb-2 block text-[11px] font-bold text-[#53636C]">مكان التبرع</label>
            <input id="donation-location" type="text" placeholder="شارع القدس الرئيسي، رام الله والبيرة" className="h-10 w-full rounded-[8px] border border-[#E7EAED] bg-white px-3 text-[11px] text-[#53636C] outline-none placeholder:text-[#B5BDC1] focus:border-[#B4233A]" />
          </section>

          <section className="mt-5">
            <label htmlFor="donation-reason" className="mb-2 block text-[11px] font-bold text-[#53636C]">تفاصيل النداء</label>
            <textarea id="donation-reason" rows={3} placeholder="تعليمات أو معلومات إضافية للمتبرعين" className="w-full resize-none rounded-[8px] border border-[#E7EAED] bg-white px-3 py-2.5 text-[11px] text-[#53636C] outline-none placeholder:text-[#B5BDC1] focus:border-[#B4233A]" />
          </section>

          <div className="mt-5 flex items-start gap-2 rounded-[8px] bg-[#EFF8F7] px-3 py-3 text-[9px] leading-5 text-[#60908A]">
            <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full border border-[#72AAA3] text-[9px] font-bold">i</span>
            <p>سيتم إرسال إشعار فوري للمتبرعين المتوافقين في المنطقة حسب فصيلة الدم المطلوبة.</p>
          </div>

          <footer className="mt-5 flex items-center justify-start gap-2">
            <button type="submit" className="rounded-[8px] bg-[#9E1B32] px-5 py-2.5 text-[11px] font-bold text-white hover:bg-[#831529]">نشر النداء العاجل</button>
            <button type="button" onClick={() => dialogRef.current?.close()} className="rounded-[8px] border border-[#E7EAED] bg-white px-5 py-2.5 text-[11px] font-bold text-[#53636C] hover:bg-slate-50">إلغاء</button>
          </footer>
        </form>
      </dialog>
    </>
  );
}

