"use client";

import {
  ChevronDown,
  Info,
  MapPin,
  Plus,
  Search,
  Target,
  UsersRound,
} from "lucide-react";

import { useState } from "react";

import {
  DONATION_CALL_STATUS_LABELS,
  DONATION_PRIORITY_LABELS,
} from "../config/donation.config";

import {
  useDonationCalls,
  type DonationCallTab,
} from "../hooks/useDonationCalls";

import type { DonationCall } from "../types/donation.types";

import CreateDonationCallModal from "./CreateDonationCallModal";
import DonationCallDetailsModal from "./DonationCallDetailsModal";
import Link from "next/link";

const TABS: Array<{
  value: DonationCallTab;
  label: string;
}> = [
  {
    value: "all",
    label: "الكل",
  },
  {
    value: "active",
    label: "النشطة",
  },
  {
    value: "closed",
    label: "المغلقة",
  },
];

export default function DonationCallsPage() {
  const {
    calls,

    search,
    region,
    tab,

    regions,

    total,
    page,
    lastPage,

    loading,
    error,

    setSearch,
    setRegion,
    setTab,
    setPage,

    reload,
  } = useDonationCalls();

  const [createOpen, setCreateOpen] = useState(false);

  const [detailsCallId, setDetailsCallId] = useState<number | null>(null);

  const [notice, setNotice] = useState<string | null>(null);

  function handleCreated() {
    setNotice("تم إنشاء نداء التبرع بنجاح.");

    reload();

    window.setTimeout(() => {
      setNotice(null);
    }, 4000);
  }

  return (
    <>
      <section
        className="
          mx-auto
          w-full
          max-w-[1240px]
          pb-10 pt-5
        "
      >
        <div
          className="
            flex
            flex-col
            gap-5
            sm:flex-row
            sm:items-start
            sm:justify-between
          "
        >
          <div>
            <span
              className="
                text-xs
                font-bold
                text-[#ad1e38]
              "
            >
              التواصل مع المتبرعين
            </span>

            <h1
              className="
                mt-1
                text-[28px]
                font-extrabold
                text-[#25373f]
              "
            >
              نداءات التبرع
            </h1>

            <p
              className="
                mt-1
                text-sm
                text-[#7b898f]
              "
            >
              أنشئ نداءات فعالة واستهدف المتبرعين المناسبين وتابع استجاباتهم.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setCreateOpen(true)}
            className="
              flex h-[46px]
              items-center
              justify-center
              gap-2
              self-start
              rounded-xl
              bg-[#ad1e38]
              px-5
              text-sm
              font-bold
              text-white
              shadow-[0_8px_20px_rgba(173,30,56,0.18)]
              transition
              hover:bg-[#94182f]
            "
          >
            <Plus className="h-4 w-4" />
            إنشاء نداء
          </button>
        </div>

        <div
          className="
            mt-6
            flex
            max-w-[650px]
            flex-col
            gap-3
            sm:flex-row
          "
        >
          <div className="relative flex-1">
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="البحث بعنوان نداء التبرع"
              className="
                h-[44px]
                w-full
                rounded-full
                border
                border-[#e1e5e7]
                bg-white
                pr-5 pl-11
                text-xs
                text-[#34454c]
                outline-none
                placeholder:text-[#8c989d]
                focus:border-[#ad1e38]/30
                focus:ring-2
                focus:ring-[#ad1e38]/5
              "
            />

            <Search
              className="
                absolute
                left-4 top-1/2
                h-4 w-4
                -translate-y-1/2
                text-[#9aa5aa]
              "
              strokeWidth={1.7}
            />
          </div>

          <div className="relative sm:w-[150px]">
            <select
              value={region}
              onChange={(event) => setRegion(event.target.value)}
              className="
                h-[44px]
                w-full
                appearance-none
                rounded-full
                border
                border-[#e1e5e7]
                bg-white
                pr-5 pl-10
                text-xs
                text-[#596970]
                outline-none
              "
            >
              <option value="">المنطقة</option>

              {regions.map((regionValue) => (
                <option key={regionValue} value={regionValue}>
                  {regionValue}
                </option>
              ))}
            </select>

            <ChevronDown
              className="
                pointer-events-none
                absolute
                left-4 top-1/2
                h-4 w-4
                -translate-y-1/2
                text-[#8e9a9f]
              "
            />
          </div>
        </div>

        <div
          className="
            mt-4
            inline-flex
            rounded-full
            bg-[#f3f3f2]
            p-1
          "
        >
          {TABS.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setTab(item.value)}
              className={`
                  min-w-[76px]
                  rounded-full
                  px-4 py-2
                  text-xs
                  transition
                  ${
                    tab === item.value
                      ? "bg-white font-bold text-[#36484f] shadow-sm"
                      : "font-medium text-[#8a969b]"
                  }
                `}
            >
              {item.label}
            </button>
          ))}
        </div>

        {notice && (
          <div
            className="
              mt-5
              rounded-xl
              border
              border-emerald-100
              bg-emerald-50
              px-4 py-3
              text-xs
              font-semibold
              text-emerald-700
            "
          >
            {notice}
          </div>
        )}

        {error ? (
          <div
            className="
              mt-6
              rounded-2xl
              bg-red-50
              px-5 py-8
              text-center
              text-sm
              text-red-700
            "
          >
            {error}

            <button
              type="button"
              onClick={reload}
              className="
                mr-2
                font-bold
                underline
              "
            >
              إعادة المحاولة
            </button>
          </div>
        ) : loading ? (
          <CallsSkeleton />
        ) : calls.length === 0 ? (
          <div
            className="
              mt-7
              flex min-h-[320px]
              flex-col
              items-center
              justify-center
              rounded-2xl
              border
              border-[#e6eaec]
              bg-white
              text-center
            "
          >
            <div
              className="
                grid h-14 w-14
                place-items-center
                rounded-full
                bg-[#fbedf0]
                text-[#ad1e38]
              "
            >
              <Plus className="h-6 w-6" />
            </div>

            <h3
              className="
                mt-4
                text-sm
                font-bold
                text-[#415159]
              "
            >
              لا توجد نداءات تبرع
            </h3>

            <p
              className="
                mt-1
                text-xs
                text-[#879399]
              "
            >
              يمكنك إنشاء نداء جديد من الزر بالأعلى.
            </p>
          </div>
        ) : (
          <div
            className="
              mt-6
              grid gap-4
              lg:grid-cols-2
            "
          >
            {calls.map((call) => (
              <DonationCallCard
                key={call.id}
                call={call}
                onDetails={() => setDetailsCallId(call.id)}
              />
            ))}
          </div>
        )}

        {!loading && !error && total > 0 && lastPage > 1 && (
          <div
            className="
                mt-6
                flex items-center
                justify-between
                border-t
                border-[#e6eaec]
                pt-5
              "
          >
            <span
              className="
                  text-xs
                  text-[#7f8c91]
                "
            >
              صفحة {page} من {lastPage}
            </span>

            <div className="flex gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="
                    rounded-lg
                    border
                    border-[#e0e5e7]
                    bg-white
                    px-4 py-2
                    text-xs
                    font-bold
                    text-[#596970]
                    disabled:opacity-40
                  "
              >
                السابق
              </button>

              <button
                type="button"
                disabled={page >= lastPage}
                onClick={() => setPage(page + 1)}
                className="
                    rounded-lg
                    border
                    border-[#e0e5e7]
                    bg-white
                    px-4 py-2
                    text-xs
                    font-bold
                    text-[#596970]
                    disabled:opacity-40
                  "
              >
                التالي
              </button>
            </div>
          </div>
        )}
      </section>

      {createOpen && (
        <CreateDonationCallModal
          onClose={() => setCreateOpen(false)}
          onCreated={handleCreated}
        />
      )}

      {detailsCallId !== null && (
        <DonationCallDetailsModal
          callId={detailsCallId}
          onClose={() => setDetailsCallId(null)}
        />
      )}
    </>
  );
}

function DonationCallCard({
  call,
  onDetails,
}: {
  call: DonationCall;
  onDetails: () => void;
}) {
  return (
    <article
      className="
        overflow-hidden
        rounded-2xl
        border
        border-[#dfe5e7]
        bg-white
        shadow-[0_4px_18px_rgba(28,50,58,0.025)]
      "
    >
      <div className="px-5 py-5">
        <div
          className="
            flex
            items-start
            justify-between
            gap-4
          "
        >
          <div
            className="
              flex min-w-0
              items-start
              gap-3
            "
          >
            <div
              className="
                grid h-[46px]
                w-[46px]
                shrink-0
                place-items-center
                rounded-xl
                bg-[#fbedf0]
                text-sm
                font-extrabold
                text-[#ad1e38]
              "
              dir="ltr"
            >
              {call.blood_type}
            </div>

            <div className="min-w-0">
              <h2
                className="
                  truncate
                  text-[15px]
                  font-extrabold
                  text-[#283a42]
                "
              >
                {call.title}
              </h2>

              <div
                className="
                  mt-2
                  flex flex-wrap
                  items-center
                  gap-2
                  text-[9px]
                  text-[#8a969b]
                "
              >
                <span
                  className="
                    inline-flex
                    items-center
                    gap-1
                  "
                >
                  <MapPin className="h-3 w-3" />

                  {call.institution?.name ?? "المؤسسة"}

                  {call.institution?.governorate
                    ? ` — ${call.institution.governorate}`
                    : ""}
                </span>

                <span>·</span>

                <span>{formatCardDate(call.needed_at)}</span>
              </div>
            </div>
          </div>

          <CallStatusBadge status={call.status} />
        </div>
      </div>

      <div
        className="
          grid
          grid-cols-4
          bg-[#f1f6f5]
          px-4 py-3
        "
      >
        <Metric label="المطلوب" value={`${call.units_required} متبرعين`} />

        <Metric
          label="تم استهداف"
          value={String(call.counts.invitations_sent)}
        />

        <Metric label="استجاب" value={String(call.counts.interested)} />

        <Metric
          label="الأولوية"
          value={DONATION_PRIORITY_LABELS[call.priority]}
          accent={call.priority === "emergency"}
        />
      </div>

      <div
        className="
          flex
          flex-wrap
          items-center
          gap-2
          px-5 py-4
        "
      >
        <Link
          href={`/HospitalDashboard/donations/calls/${call.id}/responders`}
          className="
    inline-flex h-[38px]
    items-center
    gap-2
    rounded-lg
    border
    border-[#dce3e5]
    bg-white
    px-4
    text-[10px]
    font-semibold
    text-[#637279]
    transition
    hover:bg-slate-50
  "
        >
          <UsersRound className="h-4 w-4" />
          المستجيبون
        </Link>

        {call.status === "active" ? (
          <Link
            href={`/HospitalDashboard/donations/calls/${call.id}/targeting`}
            className="
      inline-flex h-[38px]
      items-center
      gap-2
      rounded-lg
      border
      border-[#dce3e5]
      bg-white
      px-4
      text-[10px]
      font-semibold
      text-[#637279]
      transition
      hover:bg-slate-50
    "
          >
            <Target className="h-4 w-4" />
            استهداف متبرعين
          </Link>
        ) : (
          <button
            type="button"
            disabled
            className="
      inline-flex h-[38px]
      cursor-not-allowed
      items-center
      gap-2
      rounded-lg
      border
      border-[#e3e7e8]
      bg-[#fafbfb]
      px-4
      text-[10px]
      font-semibold
      text-[#a2acb0]
    "
          >
            <Target className="h-4 w-4" />
            استهداف متبرعين
          </button>
        )}

        <button
          type="button"
          onClick={onDetails}
          className="
            inline-flex h-[38px]
            items-center
            gap-2
            rounded-lg
            border
            border-[#dce3e5]
            bg-white
            px-4
            text-[10px]
            font-semibold
            text-[#637279]
            transition
            hover:bg-slate-50
          "
        >
          <Info className="h-4 w-4" />
          عرض التفاصيل
        </button>
      </div>
    </article>
  );
}

function Metric({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="text-center">
      <span
        className="
          block
          text-[9px]
          text-[#91a0a5]
        "
      >
        {label}
      </span>

      <strong
        className={`
          mt-1 block
          text-[11px]
          font-extrabold
          ${accent ? "text-[#b22440]" : "text-[#42545b]"}
        `}
      >
        {value}
      </strong>
    </div>
  );
}

function CallStatusBadge({ status }: { status: DonationCall["status"] }) {
  const active = status === "active";

  return (
    <span
      className={`
        inline-flex
        shrink-0
        items-center
        gap-1.5
        rounded-full
        px-2.5 py-1
        text-[9px]
        font-bold
        ${
          active ? "bg-[#eef6f4] text-[#478579]" : "bg-[#f0f2f3] text-[#76858b]"
        }
      `}
    >
      <span
        className="
          h-1.5 w-1.5
          rounded-full
          bg-current
        "
      />

      {DONATION_CALL_STATUS_LABELS[status]}
    </span>
  );
}

function formatCardDate(value: string | null) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  const datePart = new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);

  const timePart = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);

  return `${datePart} · ${timePart}`;
}

function CallsSkeleton() {
  return (
    <div
      className="
        mt-6
        grid gap-4
        lg:grid-cols-2
      "
    >
      {Array.from({
        length: 4,
      }).map((_, index) => (
        <div
          key={index}
          className="
            h-[245px]
            animate-pulse
            rounded-2xl
            border
            border-[#e6eaec]
            bg-white
          "
        />
      ))}
    </div>
  );
}
