import Link from "next/link";
import StepIndicator from "@/components/ui/StepIndicator";

export default function SelectPathPage() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 w-full max-w-md mx-auto">
      <StepIndicator current="select-path" />

      <h1 className="text-2xl font-bold text-brand-blue mb-2 text-right">اختر مسارك</h1>
      <p className="text-brand-gray text-sm mb-8 text-right">كيف ترغب بالانضمام إلى شبكة قطرة؟</p>

      <div className="flex flex-col gap-4">
        {/* Donor option */}
        <Link
          href="/personal-info"
          className="flex flex-col gap-1 p-5 border-2 border-gray-200 rounded-xl hover:border-brand-red hover:bg-brand-bg transition-all group text-right"
        >
          <strong className="text-brand-blue text-base font-semibold group-hover:text-brand-red transition-colors">
            متبرع بالدم
          </strong>
          <span className="text-brand-gray text-sm">سجّل بياناتك لتصلك النداءات المناسبة.</span>
        </Link>

        {/* Medical entity option */}
        <Link
          href="/personal-info"
          className="flex flex-col gap-1 p-5 border-2 border-gray-200 rounded-xl hover:border-brand-red hover:bg-brand-bg transition-all group text-right"
        >
          <strong className="text-brand-blue text-base font-semibold group-hover:text-brand-red transition-colors">
            جهة طبية
          </strong>
          <span className="text-brand-gray text-sm">انضم لإدارة الاحتياج والنداءات.</span>
        </Link>
      </div>
    </div>
  );
}
