"use client";

import Link from "next/link";

import { ArrowRight, Search, Send } from "lucide-react";

import { useState } from "react";

import { useMatchingDonors } from "../hooks/useMatchingDonors";

import type { MatchingDonor } from "../types/donation.types";

interface Props {
  callId: number;
}

export default function MatchingDonorsPage({ callId }: Props) {
  const {
    call,
    donors,

    search,
    setSearch,

    selectedIds,

    page,
    lastPage,

    allPageSelected,

    loading,
    submitting,
    error,

    setPage,

    toggleDonor,
    toggleCurrentPage,
    sendInvitations,
  } = useMatchingDonors(callId);

  const [notice, setNotice] = useState<string | null>(null);

  async function handleSend() {
    const success = await sendInvitations();

    if (!success) {
      return;
    }

    setNotice("تم إرسال النداء المباشر للمتبرعين المحددين بنجاح.");

    window.setTimeout(() => {
      setNotice(null);
    }, 4000);
  }

  return (
    <section
      className="
        mx-auto
        w-full
        max-w-[1240px]
        pb-10 pt-5
      "
    >
      <div
        className="
          flex
          flex-col
          gap-5
          lg:flex-row
          lg:items-start
          lg:justify-between
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
            إدارة التبرعات
          </span>

          <h1
            className="
              mt-1
              text-[27px]
              font-extrabold
              text-[#25373f]
            "
          >
            استهداف المتبرعين المناسبين
          </h1>

          <p
            className="
              mt-1
              text-sm
              text-[#7d8a90]
            "
          >
            استهدف المتبرعين المناسبين وتابع استجاباتهم.
          </p>
        </div>

        <Link
          href={`/HospitalDashboard/donations/calls/${callId}/responders`}
          className="
            inline-flex
            h-[42px]
            items-center
            gap-2
            self-start
            rounded-xl
            border
            border-[#dde3e5]
            bg-white
            px-4
            text-xs
            font-bold
            text-[#617077]
          "
        >
          <ArrowRight className="h-4 w-4" />
          المستجيبون
        </Link>
      </div>

      {call && (
        <div
          className="
            mt-6
            flex flex-wrap
            items-center
            gap-x-3 gap-y-2
            rounded-2xl
            border
            border-[#e6eaec]
            bg-white
            px-5 py-4
          "
        >
          <span
            className="
              rounded-lg
              bg-[#fbedf0]
              px-3 py-2
              text-sm
              font-extrabold
              text-[#ad1e38]
            "
            dir="ltr"
          >
            {call.blood_type}
          </span>

          <strong
            className="
              text-sm
              text-[#30424a]
            "
          >
            {call.title}
          </strong>

          {call.institution && (
            <span
              className="
                text-xs
                text-[#849197]
              "
            >
              {call.institution.name}
              {" — "}
              {call.institution.governorate}
            </span>
          )}

          <span
            className="
              mr-auto
              inline-flex
              rounded-full
              bg-[#eaf7f3]
              px-2.5 py-1
              text-[10px]
              font-bold
              text-[#287f69]
            "
          >
            نشط
          </span>
        </div>
      )}

      <div
        className="
          mt-6
          flex
          flex-col
          gap-4
          rounded-[20px]
          border
          border-[#e6eaec]
          bg-white
          p-5
          shadow-[0_5px_20px_rgba(28,50,58,0.03)]
        "
      >
        <div
          className="
            flex
            flex-col
            gap-4
            lg:flex-row
            lg:items-center
            lg:justify-between
          "
        >
          <div
            className="
              relative
              w-full
              max-w-[370px]
            "
          >
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="البحث بمنطقة المتبرع"
              className="
                h-[44px]
                w-full
                rounded-full
                border
                border-[#e0e5e7]
                bg-white
                pr-5 pl-11
                text-xs
                text-[#3b4d54]
                outline-none
                placeholder:text-[#939fa4]
              "
            />

            <Search
              className="
                absolute
                left-4 top-1/2
                h-4 w-4
                -translate-y-1/2
                text-[#95a0a5]
              "
            />
          </div>

          <label
            className="
              inline-flex
              cursor-pointer
              items-center
              gap-2
              text-xs
              font-bold
              text-[#53646b]
            "
          >
            <input
              type="checkbox"
              checked={allPageSelected}
              onChange={toggleCurrentPage}
              className="
                h-[17px]
                w-[17px]
                cursor-pointer
                accent-[#ad1e38]
              "
            />
            تحديد غير المدعوين في الصفحة
          </label>
        </div>

        <div
          className="
            flex items-center
            gap-2
            rounded-xl
            bg-[#f1f7f6]
            px-4 py-3
            text-[11px]
            text-[#6a8988]
          "
        >
          التوافق يعتمد على الفصيلة، الموقع، التوفر وحالة الحساب
        </div>

        {notice && (
          <div
            className="
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

        {loading ? (
          <div className="space-y-3">
            {Array.from({
              length: 5,
            }).map((_, index) => (
              <div
                key={index}
                className="
                  h-[58px]
                  animate-pulse
                  rounded-xl
                  bg-[#f7f9f9]
                "
              />
            ))}
          </div>
        ) : donors.length === 0 ? (
          <div
            className="
              flex min-h-[240px]
              items-center
              justify-center
              text-sm
              text-[#839096]
            "
          >
            لا يوجد متبرعون مطابقون لهذا النداء.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table
              className="
                w-full
                min-w-[900px]
                text-right
                text-xs
              "
            >
              <thead
                className="
                  bg-[#edf5f4]
                  text-[#52636a]
                "
              >
                <tr>
                  <th className="w-12 px-4 py-4" />

                  <th className="px-4 py-4 font-extrabold">المتبرع</th>

                  <th className="px-4 py-4 font-extrabold">الفصيلة</th>

                  <th className="px-4 py-4 font-extrabold">المنطقة</th>

                  <th className="px-4 py-4 font-extrabold">آخر تبرع</th>

                  <th className="px-4 py-4 font-extrabold">الحالة</th>

                  <th className="px-4 py-4 font-extrabold">الدعوة</th>
                </tr>
              </thead>

              <tbody>
                {donors.map((donor) => (
                  <MatchingDonorRow
                    key={donor.id}
                    donor={donor}
                    selected={selectedIds.has(donor.id)}
                    onToggle={() => toggleDonor(donor)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && lastPage > 1 && (
          <div
            className="
                flex items-center
                justify-between
                border-t
                border-[#edf0f1]
                pt-4
              "
          >
            <span
              className="
                  text-xs
                  text-[#7e8b90]
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

        <div
          className="
            flex flex-col
            gap-3
            border-t
            border-[#edf0f1]
            pt-5
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          <p
            className="
              text-[11px]
              text-[#849197]
            "
          >
            {selectedIds.size} متبرعين محددين. الاختيار لا يعني الموافقة أو
            التبرع.
          </p>

          <button
            type="button"
            disabled={selectedIds.size === 0 || submitting}
            onClick={handleSend}
            className="
              inline-flex
              min-h-[44px]
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-[#ad1e38]
              px-6
              text-xs
              font-bold
              text-white
              shadow-[0_8px_18px_rgba(173,30,56,0.16)]
              transition
              hover:bg-[#94182f]
              disabled:cursor-not-allowed
              disabled:bg-[#d6b0b7]
              disabled:shadow-none
            "
          >
            <Send className="h-4 w-4" />

            {submitting ? "جارٍ الإرسال..." : "إرسال نداء مباشر"}
          </button>
        </div>
      </div>
    </section>
  );
}

function MatchingDonorRow({
  donor,
  selected,
  onToggle,
}: {
  donor: MatchingDonor;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <tr
      className="
        transition
        hover:bg-slate-50/70
      "
    >
      <td
        className="
          border-b
          border-[#edf0f1]
          px-4 py-4
          text-center
        "
      >
        <input
          type="checkbox"
          checked={selected}
          disabled={donor.invitation_sent}
          onChange={onToggle}
          className="
            h-[17px]
            w-[17px]
            cursor-pointer
            accent-[#ad1e38]
            disabled:cursor-not-allowed
            disabled:opacity-40
          "
        />
      </td>

      <td
        className="
          border-b
          border-[#edf0f1]
          px-4 py-4
        "
      >
        <div
          className="
            font-bold
            text-[#34464d]
          "
        >
          {donor.name}
        </div>

        <span
          className="
            mt-1 block
            text-[9px]
            text-[#9aa5aa]
          "
          dir="ltr"
        >
          D-
          {String(donor.id).padStart(4, "0")}
        </span>
      </td>

      <td
        dir="ltr"
        className="
          border-b
          border-[#edf0f1]
          px-4 py-4
          font-extrabold
          text-[#ad1e38]
        "
      >
        {donor.blood_type}
      </td>

      <td
        className="
          border-b
          border-[#edf0f1]
          px-4 py-4
          text-[#69787e]
        "
      >
        {donor.region}
      </td>

      <td
        className="
          border-b
          border-[#edf0f1]
          px-4 py-4
          text-[#69787e]
        "
      >
        {formatLastDonation(donor.last_donation_at)}
      </td>

      <td
        className="
          border-b
          border-[#edf0f1]
          px-4 py-4
        "
      >
        <span
          className="
            inline-flex
            rounded-full
            bg-[#eaf7f3]
            px-2.5 py-1
            text-[10px]
            font-bold
            text-[#28836c]
          "
        >
          متاح
        </span>
      </td>

      <td
        className="
          border-b
          border-[#edf0f1]
          px-4 py-4
        "
      >
        {donor.invitation_sent ? (
          <span
            className="
              inline-flex
              rounded-full
              bg-[#f0f2f3]
              px-2.5 py-1
              text-[10px]
              font-bold
              text-[#77858b]
            "
          >
            أُرسل سابقًا
          </span>
        ) : (
          <span
            className="
              text-[10px]
              text-[#a0aaae]
            "
          >
            —
          </span>
        )}
      </td>
    </tr>
  );
}

function formatLastDonation(value: string | null) {
  if (!value) {
    return "لا يوجد";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "لا يوجد";
  }

  const diff = Date.now() - date.getTime();

  const days = Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));

  if (days < 30) {
    return days <= 1 ? "مؤخرًا" : `قبل ${days} أيام`;
  }

  const months = Math.floor(days / 30);

  if (months < 12) {
    return `قبل ${months} أشهر`;
  }

  const years = Math.floor(months / 12);

  return `قبل ${years} سنوات`;
}
