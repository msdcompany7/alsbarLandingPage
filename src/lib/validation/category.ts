import { z } from "zod";

export const categoryFormSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(1, "נדרש slug")
    .max(120, "slug ארוך מדי")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "slug חייב להיות באנגלית, מספרים ומקפים"),
  nameHe: z.string().trim().min(1, "נדרש שם בעברית").max(120),
  nameEn: z.string().trim().max(120).optional().or(z.literal("")),
  description: z.string().trim().max(2000).optional().or(z.literal("")),
  parentId: z.string().uuid().nullable().optional().or(z.literal("")),
  imageUrl: z
    .string()
    .trim()
    .refine((value) => value === "" || /^https?:\/\/.+/.test(value), "כתובת תמונה לא תקינה")
    .optional()
    .or(z.literal("")),
  icon: z.string().trim().max(50).optional().or(z.literal("")),
  sortOrder: z.coerce.number().int().min(0).max(9999),
});

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;
