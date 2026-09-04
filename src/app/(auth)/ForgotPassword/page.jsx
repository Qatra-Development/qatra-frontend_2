"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { forgotPasswordSchema } from "@/src/features/auth/schemas/login.schema";
import { requestPasswordReset } from "@/src/features/auth/services/auth.service";
import { getApiErrorMessage } from "@/src/lib/api/errors";

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validation = forgotPasswordSchema.safeParse({ email });
        if (!validation.success) {
            toast.error(validation.error.issues[0]?.message ?? "يرجى إدخال بريد إلكتروني صحيح.");
            return;
        }
        try {
            setIsLoading(true);
            const response = await requestPasswordReset(validation.data);
            toast.success(response.message || "تم إرسال رمز استعادة كلمة المرور.");
            router.push(`/VerifyReset?email=${encodeURIComponent(validation.data.email)}`);
        } catch (error) {
            toast.error(getApiErrorMessage(error));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div
            className="bg-white rounded-3xl shadow-sm border border-gray-100 px-6 sm:px-12 pt-8 pb-12 w-full max-w-2xl mx-auto"
            dir="rtl"
        >
            {/* Top Navigation Link */}
            <div className="flex items-center justify-start mb-6">
                <Link
                    href="/login"
                    className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-brand-red hover:opacity-85 transition-opacity"
                >
                    <span>مرحبًا بعودتك</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                    <span className="font-medium text-gray-500">العودة للرئيسية</span>
                </Link>
            </div>

            {/* Form Content */}
            <div className="flex flex-col items-center text-center mt-2">
                <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mb-3">
                    استعادة كلمة المرور!
                </h1>
                <p className="text-xs sm:text-sm text-brand-gray leading-relaxed mb-8">
                    قم بادخال البريد الالكتروني لاستعادة كلمة المرور الخاصة بك!
                </p>

                <form onSubmit={handleSubmit} className="w-full text-right">
                    {/* Email Field */}
                    <div className="mb-6">
                        <label htmlFor="recovery-input" className="block text-xs sm:text-sm font-bold text-gray-700 mb-2 mr-1">
                            أدخل البريد الإلكتروني
                        </label>
                        <div className="relative">
                            <input
                                id="recovery-input"
                                name="recovery_target"
                                type="email"
                                dir="ltr"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                autoComplete="username"
                                placeholder="name@example.com"
                                className="w-full h-12 sm:h-13 px-4 pl-12 text-sm bg-white border border-gray-200 rounded-2xl text-gray-800 outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-brand-red focus:ring-4 focus:ring-brand-red/10 focus:shadow-sm"
                            />
                            <Mail className="w-5 h-5 text-gray-400 absolute inset-y-0 left-4 my-auto pointer-events-none transition-colors" />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full h-12 sm:h-13 bg-brand-red hover:bg-brand-red-dark active:scale-[0.99] text-white font-bold text-sm sm:text-base rounded-2xl transition-all duration-200 shadow-md shadow-brand-red/20 flex items-center justify-center cursor-pointer"
                    >
                        {isLoading ? "جاري الإرسال..." : "إرسال رمز التحقق"}
                    </button>
                </form>
            </div>
        </div>
    );
}
