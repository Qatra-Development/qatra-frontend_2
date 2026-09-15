"use client";

import { Building2, CalendarClock, CircleX, BadgeCheck } from "lucide-react";

import { useAdminDashboard } from "../hooks/useAdminDashboard";

import DashboardCard from "./DashboardCard";
import DashboardStatCard from "./DashboardStatCard";
import DashboardActivityChart from "./DashboardActivityChart";
import LatestReviewCard from "./LatestReviewCard";
import LatestInstitutionsTable from "./LatestInstitutionsTable";

export default function AdminDashboard() {
  const { data, error, isLoading, retry } = useAdminDashboard();

  if (isLoading) {
    return <DashboardLoading />;
  }

  if (error || !data) {
    return (
      <DashboardCard className="p-8 text-center">
        <h2 className="text-lg font-bold text-brand-blue">
          تعذر تحميل لوحة التحكم
        </h2>

        <p className="mt-2 text-sm text-gray-500">{error}</p>

        <button
          type="button"
          onClick={retry}
          className="
            mt-5 rounded-lg
            bg-brand-red px-6 py-2.5
            text-sm font-semibold text-white
            transition hover:bg-brand-red-dark
          "
        >
          إعادة المحاولة
        </button>
      </DashboardCard>
    );
  }

  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-2xl font-bold text-brand-blue sm:text-3xl">
          مرحباً، مشرف الصحة
        </h1>

        <p className="mt-2 text-sm text-gray-400">
          نظرة عامة على بيانات اعتماد المؤسسات الصحية
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
        <DashboardStatCard
          title="إجمالي المؤسسات"
          value={data.stats.total}
          icon={Building2}
          tone="neutral"
        />

        <DashboardStatCard
          title="قيد المراجعة"
          value={data.stats.pendingReview}
          icon={CalendarClock}
          tone="warning"
        />

        <DashboardStatCard
          title="معتمدة"
          value={data.stats.approved}
          icon={BadgeCheck}
          tone="success"
        />

        <DashboardStatCard
          title="مرفوضة"
          value={data.stats.rejected}
          icon={CircleX}
          tone="danger"
        />
      </section>

      <section
        dir="ltr"
        className="
          grid gap-5
          md:grid-cols-[330px_minmax(0,1fr)]
        "
      >
        <div dir="rtl">
          <LatestReviewCard institution={data.lastReview} />
        </div>

        <div dir="rtl">
          <DashboardActivityChart />
        </div>
      </section>

      <LatestInstitutionsTable institutions={data.latestInstitutions} />
    </div>
  );
}

function DashboardLoading() {
  return (
    <div className="animate-pulse space-y-6">
      <div>
        <div className="h-8 w-60 rounded-lg bg-gray-200" />
        <div className="mt-3 h-4 w-80 rounded bg-gray-100" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
        {Array.from({
          length: 4,
        }).map((_, index) => (
          <div key={index} className="h-[125px] rounded-[20px] bg-white" />
        ))}
      </div>

      <div className="grid gap-5 md:grid-cols-[330px_minmax(0,1fr)]">
        <div className="h-[360px] rounded-[20px] bg-white" />
        <div className="h-[360px] rounded-[20px] bg-white" />
      </div>

      <div className="h-[360px] rounded-[20px] bg-white" />
    </div>
  );
}
