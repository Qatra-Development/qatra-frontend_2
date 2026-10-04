import InstitutionCampaignParticipantsPage from "@/src/features/blood-bank/donations/components/InstitutionCampaignParticipantsPage";

export default async function Page({ params }: { params: Promise<{ campaignNumber: string }> }) {
  const { campaignNumber } = await params;
  return <InstitutionCampaignParticipantsPage key={campaignNumber} campaignNumber={campaignNumber} />;
}
