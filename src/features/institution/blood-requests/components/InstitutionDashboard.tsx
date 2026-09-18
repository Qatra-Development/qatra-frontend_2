"use client";

import { Building2, CircleX, Droplets, PackageCheck, Plus } from "lucide-react";

import { useState } from "react";

import { useInstitutionDashboard } from "../hooks/useInstitutionDashboard";

import { useInstitutionIdentity } from "../../shared/hooks/useInstitutionIdentity";

import InstitutionStatCard from "./InstitutionStatCard";
import RequestStatusOverview from "./RequestStatusOverview";
import BloodTypeChart from "./BloodTypeChart";
import RecentRequestsTable from "./RecentRequestsTable";
import NewBloodRequestModal from "./NewBloodRequestModal";

export default function InstitutionDashboard() {
  const [showNewRequest, setShowNewRequest] = useState(false);

  const { institution } = useInstitutionIdentity();

  const { data, loading, error, refresh } = useInstitutionDashboard();

  if (loading) {
    return <InstitutionDashboardSkeleton />;
  }

  if (error || !data) {
    return (
      <DashboardError
        message={error || "تعذر تحميل لوحة التحكم."}
        onRetry={refresh}
      />
    );
  }

  const { summary, latestRequests, latestDraft } = data;

  return (
    <>
      <div dir="rtl" className="space-y-6">
        <section
          className="
            flex flex-col
            gap-4
            sm:flex-row
            sm:items-end
            sm:justify-between
          "
        >
          <div>
            <h1
              className="
                text-2xl
                font-bold
                text-[var(--admin-text-primary)]
                sm:text-3xl
              "
            >
              مرحباً، {institution?.institution_name || "المؤسسة الصحية"}
            </h1>

            <p
              className="
                mt-2
                text-sm
                text-[var(--admin-text-muted)]
              "
            >
              كل طلب وقبول وإرسال واستلام يظهر هنا مباشرة.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowNewRequest(true)}
            className="
              admin-btn-primary
              inline-flex
              items-center
              gap-2
              self-start
              sm:self-auto
            "
          >
            <Plus className="h-4 w-4" />
            طلب دم جديد
          </button>
        </section>

        <section
          className="
            grid
            gap-4
            sm:grid-cols-2
            xl:grid-cols-4
          "
        >
          <InstitutionStatCard
            title="طلباتي"
            value={summary.total_requests}
            icon={Building2}
            tone="neutral"
          />

          <InstitutionStatCard
            title="الوحدات المطلوبة"
            value={summary.units_required}
            icon={Droplets}
            tone="warning"
          />

          <InstitutionStatCard
            title="الوحدات المستلمة"
            value={summary.units_received}
            icon={PackageCheck}
            tone="success"
          />

          <InstitutionStatCard
            title="الطلبات المفتوحة"
            value={summary.active_requests}
            icon={CircleX}
            tone="danger"
          />
        </section>

        <section
          className="
            grid
            gap-5
            xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.5fr)]
          "
        >
          <BloodTypeChart summary={summary} />

          <RequestStatusOverview summary={summary} latestDraft={latestDraft} />
        </section>

        <RecentRequestsTable requests={latestRequests} />
      </div>

      <NewBloodRequestModal
        open={showNewRequest}
        onClose={() => setShowNewRequest(false)}
        onCreated={() => {
          refresh();
        }}
      />
    </>
  );
}

function InstitutionDashboardSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div>
        <div className="h-8 w-72 rounded bg-gray-200" />

        <div className="mt-3 h-4 w-80 rounded bg-gray-100" />
      </div>

      <div
        className="
          grid gap-4
          sm:grid-cols-2
          xl:grid-cols-4
        "
      >
        {Array.from({
          length: 4,
        }).map((_, index) => (
          <div
            key={index}
            className="
                h-[125px]
                rounded-[var(--admin-card-radius)]
                bg-white
              "
          />
        ))}
      </div>

      <div
        className="
          grid gap-5
          xl:grid-cols-2
        "
      >
        <div className="h-[350px] rounded-[var(--admin-card-radius)] bg-white" />
        <div className="h-[350px] rounded-[var(--admin-card-radius)] bg-white" />
      </div>

      <div className="h-[340px] rounded-[var(--admin-card-radius)] bg-white" />
    </div>
  );
}

function DashboardError({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <section
      className="
        institution-card
        flex min-h-[400px]
        flex-col
        items-center
        justify-center
        px-6
        text-center
      "
    >
      <h2
        className="
          text-lg
          font-bold
          text-[var(--admin-text-primary)]
        "
      >
        تعذر تحميل لوحة التحكم
      </h2>

      <p
        className="
          mt-2
          text-sm
          text-[var(--admin-text-muted)]
        "
      >
        {message}
      </p>

      <button
        type="button"
        onClick={onRetry}
        className="admin-btn-primary mt-5"
      >
        إعادة المحاولة
      </button>
    </section>
  );
}
