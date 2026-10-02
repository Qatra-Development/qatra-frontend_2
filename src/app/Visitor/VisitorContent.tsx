"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import {
  Search,
  ChevronDown,
  Calendar,
  MapPin,
  ArrowLeft,
  ArrowRight,
  Users,
  Building2,
  BadgeCheck,
} from "lucide-react";

interface Campaign {
  id: string;
  code: string;
  title: string;
  hospital: string;
  day: string;
  month: string;
  status: "قادمة" | "جارية" | "منتهية";
  description: string;
  timeRange: string;
  date: string;
  location: string;
  venue: string;
  city: string;
  governorate: string;
  bloodTypes: string[];
  targetParticipants: number;
  contactPhone?: string;
  targetUnits?: number;
  collectedUnits?: number;
}

export interface PublicCampaign {
  id: number;
  campaign_number: string;
  title: string;
  description: string | null;
  institution: { id: number; name: string; type: string };
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  governorate: string;
  area: string | null;
  location: string;
  target_count: number;
  status: "published" | "active";
  blood_types: string[];
}

export interface CampaignFilters {
  search?: string;
  governorate?: string;
  blood_type?: string;
  status?: "published" | "active";
}

function mapCampaign(campaign: PublicCampaign): Campaign {
  const date = campaign.start_date.slice(0, 10);
  const parsedDate = new Date(`${date}T12:00:00Z`);
  return {
    id: String(campaign.id),
    code: campaign.campaign_number,
    title: campaign.title,
    hospital: campaign.institution.name,
    day: String(parsedDate.getUTCDate()),
    month: parsedDate.toLocaleDateString("ar", { month: "long", timeZone: "UTC" }),
    status: campaign.status === "active" ? "جارية" : "قادمة",
    description: campaign.description ?? "",
    timeRange: `${campaign.start_time.slice(0, 5)} - ${campaign.end_time.slice(0, 5)}`,
    date,
    location: [campaign.governorate, campaign.area].filter(Boolean).join("، "),
    venue: campaign.location,
    city: campaign.area ?? "",
    governorate: campaign.governorate,
    bloodTypes: campaign.blood_types,
    targetParticipants: campaign.target_count,
  };
}

interface VisitorContentProps {
  donorView?: boolean;
  loadCampaignsAction?: (filters: CampaignFilters) => Promise<{
    data: PublicCampaign[];
    error: string | null;
  }>;
  loadCampaignAction?: (id: string) => Promise<{
    data: PublicCampaign | null;
    error: string | null;
  }>;
}

const CAMPAIGNS_DATA: Campaign[] = [
  {
    id: "1",
    code: "CP-2026-0031",
    title: "حملة قطرة حياة",
    hospital: "مستشفى الأمل التخصصي",
    day: "24",
    month: "سبتمبر",
    status: "قادمة",
    description:
      "حملة مجتمعية لدعم مخزون بنك الدم واستقبال المتبرعين ضمن بيئة منظمة وآمنة.",
    timeRange: "15:00 - 09:00",
    date: "2026-09-24",
    location: "رام الله والبيرة ، رام الله",
    venue: "قاعة بلدية رام الله - المدخل الشرقي",
    city: "رام الله",
    governorate: "رام الله والبيرة",
    bloodTypes: ["O+", "AB+", "B+", "A+"],
    targetParticipants: 60,
    contactPhone: "+970 2 298 7654",
    targetUnits: 120,
    collectedUnits: 45,
  },
  {
    id: "2",
    code: "CP-2026-0028",
    title: "معًا ننقذ حياة",
    hospital: "بنك دم الشفاء",
    day: "19",
    month: "سبتمبر",
    status: "جارية",
    description:
      "يوم مفتوح للتبرع بالدم لجميع الفصائل بالتعاون مع مؤسسات المجتمع المحلي.",
    timeRange: "17:00 - 10:00",
    date: "2026-09-19",
    location: "نابلس، نابلس",
    venue: "مركز بلدية نابلس الثقافي - الميدان الرئيسي",
    city: "نابلس",
    governorate: "نابلس",
    bloodTypes: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"],
    targetParticipants: 100,
    contactPhone: "+970 9 238 1234",
    targetUnits: 200,
    collectedUnits: 140,
  },
  {
    id: "3",
    code: "CP-2026-0025",
    title: "نبض الحياة للجميع",
    hospital: "بنك دم الشفاء",
    day: "19",
    month: "سبتمبر",
    status: "جارية",
    description:
      "يوم مفتوح للتبرع بالدم لجميع الفصائل بالتعاون مع مؤسسات المجتمع المحلي.",
    timeRange: "17:00 - 10:00",
    date: "2026-09-19",
    location: "نابلس، نابلس",
    venue: "مجمع المحطة الطبي - الطابق الأول",
    city: "نابلس",
    governorate: "نابلس",
    bloodTypes: ["A+", "B+", "O+", "AB+"],
    targetParticipants: 80,
    contactPhone: "+970 9 238 1234",
    targetUnits: 150,
    collectedUnits: 98,
  },
  {
    id: "4",
    code: "CP-2026-0035",
    title: "قطرة أمل للجميع",
    hospital: "جمعية الهلال الأحمر",
    day: "24",
    month: "سبتمبر",
    status: "قادمة",
    description:
      "حملة إنسانية لتأمين وحدات الدم الطارئة لمصابي الحوادث ومرضى الثلاسيميا.",
    timeRange: "14:00 - 08:30",
    date: "2026-09-24",
    location: "الخليل، البلدة القديمة",
    venue: "مقر الهلال الأحمر - قاعة الأنشطة المجتمعية",
    city: "الخليل",
    governorate: "الخليل",
    bloodTypes: ["B+", "AB+", "O+", "A+"],
    targetParticipants: 50,
    contactPhone: "+970 2 222 5555",
    targetUnits: 100,
    collectedUnits: 20,
  },
];

