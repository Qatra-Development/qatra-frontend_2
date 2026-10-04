import Link from "next/link";

import { ArrowLeft, Calendar, MapPin } from "lucide-react";

import { LANDING_ROUTES } from "../config/landing.config";

import type { PublicCampaign } from "../types/public-campaign.types";

import LandingReveal from "./LandingReveal";

interface Props {
  campaigns: PublicCampaign[];
  error: string | null;
}

function campaignDateParts(value: string) {
  const date = new Date(`${value}T12:00:00`);

  if (Number.isNaN(date.getTime())) {
    return {
      day: "--",
      month: "",
    };
  }

  return {
    day: new Intl.DateTimeFormat("en", {
      day: "2-digit",
    }).format(date),

    month: new Intl.DateTimeFormat("ar", {
      month: "long",
    }).format(date),
  };
}

function campaignLocation(campaign: PublicCampaign) {
  if (campaign.area && campaign.governorate) {
    return `${campaign.area}، ${campaign.governorate}`;
  }

  return campaign.location || campaign.governorate;
}

export default function CampaignsSection({ campaigns, error }: Props) {
  return (
    <section
      id="campaigns"
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
          <div
            className="
              flex
              flex-col
              gap-5
              sm:flex-row
              sm:items-end
              sm:justify-between
            "
          >
            <div>
              <h2
                className="
                  text-[27px]
                  font-black
                  text-[#191919]
                  sm:text-[32px]
                "
              >
                حملات التبرع بالدم
              </h2>

              <p
                className="
                  mt-3
                  text-[13px]
                  text-[#786b68]
                "
              >
                ساهم في تلبية احتياجات الدم وكن جزءًا من حملات التبرع.
              </p>
            </div>

            <Link
              href={LANDING_ROUTES.campaigns}
              className="
                inline-flex
                items-center
                gap-2
                self-start
                text-[13px]
                font-medium
                text-[#60717a]
                transition
                hover:text-[#991b30]
                sm:self-auto
              "
            >
              عرض جميع الحملات
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </div>

          {error && campaigns.length === 0 ? (
            <div
              className="
                mt-10
                rounded-[22px]
                bg-white
                px-6 py-12
                text-center
                text-sm
                text-[#7d8a90]
              "
            >
              {error}
            </div>
          ) : (
            <div
              dir="rtl"
              className="
                mt-10
                grid
                grid-cols-1
                gap-6
                md:grid-cols-2
                lg:grid-cols-3
              "
            >
              {campaigns.map((campaign) => (
                <CampaignCard key={campaign.id} campaign={campaign} />
              ))}
            </div>
          )}
        </div>
      </LandingReveal>
    </section>
  );
}

function CampaignCard({ campaign }: { campaign: PublicCampaign }) {
  const { day, month } = campaignDateParts(campaign.start_date);

  const active = campaign.status === "active";

  const allBloodTypes = campaign.blood_types.length >= 8;

  return (
    <article
      className="
        group
        flex flex-col
        justify-between
        overflow-hidden
        rounded-[28px]
        border
        border-[#eef2f5]
        bg-white
        shadow-[0_4px_20px_rgba(0,0,0,0.03)]
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-[0_12px_30px_rgba(0,0,0,0.07)]
      "
    >
      <div>
        <div
          className="
            flex items-center
            justify-between
            p-5 px-6
          "
          style={{
            background:
              "linear-gradient(135deg, #edf6f4 0%, #f5faf8 55%, #fdf5f6 100%)",
          }}
        >
          <div
            className="
              min-w-[58px]
              rounded-[18px]
              bg-white
              px-4 py-2
              text-center
              shadow-[0_4px_14px_rgba(0,0,0,0.05)]
            "
          >
            <div
              className="
                text-[22px]
                font-black
                leading-none
                text-[#991b30]
              "
            >
              {day}
            </div>

            <div
              className="
                mt-1
                text-[10.5px]
                font-medium
                text-[#8e9ca7]
              "
            >
              {month}
            </div>
          </div>

          <div
            className="
              flex items-center
              gap-1.5
            "
          >
            <span
              className={`
                h-2 w-2
                rounded-full
                ${active ? "bg-[#1b7a42]" : "bg-[#2563eb]"}
              `}
            />

            <span
              className={`
                text-[12px]
                font-bold
                ${active ? "text-[#1b7a42]" : "text-[#2563eb]"}
              `}
            >
              {campaign.status_label}
            </span>
          </div>
        </div>

        <div className="p-6 text-right">
          <div
            className="
              text-[13px]
              font-bold
              text-[#991b30]
            "
          >
            {campaign.institution.name}
          </div>

          <h3
            className="
              mb-2.5 mt-1
              text-[19px]
              font-black
              leading-snug
              tracking-tight
              text-[#124345]
            "
          >
            {campaign.title}
          </h3>

          <p
            className="
              mb-5
              line-clamp-2
              text-[12.5px]
              leading-[1.65]
              text-[#6b7c88]
            "
          >
            {campaign.description}
          </p>

          <div
            className="
              mb-5
              space-y-2.5
            "
          >
            <div
              className="
                flex items-center
                justify-start
                gap-2.5
              "
            >
              <Calendar
                className="
                  h-4 w-4
                  shrink-0
                  text-[#991b30]
                "
              />

              <span
                dir="ltr"
                className="
                  text-[12px]
                  font-medium
                  text-[#64748b]
                "
              >
                {campaign.start_time}-{campaign.end_time}
                {" · "}
                {campaign.start_date}
              </span>
            </div>

            <div
              className="
                flex items-center
                justify-start
                gap-2.5
              "
            >
              <MapPin
                className="
                  h-4 w-4
                  shrink-0
                  text-[#991b30]
                "
              />

              <span
                className="
                  text-[12px]
                  font-medium
                  text-[#64748b]
                "
              >
                {campaignLocation(campaign)}
              </span>
            </div>
          </div>

          <div
            className="
              flex flex-wrap
              items-center
              justify-start
              gap-1.5
            "
          >
            {allBloodTypes ? (
              <span
                className="
                  rounded-[8px]
                  bg-[#faebee]
                  px-3.5 py-1
                  text-[11.5px]
                  font-bold
                  text-[#991b30]
                "
              >
                جميع الفصائل
              </span>
            ) : (
              campaign.blood_types.map((type) => (
                <span
                  key={type}
                  dir="ltr"
                  className="
                      rounded-[8px]
                      bg-[#faebee]
                      px-3.5 py-1
                      text-[11.5px]
                      font-bold
                      text-[#991b30]
                    "
                >
                  {type}
                </span>
              ))
            )}
          </div>
        </div>
      </div>

      <div
        className="
          border-t
          border-[#edf1f4]
          bg-white
          px-6 py-4
        "
      >
        <Link
          href={`/Visitor/campaigns/${campaign.id}`}
          className="
            group/btn
            flex w-full
            items-center
            justify-between
            py-0.5
            text-[13.5px]
            font-bold
            text-[#124345]
            transition-colors
            hover:text-[#991b30]
          "
        >
          <span>عرض تفاصيل الحملة</span>

          <ArrowLeft
            className="
              h-4 w-4
              text-[#124345]
              transition-all
              group-hover/btn:-translate-x-1.5
              group-hover/btn:text-[#991b30]
            "
          />
        </Link>
      </div>
    </article>
  );
}
