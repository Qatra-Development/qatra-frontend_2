"use client";

import { useCallback, useEffect, useState } from "react";
import { bankApi, type BloodDashboard } from "./lib/api";
import AddBloodUnitDialog from "./components/AddBloodUnitDialog";
import CreateDonationCallDialog from "./components/CreateDonationCallDialog";
import BloodInventory from "./components/BloodInventory";
import BloodRequestsChart from "./components/BloodRequestsChart";
import DashboardUtilities from "./components/DashboardUtilities";
import LatestRequests from "./components/LatestRequests";
import StatsCards from "./components/StatsCards";

export default function HospitalDashboardPage() {
  const [dashboard, setDashboard] = useState<BloodDashboard | null>(null);
  const [error, setError] = useState("");
  const load = useCallback(async () => {
    try {
      setDashboard((await bankApi<BloodDashboard>("/dashboard")).data);
      setError("");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "تعذّر تحميل لوحة التحكم.");
    }
  }, []);
  useEffect(() => { void load(); }, [load]);
  return (
    <div className="mx-auto max-w-[1240px]">
      <section className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-xl font-bold leading-tight text-[#22343c]">
            مرحباً، مركز تبرع الدم
          </h1>
          <p className="mt-1.5 text-xs text-[#8a959a]">
            هذه نظرة سريعة على أداء مركز الدم الخاص بك.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <CreateDonationCallDialog />
          <AddBloodUnitDialog onCreated={load} />
        </div>
      </section>

      {error && <p role="alert" className="mb-3 text-xs text-[#B4233A]">{error}</p>}
      <StatsCards dashboard={dashboard} />

      <section className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <BloodInventory dashboard={dashboard} />
        <BloodRequestsChart dashboard={dashboard} />
      </section>

      <DashboardUtilities dashboard={dashboard} />

      <LatestRequests onChanged={load} />
    </div>
  );
}
