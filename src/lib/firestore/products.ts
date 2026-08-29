import { randomUUID } from "crypto";
import { FieldValue } from "firebase-admin/firestore";
import { buildProductsCsv } from "@/lib/admin/csv";
import { sanitizeHtml } from "@/lib/sanitize";
import {
  getCategoryById,
  getCategoryIdMap,
  getCategorySlugMap,
} from "@/lib/firestore/categories";
import {
  includesQuery,
  paginateArray,
  sortByDateDesc,
  sortByNameHeAsc,
  sortBySortOrderAsc,
  sortByViewCountDesc,
  toDate,
} from "@/lib/firestore/utils";
import type { SortOption } from "@/lib/catalog-url";
import type {
  FirestoreProduct,
  ProductImageRecord,
  ProductSpec,
  ProductStatus,
  ProductWithCategory,
} from "@/lib/types/database";
import type { ProductCsvRow } from "@/lib/validation/product-csv";
import { getAdminDb } from "@/lib/firebase/admin";

const COLLECTION = "products";

function normalizeImages(images: unknown): ProductImageRecord[] {
  if (!Array.isArray(images)) {
    return [];
  }

  const normalized: ProductImageRecord[] = [];

  for (const [index, image] of images.entries()) {
    if (!image || typeof image !== "object") {
      continue;
    }

    const record = image as Record<string, unknown>;
    const url = String(record.url ?? "").trim();
    if (!url) {
      continue;
    }

    normalized.push({
      url,
      altTextHe: String(record.altTextHe ?? ""),
      sortOrder: Number(record.sortOrder ?? index),
      width: record.width != null ? Number(record.width) : null,
      height: record.height != null ? Number(record.height) : null,
    });
  }

  return normalized.sort((a, b) => a.sortOrder - b.sortOrder);
}

function normalizeSpecs(specs: unknown): ProductSpec[] {
  if (!Array.isArray(specs)) {
    return [];
  }

  return specs
    .map((spec) => {
      if (!spec || typeof spec !== "object") {
        return null;
      }

      const record = spec as Record<string, unknown>;
      const label = String(record.label ?? "").trim();
      const value = String(record.value ?? "").trim();
      if (!label || !value) {
        return null;
      }

      return { label, value };
    })
    .filter((spec): spec is ProductSpec => spec !== null);
}

function mapProductDoc(id: string, data: FirebaseFirestore.DocumentData): FirestoreProduct {
  return {
    id,
    slug: String(data.slug ?? ""),
    nameHe: String(data.nameHe ?? ""),
    nameEn: data.nameEn ?? null,
    sku: data.sku ?? null,
    shortDescription: data.shortDescription ?? null,
    description: data.description ?? null,
    categoryId: String(data.categoryId ?? ""),
    specs: normalizeSpecs(data.specs),
    isFeatured: Boolean(data.isFeatured),
    status: (data.status ?? "draft") as ProductStatus,
    sortOrder: Number(data.sortOrder ?? 0),
    viewCount: Number(data.viewCount ?? 0),
    metaTitle: data.metaTitle ?? null,
    metaDescription: data.metaDescription ?? null,
    images: normalizeImages(data.images),
    createdAt: toDate(data.createdAt),
    updatedAt: toDate(data.updatedAt),
    deletedAt: data.deletedAt ? toDate(data.deletedAt) : null,
  };
}

function isActiveProduct(product: FirestoreProduct) {
  return !product.deletedAt;
}

function isPublishedProduct(product: FirestoreProduct) {
  return product.status === "published" && !product.deletedAt;
}

async function attachCategory(
  product: FirestoreProduct,
  categoryMap?: Map<string, Awaited<ReturnType<typeof getCategoryById>>>,
): Promise<ProductWithCategory | null> {
  const category =
    categoryMap?.get(product.categoryId) ??
    (await getCategoryById(product.categoryId));

  if (!category) {
    return null;
  }

  return { ...product, category };
}

async function attachCategories(products: FirestoreProduct[]) {
  const categoryMap = await getCategoryIdMap();
  const results: ProductWithCategory[] = [];

  for (const product of products) {
    const category = categoryMap.get(product.categoryId);
    if (!category) {
      continue;
    }
    results.push({ ...product, category });
  }

  return results;
}

async function listAllProducts(): Promise<FirestoreProduct[]> {
  const snapshot = await getAdminDb().collection(COLLECTION).get();
  return snapshot.docs.map((doc) => mapProductDoc(doc.id, doc.data()));
}

function sortProducts<T extends FirestoreProduct>(products: T[], sort: SortOption): T[] {
  switch (sort) {
    case "name":
      return sortByNameHeAsc(products);
    case "views":
      return sortByViewCountDesc(products);
    case "newest":
    default:
      return sortByDateDesc(products);
  }
}

