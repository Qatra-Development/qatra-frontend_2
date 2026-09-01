import AuthSideBanner from "@/components/layout/AuthSideBanner";
import Navbar from "@/components/layout/Navbar";

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
          bottom: "-205px",
          background: "rgb(241, 222, 223)",
          mixBlendMode: "multiply",
          filter: "blur(60px)",
        }}
      />
      <div
        className="absolute pointer-events-none z-[-10] rounded-full"
        style={{
          width: "1048px",
          height: "1028px",
          right: "-250px",
          top: "-150px",
          background: "rgb(255, 220, 218)",
          mixBlendMode: "multiply",
          filter: "blur(140px)",
        }}
      />

      <Navbar />

      {/* Content grid */}
      <div className="flex-grow flex items-center justify-center min-h-screen px-4 pt-24">
        <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          <AuthSideBanner />
          <section className="order-2 lg:order-2">{children}</section>
        </div>
      </div>
    </main>
  );
}
