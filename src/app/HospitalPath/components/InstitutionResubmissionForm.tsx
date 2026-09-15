"use client";

import { useState, type FormEvent } from "react";
import { Building2, FileText, Upload, UserRound } from "lucide-react";
import { toast } from "sonner";
import { GOVERNORATES, INSTITUTION_DOCUMENTS, INSTITUTION_TYPES, SERVICE_SCOPES } from "@/src/features/auth/constants/institution-registration";
import { resubmitInstitution } from "@/src/features/institution/services/institution.service";
import type { InstitutionStatusData } from "@/src/features/institution/types/institution.types";
import { DOCUMENT_TYPE_MAP } from "@/src/features/institution/utils/formatters";
import { ApiError, getApiErrorMessage } from "@/src/lib/api/errors";

type Props = { data: InstitutionStatusData; onCancel: () => void; onSuccess: () => Promise<void> | void };
const inputClassName = "h-9 w-full rounded-md border border-[#E4DED8] bg-[#FAFAFA] px-3 text-xs font-semibold text-slate-700 outline-none transition focus:border-[#B4233A] focus:ring-1 focus:ring-[#B4233A]";

export default function InstitutionResubmissionForm({ data, onCancel, onSuccess }: Props) {
  const [values, setValues] = useState({
    institution_name: data.institution_name || "",
    institution_type: data.institution_type || "",
    service_scope: data.service_scope || "",
    license_number: data.license_number || "",
    governorate: data.governorate || "",
    address: data.address || "",
    phone_number: data.phone_number || "",
    email: data.email || "",
    representative_name: data.representative?.representative_name || data.representative?.user?.name || "",
    representative_role: "الممثل الرسمي ومدير الحساب",
  });
  const [documents, setDocuments] = useState<Record<string, File>>({});
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const updateValue = (name: keyof typeof values, value: string) => setValues((current) => ({ ...current, [name]: value }));

  const field = (name: keyof typeof values, label: string, options?: readonly { value: string; label?: string; title?: string }[], type = "text") => {
    const error = fieldErrors[name === "phone_number" ? "phone" : name]?.[0];
    return (
      <label className="block space-y-1.5 text-[10px] font-medium text-slate-500">
        <span>{label} <span className="text-[#B4233A]">*</span></span>
        {options ? (
          <select required value={values[name]} onChange={(event) => updateValue(name, event.target.value)} className={`${inputClassName} appearance-none`}>
            {name !== "service_scope" && <option value="">اختر من القائمة</option>}
            {options.map((option) => <option key={option.value} value={option.value}>{option.label || option.title}</option>)}
          </select>
        ) : (
          <input required={name !== "representative_role"} readOnly={name === "representative_role"} type={type} value={values[name]} onChange={(event) => updateValue(name, event.target.value)} className={`${inputClassName} ${type === "email" || type === "tel" ? "text-left" : ""}`} dir={type === "email" || type === "tel" ? "ltr" : undefined} />
        )}
        {error && <span className="block text-[10px] text-[#B4233A]">{error}</span>}
      </label>
    );
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setFieldErrors({});
    const payload = new FormData();
    payload.append("institution_name", values.institution_name);
    payload.append("institution_type", values.institution_type);
    payload.append("license_number", values.license_number);
    payload.append("address", values.address);
    payload.append("governorate", values.governorate);
    payload.append("phone", values.phone_number);
    payload.append("email", values.email);
    payload.append("representative_name", values.representative_name);
    payload.append("service_scope", values.service_scope);
    Object.entries(documents).forEach(([name, file]) => payload.append(name, file));
    try {
      const response = await resubmitInstitution(payload);
      toast.success(response.message || "تم تعديل البيانات وإعادة إرسال الطلب بنجاح.");
      await onSuccess();
    } catch (error) {
      if (error instanceof ApiError && error.fieldErrors) setFieldErrors(error.fieldErrors);
      toast.error(getApiErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const sectionHeader = (title: string, description: string, icon: "building" | "files" | "user") => (
    <header className="mb-4 flex items-center gap-2.5 border-b border-[#E4DED8] pb-3">
      <span className="flex h-8 w-8 items-center justify-center rounded-md bg-rose-50 text-[#B4233A]">
        {icon === "building" ? <Building2 className="h-4 w-4" /> : icon === "files" ? <FileText className="h-4 w-4" /> : <UserRound className="h-4 w-4" />}
      </span>
      <div><h2 className="text-xs font-bold text-slate-800">{title}</h2><p className="mt-0.5 text-[10px] text-slate-400">{description}</p></div>
    </header>
  );

  return (
    <form className="mb-5 space-y-4" onSubmit={handleSubmit}>
      <section className="rounded-xl border border-[#E4DED8] bg-white p-4 shadow-sm">
        {sectionHeader("بيانات المؤسسة", "إمكانية تحديث بيانات المؤسسة الأساسية", "building")}
        <div className="grid grid-cols-1 gap-x-4 gap-y-3 md:grid-cols-2">
          {field("institution_name", "اسم المؤسسة")}{field("institution_type", "نوع المؤسسة", INSTITUTION_TYPES)}
          {field("service_scope", "نطاق العمل", SERVICE_SCOPES)}{field("license_number", "رقم الترخيص")}
          {field("governorate", "المحافظة", GOVERNORATES)}{field("address", "العنوان")}
        </div>
      </section>

      <section className="rounded-xl border border-[#E4DED8] bg-white p-4 shadow-sm">
        {sectionHeader("الوثائق المرفقة", "يمكنك استبدال المستندات التي تحتاج إلى تعديل", "files")}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {INSTITUTION_DOCUMENTS.map(({ field: documentField, title }) => {
            const documentType = documentField.replace(/_document$/, "");
            const existingDocument = data.documents?.find((document) => document.document_type === documentType);
            const selectedFile = documents[documentField];
            return (
              <article key={documentField} className="rounded-lg border border-[#E4DED8] p-3">
                <div className="mb-3 flex items-start justify-between gap-2">
                  <div className="min-w-0"><h3 className="text-[10px] font-bold leading-relaxed text-slate-700">{DOCUMENT_TYPE_MAP[documentType] || title}</h3><p className="mt-1 truncate text-[9px] text-slate-400">{selectedFile?.name || (existingDocument ? "مرفق حاليًا" : "لم يتم إرفاق ملف")}</p></div>
                  <span className="shrink-0 rounded-full bg-[#E8F1F1] px-2 py-1 text-[8px] font-bold text-[#376263]">{selectedFile ? "جديد" : existingDocument ? "مرفق" : "مطلوب"}</span>
                </div>
                <label className="flex cursor-pointer items-center justify-center gap-1 rounded-md border border-[#E4DED8] py-1.5 text-[9px] font-bold text-slate-500 hover:border-[#B4233A] hover:text-[#B4233A]">
                  <Upload className="h-3 w-3" />{existingDocument || selectedFile ? "استبدال" : "اختيار ملف"}
                  <input type="file" className="sr-only" accept=".pdf,.jpg,.jpeg,.png" onChange={(event) => { const file = event.target.files?.[0]; if (file) setDocuments((current) => ({ ...current, [documentField]: file })); }} />
                </label>
                {fieldErrors[documentField]?.[0] && <p className="mt-2 text-[9px] text-[#B4233A]">{fieldErrors[documentField][0]}</p>}
              </article>
            );
          })}
        </div>
      </section>

      <section className="rounded-xl border border-[#E4DED8] bg-white p-4 shadow-sm">
        {sectionHeader("بيانات الممثل الرسمي", "بيانات صاحب الحساب والمسؤول عن المؤسسة", "user")}
        <div className="grid grid-cols-1 gap-x-4 gap-y-3 md:grid-cols-2">
          {field("representative_name", "اسم الممثل")}{field("representative_role", "الصفة الوظيفية")}
          {field("phone_number", "رقم الهاتف", undefined, "tel")}{field("email", "البريد الإلكتروني", undefined, "email")}
        </div>
      </section>

      <footer className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-slate-50 px-4 py-3">
        <p className="text-[10px] text-slate-400">راجع البيانات والمرفقات قبل إعادة إرسال الطلب.</p>
        <div className="flex items-center gap-2">
          <button type="button" onClick={onCancel} disabled={isSubmitting} className="rounded-md border border-[#E4DED8] bg-white px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 disabled:opacity-60">إلغاء</button>
          <button type="submit" disabled={isSubmitting} className="rounded-md bg-[#B4233A] px-4 py-2 text-xs font-bold text-white hover:bg-[#991F32] disabled:cursor-not-allowed disabled:opacity-60">{isSubmitting ? "جاري الإرسال..." : "حفظ وإعادة التقديم"}</button>
        </div>
      </footer>
    </form>
  );
}
