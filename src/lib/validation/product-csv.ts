import { z } from "zod";
import type { ProductSpec } from "@/lib/catalog";

export const PRODUCT_CSV_HEADERS = [
  "slug",
  "name_he",
  "name_en",
  "sku",
  "category_slug",
  "short_description",
  "description",
  "status",
  "is_featured",
  "image_urls",
  "specs",
] as const;

const statusSchema = z.enum(["draft", "published", "archived"]);

function parseSpecs(value: string): ProductSpec[] {
  const trimmed = value.trim();
  if (!trimmed) return [];

  try {
    const parsed = JSON.parse(trimmed);
    if (Array.isArray(parsed)) {
      return parsed
        .filter((item) => item && typeof item.label === "string" && typeof item.value === "string")
        .map((item) => ({ label: item.label.trim(), value: item.value.trim() }));
    }
  } catch {
    // fall through to pipe format
  }

  return trimmed
    .split("|")
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      const [label, ...rest] = part.split(":");
      return { label: label?.trim() ?? "", value: rest.join(":").trim() };
    })
    .filter((spec) => spec.label && spec.value);
}

function parseBoolean(value: string) {
  const normalized = value.trim().toLowerCase();
  if (!normalized) return false;
  return ["1", "true", "yes", "כן"].includes(normalized);
}

function parseImageUrls(value: string) {
  return value
    .split("|")
    .map((url) => url.trim())
    .filter(Boolean);
}

export const productCsvRowSchema = z.object({
  slug: z.string().trim().min(1, "חסר slug"),
  name_he: z.string().trim().min(1, "חסר שם בעברית"),
  name_en: z.string().optional(),
  sku: z.string().optional(),
  category_slug: z.string().trim().min(1, "חסר category_slug"),
  short_description: z.string().optional(),
  description: z.string().optional(),
  status: statusSchema.optional().default("draft"),
  is_featured: z.string().optional(),
  image_urls: z.string().optional(),
  specs: z.string().optional(),
});

export type ProductCsvRawRow = z.infer<typeof productCsvRowSchema>;

export type ProductCsvRow = {
  slug: string;
  nameHe: string;
  nameEn?: string;
  sku?: string;
  categorySlug: string;
  shortDescription?: string;
  description?: string;
  status: "draft" | "published" | "archived";
  isFeatured: boolean;
  imageUrls: string[];
  specs: ProductSpec[];
};

export type ProductCsvValidationResult = {
  rowNumber: number;
  data?: ProductCsvRow;
  errors: string[];
};

export function validateProductCsvRow(
  raw: Record<string, string>,
  rowNumber: number,
): ProductCsvValidationResult {
  const parsed = productCsvRowSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      rowNumber,
      errors: parsed.error.issues.map((issue) => issue.message),
    };
  }

  const row = parsed.data;
  const status = row.status ?? "draft";
  const imageUrls = parseImageUrls(row.image_urls ?? "");

  if (status === "published" && imageUrls.length === 0) {
    return {
      rowNumber,
      errors: ["מוצר מפורסם דורש לפחות תמונה אחת ב-image_urls"],
    };
  }

  return {
    rowNumber,
    data: {
      slug: row.slug.trim(),
      nameHe: row.name_he.trim(),
      nameEn: row.name_en?.trim() || undefined,
      sku: row.sku?.trim() || undefined,
      categorySlug: row.category_slug.trim(),
      shortDescription: row.short_description?.trim().slice(0, 160) || undefined,
      description: row.description?.trim() || undefined,
      status,
      isFeatured: parseBoolean(row.is_featured ?? ""),
      imageUrls,
      specs: parseSpecs(row.specs ?? ""),
    },
    errors: [],
  };
}
