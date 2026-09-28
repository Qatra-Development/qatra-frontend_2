import { BloodRequestDetailsScreen } from "@/src/features/institution/blood-requests/components/BloodRequestDetailsScreen.tsx";

interface Props {
  params: Promise<{
    requestId: string;
  }>;
}

export default async function BloodRequestDetailsPage({ params }: Props) {
  const { requestId } = await params;

  return <BloodRequestDetailsScreen requestId={requestId} />;
}
