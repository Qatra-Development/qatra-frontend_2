import InstitutionReviewPage from "@/src/features/admin/institutions/review/components/InstitutionReviewPage";

interface Props {
  params: Promise<{
    institutionId: string;
  }>;
}

export default async function Page({ params }: Props) {
  const { institutionId } = await params;

  return <InstitutionReviewPage institutionId={institutionId} />;
}
