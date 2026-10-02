"use client";

import { useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/src/lib/api/errors";
import { useInstitutionCampaign } from "../hooks/useInstitutionCampaign";
import { useCampaignParticipants } from "../hooks/useCampaignParticipants";
import { recordCampaignDonation, type CampaignParticipant } from "../services/campaign.service";
import { CalendarDays, HeartPulse, UserCheck, UserRoundX, UsersRound, X } from "lucide-react";

const campaignTitles = ["حملة قطرة حياة", "تبرعك أمل", "قطرة منك حياة لغيرك", "قطرة منك حياة لغيرك"];
const participantTabs = [
  { key: "registered", label: "مسجل للمشاركة", count: 5 },
  { key: "cancelled", label: "ألغى مشاركته", count: 3 },
  { key: "completed", label: "تم تسجيله", count: 3 },
] as const;

type ParticipantTab = (typeof participantTabs)[number]["key"];

const participants = [
  { number: "D-1007", name: "أحمد محمد", region: "غزة - الجلاء", bloodType: "B+", registeredAt: "10/9/2026 - 05:30 pm", status: "registered" },
  { number: "D-1003", name: "أحمد محمد", region: "غزة - الجلاء", bloodType: "AB−", registeredAt: "10/9/2026 - 05:30 pm", status: "registered" },
  { number: "D-1004", name: "أحمد محمد", region: "غزة - الجلاء", bloodType: "AB+", registeredAt: "10/9/2026 - 05:30 pm", status: "registered" },
  { number: "D-1006", name: "أحمد محمد", region: "غزة - الجلاء", bloodType: "A+", registeredAt: "10/9/2026 - 05:30 pm", status: "registered" },
  { number: "D-1008", name: "سارة خالد", region: "رام الله - الطيرة", bloodType: "O+", registeredAt: "09/9/2026 - 11:15 am", status: "cancelled" },
  { number: "D-1009", name: "محمد علي", region: "نابلس - المخفية", bloodType: "A−", registeredAt: "08/9/2026 - 09:00 am", status: "completed" },
] as const;

const stats = [
  { label: "المسجلون", value: 18, icon: UsersRound, color: "text-[#138a6f]", bubble: "bg-[#effaf6]" },
  { label: "ألغوا المشاركة", value: 20, icon: UserRoundX, color: "text-[#243847]", bubble: "bg-[#f5f5f5]" },
  { label: "حضروا", value: 5, icon: UserCheck, color: "text-[#d28a20]", bubble: "bg-[#fffbed]" },
  { label: "تبرعات موثقة", value: 8, icon: HeartPulse, color: "text-[#ad1e3a]", bubble: "bg-[#fdeceb]" },
];

type ParticipantRow = {
  id: number | string;
  number: string;
  name: string;
  region: string;
  bloodType: string;
  registeredAt: string;
  status: string;
};

function toParticipantRow(participant: CampaignParticipant): ParticipantRow {
  const donor = participant.donor;
  const registeredAt = participant.registered_at ? new Date(participant.registered_at) : null;
  return {
    id: participant.id,
    number: donor?.donor_number ?? (donor?.id != null ? String(donor.id) : "—"),
    name: donor?.name ?? donor?.full_name ?? "—",
    region: donor?.region ?? ([donor?.governorate, donor?.area].filter(Boolean).join(" - ") || "—"),
    bloodType: donor?.blood_type ?? "—",
    registeredAt: registeredAt && !Number.isNaN(registeredAt.getTime())
      ? new Intl.DateTimeFormat("en-GB", { dateStyle: "short", timeStyle: "short", timeZone: "Asia/Jerusalem" }).format(registeredAt)
      : "—",
    status: participant.status,
  };
}

function matchesParticipantTab(status: string, tab: ParticipantTab) {
  if (tab === "registered") return status === "registered" || status === "attended";
  if (tab === "completed") return status === "donated" || status === "completed";
  return status === "cancelled";
}

function todayInJerusalem() {
  const parts = new Intl.DateTimeFormat("en", { year: "numeric", month: "2-digit", day: "2-digit", timeZone: "Asia/Jerusalem" }).formatToParts(new Date());
  const part = (type: string) => parts.find((item) => item.type === type)?.value;
  return `${part("year")}-${part("month")}-${part("day")}`;
}

export default function InstitutionCampaignParticipantsPage({ campaignNumber }: { campaignNumber: number | string }) {
  const pathname = usePathname();
  const isInstitution = pathname.startsWith("/HospitalDashboard/") || pathname.startsWith("/BloodBankDashboard/");
  const campaignData = useInstitutionCampaign(campaignNumber, isInstitution);
  const participantData = useCampaignParticipants(campaignNumber, isInstitution);
  const [activeTab, setActiveTab] = useState<ParticipantTab>("registered");
  const [selectedParticipant, setSelectedParticipant] = useState<ParticipantRow | null>(null);
  const [collectedAt, setCollectedAt] = useState(todayInJerusalem);
  const pending = useRef(false);
  const [submitting, setSubmitting] = useState(false);
  const sourceParticipants: ParticipantRow[] = isInstitution
    ? participantData.participants.map(toParticipantRow)
    : participants.map((participant) => ({ ...participant, id: participant.number }));
  const visibleParticipants = sourceParticipants.filter((participant) => matchesParticipantTab(participant.status, activeTab));
  const title = isInstitution ? campaignData.campaign?.title ?? "—" : campaignTitles[Number(campaignNumber) - 1] ?? campaignTitles[0];
  const collectionDate = new Date(`${collectedAt}T12:00:00`);
  const expirationDate = new Date(collectionDate);
  expirationDate.setDate(expirationDate.getDate() + 30);
  const count = (status: string) => sourceParticipants.filter((participant) => participant.status === status).length;
  const displayedStats = isInstitution
    ? stats.map((stat, index) => ({ ...stat, value: participantData.loaded ? [count("registered"), count("cancelled"), count("attended"), count("donated")][index] : "—" }))
    : stats;
  const displayedTabs = isInstitution
    ? participantTabs.map((tab) => ({ ...tab, count: participantData.loaded ? sourceParticipants.filter((participant) => matchesParticipantTab(participant.status, tab.key)).length : "—" }))
    : participantTabs;
  const loadError = participantData.error ?? campaignData.error;

  function closeDonation() { if (!pending.current) setSelectedParticipant(null); }

  async function registerDonation() {
    if (!selectedParticipant || pending.current) return;
    if (!isInstitution) { setSelectedParticipant(null); return; }
    pending.current = true;
    setSubmitting(true);
    try {
      await recordCampaignDonation(campaignNumber, selectedParticipant.id, collectedAt);
      setSelectedParticipant(null);
      participantData.reload();
      campaignData.reload();
      toast.success("تم تسجيل التبرع وإضافة الوحدة بنجاح.");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      pending.current = false;
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-[1240px] pb-10 font-['Tajawal']">
      <h1 className="text-right text-[27px] font-extrabold text-[#223740]">مشاركو {title}</h1>

      <section className="mt-7 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {displayedStats.map(({ label, value, icon: Icon, color, bubble }) => (
          <article key={label} className="relative h-[118px] overflow-hidden rounded-[15px] border border-[#eff2f2] bg-white p-6 shadow-[0_5px_18px_rgba(35,55,62,0.035)]">
            <Icon className={`absolute left-6 top-6 h-5 w-5 ${color}`} strokeWidth={1.8} />
            <p className="absolute right-6 top-6 text-[12px] font-medium text-[#657279]">{label}</p>
            <span className={`absolute -bottom-5 -right-2 flex h-[82px] w-[82px] items-center justify-center rounded-full ${bubble}`}>
              <strong className="-translate-y-1 text-[25px] font-extrabold text-[#1c3340]">{value}</strong>
            </span>
          </article>
        ))}
      </section>

      <section className="mt-5 rounded-[18px] border border-[#e7ecec] bg-white px-6 pb-6 pt-5 shadow-[0_5px_18px_rgba(35,55,62,0.03)]">
        <div className="flex justify-center border-b border-[#edf0f1] pb-5">
          <div className="flex items-center rounded-full bg-[#f4f5f5] p-1">
            {displayedTabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`inline-flex h-9 items-center gap-2 rounded-full px-5 text-[11px] transition ${activeTab === tab.key ? "bg-white font-bold text-[#ad1e3a] shadow-sm" : "font-medium text-[#738087]"}`}
              >
                {tab.label}
                <span className={`grid h-[22px] min-w-[22px] place-items-center rounded-full px-1 text-[10px] ${activeTab === tab.key ? "bg-[#f9dfe4] text-[#ad1e3a]" : "bg-[#e2e6e7] text-[#7d898e]"}`}>{tab.count}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[850px] border-separate border-spacing-0 text-right text-[12.5px]">
            <thead>
              <tr className="h-12 bg-[#f3f7f7] text-[12px] font-bold text-[#263d46]">
                <th className="rounded-r-[10px] px-5 py-3 font-bold">رقم المتبرع</th>
                <th className="px-5 py-3 font-bold">اسم المتبرع</th>
                <th className="px-5 py-3 font-bold">المنطقة</th>
                <th className="px-5 py-3 font-bold">الفصيلة</th>
                <th className="px-5 py-3 font-bold">تاريخ التسجيل</th>
                <th className="rounded-l-[10px] px-5 py-3"><span className="sr-only">الإجراء</span></th>
              </tr>
            </thead>
            <tbody aria-busy={isInstitution && participantData.loading}>
              {isInstitution && (participantData.loading || loadError || visibleParticipants.length === 0) && (
                <tr><td colSpan={6} role={loadError ? "alert" : "status"} className="px-5 py-[18px] text-[#738188]">{participantData.loading ? "جارٍ تحميل المشاركين..." : loadError ?? "لا يوجد مشاركون ضمن هذه القائمة."}</td></tr>
              )}
              {visibleParticipants.map((participant) => (
                <tr key={participant.id} className="text-[#53636a]">
                  <td dir="ltr" className="border-b border-[#eef1f2] px-5 py-[18px] text-right font-extrabold text-[#991b30]">{participant.number}</td>
                  <td className="border-b border-[#eef1f2] px-5 py-[18px] font-normal text-[#43565e]">{participant.name}</td>
                  <td className="border-b border-[#eef1f2] px-5 py-[18px] font-normal text-[#43565e]">{participant.region}</td>
                  <td dir="ltr" className="border-b border-[#eef1f2] px-5 py-[18px] text-right font-extrabold text-[#233943]">{participant.bloodType}</td>
                  <td dir="ltr" className="border-b border-[#eef1f2] px-5 py-[18px] text-right font-normal text-[#738188]">{participant.registeredAt}</td>
                  <td className="border-b border-[#f0f2f3] px-5 py-3 text-left">
                    {activeTab === "registered" && (
                      <button type="button" disabled={submitting || (isInstitution && (participantData.loading || campaignData.loading || Boolean(loadError)))} onClick={() => { setCollectedAt(todayInJerusalem()); setSelectedParticipant(participant); }} className="inline-flex h-9 items-center rounded-[9px] bg-[#ad1e3a] px-5 text-[11.5px] font-bold text-white shadow-[0_5px_11px_rgba(173,30,58,0.2)] hover:bg-[#961a32]">
                        تسجيل التبرع
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {selectedParticipant && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#27313c]/55 p-3"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeDonation();
          }}
        >
          <section role="dialog" aria-modal="true" aria-labelledby="register-donation-title" className="w-full max-w-[545px] overflow-hidden rounded-[17px] bg-white text-[#263940] shadow-[0_24px_70px_rgba(18,27,35,0.3)]">
            <header className="relative border-b border-[#edf0f1] px-7 py-5 text-right">
              <button type="button" disabled={submitting} onClick={closeDonation} aria-label="إغلاق" className="absolute left-6 top-5 grid h-8 w-8 place-items-center rounded-full text-[#52636b] transition hover:bg-slate-100">
                <X className="h-4 w-4" strokeWidth={1.8} />
              </button>
              <h2 id="register-donation-title" className="text-[22px] font-extrabold text-[#53626b]">بيانات التبرع والوحدة</h2>
              <p className="mt-1.5 text-[11px] font-medium text-[#89959a]">ستنشئ عملية تبرع ووحدة مخزون مترابطتان.</p>
            </header>

            <form className="px-7 pb-6 pt-5" aria-busy={submitting} onSubmit={(event) => { event.preventDefault(); void registerDonation(); }}>
              <div className="grid gap-x-4 gap-y-4 sm:grid-cols-2">
                <DonationField label="تاريخ التبرع">
                  <ReadOnlyDate value={formatDisplayDate(collectionDate)} />
                </DonationField>

                <DonationField label="الرقم المرجعي">
                  <input readOnly value={isInstitution ? "يُنشأ تلقائيًا عند التسجيل" : `BU-${selectedParticipant.number.replace(/\D/g, "")}090`} className={`${donationInputClassName} cursor-default bg-[#fbfcfc] font-semibold`} />
                </DonationField>

                <DonationField label="تاريخ الجمع">
                  <ReadOnlyDate value={formatDisplayDate(collectionDate)} />
                </DonationField>

                <DonationField label="تاريخ انتهاء الصلاحية">
                  <ReadOnlyDate value={isInstitution ? "يحدده الخادم عند التسجيل" : formatDisplayDate(expirationDate)} />
                </DonationField>
              </div>

              <footer dir="ltr" className="mt-6 flex items-center justify-between">
                <button type="button" disabled={submitting} dir="rtl" onClick={closeDonation} className="h-11 rounded-[10px] border border-[#dce3e5] bg-white px-5 text-sm font-bold text-[#aab3b7] transition hover:bg-slate-50">
                  إغلاق
                </button>
                <button type="submit" disabled={submitting} dir="rtl" className="h-11 rounded-[10px] bg-[#ad1e3a] px-6 text-sm font-bold text-white shadow-[0_7px_16px_rgba(173,30,58,0.23)] transition hover:bg-[#961a32]">
                  تسجيل التبرع وإضافة الوحدة
                </button>
              </footer>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}

const donationInputClassName = "h-11 w-full rounded-[9px] border border-[#e1e6e8] bg-white px-3 text-[11px] text-[#748188] outline-none focus:border-[#ad1e3a]/30 focus:ring-2 focus:ring-[#ad1e3a]/6";

function DonationField({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block text-right"><span className="mb-2 block text-[12px] font-bold text-[#52636b]">{label}</span>{children}</label>;
}

function ReadOnlyDate({ value }: { value: string }) {
  return (
    <div className="relative">
      <input readOnly value={value} className={`${donationInputClassName} cursor-default bg-[#fbfcfc] pl-10`} />
      <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#9aa6aa]" strokeWidth={1.5} />
    </div>
  );
}

function formatDisplayDate(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${month}/${day}/${date.getFullYear()}`;
}
