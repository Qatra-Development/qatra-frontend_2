import { ListChecks, Network, TrendingUp, Zap } from "lucide-react";

import LandingReveal from "./LandingReveal";

const features = [
  {
    title: "سرعة الوصول",
    description: "تقليل وقت الاستجابة للحالات الطارئة من خلال إشعارات فورية.",
    icon: Zap,
  },
  {
    title: "تنظيم طلبات الدم",
    description: "إدارة منظمة لجميع طلبات وعمليات التبرع في مكان واحد.",
    icon: ListChecks,
  },
  {
    title: "متابعة المخزون",
    description: "لوحات تحكم ذكية للمستشفيات لمراقبة مخزون الدم وتوقع النواقص.",
    icon: TrendingUp,
  },
  {
    title: "ربط الجهات",
    description: "منظومة متكاملة تربط المتبرعين بالبنوك والمستشفيات.",
    icon: Network,
  },
];

export default function WhyQatraSection() {
  return (
    <section
      id="about"
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
          <h2
            className="
              text-center
              text-[35px]
              font-black
              text-[#191919]
              sm:text-[40px]
            "
          >
            لماذا قطرة؟
          </h2>

          <div
            className="
              mt-16
              grid gap-10
              md:grid-cols-2
              xl:grid-cols-4
            "
          >
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <article
                  key={feature.title}
                  className="
                      text-center
                    "
                >
                  <span
                    className="
                        mx-auto
                        grid h-[62px]
                        w-[62px]
                        place-items-center
                        rounded-full
                        border
                        border-[#e5dcda]
                        bg-[#f5eded]
                        text-[#66757c]
                        transition
                        duration-300
                        hover:-translate-y-1
                        hover:bg-[#f9e8eb]
                        hover:text-[#a71931]
                      "
                  >
                    <Icon className="h-7 w-7" strokeWidth={1.8} />
                  </span>

                  <h3
                    className="
                        mt-6
                        text-[15px]
                        font-bold
                        text-[#403836]
                      "
                  >
                    {feature.title}
                  </h3>

                  <p
                    className="
                        mx-auto mt-3
                        max-w-[255px]
                        text-[12px]
                        leading-[1.9]
                        text-[#786b68]
                      "
                  >
                    {feature.description}
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
