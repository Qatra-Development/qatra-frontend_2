const steps = [
  { key: "select-path", label: "اختيار المسار" },
  { key: "personal-info", label: "البيانات الأساسية" },
  { key: "verify", label: "تأكيد الحساب" },
];

export default function StepIndicator({ current }: { current: string }) {
  const activeIndex = steps.findIndex((step) => step.key === current);

  return (
    <ol className="flex items-center w-full mb-6 sm:mb-8" aria-label="مراحل التسجيل">
      {steps.map((step, index) => (
        <li key={step.key} className="flex items-center flex-1 last:flex-none">
          {/* Step circle + label */}
          <div className="flex flex-col items-center gap-1">
            <span
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold transition-colors
                ${index <= activeIndex
                  ? "bg-brand-red text-white"
                  : "bg-gray-100 text-brand-gray-light border border-gray-200"
                }`}
            >
              {index + 1}
            </span>
            <small
              className={`text-[10px] sm:text-xs font-medium text-center whitespace-nowrap ${
                index <= activeIndex ? "text-brand-red" : "text-brand-gray-light"
              }`}
            >
              {step.label}
            </small>
          </div>

          {/* Connector line */}
          {index < steps.length - 1 && (
            <div
              className={`flex-1 h-0.5 mx-1.5 sm:mx-3 mb-4 sm:mb-5 transition-colors ${
                index < activeIndex ? "bg-brand-red" : "bg-gray-200"
              }`}
            />
          )}
        </li>
      ))}
    </ol>
  );
}
