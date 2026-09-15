import { Plus } from "lucide-react";
import BloodInventory from "./components/BloodInventory";
import BloodRequestsChart from "./components/BloodRequestsChart";
import LatestRequests from "./components/LatestRequests";
import StatsCards from "./components/StatsCards";

export default function HospitalDashboardPage() {
  return (
    <div className="mx-auto max-w-[1240px]">
      <section className="mb-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-xl font-bold leading-tight text-[#22343c]">
            مرحباً، مركز الدم
          </h1>
          <p className="mt-1.5 text-xs text-[#8a959a]">
            هذه نظرة سريعة على البيانات التي أضيفت إلى النظام.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button className="flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-[#35464d] shadow-sm transition hover:bg-slate-50">
            <Plus className="h-4 w-4" strokeWidth={1.8} />
            نداء تبرع
          </button>
          <button className="flex items-center gap-1.5 rounded-md bg-[#B4233A] px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-[#991F32]">
            <Plus className="h-4 w-4" strokeWidth={1.8} />
            إضافة وحدة
          </button>
        </div>
      </section>

      <StatsCards />

      <section className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-[1.08fr_0.92fr]">
        <BloodInventory />
        <BloodRequestsChart />
      </section>

      <LatestRequests />
    </div>
  );
}
