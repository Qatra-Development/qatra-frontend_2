"use client";

import Link from "next/link";
import { FileText, Info } from "lucide-react";
import { INSTITUTION_DOCUMENTS, INSTITUTION_FIELD_MAP } from "@/src/features/auth/constants/institution-registration";
import { useInstitutionDocumentsForm } from "@/src/features/auth/hooks/use-institution-registration";
import InstitutionSteps from "./InstitutionSteps";
import ServiceScopeSelector from "./ServiceScopeSelector";
import DocumentUploadField from "./DocumentUploadField";

export default function InstitutionDocumentsForm() {
  const form = useInstitutionDocumentsForm();

  if (!form.details) {
    return (
      <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 w-full max-w-2xl" dir="rtl">
        <InstitutionSteps current={2} />
        <h1 className="text-xl font-bold text-gray-900 mb-3">أكمل بيانات المؤسسة أولًا</h1>
        <p className="text-sm text-brand-gray mb-6">لإرسال الوثائق نحتاج بيانات المؤسسة من الخطوة السابقة. إذا أعدت تحميل الصفحة، يرجى إدخالها مجددًا.</p>
        <Link href="/HospitalPath" className="inline-block rounded-xl bg-brand-red text-white px-6 py-3 text-sm">إدخال بيانات المؤسسة</Link>
      </section>
    );
  }

  const hasDetailsErrors = Object.keys(INSTITUTION_FIELD_MAP).some((field) => form.errors[field]);

  return (
    <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-6 sm:p-10 w-full max-w-3xl mx-auto" dir="rtl">
      <InstitutionSteps current={3} />
      <header className="mb-8 text-right">
        <div className="flex items-center justify-between gap-2 mb-2">
          <p className="text-xs font-bold text-brand-red">مسار المؤسسات</p>
          <span className="px-3 py-1 rounded-full text-xs bg-rose-50 text-brand-red border border-rose-100">خطوة 3 من 4</span>
        </div>
        <h1 className="text-2xl sm:text-[26px] font-extrabold text-gray-900 mb-2">الخدمات والوثائق المطلوبة</h1>
        <p className="text-xs sm:text-sm text-brand-gray">حدد نطاق عمل المؤسسة وارفع الوثائق الرسمية المطلوبة لاستكمال الطلب.</p>
      </header>
      <form onSubmit={form.handleSubmit} noValidate aria-busy={form.isLoading}>
        <fieldset disabled={form.isLoading}>
          <legend className="sr-only">الخدمات والوثائق</legend>
          <ServiceScopeSelector value={form.serviceScope} onChange={form.setServiceScope} error={form.errors.serviceScope} />
          <section className="mb-6" aria-labelledby="institution-documents-heading">
            <h2 id="institution-documents-heading" className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-3.5"><FileText className="w-4 h-4 text-brand-red" />رفع الوثائق الرسمية</h2>
            <div className="space-y-2.5">
              {INSTITUTION_DOCUMENTS.map(({ field, title }) => (
                <DocumentUploadField key={field} field={field} title={title} file={form.documents[field]} error={form.errors[field]} onSelect={(file) => form.selectDocument(field, file)} onRemove={() => form.setDocument(field)} />
              ))}
            </div>
          </section>
          {hasDetailsErrors && <p role="alert" className="bg-rose-50 rounded-xl p-3 text-xs text-brand-red mb-4">بعض بيانات المؤسسة تحتاج إلى تصحيح. <Link href="/HospitalPath" className="font-bold underline">مراجعة بيانات المؤسسة</Link></p>}
          <div className="mb-6">
            <label className="flex items-start gap-2 text-xs text-gray-600 cursor-pointer">
              <input name="termsAccepted" type="checkbox" checked={form.termsAccepted} onChange={(event) => form.setTermsAccepted(event.target.checked)} aria-invalid={Boolean(form.errors.termsAccepted)} aria-describedby={form.errors.termsAccepted ? "institution-terms-error" : undefined} className="w-4 h-4 shrink-0 accent-brand-red" />
              أوافق على شروط الخدمة وسياسة الخصوصية وأقر بصحة البيانات والوثائق.
            </label>
            {form.errors.termsAccepted && <p id="institution-terms-error" role="alert" className="text-xs text-brand-red mt-2">{form.errors.termsAccepted}</p>}
          </div>
          <aside className="bg-[#eef4f6] rounded-xl p-3.5 mb-8 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-gray-500 shrink-0 mt-0.5" />
            <div><h3 className="text-xs font-bold text-gray-800 mb-1">ماذا يحدث بعد الإرسال؟</h3><p className="text-xs text-gray-500 leading-relaxed">سنرسل رمز تحقق إلى بريد المؤسسة. بعد تأكيد البريد ينتقل الطلب والوثائق إلى مراجعة الإدارة قبل الاعتماد.</p></div>
          </aside>
          <footer className="flex flex-wrap items-center justify-between gap-3">
            {form.isLoading ? <span className="text-xs text-gray-400">العودة للبيانات</span> : <Link href="/HospitalPath" className="border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs sm:text-sm font-semibold px-6 py-2.5 rounded-xl">العودة للبيانات</Link>}
            <button type="submit" className="bg-brand-red hover:bg-brand-red-dark disabled:opacity-60 text-white text-xs sm:text-sm font-bold px-8 py-2.5 rounded-xl shadow-sm">{form.isLoading ? "جاري رفع المستندات وإرسال الطلب..." : "إرسال طلب التسجيل"}</button>
          </footer>
        </fieldset>
      </form>
    </div>
  );
}
