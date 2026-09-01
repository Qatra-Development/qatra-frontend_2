"use client";
import { useRef } from "react";

export default function OtpInputGroup() {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const val = e.target.value.replace(/\D/g, "").slice(-1);
    e.target.value = val;
    if (val && index < 3) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !e.currentTarget.value && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  return (
    <div className="flex gap-3 justify-center my-6" dir="ltr">
      {[0, 1, 2, 3].map((index) => (
        <input
          key={index}
          ref={(el) => { inputsRef.current[index] = el; }}
          maxLength={1}
          inputMode="numeric"
          aria-label={`رقم التحقق ${index + 1}`}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          className="w-12 h-12 border border-gray-200 rounded-lg text-center text-xl font-semibold text-brand-blue
                     focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red transition-colors"
        />
      ))}
    </div>
  );
}
