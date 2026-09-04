"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { resetPasswordSchema } from "@/src/features/auth/schemas/login.schema";
import { resetPassword } from "@/src/features/auth/services/auth.service";
import { getApiErrorMessage } from "@/src/lib/api/errors";

export default function ResetPasswordPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const params = new URLSearchParams(window.location.search);
        const validation = resetPasswordSchema.safeParse({
            email: params.get("email") ?? "",
            code: params.get("code") ?? "",
            password,
            passwordConfirmation,
        });
        if (!validation.success) {
            toast.error(validation.error.issues[0]?.message ?? "يرجى التحقق من البيانات المدخلة.");
            return;
        }
        try {
            setIsLoading(true);
            const response = await resetPassword(validation.data);
            toast.success(response.message || "تم تغيير كلمة المرور بنجاح.");
            router.replace("/login");
        } catch (error) {
            toast.error(getApiErrorMessage(error));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div
            className="bg-white rounded-3xl shadow-sm border border-gray-100 px-6 py-10 sm:px-12 sm:py-12 w-full max-w-xl mx-auto flex flex-col items-center"
            dir="rtl"
        >
            {/* Header */}
            <header className="text-center mb-8 w-full">
                <h1 className="text-2xl sm:text-[28px] font-bold text-gray-900 tracking-tight mb-2.5 leading-snug">
                    ادخل كلمة المرور الجديدة!
                </h1>
                <p className="text-xs sm:text-sm text-brand-gray leading-relaxed max-w-md mx-auto">
                    قم بإدخال كلمة المرور الجديدة ويجب ان تكون مكونة من 8 خانات!
                </p>
            </header>

            {/* Form */}
            <form onSubmit={handleSubmit} className="w-full space-y-5">
                {/* New Password */}
                <div className="flex flex-col space-y-1.5">
                    <label htmlFor="new-password" className="text-right text-xs sm:text-[12.5px] font-semibold text-gray-800 pr-1">
                        كلمة المرور
                    </label>
                    <div className="relative flex items-center">
                        <button
                            type="button"
                            aria-label="عرض أو إخفاء كلمة المرور"
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1 focus:outline-none"
                        >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                        <input
                            id="new-password"
                            name="new-password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            placeholder="••••••••"
                            required
                            className={`w-full text-right bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 focus:border-brand-red focus:ring-1 focus:ring-brand-red focus:outline-none transition-all placeholder:text-gray-400 ${showPassword ? "" : "tracking-[0.25em]"
                                }`}
                        />
                    </div>
                </div>

                {/* Confirm Password */}
                <div className="flex flex-col space-y-1.5 pt-1">
                    <label htmlFor="confirm-password" className="text-right text-xs sm:text-[12.5px] font-semibold text-gray-800 pr-1">
                        تأكيد كلمة المرور
                    </label>
                    <div className="relative flex items-center">
                        <button
                            type="button"
                            aria-label="عرض أو إخفاء تأكيد كلمة المرور"
                            onClick={() => setShowConfirmPassword((prev) => !prev)}
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1 focus:outline-none"
                        >
                            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                        <input
                            id="confirm-password"
                            name="confirm-password"
                            type={showConfirmPassword ? "text" : "password"}
                            value={passwordConfirmation}
                            onChange={(event) => setPasswordConfirmation(event.target.value)}
                            placeholder="••••••••"
                            required
                            className={`w-full text-right bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 focus:border-brand-red focus:ring-1 focus:ring-brand-red focus:outline-none transition-all placeholder:text-gray-400 ${showConfirmPassword ? "" : "tracking-[0.25em]"
                                }`}
                        />
                    </div>
                </div>

                {/* Submit Button */}
                <div className="pt-3">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 px-4 bg-brand-red hover:bg-brand-red-dark active:scale-[0.99] text-white font-semibold text-sm sm:text-base rounded-xl shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-red focus:ring-offset-2"
                    >
                        {isLoading ? "جاري تغيير كلمة المرور..." : "تغيير كلمة المرور"}
                    </button>
                </div>
            </form>
        </div>
    );
}
