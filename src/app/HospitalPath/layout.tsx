import React from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import MobileNavigation from "@/src/components/layout/MobileNavigation";

export const metadata = {
  title: "قطرة - طلبات الاعتماد",
  description: "لوحة متابعة طلبات اعتماد المؤسسات والمستشفيات",
};

export default function HospitalPathLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      dir="rtl"
      className="bg-[#f0f4f4] text-slate-700 min-h-screen antialiased flex flex-col justify-between font-sans"
    >
      <div className="flex-1 flex w-full max-w-[1500px] mx-auto min-h-screen bg-[#f3f6f7] shadow-xl overflow-hidden border border-slate-200/80">
        {/* الشريط الجانبي */}
        <Sidebar />
        <MobileNavigation><Sidebar /></MobileNavigation>

        {/* مساحة المحتوى الرئيسية مع الشريط العلوي */}
        <main className="flex-1 flex flex-col min-w-0 bg-[#f4f7f7] p-5 lg:p-7 overflow-y-auto">
          <Header />
          {children}
        </main>
      </div>
    </div>
  );
}
