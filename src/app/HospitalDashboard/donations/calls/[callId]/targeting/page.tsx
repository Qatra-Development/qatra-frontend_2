import { notFound } from "next/navigation";

import MatchingDonorsPage from "@/src/features/blood-bank/donations/components/MatchingDonorsPage";

interface Props {
  params: Promise<{
    callId: string;
  }>;
}

export default async function Page({ params }: Props) {
  const { callId } = await params;

  const parsedCallId = Number(callId);

  if (!Number.isInteger(parsedCallId) || parsedCallId <= 0) {
    notFound();
  }

  return <MatchingDonorsPage callId={parsedCallId} />;
}