function filterProducts(
  products: ProductWithCategory[],
  params: {
    q?: string;
    category?: string;
    includeDrafts?: boolean;
  },
) {
  let filtered = products;

  if (!params.includeDrafts) {
    filtered = filtered.filter(isPublishedProduct);
  } else {
    filtered = filtered.filter(isActiveProduct);
  }

  if (params.category) {
    filtered = filtered.filter((product) => product.category.slug === params.category);
  }

  if (params.q?.trim()) {
    const query = params.q.trim();
    filtered = filtered.filter(
      (product) =>
        includesQuery(product.nameHe, query) ||
        includesQuery(product.nameEn, query) ||
        includesQuery(product.sku, query) ||
        includesQuery(product.shortDescription, query) ||
        includesQuery(product.category.nameHe, query),
    );
  }

  return filtered;
}

export type ProductQuery = {
  q?: string;
  category?: string;
  sort?: SortOption;
  page?: number;
  pageSize?: number;
  includeDrafts?: boolean;
};

export type ProductQueryResult = {
  products: ProductWithCategory[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

const DEFAULT_PAGE_SIZE = 12;

export async function queryProducts(params: ProductQuery = {}): Promise<ProductQueryResult> {
  const pageSize = params.pageSize ?? DEFAULT_PAGE_SIZE;
  const page = Math.max(1, params.page ?? 1);
  const sort = params.sort ?? "newest";

  const allProducts = await listAllProducts();
  const withCategories = await attachCategories(allProducts);
  const filtered = filterProducts(withCategories, params);
  const sorted = sortProducts(filtered, sort);
  const paginated = paginateArray(sorted, page, pageSize);

  return {
    products: paginated.items,
    total: paginated.total,
    page: paginated.page,
    pageSize: paginated.pageSize,
    totalPages: paginated.totalPages,
  };
}

export async function getProductBySlugFromFirestore(
  slug: string,
  options?: { includeDrafts?: boolean },
): Promise<ProductWithCategory | null> {
  const snapshot = await getAdminDb()
    .collection(COLLECTION)
    .where("slug", "==", slug)
    .limit(1)
    .get();

  const doc = snapshot.docs[0];
  if (!doc) {
    return null;
  }

  const product = mapProductDoc(doc.id, doc.data());
  if (product.deletedAt) {
    return null;
  }

  if (!options?.includeDrafts && product.status !== "published") {
    return null;
  }

  return attachCategory(product);
}

export async function getProductByIdFromFirestore(id: string) {
  const doc = await getAdminDb().collection(COLLECTION).doc(id).get();
  if (!doc.exists) {
    return null;
  }

  const product = mapProductDoc(doc.id, doc.data()!);
  if (product.deletedAt) {
    return null;
  }

  return product;
}

export async function getFeaturedProductsFromFirestore(limit = 4) {
  const allProducts = await listAllProducts();
  const featured = allProducts.filter(
    (product) => isPublishedProduct(product) && product.isFeatured,
  );
  const sorted = sortBySortOrderAsc(featured).slice(0, limit);
  return attachCategories(sorted);
}

export async function getRelatedProductsFromFirestore(
  product: { slug: string; categorySlug: string },
  limit = 4,
) {
  const allProducts = await listAllProducts();
  const withCategories = await attachCategories(allProducts);
  return withCategories
    .filter(
      (item) =>
        isPublishedProduct(item) &&
        item.category.slug === product.categorySlug &&
        item.slug !== product.slug,
    )
    .slice(0, limit);
}

export async function getPublishedProductCountFromFirestore() {
  const allProducts = await listAllProducts();
  return allProducts.filter(isPublishedProduct).length;
}

export async function getAllProductSlugsFromFirestore() {
  const allProducts = await listAllProducts();
  return allProducts.filter(isPublishedProduct).map((product) => product.slug);
}

export async function getProductsForSitemap() {
  const allProducts = await listAllProducts();
  return allProducts
    .filter(isPublishedProduct)
    .map((product) => ({
      slug: product.slug,
      updatedAt: product.updatedAt,
    }));
}

export async function countActiveProducts() {
  const allProducts = await listAllProducts();
  return allProducts.filter(isActiveProduct).length;
}

export async function countPublishedProducts() {
  const allProducts = await listAllProducts();
  return allProducts.filter(isPublishedProduct).length;
}

export async function listAdminProducts() {
  const allProducts = await listAllProducts();
  const active = allProducts.filter(isActiveProduct);
  const withCategories = await attachCategories(active);
  return sortByDateDesc(withCategories).map((product) => ({
    ...product,
    images: product.images,
  }));
}

export async function getAdminProductById(id: string) {
  return getProductByIdFromFirestore(id);
}

export async function getProductBySlugConflict(slug: string, excludeId?: string) {
  const snapshot = await getAdminDb()
    .collection(COLLECTION)
    .where("slug", "==", slug)
    .limit(1)
    .get();

  const doc = snapshot.docs[0];
  if (!doc) {
    return null;
  }

  if (excludeId && doc.id === excludeId) {
    return null;
  }

  return mapProductDoc(doc.id, doc.data());
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

export async function saveProductToFirestore(input: ProductFormInput) {
  const images: ProductImageRecord[] = input.images
    .filter((image) => image.url.trim())
    .map((image, index) => ({
      url: image.url.trim(),
      altTextHe: image.altTextHe?.trim() || input.nameHe.trim(),
      sortOrder: index,
    }));

  const payload = {
    nameHe: input.nameHe.trim(),
    slug: input.slug.trim(),
    categoryId: input.categoryId,
    shortDescription: input.shortDescription.trim().slice(0, 160),
    description: sanitizeHtml(input.description),
    sku: input.sku?.trim() || null,
    status: input.status,
    isFeatured: input.isFeatured,
    images,
    updatedAt: FieldValue.serverTimestamp(),
  };

  if (input.id) {
    await getAdminDb().collection(COLLECTION).doc(input.id).update(payload);
    return { id: input.id };
  }

  const id = randomUUID();
  await getAdminDb()
    .collection(COLLECTION)
    .doc(id)
    .set({
      ...payload,
      specs: [],
      sortOrder: 0,
      viewCount: 0,
      metaTitle: null,
      metaDescription: null,
      nameEn: null,
      deletedAt: null,
      createdAt: FieldValue.serverTimestamp(),
    });

  return { id };
}

export async function softDeleteProduct(id: string) {
  await getAdminDb()
    .collection(COLLECTION)
    .doc(id)
    .update({
      deletedAt: FieldValue.serverTimestamp(),
      status: "archived",
      updatedAt: FieldValue.serverTimestamp(),
    });
}

export async function exportProductsFromFirestore() {
  const products = await listAdminProducts();
  return buildProductsCsv(
    products.map((product) => ({
      slug: product.slug,
      nameHe: product.nameHe,
      nameEn: product.nameEn,
      sku: product.sku,
      category: { slug: product.category.slug },
      shortDescription: product.shortDescription,
      description: product.description,
      status: product.status,
      isFeatured: product.isFeatured,
      specs: product.specs,
      images: product.images.map((image) => ({ url: image.url })),
    })),
  );
}

export type ProductImportResult = {
  created: number;
  updated: number;
  skipped: number;
  errors: string[];
};

export async function importProductsToFirestore(
  rows: ProductCsvRow[],
): Promise<ProductImportResult> {
  const result: ProductImportResult = {
    created: 0,
    updated: 0,
    skipped: 0,
    errors: [],
  };

  const categoryBySlug = await getCategorySlugMap();

  for (const [index, row] of rows.entries()) {
    const rowLabel = `שורה ${index + 2}`;
    const categoryId = categoryBySlug.get(row.categorySlug);

    if (!categoryId) {
      result.errors.push(`${rowLabel}: קטגוריה "${row.categorySlug}" לא נמצאה`);
      result.skipped += 1;
      continue;
    }

    try {
      const existingSnapshot = await getAdminDb()
        .collection(COLLECTION)
        .where("slug", "==", row.slug)
        .limit(1)
        .get();

      const existingDoc = existingSnapshot.docs[0];
      const images = row.imageUrls.map((url, imageIndex) => ({
        url,
        altTextHe: row.nameHe,
        sortOrder: imageIndex,
      }));

      const payload = {
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
        images,
        deletedAt: null,
        updatedAt: FieldValue.serverTimestamp(),
      };

      if (existingDoc) {
        await existingDoc.ref.update(payload);
        result.updated += 1;
      } else {
        const id = randomUUID();
        await getAdminDb()
          .collection(COLLECTION)
          .doc(id)
          .set({
            ...payload,
            sortOrder: 0,
            viewCount: 0,
            metaTitle: null,
            metaDescription: null,
            createdAt: FieldValue.serverTimestamp(),
          });
        result.created += 1;
      }
    } catch (error) {
      result.errors.push(
        `${rowLabel}: ${error instanceof Error ? error.message : "שגיאה לא ידועה"}`,
      );
      result.skipped += 1;
    }
  }

  return result;
}

export async function countProductsInCategory(categoryId: string) {
  const allProducts = await listAllProducts();
  return allProducts.filter(
    (product) => isPublishedProduct(product) && product.categoryId === categoryId,
  ).length;
}

export async function countAllProductsInCategory(categoryId: string) {
  const allProducts = await listAllProducts();
  return allProducts.filter(
    (product) => isActiveProduct(product) && product.categoryId === categoryId,
  ).length;
}

export async function countChildCategories(categoryId: string) {
  const snapshot = await getAdminDb()
    .collection("categories")
    .where("parentId", "==", categoryId)
    .count()
    .get();

  return snapshot.data().count;
}

export { mapProductDoc, isPublishedProduct, isActiveProduct };
