"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import StepIndicator from "@/components/ui/StepIndicator";
import InstitutionSteps from "./institution/InstitutionSteps";
import { Check } from "lucide-react";
import { toast } from "sonner";
import { verificationCodeSchema } from "@/src/features/auth/schemas/login.schema";
import { resendDonorVerificationCode, verifyDonorEmail, resendInstitutionVerificationCode, verifyInstitutionEmail } from "@/src/features/auth/services/auth.service";
import { getApiErrorMessage } from "@/src/lib/api/errors";

const OTP_LENGTH = 4;

export default function AccountVerificationForm({ email, accountType }) {
  const router = useRouter();
  const isInstitution = accountType === "institution";
  const [institutionVerified, setInstitutionVerified] = useState(false);
  const [values, setValues] = useState(Array(OTP_LENGTH).fill(""));
  const inputsRef = useRef([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const handleChange = (index, rawValue) => {
    const digit = rawValue.replace(/[^0-9]/g, "").slice(-1);
    const next = [...values];
    next[index] = digit;
    setValues(next);

    if (digit && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !values[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData("text").replace(/[^0-9]/g, "");
    if (!pasted) return;
    e.preventDefault();

    const next = Array(OTP_LENGTH).fill("");
    pasted
      .slice(0, OTP_LENGTH)
      .split("")
      .forEach((char, i) => {
        next[i] = char;
      });
    setValues(next);

    const lastFilled = Math.min(pasted.length, OTP_LENGTH) - 1;
    if (lastFilled >= 0) {
      inputsRef.current[lastFilled]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading || isResending) return;
    const code = values.join("");
    const validation = verificationCodeSchema.safeParse({ email, code });

    if (!validation.success) {
      toast.error(validation.error.issues[0]?.message ?? "يرجى إدخال رمز التحقق.");
      return;
    }

    try {
      setIsLoading(true);
      const verifyEmail = isInstitution ? verifyInstitutionEmail : verifyDonorEmail;
      const response = await verifyEmail(validation.data);
      toast.success(response.message || "تم تفعيل الحساب بنجاح.");
      if (isInstitution) setInstitutionVerified(true);
      else router.replace("/login");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (isLoading || isResending) return;
    const validation = verificationCodeSchema.pick({ email: true }).safeParse({ email });
    if (!validation.success) {
      toast.error("رابط التحقق غير صالح. يرجى التسجيل مجددًا.");
      return;
    }
    try {
      setIsResending(true);
      const resendCode = isInstitution ? resendInstitutionVerificationCode : resendDonorVerificationCode;
      const response = await resendCode(validation.data);
      toast.success(response.message || "تم إرسال رمز تحقق جديد.");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setIsResending(false);
    }
  };

  if (institutionVerified) {
    return (
      <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 sm:p-12 w-full max-w-2xl text-center" dir="rtl">
        <Check className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-3">تم تأكيد بريد المؤسسة</h1>
        <p className="text-sm text-brand-gray mb-6">طلب المؤسسة والوثائق الآن قيد مراجعة الإدارة. تأكيد البريد لا يعني اعتماد المؤسسة بعد.</p>
        <Link href="/login" className="inline-block bg-brand-red text-white rounded-xl px-6 py-3 text-sm">الانتقال لتسجيل الدخول</Link>
      </section>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 sm:p-12 w-full max-w-2xl mx-auto" dir="rtl">
      {isInstitution ? <InstitutionSteps current={4} /> : <StepIndicator current="verify" />}

      <div className="flex flex-col items-center text-center mt-2">
        {/* Status Badge */}
        <div className="w-16 h-16 sm:w-[72px] sm:h-[72px] rounded-full bg-[#e7f5f8] flex items-center justify-center mb-4">
          <Check className="w-7 h-7 sm:w-8 sm:h-8 text-[#2f6975]" strokeWidth={2.5} />
        </div>

        <span className="text-xs sm:text-sm font-extrabold text-brand-red mb-1">التحقق من الحساب</span>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 leading-snug mb-2 px-4">
          {isInstitution ? "تأكيد بريد المؤسسة" : "تبقّت خطوة واحدة لتصبح جزءًا من قطرة"}
        </h1>
        <p className="text-xs sm:text-sm text-brand-gray max-w-md leading-relaxed mb-7 px-4">
          {isInstitution
            ? "أدخل رمز التحقق المكوّن من 4 أرقام والمرسل إلى بريد المؤسسة لإرسال الطلب إلى مراجعة الإدارة."
            : "أدخل رمز التحقق 1111 لتفعيل حساب المتبرع."}
        </p>

        {/* OTP Form */}
        <form onSubmit={handleSubmit} className="w-full max-w-sm flex flex-col items-center">
          <div className="flex items-center justify-center gap-3 sm:gap-3.5 mb-7" dir="ltr" onPaste={handlePaste}>
            {values.map((value, index) => (
              <input
                key={index}
                ref={(el) => { inputsRef.current[index] = el; }}
                type="text"
                aria-label={`الرقم ${index + 1} من رمز التحقق`}
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={1}
                value={value}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-[52px] h-[55px] box-border bg-white border border-[#f9f1f3] rounded-[11px] shadow-[0px_4px_4px_#f9f1f3] text-center text-xl font-bold text-gray-800 outline-none transition-all duration-150 focus:border-[#E6C4CA] focus:shadow-[0px_4px_4px_#E6C4CA]"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={isLoading || isResending}
            className="w-full bg-brand-red hover:bg-brand-red-dark active:scale-[0.99] text-white font-medium text-sm sm:text-base py-3 sm:py-3.5 px-6 rounded-xl shadow-md transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-brand-red focus:ring-offset-2 mb-3.5"
          >
            {isLoading ? "جاري التحقق..." : isInstitution ? "تأكيد البريد" : "تأكيد وتفعيل الحساب"}
          </button>

          <button
            type="button"
            onClick={handleResend}
            disabled={isResending || isLoading}
            className="text-xs sm:text-[13px] font-semibold text-brand-red hover:underline transition-all duration-150 focus:outline-none"
          >
            {isResending ? "جاري الإرسال..." : "إعادة إرسال الرمز"}
          </button>
        </form>
      </div>
    </div>
  );
}
