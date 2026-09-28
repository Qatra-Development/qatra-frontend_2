"use client";

import Image from "next/image";

import { Plus } from "lucide-react";

import { useState } from "react";

import { updateDonorAvailability } from "../services/donor.service";

import { useDonorDashboard } from "../hooks/useDonorDashboard";

import type { DonorDonationCall } from "../types/donor.types";

import AvailabilityConfirmModal from "./AvailabilityConfirmModal";
import DonorCallCard from "./DonorCallCard";
import DonorCallDetailsModal from "./DonorCallDetailsModal";
import DonorHeader from "./DonorHeader";
import VoluntaryDonationModal from "./VoluntaryDonationModal";

export default function DonorDashboardPage() {
  const {
    user,
    availability,

    targetedCalls,
    matchingCalls,

    loading,
    error,

    reload,
  } = useDonorDashboard();

  const [detailsCall, setDetailsCall] = useState<DonorDonationCall | null>(
    null,
  );

  const [voluntaryOpen, setVoluntaryOpen] = useState(false);

  const [availabilityConfirmOpen, setAvailabilityConfirmOpen] = useState(false);

  const [changingAvailability, setChangingAvailability] = useState(false);

  const [notice, setNotice] = useState<string | null>(null);

  function showNotice(value: string) {
    setNotice(value);

    window.setTimeout(() => {
      setNotice(null);
    }, 4000);
  }

  async function confirmAvailabilityChange() {
    if (!availability) {
      return;
    }

    setChangingAvailability(true);

    try {
      await updateDonorAvailability(!availability.accepts_donation_requests);

      setAvailabilityConfirmOpen(false);

      reload();

      showNotice("تم تحديث حالة استقبال النداءات بنجاح.");
    } catch (requestError) {
      showNotice(
        requestError instanceof Error
          ? requestError.message
          : "تعذر تحديث الحالة.",
      );
    } finally {
      setChangingAvailability(false);
    }
  }

  return (
    <>
      <DonorHeader userName={user?.name ?? "المتبرع"} />

      <section
        className="
          mx-auto
          max-w-[1240px]
          px-5 pb-12 pt-10
          lg:px-8
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
            <h1
              className="
                text-[28px]
                font-extrabold
                text-[#243741]
              "
            >
              مرحبًا، {user?.name ?? "المتبرع"}
            </h1>

            <p
              className="
                mt-2
                text-sm
                text-[#7e8b91]
              "
            >
              نعرض النداءات النشطة المتوافقة مع فصيلة دمك وموقعك.
            </p>
          </div>

          <button
            type="button"
            disabled={!availability}
            onClick={() => setVoluntaryOpen(true)}
            className="
              inline-flex
              h-[46px]
              items-center
              gap-2
              self-start
              rounded-xl
              bg-[#ad1e38]
              px-5
              text-sm
              font-bold
              text-white
              shadow-[0_8px_20px_rgba(173,30,56,0.18)]
              disabled:opacity-50
            "
          >
            <Plus className="h-4 w-4" />
            طلب تبرع جديد
          </button>
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

        {error && (
          <div
            className="
              mt-6
              rounded-xl
              bg-red-50
              px-4 py-4
              text-sm
              text-red-700
            "
          >
            {error}
          </div>
        )}

        <div
          className="
            relative
            mt-8
            min-h-[220px]
            overflow-hidden
            rounded-[22px]
            bg-[#44545a]
          "
        >
          <Image
            src="/img/donor-dashboard-banner.png"
            alt=""
            fill
            priority
            className="object-cover"
          />

          <div
            className="
              absolute inset-0
              bg-[#25363d]/35
            "
          />

          <div
            className="
              relative z-10
              flex min-h-[220px]
              flex-col
              items-end
              justify-center
              px-7 py-7
              text-white
              sm:px-10
            "
          >
            <h2
              className="
                text-[24px]
                font-extrabold
              "
            >
              نداءات التبرع المناسبة لك
            </h2>

            {availability && (
              <button
                type="button"
                onClick={() => setAvailabilityConfirmOpen(true)}
                className="
                  mt-6
                  flex min-w-[270px]
                  items-center
                  justify-between
                  gap-5
                  rounded-2xl
                  bg-white/20
                  px-5 py-4
                  backdrop-blur-md
                "
              >
                <div className="text-right">
                  <strong
                    className="
                      block
                      text-sm
                    "
                  >
                    حالة استقبال النداءات
                  </strong>

                  <span
                    className="
                      mt-1 block
                      text-[10px]
                      text-white/80
                    "
                  >
                    {availability.accepts_donation_requests
                      ? "متاح"
                      : "غير متاح"}
                  </span>
                </div>

                <span
                  className={`
                    relative
                    h-[27px] w-[50px]
                    rounded-full
                    transition
                    ${
                      availability.accepts_donation_requests
                        ? "bg-[#ad1e38]"
                        : "bg-white"
                    }
                  `}
                >
                  <span
                    className={`
                      absolute top-[4px]
                      h-[19px] w-[19px]
                      rounded-full
                      transition-all
                      ${
                        availability.accepts_donation_requests
                          ? "right-[27px] bg-white"
                          : "right-[4px] bg-[#c9ced0]"
                      }
                    `}
                  />
                </span>
              </button>
            )}
          </div>
        </div>

        <div id="donation-calls" className="mt-8">
          <SectionTitle
            title="مرسلة إليك مباشرة"
            subtitle="اختارتك المؤسسة ضمن المتبرعين المناسبين"
          />

          {loading ? (
            <CardSkeleton />
          ) : targetedCalls.length > 0 ? (
            <div
              className="
                mt-4
                grid gap-4
                md:grid-cols-2
              "
            >
              {targetedCalls.map((call) => (
                <DonorCallCard
                  key={call.id}
                  call={call}
                  targeted
                  onDetails={() => setDetailsCall(call)}
                />
              ))}
            </div>
          ) : (
            <EmptyCalls />
          )}
        </div>

        <div className="mt-8">
          <SectionTitle
            title="نداءات متوافقة معك"
            subtitle="حسب الموقع والفصيلة"
          />

          {loading ? (
            <CardSkeleton />
          ) : matchingCalls.length > 0 ? (
            <div
              className="
                mt-4
                grid gap-4
                md:grid-cols-2
              "
            >
              {matchingCalls.map((call) => (
                <DonorCallCard
                  key={call.id}
                  call={call}
                  onDetails={() => setDetailsCall(call)}
                />
              ))}
            </div>
          ) : (
            <EmptyCalls />
          )}
        </div>
      </section>

      {detailsCall && (
        <DonorCallDetailsModal
          callId={detailsCall.id}
          onClose={() => setDetailsCall(null)}
          onUpdated={reload}
        />
      )}

      {availability && voluntaryOpen && (
        <VoluntaryDonationModal
          availability={availability}
          onClose={() => setVoluntaryOpen(false)}
          onCreated={() => {
            reload();

            showNotice("تم إرسال طلب التبرع للمؤسسة بنجاح.");
          }}
        />
      )}

      {availability && availabilityConfirmOpen && (
        <AvailabilityConfirmModal
          currentValue={availability.accepts_donation_requests}
          submitting={changingAvailability}
          onConfirm={() => void confirmAvailabilityChange()}
          onCancel={() => setAvailabilityConfirmOpen(false)}
        />
      )}
    </>
  );
}

function SectionTitle({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div>
      <h2
        className="
          text-[17px]
          font-extrabold
          text-[#2c3f47]
        "
      >
        {title}
      </h2>

      <p
        className="
          mt-1
          text-[10px]
          text-[#929da2]
        "
      >
        {subtitle}
      </p>
    </div>
  );
}

function CardSkeleton() {
  return (
    <div
      className="
        mt-4 grid
        gap-4
        md:grid-cols-2
      "
    >
      {Array.from({
        length: 2,
      }).map((_, index) => (
        <div
          key={index}
          className="
            h-[210px]
            animate-pulse
            rounded-[18px]
            bg-white
          "
        />
      ))}
    </div>
  );
}

function EmptyCalls() {
  return (
    <div
      className="
        mt-4
        rounded-2xl
        border
        border-dashed
        border-[#e0e5e7]
        bg-white
        px-5 py-8
        text-center
        text-xs
        text-[#8a969b]
      "
    >
      لا توجد نداءات في هذا القسم حاليًا.
    </div>
  );
}
