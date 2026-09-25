"use client";

import { Heart, X } from "lucide-react";

import { useEffect, useState } from "react";

import { DONATION_PRIORITY_LABELS } from "../config/donation.config";

import { getDonationCall } from "../services/blood-bank-donation.service";

import type { DonationCall } from "../types/donation.types";

interface Props {
  callId: number;
  onClose: () => void;
}

export default function DonationCallDetailsModal({ callId, onClose }: Props) {
  const [call, setCall] = useState<DonationCall | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const response = await getDonationCall(callId, controller.signal);

        setCall(response.data);
      } catch (requestError) {
        if (
          requestError instanceof DOMException &&
          requestError.name === "AbortError"
        ) {
          return;
        }

        setError(
          requestError instanceof Error
            ? requestError.message
            : "تعذر تحميل تفاصيل النداء.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void load();

    return () => controller.abort();
  }, [callId]);

  return (
    <div
      className="
        fixed inset-0 z-[120]
        flex items-center
        justify-center
        bg-[#17232c]/50
        px-4 py-8
        backdrop-blur-[1px]
      "
      role="dialog"
      aria-modal="true"
    >
      <div
        className="
          w-full
          max-w-[640px]
          overflow-hidden
          rounded-[20px]
          bg-white
          shadow-[0_28px_80px_rgba(23,35,44,0.26)]
        "
      >
        <div
          className="
            flex items-start
            justify-between
            border-b
            border-[#edf0f1]
            px-7 py-6
            sm:px-8
          "
        >
          <div>
            <span
              className="
                text-[21px]
                font-extrabold
                text-[#ad1e38]
              "
            >
              تفاصيل النداء
            </span>

            {call && (
              <>
                <h2
                  className="
                    mt-1
                    text-[20px]
                    font-extrabold
                    text-[#273941]
                  "
                >
                  “{call.title}”
                </h2>

                <p
                  className="
                    mt-2
                    text-xs
                    text-[#89959a]
                  "
                >
                  {call.institution?.name ?? "المؤسسة"}
                </p>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="إغلاق"
            className="
              grid h-9 w-9
              place-items-center
              rounded-full
              text-[#596970]
              hover:bg-slate-100
            "
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div
          className="
            px-7 py-6
            sm:px-8
          "
        >
          {loading ? (
            <div
              className="
                h-[330px]
                animate-pulse
                rounded-2xl
                bg-[#f7f9f9]
              "
            />
          ) : error ? (
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
          ) : call ? (
            <>
              <div
                className="
                  flex
                  items-center
                  justify-between
                  rounded-2xl
                  border
                  border-[#e4e8ea]
                  px-5 py-5
                "
              >
                <div>
                  <span
                    className="
                      text-xs
                      text-[#89959a]
                    "
                  >
                    فصيلة الدم
                  </span>

                  <strong
                    className="
                      mt-2 block
                      text-[28px]
                      font-extrabold
                      text-[#25373f]
                    "
                    dir="ltr"
                  >
                    {call.blood_type}
                  </strong>

                  <span
                    className="
                      mt-2 block
                      text-[10px]
                      font-bold
                      text-[#4e9693]
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
                    bg-[#fcedf0]
                    text-[#ad1e38]
                  "
                >
                  <Heart className="h-5 w-5" strokeWidth={1.7} />
                </span>
              </div>

              <div
                className="
                  mt-6
                  grid
                  grid-cols-2
                  gap-x-8
                  gap-y-5
                "
              >
                <DetailItem
                  label="التاريخ والوقت"
                  value={formatCallDateTime(call.needed_at)}
                />

                <DetailItem
                  label="الأولوية"
                  value={DONATION_PRIORITY_LABELS[call.priority]}
                  accent={call.priority === "emergency"}
                />

                <DetailItem
                  label="مكان التبرع"
                  value={call.donation_location || "غير محدد"}
                />

                <DetailItem
                  label="عدد المتبرعين المطلوب"
                  value={`${call.units_required} متبرعين`}
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
                    text-[#8a969b]
                  "
                >
                  {call.description}
                </p>
              </div>

              <div className="mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="
                    min-h-[42px]
                    rounded-xl
                    border
                    border-[#dfe4e6]
                    bg-white
                    px-5
                    text-sm
                    font-bold
                    text-[#5b6a70]
                    hover:bg-slate-50
                  "
                >
                  إغلاق
                </button>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function DetailItem({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div>
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
          mt-2
          inline-flex
          text-xs
          ${
            accent
              ? "rounded-full bg-[#fde9ed] px-2.5 py-1 font-bold text-[#bd2845]"
              : "text-[#8a969b]"
          }
        `}
      >
        {value}
      </span>
    </div>
  );
}

function formatCallDateTime(value: string | null) {
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

  return `${datePart} • ${timePart}`;
}
