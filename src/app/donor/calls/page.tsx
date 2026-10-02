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
  LoaderCircle,
} from "lucide-react";

import DonorHeader from "@/src/features/donor-dashboard/components/DonorHeader";
import { getCurrentUser } from "@/src/features/donor-dashboard/services/donor.service";
import { backendProxyUrl } from "@/src/config/api";

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

interface DonorCampaign {
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
  my_participation: { status: "registered" | "attended" | "donated" | "cancelled" } | null;
}

function mapCampaign(campaign: DonorCampaign): Campaign {
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

async function campaignRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(backendProxyUrl(path), {
    ...options,
    headers: { Accept: "application/json" },
    credentials: "same-origin",
    cache: "no-store",
  });
  const payload = await response.json().catch(() => null);
  if (!response.ok || !payload || payload.success === false) {
    throw new Error(payload?.message || "تعذر تنفيذ الطلب. يرجى المحاولة مجددًا.");
  }
  return payload as T;
}

async function fetchCampaigns(query: URLSearchParams, signal: AbortSignal): Promise<DonorCampaign[]> {
  const campaigns: DonorCampaign[] = [];
  let page = 1;
  let lastPage = 1;
  do {
    query.set("page", String(page));
    const response = await campaignRequest<{
      data: DonorCampaign[];
      meta: { last_page: number };
    }>(`/donor/campaigns?${query}`, { signal });
    campaigns.push(...response.data);
    lastPage = response.meta.last_page;
    page += 1;
  } while (page <= lastPage);
  return campaigns;
}

function isParticipating(status?: string): boolean {
  return status === "registered" || status === "attended" || status === "donated";
}

