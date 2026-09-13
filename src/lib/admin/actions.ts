"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/firebase/auth-server";
import { categoryFormSchema } from "@/lib/validation/category";
import type { ProductCsvRow } from "@/lib/validation/product-csv";
import { siteSettingFields } from "@/lib/site-setting-fields";
import type { SiteSettings } from "@/lib/site-settings-types";
import type { InquiryStatus } from "@/lib/types/database";
import {
  createCategory,
  deleteCategoryById,
  getCategoryById,
  getCategoryBySlugConflict,
  getChildCategories,
  updateCategory,
} from "@/lib/firestore/categories";
import {
  countAllProductsInCategory,
  countChildCategories,
  exportProductsFromFirestore,
  importProductsToFirestore,
  saveProductToFirestore,
  softDeleteProduct,
  type ProductFormInput,
  type ProductImageInput,
  type ProductImportResult,
} from "@/lib/firestore/products";
import { updateInquiryStatus as updateInquiryStatusInFirestore } from "@/lib/firestore/inquiries";
import { saveSiteSettingsToFirestore } from "@/lib/firestore/site-settings";

export async function updateInquiryStatus(id: string, status: InquiryStatus) {
  await requireAdmin();
  await updateInquiryStatusInFirestore(id, status);

  revalidatePath("/admin/inquiries");
  revalidatePath("/admin");
}

export async function deleteProduct(id: string) {
  await requireAdmin();
  await softDeleteProduct(id);

  revalidatePath("/admin/products");
  revalidatePath("/products");
  revalidatePath("/");
}

export type { ProductImageInput, ProductFormInput, ProductImportResult };

export async function saveProduct(input: ProductFormInput) {
  await requireAdmin();

  if (!input.nameHe.trim() || !input.categoryId || !input.slug.trim()) {
    throw new Error("Missing required fields");
  }

  if (input.status === "published" && input.images.length === 0) {
    throw new Error("Published products require at least one image");
  }

  const result = await saveProductToFirestore(input);

  revalidatePath("/admin/products");
  revalidatePath("/products");
  revalidatePath("/");
  revalidatePath(`/products/${input.slug}`);
  revalidatePath("/sitemap.xml");

  return result;
}

export async function saveSiteSettings(settings: SiteSettings) {
  await requireAdmin();
  await saveSiteSettingsToFirestore(settings);

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

  const parent = await getCategoryById(parentId);

  if (!parent) {
    throw new Error("קטגוריית הורה לא נמצאה");
  }

  if (parent.parentId) {
    throw new Error("ניתן ליצור עד שני רמות קטגוריות בלבד");
  }

  if (categoryId) {
    const children = await getChildCategories(categoryId);

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

  const slugConflict = await getCategoryBySlugConflict(data.slug, input.id);

  if (slugConflict) {
    throw new Error("כתובת slug כבר בשימוש");
  }

  if (input.id) {
    await updateCategory(input.id, data);
    revalidateCategoryPaths(data.slug);
    return { id: input.id };
  }

  const created = await createCategory(data);
  revalidateCategoryPaths(data.slug);
  return { id: created.id };
}

export async function deleteCategory(id: string) {
  await requireAdmin();

  const category = await getCategoryById(id);

  if (!category) {
    throw new Error("Category not found");
  }

  const [productCount, childCount] = await Promise.all([
    countAllProductsInCategory(id),
    countChildCategories(id),
  ]);

  if (productCount > 0) {
    throw new Error("לא ניתן למחוק קטגוריה עם מוצרים משויכים");
  }

  if (childCount > 0) {
    throw new Error("לא ניתן למחוק קטגוריה עם תתי-קטגוריות");
  }

  await deleteCategoryById(id);
  revalidateCategoryPaths(category.slug);
}

export async function exportProductsCsv() {
  await requireAdmin();
  return exportProductsFromFirestore();
}

export async function importProducts(rows: ProductCsvRow[]): Promise<ProductImportResult> {
  await requireAdmin();

  const result = await importProductsToFirestore(rows);

  revalidatePath("/admin/products");
  revalidatePath("/products");
  revalidatePath("/");
  revalidatePath("/sitemap.xml");

  return result;
}
