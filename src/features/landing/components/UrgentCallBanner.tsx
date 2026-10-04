import Link from "next/link";

import { MapPin, Megaphone } from "lucide-react";

import { URGENT_DONATION_CALL } from "../config/landing.config";

import LandingReveal from "./LandingReveal";

interface Props {
  responseHref: string;
}

export default function UrgentCallBanner({ responseHref }: Props) {
  return (
    <LandingReveal>
      <section
        className="
          mx-auto
          max-w-[1360px]
          px-5 py-10
          lg:px-8
        "
      >
        <div
          className="
            rounded-[24px]
            p-5
            sm:p-7
          "
          style={{
            background:
              "linear-gradient(90deg, #e7f5f1 0%, #f4f5ef 48%, #fbecef 100%)",
          }}
        >
          <div
            className="
              flex
              flex-col
              gap-5
              rounded-[16px]
              bg-white
              px-6 py-5
              shadow-[0_5px_18px_rgba(28,50,58,0.04)]
              lg:flex-row
              lg:items-center
              lg:justify-between
            "
          >
            <div
              className="
                flex items-center
                gap-3
                text-[#a71931]
              "
            >
              <Megaphone className="h-6 w-6" strokeWidth={1.8} />

              <strong
                className="
                  text-[15px]
                  font-bold
                "
              >
                نداءات التبرع العاجلة
              </strong>
            </div>

            <div
              className="
                flex flex-1
                items-center
                justify-center
                gap-5
              "
            >
              <span
                className="
                  grid h-[54px]
                  w-[54px]
                  shrink-0
                  place-items-center
                  rounded-full
                  bg-[#a50022]
                  text-sm
                  font-black
                  text-white
                "
                dir="ltr"
              >
                {URGENT_DONATION_CALL.bloodType}
              </span>

              <div>
                <h3
                  className="
                    text-[15px]
                    font-bold
                    text-[#443a38]
                  "
                >
                  {URGENT_DONATION_CALL.title}
                </h3>

                <p
                  className="
                    mt-1.5
                    flex items-center
                    gap-1
                    text-[12px]
                    text-[#887a76]
                  "
                >
                  <MapPin className="h-3.5 w-3.5" />

                  {URGENT_DONATION_CALL.institution}
                </p>
              </div>
            </div>

            <div
              className="
                flex items-center
                gap-8
              "
            >
              <div>
                <span
                  className="
                    block
                    text-[10px]
                    text-[#857875]
                  "
                >
                  الاحتياج
                </span>

                <strong
                  className="
                    mt-1 block
                    text-[15px]
                    font-black
                    text-[#332b29]
                  "
                >
                  {URGENT_DONATION_CALL.units} وحدات
                </strong>
              </div>

              <Link
                href={responseHref}
                className="
                  inline-flex
                  min-h-[46px]
                  items-center
                  rounded-lg
                  bg-[#a50022]
                  px-7
                  text-sm
                  font-bold
                  text-white
                  transition
                  duration-300
                  hover:-translate-y-0.5
                  hover:bg-[#8c001d]
                  hover:shadow-lg
                "
              >
                استجب للنداء
              </Link>
            </div>
          </div>
        </div>
      </section>
    </LandingReveal>
  );
}
