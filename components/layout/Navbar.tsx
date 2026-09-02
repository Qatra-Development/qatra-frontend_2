import Link from "next/link";
import Image from "next/image";

function QatraLogo() {
  return (
    <div className="flex items-center gap-2 ">
      <Image
        src="/img/logo.png"
        alt="شعار قطرة"
        width={30}
        height={45}
        className="shrink-0"
        priority
        
      />
      <span
        className="font-bold text-xl"
        style={{
          fontFamily: "Tajawal, sans-serif",
          background: "linear-gradient(263.35deg, #9e1b32 61.55%, #bb5f70 96.08%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        قطرة
      </span>
    </div>
  );
}

export default function Navbar() {
  return (
    <header className="w-full py-6 px-8 flex justify-between items-center absolute top-0 left-0 right-0 z-10 bg-transparent">
      {/* Right: Logo + Back link */}
      <nav className="flex items-center gap-3" aria-label="التنقل الرئيسي">
        <QatraLogo />
        <span
          className="text-brand-red font-bold text-2xl"
          style={{ fontFamily: "Tajawal, sans-serif" }}
          aria-hidden="true"
        >
          →
        </span>
        <Link
          href="/"
          className="text-brand-gray hover:text-brand-red transition-colors text-xl font-bold"
          style={{ fontFamily: "Tajawal, sans-serif" }}
        >
          العودة للرئيسية
        </Link>
      </nav>

      {/* Left: Login */}
      <div className="flex items-center gap-2">
        <span className="text-brand-gray text-sm m-5">لديك حساب بالفعل؟</span>
        <Link
          href="/logIn"
          className="text-brand-red font-semibold text-sm hover:underline"
        >
          تسجيل الدخول
        </Link>
      </div>
    </header>
  );
}
