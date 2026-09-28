import { z } from "zod";

import { BLOOD_TYPES } from "../types/blood-request.types";

export const createBloodRequestSchema = z
  .object({
    blood_type: z.enum(BLOOD_TYPES, {
      message: "يرجى اختيار فصيلة الدم.",
    }),

    units_required: z
      .string()
      .trim()
      .min(1, "يرجى إدخال عدد الوحدات.")
      .regex(/^\d+$/, "عدد الوحدات يجب أن يكون رقمًا صحيحًا.")
      .refine(
        (value) => Number(value) > 0,
        "عدد الوحدات يجب أن يكون أكبر من صفر.",
      ),

    priority: z.enum(["normal", "urgent", "emergency"], {
      message: "يرجى اختيار درجة الاستعجال.",
    }),

    needed_date: z.string().min(1, "يرجى تحديد تاريخ الحاجة."),

    needed_time: z.string().min(1, "يرجى تحديد وقت الحاجة."),

    description: z
      .string()
      .trim()
      .min(1, "يرجى كتابة سبب الطلب.")
      .max(2000, "سبب الطلب يجب ألا يتجاوز 2000 حرف."),

    notes: z.string().max(2000, "الملاحظات يجب ألا تتجاوز 2000 حرف."),

    recipient_ids: z
      .array(z.number().int().positive())
      .min(1, "يرجى اختيار جهة موردة واحدة على الأقل.")
      .max(100, "يمكن اختيار 100 جهة كحد أقصى."),
  })
  .superRefine((data, context) => {
    if (!data.needed_date || !data.needed_time) {
      return;
    }

    const date = new Date(`${data.needed_date}T${data.needed_time}:00`);

    if (Number.isNaN(date.getTime())) {
      return;
    }

    if (date.getTime() <= Date.now()) {
      context.addIssue({
        code: "custom",
        path: ["needed_date"],
        message: "وقت الحاجة يجب أن يكون في المستقبل.",
      });
    }
  });

export type CreateBloodRequestForm = z.infer<typeof createBloodRequestSchema>;
