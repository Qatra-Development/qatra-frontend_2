import type { ReactNode } from "react";

import DonorSidebar from "@/src/features/donor-dashboard/components/DonorSidebar";
import DonorMobileNavigation from "@/src/features/donor-dashboard/components/DonorMobileNavigation";

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
      <DonorMobileNavigation>
        <DonorSidebar />
      </DonorMobileNavigation>

      <main className="lg:mr-[260px]">{children}</main>
    </div>
  );
}
