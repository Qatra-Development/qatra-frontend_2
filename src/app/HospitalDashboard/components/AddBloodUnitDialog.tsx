"use client";

import { useRef, useState } from "react";
import { NumberStepperDownIcon, NumberStepperUpIcon, Plus } from "./icons/HospitalDashboardIcons";

const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function AddBloodUnitDialog({ compact = false }: { compact?: boolean }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [bloodType, setBloodType] = useState("B+");
  const [units, setUnits] = useState(1);

  return (
    <>
      <button
        type="button"
        onClick={() => dialogRef.current?.showModal()}
        className={compact
          ? "flex shrink-0 flex-row items-center justify-center gap-[6px] whitespace-nowrap rounded-[11px] bg-[#9E1B32] px-[14px] py-[9px] font-['IBM_Plex_Sans_Arabic'] text-[11px] font-bold text-white shadow-[0_5px_12px_rgba(180,35,58,0.2)] transition hover:bg-[#831529]"
          : "flex items-center gap-1.5 rounded-md bg-[#B4233A] px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-[#991F32]"}
      >
        <Plus className={compact ? "h-[13px] w-[13px]" : "h-4 w-4"} strokeWidth={1.8} />
        إضافة وحدة
      </button>

      <dialog
        ref={dialogRef}
        dir="rtl"
        aria-labelledby="add-blood-unit-title"
        onClick={(event) => {
          if (event.target === dialogRef.current) dialogRef.current.close();
        }}
        className="m-auto w-[min(520px,calc(100vw-32px))] max-h-[calc(100dvh-32px)] overflow-y-auto rounded-[14px] border-0 bg-white p-0 text-[#263A44] shadow-[0_20px_60px_rgba(20,32,42,0.2)] backdrop:bg-[#1F2937]/45"
      >
        <div className="min-h-[540px] px-5 pb-8 pt-6 sm:px-7">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-bold text-[#B4233A]">إدارة المخزون</p>
              <h2 id="add-blood-unit-title" className="mt-1.5 text-[18px] font-bold text-[#263A44]">
                تسجيل وحدة دم
              </h2>
            </div>
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              aria-label="إغلاق النافذة"
              className="grid h-7 w-7 place-items-center rounded-md text-sm text-[#87939A] hover:bg-slate-100"
            >
              ×
            </button>
          </div>

          <div className="mt-8">
            <p id="blood-type-label" className="mb-3 text-[11px] font-bold text-[#53636C]">فصيلة الدم</p>
            <div role="group" aria-labelledby="blood-type-label" className="grid grid-cols-4 gap-2">
              {bloodTypes.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setBloodType(type)}
                  aria-pressed={bloodType === type}
                  className={`h-9 rounded-md border text-[11px] font-bold transition-colors ${
                    bloodType === type
                      ? "border-[#9E1B32] bg-[#9E1B32] text-white shadow-sm"
                      : "border-[#E7EAED] bg-white text-[#53636C] hover:bg-[#FFF4F5]"
                  }`}
                  dir="ltr"
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="blood-unit-count" className="mb-3 block text-right text-[12px] font-bold text-[#53636C]">عدد الوحدات</label>
              <div className="flex h-[40px] w-full items-center rounded-[10px] border border-[#E7A5AF] bg-white px-[9px] focus-within:border-[#B4233A]" dir="ltr">
                <div className="flex h-full w-5 flex-col items-center justify-center gap-[2px]">
                  <button
                    type="button"
                    onClick={() => setUnits((value) => Math.min(999, value + 1))}
                    aria-label="زيادة عدد الوحدات"
                    className="grid h-2.5 w-4 place-items-center text-[#B4233A]"
                  >
                    <NumberStepperUpIcon className="h-[5px] w-2" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setUnits((value) => Math.max(1, value - 1))}
                    aria-label="تقليل عدد الوحدات"
                    className="grid h-2.5 w-4 place-items-center text-[#B4233A]"
                  >
                    <NumberStepperDownIcon className="h-[5px] w-2" />
                  </button>
                </div>
                <input
                  id="blood-unit-count"
                  type="text"
                  inputMode="numeric"
                  value={units.toLocaleString("en-US", { useGrouping: false })}
                  onChange={(event) => {
                    const value = Number(event.target.value.replace(/[^0-9]/g, ""));
                    setUnits(Math.min(999, Math.max(1, value || 1)));
                  }}
                  lang="en"
                  className="h-full min-w-0 flex-1 bg-transparent text-right font-sans text-[12px] font-bold text-[#B4233A] outline-none"
                  dir="ltr"
                />
              </div>
            </div>
            <div>
              <label htmlFor="blood-reference-number" className="mb-3 block text-right text-[12px] font-bold text-[#53636C]">الرقم المرجعي</label>
              <input
                id="blood-reference-number"
                type="text"
                value="BU-368090"
                readOnly
                className="h-[40px] w-full rounded-[10px] border border-[#E7EAED] bg-white px-[13px] text-right font-sans text-[11px] font-medium text-[#697982] outline-none"
                dir="ltr"
              />
            </div>
          </div>

          <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="donation-date" className="mb-3 block text-[11px] font-bold text-[#53636C]">تاريخ التبرع</label>
              <input id="donation-date" type="date" lang="en" dir="ltr" className="h-9 w-full rounded-md border border-[#E7EAED] bg-white px-2 font-sans text-[11px] text-[#697982] outline-none focus:border-[#9E1B32]" />
            </div>
            <div>
              <label htmlFor="expiration-date" className="mb-3 block text-[11px] font-bold text-[#53636C]">تاريخ انتهاء الصلاحية</label>
              <input id="expiration-date" type="date" lang="en" dir="ltr" className="h-9 w-full rounded-md border border-[#E7EAED] bg-white px-2 font-sans text-[11px] text-[#697982] outline-none focus:border-[#9E1B32]" />
            </div>
          </div>

          <div className="mt-8 flex justify-start">
            <button type="button" className="rounded-[8px] bg-[#D58F9C] px-5 py-2.5 text-[11px] font-bold text-white shadow-sm transition-colors hover:bg-[#C97888] active:bg-[#9E1B32]">
              تسجيل الوحدة
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}
