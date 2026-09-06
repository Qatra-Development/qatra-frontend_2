"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, CheckCircle2, FileText, Info, Upload } from "lucide-react";

const HOSPITAL_STEPS = [
    { id: 1, label: "اختيار المسار", status: "completed" },
    { id: 2, label: "بيانات المؤسسة", status: "completed" },
    { id: 3, label: "الخدمات والوثائق", status: "active" },
    { id: 4, label: "إرسال الطلب", status: "upcoming" },
];

const SERVICE_LISTS = {
    blood_request_only: [
        "طلب الدم من مستشفى لديه بنك دم",
        "طلب الدم من بنك الدم المركزي",
        "تجديد لوائح الطلب",
        "تأكيد استلام وحدات الدم",
    ],
    hospital_with_bank: [
        "استقبال طلبات الدم من المستشفيات",
        "استقبال المتبرعين وتسجيل بياناتهم",
        "إدارة المخزون المركزي",
        "تجهيز وحدات الدم وإرسالها للمستشفيات",
    ],
    central_bank: [
        "استقبال طلبات الدم من المستشفيات",
        "استقبال المتبرعين وتسجيل بياناتهم",
        "إدارة المخزون المركزي",
        "تجهيز وحدات الدم وإرسالها للمستشفيات",
    ],
};

const SCOPE_OPTIONS = [
    {
        id: "blood_request_only",
        title: "مؤسسة تطلب الدم فقط",
        description: "تطلب الدم من مستشفى لديه بنك دم أو من بنك الدم المركزي",
    },
    {
        id: "hospital_with_bank",
        title: "مستشفى لديه بنك دم",
        description: "يستقبل المتبرعين ويدير مخزونه ويزود المؤسسات الفرعية",
    },
    {
        id: "central_bank",
        title: "بنك الدم المركزي",
        description: "يستقبل المتبرعين ويزود المستشفيات بالدم عند الطلب",
    },
];

const DOCUMENTS = [
    { id: "license", title: "رخصة مزاولة العمل / الترخيص الصحي", note: "وثيقة رسمية - بحد أقصى PDF 5MB" },
    { id: "authorization-letter", title: "خطاب تفويض ممثل المؤسسة", note: "وثيقة إدارية" },
    { id: "quality-certificate", title: "شهادة الجودة أو الاعتماد", note: "وثيقة اختيارية" },
    { id: "commercial-registry", title: "شهادة السجل التجاري / السجل الوطني", note: "وثيقة اختيارية" },
];

