"use client";

import Link from "next/link";

import {
  CheckCircle2,
  HeartHandshake,
  Send,
  Target,
  UserCheck,
} from "lucide-react";

import { useState } from "react";

import { formatDonationDateTime } from "../lib/donation.utils";

import { useDonationCallResponders } from "../hooks/useDonationCallResponders";

import type { DonationCallResponder } from "../types/donation.types";

import ScheduleCallResponseModal from "./ScheduleCallResponseModal";
import RegisterDonationModal from "./RegisterDonationModal";

interface Props {
  callId: number;
}

export default function DonationCallRespondersPage({ callId }: Props) {
  const {
    call,
    responders,
    summary,

    availableCount,

    page,
    lastPage,

    loading,
    error,

    setPage,
    reload,
  } = useDonationCallResponders(callId);

  const [scheduleResponder, setScheduleResponder] =
    useState<DonationCallResponder | null>(null);

  const [registerResponder, setRegisterResponder] =
    useState<DonationCallResponder | null>(null);

  const [notice, setNotice] = useState<string | null>(null);

  function showNotice(message: string) {
    setNotice(message);

    window.setTimeout(() => {
      setNotice(null);
    }, 4000);
  }

  function handleScheduled() {
    showNotice("تم تحديد موعد المتبرع بنجاح.");

    reload();
  }

  function handleCompleted() {
    showNotice("تم تسجيل التبرع وإضافة الوحدة إلى المخزون.");
  }

  function closeRegisterModal() {
    setRegisterResponder(null);

    reload();
  }

  return (
    <>
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
            flex flex-col
            gap-5
            sm:flex-row
            sm:items-start
            sm:justify-between
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
              المتبرعون المستجيبون
            </span>

            <h1
              className="
                mt-1
                text-[27px]
                font-extrabold
                text-[#25373f]
              "
            >
              {call?.title || "مستجيبو نداء التبرع"}
            </h1>

            {call && (
              <p
                className="
                  mt-1
                  text-xs
                  text-[#7c898f]
                "
              >
                <span dir="ltr">{call.blood_type}</span>
                {" · "}
                {call.call_number}
              </p>
            )}
          </div>

          {call?.status === "active" && (
            <Link
              href={`/HospitalDashboard/donations/calls/${callId}/targeting`}
              className="
                inline-flex
                h-[44px]
                items-center
                justify-center
                gap-2
                self-start
                rounded-xl
                border
                border-[#dce3e5]
                bg-white
                px-5
                text-xs
                font-bold
                text-[#5d6d74]
                transition
                hover:bg-slate-50
              "
            >
              <Target className="h-4 w-4" />
              استهداف المزيد
            </Link>
          )}
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

        <div
          className="
            mt-7
            grid
            grid-cols-2
            gap-3
            lg:grid-cols-4
          "
        >
          <SummaryCard
            label="تم إرسال الدعوة"
            value={summary?.invitations_sent ?? 0}
            icon={Send}
          />

          <SummaryCard
            label="يستطيعون التبرع"
            value={summary?.interested ?? 0}
            icon={UserCheck}
          />

          <SummaryCard
            label="متاحين"
            value={availableCount}
            icon={HeartHandshake}
          />

          <SummaryCard
            label="تبرعات موثقة"
            value={summary?.completed_donations ?? 0}
            icon={CheckCircle2}
          />
        </div>

        <div
          className="
            mt-6
            overflow-hidden
            rounded-[20px]
            border
            border-[#e7ebed]
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
                    mb-3 h-[60px]
                    animate-pulse
                    rounded-xl
                    bg-[#f7f9f9]
                  "
                />
              ))}
            </div>
          ) : responders.length === 0 ? (
            <div
              className="
                flex min-h-[270px]
                flex-col
                items-center
                justify-center
                text-center
              "
            >
              <h3
                className="
                  text-sm
                  font-bold
                  text-[#43545b]
                "
              >
                لا يوجد مستجيبون حتى الآن
              </h3>

              <p
                className="
                  mt-1
                  text-xs
                  text-[#8a969b]
                "
              >
                ستظهر هنا الاستجابات الإيجابية للنداء.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table
                className="
                  w-full
                  min-w-[850px]
                  text-right
                  text-xs
                "
              >
                <thead
                  className="
                    bg-[#edf5f4]
                    text-[#53646b]
                  "
                >
                  <tr>
                    <th className="px-5 py-4 font-extrabold">اسم المتبرع</th>

                    <th className="px-5 py-4 font-extrabold">الفصيلة</th>

                    <th className="px-5 py-4 font-extrabold">الحالة</th>

                    <th className="px-5 py-4 font-extrabold">
                      تاريخ الإستجابة
                    </th>

                    <th className="px-5 py-4 font-extrabold">الإجراء</th>
                  </tr>
                </thead>

                <tbody>
                  {responders.map((responder) => (
                    <ResponderRow
                      key={responder.id}
                      responder={responder}
                      onSchedule={() => setScheduleResponder(responder)}
                      onRegister={() => setRegisterResponder(responder)}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!loading && !error && lastPage > 1 && (
            <div
              className="
                  flex items-center
                  justify-between
                  border-t
                  border-[#edf0f1]
                  px-5 py-4
                "
            >
              <span
                className="
                    text-xs
                    text-[#7d898e]
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
        </div>
      </section>

      {scheduleResponder && (
        <ScheduleCallResponseModal
          responder={scheduleResponder}
          onClose={() => setScheduleResponder(null)}
          onScheduled={handleScheduled}
        />
      )}

      {registerResponder?.process && (
        <RegisterDonationModal
          process={{
            id: registerResponder.process.id,
          }}
          onClose={closeRegisterModal}
          onCompleted={handleCompleted}
        />
      )}
    </>
  );
}

function ResponderRow({
  responder,
  onSchedule,
  onRegister,
}: {
  responder: DonationCallResponder;
  onSchedule: () => void;
  onRegister: () => void;
}) {
  const available = responder.donor.availability_status === "available";

  const completed =
    responder.process?.donation_recorded ||
    responder.process?.status === "completed";

  const scheduled = responder.process?.status === "scheduled" && !completed;

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
          px-5 py-4
          font-bold
          text-[#35474e]
        "
      >
        {responder.donor.name}
      </td>

      <td
        dir="ltr"
        className="
          border-b
          border-[#edf0f1]
          px-5 py-4
          font-extrabold
          text-[#ad1e38]
        "
      >
        {responder.donor.blood_type}
      </td>

      <td
        className="
          border-b
          border-[#edf0f1]
          px-5 py-4
        "
      >
        <span
          className={`
            inline-flex
            rounded-full
            px-2.5 py-1
            text-[10px]
            font-bold
            ${
              available
                ? "bg-[#eaf7f3] text-[#248166]"
                : "bg-[#f2f3f4] text-[#7a878c]"
            }
          `}
        >
          {available ? "يستطيع التبرع" : "لا يستطيع التبرع"}
        </span>
      </td>

      <td
        className="
          whitespace-nowrap
          border-b
          border-[#edf0f1]
          px-5 py-4
          text-[11px]
          text-[#77868c]
        "
      >
        {formatDonationDateTime(responder.responded_at)}
      </td>

      <td
        className="
          border-b
          border-[#edf0f1]
          px-5 py-4
        "
      >
        {completed ? (
          <span
            className="
              inline-flex
              rounded-lg
              bg-[#eaf7f3]
              px-3 py-2
              text-[10px]
              font-bold
              text-[#248166]
            "
          >
            تم التبرع
          </span>
        ) : available && !responder.process ? (
          <button
            type="button"
            onClick={onSchedule}
            className="
              rounded-lg
              border
              border-[#ad1e38]
              px-3 py-2
              text-[10px]
              font-bold
              text-[#ad1e38]
              transition
              hover:bg-[#fbedf0]
            "
          >
            تحديد موعد
          </button>
        ) : available && scheduled ? (
          <button
            type="button"
            onClick={onRegister}
            className="
              rounded-lg
              bg-[#ad1e38]
              px-3 py-2
              text-[10px]
              font-bold
              text-white
              transition
              hover:bg-[#94182f]
            "
          >
            تسجيل التبرع
          </button>
        ) : (
          <span className="text-[10px] text-[#a0aaae]">—</span>
        )}
      </td>
    </tr>
  );
}

function SummaryCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: typeof Send;
}) {
  return (
    <article
      className="
        rounded-2xl
        border
        border-[#edf0f1]
        bg-white
        p-4
        shadow-[0_4px_16px_rgba(28,50,58,0.025)]
      "
    >
      <div
        className="
          flex items-center
          justify-between
        "
      >
        <span
          className="
            text-[11px]
            font-medium
            text-[#76858b]
          "
        >
          {label}
        </span>

        <Icon
          className="
            h-4 w-4
            text-[#ad1e38]
          "
        />
      </div>

      <strong
        className="
          mt-5 block
          text-xl
          font-extrabold
          text-[#2d3f47]
        "
      >
        {value}
      </strong>
    </article>
  );
}
