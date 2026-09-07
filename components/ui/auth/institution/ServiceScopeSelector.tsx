import { CheckCircle2 } from "lucide-react";
import { SERVICE_SCOPES } from "@/src/features/auth/constants/institution-registration";
import type { InstitutionServiceScope } from "@/src/features/auth/types/institution-registration.types";

type Props = { value: InstitutionServiceScope; onChange: (value: InstitutionServiceScope) => void; error?: string };

export default function ServiceScopeSelector({ value, onChange, error }: Props) {
  const services = SERVICE_SCOPES.find((option) => option.value === value)?.services ?? [];
  return (
    <fieldset className="mb-6">
      <legend className="text-sm font-bold text-gray-800 mb-3.5">نطاق الخدمات المطلوبة</legend>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        {SERVICE_SCOPES.map((option) => (
          <label key={option.value} className={`relative text-center rounded-xl p-3.5 cursor-pointer focus-within:ring-2 focus-within:ring-brand-red ${value === option.value ? "border-2 border-brand-red bg-rose-50/50" : "border border-gray-200 hover:border-gray-300"}`}>
            <input type="radio" name="serviceScope" value={option.value} checked={value === option.value} onChange={() => onChange(option.value)} className="sr-only" aria-describedby={error ? "serviceScope-error" : undefined} />
            <span className="block text-xs font-bold text-gray-900 mb-1.5">{option.title}</span>
            <span className="block text-[11px] text-gray-500 leading-snug">{option.description}</span>
          </label>
        ))}
      </div>
      {error && <p id="serviceScope-error" className="text-xs text-brand-red mb-3" role="alert">{error}</p>}
      <div className="bg-[#f8fafb] border border-gray-200/70 rounded-xl p-4">
        <h3 className="text-xs font-bold text-gray-800 mb-2.5">الخدمات التي ستتاح بعد الاعتماد</h3>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-700">
          {services.map((service) => <li key={service} className="flex items-center gap-1.5 text-xs"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" aria-hidden="true" />{service}</li>)}
        </ul>
      </div>
    </fieldset>
  );
}
