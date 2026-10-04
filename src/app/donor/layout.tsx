import type { ReactNode } from "react";

import DonorSidebar from "@/src/features/donor-dashboard/components/DonorSidebar";
import MobileNavigation from "@/src/components/layout/MobileNavigation";

export default function DonorLayout({ children }: { children: ReactNode }) {
  return (
    <div
      dir="rtl"
      className="
        min-h-screen overflow-x-hidden
        bg-[#f7f9fa]
        text-[#26373e]
      "
    >
      <DonorSidebar />
      <MobileNavigation><DonorSidebar /></MobileNavigation>

      <main className="lg:mr-[260px]">{children}</main>
    </div>
  );
}
