import AccountVerificationForm from "@/components/ui/auth/AccountVerificationForm";

export default async function AccountVerifyPage({ searchParams }) {
  const params = await searchParams;
  const email = typeof params.email === "string" ? params.email : "";
  const accountType = params.type === "institution" ? "institution" : "donor";
  return <AccountVerificationForm key={`${accountType}:${email}`} email={email} accountType={accountType} />;
}
