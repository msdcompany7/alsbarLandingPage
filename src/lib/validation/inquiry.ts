import { z } from "zod";

const phoneRegex = /^[\d\s+\-()]{9,20}$/;

export const inquiryFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "נא להזין שם (לפחות 2 תווים)")
    .max(120, "השם ארוך מדי"),
  phone: z
    .string()
    .trim()
    .min(9, "נא להזין מספר טלפון תקין")
    .max(30, "מספר הטלפון ארוך מדי")
    .regex(phoneRegex, "נא להזין מספר טלפון תקין"),
  email: z
    .string()
    .trim()
    .max(200, "כתובת האימייל ארוכה מדי")
    .refine(
      (value) => value === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
      "נא להזין כתובת אימייל תקינה",
    )
    .optional()
    .or(z.literal("")),
  message: z
    .string()
    .trim()
    .max(2000, "ההודעה ארוכה מדי (עד 2000 תווים)")
    .optional()
    .or(z.literal("")),
});

export type InquiryFormValues = z.infer<typeof inquiryFormSchema> & {
  website?: string;
};

export const inquiryFormSchemaWithHoneypot = inquiryFormSchema.extend({
  website: z.string().optional().or(z.literal("")),
});

export const inquiryApiSchema = inquiryFormSchema.transform((data) => ({
  name: data.name,
  phone: data.phone,
  email: data.email || undefined,
  message: data.message || undefined,
}));
