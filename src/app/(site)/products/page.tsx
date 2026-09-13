import type { Metadata } from "next";
import { Sparkles } from "lucide-react";
import { CatalogView } from "@/components/catalog/catalog-view";
import { Container } from "@/components/ui/container";
import {
  getCategories,
  getCategoryBySlug,
  getProducts,
  getPublishedProductCount,
  type SortOption,
} from "@/lib/products";

export const metadata: Metadata = {
  title: "מוצרים",
  description: "קטלוג מוצרי חשמל — כבלים, מפסקים, תאורה, כלי עבודה ועוד.",
};

type ProductsPageProps = {
  searchParams: Promise<{
    q?: string;
    category?: string;
    sort?: string;
    page?: string;
  }>;
};

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const sort = (params.sort as SortOption | undefined) ?? "newest";
  const page = params.page ? Number(params.page) : 1;

  const [categories, categoryData, result, totalPublished] = await Promise.all([
    getCategories(),
    params.category ? getCategoryBySlug(params.category) : Promise.resolve(null),
    getProducts({
      q: params.q,
      category: params.category,
      sort: ["newest", "name", "views"].includes(sort) ? sort : "newest",
      page: Number.isFinite(page) ? page : 1,
    }),
    getPublishedProductCount(),
  ]);

  const pageTitle = categoryData?.name ?? "קטלוג מוצרים";
  const pageDescription = categoryData?.description
    ? categoryData.description
    : "חפשu, סננu ומיינu את המלאi. לחצu על מוצר לפרטים מלאים ובקשת הצעת מחיר.";

  return (
    <section className="section-padding bg-surface-alt/40">
      <Container>
        <div className="mb-8 flex flex-col gap-4 sm:mb-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="eyebrow mb-2">מוצרים</p>
            <h1 className="heading-page">{pageTitle}</h1>
            <p className="lead mt-3">{pageDescription}</p>
          </div>

          <div className="inline-flex items-center gap-2 self-start rounded-2xl border border-border bg-surface px-4 py-3 text-sm shadow-[var(--shadow-soft)] lg:self-auto">
            <Sparkles className="h-4 w-4 text-accent" />
            <span className="text-text-secondary">
              <span className="font-bold text-primary">{totalPublished}+</span> מוצרים
              במלאi
            </span>
          </div>
        </div>

        <CatalogView
          categories={categories}
          products={result.products}
          total={result.total}
          page={result.page}
          totalPages={result.totalPages}
          categoryName={categoryData?.name}
          q={params.q}
          category={params.category}
          sort={sort}
        />
      </Container>
    </section>
  );
}
