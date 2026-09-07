import AuthSideBanner from "@/components/layout/AuthSideBanner";
import Navbar from "@/components/layout/Navbar";
import { InstitutionRegistrationProvider } from "@/src/features/auth/client/institution-registration-context";

export default function AuthLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="flex flex-col relative overflow-hidden min-h-screen">
      {/* Background blobs */}
      <div
        className="absolute pointer-events-none z-[-10] rounded-full"
        style={{
          width: "1048px",
          height: "1028px",
          left: "-208px",
          bottom: "-400px",
          background: "rgba(241, 222, 223, 0.5)",
          mixBlendMode: "multiply",
          filter: "blur(40px)",
        }}
      />
      <div
        className="absolute pointer-events-none z-[-10] rounded-full"
        style={{
          width: "1048px",
          height: "1028px",
          right: "-250px",
          top: "-300px",
          background: "rgba(255, 220, 218, 0.5)",
          mixBlendMode: "multiply",
          filter: "blur(35px)",
        }}
      />

      <Navbar />

      {/* Content grid */}
      <div className="flex-grow flex items-center justify-center min-h-screen px-3.5 sm:px-6 md:px-8 pt-20 sm:pt-24 pb-8 sm:pb-12">
        <div className="w-full max-w-[1440px] grid grid-cols-1 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] gap-8 lg:gap-12 items-start relative z-10">
          <div className="hidden lg:block min-w-0 pt-4 lg:pt-6">
            <AuthSideBanner />
          </div>
          <section className="w-full min-w-0 flex justify-center">
            <InstitutionRegistrationProvider>{children}</InstitutionRegistrationProvider>
          </section>
        </div>
      </div>
    </main>
  );
}
