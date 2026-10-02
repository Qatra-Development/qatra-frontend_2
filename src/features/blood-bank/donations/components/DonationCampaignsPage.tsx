"use client";

import { useRef, useState } from "react";
import { useInstitutionCampaigns } from "../hooks/useInstitutionCampaigns";
import type { InstitutionCampaign } from "../services/campaign.service";
import { toast } from "sonner";
import { backendProxyUrl } from "@/src/config/api";
import { apiClient } from "@/src/lib/api/client";
import { getApiErrorMessage } from "@/src/lib/api/errors";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  CheckCheck,
  Clock3,
  Info,
  MapPin,
  Plus,
  UserRound,
  UsersRound,
  X,
} from "lucide-react";

const campaignFilters = ["الكل", "قادمة", "جارية", "مكتملة", "ملغاة"] as const;
type CampaignFilter = (typeof campaignFilters)[number];
const campaignBloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const gazaGovernorates = ["شمال غزة", "غزة", "دير البلح", "خان يونس", "رفح"];

type CampaignDraft = {
  id?: number | string;
  values: Record<string, string>;
  bloodTypes: string[];
};

const campaigns = [
  {
    detailNumber: 1,
    id: "CP-2026-0031",
    day: "24",
    month: "سبتمبر",
    time: "09:00",
    title: "حملة قطرة حياة",
    location: "رام الله - بلدية رام الله - المدرج الشرقي",
    status: "قادمة",
    statusClass: "bg-[#e8f3fa] text-[#32789c]",
    bloodTypes: ["O+", "O-", "A-"],
  },
  {
    detailNumber: 2,
    id: "CP-2026-0019",
    day: "27",
    month: "سبتمبر",
    time: "09:00",
    title: "تبرعك أمل",
    location: "البيرة - مركز شباب البيرة",
    status: "مكتملة",
    statusClass: "bg-[#edf7f1] text-[#4d8263]",
    bloodTypes: ["A+", "B+", "AB+", "O+"],
  },
  {
    detailNumber: 3,
    id: "CP-2026-0019",
    day: "27",
    month: "سبتمبر",
    time: "09:00",
    title: "قطرة منك حياة لغيرك",
    location: "البيرة - مركز شباب البيرة",
    status: "ملغاة",
    statusClass: "bg-[#fcecef] text-[#b12842]",
    bloodTypes: ["A+", "B+", "AB+", "O+"],
  },
  {
    detailNumber: 4,
    id: "CP-2026-0019",
    day: "28",
    month: "سبتمبر",
    time: "09:00",
    title: "قطرة منك حياة لغيرك",
    location: "البيرة - مركز شباب البيرة",
    status: "جارية",
    statusClass: "bg-[#f8efd9] text-[#9b7223]",
    bloodTypes: ["A+", "B+", "AB+"],
  },
];

const stats = [
  {
    label: "الحملات القادمة",
    apiKey: "upcoming_campaigns",
    value: "1",
    icon: CalendarDays,
    iconClass: "text-[#b51f3b]",
    bubbleClass: "bg-[#fde9e8]",
  },
  {
    label: "المتبرعون المسجلون",
    apiKey: "registered_participants",
    value: "5",
    icon: UsersRound,
    iconClass: "text-[#168870]",
    bubbleClass: "bg-[#edf9f5]",
  },
  {
    label: "تبرعات موثقة",
    apiKey: "verified_donations",
    value: "3",
    icon: CheckCheck,
    iconClass: "text-[#a96970]",
    bubbleClass: "bg-[#f5f4f4]",
  },
] as const;

const campaignStatuses: Record<string, { label: string; className: string }> = {
  published: { label: "قادمة", className: "bg-[#e8f3fa] text-[#32789c]" },
  active: { label: "جارية", className: "bg-[#f8efd9] text-[#9b7223]" },
  completed: { label: "مكتملة", className: "bg-[#edf7f1] text-[#4d8263]" },
  cancelled: { label: "ملغاة", className: "bg-[#fcecef] text-[#b12842]" },
};

function toCampaignRow(campaign: InstitutionCampaign) {
  const date = new Date(`${campaign.start_date.slice(0, 10)}T12:00:00`);
  const validDate = !Number.isNaN(date.getTime());
  const status = campaignStatuses[campaign.status];
  return {
    detailNumber: campaign.id,
    id: campaign.campaign_number,
    day: validDate ? String(date.getDate()) : "—",
    month: validDate ? new Intl.DateTimeFormat("ar", { month: "long" }).format(date) : "—",
    time: campaign.start_time.slice(0, 5),
    title: campaign.title,
    location: [campaign.area, campaign.location].filter(Boolean).join(" - "),
    status: status?.label ?? campaign.status_label ?? campaign.status,
    statusClass: status?.className ?? "bg-[#e8f3fa] text-[#32789c]",
    bloodTypes: campaign.blood_types,
  };
}

