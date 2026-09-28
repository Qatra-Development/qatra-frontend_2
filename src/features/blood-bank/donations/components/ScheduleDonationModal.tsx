"use client";

import { CalendarDays, Clock3, MapPin, X } from "lucide-react";

import { type FormEvent, useState } from "react";

import { scheduleVoluntaryDonationRequest } from "../services/blood-bank-donation.service";

import { buildScheduledAt } from "../lib/donation.utils";

import type { VoluntaryDonationRequest } from "../types/donation.types";

interface Props {
  request: VoluntaryDonationRequest;
  onClose: () => void;
  onScheduled: () => void;
}

export default function ScheduleDonationModal({
  request,
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

    setError(null);

    const scheduledAt = buildScheduledAt(date, time);

    if (!scheduledAt) {
      setError("يرجى اختيار تاريخ ووقت صحيحين.");
      return;
    }

    if (new Date(scheduledAt).getTime() <= Date.now()) {
      setError("يجب أن يكون موعد الحضور في وقت لاحق.");
      return;
    }

    setSubmitting(true);

    try {
      await scheduleVoluntaryDonationRequest(request.id, {
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
        fixed inset-0 z-[100]
        flex items-center
        justify-center
        bg-[#17232c]/50
        px-4 py-8
        backdrop-blur-[1px]
      "
      role="dialog"
      aria-modal="true"
      aria-labelledby="schedule-title"
    >
      <div
        className="
          w-full
          max-w-[650px]
          overflow-hidden
          rounded-[22px]
          bg-white
          shadow-[0_28px_80px_rgba(23,35,44,0.24)]
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
                text-[#a61f36]
              "
            >
              طلب تبرع طوعي
            </span>

            <h2
              id="schedule-title"
              className="
                mt-2
                text-[22px]
                font-extrabold
                text-[#33454c]
              "
            >
              تحديد موعد لـ {request.donor.name}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="
              grid h-9 w-9
              place-items-center
              rounded-full
              text-[#6d7a80]
              transition
              hover:bg-slate-100
            "
            aria-label="إغلاق"
          >
            <X className="h-4 w-4" strokeWidth={1.8} />
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
            <h3
              className="
                text-[15px]
                font-extrabold
                text-[#26373e]
              "
            >
              موعد الحضور
            </h3>

            <label
              htmlFor="donation-date"
              className="
                mt-1 block
                text-xs
                font-medium
                text-[#69777d]
              "
            >
              اليوم
            </label>

            <div className="relative mt-2">
              <input
                id="donation-date"
                type="date"
                value={date}
                onChange={(event) => setDate(event.target.value)}
                className="
                  h-[48px] w-full
                  rounded-xl
                  border
                  border-[#dde3e5]
                  bg-white
                  pr-4 pl-11
                  text-sm
                  text-[#34464d]
                  outline-none
                  transition
                  focus:border-[#a61f36]/40
                  focus:ring-2
                  focus:ring-[#a61f36]/5
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
                strokeWidth={1.7}
              />
            </div>
          </div>

          <div className="mt-5">
            <label
              htmlFor="donation-time"
              className="
                block
                text-[15px]
                font-extrabold
                text-[#26373e]
              "
            >
              الساعة
            </label>

            <div className="relative mt-2">
              <input
                id="donation-time"
                type="time"
                value={time}
                onChange={(event) => setTime(event.target.value)}
                className="
                  h-[48px] w-full
                  rounded-xl
                  border
                  border-[#dde3e5]
                  bg-white
                  pr-4 pl-11
                  text-sm
                  text-[#34464d]
                  outline-none
                  transition
                  focus:border-[#a61f36]/40
                  focus:ring-2
                  focus:ring-[#a61f36]/5
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
                strokeWidth={1.7}
              />
            </div>
          </div>

          <div className="mt-5">
            <label
              htmlFor="donation-location"
              className="
                block
                text-[15px]
                font-extrabold
                text-[#26373e]
              "
            >
              المكان
            </label>

            <div className="relative mt-2">
              <input
                id="donation-location"
                type="text"
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                placeholder="أدخل مكان الحضور"
                maxLength={255}
                className="
                  h-[48px] w-full
                  rounded-xl
                  border
                  border-[#dde3e5]
                  bg-white
                  pr-4 pl-11
                  text-sm
                  text-[#34464d]
                  outline-none
                  placeholder:text-[#a0aaae]
                  focus:border-[#a61f36]/40
                  focus:ring-2
                  focus:ring-[#a61f36]/5
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
                strokeWidth={1.7}
              />
            </div>
          </div>

          <div className="mt-5">
            <label
              htmlFor="donation-instructions"
              className="
                block
                text-[15px]
                font-extrabold
                text-[#26373e]
              "
            >
              تعليمات الحضور
            </label>

            <textarea
              id="donation-instructions"
              value={instructions}
              onChange={(event) => setInstructions(event.target.value)}
              placeholder="تعليمات إضافية"
              maxLength={2000}
              rows={3}
              className="
                mt-2 min-h-[82px]
                w-full resize-none
                rounded-xl
                border
                border-[#dde3e5]
                bg-white
                px-4 py-3
                text-sm
                text-[#34464d]
                outline-none
                placeholder:text-[#a0aaae]
                focus:border-[#a61f36]/40
                focus:ring-2
                focus:ring-[#a61f36]/5
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
              mt-8
              flex flex-wrap
              items-center
              gap-3
            "
          >
            <button
              type="submit"
              disabled={!canSubmit}
              className="
                min-h-[46px]
                rounded-xl
                bg-[#a61f36]
                px-6
                text-sm
                font-bold
                text-white
                shadow-[0_8px_18px_rgba(166,31,54,0.18)]
                transition
                hover:bg-[#8f192e]
                disabled:cursor-not-allowed
                disabled:bg-[#d6b2b8]
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
                border-[#e2e6e8]
                bg-white
                px-6
                text-sm
                font-bold
                text-[#5f6d73]
                transition
                hover:bg-slate-50
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
