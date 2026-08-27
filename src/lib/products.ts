import { db } from "@/lib/db";
import {
  mapCategory,
  mapProduct,
  publishedProductWhere,
  type PublicCategory,
  type PublicProduct,
} from "@/lib/catalog";
export type { SortOption } from "@/lib/catalog-url";
export { buildCatalogUrl } from "@/lib/catalog-url";
import type { SortOption } from "@/lib/catalog-url";

export type ProductQuery = {
  q?: string;
  category?: string;
  sort?: SortOption;
  page?: number;
  pageSize?: number;
  includeDrafts?: boolean;
};

export type ProductQueryResult = {
  products: PublicProduct[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

const DEFAULT_PAGE_SIZE = 12;

function buildOrderBy(sort: SortOption) {
  switch (sort) {
    case "name":
      return { nameHe: "asc" as const };
    case "views":
      return { viewCount: "desc" as const };
    case "newest":
    default:
      return { createdAt: "desc" as const };
  }
}

export async function getProducts(
  params: ProductQuery = {},
): Promise<ProductQueryResult> {
  const pageSize = params.pageSize ?? DEFAULT_PAGE_SIZE;
  const page = Math.max(1, params.page ?? 1);
  const sort = params.sort ?? "newest";

  const where = {
    ...(params.includeDrafts ? { deletedAt: null } : publishedProductWhere),
    ...(params.category ? { category: { slug: params.category } } : {}),
    ...(params.q
      ? {
          OR: [
            { nameHe: { contains: params.q, mode: "insensitive" as const } },
            { nameEn: { contains: params.q, mode: "insensitive" as const } },
            { sku: { contains: params.q, mode: "insensitive" as const } },
            { shortDescription: { contains: params.q, mode: "insensitive" as const } },
            { category: { nameHe: { contains: params.q, mode: "insensitive" as const } } },
          ],
        }
      : {}),
  };

  const [total, rows] = await Promise.all([
    db.product.count({ where }),
    db.product.findMany({
      where,
      include: {
        category: true,
        images: { orderBy: { sortOrder: "asc" } },
      },
      orderBy: buildOrderBy(sort),
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return {
    products: rows.map(mapProduct),
    total,
    page: Math.min(page, totalPages),
    pageSize,
    totalPages,
  };
}

export async function getProductBySlug(
  slug: string,
  options?: { includeDrafts?: boolean },
): Promise<PublicProduct | null> {
  const product = await db.product.findFirst({
    where: {
      slug,
      deletedAt: null,
      ...(options?.includeDrafts ? {} : { status: "published" }),
    },
    include: {
      category: true,
      images: { orderBy: { sortOrder: "asc" } },
    },
  });

  return product ? mapProduct(product) : null;
}

export async function getCategoryBySlug(slug: string): Promise<PublicCategory | null> {
  const category = await db.category.findUnique({ where: { slug } });
  if (!category) return null;

  const productCount = await db.product.count({
    where: { ...publishedProductWhere, categoryId: category.id },
  });

  return mapCategory(category, productCount);
}

export async function getCategories(): Promise<PublicCategory[]> {
  const categories = await db.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      _count: {
        select: {
          products: {
            where: publishedProductWhere,
          },
        },
      },
    },
  });

  return categories.map((category) =>
    mapCategory(category, category._count.products),
  );
}

export async function getFeaturedProducts(limit = 4): Promise<PublicProduct[]> {
  const products = await db.product.findMany({
    where: {
      ...publishedProductWhere,
      isFeatured: true,
    },
    include: {
      category: true,
      images: { orderBy: { sortOrder: "asc" } },
    },
    orderBy: { sortOrder: "asc" },
    take: limit,
  });

  return products.map(mapProduct);
}

export async function getRelatedProducts(
  product: PublicProduct,
  limit = 4,
): Promise<PublicProduct[]> {
  const products = await db.product.findMany({
    where: {
      ...publishedProductWhere,
      category: { slug: product.categorySlug },
      NOT: { slug: product.slug },
    },
    include: {
      category: true,
      images: { orderBy: { sortOrder: "asc" } },
    },
    take: limit,
  });

  return products.map(mapProduct);
}

export async function getAllProductSlugs(): Promise<string[]> {
  const products = await db.product.findMany({
    where: publishedProductWhere,
    select: { slug: true },
  });
  return products.map((p) => p.slug);
}

export async function getAllCategorySlugs(): Promise<string[]> {
  const categories = await db.category.findMany({ select: { slug: true } });
  return categories.map((c) => c.slug);
}

export async function getPublishedProductCount(): Promise<number> {
  return db.product.count({ where: publishedProductWhere });
}
