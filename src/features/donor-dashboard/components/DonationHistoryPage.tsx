"use client";

import { Building2, HandHeart, HeartPulse, Users } from "lucide-react";

import { useDonationHistory } from "../hooks/useDonationHistory";

import type { DonationProcessStatus } from "../types/donor.types";

import DonorHeader from "./DonorHeader";

function dateOnly(value?: string | null) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-CA").format(date);
}

function statusLabel(status: DonationProcessStatus) {
  const labels: Record<DonationProcessStatus, string> = {
    awaiting_contact: "بانتظار التواصل",

    scheduled: "مقبول بانتظار التبرع",

    completed: "تم التبرع",

    cancelled: "ملغي",
  };

  return labels[status];
}

export default function DonationHistoryPage() {
  const {
    user,
    items,
    summary,
    meta,

    page,
    setPage,

    loading,
    error,
  } = useDonationHistory();

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
        <h1
          className="
            text-[28px]
            font-extrabold
            text-[#243741]
          "
        >
          سجل تبرعاتي
        </h1>

        <p
          className="
            mt-2
            text-sm
            text-[#7e8b91]
          "
        >
          تعرض هذه الصفحة التبرعات الفعلية الموثقة فقط، وليس الاستجابات
          للنداءات.
        </p>

        <div
          className="
            mt-8
            grid grid-cols-2
            gap-4
            lg:grid-cols-4
          "
        >
          <SummaryCard
            label="إجمالي التبرعات"
            value={summary?.total_donations ?? 0}
            icon={HeartPulse}
            accent="neutral"
          />

          <SummaryCard
            label="التبرعات المكتملة"
            value={summary?.completed_donations ?? 0}
            icon={HandHeart}
            accent="green"
          />

          <SummaryCard
            label="تبرعات هذا العام"
            value={summary?.donations_this_year ?? 0}
            icon={Users}
            accent="yellow"
          />

          <SummaryCard
            label="المؤسسات تبرعت لها"
            value={summary?.institutions_donated_to ?? 0}
            icon={Building2}
            accent="red"
          />
        </div>

        <div
          className="
            mt-6
            overflow-hidden
            rounded-[20px]
            bg-white
            shadow-[0_5px_20px_rgba(28,50,58,0.03)]
          "
        >
          {error ? (
            <div
              className="
                px-5 py-10
                text-center
                text-sm
                text-red-700
              "
            >
              {error}
            </div>
          ) : loading ? (
            <div className="p-5">
              {Array.from({
                length: 4,
              }).map((_, index) => (
                <div
                  key={index}
                  className="
                      mb-3
                      h-[58px]
                      animate-pulse
                      rounded-xl
                      bg-[#f7f9f9]
                    "
                />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table
                className="
                  w-full
                  min-w-[760px]
                  text-right
                  text-xs
                "
              >
                <thead
                  className="
                    bg-[#eef5f4]
                    text-[#55666d]
                  "
                >
                  <tr>
                    <th className="px-6 py-4 font-bold">رقم الوحدة</th>

                    <th className="px-6 py-4 font-bold">المؤسسة</th>

                    <th className="px-6 py-4 font-bold">تاريخ التبرع</th>

                    <th className="px-6 py-4 font-bold">حالة التبرع</th>
                  </tr>
                </thead>

                <tbody>
                  {items.map((item) => {
                    const unitCode =
                      item.donation?.blood_unit?.unit_code ?? "—";

                    const donationDate =
                      item.donation?.donation_date ?? item.scheduled_at;

                    return (
                      <tr key={item.id}>
                        <td
                          className="
                              border-b
                              border-[#edf0f1]
                              px-6 py-5
                              font-extrabold
                              text-[#ad1e38]
                            "
                          dir="ltr"
                        >
                          {unitCode}
                        </td>

                        <td
                          className="
                              border-b
                              border-[#edf0f1]
                              px-6 py-5
                              text-[#52636a]
                            "
                        >
                          {item.institution?.name ?? "—"}
                        </td>

                        <td
                          className="
                              border-b
                              border-[#edf0f1]
                              px-6 py-5
                              text-[#718087]
                            "
                          dir="ltr"
                        >
                          {dateOnly(donationDate)}
                        </td>

                        <td
                          className="
                              border-b
                              border-[#edf0f1]
                              px-6 py-5
                            "
                        >
                          <HistoryStatus status={item.status} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {meta && meta.last_page > 1 && (
            <div
              className="
                  flex items-center
                  justify-between
                  border-t
                  border-[#edf0f1]
                  px-6 py-4
                "
            >
              <span
                className="
                    text-xs
                    text-[#819096]
                  "
              >
                صفحة {page} من {meta.last_page}
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
                  disabled={page >= meta.last_page}
                  onClick={() => setPage(page + 1)}
                  className="
                      rounded-lg
                      border
                      border-[#e0e5e7]
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
    </>
  );
}

function HistoryStatus({ status }: { status: DonationProcessStatus }) {
  const completed = status === "completed";

  const scheduled = status === "scheduled";

  return (
    <span
      className={`
        inline-flex
        items-center
        gap-1.5
        rounded-full
        px-3 py-1.5
        text-[10px]
        font-bold
        ${
          completed
            ? "bg-[#fbedf0] text-[#ad1e38]"
            : scheduled
              ? "bg-[#fff7df] text-[#a97728]"
              : "bg-[#f1f3f4] text-[#75848a]"
        }
      `}
    >
      <span
        className="
          h-1.5 w-1.5
          rounded-full
          bg-current
        "
      />

      {statusLabel(status)}
    </span>
  );
}

function SummaryCard({
  label,
  value,
  icon: Icon,
  accent,
}: {
  label: string;
  value: number;
  icon: typeof HeartPulse;
  accent: "neutral" | "green" | "yellow" | "red";
}) {
  const accents = {
    neutral: "bg-[#f4f6f7] text-[#89969b]",

    green: "bg-[#eef9f5] text-[#28a66c]",

    yellow: "bg-[#fff9e9] text-[#c19535]",

    red: "bg-[#fcedf0] text-[#ad1e38]",
  };

  return (
    <article
      className="
        min-h-[120px]
        rounded-2xl
        bg-white
        p-5
        shadow-[0_5px_20px_rgba(28,50,58,0.03)]
      "
    >
      <div
        className="
          flex items-start
          justify-between
        "
      >
        <span
          className="
            text-xs
            text-[#65747b]
          "
        >
          {label}
        </span>

        <span
          className={`
            grid h-8 w-8
            place-items-center
            rounded-lg
            ${accents[accent]}
          `}
        >
          <Icon className="h-4 w-4" />
        </span>
      </div>

      <strong
        className="
          mt-5 block
          text-[27px]
          font-extrabold
          text-[#293b43]
        "
      >
        {value}
      </strong>
    </article>
  );
}
