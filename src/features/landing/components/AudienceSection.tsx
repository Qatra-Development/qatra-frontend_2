import Link from "next/link";

import { Building2, UserRound } from "lucide-react";

import { LANDING_ROUTES } from "../config/landing.config";

import LandingReveal from "./LandingReveal";

export default function AudienceSection() {
  return (
    <section className="py-24">
      <LandingReveal>
        <div
          className="
            mx-auto
            max-w-[1050px]
            px-5
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
            لمن صممت قطرة؟
          </h2>

          <div
            className="
              mt-14
              grid gap-7
              md:grid-cols-2
              direction-reverse
            "
          >
            <article
              className="
                min-h-[310px]
                rounded-[24px]
                bg-white
                px-9 py-10
                text-center
                shadow-[0_14px_32px_rgba(30,45,50,0.045)]
              "
            >
              <span
                className="
                  mx-auto
                  grid h-[62px]
                  w-[62px]
                  place-items-center
                  rounded-xl
                  bg-[#e7eef7]
                  text-[#647585]
                "
              >
                <UserRound className="h-7 w-7" />
              </span>

              <h3
                className="
                  mt-7
                  text-[17px]
                  font-bold
                  text-[#443b38]
                "
              >
                المتبرعون
              </h3>

              <p
                className="
                  mx-auto mt-4
                  max-w-[400px]
                  text-[13px]
                  leading-[1.9]
                  text-[#786b68]
                "
              >
                الأفراد الراغبون في التبرع بالدم بشكل دوري أو في الحالات
                الطارئة.
              </p>

              <Link
                href={LANDING_ROUTES.donorRegister}
                className="
                  mt-8
                  inline-flex
                  min-h-[48px]
                  w-full
                  items-center
                  justify-center
                  rounded-lg
                  border
                  border-[#e7c3c8]
                  bg-white
                  text-sm
                  font-bold
                  text-[#647585]
                  transition
                  hover:-translate-y-0.5
                  hover:border-[#a71931]/40
                  hover:text-[#a71931]
                "
              >
                انضم كمتبرع
              </Link>
            </article>

            <article
              className="
                relative
                min-h-[310px]
                rounded-[24px]
                border-2
                border-[#a71931]
                bg-white
                px-9 py-10
                text-center
                shadow-[0_14px_32px_rgba(30,45,50,0.04)]
              "
            >
              <span
                className="
                  absolute
                  left-1/2 top-0
                  -translate-x-1/2
                  -translate-y-1/2
                  rounded-full
                  bg-[#b6223b]
                  px-5 py-1.5
                  text-[11px]
                  font-bold
                  text-white
                "
              >
                الأكثر استخداماً
              </span>

              <span
                className="
                  mx-auto
                  grid h-[62px]
                  w-[62px]
                  place-items-center
                  rounded-xl
                  bg-[#fde8eb]
                  text-[#a71931]
                "
              >
                <Building2 className="h-7 w-7" />
              </span>

              <h3
                className="
                  mt-7
                  text-[17px]
                  font-bold
                  text-[#443b38]
                "
              >
                المؤسسات الصحية وبنوك الدم
              </h3>

              <p
                className="
                  mx-auto mt-4
                  max-w-[400px]
                  text-[13px]
                  leading-[1.9]
                  text-[#786b68]
                "
              >
                المستشفيات والعيادات التي تحتاج لتأمين وحدات الدم لمرضاها، وبنوك
                الدم لجمع وتخزين وتوزيع وحدات الدم.
              </p>

              <Link
                href={LANDING_ROUTES.institutionRegister}
                className="
                  mt-8
                  inline-flex
                  min-h-[48px]
                  w-full
                  items-center
                  justify-center
                  rounded-lg
                  bg-[#b71f3c]
                  text-sm
                  font-bold
                  text-white
                  transition
                  hover:-translate-y-0.5
                  hover:bg-[#9c1731]
                "
              >
                سجل مؤسستك
              </Link>
            </article>
          </div>
        </div>
      </LandingReveal>
    </section>
  );
}
