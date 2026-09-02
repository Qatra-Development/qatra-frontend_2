"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-12 w-full max-w-xl mx-auto" dir="rtl">
      <div className="mb-8 text-right">
        <h1 className="text-3xl sm:text-4xl font-bold text-brand-blue mb-3">تسجيل الدخول</h1>
        <p className="text-brand-gray text-sm sm:text-base">
          أدخل بياناتك للوصول إلى لوحة التحكم الخاصة بك
        </p>
      </div>

      <form action="#" method="POST" className="space-y-6">
        {/* Identifier Field */}
        <div>
          <label htmlFor="identifier" className="block text-sm font-bold text-gray-700 mb-2 text-right">
            رقم الهاتف أو البريد الإلكتروني
          </label>
          <div className="relative">
            <input
              id="identifier"
              name="identifier"
              type="text"
              placeholder=" "
              className="block w-full pr-10 pl-4 py-3 border border-gray-200 rounded-xl focus:ring-brand-red focus:border-brand-red sm:text-sm text-right"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Password Field */}
        <div>
          <label htmlFor="password" className="block text-sm font-bold text-gray-700 mb-2 text-right">
            كلمة المرور
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder=" "
              className="block w-full pr-10 pl-4 py-3 border border-gray-200 rounded-xl focus:ring-brand-red focus:border-brand-red sm:text-sm text-right"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center">
            <label htmlFor="remember-me" className="mr-2 block text-sm text-gray-700 pl-2 cursor-pointer">
              تذكرني
            </label>
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="w-[13px] h-[13px] rounded-[2.5px] border-gray-300 text-[#9E1B32] focus:ring-[#9E1B32] accent-[#9E1B32] cursor-pointer"
            />
          </div>
          <div className="text-sm">
            <Link href="/forgot-password" className="font-medium text-brand-red hover:text-brand-red-dark transition-colors">
              نسيت كلمة المرور؟
            </Link>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-base font-medium text-white bg-brand-red hover:bg-brand-red-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-red transition-colors"
          >
            <span>دخول إلى المنصة</span>
            <ArrowLeft className="h-5 w-5 mr-2" />
          </button>
        </div>
      </form>

      {/* Divider */}
      <div className="mt-8 relative">
        <div aria-hidden="true" className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">أو</span>
        </div>
      </div>

      {/* Registration Link */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          ليس لديك حساب؟{" "}
          <Link href="/select-path" className="font-medium text-brand-red hover:text-brand-red-dark transition-colors">
            أنشئ حساباً جديداً
          </Link>
        </p>
      </div>
    </div>
  );
}
