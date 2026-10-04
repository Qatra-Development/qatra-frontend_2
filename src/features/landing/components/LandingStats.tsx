import { Building2, Droplet, Handshake, UsersRound } from "lucide-react";

import { LANDING_STATS } from "../config/landing.config";

import LandingReveal from "./LandingReveal";
import StatCounter from "./StatCounter";

const icons = {
  donors: UsersRound,
  institutions: Building2,
  requests: Droplet,
  donations: Handshake,
};

export default function LandingStats() {
  return (
    <LandingReveal>
      <section
        className="
          mx-auto
          grid
          max-w-[1360px]
          grid-cols-2
          gap-4
          px-5 pb-24
          md:grid-cols-4
          lg:px-8
        "
      >
        {LANDING_STATS.map((item) => {
          const Icon = icons[item.type];

          return (
            <article
              key={item.type}
              className="
                  flex
                  min-h-[145px]
                  flex-col
                  items-center
                  justify-center
                  rounded-[20px]
                  bg-white
                  px-5 py-7
                  text-center
                  shadow-[0_12px_30px_rgba(25,42,48,0.035)]
                  transition
                  duration-300
                  hover:-translate-y-1
                  hover:shadow-[0_16px_34px_rgba(25,42,48,0.06)]
                "
            >
              <Icon
                className="
                    h-6 w-6
                    text-[#a71931]
                  "
                strokeWidth={1.9}
              />

              <strong
                className="
                    mt-4
                    text-[18px]
                    font-black
                    text-[#191919]
                  "
                dir="ltr"
              >
                <StatCounter target={item.value} />
              </strong>

              <span
                className="
                    mt-2
                    text-sm
                    text-[#71635f]
                  "
              >
                {item.label}
              </span>
            </article>
          );
        })}
      </section>
    </LandingReveal>
  );
}
