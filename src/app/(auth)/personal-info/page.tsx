import Link from "next/link";
import StepIndicator from "@/components/ui/StepIndicator";

export default function PersonalInfoPage() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 w-full max-w-md mx-auto">
      <StepIndicator current="personal-info" />

      <h1 className="text-2xl font-bold text-brand-blue mb-2 text-right">البيانات الأساسية</h1>
      <p className="text-brand-gray text-sm mb-8 text-right">
        أدخل معلوماتك الأساسية لنتمكن من التواصل معك عند الحاجة.
      </p>

      <div className="flex flex-col gap-5 mb-8">
        {/* Full name */}
        <label className="flex flex-col gap-2 text-right">
          <span className="text-sm font-medium text-brand-blue">الاسم الكامل</span>
          <input
            className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-brand-gray-lighter text-brand-blue text-sm
                       focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red transition-colors text-right"
            placeholder="اكتب اسمك الكامل"
          />
        </label>

        {/* Phone number */}
        <label className="flex flex-col gap-2 text-right">
          <span className="text-sm font-medium text-brand-blue">رقم الجوال</span>
          <input
            className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-brand-gray-lighter text-brand-blue text-sm
                       focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red transition-colors"
            inputMode="tel"
            placeholder="05xxxxxxxx"
            dir="ltr"
          />
        </label>
      </div>

      <Link
        href="/verify"
        className="block w-full py-3 px-6 bg-brand-red hover:bg-brand-red-dark text-white text-center font-semibold rounded-lg transition-colors"
      >
        متابعة
      </Link>
    </div>
  );
}
