import AddBloodUnitDialog from "./components/AddBloodUnitDialog";
import CreateDonationCallDialog from "./components/CreateDonationCallDialog";
import BloodInventory from "./components/BloodInventory";
import BloodRequestsChart from "./components/BloodRequestsChart";
import DashboardUtilities from "./components/DashboardUtilities";
import LatestRequests from "./components/LatestRequests";
import StatsCards from "./components/StatsCards";

export default function HospitalDashboardPage() {
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
          <AddBloodUnitDialog />
        </div>
      </section>

      <StatsCards />

      <section className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <BloodInventory />
        <BloodRequestsChart />
      </section>

      <DashboardUtilities />

      <LatestRequests />
    </div>
  );
}
