"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import StepIndicator from "@/components/ui/StepIndicator";
import { User, CreditCard, Droplet, MapPin, Phone, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { donorRegistrationSchema } from "@/src/features/auth/schemas/login.schema";
import { registerDonor } from "@/src/features/auth/services/auth.service";
import { getApiErrorMessage, ApiError } from "@/src/lib/api/errors";

const initialFormValues = {
  fullName: "",
  nationalId: "",
  bloodType: "",
  region: "",
  phone: "",
  email: "",
  password: "",
  passwordConfirmation: "",
  termsAccepted: false,
};

export default function DonorRegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formValues, setFormValues] = useState(initialFormValues);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (field, value) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validation = donorRegistrationSchema.safeParse(formValues);

    if (!validation.success) {
      const fieldErrors = {};
      for (const issue of validation.error.issues) {
        const fieldName = issue.path[0];
        if (fieldName && !fieldErrors[fieldName]) {
          fieldErrors[fieldName] = issue.message;
        }
      }
      setErrors(fieldErrors);
      toast.error("يرجى تصحيح الأخطاء الموضحة في النموذج.");
      return;
    }

    try {
      setIsLoading(true);
      const response = await registerDonor(validation.data);
      if (response.data?.verification_email_sent === false) {
        toast.success("تم إنشاء الحساب. استخدم رمز التحقق 1111 لتفعيله.");
      } else {
        toast.success(response.message || "تم إنشاء الحساب وإرسال رمز التحقق.");
      }
      router.push(`/verify?email=${encodeURIComponent(validation.data.email)}&type=donor`);
    } catch (error) {
      if (error instanceof ApiError && error.fieldErrors) {
        const backendErrors = {};
        const fieldMapping = {
          name: "fullName",
          full_name: "fullName",
          fullName: "fullName",
          national_id: "nationalId",
          nationalId: "nationalId",
          id_number: "nationalId",
          idNumber: "nationalId",
          blood_type: "bloodType",
          bloodType: "bloodType",
          region: "region",
          city: "region",
          phone: "phone",
          email: "email",
          password: "password",
          password_confirmation: "passwordConfirmation",
          passwordConfirmation: "passwordConfirmation",
          confirm_password: "passwordConfirmation",
          confirmPassword: "passwordConfirmation",
          terms_accepted: "termsAccepted",
          termsAccepted: "termsAccepted",
          terms: "termsAccepted",
        };

        for (const [key, messages] of Object.entries(error.fieldErrors)) {
          const targetField = fieldMapping[key] || key;
          const msg = Array.isArray(messages) ? messages[0] : messages;
          if (msg && typeof msg === "string") {
            backendErrors[targetField] = msg;
          }
        }

        if (Object.keys(backendErrors).length > 0) {
          setErrors((prev) => ({ ...prev, ...backendErrors }));
          toast.error(error.message || "يرجى التحقق من البيانات المدخلة وتصحيح الأخطاء.");
          return;
        }
      }

      toast.error(getApiErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  const getInputClass = (fieldName) =>
    `w-full pr-10 pl-4 py-2.5 border-2 rounded-lg text-sm text-right transition-colors focus:outline-none ${
      errors[fieldName]
        ? "border-brand-red text-gray-900 focus:border-brand-red focus:ring-1 focus:ring-brand-red"
        : "border-gray-200 focus:border-brand-red focus:ring-brand-red"
    }`;

  const getSelectClass = (fieldName) =>
    `w-full pr-10 pl-4 py-2.5 border-2 rounded-lg text-sm text-right cursor-pointer transition-colors focus:outline-none ${
      errors[fieldName]
        ? "border-brand-red text-gray-900 focus:border-brand-red focus:ring-1 focus:ring-brand-red"
        : formValues[fieldName]
        ? "border-gray-200 text-gray-900 focus:border-brand-red focus:ring-brand-red"
        : "border-gray-200 text-gray-500 focus:border-brand-red focus:ring-brand-red"
    }`;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-8 md:p-12 w-full max-w-4xl mx-auto" dir="rtl">
      <StepIndicator current="personal-info" />

      <p className="text-brand-red font-semibold text-xs sm:text-sm mb-1 sm:mb-2 text-right">مسار المتبرع</p>
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-1.5 sm:mb-2 text-right">تسجيل متبرع جديد</h1>
      <p className="text-brand-gray text-xs sm:text-sm mb-6 sm:mb-8 text-right">
        أدخل بياناتك الأساسية حتى نرسل لك تحديثات التبرع المناسبة.
      </p>

      <form onSubmit={handleSubmit} dir="rtl" noValidate>
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
              value={formValues.fullName}
              onChange={(e) => handleInputChange("fullName", e.target.value)}
              placeholder="ادخل اسمك الكامل"
              className={getInputClass("fullName")}
              aria-invalid={Boolean(errors.fullName)}
              aria-describedby={errors.fullName ? "fullName-error" : undefined}
            />
            <User className={`w-4 h-4 absolute top-1/2 right-3 -translate-y-1/2 pointer-events-none ${errors.fullName ? "text-brand-red" : "text-gray-400"}`} />
          </div>
          {errors.fullName && (
            <p id="fullName-error" className="mt-1.5 text-xs text-brand-red text-right" role="alert">
              {errors.fullName}
            </p>
          )}
        </div>

        {/* ID Number & Blood Type */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
          <div>
            <label htmlFor="nationalId" className="block text-xs sm:text-sm font-bold text-gray-900 mb-1.5 sm:mb-2 text-right">
              رقم الهوية <span className="text-brand-red">*</span>
            </label>
            <div className="relative">
              <input
                id="nationalId"
                name="nationalId"
                type="text"
                inputMode="numeric"
                value={formValues.nationalId}
                onChange={(e) => handleInputChange("nationalId", e.target.value)}
                placeholder="9 أرقام"
                className={getInputClass("nationalId")}
                aria-invalid={Boolean(errors.nationalId)}
                aria-describedby={errors.nationalId ? "nationalId-error" : undefined}
              />
              <CreditCard className={`w-4 h-4 absolute top-1/2 right-3 -translate-y-1/2 pointer-events-none ${errors.nationalId ? "text-brand-red" : "text-gray-400"}`} />
            </div>
            {errors.nationalId && (
              <p id="nationalId-error" className="mt-1.5 text-xs text-brand-red text-right" role="alert">
                {errors.nationalId}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="bloodType" className="block text-xs sm:text-sm font-bold text-gray-900 mb-1.5 sm:mb-2 text-right">
              فصيلة الدم <span className="text-brand-red">*</span>
            </label>
            <div className="relative">
              <select
                id="bloodType"
                name="bloodType"
                value={formValues.bloodType}
                onChange={(e) => handleInputChange("bloodType", e.target.value)}
                className={getSelectClass("bloodType")}
                aria-invalid={Boolean(errors.bloodType)}
                aria-describedby={errors.bloodType ? "bloodType-error" : undefined}
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
              <Droplet className={`w-4 h-4 absolute top-1/2 right-3 -translate-y-1/2 pointer-events-none ${errors.bloodType ? "text-brand-red" : "text-gray-400"}`} />
            </div>
            {errors.bloodType && (
              <p id="bloodType-error" className="mt-1.5 text-xs text-brand-red text-right" role="alert">
                {errors.bloodType}
              </p>
            )}
          </div>
        </div>

        {/* City & Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
          <div>
            <label htmlFor="region" className="block text-xs sm:text-sm font-bold text-gray-900 mb-1.5 sm:mb-2 text-right">
              المحافظة <span className="text-brand-red">*</span>
            </label>
            <div className="relative">
              <select
                id="region"
                name="region"
                value={formValues.region}
                onChange={(e) => handleInputChange("region", e.target.value)}
                className={getSelectClass("region")}
                aria-invalid={Boolean(errors.region)}
                aria-describedby={errors.region ? "region-error" : undefined}
              >
                <option value="" disabled>اختر المحافظة</option>
                <option value="north-gaza">شمال غزة</option>
                <option value="gaza">غزة</option>
                <option value="deir-al-balah">دير البلح (الوسطى)</option>
                <option value="khan-yunis">خان يونس</option>
                <option value="rafah">رفح</option>
              </select>
              <MapPin className={`w-4 h-4 absolute top-1/2 right-3 -translate-y-1/2 pointer-events-none ${errors.region ? "text-brand-red" : "text-gray-400"}`} />
            </div>
            {errors.region && (
              <p id="region-error" className="mt-1.5 text-xs text-brand-red text-right" role="alert">
                {errors.region}
              </p>
            )}
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
                value={formValues.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="0591234567"
                className={getInputClass("phone")}
                aria-invalid={Boolean(errors.phone)}
                aria-describedby={errors.phone ? "phone-error" : undefined}
              />
              <Phone className={`w-4 h-4 absolute top-1/2 right-3 -translate-y-1/2 pointer-events-none ${errors.phone ? "text-brand-red" : "text-gray-400"}`} />
            </div>
            {errors.phone && (
              <p id="phone-error" className="mt-1.5 text-xs text-brand-red text-right" role="alert">
                {errors.phone}
              </p>
            )}
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
              dir="ltr"
              value={formValues.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="name@example.com"
              className={getInputClass("email")}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "email-error" : undefined}
            />
            <Mail className={`w-4 h-4 absolute top-1/2 right-3 -translate-y-1/2 pointer-events-none ${errors.email ? "text-brand-red" : "text-gray-400"}`} />
          </div>
          {errors.email && (
            <p id="email-error" className="mt-1.5 text-xs text-brand-red text-right" role="alert">
              {errors.email}
            </p>
          )}
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
                type={showPassword ? "text" : "password"}
                value={formValues.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                placeholder="••••••••"
                className={`pl-10 ${getInputClass("password")}`}
                aria-invalid={Boolean(errors.password)}
                aria-describedby={errors.password ? "password-error" : undefined}
              />
              <Lock className={`w-4 h-4 absolute top-1/2 right-3 -translate-y-1/2 pointer-events-none ${errors.password ? "text-brand-red" : "text-gray-400"}`} />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                className="absolute inset-y-0 left-0 px-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password ? (
              <p id="password-error" className="mt-1.5 text-xs text-brand-red text-right" role="alert">
                {errors.password}
              </p>
            ) : (
              <p className="mt-1 text-xs text-brand-gray text-right">8 أحرف على الأقل، تشمل حروفًا وأرقامًا.</p>
            )}
          </div>

          <div>
            <label htmlFor="passwordConfirmation" className="block text-xs sm:text-sm font-bold text-gray-900 mb-1.5 sm:mb-2 text-right">
              تأكيد كلمة المرور <span className="text-brand-red">*</span>
            </label>
            <div className="relative">
              <input
                id="passwordConfirmation"
                name="passwordConfirmation"
                type={showConfirmPassword ? "text" : "password"}
                value={formValues.passwordConfirmation}
                onChange={(e) => handleInputChange("passwordConfirmation", e.target.value)}
                placeholder="••••••••"
                className={`pl-10 ${getInputClass("passwordConfirmation")}`}
                aria-invalid={Boolean(errors.passwordConfirmation)}
                aria-describedby={errors.passwordConfirmation ? "passwordConfirmation-error" : undefined}
              />
              <Lock className={`w-4 h-4 absolute top-1/2 right-3 -translate-y-1/2 pointer-events-none ${errors.passwordConfirmation ? "text-brand-red" : "text-gray-400"}`} />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={showConfirmPassword ? "إخفاء تأكيد كلمة المرور" : "إظهار تأكيد كلمة المرور"}
                className="absolute inset-y-0 left-0 px-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.passwordConfirmation && (
              <p id="passwordConfirmation-error" className="mt-1.5 text-xs text-brand-red text-right" role="alert">
                {errors.passwordConfirmation}
              </p>
            )}
          </div>
        </div>

        {/* Terms Checkbox */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-2">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              checked={formValues.termsAccepted}
              onChange={(e) => handleInputChange("termsAccepted", e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-brand-red focus:ring-brand-red accent-brand-red cursor-pointer shrink-0"
              aria-invalid={Boolean(errors.termsAccepted)}
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
          {errors.termsAccepted && (
            <p className="mt-1.5 text-xs text-brand-red text-right" role="alert">
              {errors.termsAccepted}
            </p>
          )}
        </div>

        {/* Form Actions */}
        <div className="flex flex-col-reverse sm:flex-row-reverse items-stretch sm:items-center justify-between gap-3 pt-6 border-t border-gray-100">
          <button
            type="submit"
            disabled={isLoading}
            className="px-8 py-3 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-brand-red hover:bg-brand-red-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-red transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
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

