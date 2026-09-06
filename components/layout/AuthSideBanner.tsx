function CheckMark() {
  return (
    <svg
      aria-hidden="true"
      className="w-5 h-5 text-brand-red opacity-70 shrink-0 ml-3"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
    >
      <path d="m5 13 4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  );
}

export default function AuthSideBanner() {
  return (
    <div className="order-1 lg:order-1 lg:translate-x-[50px] pr-0 lg:pr-12 flex flex-col justify-start items-start">
      {/* Eyebrow */}
      <p
        className="text-brand-gray mb-6 tracking-wide text-xs font-bold uppercase"
        style={{ fontFamily: "Tajawal, sans-serif", letterSpacing: "0.5px" }}
      >
        انضم إلى قطرة
      </p>

      {/* Headline */}
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight sm:leading-tight mb-4 sm:mb-6 text-right text-brand-blue">
        <span className="text-brand-red">تبرعك</span> قد يمنح
        <br />
        شخصًا فرصة
        <br />
        جديدة للحياة.
      </h1>

      {/* Intro text */}
      <p
        className="text-brand-gray text-sm sm:text-base mb-6 sm:mb-10 max-w-md opacity-80 text-right"
        style={{ fontFamily: "Tajawal, sans-serif", lineHeight: "28px" }}
      >
        سجل بياناتك لتصلك النداءات المتوافقة مع فصيلتك وموقعك.
      </p>

      {/* Benefits list */}
      <ul className="space-y-3 sm:space-y-4">
        {["إشعارات فورية وذكية", "بياناتك محمية وآمنة", "متابعة واضحة لكل العمليات"].map(
          (item) => (
            <li
              key={item}
              className="flex items-center text-xs sm:text-sm font-medium text-brand-blue"
              style={{ fontFamily: "Tajawal, sans-serif" }}
            >
              <CheckMark />
              {item}
            </li>
          )
        )}
      </ul>
    </div>
  );
}
