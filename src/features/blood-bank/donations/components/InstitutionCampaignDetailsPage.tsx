"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/src/lib/api/errors";
import { useInstitutionCampaign } from "../hooks/useInstitutionCampaign";
import { cancelInstitutionCampaign, updateInstitutionCampaign, type InstitutionCampaign } from "../services/campaign.service";
import {
  ArrowRight,
  Building2,
  CalendarDays,
  MapPin,
  Target,
  Info,
  TriangleAlert,
  X,
  type LucideIcon,
} from "lucide-react";

const editableBloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const gazaGovernorates = ["شمال غزة", "غزة", "دير البلح", "خان يونس", "رفح"];
const statusLabels: Record<string, string> = { published: "قادمة", active: "جارية", completed: "مكتملة", cancelled: "ملغاة", draft: "مسودة" };

function toCampaignDetails(campaign: InstitutionCampaign) {
  const startDate = campaign.start_date.slice(0, 10);
  const endDate = campaign.end_date?.slice(0, 10) ?? "";
  const startTime = campaign.start_time.slice(0, 5);
  const endTime = campaign.end_time?.slice(0, 5) ?? "";
  return {
    code: campaign.campaign_number,
    title: campaign.title,
    description: campaign.description,
    status: campaign.status_label ?? statusLabels[campaign.status] ?? campaign.status,
    date: formatCampaignDate(startDate, endDate),
    time: [formatTime(startTime), formatTime(endTime)].filter(Boolean).join(" - "),
    location: [campaign.governorate, campaign.area].filter(Boolean).join(" - "),
    venue: campaign.location,
    target: campaign.target_count ?? "—",
    registered: campaign.stats?.registered_count ?? 0,
    bloodTypes: campaign.blood_types,
    startDate, endDate, startTime, endTime,
    governorate: campaign.governorate,
    region: campaign.area,
    notes: campaign.notes ?? "",
  };
}

const campaignDetails = [
  {
    code: "CP-2026-0031",
    title: "حملة قطرة حياة",
    description: "حملة تبرع بالدم تهدف إلى دعم مخزون الدم وتوفير الفصائل المطلوبة للحالات المحتاجة.",
    status: "قادمة",
    date: "24 سبتمبر 2026",
    time: "09:00 ص - 03:00 م",
    location: "رام الله",
    venue: "بلدية رام الله - المدخل الشرقي",
    target: 50,
    registered: 5,
    bloodTypes: ["O+", "O-", "A-"],
    startDate: "2026-09-24",
    endDate: "2026-09-24",
    startTime: "09:00",
    endTime: "15:00",
    governorate: "رام الله والبيرة",
    region: "رام الله",
    notes: "",
  },
  {
    code: "CP-2026-0019",
    title: "تبرعك أمل",
    description: "حملة مجتمعية للتبرع بالدم ومساندة المرضى عبر توفير وحدات دم آمنة وفي الوقت المناسب.",
    status: "مكتملة",
    date: "27 سبتمبر 2026",
    time: "09:00 ص - 03:00 م",
    location: "البيرة",
    venue: "مركز شباب البيرة",
    target: 40,
    registered: 18,
    bloodTypes: ["A+", "B+", "AB+", "O+"],
    startDate: "2026-09-27",
    endDate: "2026-09-27",
    startTime: "09:00",
    endTime: "15:00",
    governorate: "رام الله والبيرة",
    region: "البيرة",
    notes: "",
  },
  {
    code: "CP-2026-0019",
    title: "قطرة منك حياة لغيرك",
    description: "مبادرة تطوعية لتشجيع أفراد المجتمع على التبرع والمساهمة في إنقاذ حياة المرضى.",
    status: "ملغاة",
    date: "27 سبتمبر 2026",
    time: "09:00 ص - 03:00 م",
    location: "البيرة",
    venue: "مركز شباب البيرة",
    target: 35,
    registered: 9,
    bloodTypes: ["A+", "B+", "AB+", "O+"],
    startDate: "2026-09-27",
    endDate: "2026-09-27",
    startTime: "09:00",
    endTime: "15:00",
    governorate: "رام الله والبيرة",
    region: "البيرة",
    notes: "",
  },
  {
    code: "CP-2026-0019",
    title: "قطرة منك حياة لغيرك",
    description: "حملة جارية لاستقبال المتبرعين ودعم احتياجات بنك الدم من الفصائل المطلوبة.",
    status: "جارية",
    date: "28 سبتمبر 2026",
    time: "09:00 ص - 03:00 م",
    location: "البيرة",
    venue: "مركز شباب البيرة",
    target: 50,
    registered: 27,
    bloodTypes: ["A+", "B+", "AB+"],
    startDate: "2026-09-28",
    endDate: "2026-09-28",
    startTime: "09:00",
    endTime: "15:00",
    governorate: "رام الله والبيرة",
    region: "البيرة",
    notes: "",
  },
];

