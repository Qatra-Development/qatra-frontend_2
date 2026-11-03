"use client";

import { useState } from "react";
import { Heart } from "lucide-react";

import LandingReveal from "./LandingReveal";

const steps = [
  {
    title: "أنشئ ملفك",
    description: "سجّل بياناتك للبدء في رحلتك.",
    cardTitle: "خطوة أقرب إلى العطاء.",
    cardDescription: "الوجهة الطبية تبحث وتقدم احتياجك للتبرع.",
  },
  {
    title: "اكتشف فرص المشاركة",
    description: "تعرّف على فرص التبرع القريبة منك.",
    cardTitle: "فرص التبرع بانتظارك.",
    cardDescription: "اكتشف الحملات والفرص التي تناسبك.",
  },
  {
    title: "تطوّع مع الجهة الطبية",
    description: "امنح اهتمامك، واترك لهم تنظيم احتياجاتك للتبرع.",
    cardTitle: "خطوة أقرب إلى العطاء.",
    cardDescription: "الوجهة الطبية تبحث وتقدم احتياجك للتبرع.",
  },
];

export default function HowItWorksSection() {
  const [activeStep, setActiveStep] = useState(2);
  const step = steps[activeStep];

  return (
    <section id="how-it-works" className="scroll-mt-[110px] bg-[#f5f9f8] py-16 sm:py-20">
      <LandingReveal>
        <div className="mx-auto grid max-w-[1360px] items-center gap-12 px-5 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:px-8">
          <div className="rounded-[20px] border border-[#e2ece8] bg-white p-6 shadow-[0_22px_55px_rgba(31,66,57,0.06)] sm:p-8">
            <div className="flex items-center justify-between border-b border-[#edf1ef] pb-4 text-[11px] font-semibold text-[#78928b]">
              <span>قطرة / رحلة المتبرع</span>
              <span>0{activeStep + 1} / 03</span>
            </div>

            <div className="mt-5 flex min-h-[136px] flex-col items-center justify-center rounded-xl bg-[#f0f7f4] px-5 py-5 text-center">
              <span className="mb-3 grid h-10 w-10 place-items-center rounded-full bg-[#dceee6] text-[#689b89]">
                <Heart size={17} strokeWidth={2} />
              </span>
              <h3 className="text-[15px] font-bold text-[#263d3a]">{step.cardTitle}</h3>
              <p className="mt-2 text-[10px] text-[#80938d]">{step.cardDescription}</p>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2.5">
              <div className="rounded-lg border border-[#e4ece8] px-3 py-3 text-center text-[10px] font-semibold text-[#7d9b91]">التقدم الطبي</div>
              <div className="rounded-lg border border-[#e4ece8] px-3 py-3 text-center text-[10px] font-semibold text-[#7d9b91]">التنسيق مع الجهة</div>
            </div>
            <div className="mt-4 flex items-center justify-between text-[9px] text-[#a0b1ac]">
              <span className="flex gap-1"><i className="h-0.5 w-3 bg-[#6d9d8c]"/><i className="h-0.5 w-3 bg-[#e7eeeb]"/><i className="h-0.5 w-3 bg-[#e7eeeb]"/></span>
              <span>متابعة تجربتك ليست تنجزك سريعًا.</span>
            </div>
          </div>

          <div dir="rtl" className="text-right">
            <div className="mb-4 flex items-center gap-2 text-[11px] font-semibold text-[#73958b]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#398c76]" /> رحلتك مع قطرة
            </div>
            <h2 className="text-[30px] font-black leading-[1.45] text-[#1b2932] sm:text-[36px]">
              ثلاث خطوات،<br />وأثر يبدأ بك.
            </h2>
            <p className="mt-3 text-[12px] text-[#76838a]">اختر خطوة لاستكشاف الرحلة، من إنشاء حسابك إلى التنسيق مع الجهة الطبية.</p>

            <div className="mt-7 space-y-2">
              {steps.map((item, index) => {
                const active = index === activeStep;
                return (
                  <button
                    key={item.title}
                    type="button"
                    onClick={() => setActiveStep(index)}
                    aria-pressed={active}
                    className={`flex w-full items-center gap-4 rounded-xl border px-4 py-3 text-right transition-colors ${active ? "border-[#dce8e3] bg-white shadow-[0_5px_15px_rgba(30,60,50,0.025)]" : "border-transparent bg-transparent hover:bg-white/60"}`}
                  >
                    <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border text-[10px] ${active ? "border-[#398c76] bg-[#398c76] font-bold text-white" : "border-[#d9e5e0] text-[#77938a]"}`}>0{index + 1}</span>
                    <span>
                      <span className={`block text-[12px] ${active ? "font-bold text-[#263b3a]" : "font-medium text-[#688087]"}`}>{item.title}</span>
                      {active && <span className="mt-1 block text-[10px] text-[#879399]">{item.description}</span>}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </LandingReveal>
    </section>
  );
}
