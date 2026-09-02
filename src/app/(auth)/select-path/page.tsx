import Link from "next/link";
import StepIndicator from "@/components/ui/StepIndicator";
import { Heart, Building2, ArrowLeft } from "lucide-react";

export default function SelectPathPage() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-12 w-full max-w-4xl mx-auto" dir="rtl">
      <StepIndicator current="select-path" />

      <p className="text-brand-red font-semibold text-sm mb-2 text-right">إنشاء حساب جديد</p>
      <h1 className="text-2xl sm:text-3xl font-bold text-brand-blue mb-3 text-right">اختر مسار التسجيل</h1>
      <p className="text-brand-gray text-sm mb-10 text-right">
        يوجد مساران منفصلان. اختر الحساب الذي يمثل استخدامك للمنصة.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {/* Donor option */}
        <Link
          href="/donarPath"
          dir="rtl"
          className="flex flex-col items-end h-full p-6 border border-gray-100 rounded-2xl shadow-[0px_15px_45px_rgba(30,36,50,0.06)] hover:border-[#9E1B32] hover:shadow-md transition-[border-color,box-shadow] duration-300 ease-out group text-right"
        >
          <div className="w-12 h-12 rounded-xl bg-[#f9ebeb] flex items-center justify-center mb-6 self-end">
            <Heart className="w-6 h-6 text-[#8b1818]" />
          </div>

          <strong className="w-full text-right text-brand-blue text-xl font-bold mb-2 group-hover:text-brand-red transition-colors">
            مسار المتبرع
          </strong>
          <span className="w-full text-right text-brand-gray text-xs mb-4">
            للأفراد الراغبين في التبرع واستقبال النداءات المتوافقة
          </span>

          <ul className="w-full text-right text-xs text-brand-gray space-y-2 flex-grow flex flex-col items-end mb-8">
            <li className="w-full flex items-center justify-start gap-2 text-right">
              <span className="w-1 h-1 rounded-full bg-gray-300 block" />
              تحديد فصيلة الدم والموقع
            </li>
            <li className="w-full flex items-center justify-start gap-2 text-right">
              <span className="w-1 h-1 rounded-full bg-gray-300 block" />
              متابعة المواعيد والتبرعات
            </li>
          </ul>

          <span className="w-full flex items-center justify-end flex-row-reverse gap-2 text-brand-red font-semibold text-sm mt-auto group-hover:underline">
            ابدأ كمتبرع
            <ArrowLeft className="w-4 h-4" />
          </span>
        </Link>

        {/* Medical entity option */}
        <Link
          href="/personal-info"
          dir="rtl"
          className="flex flex-col items-end h-full p-6 border border-gray-100 rounded-2xl shadow-[0px_15px_45px_rgba(30,36,50,0.06)] hover:border-[#437778] hover:shadow-md transition-[border-color,box-shadow] duration-300 ease-out group text-right"
        >
          <div className="w-12 h-12 rounded-xl bg-[#eff6ff] flex items-center justify-center mb-6 self-end">
            <Building2 className="w-6 h-6 text-[#1d4ed8]" />
          </div>

          <strong className="w-full text-right text-brand-blue text-xl font-bold mb-2 group-hover:text-brand-red transition-colors">
            مسار المؤسسات
          </strong>
          <span className="w-full text-right text-brand-gray text-xs mb-4">للمؤسسات الصحية ومراكز وبنوك الدم</span>

          <ul className="w-full text-right text-xs text-brand-gray space-y-2 flex-grow flex flex-col items-end mb-8">
            <li className="w-full flex items-center justify-start gap-2 text-right">
              <span className="w-1 h-1 rounded-full bg-gray-300 block" />
              تحديد الكميات المطلوبة
            </li>
            <li className="w-full flex items-center justify-start gap-2 text-right">
              <span className="w-1 h-1 rounded-full bg-gray-300 block" />
              إدارة وثائق التراخيص والاعتماد
            </li>
          </ul>

          <span className="w-full flex items-center justify-end flex-row-reverse gap-2 text-[#1d4ed8] font-semibold text-sm mt-auto group-hover:underline">
            ابدأ كمؤسسة
            <ArrowLeft className="w-4 h-4" />
          </span>
        </Link>
      </div>

      <p className="text-center text-sm text-brand-gray">
        لديك حساب بالفعل؟{" "}
        <Link href="/logIn" className="text-brand-red font-semibold hover:underline">
          تسجيل الدخول
        </Link>
      </p>
    </div>
  );
}
