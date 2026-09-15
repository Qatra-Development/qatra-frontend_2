import { z } from "zod";

export const reviewDecisionSchema = z.discriminatedUnion("decision", [
  z.object({
    decision: z.literal("approve"),
  }),

  z.object({
    decision: z.literal("request_completion"),

    notes: z
      .string()
      .trim()
      .min(5, "يرجى كتابة تفاصيل واضحة لا تقل عن 5 أحرف.")
      .max(2000, "يجب ألا تتجاوز الملاحظات 2000 حرف."),
  }),

  z.object({
    decision: z.literal("reject"),

    notes: z
      .string()
      .trim()
      .min(5, "يرجى كتابة سبب الرفض، 5 أحرف على الأقل.")
      .max(2000, "يجب ألا يتجاوز سبب الرفض 2000 حرف."),
  }),
]);
