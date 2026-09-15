import DashboardCard from "./DashboardCard";

export default function DashboardActivityChart() {
  return (
    <DashboardCard className="h-full p-5 sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-brand-blue sm:text-xl">
          حركة الطلبات والتبرعات
        </h2>

        <span className="rounded-lg bg-gray-50 px-3 py-1.5 text-xs text-gray-500">
          آخر 7 أيام
        </span>
      </div>

      <div className="flex min-h-[250px] items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50/60 px-6 text-center text-sm text-gray-400">
        لا تتوفر بيانات حركة الطلبات والتبرعات من الـ API حاليًا.
      </div>
    </DashboardCard>
  );
}
