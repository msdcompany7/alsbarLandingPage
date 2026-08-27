"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { buildProductsCsv } from "@/lib/admin/csv";
import { sanitizeHtml } from "@/lib/sanitize";
import { categoryFormSchema } from "@/lib/validation/category";
import type { ProductCsvRow } from "@/lib/validation/product-csv";
import { siteSettingFields } from "@/lib/site-setting-fields";
import type { SiteSettings } from "@/lib/site-settings-types";
import type { InquiryStatus, ProductStatus } from "@/generated/prisma";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }
  return session;
}

export async function updateInquiryStatus(id: string, status: InquiryStatus) {
  await requireAdmin();

  await db.inquiry.update({
    where: { id },
    data: { status },
  });

  revalidatePath("/admin/inquiries");
  revalidatePath("/admin");
}

export async function deleteProduct(id: string) {
  await requireAdmin();

  await db.product.update({
    where: { id },
    data: { deletedAt: new Date(), status: "archived" },
  });

  revalidatePath("/admin/products");
  revalidatePath("/products");
  revalidatePath("/");
}

export type ProductImageInput = {
  url: string;
  altTextHe?: string;
};

export type ProductFormInput = {
  id?: string;
  nameHe: string;
  slug: string;
  categoryId: string;
  shortDescription: string;
  description: string;
  sku?: string;
  status: ProductStatus;
  isFeatured: boolean;
  images: ProductImageInput[];
};

export async function saveProduct(input: ProductFormInput) {
  await requireAdmin();

  if (!input.nameHe.trim() || !input.categoryId || !input.slug.trim()) {
    throw new Error("Missing required fields");
  }

  if (input.status === "published" && input.images.length === 0) {
    throw new Error("Published products require at least one image");
  }

  const data = {
    nameHe: input.nameHe.trim(),
    slug: input.slug.trim(),
    categoryId: input.categoryId,
    shortDescription: input.shortDescription.trim().slice(0, 160),
    description: sanitizeHtml(input.description),
    sku: input.sku?.trim() || null,
    status: input.status,
    isFeatured: input.isFeatured,
  };

  let productId = input.id;

  if (productId) {
    await db.product.update({
      where: { id: productId },
      data,
    });
    await db.productImage.deleteMany({ where: { productId } });
  } else {
    const created = await db.product.create({ data });
    productId = created.id;
  }

  for (const [index, image] of input.images.entries()) {
    if (!image.url.trim()) continue;
    await db.productImage.create({
      data: {
        productId: productId!,
        url: image.url.trim(),
        altTextHe: image.altTextHe?.trim() || input.nameHe.trim(),
        sortOrder: index,
      },
    });
  }

  revalidatePath("/admin/products");
  revalidatePath("/products");
  revalidatePath("/");
  revalidatePath(`/products/${input.slug}`);
  revalidatePath("/sitemap.xml");

  return { id: productId };
}

export async function saveSiteSettings(settings: SiteSettings) {
  await requireAdmin();

  await db.$transaction(
    siteSettingFields.map((field) => {
      const key = field.key as keyof SiteSettings;
      const value = String(settings[key]);
      return db.siteSetting.upsert({
        where: { key: field.dbKey },
        update: { value },
        create: { key: field.dbKey, value },
      });
    }),
  );

  revalidatePath("/");
  revalidatePath("/contact");
  revalidatePath("/admin/settings");
}

export type CategoryFormInput = {
  id?: string;
  slug: string;
  nameHe: string;
  nameEn?: string;
  description?: string;
  parentId?: string | null;
  imageUrl?: string;
  icon?: string;
  sortOrder: number;
};

async function validateCategoryParent(parentId: string | null | undefined, categoryId?: string) {
  if (!parentId) return;

  if (categoryId && parentId === categoryId) {
    throw new Error("קטגוריה לא יכולה להיות הורה של עצמה");
  }

  const parent = await db.category.findUnique({
    where: { id: parentId },
    select: { id: true, parentId: true },
  });

  if (!parent) {
    throw new Error("קטגוריית הורה לא נמצאה");
  }

  if (parent.parentId) {
    throw new Error("ניתן ליצור עד שני רמות קטגוריות בלבד");
  }

  if (categoryId) {
    const children = await db.category.findMany({
      where: { parentId: categoryId },
      select: { id: true },
    });

    if (children.some((child) => child.id === parentId)) {
      throw new Error("לא ניתן להגדיר קטגוריית משנה כהורה");
    }
  }
}

function revalidateCategoryPaths(slug?: string) {
  revalidatePath("/admin/categories");
  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/sitemap.xml");
  if (slug) {
    revalidatePath(`/categories/${slug}`);
  }
}

