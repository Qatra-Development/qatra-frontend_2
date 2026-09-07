export const INSTITUTION_TYPES = [
  { value: "central_hospital", label: "مستشفى مركزي" },
  { value: "field_hospital", label: "مستشفى ميداني" },
  { value: "health_center", label: "مركز صحي" },
  { value: "blood_bank_association", label: "جمعية بنك دم" },
  { value: "independent_blood_center", label: "مركز دم مستقل" },
] as const;

export const GOVERNORATES = [
  { value: "North Gaza", label: "شمال غزة" },
  { value: "Gaza", label: "غزة" },
  { value: "Deir al-Balah", label: "الوسطى" },
  { value: "Khan Yunis", label: "خان يونس" },
  { value: "Rafah", label: "رفح" },
] as const;

const BLOOD_REQUEST_SERVICES = ["طلب وحدات الدم", "متابعة طلبات الدم", "تأكيد استلام وحدات الدم"];
const BLOOD_BANK_SERVICES = ["استقبال المتبرعين", "إدارة مخزون الدم", "تجهيز وحدات الدم وتزويد المؤسسات"];

export const SERVICE_SCOPES = [
  { value: "blood_request_only", title: "طلب الدم فقط", description: "مؤسسة تطلب الدم من المستشفيات وبنوك الدم", services: BLOOD_REQUEST_SERVICES },
  { value: "blood_bank_services_only", title: "خدمات بنك الدم فقط", description: "استقبال المتبرعين وإدارة المخزون وتزويد المؤسسات", services: BLOOD_BANK_SERVICES },
  { value: "blood_request_and_blood_bank", title: "طلب الدم وخدمات بنك الدم", description: "مؤسسة تجمع بين طلب الدم وخدمات بنك الدم", services: [...BLOOD_REQUEST_SERVICES, ...BLOOD_BANK_SERVICES] },
] as const;

export const INSTITUTION_DOCUMENTS = [
  { field: "practice_license_document", title: "رخصة مزاولة العمل / الترخيص الصحي" },
  { field: "representative_authorization_document", title: "خطاب تفويض ممثل المؤسسة" },
  { field: "quality_safety_certificate_document", title: "شهادة الجودة والسلامة" },
  { field: "commercial_registration_document", title: "شهادة السجل التجاري / السجل الوطني" },
] as const;

export const MAX_DOCUMENT_BYTES = 5 * 1024 * 1024;
export const DOCUMENT_MIME_TYPES = ["application/pdf", "image/jpeg", "image/png"];
export const DOCUMENT_ACCEPT = ".pdf,.jpg,.jpeg,.png";

export const INSTITUTION_FIELD_MAP = {
  institutionName: "institution_name",
  institutionType: "institution_type",
  licenseNumber: "license_number",
  address: "address",
  governorate: "governorate",
  representativeName: "representative_name",
  phone: "phone",
  email: "email",
  password: "password",
  passwordConfirmation: "password_confirmation",
} as const;
