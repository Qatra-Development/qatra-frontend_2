import ReviewInfoSection from "../ReviewInfoSection";

import type { AdminInstitution } from "../../../types/institutions.types";

import { getInstitutionTypeLabel } from "../../../lib/institutions.utils";

interface Props {
  institution: AdminInstitution;
}

export default function InstitutionDataStep({ institution }: Props) {
  const representative = institution.representative;

  return (
    <div
      className="
        grid
        gap-5
        lg:grid-cols-2
      "
    >
      <ReviewInfoSection
        title="البيانات الأساسية"
        rows={[
          {
            label: "اسم المؤسسة",
            value: institution.institution_name,
          },
          {
            label: "نوع المؤسسة",
            value: getInstitutionTypeLabel(institution.institution_type),
          },
          {
            label: "رقم الترخيص",
            value: <bdi dir="ltr">{institution.license_number}</bdi>,
          },
          {
            label: "المدينة / المحافظة",
            value: institution.governorate || "غير متوفر",
          },
          {
            label: "العنوان التفصيلي",
            value: institution.address || "غير متوفر",
          },
          {
            label: "تاريخ التأسيس",
            value: "غير متوفر",
          },
        ]}
      />

      <ReviewInfoSection
        title="بيانات التواصل"
        rows={[
          {
            label: "رقم الهاتف",
            value: <bdi dir="ltr">{institution.phone_number}</bdi>,
          },
          {
            label: "رقم الفاكس",
            value: "غير متوفر",
          },
          {
            label: "البريد الإلكتروني",
            value: <bdi dir="ltr">{institution.email}</bdi>,
          },
          {
            label: "الموقع الإلكتروني",
            value: "غير متوفر",
          },
          {
            label: "العنوان البريدي",
            value: "غير متوفر",
          },
        ]}
      />

      <ReviewInfoSection
        title="بيانات ممثل المؤسسة"
        className="lg:col-span-2"
        rows={[
          {
            label: "الاسم الكامل",
            value: representative?.representative_name || "غير متوفر",
          },
          {
            label: "المسمى الوظيفي",
            value: "غير متوفر",
          },
          {
            label: "رقم الهوية",
            value: "غير متوفر",
          },
          {
            label: "رقم الجوال",
            value: (
              <bdi dir="ltr">
                {representative?.user?.phone || institution.phone_number}
              </bdi>
            ),
          },
          {
            label: "البريد الإلكتروني",
            value: (
              <bdi dir="ltr">
                {representative?.user?.email || institution.email}
              </bdi>
            ),
          },
          {
            label: "صلاحية التوقيع",
            value: "غير متوفر",
          },
        ]}
      />
    </div>
  );
}
