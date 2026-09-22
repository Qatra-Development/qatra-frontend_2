"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { loginSchema } from "@/src/features/auth/schemas/login.schema";
import { login } from "@/src/features/auth/services/auth.service";
import { saveAuthenticatedUser } from "@/src/features/auth/client/user-storage";
import { getApiErrorMessage } from "@/src/lib/api/errors";
import { toast } from "sonner";

export default function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const [errors, setErrors] = useState<{
    identifier?: string;
    password?: string;
  }>({});

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setErrors({});
    const result = loginSchema.safeParse({
      identifier,
      password,
    });

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;

      setErrors({
        identifier: fieldErrors.identifier?.[0],
        password: fieldErrors.password?.[0],
      });

      return;
    }

    try {
      setIsLoading(true);

      const response = await login({
        identifier,
        password,
        rememberMe,
      });

      saveAuthenticatedUser(response.data);
      toast.success(response.message || "تم تسجيل الدخول بنجاح.");

      const user = response.data?.user;
      const institution = response.data?.institution;
      const accountType =
        user?.account_type || (user as { role?: string })?.role;

      if (accountType === "health_authority_admin") {
        window.location.assign("/dashboard");
        return;
      }

      if (
        institution?.status === "approved" &&
        (institution.service_scope === "blood_request_and_blood_bank" ||
          accountType === "blood_request_and_blood_bank")
      ) {
        window.location.assign(new URL("/HospitalDashboard", window.location.origin).toString());
        return;
      }

      const isInstitution =
        accountType === "health_institution" ||
        accountType === "institution" ||
        accountType === "hospital" ||
        Boolean(institution);

      if (isInstitution) {
        const isApprovedBloodBank =
          institution?.status === "approved" &&
          institution.service_scope === "blood_bank_services_only";

        window.location.assign(
          isApprovedBloodBank ? "/BloodBankDashboard" : "/HospitalPath",
        );
      } else {
        window.location.assign("/");
      }
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-8 md:p-12 w-full max-w-xl mx-auto"
      dir="rtl"
    >
      <div className="mb-6 sm:mb-8 text-right">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-brand-blue mb-2 sm:mb-3">
          تسجيل الدخول
        </h1>

        <p className="text-brand-gray text-xs sm:text-sm md:text-base">
          أدخل بياناتك للوصول إلى لوحة التحكم الخاصة بك
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
        {/* Identifier */}
        <div>
          <label
            htmlFor="identifier"
            className="block text-xs sm:text-sm font-bold text-gray-700 mb-1.5 sm:mb-2 text-right"
          >
            رقم الهاتف أو البريد الإلكتروني
          </label>

          <div className="relative">
            <input
              id="identifier"
              name="identifier"
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="block w-full pr-10 pl-4 py-2.5 sm:py-3 border border-gray-200 rounded-xl focus:ring-brand-red focus:border-brand-red text-sm text-right"
            />

            <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
              <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
            </div>
          </div>

          {errors.identifier && (
            <p className="mt-1.5 text-xs text-red-500 text-right">
              {errors.identifier}
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <label
            htmlFor="password"
            className="block text-xs sm:text-sm font-bold text-gray-700 mb-1.5 sm:mb-2 text-right"
          >
            كلمة المرور
          </label>

          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full pr-10 pl-10 py-2.5 sm:py-3 border border-gray-200 rounded-xl focus:ring-brand-red focus:border-brand-red text-sm text-right"
            />

            <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
              <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
            </div>

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute inset-y-0 left-0 pl-3.5 flex items-center cursor-pointer text-gray-400 hover:text-gray-600 transition-colors"
              aria-label={
                showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"
              }
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" />
              ) : (
                <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
              )}
            </button>
          </div>

          {errors.password && (
            <p className="mt-1.5 text-xs text-red-500 text-right">
              {errors.password}
            </p>
          )}
        </div>

        {/* Remember / Forgot */}
        <div className="flex items-center justify-between gap-2 pt-1">
          <div className="flex items-center gap-2">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              checked={rememberMe}
              onChange={(event) => setRememberMe(event.target.checked)}
              className="w-4 h-4 rounded-md border-gray-300 text-brand-red focus:ring-brand-red accent-brand-red cursor-pointer"
            />

            <label
              htmlFor="remember-me"
              className="text-xs sm:text-sm text-gray-700 cursor-pointer select-none"
            >
              تذكرني
            </label>
          </div>

          <Link
            href="/ForgotPassword"
            className="text-xs sm:text-sm font-semibold text-brand-red hover:text-brand-red-dark transition-colors"
          >
            نسيت كلمة المرور؟
          </Link>
        </div>

        {/* Submit */}
        <div className="pt-2 sm:pt-3">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center items-center py-3 sm:py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm sm:text-base font-semibold text-white bg-brand-red hover:bg-brand-red-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-red transition-all active:scale-[0.99] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <span>
              {isLoading ? "جاري تسجيل الدخول..." : "دخول إلى المنصة"}
            </span>

            {!isLoading && <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />}
          </button>
        </div>
      </form>

      {/* Divider */}
      <div className="mt-6 sm:mt-8 relative">
        <div aria-hidden="true" className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>

        <div className="relative flex justify-center text-xs sm:text-sm">
          <span className="px-3 bg-white text-gray-400 font-medium">أو</span>
        </div>
      </div>

      {/* Registration */}
      <div className="mt-5 sm:mt-6 text-center">
        <p className="text-xs sm:text-sm text-gray-600">
          ليس لديك حساب؟{" "}
          <Link
            href="/select-path"
            className="font-semibold text-brand-red hover:text-brand-red-dark transition-colors"
          >
            أنشئ حساباً جديداً
          </Link>
        </p>
      </div>
    </div>
  );
}
