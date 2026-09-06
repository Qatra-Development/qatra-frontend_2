import { z } from "zod";

export const loginSchema = z.object({
  identifier: z
    .string()
    .trim()
    .min(1, "يرجى إدخال رقم الهاتف أو البريد الإلكتروني."),

  password: z
    .string()
    .min(1, "يرجى إدخال كلمة المرور.")
    .min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل."),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const loginRequestSchema = loginSchema.extend({
  rememberMe: z.boolean().default(false),
});

export type LoginRequestData = z.infer<typeof loginRequestSchema>;

const emailSchema = z.string().trim().email("يرجى إدخال بريد إلكتروني صحيح.");
const passwordSchema = z.string().min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل.");

export const donorRegistrationSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(3, "الاسم الكامل يجب أن يكون 3 أحرف على الأقل.")
      .max(100, "الاسم الكامل يجب ألا يتجاوز 100 حرف.")
      .regex(new RegExp("^[\\p{L}\\p{M}\\s'’-]+$", "u"), "الاسم يجب أن يحتوي على حروف فقط، دون أرقام أو رموز."),
    nationalId: z.string().trim().regex(/^[0-9]{9}$/, "رقم الهوية يجب أن يتكون من 9 أرقام."),
    bloodType: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"], {
      message: "يرجى اختيار فصيلة الدم.",
    }),
    region: z.enum(["north-gaza", "gaza", "deir-al-balah", "khan-yunis", "rafah"], {
      message: "يرجى اختيار المحافظة.",
    }),
    phone: z.string().trim().regex(/^05[69][0-9]{7}$/, "رقم الجوال يجب أن يبدأ بـ 056 أو 059 ويتكون من 10 أرقام."),
    email: emailSchema.max(150, "البريد الإلكتروني يجب ألا يتجاوز 150 حرفًا."),
    password: passwordSchema
      .regex(new RegExp("\\p{L}", "u"), "كلمة المرور يجب أن تحتوي على حرف واحد على الأقل.")
      .regex(new RegExp("\\p{N}", "u"), "كلمة المرور يجب أن تحتوي على رقم واحد على الأقل."),
    passwordConfirmation: z.string(),
    termsAccepted: z.literal(true, { message: "يجب الموافقة على الشروط وسياسة الخصوصية." }),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "كلمتا المرور غير متطابقتين.",
    path: ["passwordConfirmation"],
  });

export const verificationCodeSchema = z.object({
  email: emailSchema,
  code: z.string().regex(/^\d{4}$/, "رمز التحقق يجب أن يتكون من 4 أرقام."),
});

export const forgotPasswordSchema = z.object({ email: emailSchema });

export const resetPasswordSchema = verificationCodeSchema
  .extend({
    password: passwordSchema,
    passwordConfirmation: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "كلمتا المرور غير متطابقتين.",
    path: ["passwordConfirmation"],
  });
