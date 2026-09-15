import { Plus } from "lucide-react";
import BloodInventory from "../components/BloodInventory";
import LatestRequests from "../components/LatestRequests";

export default function HospitalInventoryPage() {
  return (
    <div className="mx-auto max-w-[1240px]">
      <div className="mb-5 text-[10px] text-[#8a959a]">
        <span>الرئيسية</span>
        <span className="mx-2 text-[#b6bec2]">‹</span>
        <span className="font-medium text-[#4f6067]">إدارة المخزون</span>
      </div>

      <section className="mb-5 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#22343c]">مخزون الدم</h1>
          <p className="mt-2 text-xs text-[#8a959a]">
            هذه نظرة سريعة على الوحدات التي أضيفت إلى النظام
          </p>
        </div>

        <button
          type="button"
          className="flex h-10 shrink-0 items-center gap-2 rounded-md bg-[#a61f36] px-4 text-xs font-bold text-white shadow-sm transition hover:bg-[#8f1b2f]"
        >
          <Plus className="h-4 w-4" strokeWidth={2} />
          إضافة وحدة جديدة
        </button>
      </section>

      <BloodInventory />
      <LatestRequests />
    </div>
  );
}
