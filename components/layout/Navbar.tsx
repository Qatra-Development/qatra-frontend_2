import Link from "next/link";
import Image from "next/image";

function QatraLogo() {
  return (
    <Link href="/" className="flex items-center gap-1.5 sm:gap-2 shrink-0">
      <Image
        src="/img/logo.png"
        alt="شعار قطرة"
        width={26}
        height={39}
        className="shrink-0 w-6 h-auto sm:w-[30px]"
        priority
      />
      <span
        className="font-bold text-lg sm:text-xl tracking-tight"
        style={{
          fontFamily: "Tajawal, sans-serif",
          background: "linear-gradient(263.35deg, #9e1b32 61.55%, #bb5f70 96.08%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        قطرة
      </span>
    </Link>
  );
}

export default function Navbar() {
  return (
    <header className="w-full py-4 sm:py-6 px-4 sm:px-8 flex justify-between items-center absolute top-0 left-0 right-0 z-20 bg-transparent">
      {/* Right: Logo + Back link */}
      <nav className="flex items-center gap-2 sm:gap-3" aria-label="التنقل الرئيسي">
        <QatraLogo />
        <span
          className="text-brand-red font-bold text-base sm:text-2xl select-none"
          style={{ fontFamily: "Tajawal, sans-serif" }}
          aria-hidden="true"
        >
          →
        </span>
        <Link
          href="/"
          className="text-brand-gray hover:text-brand-red transition-colors text-sm sm:text-lg md:text-xl font-bold whitespace-nowrap"
          style={{ fontFamily: "Tajawal, sans-serif" }}
        >
          <span className="hidden xs:inline">العودة للرئيسية</span>
          <span className="xs:hidden">الرئيسية</span>
        </Link>
      </nav>

      {/* Left: Login */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        <span className="text-brand-gray text-xs sm:text-sm hidden sm:inline">
          لديك حساب بالفعل؟
        </span>
        <Link
          href="/login"
          className="text-brand-red font-semibold text-xs sm:text-sm hover:underline whitespace-nowrap"
        >
          تسجيل الدخول
        </Link>
      </div>
    </header>
  );
}