export default function InstitutionCampaignDetailsPage({
  campaignNumber,
  campaignsHref,
}: {
  campaignNumber: number | string;
  campaignsHref: string;
}) {
  const isInstitution = campaignsHref.startsWith("/HospitalDashboard/") || campaignsHref.startsWith("/BloodBankDashboard/");
  const campaignData = useInstitutionCampaign(campaignNumber, isInstitution);
  const [localCampaign, setCampaign] = useState(campaignDetails[Number(campaignNumber) - 1] ?? campaignDetails[0]);
  const campaign = isInstitution && campaignData.campaign ? toCampaignDetails(campaignData.campaign) : localCampaign;
  const [editOpen, setEditOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [selectedBloodTypes, setSelectedBloodTypes] = useState<string[]>(campaign.bloodTypes);
  const pending = useRef(false);
  const [submitting, setSubmitting] = useState(false);
  const canEdit = !isInstitution || ["published", "draft"].includes(campaignData.campaign?.status ?? "");
  const canCancel = !isInstitution || ["published", "active", "draft"].includes(campaignData.campaign?.status ?? "");

  function closeEdit() { if (!pending.current) setEditOpen(false); }
  function closeCancel() { if (!pending.current) setCancelOpen(false); }

  async function saveCampaign(form: HTMLFormElement) {
    if (pending.current || !canEdit || !form.reportValidity()) return;
    const values = Object.fromEntries(Array.from(new FormData(form).entries()).map(([key, value]) => [key, String(value).trim()]));
    if (!values.name || !values.description || !values.address || !selectedBloodTypes.length) {
      toast.error("يرجى تعبئة تفاصيل الحملة واختيار الفصائل المستهدفة.");
      return;
    }
    if (values.endDate && values.endDate < values.startDate) {
      toast.error("يجب ألا يكون تاريخ انتهاء الحملة قبل تاريخ بدايتها.");
      return;
    }
    if (values.endTime && (!values.endDate || values.endDate === values.startDate) && values.endTime <= values.startTime) {
      toast.error("يجب أن يكون وقت نهاية الحملة بعد وقت بدايتها.");
      return;
    }
    const targetCount = values.targetCount ? Number(values.targetCount) : null;
    if (targetCount !== null && (!Number.isInteger(targetCount) || targetCount < 1)) {
      toast.error("يرجى إدخال عدد صحيح موجب للمشاركين.");
      return;
    }
    pending.current = true;
    setSubmitting(true);
    try {
      await updateInstitutionCampaign(campaignNumber, {
        title: values.name, description: values.description,
        start_date: values.startDate, end_date: values.endDate || null,
        start_time: values.startTime, end_time: values.endTime || null,
        governorate: values.governorate, area: values.region, location: values.address,
        target_count: targetCount, notes: values.notes, blood_types: [...selectedBloodTypes],
      });
      setEditOpen(false);
      campaignData.reload();
      toast.success("تم حفظ تعديلات الحملة بنجاح.");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      pending.current = false;
      setSubmitting(false);
    }
  }

  async function cancelCampaign() {
    if (pending.current || !canCancel) return;
    pending.current = true;
    setSubmitting(true);
    try {
      await cancelInstitutionCampaign(campaignNumber);
      setCancelOpen(false);
      campaignData.reload();
      toast.success("تم إلغاء الحملة بنجاح.");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      pending.current = false;
      setSubmitting(false);
    }
  }

  if (isInstitution && (campaignData.error || !campaignData.campaign)) {
    return <div className="mx-auto w-full max-w-[1140px] pb-10 font-['Tajawal']">
      <Link href={campaignsHref} className="inline-flex items-center gap-2 text-sm font-semibold text-[#64748b]"><ArrowRight className="h-4 w-4" />العودة للحملات</Link>
      <p role={campaignData.error ? "alert" : "status"} className="mt-6 text-sm text-[#64748b]">{campaignData.error ?? "جارٍ تحميل تفاصيل الحملة..."}</p>
    </div>;
  }

  return (
    <div className="mx-auto w-full max-w-[1140px] pb-10 font-['Tajawal']">
      <div className="mb-6 flex items-center justify-start">
        <Link href={campaignsHref} className="group inline-flex items-center gap-2 text-sm font-semibold text-[#64748b] transition-colors hover:text-[#1e293b]">
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          العودة للحملات
        </Link>
      </div>

      <section className="relative mb-8 overflow-hidden rounded-[24px] bg-[linear-gradient(86.3deg,#70C7C9_-9.03%,#376263_100.33%)] px-6 py-5 text-white shadow-[0_10px_30px_rgba(55,98,99,0.15)] sm:px-8 sm:py-6">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div className="flex-1 text-right">
            <div className="flex flex-col items-start">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1 text-xs font-bold text-[#214f52] shadow-xs">
                <span className="h-2 w-2 rounded-full bg-[#285f8d]" />
                {campaign.status}
              </span>
              <span dir="ltr" className="my-2.5 text-[11px] font-medium tracking-wider text-white/75">{campaign.code}</span>
            </div>
            <h1 className="mb-2 text-2xl font-black leading-tight tracking-tight text-white sm:text-3xl">{campaign.title}</h1>
            <p className="max-w-2xl text-[13px] font-normal leading-relaxed text-white/85 sm:text-sm">{campaign.description}</p>
            <div className="mt-4 flex items-center gap-2 text-[13px] font-semibold text-white/90">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-white/15">
                <Building2 className="h-3.5 w-3.5" />
              </span>
              تنظمها: {isInstitution ? campaignData.campaign?.institution?.name ?? "—" : "مستشفى بنك الدم"}
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 text-center lg:flex-col lg:border-r lg:border-white/20 lg:pr-8">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 shadow-inner">
              <CalendarDays className="h-5 w-5" />
            </span>
            <div className="flex flex-col items-center" dir="ltr">
              <span className="text-[19px] font-black leading-none">{campaign.date}</span>
              <span className="mt-1.5 text-xs font-medium leading-none text-white/80">{campaign.time}</span>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-8">
          <section className="rounded-[24px] border border-[#f1f3f5] bg-white p-6 text-right shadow-[0_4px_20px_rgba(0,0,0,0.03)] sm:p-7">
            <h2 className="mb-5 text-xl font-black text-[#1a2332]">تفاصيل الحملة</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <DetailCard icon={CalendarDays} label="التاريخ والوقت" value={campaign.date} subValue={campaign.time} />
              <DetailCard icon={MapPin} label="الموقع" value={campaign.location} subValue={campaign.venue} />
              <DetailCard icon={Target} label="العدد المستهدف" value={String(campaign.target)} subValue="متبرع" />
            </div>
          </section>

          <section className="rounded-[24px] border border-[#f1f3f5] bg-white p-6 text-right shadow-[0_4px_20px_rgba(0,0,0,0.03)] sm:p-7">
            <h2 className="mb-2 text-[22px] font-black text-[#1a2332]">الفصائل المستهدفة</h2>
            <p className="mb-5 text-[13px] text-[#64748b]">الفصائل المطلوبة ضمن هذه الحملة:</p>
            <div className="flex flex-wrap items-center gap-3" dir="rtl">
              {campaign.bloodTypes.map((type) => (
                <span key={type} dir="ltr" className="min-w-[58px] rounded-xl border border-[#f7d6dd] bg-[#fcedf0] px-5 py-2.5 text-center text-[15px] font-black text-[#991b30]">{type}</span>
              ))}
            </div>
          </section>
        </div>

        <aside className="lg:col-span-4">
          <section className="rounded-[18px] border border-[#edf0f1] bg-white p-5 text-right shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
            <h2 className="mb-4 text-base font-extrabold text-[#17413f]">الإجراءات</h2>
            <div className="space-y-3">
              <button
                type="button"
                disabled={!canEdit || submitting || (isInstitution && campaignData.loading)}
                onClick={() => {
                  setSelectedBloodTypes(campaign.bloodTypes);
                  setEditOpen(true);
                }}
                className="h-11 w-full rounded-[9px] bg-[#ad1e3a] text-sm font-bold text-white shadow-[0_7px_16px_rgba(173,30,58,0.22)] transition hover:bg-[#961a32]"
              >
                تعديل الحملة
              </button>
              <button type="button" disabled={!canCancel || submitting || (isInstitution && campaignData.loading)} onClick={() => setCancelOpen(true)} className="h-11 w-full rounded-[9px] border border-[#e5d9da] bg-white text-sm font-bold text-[#263940] transition hover:bg-[#faf7f7]">
                إلغاء الحملة
              </button>
            </div>
          </section>
        </aside>
      </div>

      {editOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#26313b]/55 p-3"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeEdit();
          }}
        >
          <section role="dialog" aria-modal="true" aria-labelledby="edit-campaign-title" className="flex max-h-[88dvh] w-full max-w-[500px] flex-col overflow-hidden rounded-[18px] bg-white text-[#263940] shadow-[0_22px_65px_rgba(20,29,37,0.28)]">
            <header className="flex items-start justify-between border-b border-[#edf0f1] px-6 py-4">
              <div className="text-right">
                <span className="text-[10px] font-bold text-[#b21f3c]">تعديل الحملة</span>
                <h2 id="edit-campaign-title" className="mt-0.5 text-xl font-extrabold text-[#182f39]">تعديل حملة التبرع</h2>
              </div>
              <button type="button" disabled={submitting} onClick={closeEdit} aria-label="إغلاق" className="grid h-8 w-8 place-items-center rounded-full text-[#596a71] transition hover:bg-slate-100">
                <X className="h-4 w-4" strokeWidth={1.8} />
              </button>
            </header>

            <form
              className="min-h-0 flex-1 space-y-6 overflow-y-auto px-6 py-5"
              aria-busy={submitting}
              onSubmit={(event) => {
                event.preventDefault();
                if (isInstitution) { void saveCampaign(event.currentTarget); return; }
                const values = Object.fromEntries(new FormData(event.currentTarget).entries());
                const startDate = String(values.startDate);
                const endDate = String(values.endDate);
                const startTime = String(values.startTime);
                const endTime = String(values.endTime);
                setCampaign((current) => ({
                  ...current,
                  title: String(values.name),
                  description: String(values.description),
                  target: Number(values.targetCount) || current.target,
                  startDate,
                  endDate,
                  startTime,
                  endTime,
                  date: formatCampaignDate(startDate, endDate),
                  time: `${formatTime(startTime)} - ${formatTime(endTime)}`,
                  governorate: String(values.governorate),
                  region: String(values.region),
                  location: String(values.region),
                  venue: String(values.address),
                  notes: String(values.notes),
                  bloodTypes: selectedBloodTypes,
                }));
                setEditOpen(false);
              }}
            >
              <fieldset className="space-y-4">
                <legend className="mb-4 flex items-center gap-2 text-sm font-extrabold text-[#263940]"><span className="grid h-5 w-5 place-items-center rounded-full bg-[#fbecef] text-[10px] font-bold text-[#ad1e3a]">1</span>تفاصيل الحملة</legend>
                <EditField label="اسم الحملة" required><input name="name" defaultValue={campaign.title} required className={editInputClassName} /></EditField>
                <EditField label="وصف الحملة" required><textarea name="description" defaultValue={campaign.description} required rows={3} className={`${editInputClassName} min-h-[72px] resize-none py-3`} /></EditField>
              </fieldset>

              <fieldset>
                <legend className="mb-3 text-xs font-bold text-[#263940]">الفصائل المستهدفة <span className="text-[#ad1e3a]">*</span></legend>
                <button type="button" onClick={() => setSelectedBloodTypes(selectedBloodTypes.length === editableBloodTypes.length ? [] : editableBloodTypes)} className="mb-2 h-9 w-full rounded-lg border border-[#e9edef] bg-white text-[11px] font-semibold text-[#53646b] hover:bg-slate-50">جميع الفصائل</button>
                <div className="grid grid-cols-4 gap-2" dir="ltr">
                  {editableBloodTypes.map((type) => {
                    const selected = selectedBloodTypes.includes(type);
                    return (
                      <button key={type} type="button" onClick={() => setSelectedBloodTypes((current) => selected ? current.filter((item) => item !== type) : [...current, type])} className={`inline-flex h-10 items-center justify-center gap-2 rounded-lg border text-[11px] font-bold transition ${selected ? "border-[#ad1e3a] bg-[#ad1e3a] text-white shadow-[0_5px_12px_rgba(173,30,58,0.22)]" : "border-[#eaedef] bg-white text-[#45575e]"}`}>
                        {type}{selected && <span className="text-sm leading-none">✓</span>}
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              <EditField label="العدد المستهدف من المشاركين / التبرعات (كحد أقصى)"><input name="targetCount" defaultValue={campaign.target === "—" ? "" : campaign.target} type="number" min="1" max="500" className={editInputClassName} /></EditField>

              <fieldset className="space-y-4 border-t border-[#edf0f1] pt-5">
                <legend className="mb-4 flex items-center gap-2 text-sm font-extrabold text-[#263940]"><span className="grid h-5 w-5 place-items-center rounded-full bg-[#fbecef] text-[10px] font-bold text-[#ad1e3a]">2</span>الموقع والمكان</legend>
                <div className="grid gap-3 sm:grid-cols-2">
                  <EditField label="تاريخ بداية الحملة" required><input name="startDate" defaultValue={campaign.startDate} required type="date" className={editInputClassName} /></EditField>
                  <EditField label="تاريخ انتهاء الحملة"><input name="endDate" defaultValue={campaign.endDate} type="date" className={editInputClassName} /></EditField>
                  <EditField label="وقت بداية الحملة" required><input name="startTime" defaultValue={campaign.startTime} required type="time" className={editInputClassName} /></EditField>
                  <EditField label="وقت نهاية الحملة"><input name="endTime" defaultValue={campaign.endTime} type="time" className={editInputClassName} /></EditField>
                  <EditField label="المحافظة" required><select name="governorate" defaultValue={campaign.governorate} required className={editInputClassName}>{!gazaGovernorates.includes(campaign.governorate) && <option value={campaign.governorate}>{campaign.governorate}</option>}{gazaGovernorates.map((governorate) => <option key={governorate}>{governorate}</option>)}</select></EditField>
                  <EditField label="المنطقة" required><input name="region" defaultValue={campaign.region} required className={editInputClassName} /></EditField>
                </div>
                <EditField label="مكان الحملة والعنوان التفصيلي" required><input name="address" defaultValue={campaign.venue} required className={editInputClassName} /></EditField>
                <EditField label="ملاحظات"><textarea name="notes" defaultValue={campaign.notes} rows={3} className={`${editInputClassName} min-h-[72px] resize-none py-3`} /></EditField>
              </fieldset>

              <div className="flex items-start gap-2 rounded-lg bg-[#eef9f8] px-4 py-3 text-[10px] leading-5 text-[#54827f]"><Info className="mt-0.5 h-4 w-4 shrink-0" /><p>سيتم تحديث معلومات الحملة الظاهرة للمتبرعين بعد حفظ التعديلات.</p></div>
              <footer dir="ltr" className="flex items-center justify-between pt-1">
                <button type="button" disabled={submitting} dir="rtl" onClick={closeEdit} className="h-10 rounded-lg border border-[#dde3e5] bg-white px-5 text-xs font-bold text-[#53636a] hover:bg-slate-50">إلغاء</button>
                <button type="submit" disabled={submitting} dir="rtl" className="h-10 rounded-lg bg-[#ad1e3a] px-6 text-xs font-bold text-white shadow-[0_7px_16px_rgba(173,30,58,0.22)] hover:bg-[#961a32]">حفظ التعديلات</button>
              </footer>
            </form>
          </section>
        </div>
      )}

      {cancelOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#26313b]/55 p-3"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeCancel();
          }}
        >
          <section role="alertdialog" aria-modal="true" aria-labelledby="cancel-campaign-title" className="relative w-full max-w-[480px] rounded-[17px] bg-white px-7 pb-7 pt-6 text-center font-['Tajawal'] shadow-[0_22px_65px_rgba(20,29,37,0.28)]">
            <button type="button" disabled={submitting} onClick={closeCancel} aria-label="إغلاق" className="absolute left-4 top-4 grid h-8 w-8 place-items-center rounded-full bg-[#f4f6f6] text-[#526168] transition hover:bg-[#eaeeee]">
              <X className="h-4 w-4" strokeWidth={1.8} />
            </button>
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#fbe9ed] text-[#b21f3c]">
              <TriangleAlert className="h-6 w-6" strokeWidth={1.8} />
            </span>
            <h2 id="cancel-campaign-title" className="mt-3 text-xl font-extrabold text-[#203942]">إلغاء الحملة؟</h2>
            <p className="mx-auto mt-2 max-w-[390px] text-[12px] leading-6 text-[#78878d]">
              ستتوقف الحملة عن الظهور في السجل ولن تُرسل مشاركات جديدة، وسيتم إعلام المتبرعين المسجلين.
            </p>
            <div dir="ltr" className="mt-5 flex items-center justify-center gap-3">
              <button
                type="button"
                dir="rtl"
                disabled={submitting}
                onClick={() => {
                  if (isInstitution) { void cancelCampaign(); return; }
                  setCampaign((current) => ({ ...current, status: "ملغاة" }));
                  setCancelOpen(false);
                }}
                className="h-11 min-w-[126px] rounded-[11px] bg-[#fbe9ed] px-5 text-sm font-bold text-[#b21f3c] transition hover:bg-[#f7dce2]"
              >
                تأكيد الإلغاء
              </button>
              <button type="button" disabled={submitting} dir="rtl" onClick={closeCancel} className="h-11 min-w-[82px] rounded-[11px] border border-[#dfe5e7] bg-white px-5 text-sm font-bold text-[#344850] transition hover:bg-slate-50">
                تراجع
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

const editInputClassName = "h-10 w-full rounded-lg border border-[#eaedef] bg-white px-3 text-[11px] text-[#34474f] outline-none transition focus:border-[#ad1e3a]/30 focus:ring-2 focus:ring-[#ad1e3a]/6";

function EditField({ label, required = false, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return <label className="block text-right"><span className="mb-1.5 block text-[11px] font-bold text-[#34474f]">{label} {required && <span className="text-[#ad1e3a]">*</span>}</span>{children}</label>;
}

function formatCampaignDate(startDate: string, endDate: string) {
  const formatter = new Intl.DateTimeFormat("ar", { day: "numeric", month: "long", year: "numeric" });
  const start = startDate ? formatter.format(new Date(`${startDate}T12:00:00`)) : "";
  const end = endDate ? formatter.format(new Date(`${endDate}T12:00:00`)) : "";
  return end && end !== start ? `${start} - ${end}` : start;
}

function formatTime(value: string) {
  if (!value) return "";
  const [hours, minutes] = value.split(":").map(Number);
  const suffix = hours >= 12 ? "م" : "ص";
  const displayHours = hours % 12 || 12;
  return `${String(displayHours).padStart(2, "0")}:${String(minutes).padStart(2, "0")} ${suffix}`;
}

function DetailCard({ icon: Icon, label, value, subValue }: { icon: LucideIcon; label: string; value: string; subValue: string }) {
  return (
    <article className="flex items-center gap-3.5 rounded-[18px] border border-[#eef2f6] bg-[#f8f9fb] p-4">
      <Icon className="h-6 w-6 shrink-0 text-[#991b30]" strokeWidth={2} />
      <div className="min-w-0 text-right">
        <span className="mb-0.5 block text-[11px] font-medium text-[#64748b]">{label}</span>
        <strong className="block truncate text-[13px] font-bold text-[#1e293b]">{value}</strong>
        <span className="mt-0.5 block truncate text-[11px] font-medium text-[#64748b]">{subValue}</span>
      </div>
    </article>
  );
}
