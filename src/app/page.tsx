import type { Metadata } from "next";

import LandingPage from "@/src/features/landing/components/LandingPage";

import { getLandingSession } from "@/src/features/landing/lib/landing-session";

import { getFeaturedPublicCampaigns } from "@/src/features/landing/services/public-campaign.service";

export const metadata: Metadata = {
  title: "قطرة | تبرعك اليوم حياة تنبض غدًا",

  description:
    "منصة قطرة لربط المتبرعين بالمؤسسات الصحية وتنظيم التبرع بالدم والاحتياجات بشكل آمن وموثوق.",
};

export default async function HomePage() {
  const [session, campaignsResult] = await Promise.all([
    getLandingSession(),

    getFeaturedPublicCampaigns(3),
  ]);

  return (
    <LandingPage
      campaigns={campaignsResult.data}
      campaignsError={campaignsResult.error}
      isAuthenticated={session.isAuthenticated}
      dashboardHref={session.dashboardHref}
      urgentResponseHref={session.urgentResponseHref}
    />
  );
}
