"use client";

import { ChevronDown, Search } from "lucide-react";

import { useState } from "react";

import {
  BLOOD_TYPE_FILTERS,
  REGION_OPTIONS,
  VOLUNTARY_STATUS_LABELS,
} from "../config/donation.config";

import { bloodTypeCount, formatDonationDateTime } from "../lib/donation.utils";

import { useVoluntaryDonationRequests } from "../hooks/useVoluntaryDonationRequests";

import type {
  BloodType,
  VoluntaryDonationRequest,
} from "../types/donation.types";

import ScheduleDonationModal from "./ScheduleDonationModal";

export default function VoluntaryDonationRequestsPage() {
  const {
    requests,
    meta,
    filters,

    loading,
    error,

    setSearch,
    setRegion,
    setBloodType,
    setPage,

    reload,
  } = useVoluntaryDonationRequests();

  const [selectedRequest, setSelectedRequest] =
    useState<VoluntaryDonationRequest | null>(null);

  const [notice, setNotice] = useState<string | null>(null);

  function handleScheduled() {
    setNotice("تم تحديد موعد التبرع وإشعار المتبرع بنجاح.");

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
        <div>
          <h1
            className="
              text-[26px]
              font-extrabold
              tracking-tight
              text-[#25373f]
              sm:text-[28px]
            "
          >
            طلبات التبرع الطوعي
          </h1>

          <p
            className="
              mt-1
              text-sm
              text-[#7b898f]
            "
          >
            طلبات المتبرعين ومواعيد حضورهم وحالة كل تبرع
          </p>
        </div>

        <div
          className="
            mt-5
            flex w-full
            max-w-[650px]
            flex-col
            gap-3
            sm:flex-row
          "
        >
          <div
            className="
              relative
              flex-1
            "
          >
            <input
              type="search"
              value={filters.search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="البحث باسم المتبرع"
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
                transition
                placeholder:text-[#8c989d]
                focus:border-[#a61f36]/30
                focus:ring-2
                focus:ring-[#a61f36]/5
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
              value={filters.region}
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
                focus:border-[#a61f36]/30
              "
            >
              <option value="">المنطقة</option>

              {REGION_OPTIONS.map((region) => (
                <option key={region.value} value={region.value}>
                  {region.label}
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
              strokeWidth={1.7}
            />
          </div>
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

        <div
          className="
            mt-8
            rounded-[20px]
            border
            border-[#e8ecee]
            bg-white
            p-5
            shadow-[0_5px_20px_rgba(28,50,58,0.035)]
            sm:p-6
          "
        >
          <div
            className="
              overflow-x-auto
              pb-1
            "
          >
            <div
              className="
                flex min-w-[820px]
                items-center
                gap-1
                rounded-2xl
                bg-[#f4f5f5]
                p-1
              "
            >
              <BloodFilterButton
                label="جميع الفصائل"
                count={meta?.total ?? 0}
                active={filters.bloodType === ""}
                onClick={() => setBloodType("")}
              />

              {BLOOD_TYPE_FILTERS.map((bloodType) => (
                <BloodFilterButton
                  key={bloodType}
                  label={bloodType}
                  count={bloodTypeCount(meta?.blood_type_counts, bloodType)}
                  active={filters.bloodType === bloodType}
                  onClick={() => setBloodType(bloodType)}
                />
              ))}
            </div>
          </div>

          <div
            className="
              my-6
              h-px
              bg-[#edf0f1]
            "
          />

          {error ? (
            <div
              className="
                rounded-xl
                bg-red-50
                px-5 py-7
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
            <RequestsSkeleton />
          ) : requests.length === 0 ? (
            <div
              className="
                flex min-h-[260px]
                flex-col
                items-center
                justify-center
                text-center
              "
            >
              <div
                className="
                  grid h-14 w-14
                  place-items-center
                  rounded-full
                  bg-[#fbebef]
                  text-lg
                  font-extrabold
                  text-[#a61f36]
                "
              >
                +
              </div>

              <h3
                className="
                  mt-4
                  text-sm
                  font-bold
                  text-[#415159]
                "
              >
                لا توجد طلبات تبرع
              </h3>

              <p
                className="
                  mt-1
                  text-xs
                  text-[#879399]
                "
              >
                ستظهر طلبات المتبرعين هنا عند وصولها.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {requests.map((request) => (
                <VoluntaryRequestRow
                  key={request.id}
                  request={request}
                  onSchedule={() => setSelectedRequest(request)}
                />
              ))}
            </div>
          )}

          {meta && meta.last_page > 1 && (
            <div
              className="
                  mt-6
                  flex items-center
                  justify-between
                  border-t
                  border-[#edf0f1]
                  pt-5
                "
            >
              <span
                className="
                    text-xs
                    text-[#7f8c91]
                  "
              >
                صفحة {meta.current_page} من {meta.last_page}
              </span>

              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={meta.current_page <= 1}
                  onClick={() => setPage(meta.current_page - 1)}
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
                  disabled={meta.current_page >= meta.last_page}
                  onClick={() => setPage(meta.current_page + 1)}
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
        </div>
      </section>

      {selectedRequest && (
        <ScheduleDonationModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onScheduled={handleScheduled}
        />
      )}
    </>
  );
}

interface BloodFilterButtonProps {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}

function BloodFilterButton({
  label,
  count,
  active,
  onClick,
}: BloodFilterButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        flex h-[38px]
        flex-1
        items-center
        justify-center
        gap-2
        whitespace-nowrap
        rounded-xl
        px-3
        text-xs
        transition
        ${
          active
            ? "bg-white font-bold text-[#a61f36] shadow-sm"
            : "font-medium text-[#596970] hover:bg-white/60"
        }
      `}
    >
      <span dir="ltr">{label}</span>

      <span
        className={`
          grid min-w-6
          place-items-center
          rounded-full
          px-1.5 py-1
          text-[10px]
          font-bold
          ${
            active
              ? "bg-[#fde4e8] text-[#b52c45]"
              : "bg-[#e6eaeb] text-[#66757b]"
          }
        `}
      >
        {count}
      </span>
    </button>
  );
}

interface RequestRowProps {
  request: VoluntaryDonationRequest;
  onSchedule: () => void;
}

function VoluntaryRequestRow({ request, onSchedule }: RequestRowProps) {
  const pending = request.status === "pending";

  return (
    <article
      className="
        flex min-h-[106px]
        flex-col
        justify-between
        gap-5
        rounded-2xl
        border
        border-[#edf0f1]
        bg-white
        px-4 py-4
        transition
        hover:border-[#e1e6e8]
        sm:flex-row
        sm:items-center
        sm:px-5
      "
    >
      <div
        className="
          flex
          min-w-0
          items-center
          gap-4
        "
      >
        <div
          className="
            grid h-[64px]
            w-[64px]
            shrink-0
            place-items-center
            rounded-2xl
            bg-[#fbf0f2]
            text-[17px]
            font-extrabold
            text-[#a61f36]
          "
          dir="ltr"
        >
          {request.donor.blood_type}
        </div>

        <div className="min-w-0">
          <div
            className="
              flex flex-wrap
              items-center
              gap-2
            "
          >
            <h3
              className="
                text-sm
                font-extrabold
                text-[#293b43]
              "
            >
              {request.donor.name}
            </h3>

            <RequestStatusBadge status={request.status} />
          </div>

          <div
            className="
              mt-2
              flex flex-wrap
              items-center
              gap-x-2
              gap-y-1
              text-[10px]
              text-[#7c898f]
            "
          >
            <span>الهاتف:</span>

            <span dir="ltr">{request.donor.phone}</span>

            <span>·</span>

            <span>أُرسل {formatDonationDateTime(request.submitted_at)}</span>
          </div>

          {request.process?.scheduled_at && (
            <p
              className="
                mt-1
                text-[10px]
                font-medium
                text-[#607078]
              "
            >
              موعد الحضور:{" "}
              {formatDonationDateTime(request.process.scheduled_at)}
            </p>
          )}
        </div>
      </div>

      {pending && (
        <button
          type="button"
          onClick={onSchedule}
          className="
            min-h-[40px]
            shrink-0
            rounded-xl
            bg-[#ad1e38]
            px-5
            text-xs
            font-bold
            text-white
            shadow-[0_7px_15px_rgba(173,30,56,0.17)]
            transition
            hover:bg-[#94182f]
          "
        >
          قبول وتحديد موعد
        </button>
      )}
    </article>
  );
}

function RequestStatusBadge({
  status,
}: {
  status: VoluntaryDonationRequest["status"];
}) {
  const classes =
    status === "pending"
      ? "bg-[#fff4df] text-[#9b6b24]"
      : status === "scheduled"
        ? "bg-[#eaf7f3] text-[#268469]"
        : status === "completed"
          ? "bg-[#eaf7f3] text-[#138a62]"
          : "bg-[#f1f3f4] text-[#78868c]";

  return (
    <span
      className={`
        inline-flex
        items-center
        gap-1.5
        rounded-full
        px-2.5 py-1
        text-[10px]
        font-bold
        ${classes}
      `}
    >
      <span
        className="
          h-1.5 w-1.5
          rounded-full
          bg-current
        "
      />

      {VOLUNTARY_STATUS_LABELS[status]}
    </span>
  );
}

function RequestsSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({
        length: 4,
      }).map((_, index) => (
        <div
          key={index}
          className="
            h-[106px]
            animate-pulse
            rounded-2xl
            border
            border-[#edf0f1]
            bg-[#fafbfb]
          "
        />
      ))}
    </div>
  );
}
