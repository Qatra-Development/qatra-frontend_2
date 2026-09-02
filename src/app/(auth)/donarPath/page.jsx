import Link from "next/link";
import StepIndicator from "@/components/ui/StepIndicator";
import { User, CreditCard, Droplet, MapPin, Phone, Mail, Lock } from "lucide-react";

export default function DonorRegisterPage() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-12 w-full max-w-4xl mx-auto" dir="rtl">
      <StepIndicator current="personal-info" />

      <p className="text-brand-red font-semibold text-sm mb-2 text-right">مسار التبرع</p>
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 text-right">تسجيل متبرع جديد</h1>
      <p className="text-brand-gray text-sm mb-8 text-right">
        أدخل بياناتك الأساسية حتى نرسل لك تحديثات التبرع المناسبة.
      </p>

      <form action="/verify" method="GET" dir="rtl">
        {/* Full Name */}
        <div className="mb-6">
          <label htmlFor="fullName" className="flex flex-col-reverse items-start gap-1 text-sm font-bold text-gray-900 mb-2">
            <span className="text-brand-red">*</span>
            الاسم الكامل
          </label>
          <div className="relative">
            <input
              id="fullName"
              name="fullName"
              type="text"
              placeholder="ادخل اسمك الكامل"
              className="w-full pr-10 pl-4 py-2.5 border-2 border-gray-200 rounded-lg text-sm text-right focus:border-brand-red focus:ring-brand-red"
            />
            <User className="w-4 h-4 text-gray-400 absolute top-1/2 right-3 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* ID Number & Blood Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 md:[direction:rtl]">
          <div>
            <label htmlFor="idNumber" className="flex flex-col-reverse items-start gap-1 text-sm font-bold text-gray-900 mb-2">
              <span className="text-brand-red">*</span>
              رقم الهوية
            </label>
            <div className="relative">
              <input
                id="idNumber"
                name="idNumber"
                type="text"
                placeholder="١٠ أرقام على الأقل"
                className="w-full pr-10 pl-4 py-2.5 border-2 border-gray-200 rounded-lg text-sm text-right focus:border-brand-red focus:ring-brand-red"
              />
              <CreditCard className="w-4 h-4 text-gray-400 absolute top-1/2 right-3 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div>
            <label htmlFor="bloodType" className="flex flex-col-reverse items-start gap-1 text-sm font-bold text-gray-900 mb-2">
              <span className="text-brand-red">*</span>
              فصيلة الدم
            </label>
            <div className="relative">
              <select
                id="bloodType"
                name="bloodType"
                defaultValue=""
                className="w-full pr-10 pl-4 py-2.5 border-2 border-gray-200 rounded-lg text-sm text-gray-500 text-right focus:border-brand-red focus:ring-brand-red"
              >
                <option value="" disabled>اختر الفصيلة</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
              </select>
              <Droplet className="w-4 h-4 text-gray-400 absolute top-1/2 right-3 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* City & Phone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 md:[direction:rtl]">
          <div>
            <label htmlFor="city" className="flex flex-col-reverse items-start gap-1 text-sm font-bold text-gray-900 mb-2">
              <span className="text-brand-red">*</span>
              المحافظة
            </label>
            <div className="relative">
              <select
                id="city"
                name="city"
                defaultValue=""
                className="w-full pr-10 pl-4 py-2.5 border-2 border-gray-200 rounded-lg text-sm text-gray-500 text-right focus:border-brand-red focus:ring-brand-red"
              >
                <option value="" disabled>اختر المحافظة</option>
                      <option value="north-gaza">شمال غزة</option>
                        <option value="gaza">غزة</option>
                        <option value="deir-al-balah">دير البلح (الوسطى)</option>
                        <option value="khan-yunis">خان يونس</option>
                        <option value="rafah">رفح</option>
              </select>
              <MapPin className="w-4 h-4 text-gray-400 absolute top-1/2 right-3 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div>
            <label htmlFor="phone" className="flex flex-col-reverse items-start gap-1 text-sm font-bold text-gray-900 mb-2">
              <span className="text-brand-red">*</span>
              رقم الهاتف
            </label>
            <div className="relative">
              <input
                id="phone"
                name="phone"
                type="tel"
                dir="ltr"
                placeholder="000 000 0000"
                className="w-full pr-10 pl-4 py-2.5 border-2 border-gray-200 rounded-lg text-sm text-right focus:border-brand-red focus:ring-brand-red"
              />
              <Phone className="w-4 h-4 text-gray-400 absolute top-1/2 right-3 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Email */}
        <div className="mb-6">
          <label htmlFor="email" className="flex flex-col-reverse items-start gap-1 text-sm font-bold text-gray-900 mb-2">
            <span className="text-brand-red">*</span>
            البريد الإلكتروني
          </label>
          <div className="relative">
            <input
              id="email"
              name="email"
              type="email"
              placeholder="أدخل بريدك الإلكتروني"
              className="w-full pr-10 pl-4 py-2.5 border-2 border-gray-200 rounded-lg text-sm text-right focus:border-brand-red focus:ring-brand-red"
            />
            <Mail className="w-4 h-4 text-gray-400 absolute top-1/2 right-3 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Password & Confirm Password */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 md:[direction:rtl]">
          <div>
            <label htmlFor="password" className="flex flex-col-reverse items-start gap-1 text-sm font-bold text-gray-900 mb-2">
              <span className="text-brand-red">*</span>
              كلمة المرور
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                className="w-full pr-10 pl-4 py-2.5 border-2 border-gray-200 rounded-lg text-sm text-right focus:border-brand-red focus:ring-brand-red"
              />
              <Lock className="w-4 h-4 text-gray-400 absolute top-1/2 right-3 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="flex flex-col-reverse items-start gap-1 text-sm font-bold text-gray-900 mb-2">
              <span className="text-brand-red">*</span>
              تأكيد كلمة المرور
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                className="w-full pr-10 pl-4 py-2.5 border-2 border-gray-200 rounded-lg text-sm text-right focus:border-brand-red focus:ring-brand-red"
              />
              <Lock className="w-4 h-4 text-gray-400 absolute top-1/2 right-3 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Terms Checkbox */}
        <div className="flex flex-row-reverse items-center justify-end gap-2 mb-8">
          <label htmlFor="terms" className="text-sm text-gray-900 cursor-pointer">
            أوافق على{" "}
            <a href="#" className="text-brand-red font-semibold hover:underline">
              شروط الخدمة
            </a>{" "}
            و{" "}
            <a href="#" className="text-brand-red font-semibold hover:underline">
              سياسة الخصوصية
            </a>
          </label>
          <input
            id="terms"
            name="terms"
            type="checkbox"
            className="h-4 w-4 accent-brand-red focus:ring-brand-red border-gray-300 rounded cursor-pointer"
          />
        </div>

        {/* Form Actions */}
        <div className="flex flex-row-reverse items-center justify-between pt-6 border-t border-gray-100">
          <button
            type="submit"
            className="px-8 py-3 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-brand-red hover:bg-brand-red-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-red transition-colors"
          >
            إنشاء حساب المتبرع
          </button>
          <Link
            href="/select-path"
            className="px-6 py-2.5 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-red transition-colors"
          >
            السابق
          </Link>
        </div>
      </form>
    </div>
  );
}
