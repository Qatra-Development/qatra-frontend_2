import { Globe2, Mail, MapPin, Phone, Share2 } from "lucide-react";

import QatraBrand from "./QatraBrand";

const quickLinks = [
  {
    href: "#home",
    label: "الرئيسية",
  },
  {
    href: "#how-it-works",
    label: "كيف تعمل قطرة؟",
  },
  {
    href: "#services",
    label: "الخدمات",
  },
  {
    href: "#campaigns",
    label: "حملات التبرع",
  },
];

export default function LandingFooter() {
  return (
    <footer
      className="
        bg-[#eaf2f3]
        pt-20
      "
    >
      <div
        className="
          mx-auto
          max-w-[1360px]
          px-5
          lg:px-8
        "
      >
        <div
          className="
            grid
            gap-12
            md:grid-cols-2
            xl:grid-cols-4
          "
        >
          <div>
            <QatraBrand showEnglish={false} />

            <p
              className="
                mt-6
                max-w-[330px]
                text-[13px]
                leading-[1.9]
                text-[#726662]
              "
            >
              منصة رائدة لربط المتبرعين بالمؤسسات الصحية بسلاسة وموثوقية.
            </p>

            <div
              className="
                mt-7
                flex gap-3
              "
            >
              {[Mail, Globe2, Share2].map((Icon, index) => (
                <span
                  key={index}
                  className="
                      grid h-9 w-9
                      place-items-center
                      rounded-full
                      bg-[#dbe6f3]
                      text-[#617586]
                    "
                >
                  <Icon className="h-4 w-4" />
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3
              className="
                text-[16px]
                font-bold
                text-[#403a38]
              "
            >
              روابط سريعة
            </h3>

            <div
              className="
                mt-6
                space-y-4
              "
            >
              {quickLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="
                      block
                      text-[13px]
                      text-[#786b68]
                      transition
                      hover:text-[#a71931]
                    "
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3
              className="
                text-[16px]
                font-bold
                text-[#403a38]
              "
            >
              المساعدة والدعم
            </h3>

            <div
              className="
                mt-6
                space-y-4
                text-[13px]
                text-[#786b68]
              "
            >
              <span className="block">الأسئلة الشائعة</span>

              <span className="block">شروط الاستخدام</span>

              <span className="block">سياسة الخصوصية</span>
            </div>
          </div>

          <div>
            <h3
              className="
                text-[16px]
                font-bold
                text-[#403a38]
              "
            >
              تواصل معنا
            </h3>

            <div
              className="
                mt-6
                space-y-5
                text-[13px]
                text-[#786b68]
              "
            >
              <div
                className="
                  flex items-center
                  gap-3
                "
              >
                <Mail
                  className="
                    h-4 w-4
                    text-[#657986]
                  "
                />

                <span dir="ltr">info@qatra.com</span>
              </div>

              <div
                className="
                  flex items-center
                  gap-3
                "
              >
                <Phone
                  className="
                    h-4 w-4
                    text-[#657986]
                  "
                />

                <span dir="ltr">+970 123 456 789</span>
              </div>

              <div
                className="
                  flex items-center
                  gap-3
                "
              >
                <MapPin
                  className="
                    h-4 w-4
                    text-[#657986]
                  "
                />

                <span>فلسطين</span>
              </div>
            </div>
          </div>
        </div>

        <div
          className="
            mt-16
            flex
            flex-col
            gap-4
            border-t
            border-[#d9e3e5]
            py-8
            text-[11px]
            text-[#776a67]
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          <span>جميع الحقوق محفوظة لقطرة © ٢٠٢٤</span>

          <span>
            منصة وطنية آمنة تربط بين المتبرعين ومراكز الدم والمؤسسات الصحية
          </span>
        </div>
      </div>
    </footer>
  );
}
