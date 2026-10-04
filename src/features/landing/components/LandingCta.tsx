import Link from "next/link";

import { ArrowLeft } from "lucide-react";

import { LANDING_ROUTES } from "../config/landing.config";

import LandingReveal from "./LandingReveal";

export default function LandingCta() {
  return (
    <LandingReveal>
      <section
        className="
          mx-auto
          max-w-[1320px]
          px-5 pb-28
          pt-10
        "
      >
        <div
          className="
            flex
            min-h-[250px]
            flex-col
            items-start
            justify-between
            gap-10
            rounded-[28px]
            px-8 py-10
            text-white
            shadow-[0_18px_40px_rgba(158,16,44,0.14)]
            sm:px-12
            lg:flex-row
            lg:items-center
          "
          style={{
            background:
              "linear-gradient(105deg, #821126 0%, #b41e3a 48%, #dd4961 100%)",
          }}
        >
          <div>
            <span
              className="
                text-[12px]
                font-bold
                text-white/75
              "
            >
              ابدأ اليوم
            </span>

            <h2
              className="
                mt-3
                text-[31px]
                font-black
                sm:text-[40px]
              "
            >
              كن جزءًا من إنقاذ حياة
            </h2>

            <p
              className="
                mt-4
                text-[14px]
                text-white/70
              "
            >
              انضم إلى مجتمع المتبرعين وساهم في جعل الدم متوفرًا عند الحاجة.
            </p>
          </div>

          <Link
            href={LANDING_ROUTES.register}
            className="
              inline-flex
              min-h-[56px]
              items-center
              gap-3
              rounded-xl
              bg-white
              px-8
              text-[14px]
              font-black
              text-[#b01c38]
              shadow-lg
              transition
              duration-300
              hover:-translate-y-1
              hover:shadow-xl
            "
          >
            إنشاء حساب مجاني
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </LandingReveal>
  );
}
