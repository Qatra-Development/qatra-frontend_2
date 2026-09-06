import Link from "next/link";
import StepIndicator from "@/components/ui/StepIndicator";
import { Heart, Building2, ArrowLeft } from "lucide-react";

export default function SelectPathPage() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-8 md:p-12 w-full max-w-4xl mx-auto" dir="rtl">
      <StepIndicator current="select-path" />

      <p className="text-brand-red font-semibold text-xs sm:text-sm mb-1 sm:mb-2 text-right">إنشاء حساب جديد</p>
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-brand-blue mb-2 sm:mb-3 text-right">اختر مسار التسجيل</h1>
      <p className="text-brand-gray text-xs sm:text-sm mb-6 sm:mb-10 text-right">
        يوجد مساران منفصلان. اختر الحساب الذي يمثل استخدامك للمنصة.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-10">
        {/* Donor option */}
        <Link
          href="/donarPath"
          dir="rtl"
          className="flex flex-col items-end h-full p-5 sm:p-6 border border-gray-100 rounded-2xl shadow-[0px_15px_45px_rgba(30,36,50,0.06)] hover:border-[#9E1B32] hover:shadow-md transition-all duration-300 ease-out group text-right active:scale-[0.99]"
        >
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#f9ebeb] flex items-center justify-center mb-4 sm:mb-6 self-end shrink-0">
            <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-[#8b1818]" />
          </div>

          <strong className="w-full text-right text-brand-blue text-lg sm:text-xl font-bold mb-1.5 sm:mb-2 group-hover:text-brand-red transition-colors">
            مسار المتبرع
          </strong>
          <span className="w-full text-right text-brand-gray text-xs mb-3 sm:mb-4">
            للأفراد الراغبين في التبرع واستقبال النداءات المتوافقة
          </span>

          <ul className="w-full text-right text-xs text-brand-gray space-y-2 flex-grow flex flex-col items-end mb-6 sm:mb-8">
            <li className="w-full flex items-center justify-start gap-2 text-right">
              <span className="w-1 h-1 rounded-full bg-gray-300 block" />
              تحديد فصيلة الدم والموقع
            </li>
            <li className="w-full flex items-center justify-start gap-2 text-right">
              <span className="w-1 h-1 rounded-full bg-gray-300 block" />
              متابعة المواعيد والتبرعات
            </li>
          </ul>

          <span className="w-full flex items-center justify-end flex-row-reverse gap-2 text-brand-red font-semibold text-xs sm:text-sm mt-auto group-hover:underline">
            ابدأ كمتبرع
            <ArrowLeft className="w-4 h-4" />
          </span>
        </Link>

        {/* Medical entity option */}
        <Link
          href="/HospitalPath"
          dir="rtl"
          className="flex flex-col items-end h-full p-5 sm:p-6 border border-gray-100 rounded-2xl shadow-[0px_15px_45px_rgba(30,36,50,0.06)] hover:border-[#437778] hover:shadow-md transition-all duration-300 ease-out group text-right active:scale-[0.99]"
        >
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#eff6ff] flex items-center justify-center mb-4 sm:mb-6 self-end shrink-0">
            <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-[#1d4ed8]" />
          </div>

          <strong className="w-full text-right text-brand-blue text-lg sm:text-xl font-bold mb-1.5 sm:mb-2 group-hover:text-brand-red transition-colors">
            مسار المؤسسات
          </strong>
          <span className="w-full text-right text-brand-gray text-xs mb-3 sm:mb-4">للمؤسسات الصحية ومراكز وبنوك الدم</span>

          <ul className="w-full text-right text-xs text-brand-gray space-y-2 flex-grow flex flex-col items-end mb-6 sm:mb-8">
            <li className="w-full flex items-center justify-start gap-2 text-right">
              <span className="w-1 h-1 rounded-full bg-gray-300 block" />
              تحديد الكميات المطلوبة
            </li>
            <li className="w-full flex items-center justify-start gap-2 text-right">
              <span className="w-1 h-1 rounded-full bg-gray-300 block" />
              إدارة وثائق التراخيص والاعتماد
            </li>
          </ul>

          <span className="w-full flex items-center justify-end flex-row-reverse gap-2 text-[#1d4ed8] font-semibold text-xs sm:text-sm mt-auto group-hover:underline">
            ابدأ كمؤسسة
            <ArrowLeft className="w-4 h-4" />
          </span>
        </Link>
      </div>

      <p className="text-center text-xs sm:text-sm text-brand-gray">
        لديك حساب بالفعل؟{" "}
        <Link href="/login" className="text-brand-red font-semibold hover:underline">
          تسجيل الدخول
        </Link>
      </p>
    </div>
  );
}
