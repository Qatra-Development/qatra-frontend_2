import Link from "next/link";
import OtpInputGroup from "@/components/ui/OtpInputGroup";
import StepIndicator from "@/components/ui/StepIndicator";

export default function VerifyPage() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 w-full max-w-md mx-auto">
      <StepIndicator current="verify" />

      <h1 className="text-2xl font-bold text-brand-blue mb-2 text-right">تأكيد رقم الجوال</h1>
      <p className="text-brand-gray text-sm mb-2 text-right">
        أدخل رمز التحقق المرسل إلى رقم جوالك لإكمال التسجيل.
      </p>

      <OtpInputGroup />

      <button
        className="w-full py-3 px-6 bg-brand-red hover:bg-brand-red-dark text-white font-semibold rounded-lg transition-colors mb-4"
      >
        تأكيد الرمز
      </button>

      <p className="text-center text-sm text-brand-gray">
        لم يصلك الرمز؟{" "}
        <Link href="/verify" className="text-brand-red font-semibold hover:underline">
          إعادة الإرسال
        </Link>
      </p>
    </div>
  );
}