function toCampaignDraft(campaign: InstitutionCampaign): CampaignDraft {
  return {
    id: campaign.id,
    bloodTypes: campaign.blood_types ?? [],
    values: {
      name: campaign.title ?? "",
      description: campaign.description ?? "",
      startDate: campaign.start_date?.slice(0, 10) ?? "",
      endDate: campaign.end_date?.slice(0, 10) ?? "",
      startTime: campaign.start_time?.slice(0, 5) ?? "",
      endTime: campaign.end_time?.slice(0, 5) ?? "",
      governorate: campaign.governorate ?? "",
      region: campaign.area ?? "",
      address: campaign.location ?? "",
      targetCount: campaign.target_count == null ? "" : String(campaign.target_count),
      notes: campaign.notes ?? "",
    },
  };
}

export default function DonationCampaignsPage() {
  const pathname = usePathname();
  const [activeFilter, setActiveFilter] = useState<CampaignFilter>("الكل");
  const [createCampaignOpen, setCreateCampaignOpen] = useState(false);
  const [selectedBloodTypes, setSelectedBloodTypes] = useState<string[]>([]);
  const [draft, setDraft] = useState<CampaignDraft | null>(null);
  const [editingDraft, setEditingDraft] = useState(false);
  const pending = useRef(false);
  const [submitting, setSubmitting] = useState(false);
  const isInstitutionCampaigns = ["/HospitalDashboard/donations/campaigns", "/BloodBankDashboard/donations/campaigns"].includes(pathname.replace(/\/+$/, ""));
  const campaignData = useInstitutionCampaigns(isInstitutionCampaigns);
  const latestSavedDraft = campaignData.campaigns
    .filter((campaign) => campaign.status === "draft")
    .sort((a, b) => (b.updated_at ?? b.created_at ?? "").localeCompare(a.updated_at ?? a.created_at ?? "") || Number(b.id) - Number(a.id))[0];
  const availableDraft = draft ?? (latestSavedDraft ? toCampaignDraft(latestSavedDraft) : null);
  const sourceCampaigns = isInstitutionCampaigns
    ? campaignData.campaigns.filter((campaign) => campaign.status !== "draft").map(toCampaignRow)
    : campaigns;
  const displayedStats = isInstitutionCampaigns
    ? stats.map((stat) => ({
        ...stat,
        value: campaignData.stats
          ? String(campaignData.stats[stat.apiKey])
          : "—",
      }))
    : stats;

  function closeCreateCampaign() {
    if (!pending.current) setCreateCampaignOpen(false);
  }

  async function saveCampaign(form: HTMLFormElement, status: "published" | "draft") {
    if (!isInstitutionCampaigns || pending.current) return;
    if (status === "published" && !form.reportValidity()) return;

    const values = Object.fromEntries(
      Array.from(new FormData(form).entries()).map(([key, value]) => [key, String(value).trim()]),
    );
    if (status === "draft" && !Object.values(values).some(Boolean) && !selectedBloodTypes.length) {
      toast.error("يرجى إدخال حقل واحد على الأقل لحفظ المسودة.");
      return;
    }
    if (status === "published" && (!values.name || !values.description || !values.address || !selectedBloodTypes.length)) {
      toast.error("يرجى تعبئة اسم الحملة ووصفها ومكانها واختيار الفصائل المستهدفة.");
      return;
    }
    if (status === "published" && values.endDate && values.endDate < values.startDate) {
      toast.error("يجب ألا يكون تاريخ انتهاء الحملة قبل تاريخ بدايتها.");
      return;
    }
    if (status === "published" && values.endTime && (!values.endDate || values.endDate === values.startDate) && values.endTime <= values.startTime) {
      toast.error("يجب أن يكون وقت نهاية الحملة بعد وقت بدايتها.");
      return;
    }
    const targetCount = values.targetCount ? Number(values.targetCount) : undefined;
    if (status === "published" && targetCount !== undefined && (!Number.isInteger(targetCount) || targetCount < 1 || targetCount > 50)) {
      toast.error("يرجى إدخال عدد صحيح من المشاركين بين 1 و50.");
      return;
    }

    const draftId = editingDraft ? draft?.id : undefined;
    pending.current = true;
    setSubmitting(true);
    try {
      const result = await apiClient<{
        success?: boolean;
        message?: string;
        data?: { id: number | string };
      }>(backendProxyUrl(`/blood-bank/campaigns${draftId !== undefined ? `/${encodeURIComponent(String(draftId))}` : ""}`), {
        method: draftId !== undefined ? "PATCH" : "POST",
        body: {
          title: values.name,
          description: values.description,
          start_date: values.startDate,
          end_date: values.endDate || null,
          start_time: values.startTime,
          end_time: values.endTime || null,
          governorate: values.governorate,
          area: values.region,
          location: values.address,
          target_count: targetCount ?? null,
          notes: values.notes,
          status,
          blood_types: [...selectedBloodTypes],
        },
      });
      if (result.success === false) throw new Error(result.message || "تعذر حفظ الحملة.");
      if (status === "draft") {
        const savedId = result.data?.id ?? draftId;
        setDraft({ id: savedId, values, bloodTypes: [...selectedBloodTypes] });
      } else if (editingDraft) {
        setDraft(null);
      }
      setCreateCampaignOpen(false);
      toast.success(status === "draft" ? "تم حفظ الحملة كمسودة بنجاح." : "تم نشر الحملة بنجاح.");
      campaignData.reload();
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      pending.current = false;
      setSubmitting(false);
    }
  }
  const filteredCampaigns =
    activeFilter === "الكل"
      ? sourceCampaigns
      : sourceCampaigns.filter((campaign) => campaign.status === activeFilter);

  return (
    <div className="mx-auto w-full max-w-[1240px] pb-10 pt-1">
      <section dir="ltr" className="flex flex-col-reverse justify-between gap-4 sm:flex-row sm:items-start">
        <div dir="ltr" className="flex items-center gap-2.5 sm:pt-1">
          <button
            type="button"
            onClick={() => {
              setEditingDraft(false);
              setSelectedBloodTypes([]);
              setCreateCampaignOpen(true);
            }}
            dir="rtl"
            className="inline-flex h-11 min-w-[130px] items-center justify-center gap-3 rounded-[12px] bg-[#ad1e3a] px-5 font-['Tajawal'] text-[14px] font-bold text-white shadow-[0_8px_18px_rgba(173,30,58,0.24)] transition hover:bg-[#961a32]"
          >
            <Plus className="h-5 w-5" strokeWidth={2.2} />
            إنشاء حملة
          </button>
          <button
            type="button"
            disabled={!availableDraft || (isInstitutionCampaigns && campaignData.loading)}
            onClick={() => {
              if (!availableDraft) return;
              setDraft(availableDraft);
              setEditingDraft(true);
              setSelectedBloodTypes(availableDraft.bloodTypes);
              setCreateCampaignOpen(true);
            }}
            dir="rtl"
            className="h-11 min-w-[104px] rounded-[12px] bg-white px-5 font-['Tajawal'] text-[14px] font-bold text-[#59666f] shadow-[0_8px_22px_rgba(39,52,59,0.09)] transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-55"
          >
            آخر مسودة
          </button>
        </div>

        <div dir="rtl" className="text-right">
          <h1 className="text-2xl font-extrabold text-[#263941]">حملات التبرع</h1>
          <p className="mt-1 text-[11px] text-[#8c979c]">
            أنشئ حملات منظمة ترفع جاهزية المستشفى لديك وتزيد التسجيل بالتبرع الفعّال.
          </p>
        </div>
      </section>

      <section className="mt-8 grid gap-6 sm:grid-cols-3 lg:gap-10">
        {displayedStats.map(({ label, value, icon: Icon, iconClass, bubbleClass }) => (
          <article
            key={label}
            className="relative h-[130px] overflow-hidden rounded-[17px] border border-[#f1f2f3] bg-white shadow-[0_7px_22px_rgba(38,54,61,0.045)]"
          >
            <p className="absolute right-7 top-7 font-['IBM_Plex_Sans_Arabic'] text-[13px] font-normal text-[#67575a]">
              {label}
            </p>
            <Icon className={`absolute left-7 top-7 h-5 w-5 ${iconClass}`} strokeWidth={2} />
            <span className={`absolute -bottom-5 -right-2 flex h-[88px] w-[88px] items-center justify-center rounded-full ${bubbleClass}`}>
              <span className="-translate-y-1.5 text-[26px] font-extrabold leading-none text-[#172e3a]">
                {value}
              </span>
            </span>
          </article>
        ))}
      </section>

      <section className="mt-7 overflow-hidden rounded-[16px] border border-[#dfe7e8] bg-white font-['IBM_Plex_Sans_Arabic'] shadow-[0_5px_18px_rgba(35,55,62,0.025)]">
        <div className="flex h-12 items-center border-b border-[#e9eeee] bg-[#f3f7f7] px-5">
          <div className="flex items-center gap-7 text-[10px] font-normal text-[#78878c]">
            {campaignFilters.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                aria-pressed={activeFilter === filter}
                className={`rounded-md px-3 py-1.5 transition-colors ${
                  activeFilter === filter
                    ? "bg-[#f9e2e6] font-semibold text-[#ad1f39]"
                    : "hover:text-[#ad1f39]"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div aria-busy={isInstitutionCampaigns && campaignData.loading}>
          {isInstitutionCampaigns && (campaignData.loading || campaignData.error || filteredCampaigns.length === 0) && (
            <p role={campaignData.error ? "alert" : "status"} className="px-5 py-4 text-[12px] text-[#7d8d8f]">
              {campaignData.loading ? "جارٍ تحميل الحملات..." : campaignData.error ?? "لا توجد حملات ضمن هذه القائمة."}
            </p>
          )}
          {filteredCampaigns.map((campaign, index) => (
            <article
              key={campaign.detailNumber}
              className={`flex min-h-[142px] flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center ${index !== filteredCampaigns.length - 1 ? "border-b border-[#e9eeee]" : ""}`}
            >
              <div className="flex min-w-0 flex-1 items-start gap-4">
                <div className="grid h-[60px] w-[64px] shrink-0 place-items-center rounded-[10px] bg-[#fbeff1] text-center text-[#b41f3b]">
                  <div>
                    <p className="text-[21px] font-extrabold leading-none">{campaign.day}</p>
                    <p className="mt-0.5 text-[9px] font-semibold">{campaign.month}</p>
                    <p className="text-[9px] leading-none">{campaign.time}</p>
                  </div>
                </div>

                <div className="min-w-0 text-right font-['Tajawal']">
                  <p className="font-['IBM_Plex_Sans_Arabic'] text-[10px] font-normal text-[#96a1a5]">{campaign.id}</p>
                  <div className="mt-0.5 flex flex-wrap items-center gap-2">
                    <h2 className="text-[18px] font-extrabold text-[#143d3b]">{campaign.title}</h2>
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-bold ${campaign.statusClass}`}>
                      <span className="h-1.5 w-1.5 rounded-full bg-current" />
                      {campaign.status}
                    </span>
                  </div>
                  <p className="mt-1.5 flex items-center gap-1.5 text-[12px] font-normal text-[#7d8d8f]">
                    <MapPin className="h-4 w-4" strokeWidth={1.7} />
                    {campaign.location}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5" dir="rtl">
                    {campaign.bloodTypes.map((bloodType) => (
                      <span key={bloodType} dir="ltr" className="rounded-md bg-[#fbecef] px-2.5 py-1.5 font-['IBM_Plex_Sans_Arabic'] text-[10px] font-bold text-[#a91f39]">
                        {bloodType}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-1.5 self-end sm:self-center">
                <Link href={`${pathname}/${encodeURIComponent(String(campaign.detailNumber))}`} className="inline-flex h-9 items-center gap-2 rounded-md border border-[#d5dfe1] bg-white px-3.5 text-[10px] font-normal text-[#4f6268] hover:bg-slate-50">
                  <Clock3 className="h-4 w-4" strokeWidth={1.7} />
                  التفاصيل
                </Link>
                <Link href={`${pathname}/${encodeURIComponent(String(campaign.detailNumber))}/participants`} className="inline-flex h-9 items-center gap-2 rounded-md border border-[#d5dfe1] bg-white px-3.5 text-[10px] font-normal text-[#4f6268] hover:bg-slate-50">
                  <UserRound className="h-4 w-4" strokeWidth={1.7} />
                  المشاركون
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {createCampaignOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#26313b]/55 p-3"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeCreateCampaign();
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="create-campaign-title"
            className="flex max-h-[88dvh] w-full max-w-[500px] flex-col overflow-hidden rounded-[18px] bg-white font-['Tajawal'] text-[#263940] shadow-[0_22px_65px_rgba(20,29,37,0.28)]"
          >
            <header className="flex items-start justify-between border-b border-[#edf0f1] px-6 py-4">
              <div className="text-right">
                <span className="text-[10px] font-bold text-[#b21f3c]">حملة جديدة</span>
                <h2 id="create-campaign-title" className="mt-0.5 text-xl font-extrabold text-[#182f39]">
                  إنشاء حملة تبرع
                </h2>
              </div>
              <button
                type="button"
                onClick={closeCreateCampaign}
                aria-label="إغلاق"
                className="grid h-8 w-8 place-items-center rounded-full text-[#596a71] transition hover:bg-slate-100"
              >
                <X className="h-4 w-4" strokeWidth={1.8} />
              </button>
            </header>

            <form className="min-h-0 flex-1 space-y-6 overflow-y-auto px-6 py-5" aria-busy={submitting} onSubmit={(event) => {
              event.preventDefault();
              if (isInstitutionCampaigns) void saveCampaign(event.currentTarget, "published");
            }}>
              <fieldset className="space-y-4">
                <legend className="mb-4 flex items-center gap-2 text-sm font-extrabold text-[#263940]">
                  <span className="grid h-5 w-5 place-items-center rounded-full bg-[#fbecef] text-[10px] font-bold text-[#ad1e3a]">1</span>
                  تفاصيل الحملة
                </legend>
                <p className="-mt-3 text-[10px] text-[#8b989d]">ابدأ بوصف واضح يساعد المتبرعين</p>

                <FormField label="اسم الحملة" required>
                  <input name="name" defaultValue={editingDraft ? draft?.values.name : ""} required type="text" placeholder="مثال: حملة قطرة حياة للتبرع بالدم" className={inputClassName} />
                </FormField>

                <FormField label="وصف الحملة" required>
                  <textarea name="description" defaultValue={editingDraft ? draft?.values.description : ""} required rows={3} placeholder="اكتب وصفًا مختصرًا وواضحًا للحملة" className={`${inputClassName} min-h-[72px] resize-none py-3`} />
                </FormField>
              </fieldset>

              <fieldset>
                <legend className="mb-3 text-xs font-bold text-[#263940]">
                  الفصائل المستهدفة <span className="text-[#ad1e3a]">*</span>
                </legend>
                <button
                  type="button"
                  onClick={() => setSelectedBloodTypes(
                    selectedBloodTypes.length === campaignBloodTypes.length ? [] : campaignBloodTypes,
                  )}
                  className="mb-2 h-9 w-full rounded-lg border border-[#e9edef] bg-white text-[11px] font-semibold text-[#53646b] hover:bg-slate-50"
                >
                  جميع الفصائل
                </button>
                <div className="grid grid-cols-4 gap-2" dir="ltr">
                  {campaignBloodTypes.map((bloodType) => {
                    const selected = selectedBloodTypes.includes(bloodType);
                    return (
                      <button
                        key={bloodType}
                        type="button"
                        onClick={() => setSelectedBloodTypes((current) =>
                          selected
                            ? current.filter((type) => type !== bloodType)
                            : [...current, bloodType],
                        )}
                        className={`inline-flex h-10 items-center justify-center gap-2 rounded-lg border text-[11px] font-bold transition ${
                          selected
                            ? "border-[#ad1e3a] bg-[#ad1e3a] text-white shadow-[0_5px_12px_rgba(173,30,58,0.22)]"
                            : "border-[#eaedef] bg-white text-[#45575e] hover:border-[#d9e0e2]"
                        }`}
                      >
                        {bloodType}
                        {selected && <span className="text-sm leading-none">✓</span>}
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              <FormField label="العدد المستهدف من المشاركين / التبرعات (كحد أقصى)">
                <input name="targetCount" defaultValue={editingDraft ? draft?.values.targetCount : ""} type="number" min="1" max="50" placeholder="50" className={inputClassName} />
              </FormField>

              <fieldset className="space-y-4 border-t border-[#edf0f1] pt-5">
                <legend className="mb-4 flex items-center gap-2 text-sm font-extrabold text-[#263940]">
                  <span className="grid h-5 w-5 place-items-center rounded-full bg-[#fbecef] text-[10px] font-bold text-[#ad1e3a]">2</span>
                  الموقع والمكان
                </legend>
                <p className="-mt-3 text-[10px] text-[#8b989d]">حدد زمن الحملة وموقعها بدقة ووضوح</p>

                <div className="grid gap-3 sm:grid-cols-2">
                  <FormField label="تاريخ بداية الحملة" required>
                    <input name="startDate" defaultValue={editingDraft ? draft?.values.startDate : ""} required type="date" className={inputClassName} />
                  </FormField>
                  <FormField label="تاريخ انتهاء الحملة">
                    <input name="endDate" defaultValue={editingDraft ? draft?.values.endDate : ""} type="date" className={inputClassName} />
                  </FormField>
                  <FormField label="وقت بداية الحملة" required>
                    <input name="startTime" defaultValue={editingDraft ? draft?.values.startTime : ""} required type="time" className={inputClassName} />
                  </FormField>
                  <FormField label="وقت نهاية الحملة">
                    <input name="endTime" defaultValue={editingDraft ? draft?.values.endTime : ""} type="time" className={inputClassName} />
                  </FormField>
                  <FormField label="المحافظة" required>
                    <select name="governorate" required defaultValue={editingDraft ? draft?.values.governorate ?? "" : ""} className={inputClassName}>
                      <option value="" disabled>اختر المحافظة</option>
                      {gazaGovernorates.map((governorate) => (
                        <option key={governorate} value={governorate}>{governorate}</option>
                      ))}
                    </select>
                  </FormField>
                  <FormField label="المنطقة" required>
                    <select name="region" required defaultValue={editingDraft ? draft?.values.region ?? "" : ""} className={inputClassName}>
                      <option value="" disabled>اختر المنطقة</option>
                      {editingDraft && draft?.values.region && !["وسط المدينة", "المنطقة الشرقية", "المنطقة الغربية"].includes(draft.values.region) && (
                        <option value={draft.values.region}>{draft.values.region}</option>
                      )}
                      <option>وسط المدينة</option>
                      <option>المنطقة الشرقية</option>
                      <option>المنطقة الغربية</option>
                    </select>
                  </FormField>
                </div>

                <FormField label="مكان الحملة والعنوان التفصيلي" required>
                  <input name="address" defaultValue={editingDraft ? draft?.values.address : ""} required type="text" placeholder="اكتب الموقع أو العنوان بالتفصيل" className={inputClassName} />
                </FormField>

                <FormField label="ملاحظات">
                  <textarea name="notes" defaultValue={editingDraft ? draft?.values.notes : ""} rows={3} placeholder="اكتب الملاحظات المهمة للحملة" className={`${inputClassName} min-h-[72px] resize-none py-3`} />
                </FormField>
              </fieldset>

              <div className="flex items-start gap-2 rounded-lg bg-[#eef9f8] px-4 py-3 text-[10px] leading-5 text-[#54827f]">
                <Info className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.8} />
                <p>عندما تنشر الحملة سيصل إشعار للمتبرعين المطابقين، ويمكنك متابعة التسجيل والمشاركة من صفحة الحملات.</p>
              </div>

              <footer dir="ltr" className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  dir="rtl"
                  onClick={(event) => {
                    const form = event.currentTarget.form;
                    if (!form) return;
                    if (isInstitutionCampaigns) {
                      void saveCampaign(form, "draft");
                      return;
                    }
                    const values = Object.fromEntries(
                      Array.from(new FormData(form).entries()).map(([key, value]) => [key, String(value)]),
                    );
                    setDraft({ values, bloodTypes: selectedBloodTypes });
                    setCreateCampaignOpen(false);
                  }}
                  disabled={submitting}
                  className="h-10 rounded-lg border border-[#dde3e5] bg-white px-5 text-xs font-bold text-[#53636a] hover:bg-slate-50"
                >
                  حفظ كمسودة
                </button>
                <button type="submit" disabled={submitting} dir="rtl" className="h-10 rounded-lg bg-[#ad1e3a] px-6 text-xs font-bold text-white shadow-[0_7px_16px_rgba(173,30,58,0.22)] hover:bg-[#961a32]">
                  نشر الحملة
                </button>
              </footer>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}

const inputClassName =
  "h-10 w-full rounded-lg border border-[#eaedef] bg-white px-3 text-[11px] text-[#34474f] outline-none transition placeholder:text-[#b1babd] focus:border-[#ad1e3a]/30 focus:ring-2 focus:ring-[#ad1e3a]/6";

function FormField({
  label,
  required = false,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block text-right">
      <span className="mb-1.5 block text-[11px] font-bold text-[#34474f]">
        {label} {required && <span className="text-[#ad1e3a]">*</span>}
      </span>
      {children}
    </label>
  );
}
