"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import StepIndicator from "@/components/ui/StepIndicator";
import { User, CreditCard, Droplet, MapPin, Phone, Mail, Lock } from "lucide-react";
import { toast } from "sonner";
import { donorRegistrationSchema } from "@/src/features/auth/schemas/login.schema";
import { registerDonor } from "@/src/features/auth/services/auth.service";
import { getApiErrorMessage } from "@/src/lib/api/errors";

export default function DonorRegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const payload = {
      fullName: String(formData.get("fullName") ?? ""),
      nationalId: String(formData.get("idNumber") ?? ""),
      bloodType: String(formData.get("bloodType") ?? ""),
      region: String(formData.get("city") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
      passwordConfirmation: String(formData.get("confirmPassword") ?? ""),
      termsAccepted: formData.get("terms") === "on",
    };
    const validation = donorRegistrationSchema.safeParse(payload);

    if (!validation.success) {
      toast.error(validation.error.issues[0]?.message ?? "يرجى التحقق من البيانات المدخلة.");
      return;
    }

    try {
      setIsLoading(true);
      const response = await registerDonor(validation.data);
      toast.success(response.message || "تم إنشاء الحساب وإرسال رمز التحقق.");
      router.push(`/verify?email=${encodeURIComponent(validation.data.email)}&type=donor`);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-8 md:p-12 w-full max-w-4xl mx-auto" dir="rtl">
      <StepIndicator current="personal-info" />

      <p className="text-brand-red font-semibold text-xs sm:text-sm mb-1 sm:mb-2 text-right">مسار المتبرع</p>
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-1.5 sm:mb-2 text-right">تسجيل متبرع جديد</h1>
      <p className="text-brand-gray text-xs sm:text-sm mb-6 sm:mb-8 text-right">
        أدخل بياناتك الأساسية حتى نرسل لك تحديثات التبرع المناسبة.
      </p>

      <form onSubmit={handleSubmit} dir="rtl">
        {/* Full Name */}
        <div className="mb-4 sm:mb-6">
          <label htmlFor="fullName" className="block text-xs sm:text-sm font-bold text-gray-900 mb-1.5 sm:mb-2 text-right">
            الاسم الكامل <span className="text-brand-red">*</span>
          </label>
          <div className="relative">
            <input
              id="fullName"
              name="fullName"
              type="text"
              required
              minLength={3}
              maxLength={100}
              placeholder="ادخل اسمك الكامل"
              className="w-full pr-10 pl-4 py-2.5 border-2 border-gray-200 rounded-lg text-sm text-right focus:border-brand-red focus:ring-brand-red"
            />
            <User className="w-4 h-4 text-gray-400 absolute top-1/2 right-3 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* ID Number & Blood Type */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
          <div>
            <label htmlFor="idNumber" className="block text-xs sm:text-sm font-bold text-gray-900 mb-1.5 sm:mb-2 text-right">
              رقم الهوية <span className="text-brand-red">*</span>
            </label>
            <div className="relative">
              <input
                id="idNumber"
                name="idNumber"
                type="text"
                required
                inputMode="numeric"
                minLength={9}
                maxLength={9}
                placeholder="9 أرقام"
                className="w-full pr-10 pl-4 py-2.5 border-2 border-gray-200 rounded-lg text-sm text-right focus:border-brand-red focus:ring-brand-red"
              />
              <CreditCard className="w-4 h-4 text-gray-400 absolute top-1/2 right-3 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div>
            <label htmlFor="bloodType" className="block text-xs sm:text-sm font-bold text-gray-900 mb-1.5 sm:mb-2 text-right">
              فصيلة الدم <span className="text-brand-red">*</span>
            </label>
            <div className="relative">
              <select
                id="bloodType"
                name="bloodType"
                defaultValue=""
                required
                className="w-full pr-10 pl-4 py-2.5 border-2 border-gray-200 rounded-lg text-sm text-gray-500 text-right focus:border-brand-red focus:ring-brand-red cursor-pointer"
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
          <div>
            <label htmlFor="city" className="block text-xs sm:text-sm font-bold text-gray-900 mb-1.5 sm:mb-2 text-right">
              المحافظة <span className="text-brand-red">*</span>
            </label>
            <div className="relative">
              <select
                id="city"
                name="city"
                defaultValue=""
                required
                className="w-full pr-10 pl-4 py-2.5 border-2 border-gray-200 rounded-lg text-sm text-gray-500 text-right focus:border-brand-red focus:ring-brand-red cursor-pointer"
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
            <label htmlFor="phone" className="block text-xs sm:text-sm font-bold text-gray-900 mb-1.5 sm:mb-2 text-right">
              رقم الهاتف <span className="text-brand-red">*</span>
            </label>
            <div className="relative">
              <input
                id="phone"
                name="phone"
                type="tel"
                dir="ltr"
                required
                minLength={10}
                maxLength={10}
                placeholder="0591234567"
                className="w-full pr-10 pl-4 py-2.5 border-2 border-gray-200 rounded-lg text-sm text-right focus:border-brand-red focus:ring-brand-red"
              />
              <Phone className="w-4 h-4 text-gray-400 absolute top-1/2 right-3 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Email */}
        <div className="mb-4 sm:mb-6">
          <label htmlFor="email" className="block text-xs sm:text-sm font-bold text-gray-900 mb-1.5 sm:mb-2 text-right">
            البريد الإلكتروني <span className="text-brand-red">*</span>
          </label>
          <div className="relative">
            <input
              id="email"
              name="email"
              type="email"
              required
              maxLength={150}
              placeholder="أدخل بريدك الإلكتروني"
              className="w-full pr-10 pl-4 py-2.5 border-2 border-gray-200 rounded-lg text-sm text-right focus:border-brand-red focus:ring-brand-red"
            />
            <Mail className="w-4 h-4 text-gray-400 absolute top-1/2 right-3 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Password & Confirm Password */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
          <div>
            <label htmlFor="password" className="block text-xs sm:text-sm font-bold text-gray-900 mb-1.5 sm:mb-2 text-right">
              كلمة المرور <span className="text-brand-red">*</span>
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={8}
                placeholder="••••••••"
                className="w-full pr-10 pl-4 py-2.5 border-2 border-gray-200 rounded-lg text-sm text-right focus:border-brand-red focus:ring-brand-red"
              />
              <Lock className="w-4 h-4 text-gray-400 absolute top-1/2 right-3 -translate-y-1/2 pointer-events-none" />
            </div>
            <p className="mt-1 text-xs text-brand-gray">8 أحرف على الأقل، تشمل حروفًا وأرقامًا.</p>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-xs sm:text-sm font-bold text-gray-900 mb-1.5 sm:mb-2 text-right">
              تأكيد كلمة المرور <span className="text-brand-red">*</span>
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                placeholder="••••••••"
                className="w-full pr-10 pl-4 py-2.5 border-2 border-gray-200 rounded-lg text-sm text-right focus:border-brand-red focus:ring-brand-red"
              />
              <Lock className="w-4 h-4 text-gray-400 absolute top-1/2 right-3 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Terms Checkbox */}
        <div className="flex items-center gap-2 mb-6 sm:mb-8">
          <input
            id="terms"
            name="terms"
            type="checkbox"
            required
            className="w-4 h-4 rounded border-gray-300 text-brand-red focus:ring-brand-red accent-brand-red cursor-pointer shrink-0"
          />
          <label htmlFor="terms" className="text-xs sm:text-sm text-gray-900 cursor-pointer select-none">
            أوافق على{" "}
            <a href="#" className="text-brand-red font-semibold hover:underline">
              شروط الخدمة
            </a>{" "}
            و{" "}
            <a href="#" className="text-brand-red font-semibold hover:underline">
              سياسة الخصوصية
            </a>
          </label>
        </div>

        {/* Form Actions */}
        <div className="flex flex-col-reverse sm:flex-row-reverse items-stretch sm:items-center justify-between gap-3 pt-6 border-t border-gray-100">
          <button
            type="submit"
            disabled={isLoading}
            className="px-8 py-3 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-brand-red hover:bg-brand-red-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-red transition-colors cursor-pointer"
          >
            {isLoading ? "جاري إنشاء الحساب..." : "إنشاء حساب المتبرع"}
          </button>
          <Link
            href="/select-path"
            className="px-6 py-2.5 text-center border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-red transition-colors"
          >
            السابق
          </Link>
        </div>
      </form>
    </div>
  );
}
