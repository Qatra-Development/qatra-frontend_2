import { Upload } from "lucide-react";
import { DOCUMENT_ACCEPT } from "@/src/features/auth/constants/institution-registration";
import type { InstitutionDocumentField } from "@/src/features/auth/types/institution-registration.types";

type Props = {
  field: InstitutionDocumentField;
  title: string;
  file?: File;
  error?: string;
  onSelect: (file: File) => void;
  onRemove: () => void;
};

export default function DocumentUploadField({ field, title, file, error, onSelect, onRemove }: Props) {
  return (
    <div className={`border border-dashed rounded-xl p-3 ${error ? "border-brand-red" : "border-gray-300"}`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <Upload className="w-5 h-5 text-brand-red shrink-0" aria-hidden="true" />
          <div className="min-w-0">
            <label htmlFor={field} className="block text-xs font-bold text-gray-800">{title} <span className="text-brand-red">*</span></label>
            <p id={`${field}-hint`} className="text-[11px] text-gray-500 mt-1 break-all">{file ? `${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)` : "مطلوب — PDF / JPG / JPEG / PNG، بحد أقصى 5 MB"}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {file && <button type="button" onClick={onRemove} aria-label={`إزالة ${title}`} className="text-xs text-gray-500 hover:text-brand-red">إزالة</button>}
          <label className="relative overflow-hidden rounded-md text-xs font-bold text-brand-red border border-rose-100 px-3 py-2 cursor-pointer focus-within:ring-2 focus-within:ring-brand-red">
            {file ? "استبدال الملف" : "اختيار ملف"}
            <input id={field} name={field} type="file" accept={DOCUMENT_ACCEPT} aria-required="true" aria-invalid={Boolean(error)} aria-describedby={`${field}-hint${error ? ` ${field}-error` : ""}`} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={(event) => {
              const selected = event.target.files?.[0];
              if (selected) onSelect(selected);
              event.target.value = "";
            }} />
          </label>
        </div>
      </div>
      {error && <p id={`${field}-error`} className="text-xs text-brand-red mt-2" role="alert">{error}</p>}
    </div>
  );
}
