"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Building2, User, Eye, EyeOff, ChevronDown, Check } from "lucide-react";

const HOSPITAL_STEPS = [
    { id: 1, label: "اختيار المسار", status: "completed" },
    { id: 2, label: "بيانات المؤسسة", status: "active" },
    { id: 3, label: "الخدمات والوثائق", status: "upcoming" },
    { id: 4, label: "إرسال الطلب", status: "upcoming" },
];

export default function InstitutionRegisterPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        router.push("/HospitalDocuments");
    };

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-10 w-full max-w-2xl mx-auto" dir="rtl">
            {/* 4-Step Indicator */}
            <ol className="flex items-center w-full mb-6 sm:mb-8" aria-label="مراحل التسجيل">
                {HOSPITAL_STEPS.map((step, index) => (
                    <li key={step.id} className="flex items-center flex-1 last:flex-none">
                        {/* Step circle + label */}
                        <div className="flex flex-col items-center gap-1.5">
                            <span
                                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold transition-all ${
                                    step.status === "completed"
                                        ? "bg-brand-red text-white"
                                        : step.status === "active"
                                        ? "bg-brand-red text-white ring-4 ring-rose-100"
                                        : "bg-gray-100 text-gray-400 border border-gray-200"
                                }`}
                            >
                                {step.status === "completed" ? (
                                    <Check className="w-4 h-4 stroke-[2.5]" />
                                ) : (
                                    step.id
                                )}
                            </span>
                            <small
                                className={`text-[10px] sm:text-xs text-center whitespace-nowrap ${
                                    step.status === "active"
                                        ? "text-brand-red font-bold"
                                        : step.status === "completed"
                                        ? "text-gray-800 font-semibold"
                                        : "text-gray-400 font-medium"
                                }`}
                            >
                                {step.label}
                            </small>
                        </div>

                        {/* Connector line */}
                        {index < HOSPITAL_STEPS.length - 1 && (
                            <div
                                className={`flex-1 h-0.5 mx-1.5 sm:mx-3 mb-5 transition-colors ${
                                    index < 1 ? "bg-brand-red" : "bg-gray-200"
                                }`}
                            />
                        )}
                    </li>
                ))}
            </ol>

            {/* Heading */}
            <section className="relative mb-8 text-right">
                <div className="absolute left-0 top-0">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-rose-50 text-brand-red border border-rose-100">
                        خطوة 2 من 4
                    </span>
                </div>
                <p className="text-xs font-bold tracking-wide text-brand-red mb-1">مسار المؤسسات</p>
                <h1 className="text-2xl sm:text-[26px] font-extrabold text-gray-900 tracking-tight mb-2">
                    إنشاء حساب مؤسسة صحية
                </h1>
                <p className="text-xs sm:text-[13px] text-brand-gray font-normal">
                    بيانات المؤسسة والممثل الرسمي كما تظهر في وثائق الترخيص
                </p>
            </section>

            <form onSubmit={handleSubmit} className="space-y-7">
                {/* SECTION 1: Institution Details */}
                <fieldset className="space-y-4">
                    <legend className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-2">
                        <Building2 className="w-4 h-4 text-brand-red" />
                        <span>بيانات المؤسسة</span>
                    </legend>

                    {/* Institution Name */}
                    <div className="space-y-1.5">
                        <label htmlFor="institution-name" className="block text-sm font-bold text-gray-800 mb-1.5">
                            اسم المؤسسة <span className="text-rose-600 text-xs">*</span>
                        </label>
                        <input
                            id="institution-name"
                            name="institution_name"
                            type="text"
                            placeholder="ادخل اسم المؤسسة الرسمي"
                            required
                            className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs text-gray-800 placeholder-gray-400 bg-white shadow-sm focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red transition-all"
                        />
                    </div>

                    {/* Type & License Number */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label htmlFor="institution-type" className="block text-sm font-bold text-gray-800 mb-1.5">
                                نوع المؤسسة <span className="text-rose-600 text-xs">*</span>
                            </label>
                            <div className="relative">
                                <select
                                    id="institution-type"
                                    name="institution_type"
                                    defaultValue=""
                                    required
                                    className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs text-gray-700 bg-white appearance-none cursor-pointer focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red shadow-sm transition-all"
                                >
                                    <option value="" disabled>اختر نوع المؤسسة</option>
                                    <option value="hospital">مستشفى</option>
                                    <option value="medical_center">مركز طبي متخصص</option>
                                    <option value="clinic">عيادة مجمعة</option>
                                    <option value="lab">مختبر تحاليل طبية</option>
                                    <option value="radiology">مركز أشعة</option>
                                </select>
                                <ChevronDown className="w-4 h-4 text-gray-400 absolute inset-y-0 left-3 my-auto pointer-events-none" />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label htmlFor="license-number" className="block text-sm font-bold text-gray-800 mb-1.5">
                                رقم الترخيص <span className="text-rose-600 text-xs">*</span>
                            </label>
                            <input
                                id="license-number"
                                name="license_number"
                                type="text"
                                placeholder="ادخل رقم الترخيص"
                                required
                                className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs text-gray-800 placeholder-gray-400 bg-white shadow-sm focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red transition-all"
                            />
                        </div>
                    </div>

                    {/* Address */}
                    <div className="space-y-1.5">
                        <label htmlFor="address" className="block text-sm font-bold text-gray-800 mb-1.5">
                            العنوان <span className="text-rose-600 text-xs">*</span>
                        </label>
                        <input
                            id="address"
                            name="address"
                            type="text"
                            placeholder="ادخل عنوان المؤسسة"
                            required
                            className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs text-gray-800 placeholder-gray-400 bg-white shadow-sm focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red transition-all"
                        />
                    </div>

                    {/* Governorate */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label htmlFor="governorate" className="block text-sm font-bold text-gray-800 mb-1.5">
                                المحافظة <span className="text-rose-600 text-xs">*</span>
                            </label>
                            <div className="relative">
                                <select
                                    id="governorate"
                                    name="governorate"
                                    defaultValue=""
                                    required
                                    className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs text-gray-700 bg-white appearance-none cursor-pointer focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red shadow-sm transition-all"
                                >
                                    <option value="" disabled>اختر المحافظة</option>
                                    <option value="north-gaza">شمال غزة</option>
                                    <option value="gaza">غزة</option>
                                    <option value="deir-al-balah">الوسطى</option>
                                    <option value="khan-yunis">خان يونس</option>
                                    <option value="rafah">رفح</option>
                                </select>
                                <ChevronDown className="w-4 h-4 text-gray-400 absolute inset-y-0 left-3 my-auto pointer-events-none" />
                            </div>
                        </div>
                        <div />
                    </div>
                </fieldset>

                {/* SECTION 2: Official Representative Details */}
                <fieldset className="space-y-4 pt-2">
                    <legend className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-2">
                        <User className="w-4 h-4 text-brand-red" />
                        <span>بيانات الممثل الرسمي</span>
                    </legend>

                    {/* Full Name */}
                    <div className="space-y-1.5">
                        <label htmlFor="representative-name" className="block text-sm font-bold text-gray-800 mb-1.5">
                            الاسم الكامل <span className="text-rose-600 text-xs">*</span>
                        </label>
                        <input
                            id="representative-name"
                            name="representative_name"
                            type="text"
                            placeholder="ادخل الاسم الكامل"
                            required
                            className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs text-gray-800 placeholder-gray-400 bg-white shadow-sm focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red transition-all"
                        />
                    </div>

                    {/* Phone & Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label htmlFor="phone-number" className="block text-sm font-bold text-gray-800 mb-1.5">
                                رقم الهاتف <span className="text-rose-600 text-xs">*</span>
                            </label>
                            <input
                                id="phone-number"
                                name="phone_number"
                                type="tel"
                                dir="ltr"
                                placeholder="+970 XX-XXX-XXXX"
                                required
                                className="w-full text-right rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs text-gray-800 placeholder-gray-400 bg-white shadow-sm focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red transition-all"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label htmlFor="email" className="block text-sm font-bold text-gray-800 mb-1.5">
                                البريد الإلكتروني <span className="text-rose-600 text-xs">*</span>
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                dir="ltr"
                                placeholder="name@institution.org"
                                required
                                className="w-full text-right rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs text-gray-800 placeholder-gray-400 bg-white shadow-sm focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red transition-all"
                            />
                        </div>
                    </div>

                    {/* Password & Confirm Password */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label htmlFor="password" className="block text-sm font-bold text-gray-800 mb-1.5">
                                كلمة المرور <span className="text-rose-600 text-xs">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="8 خانات على الأقل"
                                    required
                                    className="w-full rounded-xl border border-gray-200 pl-10 pr-3.5 py-2.5 text-xs text-gray-800 placeholder-gray-400 bg-white shadow-sm focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red transition-all"
                                />
                                <button
                                    type="button"
                                    aria-label="إظهار أو إخفاء كلمة المرور"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label htmlFor="confirm-password" className="block text-sm font-bold text-gray-800 mb-1.5">
                                تأكيد كلمة المرور <span className="text-rose-600 text-xs">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    id="confirm-password"
                                    name="confirm_password"
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="أعد كتابة كلمة المرور"
                                    required
                                    className="w-full rounded-xl border border-gray-200 pl-10 pr-3.5 py-2.5 text-xs text-gray-800 placeholder-gray-400 bg-white shadow-sm focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red transition-all"
                                />
                                <button
                                    type="button"
                                    aria-label="إظهار أو إخفاء تأكيد كلمة المرور"
                                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                                    className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                                >
                                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                    </div>
                </fieldset>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-6 border-t border-gray-100 mt-8">
                    <Link
                        href="/select-path"
                        className="inline-flex items-center justify-center px-6 py-2.5 bg-white hover:bg-gray-50 active:scale-[0.98] text-gray-700 text-xs font-medium rounded-xl border border-gray-200 transition duration-150 shadow-sm"
                    >
                        السابق
                    </Link>
                    <button
                        type="submit"
                        className="inline-flex items-center justify-center px-6 py-2.5 bg-brand-red hover:bg-brand-red-dark active:scale-[0.98] text-white text-xs font-semibold rounded-xl shadow-sm transition duration-150 cursor-pointer"
                    >
                        التالي: الخدمات والوثائق
                    </button>
                </div>
            </form>
        </div>
    );
}