export async function saveCategory(input: CategoryFormInput) {
  await requireAdmin();

  const parsed = categoryFormSchema.safeParse({
    slug: input.slug,
    nameHe: input.nameHe,
    nameEn: input.nameEn ?? "",
    description: input.description ?? "",
    parentId: input.parentId ?? "",
    imageUrl: input.imageUrl ?? "",
    icon: input.icon ?? "",
    sortOrder: input.sortOrder,
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Invalid category data");
  }

  const parentId = parsed.data.parentId || null;
  await validateCategoryParent(parentId, input.id);

  const data = {
    slug: parsed.data.slug,
    nameHe: parsed.data.nameHe,
    nameEn: parsed.data.nameEn || null,
    description: parsed.data.description || null,
    parentId,
    imageUrl: parsed.data.imageUrl || null,
    icon: parsed.data.icon || null,
    sortOrder: parsed.data.sortOrder,
  };

  const slugConflict = await db.category.findFirst({
    where: {
      slug: data.slug,
      ...(input.id ? { NOT: { id: input.id } } : {}),
    },
  });

  if (slugConflict) {
    throw new Error("כתובת slug כבר בשימוש");
  }

  if (input.id) {
    await db.category.update({ where: { id: input.id }, data });
    revalidateCategoryPaths(data.slug);
    return { id: input.id };
  }

  const created = await db.category.create({ data });
  revalidateCategoryPaths(data.slug);
  return { id: created.id };
}

export async function deleteCategory(id: string) {
  await requireAdmin();

  const category = await db.category.findUnique({
    where: { id },
    include: {
      _count: { select: { products: true, children: true } },
    },
  });

  if (!category) {
    throw new Error("Category not found");
  }

  if (category._count.products > 0) {
    throw new Error("לא ניתן למחוק קטגוריה עם מוצרים משויכים");
  }

  if (category._count.children > 0) {
    throw new Error("לא ניתן למחוק קטגוריה עם תתי-קטגוריות");
  }

  await db.category.delete({ where: { id } });
  revalidateCategoryPaths(category.slug);
}

export async function exportProductsCsv() {
  await requireAdmin();

  const products = await db.product.findMany({
    where: { deletedAt: null },
    include: {
      category: true,
      images: { orderBy: { sortOrder: "asc" } },
    },
    orderBy: [{ category: { sortOrder: "asc" } }, { sortOrder: "asc" }],
  });

  return buildProductsCsv(products);
}

export type ProductImportResult = {
  created: number;
  updated: number;
  skipped: number;
  errors: string[];
};

export async function importProducts(rows: ProductCsvRow[]): Promise<ProductImportResult> {
  await requireAdmin();

  const result: ProductImportResult = {
    created: 0,
    updated: 0,
    skipped: 0,
    errors: [],
  };

  const categories = await db.category.findMany({
    select: { id: true, slug: true },
  });
  const categoryBySlug = new Map(categories.map((category) => [category.slug, category.id]));

  for (const [index, row] of rows.entries()) {
    const rowLabel = `שורה ${index + 2}`;

    const categoryId = categoryBySlug.get(row.categorySlug);
    if (!categoryId) {
      result.errors.push(`${rowLabel}: קטגוריה "${row.categorySlug}" לא נמצאה`);
      result.skipped += 1;
      continue;
    }

    try {
      const existing = await db.product.findUnique({
        where: { slug: row.slug },
        select: { id: true, deletedAt: true },
      });

      const data = {
        slug: row.slug,
        nameHe: row.nameHe,
        nameEn: row.nameEn ?? null,
        sku: row.sku ?? null,
        categoryId,
        shortDescription: row.shortDescription ?? null,
        description: row.description ? sanitizeHtml(row.description) : null,
        specs: row.specs,
        status: row.status,
        isFeatured: row.isFeatured,
      };

      let productId: string;

      if (existing && !existing.deletedAt) {
        await db.product.update({ where: { id: existing.id }, data });
        productId = existing.id;
        result.updated += 1;
      } else if (existing?.deletedAt) {
        await db.product.update({
          where: { id: existing.id },
          data: { ...data, deletedAt: null },
        });
        productId = existing.id;
        result.updated += 1;
      } else {
        const created = await db.product.create({ data });
        productId = created.id;
        result.created += 1;
      }

      if (row.imageUrls.length > 0) {
        await db.productImage.deleteMany({ where: { productId } });
        for (const [imageIndex, url] of row.imageUrls.entries()) {
          await db.productImage.create({
            data: {
              productId,
              url,
              altTextHe: row.nameHe,
              sortOrder: imageIndex,
            },
          });
        }
      }
    } catch (error) {
      result.errors.push(
        `${rowLabel}: ${error instanceof Error ? error.message : "שגיאה לא ידועה"}`,
      );
      result.skipped += 1;
    }
  }

  revalidatePath("/admin/products");
  revalidatePath("/products");
  revalidatePath("/");
  revalidatePath("/sitemap.xml");

  return result;
}
