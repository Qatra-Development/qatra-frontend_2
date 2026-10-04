import { BellRing, Boxes, CirclePlus, Droplet } from "lucide-react";

import LandingReveal from "./LandingReveal";

const services = [
  {
    title: "التبرع بالدم",
    description: "سجل كمتبرع دائم وكن مستعدًا لتلبية النداء في حالات الطوارئ.",
    icon: Droplet,
    accent: "bg-[#fde9ec] text-[#a71931]",
  },
  {
    title: "طلب الدم",
    description: "للمؤسسات والأفراد لرفع طلبات عاجلة للدم بضمان معتمد.",
    icon: CirclePlus,
    accent: "bg-[#fde9ec] text-[#a71931]",
  },
  {
    title: "إدارة بنك الدم",
    description: "أدوات متقدمة للمستشفيات لمتابعة المخزون وتنظيم العمليات.",
    icon: Boxes,
    accent: "bg-[#e7eef6] text-[#617181]",
  },
  {
    title: "نداءات التبرع",
    description: "إشعارات فورية للمتبرعين المتوافقين في النطاق الجغرافي.",
    icon: BellRing,
    accent: "bg-[#fde9ec] text-[#a71931]",
  },
];

export default function ServicesSection() {
  return (
    <section
      id="services"
      className="
        scroll-mt-[110px]
        py-24
      "
    >
      <LandingReveal>
        <div
          className="
            mx-auto
            max-w-[1360px]
            px-5
            lg:px-8
          "
        >
          <div className="text-center">
            <h2
              className="
                text-[34px]
                font-black
                text-[#191919]
                sm:text-[40px]
              "
            >
              خدمات قطرة
            </h2>

            <p
              className="
                mt-5
                text-[14px]
                text-[#766967]
              "
            >
              حلول رقمية لتنظيم عمليات التبرع بالدم وإدارة الاحتياجات.
            </p>
          </div>

          <div
            className="
              mt-16
              grid
              gap-6
              md:grid-cols-2
              xl:grid-cols-4
            "
          >
            {services.map((service) => {
              const Icon = service.icon;

              return (
                <article
                  key={service.title}
                  className="
                      min-h-[235px]
                      rounded-[20px]
                      bg-white
                      px-7 py-9
                      text-center
                      shadow-[0_12px_30px_rgba(25,42,48,0.035)]
                      transition
                      duration-300
                      hover:-translate-y-1.5
                      hover:shadow-[0_18px_38px_rgba(25,42,48,0.07)]
                    "
                >
                  <span
                    className={`
                        mx-auto
                        grid h-[62px]
                        w-[62px]
                        place-items-center
                        rounded-full
                        ${service.accent}
                      `}
                  >
                    <Icon className="h-7 w-7" strokeWidth={1.8} />
                  </span>

                  <h3
                    className="
                        mt-6
                        text-[16px]
                        font-bold
                        text-[#3f3735]
                      "
                  >
                    {service.title}
                  </h3>

                  <p
                    className="
                        mt-3
                        text-[13px]
                        leading-[1.9]
                        text-[#7c6f6c]
                      "
                  >
                    {service.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </LandingReveal>
    </section>
  );
}
