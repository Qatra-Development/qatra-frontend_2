"use client";

import { CalendarDays, Clock3, MapPin, X } from "lucide-react";

import { type FormEvent, useState } from "react";

import { scheduleDonationCallResponse } from "../services/blood-bank-donation.service";

import { buildScheduledAt } from "../lib/donation.utils";

import type { DonationCallResponder } from "../types/donation.types";

interface Props {
  responder: DonationCallResponder;

  onClose: () => void;

  onScheduled: () => void;
}

export default function ScheduleCallResponseModal({
  responder,
  onClose,
  onScheduled,
}: Props) {
  const [date, setDate] = useState("");

  const [time, setTime] = useState("");

  const [location, setLocation] = useState("");

  const [instructions, setInstructions] = useState("");

  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const canSubmit = Boolean(date) && Boolean(time) && !submitting;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canSubmit) {
      return;
    }

    const scheduledAt = buildScheduledAt(date, time);

    if (!scheduledAt) {
      setError("يرجى اختيار تاريخ ووقت صحيحين.");

      return;
    }

    if (new Date(scheduledAt).getTime() <= Date.now()) {
      setError("يجب أن يكون الموعد في المستقبل.");

      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await scheduleDonationCallResponse(responder.id, {
        scheduled_at: scheduledAt,

        ...(location.trim()
          ? {
              location: location.trim(),
            }
          : {}),

        ...(instructions.trim()
          ? {
              instructions: instructions.trim(),
            }
          : {}),
      });

      onScheduled();
      onClose();
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "تعذر تحديد الموعد.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="
        fixed inset-0 z-[130]
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
          max-w-[650px]
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
            sm:px-9
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
              مستجيب لنداء التبرع
            </span>

            <h2
              className="
                mt-2
                text-[22px]
                font-extrabold
                text-[#33454c]
              "
            >
              تحديد موعد لـ {responder.donor.name}
            </h2>

            <p
              className="
                mt-1
                text-xs
                text-[#89959a]
              "
            >
              فصيلة الدم{" "}
              <span dir="ltr" className="font-bold">
                {responder.donor.blood_type}
              </span>
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
              text-[#6d7a80]
              transition
              hover:bg-slate-100
            "
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="
            px-7 py-7
            sm:px-9
          "
        >
          <div>
            <label
              htmlFor="response-date"
              className="
                block text-xs
                font-bold
                text-[#4b5c63]
              "
            >
              تاريخ الحضور
            </label>

            <div className="relative mt-2">
              <input
                id="response-date"
                type="date"
                value={date}
                onChange={(event) => setDate(event.target.value)}
                className="
                  h-[48px]
                  w-full
                  rounded-xl
                  border
                  border-[#dde3e5]
                  bg-white
                  pr-4 pl-11
                  text-sm
                  text-[#34464d]
                  outline-none
                  focus:border-[#ad1e38]/40
                  focus:ring-2
                  focus:ring-[#ad1e38]/5
                "
              />

              <CalendarDays
                className="
                  absolute
                  left-4 top-1/2
                  h-4 w-4
                  -translate-y-1/2
                  text-[#718087]
                "
              />
            </div>
          </div>

          <div className="mt-5">
            <label
              htmlFor="response-time"
              className="
                block text-xs
                font-bold
                text-[#4b5c63]
              "
            >
              وقت الحضور
            </label>

            <div className="relative mt-2">
              <input
                id="response-time"
                type="time"
                value={time}
                onChange={(event) => setTime(event.target.value)}
                className="
                  h-[48px]
                  w-full
                  rounded-xl
                  border
                  border-[#dde3e5]
                  bg-white
                  pr-4 pl-11
                  text-sm
                  text-[#34464d]
                  outline-none
                "
              />

              <Clock3
                className="
                  absolute
                  left-4 top-1/2
                  h-4 w-4
                  -translate-y-1/2
                  text-[#718087]
                "
              />
            </div>
          </div>

          <div className="mt-5">
            <label
              htmlFor="response-location"
              className="
                block text-xs
                font-bold
                text-[#4b5c63]
              "
            >
              مكان التبرع
            </label>

            <div className="relative mt-2">
              <input
                id="response-location"
                type="text"
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                maxLength={255}
                placeholder="أدخل مكان الحضور"
                className="
                  h-[48px]
                  w-full
                  rounded-xl
                  border
                  border-[#dde3e5]
                  bg-white
                  pr-4 pl-11
                  text-sm
                  text-[#34464d]
                  outline-none
                  placeholder:text-[#9ca7ab]
                "
              />

              <MapPin
                className="
                  absolute
                  left-4 top-1/2
                  h-4 w-4
                  -translate-y-1/2
                  text-[#718087]
                "
              />
            </div>
          </div>

          <div className="mt-5">
            <label
              htmlFor="response-instructions"
              className="
                block text-xs
                font-bold
                text-[#4b5c63]
              "
            >
              تعليمات الحضور
            </label>

            <textarea
              id="response-instructions"
              value={instructions}
              onChange={(event) => setInstructions(event.target.value)}
              maxLength={2000}
              rows={3}
              placeholder="تعليمات إضافية للمتبرع"
              className="
                mt-2
                min-h-[82px]
                w-full
                resize-none
                rounded-xl
                border
                border-[#dde3e5]
                px-4 py-3
                text-sm
                text-[#34464d]
                outline-none
              "
            />
          </div>

          {error && (
            <div
              className="
                mt-4
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
            <button
              type="submit"
              disabled={!canSubmit}
              className="
                min-h-[46px]
                rounded-xl
                bg-[#ad1e38]
                px-6
                text-sm
                font-bold
                text-white
                shadow-[0_8px_18px_rgba(173,30,56,0.17)]
                transition
                hover:bg-[#94182f]
                disabled:cursor-not-allowed
                disabled:bg-[#d6a6af]
                disabled:shadow-none
              "
            >
              {submitting ? "جارٍ تحديد الموعد..." : "تأكيد وإرسال الموعد"}
            </button>

            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="
                min-h-[46px]
                rounded-xl
                border
                border-[#e0e5e7]
                bg-white
                px-6
                text-sm
                font-bold
                text-[#627178]
              "
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
