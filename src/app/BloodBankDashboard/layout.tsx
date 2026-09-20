import type { Metadata } from "next";
import type { ReactNode } from "react";
import DashboardHeader from "./components/DashboardHeader";
import DashboardSidebar from "./components/DashboardSidebar";

export const metadata: Metadata = {
  title: "لوحة التحكم | قطرة",
  description: "لوحة إدارة طلبات الدم ومخزون المستشفى",
};

export default function HospitalDashboardLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <div dir="rtl" className="min-h-screen bg-[#edf4f3] text-[#24343b]">
      <div className="mx-auto flex min-h-screen w-full max-w-[1500px] bg-[#f7f9fa] shadow-sm">
        <DashboardSidebar />
        <div className="min-w-0 flex-1">
          <DashboardHeader />
          <main className="px-5 pb-8 lg:px-7">{children}</main>
        </div>
      </div>
    </div>
  );
}
