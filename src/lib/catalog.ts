import type {
  FirestoreCategory,
  FirestoreProduct,
  ProductImageRecord,
  ProductSpec,
  ProductStatus,
} from "@/lib/types/database";

export type { ProductSpec };

export type PublicCategory = {
  id: string;
  slug: string;
  name: string;
  description: string;
  image: string;
  productCount: number;
};

export type PublicProduct = {
  id: string;
  slug: string;
  name: string;
  nameEn?: string;
  sku?: string;
  shortDescription: string;
  description: string;
  categorySlug: string;
  category: string;
  image: string;
  images: string[];
  specs: ProductSpec[];
  featured?: boolean;
  viewCount: number;
  createdAt: string;
  status: ProductStatus;
};

type ProductWithRelations = FirestoreProduct & {
  category: FirestoreCategory;
};

export function mapProduct(product: ProductWithRelations): PublicProduct {
  const images = product.images
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((img: ProductImageRecord) => img.url);

  return {
    id: product.id,
    slug: product.slug,
    name: product.nameHe,
    nameEn: product.nameEn ?? undefined,
    sku: product.sku ?? undefined,
    shortDescription: product.shortDescription ?? "",
    description: product.description ?? "",
    categorySlug: product.category.slug,
    category: product.category.nameHe,
    image: images[0] ?? "/placeholder-product.svg",
    images: images.length > 0 ? images : ["/placeholder-product.svg"],
    specs: product.specs,
    featured: product.isFeatured,
    viewCount: product.viewCount,
    createdAt: product.createdAt.toISOString().slice(0, 10),
    status: product.status,
  };
}

export function mapCategory(
  category: FirestoreCategory,
  productCount: number,
): PublicCategory {
  return {
    id: category.id,
    slug: category.slug,
    name: category.nameHe,
    description: category.description ?? "",
    image: category.imageUrl ?? "",
    productCount,
  };
}

export const publishedProductWhere = {
  status: "published" as const,
  deletedAt: null,
};
