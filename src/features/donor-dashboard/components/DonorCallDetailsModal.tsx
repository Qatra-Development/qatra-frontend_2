"use client";

import { CheckCircle2, Heart, X } from "lucide-react";

import { useEffect, useState } from "react";

import {
  getDonorDonationCall,
  respondToDonationCall,
} from "../services/donor.service";

import type { DonorDonationCall } from "../types/donor.types";

interface Props {
  callId: number;
  onClose: () => void;
  onUpdated: () => void;
}

function priorityLabel(value: DonorDonationCall["priority"]) {
  if (value === "emergency") {
    return "عاجل جدًا";
  }

  if (value === "urgent") {
    return "عاجل";
  }

  return "عادي";
}

function formatDate(value: string | null) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  const day = new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);

  const time = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);

  return `${day} • ${time}`;
}

export default function DonorCallDetailsModal({
  callId,
  onClose,
  onUpdated,
}: Props) {
  const [call, setCall] = useState<DonorDonationCall | null>(null);

  const [loading, setLoading] = useState(true);

  const [submitting, setSubmitting] = useState<
    "interested" | "declined" | null
  >(null);

  const [error, setError] = useState<string | null>(null);

  async function loadCall() {
    setLoading(true);
    setError(null);

    try {
      const response = await getDonorDonationCall(callId);

      setCall(response.data);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "تعذر تحميل تفاصيل النداء.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadCall();
  }, [callId]);

  async function respond(status: "interested" | "declined") {
    if (submitting) {
      return;
    }

    setSubmitting(status);
    setError(null);

    try {
      await respondToDonationCall(callId, status);

      await loadCall();

      onUpdated();
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "تعذر تسجيل الاستجابة.",
      );
    } finally {
      setSubmitting(null);
    }
  }

  const interested = call?.my_response?.status === "interested";

  const declined = call?.my_response?.status === "declined";

  return (
    <div
      className="
        fixed inset-0 z-[130]
        flex items-center
        justify-center
        overflow-y-auto
        bg-[#17232c]/50
        px-4 py-8
        backdrop-blur-[1px]
      "
      role="dialog"
      aria-modal="true"
    >
      <div
        className="
          my-auto
          w-full
          max-w-[560px]
          overflow-hidden
          rounded-[20px]
          bg-white
          shadow-[0_28px_80px_rgba(23,35,44,0.26)]
        "
      >
        {loading ? (
          <div className="p-8">
            <div
              className="
                h-[480px]
                animate-pulse
                rounded-2xl
                bg-[#f7f9f9]
              "
            />
          </div>
        ) : error && !call ? (
          <div className="p-8">
            <div
              className="
                rounded-xl
                bg-red-50
                px-4 py-5
                text-center
                text-sm
                text-red-700
              "
            >
              {error}
            </div>
          </div>
        ) : call ? (
          <>
            <div
              className="
                flex items-start
                justify-between
                border-b
                border-[#edf0f1]
                px-7 py-6
              "
            >
              <div>
                <h2
                  className="
                    text-[20px]
                    font-extrabold
                    text-[#25373f]
                  "
                >
                  <span className="text-[#ad1e38]">تفاصيل</span> “{call.title}”
                </h2>

                <p
                  className="
                    mt-2
                    text-xs
                    text-[#909ba0]
                  "
                >
                  {call.institution?.name ?? "المؤسسة"}
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="إغلاق"
                className="
                  grid h-9 w-9
                  place-items-center
                  rounded-full
                  text-[#65747b]
                  hover:bg-slate-100
                "
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="px-7 py-6">
              <div
                className="
                  flex items-center
                  justify-between
                  rounded-2xl
                  border
                  border-[#e5e9eb]
                  px-5 py-5
                "
              >
                <div>
                  <span
                    className="
                      text-xs
                      text-[#909ba0]
                    "
                  >
                    فصيلة الدم
                  </span>

                  <strong
                    className="
                      mt-1 block
                      text-[27px]
                      font-extrabold
                      text-[#26383f]
                    "
                    dir="ltr"
                  >
                    {call.blood_type}
                  </strong>

                  <span
                    className="
                      mt-2 block
                      text-[9px]
                      font-bold
                      text-[#589794]
                    "
                    dir="ltr"
                  >
                    رقم النداء: {call.call_number}
                  </span>
                </div>

                <span
                  className="
                    grid h-11 w-11
                    place-items-center
                    rounded-xl
                    bg-[#fbedf0]
                    text-[#ad1e38]
                  "
                >
                  <Heart className="h-5 w-5" />
                </span>
              </div>

              <div
                className="
                  mt-6
                  grid
                  grid-cols-2
                  gap-x-8 gap-y-5
                "
              >
                <DetailField
                  label="التاريخ والوقت"
                  value={formatDate(call.needed_at)}
                />

                <DetailField
                  label="الأولوية"
                  value={priorityLabel(call.priority)}
                  danger={call.priority !== "normal"}
                />

                <DetailField
                  label="عدد المتبرعين المطلوب"
                  value={`${call.units_required} متبرعين`}
                />

                <DetailField
                  label="حالة النداء"
                  value={
                    interested ? "مقبول" : declined ? "تم الاعتذار" : "نشط"
                  }
                  success={interested}
                />

                <DetailField
                  label="مكان التبرع"
                  value={call.donation_location || "غير محدد"}
                />
              </div>

              <div
                className="
                  mt-5
                  border-t
                  border-[#edf0f1]
                  pt-5
                "
              >
                <h3
                  className="
                    text-xs
                    font-extrabold
                    text-[#34464d]
                  "
                >
                  وصف النداء
                </h3>

                <p
                  className="
                    mt-2
                    text-xs
                    leading-6
                    text-[#879399]
                  "
                >
                  {call.description}
                </p>
              </div>

              {interested && (
                <div
                  className="
                    mt-5
                    flex items-start
                    gap-3
                    rounded-xl
                    border
                    border-[#cfe9da]
                    bg-[#effaf4]
                    px-4 py-4
                  "
                >
                  <CheckCircle2
                    className="
                      mt-0.5
                      h-5 w-5
                      shrink-0
                      text-[#27b56f]
                    "
                  />

                  <div>
                    <strong
                      className="
                        text-xs
                        text-[#26945e]
                      "
                    >
                      أبلغت المؤسسة أنك تستطيع التبرع
                    </strong>

                    <p
                      className="
                        mt-1
                        text-[10px]
                        leading-5
                        text-[#65a281]
                      "
                    >
                      شكرًا لك، تم تسجيل موافقتك وسيتم التواصل معك قريبًا بخصوص
                      التفاصيل التالية.
                    </p>
                  </div>
                </div>
              )}

              {declined && (
                <div
                  className="
                    mt-5
                    rounded-xl
                    bg-[#f4f5f5]
                    px-4 py-4
                    text-xs
                    text-[#718087]
                  "
                >
                  تم تسجيل أنك لا تستطيع التبرع لهذا النداء.
                </div>
              )}

              {error && (
                <div
                  className="
                    mt-4
                    rounded-xl
                    bg-red-50
                    px-4 py-3
                    text-xs
                    text-red-700
                  "
                >
                  {error}
                </div>
              )}

              {!call.my_response ? (
                <div
                  className="
                    mt-6
                    flex items-center
                    justify-between
                    gap-3
                  "
                >
                  <button
                    type="button"
                    onClick={() => void respond("interested")}
                    disabled={submitting !== null}
                    className="
                      min-h-[46px]
                      rounded-xl
                      bg-[#ad1e38]
                      px-7
                      text-sm
                      font-bold
                      text-white
                      shadow-[0_8px_18px_rgba(173,30,56,0.17)]
                      disabled:opacity-60
                    "
                  >
                    {submitting === "interested"
                      ? "جارٍ التسجيل..."
                      : "أستطيع التبرع"}
                  </button>

                  <button
                    type="button"
                    onClick={() => void respond("declined")}
                    disabled={submitting !== null}
                    className="
                      min-h-[46px]
                      rounded-xl
                      border
                      border-[#e0e5e7]
                      bg-white
                      px-6
                      text-sm
                      font-bold
                      text-[#617078]
                    "
                  >
                    لا أستطيع
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={onClose}
                  className="
                    mt-6
                    min-h-[44px]
                    rounded-xl
                    border
                    border-[#e0e5e7]
                    bg-white
                    px-6
                    text-sm
                    font-bold
                    text-[#617078]
                  "
                >
                  إغلاق
                </button>
              )}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}

function DetailField({
  label,
  value,
  danger = false,
  success = false,
}: {
  label: string;
  value: string;
  danger?: boolean;
  success?: boolean;
}) {
  return (
    <div
      className="
        border-b
        border-[#edf0f1]
        pb-4
      "
    >
      <span
        className="
          block
          text-xs
          font-extrabold
          text-[#34464d]
        "
      >
        {label}
      </span>

      <span
        className={`
          mt-2 inline-flex
          items-center gap-1.5
          text-xs
          ${
            success
              ? "rounded-full bg-[#eaf8f0] px-2.5 py-1 font-bold text-[#28a665]"
              : danger
                ? "rounded-full bg-[#fdecef] px-2.5 py-1 font-bold text-[#c02d47]"
                : "text-[#8b979c]"
          }
        `}
      >
        {success && (
          <span
            className="
              h-1.5 w-1.5
              rounded-full
              bg-current
            "
          />
        )}

        {value}
      </span>
    </div>
  );
}