function DonorCampaignContent() {
  const donorView = true;
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGov, setSelectedGov] = useState("الكل");
  const [selectedBloodType, setSelectedBloodType] = useState("الكل");
  const [selectedStatus, setSelectedStatus] = useState("الكل");
  const [govOpen, setGovOpen] = useState(false);
  const [bloodOpen, setBloodOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [participationStatuses, setParticipationStatuses] = useState<Record<string, string>>({});
  const participatingCampaigns = Object.keys(participationStatuses).filter((id) => isParticipating(participationStatuses[id]));
  const hasDonated = selectedCampaign !== null && participationStatuses[selectedCampaign.id] === "donated";
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [reload, setReload] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [loadState, setLoadState] = useState<{
    key: string | null;
    status: "loading" | "success" | "error";
    message?: string;
  }>({ key: null, status: "loading" });
  const listKey = JSON.stringify([searchQuery, selectedGov, selectedBloodType, selectedStatus, reload]);
  const isLoading = loadState.key !== listKey || loadState.status === "loading";
  const mutationPending = useRef(false);
  const mounted = useRef(false);
  const participationVersion = useRef(0);

  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; };
  }, []);

  useEffect(() => {
    const refresh = () => {
      if (document.visibilityState === "visible" && !mutationPending.current) setReload((value) => value + 1);
    };
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", refresh);
    const timer = selectedCampaign && !hasDonated ? window.setInterval(refresh, 30_000) : undefined;
    return () => {
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", refresh);
      if (timer !== undefined) window.clearInterval(timer);
    };
  }, [selectedCampaign, hasDonated]);

  useEffect(() => {
    const controller = new AbortController();
    const version = participationVersion.current;
    const timer = setTimeout(async () => {
      setLoadState({ key: listKey, status: "loading" });
      const query = new URLSearchParams();
      if (searchQuery.trim()) query.set("search", searchQuery.trim());
      if (selectedGov !== "الكل") query.set("governorate", selectedGov);
      if (!["الكل", "جميع الفصائل"].includes(selectedBloodType)) query.set("blood_type", selectedBloodType);
      if (selectedStatus !== "الكل") query.set("status", selectedStatus === "جارية" ? "active" : "published");
      try {
        const result = await fetchCampaigns(query, controller.signal);
        if (controller.signal.aborted) return;
        setCampaigns(result.map(mapCampaign).sort((a, b) => a.date.localeCompare(b.date)));
        if (version === participationVersion.current && !mutationPending.current) {
          setParticipationStatuses(Object.fromEntries(result
            .filter((campaign) => campaign.my_participation !== null)
            .map((campaign) => [String(campaign.id), campaign.my_participation!.status])));
        }
        setLoadState({ key: listKey, status: "success" });
      } catch (error) {
        if (!controller.signal.aborted) {
          const message = error instanceof Error ? error.message : "تعذر تحميل الحملات.";
          setLoadState({ key: listKey, status: "error", message });
          toast.error(message);
        }
      }
    }, 300);
    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [searchQuery, selectedGov, selectedBloodType, selectedStatus, reload, listKey]);

  async function updateParticipation(id: string, action: "join" | "cancel-participation") {
    if (mutationPending.current) return;
    if (action === "cancel-participation" && participationStatuses[id] === "donated") return;
    mutationPending.current = true;
    participationVersion.current += 1;
    setSubmitting(true);
    try {
      if (action === "join") {
        // Check all campaigns so search filters cannot hide an existing participation.
        const currentCampaigns = await fetchCampaigns(new URLSearchParams(), new AbortController().signal);
        if (!mounted.current) return;
        const alreadyParticipating = currentCampaigns.some((campaign) =>
          String(campaign.id) !== id &&
          ["registered", "attended"].includes(campaign.my_participation?.status ?? ""));
        if (alreadyParticipating) {
          toast.error("أنت مشارك بالفعل في حملة تبرع أخرى، ولا يمكنك المشاركة في حملتين بنفس الوقت. ألغِ مشاركتك الحالية أولًا للمشاركة في هذه الحملة.");
          return;
        }
      }
      const result = await campaignRequest<{ message: string; data: { status: string } }>(
        `/donor/campaigns/${encodeURIComponent(id)}/${action}`,
        { method: "POST" },
      );
      if (!mounted.current) return;
      setParticipationStatuses((current) => ({ ...current, [id]: result.data.status }));
      toast.success(result.message);
      setReload((value) => value + 1);
    } catch (error) {
      if (mounted.current) toast.error(error instanceof Error ? error.message : "تعذر تحديث المشاركة.");
    } finally {
      mutationPending.current = false;
      if (mounted.current) setSubmitting(false);
    }
  }

  const filteredCampaigns = useMemo(() => selectedBloodType === "جميع الفصائل"
    ? campaigns.filter((campaign) => BLOOD_TYPES_OPTIONS.slice(2).every((type) => campaign.bloodTypes.includes(type)))
    : campaigns, [campaigns, selectedBloodType]);

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
                    <p className="text-[15px] font-bold text-[#124345]">{hasDonated ? "تم التبرع" : "أنت مسجل للمشاركة"}</p>
                    <p className="mt-2 mb-5 text-[13px] leading-relaxed text-[#8e9ca7]">
                      {hasDonated ? "تم تأكيد تبرعك في هذه الحملة من المؤسسة." : "تم تسجيل رغبتك بالمشاركة في هذه الحملة."}
                    </p>
                    {!hasDonated && <button
                      type="button"
                      disabled={submitting}
                      onClick={() => updateParticipation(selectedCampaign.id, "cancel-participation")}
                      className="w-full rounded-[10px] border border-[#e2e8f0] bg-white px-4 py-2.5 text-[13px] font-bold text-[#425563] hover:bg-[#f8fafc] cursor-pointer"
                    >
                      إلغاء مشاركتي
                    </button>}
                  </div>
                ) : donorView ? (
                  <>
                    <p className="text-[12.5px] sm:text-[13px] text-[#64748b] leading-relaxed mb-6 font-normal">
                      سجّل رغبتك بالمشاركة في هذه الحملة.
                    </p>
                    <button
                      type="button"
                      disabled={submitting}
                      onClick={() => updateParticipation(selectedCampaign.id, "join")}
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
                <span>{isLoading ? "جارٍ التحميل..." : loadState.status === "error" ? "—" : `${filteredCampaigns.length} حملات`}</span>
              </div>
            </div>

            {/* Show the empty state only after a successful request. */}
            {isLoading ? (
              <div role="status" aria-live="polite" className="bg-white rounded-[24px] border border-[#f1f3f5] p-10 text-center my-6 shadow-xs">
                <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3 text-[#94a3b8]">
                  <LoaderCircle className="w-5 h-5 animate-spin motion-reduce:animate-none" />
                </div>
                <h3 className="text-sm font-bold text-[#1e293b]">جارٍ تحميل الحملات...</h3>
                <p className="text-[12px] text-[#94a3b8] mt-1">يرجى الانتظار حتى يتم تحميل الحملات المتاحة.</p>
              </div>
            ) : loadState.status === "error" ? (
              <div role="alert" className="bg-white rounded-[24px] border border-[#f1f3f5] p-10 text-center my-6 shadow-xs">
                <h3 className="text-sm font-bold text-[#1e293b]">تعذر تحميل الحملات</h3>
                <p className="text-[12px] text-[#94a3b8] mt-1">{loadState.message}</p>
                <button
                  type="button"
                  onClick={() => setReload((value) => value + 1)}
                  className="mt-4 px-4 py-2 bg-[#eef7f7] text-[#214f52] text-[12px] font-bold rounded-xl hover:bg-[#d8eded] transition-colors cursor-pointer"
                >
                  إعادة المحاولة
                </button>
              </div>
            ) : filteredCampaigns.length === 0 ? (
              <div className="bg-white rounded-[24px] border border-[#f1f3f5] p-10 text-center my-6 shadow-xs">
                <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3 text-[#94a3b8]">
                  <Search className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-[#1e293b]">
                  لم يتم العثور على أي حملات
                </h3>
                <p className="text-[12px] text-[#94a3b8] mt-1">
                  جرب تغيير كلمات البحث أو إعادة ضبط الفلاتر المحددة.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedGov("الكل");
                    setSelectedBloodType("الكل");
                    setSelectedStatus("الكل");
                    setReload((value) => value + 1);
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
                        onClick={() => setSelectedCampaign(camp)}
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

export default function DonorCallsPage() {
  const [userName, setUserName] = useState("المتبرع");

  useEffect(() => {
    const controller = new AbortController();

    getCurrentUser(controller.signal)
      .then((response) => setUserName(response.data.name))
      .catch(() => {});

    return () => controller.abort();
  }, []);

  return (
    <>
      <DonorHeader userName={userName} />
      <div className="mx-auto max-w-[1240px] px-5 pb-12 pt-[15px] lg:px-8">
        <DonorCampaignContent />
      </div>
    </>
  );
}
