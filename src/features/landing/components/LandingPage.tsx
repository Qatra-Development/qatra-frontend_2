import type { PublicCampaign } from "../types/public-campaign.types";

import AudienceSection from "./AudienceSection";
import CampaignsSection from "./CampaignsSection";
import HowItWorksSection from "./HowItWorksSection";
import LandingCta from "./LandingCta";
import LandingFooter from "./LandingFooter";
import LandingHero from "./LandingHero";
import LandingNavbar from "./LandingNavbar";
import LandingStats from "./LandingStats";
import ServicesSection from "./ServicesSection";
import UrgentCallBanner from "./UrgentCallBanner";
import WhyQatraSection from "./WhyQatraSection";

interface Props {
  campaigns: PublicCampaign[];
  campaignsError: string | null;

  isAuthenticated: boolean;

  dashboardHref: string;
  urgentResponseHref: string;
}

export default function LandingPage({
  campaigns,
  campaignsError,

  isAuthenticated,

  dashboardHref,
  urgentResponseHref,
}: Props) {
  return (
    <div
      dir="rtl"
      className="
        min-h-screen
        bg-[#f7f8fa]
      "
    >
      <LandingNavbar
        isAuthenticated={isAuthenticated}
        dashboardHref={dashboardHref}
      />

      <main>
        <LandingHero />

        <LandingStats />

        <HowItWorksSection />

        <ServicesSection />

        <CampaignsSection campaigns={campaigns} error={campaignsError} />

        <UrgentCallBanner responseHref={urgentResponseHref} />

        <WhyQatraSection />

        <AudienceSection />

        <LandingCta />
      </main>

      <LandingFooter />
    </div>
  );
}
