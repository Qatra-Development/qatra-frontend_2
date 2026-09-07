"use client";

import Link from "next/link";
import { Building2, User } from "lucide-react";
import { GOVERNORATES, INSTITUTION_TYPES } from "@/src/features/auth/constants/institution-registration";
import { useInstitutionDetailsForm } from "@/src/features/auth/hooks/use-institution-registration";
import type { InstitutionDetailsValues } from "@/src/features/auth/types/institution-registration.types";
import InstitutionField from "./InstitutionField";
import InstitutionSteps from "./InstitutionSteps";

export default function InstitutionDetailsForm() {
  const { values, setField, errors, handleSubmit } = useInstitutionDetailsForm();
  const field = (name: keyof InstitutionDetailsValues) => ({ name, value: values[name], onChange: (value: string) => setField(name, value), error: errors[name] });

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-10 w-full max-w-2xl mx-auto" dir="rtl">
      <InstitutionSteps current={2} />
      <header className="mb-8 text-right">
        <div className="flex items-center justify-between gap-2 mb-2">
          <p className="text-xs font-bold text-brand-red">مسار المؤسسات</p>
          <span className="px-3 py-1 rounded-full text-xs bg-rose-50 text-brand-red border border-rose-100">خطوة 2 من 4</span>
        </div>
        <h1 className="text-2xl sm:text-[26px] font-extrabold text-gray-900 mb-2">إنشاء حساب مؤسسة صحية</h1>
        <p className="text-xs sm:text-sm text-brand-gray">بيانات المؤسسة والممثل الرسمي كما تظهر في وثائق الترخيص</p>
      </header>
      <form onSubmit={handleSubmit} className="space-y-7" noValidate>
        <fieldset className="space-y-4">
          <legend className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-2"><Building2 className="w-4 h-4 text-brand-red" />بيانات المؤسسة</legend>
          <InstitutionField {...field("institutionName")} label="اسم المؤسسة" placeholder="ادخل اسم المؤسسة الرسمي" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InstitutionField {...field("institutionType")} label="نوع المؤسسة" placeholder="اختر نوع المؤسسة" options={INSTITUTION_TYPES} />
            <InstitutionField {...field("licenseNumber")} label="رقم الترخيص" placeholder="ادخل رقم الترخيص" />
          </div>
          <InstitutionField {...field("address")} label="العنوان" placeholder="ادخل عنوان المؤسسة" />
          <div className="sm:w-1/2"><InstitutionField {...field("governorate")} label="المحافظة" placeholder="اختر المحافظة" options={GOVERNORATES} /></div>
        </fieldset>
        <fieldset className="space-y-4 pt-2">
          <legend className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-2"><User className="w-4 h-4 text-brand-red" />بيانات الممثل الرسمي</legend>
          <InstitutionField {...field("representativeName")} label="الاسم الكامل" placeholder="ادخل الاسم الكامل" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InstitutionField {...field("phone")} label="رقم الهاتف" type="tel" placeholder="0591234567" />
            <InstitutionField {...field("email")} label="البريد الإلكتروني" type="email" placeholder="name@institution.org" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InstitutionField {...field("password")} label="كلمة المرور" type="password" placeholder="8 أحرف على الأقل، تشمل حروفًا وأرقامًا" />
            <InstitutionField {...field("passwordConfirmation")} label="تأكيد كلمة المرور" type="password" placeholder="أعد كتابة كلمة المرور" />
          </div>
        </fieldset>
        <footer className="flex items-center justify-between gap-3 pt-6 border-t border-gray-100">
          <Link href="/select-path" className="px-6 py-2.5 text-xs font-medium rounded-xl border border-gray-200 hover:bg-gray-50">السابق</Link>
          <button type="submit" className="px-6 py-2.5 bg-brand-red hover:bg-brand-red-dark text-white text-xs font-semibold rounded-xl shadow-sm cursor-pointer">التالي: الخدمات والوثائق</button>
        </footer>
      </form>
    </div>
  );
}
