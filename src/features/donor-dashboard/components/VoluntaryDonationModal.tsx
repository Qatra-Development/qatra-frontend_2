"use client";

import { CheckCircle2, X } from "lucide-react";

import { type FormEvent, useEffect, useState } from "react";

import {
  createVoluntaryDonationRequest,
  getAllDonationInstitutions,
} from "../services/donor.service";

import type {
  DonationInstitution,
  DonorAvailability,
} from "../types/donor.types";

interface Props {
  availability: DonorAvailability;

  onClose: () => void;
  onCreated: () => void;
}

function institutionTypeLabel(value: string) {
  const labels: Record<string, string> = {
    central_hospital: "مستشفى مركزي",

    field_hospital: "مستشفى ميداني",

    health_center: "مركز صحي",

    blood_bank_association: "جمعية بنك دم",

    independent_blood_center: "مركز دم مستقل",
  };

  return labels[value] ?? value;
}

export default function VoluntaryDonationModal({
  availability,
  onClose,
  onCreated,
}: Props) {
  const [institutions, setInstitutions] = useState<DonationInstitution[]>([]);

  const [institutionId, setInstitutionId] = useState<number | null>(null);

  const [note, setNote] = useState("");

  const [loading, setLoading] = useState(availability.is_eligible);

  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!availability.is_eligible) {
      return;
    }

    const controller = new AbortController();

    async function load() {
      try {
        const data = await getAllDonationInstitutions(controller.signal);

        setInstitutions(data);
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
            : "تعذر تحميل المؤسسات.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void load();

    return () => controller.abort();
  }, [availability.is_eligible]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!institutionId || !availability.is_eligible) {
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await createVoluntaryDonationRequest({
        institution_id: institutionId,

        ...(note.trim()
          ? {
              note: note.trim(),
            }
          : {}),
      });

      onCreated();
      onClose();
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "تعذر إرسال طلب التبرع.",
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
        overflow-y-auto
        bg-[#17232c]/50
        px-4 py-8
        backdrop-blur-[1px]
      "
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
        <div
          className="
            flex items-start
            justify-between
            border-b
            border-[#edf0f1]
            px-7 py-5
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
              تبرع طوعي
            </span>

            <h2
              className="
                mt-1
                text-[20px]
                font-extrabold
                text-[#283a42]
              "
            >
              تقديم طلب تبرع بالدم
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
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

        <form
          onSubmit={handleSubmit}
          className="
            px-7 py-6
          "
        >
          {availability.is_eligible ? (
            <div
              className="
                flex items-start
                gap-3
                rounded-xl
                bg-[#eef5ff]
                px-4 py-4
              "
            >
              <CheckCircle2
                className="
                  h-5 w-5
                  shrink-0
                  text-[#5789c7]
                "
              />

              <div>
                <strong
                  className="
                    text-xs
                    text-[#3e648e]
                  "
                >
                  أنت مؤهل للتبرع الآن
                </strong>

                <p
                  className="
                    mt-1
                    text-[10px]
                    text-[#7896b8]
                  "
                >
                  اختر بنك الدم الذي ترغب بالتبرع لديه، وسيحدد لك موعدًا للحضور.
                </p>
              </div>
            </div>
          ) : (
            <div
              className="
                rounded-xl
                bg-[#fff4e5]
                px-4 py-4
                text-xs
                leading-6
                text-[#9a6a2c]
              "
            >
              أنت غير مؤهل للتبرع حاليًا.
              {availability.next_eligible_at &&
                ` الموعد القادم للأهلية: ${new Date(
                  availability.next_eligible_at,
                ).toLocaleDateString("ar-EG")}`}
            </div>
          )}

          {availability.is_eligible && (
            <>
              <div
                className="
                  mt-5
                  max-h-[300px]
                  space-y-2
                  overflow-y-auto
                  pl-1
                "
              >
                {loading ? (
                  Array.from({
                    length: 4,
                  }).map((_, index) => (
                    <div
                      key={index}
                      className="
                          h-[64px]
                          animate-pulse
                          rounded-xl
                          bg-[#f7f9f9]
                        "
                    />
                  ))
                ) : institutions.length === 0 ? (
                  <div
                    className="
                      rounded-xl
                      bg-[#f7f9f9]
                      px-4 py-8
                      text-center
                      text-xs
                      text-[#849197]
                    "
                  >
                    لا توجد مؤسسات متاحة حاليًا.
                  </div>
                ) : (
                  institutions.map((institution, index) => {
                    const selected = institutionId === institution.id;

                    return (
                      <button
                        key={institution.id}
                        type="button"
                        onClick={() => setInstitutionId(institution.id)}
                        className={`
                            flex w-full
                            items-center
                            gap-4
                            rounded-xl
                            border
                            px-4 py-3
                            text-right
                            transition
                            ${
                              selected
                                ? "border-[#f0cbd2] bg-[#fcecef]"
                                : "border-[#e3e7e9] bg-white hover:bg-slate-50"
                            }
                          `}
                      >
                        <span
                          className={`
                              grid h-7 w-7
                              shrink-0
                              place-items-center
                              rounded-full
                              text-[10px]
                              font-bold
                              ${
                                selected
                                  ? "bg-[#ad1e38] text-white"
                                  : "bg-[#f2f4f5] text-[#879399]"
                              }
                            `}
                        >
                          {index + 1}
                        </span>

                        <div className="min-w-0 flex-1">
                          <strong
                            className="
                                block
                                text-xs
                                text-[#35474e]
                              "
                          >
                            {institution.name}
                          </strong>

                          <p
                            className="
                                mt-1
                                truncate
                                text-[9px]
                                text-[#88959a]
                              "
                          >
                            {institutionTypeLabel(institution.type)}
                            {" · "}
                            {institution.governorate}
                            {" · "}
                            {institution.address}
                          </p>
                        </div>

                        <span
                          className={`
                              h-4 w-4
                              shrink-0
                              rounded-full
                              border
                              p-[3px]
                              ${
                                selected
                                  ? "border-[#ad1e38]"
                                  : "border-[#bfc7ca]"
                              }
                            `}
                        >
                          {selected && (
                            <span
                              className="
                                  block h-full
                                  w-full
                                  rounded-full
                                  bg-[#ad1e38]
                                "
                            />
                          )}
                        </span>
                      </button>
                    );
                  })
                )}
              </div>

              <div className="mt-5">
                <label
                  className="
                    text-xs
                    font-bold
                    text-[#44565d]
                  "
                >
                  ملاحظة للمؤسسة
                </label>

                <textarea
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  maxLength={2000}
                  rows={3}
                  placeholder="معلومات اختيارية عن الوقت المناسب أو التواصل"
                  className="
                    mt-2
                    min-h-[90px]
                    w-full
                    resize-none
                    rounded-xl
                    border
                    border-[#e0e5e7]
                    px-4 py-3
                    text-sm
                    text-[#35474e]
                    outline-none
                    placeholder:text-[#9aa5aa]
                  "
                />
              </div>
            </>
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
              disabled={
                !availability.is_eligible || !institutionId || submitting
              }
              className="
                min-h-[46px]
                rounded-xl
                bg-[#ad1e38]
                px-7
                text-sm
                font-bold
                text-white
                shadow-[0_8px_18px_rgba(173,30,56,0.17)]
                disabled:cursor-not-allowed
                disabled:bg-[#d6aab2]
                disabled:shadow-none
              "
            >
              {submitting ? "جارٍ الإرسال..." : "إرسال طلب التبرع"}
            </button>

            <button
              type="button"
              onClick={onClose}
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
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
