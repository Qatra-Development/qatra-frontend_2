"use client";

import { useRef, useState } from "react";
import { Heart, MoreHorizontal, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import AddBloodUnitDialog from "../components/AddBloodUnitDialog";

const stocks = [
  ["A+", 31], ["A-", 31], ["B+", 27], ["B-", 22],
  ["AB+", 13], ["AB-", 30], ["O+", 31], ["O-", 25],
] as const;

const sampleUnits = [
  { id: "UN-1001", type: "A+", donated: "24/09/2025", expires: "24/10/2025", status: "متاحة" },
  { id: "UN-1002", type: "A+", donated: "23/09/2025", expires: "23/10/2025", status: "تم التسليم" },
  { id: "UN-1003", type: "A+", donated: "22/09/2025", expires: "22/10/2025", status: "منتهية" },
  { id: "UN-1005", type: "A+", donated: "21/09/2025", expires: "21/10/2025", status: "تنتهي قريبًا" },
  { id: "UN-1007", type: "A+", donated: "20/09/2025", expires: "20/10/2025", status: "محجوزة" },
];

const units = stocks.flatMap(([type], stockIndex) => sampleUnits.map((unit) => ({
  ...unit,
  id: stockIndex === 0 ? unit.id : `UN-${(stockIndex + 1) * 1000 + Number(unit.id.slice(-3))}`,
  type,
})));

type InventoryUnit = (typeof units)[number];
const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as const;
const toInputDate = (date: string) => { const [day, month, year] = date.split("/"); return `${year}-${month}-${day}`; };
const toDisplayDate = (date: string) => { const [year, month, day] = date.split("-"); return `${day}/${month}/${year}`; };
const addThirtyDays = (date: string) => {
  if (!date) return "";
  const [year, month, day] = date.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day + 30)).toISOString().slice(0, 10);
};
const toEnglishDate = (date: string) => date
  ? new Intl.DateTimeFormat("en-US", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "UTC" }).format(new Date(`${date}T00:00:00Z`))
  : "";

const statusClasses: Record<string, string> = {
  "متاحة": "bg-[#e9f7f1] text-[#16845d]",
  "تم التسليم": "bg-[#e9f7f1] text-[#16845d]",
  "منتهية": "bg-[#fff0f1] text-[#a9223a]",
  "تنتهي قريبًا": "bg-[#fff5df] text-[#a97425]",
  "محجوزة": "bg-[#eef1f6] text-[#65758a]",
};

const filterStatuses = ["متاحة", "محجوزة", "تم التسليم", "تنتهي قريبًا", "منتهية"];

