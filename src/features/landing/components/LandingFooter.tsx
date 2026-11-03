import QatraBrand from "./QatraBrand";

const links = [
  { href: "#services", label: "خدمات المنصة" },
  { href: "#how-it-works", label: "كيف نعمل" },
  { href: "#campaigns", label: "الأسئلة الشائعة" },
];

export default function LandingFooter() {
  return (
    <footer dir="rtl" className="bg-[#f8fbfb] text-[#87969b]">
      <div className="mx-auto max-w-[1360px] px-5 lg:px-10">
        <div className="grid min-h-[87px] items-center gap-5 border-b border-[#e1e9e9] py-5 md:grid-cols-[1fr_1.2fr_1fr]">
          <div className="flex items-center justify-start">
            <QatraBrand showEnglish={false} className="gap-1.5 [&_img]:h-[38px] [&_img]:w-[28px] [&_strong]:text-[23px] [&_strong]:text-[#b0183c]" />
          </div>

          <p className="text-center text-[9px] leading-[1.8] text-[#89979c]">
            نصل العطاء بالحياة.<br />منصة التنسيق لتبرع بالدم.
          </p>

          <nav aria-label="روابط التذييل" className="flex items-center justify-start gap-5 text-[8px] sm:gap-7">
            {links.map((link) => (
              <a key={link.href} href={link.href} className="whitespace-nowrap transition-colors hover:text-[#ad1b3b]">
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="flex min-h-[58px] flex-col-reverse items-start justify-between gap-3 py-3 text-[8px] text-[#9aa7ab] sm:flex-row sm:items-center">
          <span>© 2026 حقوق كل قطرة محفوظة.</span>
          <a href="#home" className="rounded-full border border-[#dce8e4] px-3 py-1.5 text-[8px] text-[#81968f] transition-colors hover:border-[#a7c5ba] hover:text-[#527d6d]">
            سياسة الخصوصية · الشروط
          </a>
        </div>
      </div>
    </footer>
  );
}
