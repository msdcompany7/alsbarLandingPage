import type { PublicCategory } from "@/lib/catalog";
import { includesQuery } from "@/lib/firestore/utils";
import { buildCatalogUrl } from "@/lib/catalog-url";

export function searchCategories(categories: PublicCategory[], query: string) {
  const trimmed = query.trim();
  if (!trimmed) return [];

  return categories.filter(
    (category) =>
      includesQuery(category.name, trimmed) ||
      includesQuery(category.slug, trimmed) ||
      includesQuery(category.description, trimmed),
  );
}

export function resolveSearchDestination(categories: PublicCategory[], query: string) {
  const trimmed = query.trim();
  if (!trimmed) return "/products";

  const matches = searchCategories(categories, trimmed);
  const normalized = trimmed.toLowerCase();

  const exactCategory = matches.find(
    (category) =>
      category.name.toLowerCase() === normalized || category.slug.toLowerCase() === normalized,
  );

  if (exactCategory) {
    return `/categories/${exactCategory.slug}`;
  }

  if (matches.length === 1) {
    return `/categories/${matches[0].slug}`;
  }

  return buildCatalogUrl({ q: trimmed, page: 1 });
}
