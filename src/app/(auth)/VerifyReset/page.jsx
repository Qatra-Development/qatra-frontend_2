"use client";

import { useRef, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const OTP_LENGTH = 4;

function OtpVerifyContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get("email");

    const [values, setValues] = useState(Array(OTP_LENGTH).fill(""));
    const inputsRef = useRef([]);

    const handleChange = (index, rawValue) => {
        const digit = rawValue.replace(/[^0-9]/g, "").slice(-1);
        const next = [...values];
        next[index] = digit;
        setValues(next);

        if (digit && index < OTP_LENGTH - 1) {
            inputsRef.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace" && !values[index] && index > 0) {
            inputsRef.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e) => {
        const pasted = e.clipboardData.getData("text").replace(/[^0-9]/g, "");
        if (!pasted) return;
        e.preventDefault();

        const next = Array(OTP_LENGTH).fill("");
        pasted
            .slice(0, OTP_LENGTH)
            .split("")
            .forEach((char, i) => {
                next[i] = char;
            });
        setValues(next);

        const lastFilled = Math.min(pasted.length, OTP_LENGTH) - 1;
        if (lastFilled >= 0) {
            inputsRef.current[lastFilled]?.focus();
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const code = values.join("");
        // When user submits verification code, redirect to PasswordReset
        router.push("/PasswordReset");
    };

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 sm:p-12 w-full max-w-2xl mx-auto" dir="rtl">
            <div className="flex flex-col items-center text-center mt-2">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 leading-snug mb-2 px-4">أدخل رمز التحقق</h1>
                <p className="text-xs sm:text-sm text-brand-gray max-w-md leading-relaxed mb-7 px-4">
                    لقد قمنا بارسال رمز التحقق على بريدك الالكتروني {email ? <span className="font-semibold text-gray-700 dir-ltr inline-block">({email})</span> : ""}
                </p>

                {/* OTP Form */}
                <form onSubmit={handleSubmit} className="w-full max-w-sm flex flex-col items-center">
                    <div className="flex items-center justify-center gap-3 sm:gap-3.5 mb-7" dir="ltr" onPaste={handlePaste}>
                        {values.map((value, index) => (
                            <input
                                key={index}
                                ref={(el) => (inputsRef.current[index] = el)}
                                type="text"
                                inputMode="numeric"
                                autoComplete="one-time-code"
                                maxLength={1}
                                value={value}
                                onChange={(e) => handleChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                className="w-[52px] h-[55px] box-border bg-white border border-[#f9f1f3] rounded-[11px] shadow-[0px_4px_4px_#f9f1f3] text-center text-xl font-bold text-gray-800 outline-none transition-all duration-150 focus:border-[#E6C4CA] focus:shadow-[0px_4px_4px_#E6C4CA]"
                            />
                        ))}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-brand-red hover:bg-brand-red-dark active:scale-[0.99] text-white font-medium text-sm sm:text-base py-3 sm:py-3.5 px-6 rounded-xl shadow-md transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-brand-red focus:ring-offset-2 mb-7 cursor-pointer"
                    >
                        تحقق
                    </button>

                    <button
                        type="button"
                        className="text-xs sm:text-[13px] font-semibold text-brand-red hover:underline transition-all duration-150 focus:outline-none cursor-pointer"
                    >
                        إعادة إرسال الرمز
                    </button>
                </form>
            </div>
        </div>
    );
}

export default function OtpVerifyPage() {
    return (
        <Suspense fallback={<div className="text-center p-8 text-gray-500">جاري التحميل...</div>}>
            <OtpVerifyContent />
        </Suspense>
    );
}
