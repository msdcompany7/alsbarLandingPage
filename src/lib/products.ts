import {
  mapCategory,
  mapProduct,
  type PublicCategory,
  type PublicProduct,
} from "@/lib/catalog";
export type { SortOption } from "@/lib/catalog-url";
export { buildCatalogUrl } from "@/lib/catalog-url";
import type { SortOption } from "@/lib/catalog-url";
import {
  getCategoryBySlug as getFirestoreCategoryBySlug,
  listCategories,
} from "@/lib/firestore/categories";
import {
  countProductsInCategory,
  getAllProductSlugsFromFirestore,
  getFeaturedProductsFromFirestore,
  getProductBySlugFromFirestore,
  getPublishedProductCountFromFirestore,
  getRelatedProductsFromFirestore,
  queryProducts,
} from "@/lib/firestore/products";

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

export async function getProducts(params: ProductQuery = {}): Promise<ProductQueryResult> {
  const result = await queryProducts(params);

  return {
    ...result,
    products: result.products.map(mapProduct),
  };
}

export async function getProductBySlug(
  slug: string,
  options?: { includeDrafts?: boolean },
): Promise<PublicProduct | null> {
  const product = await getProductBySlugFromFirestore(slug, options);
  return product ? mapProduct(product) : null;
}

export async function getCategoryBySlug(slug: string): Promise<PublicCategory | null> {
  const category = await getFirestoreCategoryBySlug(slug);
  if (!category) return null;

  const productCount = await countProductsInCategory(category.id);
  return mapCategory(category, productCount);
}

export async function getCategories(): Promise<PublicCategory[]> {
  const categories = await listCategories();

  const counts = await Promise.all(
    categories.map(async (category) => ({
      category,
      count: await countProductsInCategory(category.id),
    })),
  );

  return counts.map(({ category, count }) => mapCategory(category, count));
}

export async function getFeaturedProducts(limit = 4): Promise<PublicProduct[]> {
  const products = await getFeaturedProductsFromFirestore(limit);
  return products.map(mapProduct);
}

export async function getRelatedProducts(
  product: PublicProduct,
  limit = 4,
): Promise<PublicProduct[]> {
  const products = await getRelatedProductsFromFirestore(product, limit);
  return products.map(mapProduct);
}

export async function getAllProductSlugs(): Promise<string[]> {
  return getAllProductSlugsFromFirestore();
}

export async function getAllCategorySlugs(): Promise<string[]> {
  const categories = await listCategories();
  return categories.map((category) => category.slug);
}

export async function getPublishedProductCount(): Promise<number> {
  return getPublishedProductCountFromFirestore();
}
