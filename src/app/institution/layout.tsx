import type { ReactNode } from "react";

import InstitutionSidebar from "@/src/features/institution/shared/components/InstitutionSidebar";
import InstitutionTopbar from "@/src/features/institution/shared/components/InstitutionTopbar";

export default function InstitutionLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div
      dir="rtl"
      className="
        min-h-screen
        bg-[var(--admin-page-bg)]
      "
    >
      <InstitutionSidebar />

      <div className="min-h-screen lg:pr-[248px]">
        <InstitutionTopbar />

        <main
          className="
            px-4
            pb-10 pt-5
            sm:px-6
            xl:px-8
          "
        >
          <div className="mx-auto max-w-[1500px]">{children}</div>
        </main>
      </div>
    </div>
  );
}
