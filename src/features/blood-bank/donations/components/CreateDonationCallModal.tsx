"use client";

import { CalendarDays, Clock3, Info, X } from "lucide-react";

import { type FormEvent, useState } from "react";

import {
  BLOOD_TYPES,
  type BloodType,
  type DonationPriority,
} from "../types/donation.types";

import { createDonationCall } from "../services/blood-bank-donation.service";

import { buildScheduledAt } from "../lib/donation.utils";

interface Props {
  onClose: () => void;
  onCreated: () => void;
}

export default function CreateDonationCallModal({ onClose, onCreated }: Props) {
  const [title, setTitle] = useState("");

  const [bloodType, setBloodType] = useState<BloodType | null>(null);

  const [units, setUnits] = useState("");

  const [priority, setPriority] = useState<DonationPriority | "">("");

  const [date, setDate] = useState("");

  const [time, setTime] = useState("");

  const [location, setLocation] = useState("");

  const [description, setDescription] = useState("");

  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const parsedUnits = Number(units);

  const canSubmit =
    title.trim().length >= 3 &&
    Boolean(bloodType) &&
    Number.isInteger(parsedUnits) &&
    parsedUnits > 0 &&
    parsedUnits <= 1000 &&
    Boolean(priority) &&
    Boolean(date) &&
    Boolean(time) &&
    description.trim().length > 0 &&
    !submitting;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canSubmit || !bloodType || !priority) {
      return;
    }

    const neededAt = buildScheduledAt(date, time);

    if (!neededAt) {
      setError("يرجى تحديد تاريخ ووقت صحيحين.");
      return;
    }

    if (new Date(neededAt).getTime() <= Date.now()) {
      setError("يجب أن يكون موعد التبرع في المستقبل.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await createDonationCall({
        title: title.trim(),

        blood_type: bloodType,

        units_required: parsedUnits,

        priority,

        needed_at: neededAt,

        description: description.trim(),

        ...(location.trim()
          ? {
              donation_location: location.trim(),
            }
          : {}),
      });

      onCreated();
      onClose();
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "تعذر إنشاء النداء.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="
        fixed inset-0 z-[120]
        flex items-center
        justify-center
        overflow-y-auto
        bg-[#17232c]/50
        px-4 py-6
        backdrop-blur-[1px]
      "
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-call-title"
    >
      <div
        className="
          my-auto
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
            px-7 py-5
            sm:px-8
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
              نداء جديد
            </span>

            <h2
              id="create-call-title"
              className="
                mt-1
                text-[21px]
                font-extrabold
                text-[#273941]
              "
            >
              إنشاء نداء تبرع بالدم
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="إغلاق"
            className="
              grid h-9 w-9
              place-items-center
              rounded-full
              text-[#68787f]
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
            px-7 py-6
            sm:px-8
          "
        >
          <FieldLabel>عنوان نداء التبرع</FieldLabel>

          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            maxLength={200}
            placeholder="مثال: حاجة عاجلة لمتبرعين بفصيلة O+"
            className="
              mt-2 h-[46px]
              w-full
              rounded-xl
              border
              border-[#e0e5e7]
              px-4
              text-sm
              text-[#35474e]
              outline-none
              placeholder:text-[#9ba6aa]
              focus:border-[#ad1e38]/35
              focus:ring-2
              focus:ring-[#ad1e38]/5
            "
          />

          <div className="mt-5">
            <FieldLabel>فصيلة الدم</FieldLabel>

            <div
              className="
                mt-3
                grid
                grid-cols-4
                gap-3
              "
              dir="ltr"
            >
              {BLOOD_TYPES.map((type) => {
                const selected = bloodType === type;

                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setBloodType(type)}
                    className={`
                        h-[44px]
                        rounded-xl
                        border
                        text-sm
                        font-extrabold
                        transition
                        ${
                          selected
                            ? "border-[#ad1e38] bg-[#fae9ed] text-[#ad1e38]"
                            : "border-[#e1e6e8] bg-white text-[#46575e] hover:border-[#d1d9dc]"
                        }
                      `}
                  >
                    {type}
                  </button>
                );
              })}
            </div>
          </div>

          <div
            className="
              mt-5
              grid gap-4
              sm:grid-cols-2
            "
          >
            <div>
              <FieldLabel>درجة الاستعجال</FieldLabel>

              <select
                value={priority}
                onChange={(event) =>
                  setPriority(event.target.value as DonationPriority | "")
                }
                className="
                  mt-2 h-[46px]
                  w-full
                  rounded-xl
                  border
                  border-[#e0e5e7]
                  bg-white
                  px-4
                  text-sm
                  text-[#68767c]
                  outline-none
                "
              >
                <option value="">اختر الدرجة</option>

                <option value="normal">عادي</option>

                <option value="urgent">عاجل</option>

                <option value="emergency">عاجل جدًا</option>
              </select>
            </div>

            <div>
              <FieldLabel>عدد الوحدات المطلوبة</FieldLabel>

              <input
                type="number"
                min={1}
                max={1000}
                step={1}
                value={units}
                onChange={(event) => setUnits(event.target.value)}
                placeholder="أدخل العدد"
                className="
                  mt-2 h-[46px]
                  w-full
                  rounded-xl
                  border
                  border-[#e0e5e7]
                  px-4
                  text-sm
                  text-[#35474e]
                  outline-none
                  placeholder:text-[#9ba6aa]
                "
              />
            </div>
          </div>

          <div
            className="
              mt-5
              grid gap-4
              sm:grid-cols-2
            "
          >
            <div>
              <FieldLabel>تاريخ التبرع</FieldLabel>

              <div className="relative mt-2">
                <input
                  type="date"
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                  className="
                    h-[46px]
                    w-full
                    rounded-xl
                    border
                    border-[#e0e5e7]
                    px-4 pl-11
                    text-sm
                    text-[#65747a]
                    outline-none
                  "
                />

                <CalendarDays
                  className="
                    pointer-events-none
                    absolute
                    left-4 top-1/2
                    h-4 w-4
                    -translate-y-1/2
                    text-[#7c898f]
                  "
                  strokeWidth={1.7}
                />
              </div>
            </div>

            <div>
              <FieldLabel>وقت التبرع</FieldLabel>

              <div className="relative mt-2">
                <input
                  type="time"
                  value={time}
                  onChange={(event) => setTime(event.target.value)}
                  className="
                    h-[46px]
                    w-full
                    rounded-xl
                    border
                    border-[#e0e5e7]
                    px-4 pl-11
                    text-sm
                    text-[#65747a]
                    outline-none
                  "
                />

                <Clock3
                  className="
                    pointer-events-none
                    absolute
                    left-4 top-1/2
                    h-4 w-4
                    -translate-y-1/2
                    text-[#7c898f]
                  "
                  strokeWidth={1.7}
                />
              </div>
            </div>
          </div>

          <div className="mt-5">
            <FieldLabel>مكان التبرع</FieldLabel>

            <input
              type="text"
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              maxLength={255}
              placeholder="اتركه فارغًا لاستخدام عنوان المؤسسة"
              className="
                mt-2 h-[46px]
                w-full
                rounded-xl
                border
                border-[#e0e5e7]
                px-4
                text-sm
                text-[#35474e]
                outline-none
                placeholder:text-[#9ba6aa]
              "
            />
          </div>

          <div className="mt-5">
            <FieldLabel>تفاصيل النداء</FieldLabel>

            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              maxLength={4000}
              rows={3}
              placeholder="تعليمات أو معلومات إضافية للمتبرعين"
              className="
                mt-2
                min-h-[84px]
                w-full
                resize-none
                rounded-xl
                border
                border-[#e0e5e7]
                px-4 py-3
                text-sm
                leading-6
                text-[#35474e]
                outline-none
                placeholder:text-[#9ba6aa]
              "
            />
          </div>

          <div
            className="
              mt-7
              flex items-start
              gap-3
              rounded-xl
              bg-[#f2f8f8]
              px-4 py-3
              text-[11px]
              leading-5
              text-[#6c9898]
            "
          >
            <Info
              className="
                mt-0.5
                h-4 w-4
                shrink-0
              "
              strokeWidth={1.8}
            />

            <p>
              عندما يقبل المتبرع سيصله موعد ومكان التبرع المحددان هنا. يظهر
              النداء فقط للفصائل المتوافقة.
            </p>
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
              mt-5
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
                px-7
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
              {submitting ? "جارٍ النشر..." : "نشر النداء والموعد"}
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

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label
      className="
        block
        text-xs
        font-bold
        text-[#46575e]
      "
    >
      {children}
    </label>
  );
}
