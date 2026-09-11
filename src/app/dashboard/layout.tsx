import AdminSidebar from "@/src/features/admin/shared/components/AdminSidebar";
import AdminTopbar from "@/src/features/admin/shared/components/AdminTopbar";
import { getCurrentAccountType } from "@/src/lib/auth/server-session";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

interface AdminDashboardLayoutProps {
  children: ReactNode;
}

export default async function AdminDashboardLayout({
  children,
}: AdminDashboardLayoutProps) {
  let accountType: string | null;

  try {
    accountType = await getCurrentAccountType();
  } catch {
    redirect("/login");
  }

  if (!accountType) {
    redirect("/login");
  }

  if (accountType !== "health_authority_admin") {
    redirect("/");
  }

  return (
    <div dir="rtl" className="min-h-screen bg-[#f7f8fa]">
      <AdminSidebar />

      <div className="min-h-screen lg:pr-[248px]">
        <AdminTopbar />

        <main className="px-4 pb-10 pt-5 sm:px-6 xl:px-8">
          <div className="mx-auto max-w-[1500px]">{children}</div>
        </main>
      </div>
    </div>
  );
}
