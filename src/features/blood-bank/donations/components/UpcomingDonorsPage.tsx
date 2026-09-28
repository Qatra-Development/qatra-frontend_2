"use client";

import { ChevronDown, Search } from "lucide-react";

import { useState } from "react";

import { BLOOD_TYPE_FILTERS } from "../config/donation.config";

import { formatDonationDateTime } from "../lib/donation.utils";

import { useUpcomingDonors } from "../hooks/useUpcomingDonors";

import type {
  BloodType,
  UpcomingDonationProcess,
} from "../types/donation.types";

import RegisterDonationModal from "./RegisterDonationModal";

export default function UpcomingDonorsPage() {
  const {
    processes,

    total,
    sourceTotal,

    page,
    lastPage,

    search,
    region,
    bloodType,

    regions,
    bloodTypeCounts,

    loading,
    error,

    setSearch,
    setRegion,
    setBloodType,
    setPage,

    reload,
  } = useUpcomingDonors();

  const [selectedProcess, setSelectedProcess] =
    useState<UpcomingDonationProcess | null>(null);

  const [notice, setNotice] = useState<string | null>(null);

  function handleCompleted() {
    setNotice("تم تسجيل التبرع وإضافة الوحدة إلى المخزون بنجاح.");

    /*
     * لا نعمل reload فورًا حتى
     * يبقى popup قادرًا على عرض
     * BU وتاريخ الانتهاء.
     *
     * يتم التحديث بعد إغلاقه.
     */
  }

  function closeRegisterModal() {
    const hadCompletedDonation = Boolean(selectedProcess);

    setSelectedProcess(null);

    if (hadCompletedDonation) {
      reload();
    }

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
            المتبرعون القادمون
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
          <div className="relative flex-1">
            <input
              type="search"
              value={search}
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
                focus:border-[#a61f36]/30
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
          <div className="overflow-x-auto pb-1">
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
              <BloodFilter
                label="جميع الفصائل"
                count={sourceTotal}
                active={bloodType === ""}
                onClick={() => setBloodType("")}
              />

              {BLOOD_TYPE_FILTERS.map((type) => (
                <BloodFilter
                  key={type}
                  label={type}
                  count={bloodTypeCounts[type] ?? 0}
                  active={bloodType === type}
                  onClick={() => setBloodType(type)}
                />
              ))}
            </div>
          </div>

          <div className="my-6 h-px bg-[#edf0f1]" />

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
            <UpcomingSkeleton />
          ) : processes.length === 0 ? (
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
                لا يوجد متبرعون قادمون
              </h3>

              <p
                className="
                  mt-1
                  text-xs
                  text-[#879399]
                "
              >
                ستظهر هنا المواعيد المؤكدة للتبرع.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {processes.map((process) => (
                <UpcomingDonorCard
                  key={process.id}
                  process={process}
                  onRegister={() => setSelectedProcess(process)}
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
        </div>
      </section>

      {selectedProcess && (
        <RegisterDonationModal
          process={selectedProcess}
          onClose={closeRegisterModal}
          onCompleted={handleCompleted}
        />
      )}
    </>
  );
}

function UpcomingDonorCard({
  process,
  onRegister,
}: {
  process: UpcomingDonationProcess;
  onRegister: () => void;
}) {
  const donorName = process.donor.name || "متبرع";

  const description = process.donation_call?.title
    ? process.donation_call.title
    : `${donorName} يرغب بالتبرع طوعياً بفصيلة ${process.donor.blood_type}`;

  return (
    <article
      className="
        flex
        flex-col
        gap-5
        rounded-2xl
        border
        border-[#e4e8ea]
        bg-white
        px-4 py-4
        sm:flex-row
        sm:items-center
        sm:px-5
      "
    >
      <div
        className="
          grid h-[62px]
          w-[62px]
          shrink-0
          place-items-center
          rounded-2xl
          bg-[#fcedf0]
          text-[17px]
          font-extrabold
          text-[#a61f36]
        "
        dir="ltr"
      >
        {process.donor.blood_type}
      </div>

      <div className="min-w-0 flex-1">
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
            {donorName}
          </h3>

          <span
            className="
              inline-flex
              items-center
              gap-1.5
              rounded-full
              bg-[#eaf7f3]
              px-2.5 py-1
              text-[10px]
              font-bold
              text-[#317d70]
            "
          >
            <span
              className="
                h-1.5 w-1.5
                rounded-full
                bg-[#4f9b8e]
              "
            />
            تم قبول الموعد
          </span>
        </div>

        <p
          className="
            mt-1.5
            text-xs
            font-semibold
            text-[#3c4d54]
          "
        >
          {description}
        </p>

        <div
          className="
            mt-1
            flex flex-wrap
            items-center
            gap-1
            text-[10px]
            text-[#7b898f]
          "
        >
          <span>الهاتف:</span>

          <span dir="ltr">{process.donor.phone || "غير متوفر"}</span>

          <span>·</span>

          <span>العملية {process.process_number}</span>
        </div>

        <div
          className="
            mt-3
            rounded-xl
            bg-[#f3f8f7]
            px-4 py-3
            text-[10px]
            font-semibold
            leading-5
            text-[#67a6a2]
          "
        >
          <p>الموعد المقترح: {formatDonationDateTime(process.scheduled_at)}</p>

          <p>المكان: {process.location || "غير محدد"}</p>
        </div>
      </div>

      <button
        type="button"
        onClick={onRegister}
        className="
          min-h-[42px]
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
        تم التبرع
      </button>
    </article>
  );
}

function BloodFilter({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
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

function UpcomingSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({
        length: 3,
      }).map((_, index) => (
        <div
          key={index}
          className="
            h-[160px]
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
