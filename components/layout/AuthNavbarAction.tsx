"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const REGISTRATION_ROUTES = new Set([
  "/select-path",
  "/donarPath",
  "/HospitalRegister",
  "/HospitalDocuments",
  "/verify",
]);

interface AuthNavbarActionProps {
  hasSession: boolean;
}

export default function AuthNavbarAction({ hasSession }: AuthNavbarActionProps) {
  const pathname = usePathname();

  if (hasSession) return null;

  const isRegistrationPage = REGISTRATION_ROUTES.has(pathname);

  return (
    <div className="flex items-center gap-1.5 sm:gap-2">
      <span className="text-brand-gray text-xs sm:text-sm hidden sm:inline">
        {isRegistrationPage ? "لديك حساب بالفعل؟" : "لا تملك حساباً؟"}
      </span>
      <Link
        href={isRegistrationPage ? "/login" : "/select-path"}
        className="text-brand-red font-semibold text-xs sm:text-sm hover:underline whitespace-nowrap"
      >
        {isRegistrationPage ? "تسجيل الدخول" : "أنشئ حساباً جديداً"}
      </Link>
    </div>
  );
}
