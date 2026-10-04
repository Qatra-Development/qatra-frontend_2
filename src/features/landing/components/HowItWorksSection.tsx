import { Heart, RefreshCcw, Search, UserPlus } from "lucide-react";

import LandingReveal from "./LandingReveal";

const steps = [
  {
    number: "01",
    title: "أنشئ حسابك",
    description: "سجل كمتبرع أو مؤسسة صحية بسهولة.",
    icon: UserPlus,
    numberClass: "bg-[#ffdadd] text-[#a71931]",
  },
  {
    number: "02",
    title: "حدد احتياجك أو تبرعك",
    description: "ابحث عن الفصيلة المطلوبة أو قدّم طلب تبرع.",
    icon: Search,
    numberClass: "bg-[#e4edf7] text-[#637486]",
  },
  {
    number: "03",
    title: "تواصل مع الجهة المناسبة",
    description: "نربطك تلقائيًا بالطرف الآخر بكل سرية.",
    icon: RefreshCcw,
    numberClass: "bg-[#e3ecf7] text-[#637486]",
  },
  {
    number: "04",
    title: "ساهم في إنقاذ حياة",
    description: "كل قطرة تبرع تصنع فارقًا حقيقيًا.",
    icon: Heart,
    numberClass: "bg-[#a50022] text-white",
  },
];

export default function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
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
              كيف تعمل قطرة؟
            </h2>

            <p
              className="
                mt-5
                text-[14px]
                text-[#766967]
              "
            >
              خطوات بسيطة تربط احتياج الدم بالجهة المناسبة.
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
            {steps.map((step) => {
              const Icon = step.icon;

              return (
                <article
                  key={step.number}
                  className="
                      relative
                      min-h-[230px]
                      rounded-[20px]
                      bg-white
                      px-7 py-12
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
                        absolute
                        left-1/2 top-0
                        grid h-[48px]
                        w-[48px]
                        -translate-x-1/2
                        -translate-y-1/2
                        place-items-center
                        rounded-full
                        border-[4px]
                        border-[#f7f8fa]
                        text-sm
                        font-black
                        ${step.numberClass}
                      `}
                  >
                    {step.number}
                  </span>

                  <Icon
                    className="
                        mx-auto
                        h-8 w-8
                        text-[#a50022]
                      "
                    strokeWidth={1.8}
                  />

                  <h3
                    className="
                        mt-7
                        text-[16px]
                        font-bold
                        text-[#3e3735]
                      "
                  >
                    {step.title}
                  </h3>

                  <p
                    className="
                        mt-4
                        text-[13px]
                        leading-[1.9]
                        text-[#80716e]
                      "
                  >
                    {step.description}
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
