import { notFound } from "next/navigation";
import MatchingDonorsPage from "@/src/features/blood-bank/donations/components/MatchingDonorsPage";

export default async function Page({ params }: { params: Promise<{ callId: string }> }) {
  const { callId } = await params;
  const parsedCallId = Number(callId);
  if (!Number.isInteger(parsedCallId) || parsedCallId <= 0) notFound();

  return <MatchingDonorsPage callId={parsedCallId} callsHref="/BloodBankDashboard/donations/calls" />;
}
