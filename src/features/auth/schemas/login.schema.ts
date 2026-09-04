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
    fullName: z.string().trim().min(2, "يرجى إدخال الاسم الكامل."),
    nationalId: z.string().trim().min(8, "يرجى إدخال رقم هوية صحيح."),
    bloodType: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"], {
      message: "يرجى اختيار فصيلة الدم.",
    }),
    region: z.enum(["north-gaza", "gaza", "deir-al-balah", "khan-yunis", "rafah"], {
      message: "يرجى اختيار المحافظة.",
    }),
    phone: z.string().trim().regex(/^05\d{8}$/, "يرجى إدخال رقم جوال فلسطيني صحيح."),
    email: emailSchema,
    password: passwordSchema,
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
