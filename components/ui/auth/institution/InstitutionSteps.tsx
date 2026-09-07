import { Check } from "lucide-react";

const STEPS = ["اختيار المسار", "بيانات المؤسسة", "الخدمات والوثائق", "تأكيد البريد"];

export default function InstitutionSteps({ current }: { current: 2 | 3 | 4 }) {
  return (
    <ol className="flex items-center w-full mb-6 sm:mb-8" aria-label="مراحل تسجيل المؤسسة">
      {STEPS.map((label, index) => {
        const step = index + 1;
        const completed = step < current;
        const active = step === current;
        return (
          <li key={label} className="flex items-center flex-1 last:flex-none" aria-current={active ? "step" : undefined}>
            <div className="flex flex-col items-center gap-1.5">
              <span className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold ${active ? "bg-brand-red text-white ring-4 ring-rose-100" : completed ? "bg-brand-red text-white" : "bg-gray-100 text-gray-400 border border-gray-200"}`}>
                {completed ? <Check className="w-4 h-4" aria-hidden="true" /> : step}
              </span>
              <span className={`text-[10px] sm:text-xs text-center ${active ? "text-brand-red font-bold" : completed ? "text-gray-800 font-semibold" : "text-gray-400"}`}>{label}</span>
            </div>
            {index < STEPS.length - 1 && <div aria-hidden="true" className={`flex-1 h-0.5 mx-1.5 sm:mx-3 mb-5 ${completed ? "bg-brand-red" : "bg-gray-200"}`} />}
          </li>
        );
      })}
    </ol>
  );
}
