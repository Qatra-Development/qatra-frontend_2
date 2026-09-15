export const INSTITUTION_TYPE_MAP: Record<string, string> = {
  central_hospital: "مستشفى مركزي",
  field_hospital: "مستشفى ميداني",
  health_center: "مركز صحي",
  blood_bank_association: "جمعية بنك دم",
  independent_blood_center: "مركز نقل دم مستقل",
};

export const SERVICE_SCOPE_MAP: Record<string, string> = {
  blood_request_only: "طلب وحدات دم فقط",
  blood_bank_services_only: "خدمات بنك دم فقط",
  blood_request_and_blood_bank: "مستشفى لديه بنك دم",
};

export const DOCUMENT_TYPE_MAP: Record<string, string> = {
  practice_license: "رخصة مزاولة العمل",
  commercial_registration: "السجل التجاري",
  representative_authorization: "خطاب تفويض الممثل",
  quality_safety_certificate: "شهادة الجودة أو الاعتماد",
};

export const INSTITUTION_STATUS_MAP: Record<
  string,
  {
    title: string;
    description: string;
    badge: string;
    color: "amber" | "green" | "red" | "blue";
  }
> = {
  pending_verification: {
    title: "بانتظار تفعيل البريد الإلكتروني",
    description: "يرجى التحقق من بريدك الإلكتروني لإرسال الطلب للمراجعة.",
    badge: "بانتظار التفعيل",
    color: "blue",
  },
  pending_review: {
    title: "طلبك قيد مراجعة مشرف الصحة",
    description: "لا يمكن تنفيذ الطلبات أو إدارة المخزون والتبرعات قبل اعتماد المؤسسة",
    badge: "طلب اعتماد المؤسسة",
    color: "amber",
  },
  needs_completion: {
    title: "طلبك بحاجة لاستكمال بيانات",
    description: "بعد مراجعة طلب مؤسستك، عليك استكمال بياناتك وإعادة طلب الاعتماد",
    badge: "طلب اعتماد المؤسسة",
    color: "amber",
  },
  approved: {
    title: "تم اعتماد المؤسسة بنجاح",
    description: "مؤسستك معتمدة الآن ويمكنك استخدام كافة خدمات المنصة وإدارة التبرعات.",
    badge: "مؤسسة معتمدة",
    color: "green",
  },
  rejected: {
    title: "تم رفض طلب الاعتماد",
    description: "تعذر اعتماد طلب مؤسستك. اقرأ ملاحظات المشرف، ثم راجع بيانات الطلب وأعد إرساله.",
    badge: "طلب اعتماد المؤسسة",
    color: "red",
  },
};

export const DOCUMENT_STATUS_MAP: Record<
  string,
  { label: string; bg: string; text: string }
> = {
  pending: {
    label: "مرفق",
    bg: "rgb(209, 225, 225)",
    text: "rgb(55, 98, 99)",
  },
  approved: {
    label: "معتمد",
    bg: "#dcfce7",
    text: "#15803d",
  },
  rejected: {
    label: "مرفوض",
    bg: "#fee2e2",
    text: "#b91c1c",
  },
};

export function formatArabicDate(dateStr?: string): string {
  if (!dateStr) return "—";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return new Intl.DateTimeFormat("ar-EG", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(d);
  } catch {
    return dateStr;
  }
}