export default function ServicesDocumentsPage() {
    const router = useRouter();
    const [selectedScope, setSelectedScope] = useState("blood_request_only");
    const [fileNames, setFileNames] = useState({});

    const handleFileChange = (id, e) => {
        const file = e.target.files?.[0];
        if (file) {
            setFileNames((prev) => ({ ...prev, [id]: file.name }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        router.push("/verify");
    };

    return (
        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-6 sm:p-10 w-full max-w-3xl mx-auto" dir="rtl">
            {/* 4-Step Indicator */}
            <ol className="flex items-center w-full mb-6 sm:mb-8" aria-label="مراحل التسجيل">
                {HOSPITAL_STEPS.map((step, index) => (
                    <li key={step.id} className="flex items-center flex-1 last:flex-none">
                        {/* Step circle + label */}
                        <div className="flex flex-col items-center gap-1.5">
                            <span
                                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold transition-all ${step.status === "completed"
                                        ? "bg-brand-red text-white"
                                        : step.status === "active"
                                            ? "bg-brand-red text-white ring-4 ring-rose-100"
                                            : "bg-gray-100 text-gray-400 border border-gray-200"
                                    }`}
                            >
                                {step.status === "completed" ? (
                                    <Check className="w-4 h-4 stroke-[2.5]" />
                                ) : (
                                    step.id
                                )}
                            </span>
                            <small
                                className={`text-[10px] sm:text-xs text-center whitespace-nowrap ${step.status === "active"
                                        ? "text-brand-red font-bold"
                                        : step.status === "completed"
                                            ? "text-gray-800 font-semibold"
                                            : "text-gray-400 font-medium"
                                    }`}
                            >
                                {step.label}
                            </small>
                        </div>

                        {/* Connector line */}
                        {index < HOSPITAL_STEPS.length - 1 && (
                            <div
                                className={`flex-1 h-0.5 mx-1.5 sm:mx-3 mb-5 transition-colors ${index < 2 ? "bg-brand-red" : "bg-gray-200"
                                    }`}
                            />
                        )}
                    </li>
                ))}
            </ol>

            {/* Heading */}
            <header className="relative mb-8 text-right">
                <div className="absolute left-0 top-0">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-rose-50 text-brand-red border border-rose-100">
                        خطوة 3 من 4
                    </span>
                </div>
                <p className="text-xs font-bold tracking-wide text-brand-red mb-1">مسار المؤسسات</p>
                <h1 className="text-2xl sm:text-[26px] font-extrabold text-gray-900 tracking-tight mb-2 mt-1">
                    الخدمات والوثائق المطلوبة
                </h1>
                <p className="text-xs sm:text-sm text-brand-gray leading-relaxed">
                    حدد نطاق عمل المؤسسة وارفع الوثائق الرسمية المطلوبة لاستكمال الطلب.
                </p>
            </header>

            <form onSubmit={handleSubmit}>
                {/* Service Scope Section */}
                <section className="mb-6">
                    <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-gray-800 mb-3.5">
                        <span className="text-brand-red font-black text-base leading-none">•</span>
                        <h2>نطاق الخدمات المطلوبة</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                        {SCOPE_OPTIONS.map((option) => {
                            const isActive = selectedScope === option.id;
                            return (
                                <button
                                    key={option.id}
                                    type="button"
                                    onClick={() => setSelectedScope(option.id)}
                                    className={`text-center rounded-xl p-3.5 flex flex-col justify-center transition ${isActive
                                        ? "border-2 border-brand-red bg-rose-50/50"
                                        : "border border-gray-200 bg-white hover:border-gray-300"
                                        }`}
                                >
                                    <h3 className="text-xs font-bold text-gray-900 mb-1.5">{option.title}</h3>
                                    <p className="text-[10px] text-gray-500 leading-snug">{option.description}</p>
                                </button>
                            );
                        })}
                    </div>

                    {/* Available Services */}
                    <div className="bg-[#f8fafb] border border-gray-200/70 rounded-xl p-4 text-gray-700">
                        <h4 className="text-xs font-bold text-gray-800 mb-2.5">الخدمات التي ستتاح بعد الاعتماد</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6 text-[11px] font-medium text-gray-600">
                            {SERVICE_LISTS[selectedScope].map((service) => (
                                <div key={service} className="flex items-center gap-1.5 py-1 text-gray-700">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                                    <span className="text-xs font-medium leading-normal">{service}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Document Upload Section */}
                <section className="mb-6">
                    <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-gray-800 mb-3.5">
                        <FileText className="w-4 h-4 text-brand-red" />
                        <h2>رفع الوثائق الرسمية</h2>
                    </div>

                    <div className="space-y-2.5">
                        {DOCUMENTS.map((doc) => (
                            <div
                                key={doc.id}
                                className="flex items-center justify-between border border-dashed border-gray-300 rounded-xl p-3 bg-white hover:bg-gray-50/50 transition"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-7 h-7 rounded-md bg-rose-50 text-brand-red flex items-center justify-center shrink-0">
                                        <Upload className="w-3.5 h-3.5" />
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold text-gray-800">{doc.title}</h4>
                                        <p className="text-[10px] text-gray-400 font-medium">
                                            {fileNames[doc.id] || doc.note}
                                        </p>
                                    </div>
                                </div>
                                <label
                                    htmlFor={`file-${doc.id}`}
                                    className="text-xs font-bold text-brand-red hover:text-brand-red-dark hover:underline px-2 py-1 cursor-pointer"
                                >
                                    اختيار ملف
                                    <input
                                        id={`file-${doc.id}`}
                                        type="file"
                                        className="hidden"
                                        onChange={(e) => handleFileChange(doc.id, e)}
                                    />
                                </label>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Terms Confirmation */}
                <div className="flex items-center gap-2 mb-6">
                    <input
                        id="agree-terms"
                        type="checkbox"
                        required
                        className="w-4 h-4 accent-brand-red accent-[#9B1B30] text-brand-red border-gray-300 rounded focus:ring-brand-red cursor-pointer"
                    />
                    <label htmlFor="agree-terms" className="text-[11px] sm:text-xs text-gray-600 select-none cursor-pointer">
                        أوافق على شروط الخدمة وسياسة الخصوصية وأقر بصحة البيانات والوثائق.
                    </label>
                </div>

                {/* Post Submission Notice */}
                <aside className="bg-[#eef4f6] rounded-xl p-3.5 mb-8 flex items-start gap-2.5">
                    <Info className="w-4 h-4 text-gray-500 shrink-0 mt-0.5" />
                    <div>
                        <h5 className="text-xs font-bold text-gray-800 mb-0.5">ماذا يحدث بعد الإرسال؟</h5>
                        <p className="text-[11px] text-gray-500 font-normal leading-normal">
                            سيتم مراجعة الطلب والوثائق من قبل إدارة الجهة الصحية قبل تفعيل الحساب.
                        </p>
                    </div>
                </aside>

                {/* Action Buttons */}
                <footer className="flex items-center justify-between pt-2">

                    <Link
                        href="/HospitalPath"
                        className="inline-flex items-center justify-center bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs sm:text-sm font-semibold px-6 py-2.5 rounded-xl transition shadow-sm"
                    >
                        العودة للبيانات
                    </Link>
                    <button
                        type="submit"
                        className="bg-brand-red hover:bg-brand-red-dark active:scale-[0.98] text-white text-xs sm:text-sm font-bold px-8 py-2.5 rounded-xl shadow-sm transition"
                    >
                        إرسال طلب التسجيل
                    </button>
                </footer>
            </form>
        </div>
    );
}
