import { z } from "zod";
import { DOCUMENT_MIME_TYPES, GOVERNORATES, INSTITUTION_TYPES, MAX_DOCUMENT_BYTES, SERVICE_SCOPES } from "../constants/institution-registration";

const detailsShape = {
  institutionName: z.string().trim().min(1, "يرجى إدخال اسم المؤسسة."),
  institutionType: z.enum(INSTITUTION_TYPES.map((option) => option.value), { message: "يرجى اختيار نوع المؤسسة." }),
  licenseNumber: z.string().trim().min(1, "يرجى إدخال رقم الترخيص."),
  address: z.string().trim().min(1, "يرجى إدخال عنوان المؤسسة."),
  governorate: z.enum(GOVERNORATES.map((option) => option.value), { message: "يرجى اختيار المحافظة." }),
  representativeName: z.string().trim().min(1, "يرجى إدخال اسم الممثل الرسمي."),
  phone: z.string().trim().regex(/^05[69][0-9]{7}$/, "رقم الهاتف يجب أن يبدأ بـ 056 أو 059 ويتكون من 10 أرقام."),
  email: z.string().trim().email("يرجى إدخال بريد إلكتروني صحيح."),
  password: z.string().min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل.")
    .regex(new RegExp("\\p{L}", "u"), "كلمة المرور يجب أن تحتوي على حروف.")
    .regex(new RegExp("\\p{N}", "u"), "كلمة المرور يجب أن تحتوي على أرقام."),
  passwordConfirmation: z.string(),
};

const matchingPasswords = (data: { password: string; passwordConfirmation: string }) => data.password === data.passwordConfirmation;
const passwordMismatch = { message: "كلمتا المرور غير متطابقتين.", path: ["passwordConfirmation"] };

export const institutionDetailsSchema = z.object(detailsShape).refine(matchingPasswords, passwordMismatch);

export const institutionDocumentSchema = z.file({ message: "يرجى إرفاق المستند المطلوب." })
  .min(1, "الملف فارغ. يرجى اختيار مستند صالح.")
  .max(MAX_DOCUMENT_BYTES, "حجم كل مستند يجب ألا يتجاوز 5 MB.")
  .mime(DOCUMENT_MIME_TYPES, "الملفات المسموحة هي PDF أو JPG أو JPEG أو PNG.");

export const institutionRegistrationSchema = z.object({
  ...detailsShape,
  serviceScope: z.enum(SERVICE_SCOPES.map((option) => option.value), { message: "يرجى اختيار نطاق الخدمات." }),
  documents: z.object({
    practice_license_document: institutionDocumentSchema,
    commercial_registration_document: institutionDocumentSchema,
    representative_authorization_document: institutionDocumentSchema,
    quality_safety_certificate_document: institutionDocumentSchema,
  }),
}).refine(matchingPasswords, passwordMismatch);
