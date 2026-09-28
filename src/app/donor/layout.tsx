import type { ReactNode } from "react";

import DonorSidebar from "@/src/features/donor-dashboard/components/DonorSidebar";

export default function DonorLayout({ children }: { children: ReactNode }) {
  return (
    <div
      dir="rtl"
      className="
        min-h-screen
        bg-[#f7f9fa]
        text-[#26373e]
      "
    >
      <DonorSidebar />

      <main className="lg:mr-[260px]">{children}</main>
    </div>
  );
}
