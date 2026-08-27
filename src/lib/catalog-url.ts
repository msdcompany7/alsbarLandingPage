export type SortOption = "newest" | "name" | "views";

export function buildCatalogUrl(params: {
  q?: string;
  category?: string;
  sort?: SortOption;
  page?: number;
}) {
  const search = new URLSearchParams();

  if (params.q) search.set("q", params.q);
  if (params.category) search.set("category", params.category);
  if (params.sort && params.sort !== "newest") search.set("sort", params.sort);
  if (params.page && params.page > 1) search.set("page", String(params.page));

  const qs = search.toString();
  return qs ? `/products?${qs}` : "/products";
}
