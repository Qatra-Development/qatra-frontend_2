"use client";

import { CalendarDays, X } from "lucide-react";

import { type FormEvent, useState } from "react";

import { completeDonationProcess } from "../services/blood-bank-donation.service";

import { formatDonationDateTime } from "../lib/donation.utils";

import type { DonationProcess } from "../types/donation.types";

interface Props {
  process: Pick<DonationProcess, "id">;

  onClose: () => void;
  onCompleted: () => void;
}

export default function RegisterDonationModal({
  process,
  onClose,
  onCompleted,
}: Props) {
  const [collectedAt, setCollectedAt] = useState("");

  const [completedProcess, setCompletedProcess] =
    useState<DonationProcess | null>(null);

  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const canSubmit = Boolean(collectedAt) && !submitting && !completedProcess;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canSubmit) {
      return;
    }

    const value = new Date(collectedAt);

    if (Number.isNaN(value.getTime())) {
      setError("يرجى إدخال تاريخ ووقت صحيحين.");

      return;
    }

    if (value.getTime() > Date.now()) {
      setError("لا يمكن أن يكون تاريخ الجمع في المستقبل.");

      return;
    }

    setError(null);
    setSubmitting(true);

    try {
      const response = await completeDonationProcess(process.id, {
        collected_at: value.toISOString(),
      });

      setCompletedProcess(response.data);

      onCompleted();
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "تعذر تسجيل التبرع.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  const bloodUnit = completedProcess?.donation?.blood_unit ?? null;

  const donationDate = completedProcess?.donation?.donation_date ?? null;

  return (
    <div
      className="
        fixed inset-0 z-[110]
        flex items-center
        justify-center
        bg-[#17232c]/50
        px-4 py-8
        backdrop-blur-[1px]
      "
      role="dialog"
      aria-modal="true"
      aria-labelledby="register-donation-title"
    >
      <div
        className="
          w-full
          max-w-[650px]
          rounded-[20px]
          bg-white
          shadow-[0_28px_80px_rgba(23,35,44,0.26)]
        "
      >
        <div
          className="
            flex items-start
            justify-between
            px-7
            pb-3 pt-6
            sm:px-9
          "
        >
          <div>
            <h2
              id="register-donation-title"
              className="
                text-[22px]
                font-extrabold
                text-[#34464d]
              "
            >
              بيانات التبرع والوحدة
            </h2>

            <p
              className="
                mt-2
                text-xs
                text-[#89959a]
              "
            >
              ستنشأ عملية تبرع ووحدة مخزون مترابطتان.
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
              text-[#6f7e84]
              transition
              hover:bg-slate-100
            "
          >
            <X className="h-4 w-4" strokeWidth={1.8} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="
            px-7 pb-7 pt-5
            sm:px-9
          "
        >
          <div
            className="
              grid gap-x-4
              gap-y-4
              sm:grid-cols-2
            "
          >
            <ReadonlyField
              label="تاريخ التبرع"
              value={
                completedProcess
                  ? formatDonationDateTime(
                      donationDate ?? completedProcess.completed_at,
                    )
                  : "يُسجل تلقائيًا"
              }
            />

            <ReadonlyField
              label="الرقم المرجعي"
              value={bloodUnit?.unit_code ?? "يُنشأ تلقائيًا"}
              dir="ltr"
            />

            <div>
              <label
                htmlFor="collected-at"
                className="
                  mb-2 block
                  text-xs
                  font-bold
                  text-[#4b5c63]
                "
              >
                تاريخ الجمع
              </label>

              <div className="relative">
                <input
                  id="collected-at"
                  type="datetime-local"
                  value={collectedAt}
                  disabled={Boolean(completedProcess)}
                  onChange={(event) => setCollectedAt(event.target.value)}
                  className="
                    h-[48px]
                    w-full
                    rounded-xl
                    border
                    border-[#e0e5e7]
                    bg-white
                    px-4 pl-11
                    text-xs
                    font-medium
                    text-[#65747a]
                    outline-none
                    transition
                    focus:border-[#a61f36]/40
                    focus:ring-2
                    focus:ring-[#a61f36]/5
                    disabled:bg-[#fafbfb]
                  "
                />

                <CalendarDays
                  className="
                    pointer-events-none
                    absolute
                    left-4 top-1/2
                    h-4 w-4
                    -translate-y-1/2
                    text-[#839096]
                  "
                  strokeWidth={1.7}
                />
              </div>
            </div>

            <ReadonlyField
              label="تاريخ انتهاء الصلاحية"
              value={
                bloodUnit?.expires_at
                  ? formatDonationDateTime(bloodUnit.expires_at)
                  : "يُحسب تلقائيًا"
              }
            />
          </div>

          {completedProcess && (
            <div
              className="
                mt-5
                rounded-xl
                border
                border-emerald-100
                bg-emerald-50
                px-4 py-3
                text-xs
                font-bold
                text-emerald-700
              "
            >
              تم تسجيل التبرع وإضافة الوحدة إلى المخزون بنجاح.
            </div>
          )}

          {error && (
            <div
              className="
                mt-5
                rounded-xl
                bg-red-50
                px-4 py-3
                text-xs
                font-medium
                text-red-700
              "
            >
              {error}
            </div>
          )}

          <div
            className="
              mt-7
              flex items-center
              justify-between
              gap-3
            "
          >
            {!completedProcess ? (
              <button
                type="submit"
                disabled={!canSubmit}
                className="
                  min-h-[48px]
                  rounded-xl
                  bg-[#ad1e38]
                  px-7
                  text-sm
                  font-bold
                  text-white
                  shadow-[0_8px_18px_rgba(173,30,56,0.18)]
                  transition
                  hover:bg-[#94182f]
                  disabled:cursor-not-allowed
                  disabled:bg-[#d39aa5]
                  disabled:shadow-none
                "
              >
                {submitting ? "جارٍ التسجيل..." : "تسجيل التبرع وإضافة الوحدة"}
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="
                  min-h-[46px]
                  rounded-xl
                  bg-[#ad1e38]
                  px-7
                  text-sm
                  font-bold
                  text-white
                "
              >
                إغلاق
              </button>
            )}

            {!completedProcess && (
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="
                  min-h-[46px]
                  rounded-xl
                  border
                  border-[#dfe4e6]
                  bg-white
                  px-6
                  text-sm
                  font-bold
                  text-[#738087]
                  transition
                  hover:bg-slate-50
                  disabled:opacity-50
                "
              >
                إغلاق
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

function ReadonlyField({
  label,
  value,
  dir,
}: {
  label: string;
  value: string;
  dir?: "ltr" | "rtl";
}) {
  return (
    <div>
      <span
        className="
          mb-2 block
          text-xs
          font-bold
          text-[#4b5c63]
        "
      >
        {label}
      </span>

      <div
        dir={dir}
        className="
          flex h-[48px]
          items-center
          rounded-xl
          border
          border-[#e0e5e7]
          bg-[#fafbfb]
          px-4
          text-xs
          font-semibold
          text-[#7b888e]
        "
      >
        {value}
      </div>
    </div>
  );
}
