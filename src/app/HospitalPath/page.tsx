"use client";

import React, { useEffect, useState } from "react";
import StatusBanner from "./components/StatusBanner";
import InfoCard, { InfoField } from "./components/InfoCard";
import DocumentsGrid from "./components/DocumentsGrid";
import InstitutionResubmissionForm from "./components/InstitutionResubmissionForm";
import { getInstitutionStatus } from "@/src/features/institution/services/institution.service";
import type { InstitutionStatusData } from "@/src/features/institution/types/institution.types";
import {
  INSTITUTION_TYPE_MAP,
  SERVICE_SCOPE_MAP,
  formatArabicDate,
} from "@/src/features/institution/utils/formatters";

const displayValue = (value?: string | null) => value?.trim() || "—";

export default function HospitalPathPage() {
  const [data, setData] = useState<InstitutionStatusData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const canResubmit =
    data?.status === "rejected" || data?.status === "needs_completion";

  const fetchStatus = async () => {
    await Promise.resolve();

    try {
      setIsLoading(true);
      setError(null);
      const res = await getInstitutionStatus();
      if (res?.data) {
        setData(res.data);
      } else {
        setData(null);
        setError("لم يُرجع الخادم بيانات المؤسسة.");
      }
    } catch (err: unknown) {
      console.warn("Could not fetch latest status from backend:", err);
      setData(null);
      setError("تعذر تحميل بيانات المؤسسة من الخادم.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchStatus();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col animate-pulse space-y-5">
        {/* Banner Skeleton */}
        <div className="h-28 bg-slate-200/70 rounded-2xl w-full" />

        {/* Main Card Skeleton */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 flex-1 space-y-4">
          <div className="h-6 bg-slate-200 rounded w-1/4" />
          <div className="h-4 bg-slate-100 rounded w-2/3" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="h-56 bg-slate-100 rounded-xl" />
            <div className="h-56 bg-slate-100 rounded-xl" />
          </div>
          <div className="h-28 bg-slate-100 rounded-xl mt-4" />
        </div>
      </div>
    );
  }

  // Institution fields mapped dynamically
  const institutionFields: InfoField[] = [
    {
      label: "اسم المؤسسة",
      value: displayValue(data?.institution_name),
      hasBottomBorder: true,
    },
    {
      label: "نوع المؤسسة",
      value:
        (data?.institution_type &&
          INSTITUTION_TYPE_MAP[data.institution_type]) ||
        displayValue(data?.institution_type),
      hasBottomBorder: true,
    },
    {
      label: "نطاق العمل",
      value:
        (data?.service_scope && SERVICE_SCOPE_MAP[data.service_scope]) ||
        displayValue(data?.service_scope),
      hasBottomBorder: true,
    },
    {
      label: "رقم الترخيص",
      value: displayValue(data?.license_number),
      isMono: true,
      hasBottomBorder: true,
    },
    {
      label: "المحافظة",
      value: displayValue(data?.governorate),
      hasBottomBorder: true,
    },
    {
      label: "العنوان",
      value: displayValue(data?.address),
      hasBottomBorder: true,
    },
    {
      label: "هاتف المؤسسة",
      value: displayValue(data?.phone_number),
      isMono: true,
      isLtr: true,
    },
    {
      label: "البريد الإلكتروني",
      value: displayValue(data?.email),
      isMono: true,
      isLtr: true,
      smallText: true,
    },
  ];

  // Representative fields mapped dynamically
  const rep = data?.representative;
  const representativeFields: InfoField[] = [
    {
      label: "الاسم الكامل",
      value: displayValue(rep?.representative_name || rep?.user?.name),
      hasBottomBorder: true,
    },
    {
      label: "الصفة الوظيفية",
      value: "الممثل الرسمي ومدير الحساب",
      hasBottomBorder: true,
    },
    {
      label: "رقم الهاتف",
      value: displayValue(data?.phone_number),
      isMono: true,
      isLtr: true,
      hasBottomBorder: true,
    },
    {
      label: "البريد الإلكتروني",
      value: displayValue(data?.email),
      isMono: true,
      isLtr: true,
      smallText: true,
      hasBottomBorder: true,
    },
    {
      label: "تاريخ التسجيل",
      value: formatArabicDate(rep?.created_at || rep?.user?.created_at),
    },
    {
      label: "عدد مرات الرفض",
      value:
        rep?.rejection_count === undefined
          ? "—"
          : String(rep.rejection_count),
      isMono: true,
    },
  ];

  return (
    <>
      {/* Dynamic Status Banner */}
      <StatusBanner status={data?.status || "needs_completion"} />

      {/* Main Status & Details Card */}
      <section
        className="bg-white rounded-2xl border border-slate-200/80 p-5 lg:p-6 shadow-sm flex-1 flex flex-col"
        data-purpose="details-container"
      >
        {/* Header description */}
        <div className="mb-5 pb-1">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-base font-bold text-slate-800 mb-1.5">
              {data?.status === "approved"
                ? "المؤسسة معتمدة"
                : data?.status === "rejected"
                ? "تم رفض طلب اعتماد المؤسسة"
                : data?.status === "needs_completion"
                ? "عليك استكمال البيانات"
                : "طلبك قيد المراجعة"}
              </h1>
              <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
              {data?.status === "approved"
                ? "تم اعتماد مؤسستك رسميًا في منصة قطرة. يمكنك الآن الاستفادة من جميع الميزات والخدمات."
                : data?.status === "rejected"
                ? "تعذر اعتماد طلب مؤسستك. يرجى مراجعة سبب الرفض وتعديل بيانات الطلب ثم إعادة الإرسال."
                : data?.status === "needs_completion"
                ? "قام مشرف هيئة الصحة بطلب استكمال بعض المستندات أو البيانات. يرجى مراجعة الملاحظات أدناه."
                : "تم استلام طلب اعتماد مؤسستك بنجاح وهو الآن قيد المراجعة من الجهة المختصة. سيتم إشعارك عند تحديث حالة الطلب."}
              </p>
            </div>

            {data?.status === "needs_completion" ? (
              <button
                type="button"
                onClick={() => setIsEditFormOpen(true)}
                className="shrink-0 rounded-md bg-[#B4233A] px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-[#991F32]"
              >
                تعديل البيانات وإعادة التقديم
              </button>
            ) : error && (
              <button
                onClick={fetchStatus}
                className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
              >
                إعادة المحاولة
              </button>
            )}
          </div>

          {data && canResubmit && (
            <div
              className={`mt-4 rounded-lg px-4 py-3 ${
                data.status === "needs_completion"
                  ? "bg-[#FFF9FA] md:px-5 md:py-4"
                  : "bg-[#FFF8F8]"
              }`}
            >
              <div className="mb-2 flex items-center gap-2 text-xs font-bold text-[#B4233A]">
                <span className="flex h-4 w-4 items-center justify-center rounded-full border border-[#B4233A] text-[10px]">
                  !
                </span>
                <span>
                  {data.status === "rejected"
                    ? "سبب الرفض"
                    : "سبب طلب الاستكمال"}
                </span>
              </div>
              <p className="pr-6 text-xs leading-relaxed text-slate-600">
                {data.status === "needs_completion"
                  ? "قامت الجهة المختصة بمراجعة طلبك وتبين بأنك بحاجة إلى استكمال بعض البيانات قبل الموافقة على إعادة الطلب."
                  : data.review_notes ||
                    "الملفات المقدمة لا تستوفي متطلبات الاعتماد. يرجى مراجعة البيانات والمستندات وإعادة تقديم الطلب."}
              </p>
            </div>
          )}
        </div>

        {data && canResubmit && isEditFormOpen ? (
          <InstitutionResubmissionForm
            data={data}
            onCancel={() => setIsEditFormOpen(false)}
            onSuccess={async () => {
              setIsEditFormOpen(false);
              await fetchStatus();
            }}
          />
        ) : (
          <>
            {/* Two Columns Data Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <InfoCard
                title="بيانات المؤسسة"
                subtitle="البيانات القانونية والتشغيلية"
                icon="institution"
                fields={institutionFields}
                dataPurpose="institution-data"
              />

              <InfoCard
                title="الممثل الرسمي"
                subtitle="صاحب الحساب والمسؤول عن المؤسسة"
                icon="representative"
                fields={representativeFields}
                dataPurpose="representative-data"
              />
            </div>

            <DocumentsGrid rawDocuments={data?.documents} />
          </>
        )}
      </section>
    </>
  );
}