const GOVERNORATES = [
  "الكل",
  "شمال غزة",
  "غزة",
  "دير البلح",
  "خان يونس",
  "رفح",
];

const BLOOD_TYPES_OPTIONS = [
  "الكل",
  "جميع الفصائل",
  "O+",
  "O-",
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
];

const STATUS_OPTIONS = ["الكل", "جارية", "قادمة"];

export default function VisitorContent({
  donorView = false,
  loadCampaignsAction,
  loadCampaignAction,
}: VisitorContentProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGov, setSelectedGov] = useState("الكل");
  const [selectedBloodType, setSelectedBloodType] = useState("الكل");
  const [selectedStatus, setSelectedStatus] = useState("الكل");

  // Dropdown open states
  const [govOpen, setGovOpen] = useState(false);
  const [bloodOpen, setBloodOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);

  // Selected Campaign for Detailed View (Replacing the Dialog)
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [participatingCampaigns, setParticipatingCampaigns] = useState<string[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(!donorView);
  const [error, setError] = useState<string | null>(null);
  const [reload, setReload] = useState(0);
  const detailRequest = useRef(0);

  useEffect(() => {
    if (donorView || !loadCampaignsAction) return;
    let cancelled = false;
    const timer = setTimeout(async () => {
      setLoading(true);
      setError(null);
      setCampaigns([]);
      try {
        const result = await loadCampaignsAction({
          search: searchQuery.trim() || undefined,
          governorate: selectedGov === "الكل" ? undefined : selectedGov,
          blood_type: ["الكل", "جميع الفصائل"].includes(selectedBloodType)
            ? undefined : selectedBloodType,
          status: selectedStatus === "جارية" ? "active"
            : selectedStatus === "قادمة" ? "published" : undefined,
        });
        if (cancelled) return;
        setError(result.error);
        setCampaigns(result.data.map(mapCampaign).sort((a, b) => a.date.localeCompare(b.date)));
      } catch {
        if (!cancelled) setError("تعذر تحميل الحملات. يرجى المحاولة مجددًا.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 300);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [donorView, loadCampaignsAction, searchQuery, selectedGov, selectedBloodType, selectedStatus, reload]);

  useEffect(() => () => { detailRequest.current += 1; }, []);

  async function openCampaign(campaign: Campaign) {
    if (donorView) {
      setSelectedCampaign(campaign);
      return;
    }
    if (!loadCampaignAction) return;
    const request = ++detailRequest.current;
    try {
      const result = await loadCampaignAction(campaign.id);
      if (request !== detailRequest.current) return;
      if (result.error || !result.data) {
        toast.error(result.error ?? "تعذر تحميل تفاصيل الحملة.");
        return;
      }
      setSelectedCampaign(mapCampaign(result.data));
    } catch {
      if (request === detailRequest.current) toast.error("تعذر تحميل تفاصيل الحملة. يرجى المحاولة مجددًا.");
    }
  }

  // Filtered Campaigns
  const filteredCampaigns = useMemo(() => {
    if (!donorView) {
      return selectedBloodType === "جميع الفصائل"
        ? campaigns.filter((campaign) => BLOOD_TYPES_OPTIONS.slice(2).every((type) => campaign.bloodTypes.includes(type)))
        : campaigns;
    }
    return CAMPAIGNS_DATA.filter((camp) => {
      // Search
      const matchesSearch =
        !searchQuery.trim() ||
        camp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        camp.hospital.toLowerCase().includes(searchQuery.toLowerCase()) ||
        camp.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        camp.city.toLowerCase().includes(searchQuery.toLowerCase());

      // Gov
      const matchesGov =
        selectedGov === "الكل" || camp.governorate === selectedGov;

      // Blood
      const matchesBlood =
        selectedBloodType === "الكل" ||
        camp.bloodTypes.includes("جميع الفصائل") ||
        camp.bloodTypes.includes(selectedBloodType);

      // Status
      const matchesStatus =
        selectedStatus === "الكل" || camp.status === selectedStatus;

      return matchesSearch && matchesGov && matchesBlood && matchesStatus;
    });
  }, [donorView, campaigns, searchQuery, selectedGov, selectedBloodType, selectedStatus]);

  return (
    <div
      dir="rtl"
      className={`${donorView ? "" : "min-h-screen"} bg-[#f8f9fa] text-[#1e293b] font-['Tajawal',sans-serif] selection:bg-[#991b30] selection:text-white`}
    >
      {/* ── Top Navigation Bar ────────────────────────────────────────── */}
      {!donorView && <header className="w-full bg-white sticky top-0 z-40 border-b border-[#f1f3f5]">
        <div className="w-full px-6 sm:px-8 lg:px-12 h-[76px] flex items-center justify-between">
          {/* Right Section: Logo & Main Nav Links */}
          <div className="flex items-center gap-10 lg:gap-14">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="relative w-8 h-8 flex items-center justify-center">
                <Image
                  src="/img/logo.png"
                  alt="شعار قطرة"
                  width={32}
                  height={32}
                  className="object-contain"
                  priority
                />
              </div>
              <div className="flex flex-col text-right">
                <span className="text-[20px] font-black text-[#1a2332] leading-none tracking-tight">
                  قطرة
                </span>
                <span className="text-[9.5px] tracking-[0.25em] text-[#64748b] font-bold uppercase mt-0.5">
                  QATRA
                </span>
              </div>
            </Link>

            {/* Nav links */}
            <nav className="hidden sm:flex items-center gap-8">
              <Link
                href="/"
                className="text-[#64748b] hover:text-[#1e293b] text-[15px] font-medium transition-colors"
              >
                الرئيسية
              </Link>
              <button
                type="button"
                onClick={() => setSelectedCampaign(null)}
                className="text-[#991b30] font-bold text-[15px] transition-colors cursor-pointer"
              >
                حملات التبرع
              </button>
            </nav>
          </div>

          {/* Left Section: Auth Links */}
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-[#1e293b] hover:text-black font-bold text-[14.5px] px-2 py-1.5 transition-colors"
            >
              تسجيل الدخول
            </Link>
            <Link
              href="/register"
              className="bg-[#991b30] hover:bg-[#831627] text-white text-[14.5px] font-bold px-6 py-2.5 rounded-[12px] shadow-[0_4px_14px_rgba(153,27,48,0.25)] transition-all active:scale-[0.98]"
            >
              انضم كمتبرع
            </Link>
          </div>
        </div>
      </header>}

      {/* ── CONDITIONAL RENDERING: Campaign Details View vs Campaigns List ── */}
      {selectedCampaign ? (
        /* ══════════════════════════════════════════════════════════════════════
           CAMPAIGN DETAILS PAGE VIEW (Matching the provided design)
           ══════════════════════════════════════════════════════════════════════ */
        <div className={`max-w-[1140px] mx-auto px-4 sm:px-8 ${donorView ? "pt-0 pb-8" : "py-8"} animate-in fade-in duration-200`}>
          {/* Top Return Button */}
          <div className="flex items-center justify-start mb-6">
            <button
              type="button"
              onClick={() => setSelectedCampaign(null)}
              className="group inline-flex items-center gap-2 text-[14px] font-semibold text-[#64748b] hover:text-[#1e293b] transition-colors cursor-pointer"
            >
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              <span>العودة للحملات</span>
            </button>
          </div>

          {/* Top Teal Hero Banner Card */}
          <div
            className="rounded-[24px] px-6 py-5 sm:px-8 sm:py-6 text-white relative overflow-hidden shadow-[0_10px_30px_rgba(55,98,99,0.15)] mb-8"
            style={{
              background:
                "linear-gradient(86.3deg, #70C7C9 -9.03%, #376263 100.33%)",
            }}
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              {/* Right Side: Status Badge, Code, Title, Description, Organizer */}
              <div className="flex-1 text-right">
                {/* Status Badge & Code on separate lines with equal spacing */}
                <div className="flex flex-col items-start">
                  <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white text-[#214f52] text-[12px] font-bold shadow-xs">
                    <span className="w-2 h-2 rounded-full bg-[#285F8D]" />
                    <span>{selectedCampaign.status}</span>
                  </div>
                  <span className="text-white/75 text-[11.5px] font-medium tracking-wider my-2.5">
                    {selectedCampaign.code}
                  </span>
                </div>

                {/* Campaign Title */}
                <h1 className="text-[24px] sm:text-[30px] md:text-[34px] font-black text-white leading-tight tracking-tight mt-0 mb-2">
                  {selectedCampaign.title}
                </h1>

                {/* Description */}
                <p className="text-white/85 text-[13px] sm:text-[14px] font-normal leading-relaxed max-w-2xl">
                  {selectedCampaign.description}
                </p>

                {/* Organizer Hospital */}
                <div className="flex items-center gap-2 text-white/90 text-[13px] font-semibold mt-4">
                  <div className="w-5 h-5 rounded-md bg-white/15 flex items-center justify-center text-white shrink-0">
                    <Building2 className="w-3.5 h-3.5" />
                  </div>
                  <span>تنظمها : {selectedCampaign.hospital}</span>
                </div>
              </div>

              {/* Left Side: Date & Time Box (Time on new line, aligned with date) */}
              <div className="lg:border-r lg:border-white/20 lg:pr-8 flex flex-row lg:flex-col items-center justify-center gap-3 text-center">
                <div className="w-9 h-9 rounded-[12px] bg-white/15 flex items-center justify-center text-white shadow-inner shrink-0">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <div className="flex flex-col items-center text-center text-white" dir="ltr">
                  <span className="text-[17px] sm:text-[19px] font-black leading-none">
                    {selectedCampaign.date}
                  </span>
                  <span className="text-[12px] text-white/80 font-medium mt-1.5 leading-none">
                    {selectedCampaign.timeRange}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Grid Content: Right side Details & Left side Participation Action */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* ── Main Details Column (In RTL layout: col-span-8 on the Right) ── */}
            <div className="lg:col-span-8 space-y-6">
              {/* Section 1: Campaign Details Cards */}
              <div className="bg-white rounded-[24px] p-6 sm:p-7 border border-[#f1f3f5] shadow-[0_4px_20px_rgba(0,0,0,0.03)] text-right">
                <h2 className="text-[19px] sm:text-[20px] font-black text-[#1a2332] mb-5">
                  تفاصيل الحملة
                </h2>

                {/* 3 Metric Cards Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Metric 1: التاريخ والوقت */}
                  <div className="bg-[#f8f9fb] rounded-[18px] p-4.5 flex items-center gap-3.5 border border-[#eef2f6]">
                    <Calendar className="w-6 h-6 text-[#991b30] shrink-0 stroke-[2]" />
                    <div className="text-right min-w-0">
                      <span className="text-[11.5px] text-[#64748b] font-medium block mb-0.5">
                        التاريخ والوقت
                      </span>
                      <span className="text-[13.5px] font-bold text-[#1e293b] block leading-tight">
                        {selectedCampaign.date}
                      </span>
                      <span className="text-[11px] text-[#64748b] font-medium block mt-0.5" dir="ltr">
                        {selectedCampaign.timeRange}
                      </span>
                    </div>
                  </div>

                  {/* Metric 2: الموقع */}
                  <div className="bg-[#f8f9fb] rounded-[18px] p-4.5 flex items-center gap-3.5 border border-[#eef2f6]">
                    <MapPin className="w-6 h-6 text-[#991b30] shrink-0 stroke-[2]" />
                    <div className="text-right min-w-0">
                      <span className="text-[11.5px] text-[#64748b] font-medium block mb-0.5">
                        الموقع
                      </span>
                      <span className="text-[13.5px] font-bold text-[#1e293b] block leading-tight truncate">
                        {selectedCampaign.location}
                      </span>
                      <span className="text-[11px] text-[#64748b] font-medium block mt-0.5 truncate">
                        {selectedCampaign.venue}
                      </span>
                    </div>
                  </div>

                  {/* Metric 3: العدد المستهدف */}
                  <div className="bg-[#f8f9fb] rounded-[18px] p-4.5 flex items-center gap-3.5 border border-[#eef2f6]">
                    <Users className="w-6 h-6 text-[#991b30] shrink-0 stroke-[2]" />
                    <div className="text-right min-w-0">
                      <span className="text-[11.5px] text-[#64748b] font-medium block mb-0.5">
                        العدد المستهدف
                      </span>
                      <span className="text-[17px] font-black text-[#1e293b] block leading-tight">
                        {selectedCampaign.targetParticipants}
                      </span>
                      <span className="text-[11px] text-[#64748b] font-medium block mt-0.5">
                        مشارك
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: Target Blood Types */}
              <div className="bg-white rounded-[24px] p-6 sm:p-7 border border-[#f1f3f5] shadow-[0_4px_20px_rgba(0,0,0,0.03)] text-right">
                <h3 className="text-[21px] sm:text-[23px] font-black text-[#1a2332] mb-2">
                  الفصائل المستهدفة
                </h3>
                <p className="text-[12.5px] sm:text-[13px] text-[#64748b] mb-5 font-normal">
                  يمكن لأصحاب الفصائل التالية تسجيل رغبتهم بالمشاركة:
                </p>

                {/* Blood Type Badges */}
                <div className="flex items-center justify-start flex-wrap gap-3">
                  {selectedCampaign.bloodTypes.map((type, idx) => (
                    <div
                      key={idx}
                      className="bg-[#fcedf0] text-[#991b30] font-black text-[14.5px] px-5 py-2.5 rounded-[12px] min-w-[58px] text-center border border-[#f7d6dd]"
                    >
                      {type}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Sidebar Column (In RTL layout: col-span-4 on the Left) ── */}
            <div className="lg:col-span-4">
              <div className={`bg-white rounded-[24px] border border-[#f1f3f5] shadow-[0_4px_20px_rgba(0,0,0,0.03)] ${donorView && participatingCampaigns.includes(selectedCampaign.id) ? "min-h-[230px] p-7 text-center" : "p-6 text-right"}`}>
                <h3 className={`${donorView && participatingCampaigns.includes(selectedCampaign.id) ? "text-[19px] sm:text-[20px] mb-3" : "text-[17px] sm:text-[18px] mb-2"} font-black text-[#1a2332]`}>
                  المشاركة في الحملة
                </h3>
                {donorView && participatingCampaigns.includes(selectedCampaign.id) ? (
                  <div className="pt-2">
                    <BadgeCheck className="mx-auto mb-3 h-9 w-9 text-[#13986f]" strokeWidth={1.8} />
                    <p className="text-[15px] font-bold text-[#124345]">أنت مسجل للمشاركة</p>
                    <p className="mt-2 mb-5 text-[13px] leading-relaxed text-[#8e9ca7]">
                      تم تسجيل رغبتك بالمشاركة في هذه الحملة.
                    </p>
                    <button
                      type="button"
                      onClick={() => setParticipatingCampaigns((current) => current.filter((id) => id !== selectedCampaign.id))}
                      className="w-full rounded-[10px] border border-[#e2e8f0] bg-white px-4 py-2.5 text-[13px] font-bold text-[#425563] hover:bg-[#f8fafc] cursor-pointer"
                    >
                      إلغاء مشاركتي
                    </button>
                  </div>
                ) : donorView ? (
                  <>
                    <p className="text-[12.5px] sm:text-[13px] text-[#64748b] leading-relaxed mb-6 font-normal">
                      سجّل رغبتك بالمشاركة في هذه الحملة.
                    </p>
                    <button
                      type="button"
                      onClick={() => setParticipatingCampaigns((current) => [...current, selectedCampaign.id])}
                      className="block w-full py-3 px-4 bg-[#991b30] hover:bg-[#831627] text-white text-[14px] font-bold rounded-[14px] text-center shadow-[0_4px_14px_rgba(153,27,48,0.25)] transition-all active:scale-[0.98] cursor-pointer"
                    >
                      أرغب بالمشاركة
                    </button>
                  </>
                ) : (<>
                <p className="text-[12.5px] sm:text-[13px] text-[#64748b] leading-relaxed mb-6 font-normal">
                  سجل الدخول بحساب متبرع للانضمام إلى الحملة ومتابعة حالة مشاركتك.
                </p>
                {/* Main Action Button */}
                <Link
                  href="/login"
                  className="block w-full py-3 px-4 bg-[#991b30] hover:bg-[#831627] text-white text-[14px] font-bold rounded-[14px] text-center shadow-[0_4px_14px_rgba(153,27,48,0.25)] transition-all active:scale-[0.98]"
                >
                  تسجيل الدخول للمشاركة
                </Link>

                {/* Secondary Action Button */}
                <Link
                  href="/donarPath"
                  className="block w-full py-3 px-4 mt-3 bg-white hover:bg-[#f8fafc] text-[#1e293b] text-[14px] font-bold rounded-[14px] text-center border border-[#e2e8f0] hover:border-[#cbd5e1] transition-colors"
                >
                  إنشاء حساب متبرع
                </Link>
                </>)}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ══════════════════════════════════════════════════════════════════════
           CAMPAIGNS LISTING & SEARCH VIEW
           ══════════════════════════════════════════════════════════════════════ */
        <>
          {/* ── Hero Section ─────────────────────────────────────────────── */}
          <section
            className="relative w-full overflow-hidden rounded-b-[28px] sm:rounded-b-[36px] pt-12 pb-16 sm:pt-14 sm:pb-20 text-white"
            style={{
              background:
                "linear-gradient(115deg, #214f52 0%, #265d61 35%, #357c81 70%, #4ea1a6 100%)",
            }}
          >
            {/* Background Decorative Rings */}
            <div className="absolute inset-0 pointer-events-none opacity-20 overflow-hidden">
              <div className="absolute -top-32 -left-20 w-[420px] h-[420px] rounded-full border border-white/40" />
              <div className="absolute -top-16 -left-8 w-[320px] h-[320px] rounded-full border border-white/30" />
            </div>

            <div className="relative max-w-3xl mx-auto px-4 text-center">
              {/* Top Pill Badge */}
              <div className="inline-flex items-center justify-center px-4 py-1 rounded-full bg-[#1b4345]/40 backdrop-blur-md border border-white/20 text-[#d4ebea] text-[12px] font-medium mb-4 shadow-sm">
                حملات تبرع منتظمة وآمنة
              </div>

              {/* Main Headline */}
              <h1 className="text-[28px] sm:text-[34px] md:text-[40px] font-black text-white leading-[1.25] tracking-tight">
                اختر حملة قريبة منك
                <br />
                وساهم في صنع الأمل
              </h1>

              {/* Subtitle */}
              <p className="mt-3 text-white/75 text-[13.5px] sm:text-[14.5px] max-w-xl mx-auto font-normal leading-relaxed">
                استكشف الحملات القادمة والجارية، واعرف المكان والموعد والفصائل المطلوبة قبل التسجيل.
              </p>
            </div>
          </section>

          {/* ── Floating Search & Filter Bar ─────────────────────────────── */}
          <div className="max-w-[1140px] mx-auto px-4 sm:px-8 -mt-7 sm:-mt-8 relative z-30">
            <div className="bg-white rounded-[16px] sm:rounded-[18px] px-8 sm:px-12 lg:px-14 py-3 sm:py-3.5 shadow-[0_12px_36px_rgba(0,0,0,0.06),0_2px_8px_rgba(0,0,0,0.04)] border border-[#f1f3f5]">
              <div className="flex flex-col md:flex-row items-center gap-3 sm:gap-4 w-full">
                {/* Main Search Input */}
                <div className="w-full md:flex-1 relative flex items-center">
                  <Search className="w-4 h-4 text-[#64748b] absolute right-3.5 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="ابحث باسم الحملة أو المؤسسة أو المدينة"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-[38px] pr-10 pl-4 text-[12.5px] sm:text-[13px] text-[#1e293b] placeholder:text-[#94a3b8] bg-white border border-[#e2e8f0] rounded-[12px] focus:outline-none focus:border-[#357c81] transition-colors text-right"
                  />
                </div>

                {/* Filter Buttons Container */}
                <div className="w-full md:w-auto flex items-center justify-between md:justify-start gap-2 sm:gap-2.5 overflow-visible">
                  {/* Filter 1: المحافظة */}
                  <div className="relative shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        setGovOpen(!govOpen);
                        setBloodOpen(false);
                        setStatusOpen(false);
                      }}
                      className="h-[38px] flex items-center gap-2 px-4 text-[12px] sm:text-[12.5px] font-medium text-[#475467] bg-white border border-[#e2e8f0] rounded-[12px] hover:border-[#cbd5e1] hover:text-[#1e293b] transition-colors whitespace-nowrap cursor-pointer"
                    >
                      <span>{selectedGov === "الكل" ? "المحافظة" : selectedGov}</span>
                      <ChevronDown
                        className={`w-3 h-3 text-[#94a3b8] transition-transform duration-150 ${
                          govOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {govOpen && (
                      <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-[#e2e8f0] rounded-[16px] shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100 max-h-60 overflow-y-auto">
                        {GOVERNORATES.map((gov) => (
                          <button
                            key={gov}
                            type="button"
                            onClick={() => {
                              setSelectedGov(gov);
                              setGovOpen(false);
                            }}
                            className={`w-full text-right px-4 py-2 text-[12px] transition-colors ${
                              selectedGov === gov
                                ? "bg-[#eef7f7] text-[#214f52] font-bold"
                                : "text-[#475467] hover:bg-[#f8fafc]"
                            }`}
                          >
                            {gov}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Filter 2: الفصائل */}
                  <div className="relative shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        setBloodOpen(!bloodOpen);
                        setGovOpen(false);
                        setStatusOpen(false);
                      }}
                      className="h-[38px] flex items-center gap-2 px-4 text-[12px] sm:text-[12.5px] font-medium text-[#475467] bg-white border border-[#e2e8f0] rounded-[12px] hover:border-[#cbd5e1] hover:text-[#1e293b] transition-colors whitespace-nowrap cursor-pointer"
                    >
                      <span>
                        {selectedBloodType === "الكل" ? "الفصائل" : selectedBloodType}
                      </span>
                      <ChevronDown
                        className={`w-3 h-3 text-[#94a3b8] transition-transform duration-150 ${
                          bloodOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {bloodOpen && (
                      <div className="absolute right-0 top-full mt-2 w-40 bg-white border border-[#e2e8f0] rounded-[16px] shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100 max-h-60 overflow-y-auto">
                        {BLOOD_TYPES_OPTIONS.map((bt) => (
                          <button
                            key={bt}
                            type="button"
                            onClick={() => {
                              setSelectedBloodType(bt);
                              setBloodOpen(false);
                            }}
                            className={`w-full text-right px-4 py-2 text-[12px] transition-colors ${
                              selectedBloodType === bt
                                ? "bg-[#eef7f7] text-[#214f52] font-bold"
                                : "text-[#475467] hover:bg-[#f8fafc]"
                            }`}
                          >
                            {bt}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Filter 3: حالة الحملة */}
                  <div className="relative shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        setStatusOpen(!statusOpen);
                        setGovOpen(false);
                        setBloodOpen(false);
                      }}
                      className="h-[38px] flex items-center gap-2 px-4 text-[12px] sm:text-[12.5px] font-medium text-[#475467] bg-white border border-[#e2e8f0] rounded-[12px] hover:border-[#cbd5e1] hover:text-[#1e293b] transition-colors whitespace-nowrap cursor-pointer"
                    >
                      <span>
                        {selectedStatus === "الكل" ? "حالة الحملة" : selectedStatus}
                      </span>
                      <ChevronDown
                        className={`w-3 h-3 text-[#94a3b8] transition-transform duration-150 ${
                          statusOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {statusOpen && (
                      <div className="absolute right-0 top-full mt-2 w-36 bg-white border border-[#e2e8f0] rounded-[16px] shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                        {STATUS_OPTIONS.map((st) => (
                          <button
                            key={st}
                            type="button"
                            onClick={() => {
                              setSelectedStatus(st);
                              setStatusOpen(false);
                            }}
                            className={`w-full text-right px-4 py-2 text-[12px] transition-colors ${
                              selectedStatus === st
                                ? "bg-[#eef7f7] text-[#214f52] font-bold"
                                : "text-[#475467] hover:bg-[#f8fafc]"
                            }`}
                          >
                            {st}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Main Content: Available Campaigns ───────────────────────── */}
          <main className="max-w-[1140px] mx-auto px-4 sm:px-8 pt-10 pb-20">
            {/* Section Header */}
            <div className="flex items-start justify-between mb-6">
              {/* Section Title & Subtitle (Right in RTL) */}
              <div className="text-right">
                <h2 className="text-[20px] sm:text-[22px] font-bold text-[#1a2332] tracking-tight">
                  الحملات المتاحة
                </h2>
                <p className="text-[12px] text-[#94a3b8] font-normal mt-0.5">
                  مرتبة حسب أقرب موعد
                </p>
              </div>

              {/* Counter Badge (Left in RTL) */}
              <div className="inline-flex items-center gap-1 bg-[#e7f6ec] text-[#1c7a42] text-[12px] font-bold px-3 py-1 rounded-full">
                <span>{filteredCampaigns.length} حملات</span>
              </div>
            </div>

            {/* Empty state if no campaigns matched */}
            {filteredCampaigns.length === 0 ? (
              <div className="bg-white rounded-[24px] border border-[#f1f3f5] p-10 text-center my-6 shadow-xs">
                <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3 text-[#94a3b8]">
                  <Search className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-[#1e293b]">
                  {!donorView && loading ? "جاري تحميل الحملات..." : error ?? "لم يتم العثور على أي حملات"}
                </h3>
                <p className="text-[12px] text-[#94a3b8] mt-1">
                  {!donorView && loading ? "يرجى الانتظار." : error ? "اضغط أدناه لإعادة المحاولة." : "جرب تغيير كلمات البحث أو إعادة ضبط الفلاتر المحددة."}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedGov("الكل");
                    setSelectedBloodType("الكل");
                    setSelectedStatus("الكل");
                    if (!donorView) setReload((value) => value + 1);
                  }}
                  className="mt-4 px-4 py-2 bg-[#eef7f7] text-[#214f52] text-[12px] font-bold rounded-xl hover:bg-[#d8eded] transition-colors cursor-pointer"
                >
                  إعادة ضبط الفلاتر
                </button>
              </div>
            ) : (
              /* Cards Grid */
              <div
                dir="rtl"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredCampaigns.map((camp) => (
                  <div
                    key={camp.id}
                    className="group bg-white rounded-[28px] border border-[#eef2f5] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_10px_28px_rgba(0,0,0,0.07)] transition-all duration-200 flex flex-col justify-between"
                  >
                    <div>
                      {/* Card Top Banner */}
                      <div
                        className="p-5 px-6 flex items-center justify-between"
                        style={{
                          background:
                            "linear-gradient(135deg, #edf6f4 0%, #f5faf8 55%, #fdf5f6 100%)",
                        }}
                      >
                        {/* Date Box */}
                        <div className="bg-white rounded-[18px] shadow-[0_4px_14px_rgba(0,0,0,0.05)] px-4 py-2 text-center min-w-[58px]">
                          <div className="text-[22px] font-black text-[#991b30] leading-none">
                            {camp.day}
                          </div>
                          <div className="text-[10.5px] text-[#8e9ca7] font-medium mt-1">
                            {camp.month}
                          </div>
                        </div>

                        {/* Status */}
                        <div className="flex items-center gap-1.5">
                          {camp.status === "جارية" ? (
                            <span className="flex items-center gap-1.5 text-[#1b7a42] text-[12px] font-bold">
                              <span className="w-2 h-2 rounded-full bg-[#1b7a42]" />
                              <span>جارية</span>
                            </span>
                          ) : (
                            <span className="flex items-center gap-1.5 text-[#2563eb] text-[12px] font-bold">
                              <span className="w-2 h-2 rounded-full bg-[#2563eb]" />
                              <span>قادمة</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="p-6 text-right">
                        {/* Hospital */}
                        <div className="text-[13px] font-bold text-[#991b30]">
                          {camp.hospital}
                        </div>

                        {/* Title */}
                        <h3 className="text-[19px] font-black text-[#124345] mt-1 mb-2.5 leading-snug tracking-tight">
                          {camp.title}
                        </h3>

                        {/* Description */}
                        <p className="text-[12.5px] text-[#6b7c88] leading-[1.65] mb-5 line-clamp-2">
                          {camp.description}
                        </p>

                        {/* Info Rows */}
                        <div className="space-y-2.5 mb-5">
                          {/* Time and Date */}
                          <div className="flex items-center justify-start gap-2.5 text-[#64748b]">
                            <Calendar className="w-4 h-4 text-[#991b30] shrink-0" />
                            <span className="text-[12px] font-medium text-[#64748b]" dir="ltr">
                              {camp.timeRange} · {camp.date}
                            </span>
                          </div>

                          {/* Location */}
                          <div className="flex items-center justify-start gap-2.5 text-[#64748b]">
                            <MapPin className="w-4 h-4 text-[#991b30] shrink-0" />
                            <span className="text-[12px] font-medium text-[#64748b]">
                              {camp.location}
                            </span>
                          </div>
                        </div>

                        {/* Blood Types Badges */}
                        <div className="flex items-center justify-start flex-wrap gap-1.5">
                          {camp.bloodTypes.map((type, idx) => (
                            <span
                              key={idx}
                              className="bg-[#faebee] text-[#991b30] text-[11.5px] font-bold px-3.5 py-1 rounded-[8px]"
                            >
                              {type}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Card Footer Button */}
                    <div className="px-6 py-4 border-t border-[#edf1f4] bg-white">
                      <button
                        type="button"
                        onClick={() => openCampaign(camp)}
                        className="w-full flex items-center justify-between text-[13.5px] font-bold text-[#124345] hover:text-[#991b30] transition-colors py-0.5 group/btn cursor-pointer"
                      >
                        <span>عرض تفاصيل الحملة</span>
                        <ArrowLeft className="w-4 h-4 text-[#124345] group-hover/btn:text-[#991b30] group-hover/btn:-translate-x-1.5 transition-all" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </>
      )}
    </div>
  );
}