export default function HospitalInventoryPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [selectedStock, setSelectedStock] = useState("");
  const filterDialogRef = useRef<HTMLDialogElement>(null);
  const unitDialogRef = useRef<HTMLDialogElement>(null);
  const editDialogRef = useRef<HTMLDialogElement>(null);
  const excludeDialogRef = useRef<HTMLDialogElement>(null);
  const [selectedUnit, setSelectedUnit] = useState<InventoryUnit | null>(null);
  const [editedUnits, setEditedUnits] = useState<Record<string, InventoryUnit>>({});
  const [editType, setEditType] = useState<(typeof bloodTypes)[number]>("B+");
  const [editDonated, setEditDonated] = useState("");
  const editExpires = addThirtyDays(editDonated);
  const [excludeReason, setExcludeReason] = useState("");
  const [excludedUnitIds, setExcludedUnitIds] = useState<string[]>([]);
  const [draftStatuses, setDraftStatuses] = useState<string[]>(["متاحة", "محجوزة", "تم التسليم"]);
  const [draftDate, setDraftDate] = useState("soon");
  const [appliedStatuses, setAppliedStatuses] = useState<string[]>([]);
  const [appliedDate, setAppliedDate] = useState<string | null>(null);
  const visibleUnits = units.map((unit) => editedUnits[unit.id] ?? unit).filter((unit) =>
    !excludedUnitIds.includes(unit.id) &&
    (search.trim() || unit.type === (selectedStock || "A+")) &&
    (status === "all" || unit.status === status) &&
    (appliedStatuses.length === 0 || appliedStatuses.includes(unit.status)) &&
    (appliedDate === null || (appliedDate === "soon" ? unit.status === "تنتهي قريبًا" : unit.status === "منتهية")) &&
    unit.id.toLowerCase().includes(search.trim().toLowerCase()),
  );

  const toggleDraftStatus = (value: string) => {
    setDraftStatuses((current) => current.includes(value)
      ? current.filter((item) => item !== value)
      : [...current, value]);
  };

  const openUnitDetails = (unit: InventoryUnit) => {
    setSelectedUnit(unit);
    unitDialogRef.current?.showModal();
  };

  const openEditDialog = () => {
    if (!selectedUnit) return;
    setEditType(selectedUnit.type);
    setEditDonated(toInputDate(selectedUnit.donated));
    unitDialogRef.current?.close();
    editDialogRef.current?.showModal();
  };

  const saveUnitEdit = () => {
    if (!selectedUnit || !editDonated || !editExpires) return;
    const updated = { ...selectedUnit, type: editType, donated: toDisplayDate(editDonated), expires: toDisplayDate(editExpires) };
    setEditedUnits((current) => ({ ...current, [updated.id]: updated }));
    setSelectedUnit(updated);
    editDialogRef.current?.close();
  };

  const stockCount = (type: string, count: number) => count + units.reduce((adjustment, unit) => {
    const edited = editedUnits[unit.id];
    if (edited) {
      if (unit.type === type) adjustment -= 1;
      if (edited.type === type) adjustment += 1;
    }
    if (excludedUnitIds.includes(unit.id) && (edited?.type ?? unit.type) === type) adjustment -= 1;
    return adjustment;
  }, 0);

  const openExcludeDialog = () => {
    setExcludeReason("");
    unitDialogRef.current?.close();
    excludeDialogRef.current?.showModal();
  };

  const confirmExclusion = () => {
    if (!selectedUnit || !excludeReason.trim()) return;
    setExcludedUnitIds((current) => [...current, selectedUnit.id]);
    excludeDialogRef.current?.close();
  };

  return (
    <div className="mx-auto max-w-[1240px] font-['IBM_Plex_Sans_Arabic']">
      <header className="relative mb-[28px] flex items-start justify-between gap-3 pt-[13px]">
        <div className="text-right">
          <h1 className="text-[20px] font-bold leading-[27px] text-[#233543]">مخزون الدم</h1>
          <p className="mt-[4px] text-[11px] leading-[15px] text-[#929fa7]">جميع وحدات الدم المسجلة في المخزون مع تفاصيل التخزين والصلاحية</p>
        </div>
        <div className="absolute left-0 top-[13px] flex flex-row items-start gap-[9px] p-0">
          <Link href="/HospitalDashboard/inventory/alerts" className="flex h-[34px] items-center gap-[7px] rounded-[11px] bg-[#FFF7E6] px-[12px] font-['IBM_Plex_Sans_Arabic'] text-[12px] font-semibold text-[#805c2b] shadow-[0_5px_12px_rgba(180,35,58,0.2)]"><span className="grid h-[16px] w-[16px] place-items-center rounded-full bg-[#ffe7ab] text-[11px]">!</span>تنبيهات المخزون</Link>
          <AddBloodUnitDialog compact />
        </div>
      </header>

      <section className="rounded-[14px] border border-[#e9edf0] bg-white px-[16px] pb-[17px] pt-[28px] shadow-[0_4px_16px_rgba(30,36,50,0.025)]">
        <div className="mb-[18px] text-right">
          <h2 className="text-[18px] font-bold leading-[24px] text-[#263746]">إدارة وحدات الدم</h2>
          <p className="mt-[2px] text-[11px] leading-[15px] text-[#a4adb3]">جميع وحدات الدم المسجلة في المخزون مع تفاصيل التخزين والصلاحية</p>
        </div>
        <div className="mb-[16px] flex items-center gap-[8px]">
          <label className="sr-only" htmlFor="inventory-search">ابحث عن وحدة بالرقم التسلسلي</label>
          <input id="inventory-search" type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="ابحث عن وحدة بالرقم التسلسلي..." className="h-[32px] w-[326px] max-w-full min-w-0 rounded-full border border-[#e8ecef] bg-white px-[14px] text-[11px] text-[#52616b] outline-none placeholder:text-[#a6afb4] focus:border-[#9e1b32]" />
          <div className="relative shrink-0">
            <span aria-hidden="true" className="absolute -left-[3px] -top-[3px] z-10 h-[8px] w-[8px] rounded-full bg-[#9e1b32]" />
            <button type="button" onClick={() => filterDialogRef.current?.showModal()} className="flex h-[32px] w-[72px] items-center justify-center gap-[5px] rounded-[9px] border border-[#e8ecef] bg-white text-[10px] text-[#65747d] hover:border-[#cbd4d8]"><SlidersHorizontal aria-hidden="true" className="h-[12px] w-[12px]" />فلاتر</button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-x-[5px] gap-y-[9px]">
          {stocks.map(([type, count]) => (
            <button type="button" key={type} onClick={() => setSelectedStock(type)} aria-pressed={selectedStock === type} className={`relative flex h-[110px] flex-col items-center justify-between border px-[8px] pb-[9px] pt-[9px] text-center transition-colors ${selectedStock === type ? "rounded-[14px] border-[#d66d7e] bg-[#fff7f8] shadow-[0_2px_6px_rgba(158,27,50,0.09)]" : type === "AB+" ? "rounded-[9px] border-[#f1e5cf] bg-white" : "rounded-[9px] border-[#e7eaee] bg-white"}`}>
              {type === "AB+" && selectedStock !== type && <span className="absolute right-[5px] top-[5px] rounded bg-[#fff3df] px-[3px] text-[8px] font-bold text-[#a87325]">منخفض</span>}
              {selectedStock === type && <span className="absolute right-[9px] top-[9px] rounded-full bg-[#9e1b32] px-[7px] py-[2px] text-[8px] font-bold text-white">محدد</span>}
              <span dir="ltr" className="font-['Tajawal'] text-[13px] font-extrabold leading-[15px] text-[#9e1b32]">{type}</span>
              <strong className="font-sans text-[18px] font-bold leading-[21px] text-[#1e303c]">{stockCount(type, count)}</strong>
              <span className="text-[11px] leading-[15px] text-[#98a5ad]">وحدة متاحة</span>
              <span className="h-[3px] w-full rounded-full bg-[#eef3f4]"><span className={`block h-full rounded-full ${selectedStock === type ? "w-full bg-[#15966e]" : type === "AB+" ? "w-[32%] bg-[#a6762b]" : "w-[70%] bg-[#15966e]"}`} /></span>
            </button>
          ))}
        </div>

        <div className="mb-[22px] mt-[22px] flex flex-wrap items-center justify-end gap-[7px] font-['Tajawal'] text-[13px] leading-[18px]">
          <button type="button" onClick={() => { setStatus("all"); setSearch(""); setSelectedStock(""); setAppliedStatuses([]); setAppliedDate(null); }} className="cursor-pointer rounded-full px-[6px] py-[5px] font-medium text-[#a51f36] transition hover:bg-[#fff3f5] focus-visible:outline-2 focus-visible:outline-[#9e1b32]">إعادة ضبط الكل</button>
          {([
            { value: "تنتهي قريبًا", label: "تنتهي قريبًا" },
            { value: "تم التسليم", label: "تم التسليم" },
            { value: "محجوزة", label: "محجوز" },
            { value: "متاحة", label: "متاح" },
          ] as const).map((item) => (
            <button key={item.value} type="button" onClick={() => setStatus(status === item.value ? "all" : item.value)} className={`inline-flex cursor-pointer items-center gap-[4px] rounded-full border px-[10px] py-[6px] transition hover:border-[#c8d0d5] focus-visible:outline-2 focus-visible:outline-[#9e1b32] ${status === item.value ? "border-[#d9a3ad] bg-[#fff4f6] text-[#9e1b32]" : "border-[#e1e6e9] bg-white text-[#697982]"}`}><span aria-hidden="true" className="text-[#96a2a9]">×</span>{item.label}</button>
          ))}
        </div>

        <div className="mt-[10px] overflow-x-auto">
          <table className="w-full min-w-[650px] border-separate border-spacing-0 text-right text-[11px]">
            <thead className="bg-[#f1f6f7] text-[#263946]"><tr>
              <th className="rounded-r-[7px] px-[10px] py-[9px] font-bold">رقم الوحدة</th>
              <th className="px-[10px] py-[9px] font-bold">فصيلة الدم</th>
              <th className="px-[10px] py-[9px] font-bold">تاريخ التبرع</th>
              <th className="px-[10px] py-[9px] font-bold">تاريخ الانتهاء</th>
              <th className="px-[10px] py-[9px] font-bold">الحالة</th>
              <th className="rounded-l-[7px] px-[10px] py-[9px]" aria-label="الإجراءات" />
            </tr></thead>
            <tbody>{visibleUnits.map((unit) => (
              <tr key={unit.id} onClick={() => openUnitDetails(unit)} onKeyDown={(event) => { if (event.target === event.currentTarget && (event.key === "Enter" || event.key === " ")) { event.preventDefault(); openUnitDetails(unit); } }} role="button" tabIndex={0} aria-label={`عرض تفاصيل الوحدة ${unit.id}`} className="cursor-pointer text-[#82909a] transition hover:bg-[#fafbfc] focus-visible:outline-2 focus-visible:outline-[#9e1b32]">
                <td dir="ltr" className="border-b border-[#eef1f2] px-[10px] py-[11px] text-right font-sans font-bold text-[#9e1b32]">{unit.id}</td>
                <td dir="ltr" className="border-b border-[#eef1f2] px-[10px] py-[11px] text-right font-sans font-bold text-[#9e1b32]">{unit.type}</td>
                <td dir="ltr" className="border-b border-[#eef1f2] px-[10px] py-[11px] text-right font-sans">{unit.donated}</td>
                <td dir="ltr" className="border-b border-[#eef1f2] px-[10px] py-[11px] text-right font-sans">{unit.expires}</td>
                <td className="border-b border-[#eef1f2] px-[10px] py-[11px]"><span className={`rounded-full px-[7px] py-[3px] font-semibold ${statusClasses[unit.status]}`}>● {unit.status}</span></td>
                <td className="border-b border-[#eef1f2] px-[10px] py-[11px]"><button type="button" onClick={(event) => { event.stopPropagation(); openUnitDetails(unit); }} aria-label={`تفاصيل الوحدة ${unit.id}`} className="text-[#91a0a9]"><MoreHorizontal className="h-[16px] w-[16px]" /></button></td>
              </tr>
            ))}</tbody>
          </table>
          {visibleUnits.length === 0 && <p className="py-5 text-center text-[11px] text-[#8a959a]">لا توجد وحدات مطابقة للبحث</p>}
        </div>
      </section>
      <dialog ref={filterDialogRef} dir="rtl" aria-labelledby="inventory-filter-title" className="fixed left-auto right-0 top-0 m-0 h-[80dvh] max-h-[80dvh] w-[min(260px,100vw)] max-w-none overflow-hidden border-0 border-l border-[#e8ecef] bg-white p-0 text-[#243746] shadow-[-6px_0_20px_rgba(30,36,50,0.08)] backdrop:bg-[#1f2937]/40 backdrop:backdrop-blur-[2px]">
        <div className="flex h-full flex-col font-['Tajawal']">
          <header className="flex h-[48px] shrink-0 items-center justify-between px-[16px]">
            <button type="button" onClick={() => filterDialogRef.current?.close()} aria-label="إغلاق الفلاتر" className="text-[22px] leading-none text-[#84929a]">×</button>
            <h2 id="inventory-filter-title" className="text-[15px] font-bold">الفلاتر</h2>
          </header>
          <div className="mb-[calc(20px+4dvh)] min-h-0 flex-1 overflow-y-auto border-y border-[#f6f7f8] px-[16px] pb-0 pt-[18px]">
            <h3 className="mb-[12px] text-[13px] font-bold">حالة الوحدة</h3>
            <div className="space-y-[4px]">
              {filterStatuses.map((item) => (
                <label key={item} className="flex h-[34px] cursor-pointer items-center justify-between text-[12px] text-[#65747d]">
                  <span>{item}</span>
                  <input type="checkbox" checked={draftStatuses.includes(item)} onChange={() => toggleDraftStatus(item)} className="h-[13px] w-[13px] accent-[#9e1b32]" />
                </label>
              ))}
            </div>
            <h3 className="mb-[10px] mt-[20px] text-[13px] font-bold">تاريخ الانتهاء</h3>
            <label className="flex h-[36px] cursor-pointer items-center justify-between text-[12px] text-[#65747d]"><span>تنتهي قريبًا (30 يومًا)</span><input type="radio" name="expiry-filter" checked={draftDate === "soon"} onChange={() => setDraftDate("soon")} className="h-[13px] w-[13px] accent-[#9e1b32]" /></label>
            <label className="flex h-[36px] cursor-pointer items-center justify-between text-[12px] text-[#65747d]"><span>منتهية</span><input type="radio" name="expiry-filter" checked={draftDate === "expired"} onChange={() => setDraftDate("expired")} className="h-[13px] w-[13px] accent-[#9e1b32]" /></label>
          </div>
          <footer className="flex shrink-0 gap-[8px] px-[16px] pb-[14px] pt-[10px]">
            <button type="button" onClick={() => { setAppliedStatuses(draftStatuses); setAppliedDate(draftDate); filterDialogRef.current?.close(); }} className="h-[36px] flex-1 rounded-[7px] bg-[#9e1b32] text-[12px] font-bold text-white shadow-[0_3px_7px_rgba(158,27,50,0.15)]">تطبيق الفلاتر</button>
            <button type="button" onClick={() => { setDraftStatuses([]); setDraftDate(""); setAppliedStatuses([]); setAppliedDate(null); filterDialogRef.current?.close(); }} className="h-[36px] flex-1 rounded-[7px] bg-[#f2f6f7] text-[12px] font-medium text-[#66767d]">إعادة ضبط</button>
          </footer>
        </div>
      </dialog>
      <dialog ref={unitDialogRef} dir="rtl" aria-labelledby="unit-details-title" onClick={(event) => { if (event.target === unitDialogRef.current) unitDialogRef.current.close(); }} className="m-auto w-[min(430px,calc(100vw-24px))] max-h-[calc(100dvh-18px)] overflow-y-auto rounded-[12px] border-0 bg-white p-0 font-['Tajawal'] text-[#263746] shadow-[0_18px_50px_rgba(20,32,42,0.2)] backdrop:bg-[#1f2937]/55">
        {selectedUnit && (
          <div className="flex min-h-[390px] flex-col px-[18px] pb-[18px] pt-[18px]">
            <header className="-mx-[18px] flex items-start justify-between border-b border-[#edf0f2] px-[18px] pb-[18px]">
              <div>
                <h2 id="unit-details-title" className="text-[16px] font-extrabold leading-[22px]">تفاصيل وحدة الدم <span dir="ltr" className="inline-block font-sans text-[14px] font-bold">{selectedUnit.id}</span></h2>
                <p className="mt-[7px] text-[10px] text-[#9ba6ac]">عرض بيانات الوحدة المسجلة في المخزون</p>
              </div>
              <button type="button" onClick={() => unitDialogRef.current?.close()} aria-label="إغلاق تفاصيل الوحدة" className="grid h-[18px] w-[18px] place-items-center text-[13px] text-[#576873]">×</button>
            </header>
            <section className="mt-[20px] flex h-[95px] items-start justify-between rounded-[12px] border border-[#e8ecef] px-[15px] py-[13px] shadow-[0_2px_8px_rgba(30,36,50,0.025)]">
              <div>
                <p className="text-[11px] text-[#9ba6ac]">فصيلة الدم</p>
                <p dir="ltr" className="mt-[2px] text-right font-sans text-[19px] font-bold leading-[22px] text-[#1f313d]">{selectedUnit.type}</p>
                <p className="mt-[2px] text-[10px] text-[#4F8C8D]">رمز الوحدة: <span dir="ltr" className="inline-block font-sans">{selectedUnit.id}</span></p>
              </div>
              <span className="grid h-[25px] w-[25px] place-items-center rounded-[7px] bg-[#fff0f3] text-[#bd3551]"><Heart size={13} strokeWidth={1.8} /></span>
            </section>
            <dl className="mt-[16px] grid grid-cols-2 gap-x-[14px] text-[12px]">
              <div className="border-b border-[#edf0f2] py-[8px]"><dt className="font-bold">تاريخ الجمع</dt><dd dir="ltr" className="mt-[2px] text-right font-sans text-[10px] text-[#a0abb1]">{selectedUnit.donated}</dd></div>
              <div className="border-b border-[#edf0f2] py-[8px]"><dt className="font-bold">تاريخ انتهاء الصلاحية</dt><dd dir="ltr" className="mt-[2px] text-right font-sans text-[10px] text-[#a0abb1]">{selectedUnit.expires}</dd></div>
              <div className="col-start-1 border-b border-[#edf0f2] py-[8px]"><dt className="font-bold">حالة الوحدة</dt><dd className="mt-[4px]"><span className={`rounded-full px-[7px] py-[3px] text-[10px] font-semibold ${statusClasses[selectedUnit.status]}`}>● {selectedUnit.status}</span></dd></div>
            </dl>
            <footer className="mt-auto flex items-center gap-[7px] pt-[10px]">
              <button type="button" onClick={openEditDialog} className="h-[32px] rounded-[7px] bg-[#9e1b32] px-[13px] text-[12px] font-bold text-white shadow-[0_3px_7px_rgba(158,27,50,0.15)]">تعديل البيانات</button>
              <button type="button" onClick={() => unitDialogRef.current?.close()} className="h-[32px] rounded-[7px] border border-[#e7eaed] px-[12px] text-[12px] font-bold text-[#61717b]">إغلاق</button>
              <button type="button" onClick={openExcludeDialog} className="mr-auto h-[32px] rounded-[7px] border border-[#e7eaed] px-[12px] text-[12px] font-bold text-[#9e1b32]">استبعاد الوحدة</button>
            </footer>
          </div>
        )}
      </dialog>
      <dialog ref={editDialogRef} dir="rtl" aria-labelledby="edit-unit-title" onClick={(event) => { if (event.target === editDialogRef.current) editDialogRef.current.close(); }} className="m-auto w-[min(475px,calc(100vw-24px))] max-h-[calc(100dvh-18px)] overflow-y-auto rounded-[12px] border-0 bg-white p-0 font-['Tajawal'] text-[#263746] shadow-[0_18px_50px_rgba(20,32,42,0.2)] backdrop:bg-[#1f2937]/55">
        {selectedUnit && <div className="px-[17px] pb-[19px] pt-[17px]">
          <header className="-mx-[17px] flex items-start justify-between border-b border-[#edf0f2] px-[17px] pb-[21px]">
            <div><p className="text-[11px] font-bold text-[#9e1b32]">إدارة المخزون</p><h2 id="edit-unit-title" className="mt-[5px] text-[18px] font-extrabold text-[#263746]">تعديل وحدة الدم <span dir="ltr" className="inline-block font-sans text-[16px] font-bold">{selectedUnit.id}</span></h2></div>
            <button type="button" onClick={() => editDialogRef.current?.close()} aria-label="إغلاق تعديل الوحدة" className="grid h-6 w-6 place-items-center text-[20px] text-[#536475]">×</button>
          </header>

          <fieldset className="mt-[25px]"><legend className="mb-[10px] text-[12px] font-bold text-[#536475]">فصيلة الدم</legend><div className="grid grid-cols-4 gap-[9px]">
            {bloodTypes.map((type) => <button key={type} type="button" onClick={() => setEditType(type)} aria-pressed={editType === type} dir="ltr" className={`h-[36px] rounded-[8px] border font-sans text-[11px] font-bold transition-colors ${editType === type ? "border-[#9e1b32] bg-[#9e1b32] text-white" : "border-[#e5e9ec] bg-white text-[#536475] hover:border-[#d6a0aa]"}`}>{type}</button>)}
          </div></fieldset>

          <div className="mt-[19px] grid grid-cols-2 gap-[12px]">
            <div><label htmlFor="edit-donation-date" className="mb-[7px] block text-[12px] font-bold text-[#536475]">تاريخ الجمع</label><div className="relative h-[36px] rounded-[8px] border border-[#e5e9ec] bg-white focus-within:border-[#9e1b32]"><span aria-hidden="true" dir="ltr" lang="en-US" className="flex h-full items-center px-2 font-sans text-[11px] text-[#536475]">{toEnglishDate(editDonated) || "MM/DD/YYYY"}</span><input id="edit-donation-date" type="date" lang="en-US" dir="ltr" value={editDonated} onChange={(event) => setEditDonated(event.target.value)} onClick={(event) => { try { event.currentTarget.showPicker(); } catch {} }} className="absolute inset-0 h-full w-full cursor-pointer opacity-0" /></div></div>
            <div><label htmlFor="edit-expiration-date" className="mb-[7px] block text-[12px] font-bold text-[#536475]">تاريخ انتهاء الصلاحية</label><input id="edit-expiration-date" type="text" readOnly lang="en-US" dir="ltr" value={toEnglishDate(editExpires)} placeholder="MM/DD/YYYY" className="h-[36px] w-full rounded-[8px] border border-[#e5e9ec] bg-[#f7f9fa] px-2 font-sans text-[11px] text-[#536475] outline-none" /></div>
          </div>

          <footer className="mt-[19px] flex items-center gap-[8px]"><button type="button" onClick={saveUnitEdit} className="h-[38px] rounded-[9px] bg-[#9e1b32] px-[17px] text-[12px] font-bold text-white shadow-[0_4px_9px_rgba(158,27,50,0.17)]">تعديل البيانات</button><button type="button" onClick={() => { editDialogRef.current?.close(); unitDialogRef.current?.showModal(); }} className="h-[38px] rounded-[9px] border border-[#e5e9ec] px-[14px] text-[12px] font-bold text-[#536475]">رجوع</button></footer>
        </div>}
      </dialog>
      <dialog ref={excludeDialogRef} dir="rtl" aria-labelledby="exclude-unit-title" onClick={(event) => { if (event.target === excludeDialogRef.current) excludeDialogRef.current.close(); }} className="m-auto w-[min(430px,calc(100vw-24px))] max-h-[calc(100dvh-18px)] overflow-y-auto rounded-[12px] border-0 bg-white p-0 font-['Tajawal'] text-[#263746] shadow-[0_18px_50px_rgba(20,32,42,0.2)] backdrop:bg-[#1f2937]/55">
        {selectedUnit && (
          <div className="flex min-h-[460px] flex-col px-[18px] pb-[18px] pt-[18px]">
            <header className="-mx-[18px] flex items-start justify-between border-b border-[#edf0f2] px-[18px] pb-[18px]">
              <div>
                <h2 id="exclude-unit-title" className="text-[16px] font-bold">استبعاد وحدة الدم <span dir="ltr" className="inline-block font-sans text-[14px]">{selectedUnit.id}</span></h2>
                <p className="mt-[5px] text-[10px] text-[#9aa5ac]">عرض بيانات الوحدة المسجلة في المخزون</p>
              </div>
              <button type="button" onClick={() => excludeDialogRef.current?.close()} aria-label="إغلاق استبعاد الوحدة" className="text-[17px] text-[#61717b]">×</button>
            </header>
            <section className="mt-[18px] flex h-[95px] items-start justify-between rounded-[12px] border border-[#e8ecef] px-[15px] py-[12px]">
              <div><p className="text-[11px] text-[#9ba6ac]">فصيلة الدم</p><p dir="ltr" className="mt-[3px] text-right font-sans text-[22px] font-bold leading-[25px]">{selectedUnit.type}</p><p className="mt-[3px] text-[10px] text-[#4F8C8D]">رمز الوحدة: <span dir="ltr" className="inline-block font-sans">{selectedUnit.id}</span></p></div>
              <span className="grid h-[28px] w-[28px] place-items-center rounded-[8px] bg-[#fff0f3] text-[#bd3551]"><Heart size={15} strokeWidth={1.8} /></span>
            </section>
            <dl className="mt-[14px] grid grid-cols-2 gap-x-[14px] text-[12px]">
              <div className="border-b border-[#edf0f2] py-[8px]"><dt className="font-bold">تاريخ الجمع</dt><dd dir="ltr" className="mt-[3px] text-right font-sans text-[10px] text-[#a0abb1]">{selectedUnit.donated}</dd></div>
              <div className="border-b border-[#edf0f2] py-[8px]"><dt className="font-bold">تاريخ انتهاء الصلاحية</dt><dd dir="ltr" className="mt-[3px] text-right font-sans text-[10px] text-[#a0abb1]">{selectedUnit.expires}</dd></div>
              <div className="col-start-1 border-b border-[#edf0f2] py-[8px]"><dt className="font-bold">حالة الوحدة</dt><dd className="mt-[4px]"><span className={`rounded-full px-[7px] py-[3px] text-[10px] font-semibold ${statusClasses[selectedUnit.status]}`}>● {selectedUnit.status}</span></dd></div>
            </dl>
            <div className="mt-[14px]">
              <label htmlFor="exclusion-reason" className="mb-[6px] block text-[12px] font-bold">سبب الاستبعاد <span className="text-[#9e1b32]">*</span></label>
              <textarea id="exclusion-reason" value={excludeReason} onChange={(event) => setExcludeReason(event.target.value)} placeholder="حالة طبية في غرفة العمليات" rows={3} className="w-full resize-none rounded-[8px] border border-[#e7a3ae] px-[12px] py-[9px] text-[11px] outline-none placeholder:text-[#9ba6ac] focus:border-[#9e1b32]" />
            </div>
            <footer className="mt-auto flex items-center justify-between pt-[12px]">
              <button type="button" onClick={() => { excludeDialogRef.current?.close(); unitDialogRef.current?.showModal(); }} className="h-[33px] rounded-[7px] border border-[#e7eaed] px-[13px] text-[12px] font-bold text-[#61717b]">رجوع</button>
              <button type="button" onClick={confirmExclusion} disabled={!excludeReason.trim()} className="h-[33px] rounded-[7px] bg-[#9e1b32] px-[12px] text-[12px] font-bold text-white disabled:cursor-not-allowed disabled:opacity-50">تأكيد الاستبعاد</button>
            </footer>
          </div>
        )}
      </dialog>
    </div>
  );
}
