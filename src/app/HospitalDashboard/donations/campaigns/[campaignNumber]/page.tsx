import InstitutionCampaignDetailsPage from "@/src/features/blood-bank/donations/components/InstitutionCampaignDetailsPage";

export default async function Page({ params }: { params: Promise<{ campaignNumber: string }> }) {
  const { campaignNumber } = await params;
  return (
    <InstitutionCampaignDetailsPage
      key={campaignNumber}
      campaignNumber={campaignNumber}
      campaignsHref="/HospitalDashboard/donations/campaigns"
    />
  );
}
