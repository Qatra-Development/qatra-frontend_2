"use client";

import { useState, type HTMLInputTypeAttribute } from "react";
import { ChevronDown, Eye, EyeOff } from "lucide-react";

type Props = {
  name: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  type?: HTMLInputTypeAttribute;
  options?: readonly { value: string; label: string }[];
};

export default function InstitutionField({ name, label, value, onChange, error, placeholder, type = "text", options }: Props) {
  const [visible, setVisible] = useState(false);
  const id = `institution-${name}`;
  const isPassword = type === "password";
  const className = `w-full rounded-xl border px-3.5 py-2.5 text-xs text-gray-800 bg-white shadow-sm focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red ${error ? "border-brand-red" : "border-gray-200"} ${isPassword || options ? "pl-10" : ""}`;
  const accessibility = { id, name, required: true, "aria-invalid": Boolean(error), "aria-describedby": error ? `${id}-error` : undefined };

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-bold text-gray-800">{label} <span className="text-brand-red">*</span></label>
      <div className="relative">
        {options ? (
          <>
            <select {...accessibility} value={value} onChange={(event) => onChange(event.target.value)} className={`${className} appearance-none cursor-pointer`}>
              <option value="" disabled>{placeholder ?? "اختر من القائمة"}</option>
              {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
            <ChevronDown className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true" />
          </>
        ) : (
          <>
            <input {...accessibility} type={isPassword && visible ? "text" : type} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} autoComplete={isPassword ? "new-password" : undefined} dir={type === "tel" || type === "email" ? "ltr" : undefined} className={className} />
            {isPassword && <button type="button" onClick={() => setVisible(!visible)} aria-label={`${visible ? "إخفاء" : "إظهار"} ${label}`} aria-pressed={visible} className="absolute inset-y-0 left-0 px-3 text-gray-400 hover:text-gray-600">
              {visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>}
          </>
        )}
      </div>
      {error && <p id={`${id}-error`} className="text-xs text-brand-red" role="alert">{error}</p>}
    </div>
  );
}
