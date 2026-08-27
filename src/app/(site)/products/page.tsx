import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Container } from "@/components/ui/container";
import { CatalogView } from "@/components/catalog/catalog-view";
import {
  getCategories,
  getCategoryBySlug,
  getProducts,
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

  const [categories, categoryData, result] = await Promise.all([
    getCategories(),
    params.category ? getCategoryBySlug(params.category) : Promise.resolve(null),
    getProducts({
      q: params.q,
      category: params.category,
      sort: ["newest", "name", "views"].includes(sort) ? sort : "newest",
      page: Number.isFinite(page) ? page : 1,
    }),
  ]);

  return (
    <section className="section-padding bg-surface-alt">
      <Container>
        <Breadcrumbs
          items={[
            { label: "בית", href: "/" },
            { label: "מוצרים" },
          ]}
          className="mb-6"
        />

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary md:text-4xl">קטלוג מוצרים</h1>
          <p className="mt-3 max-w-2xl text-text-secondary">
            חפשu, סננu ומיינu את המלאי. לחצu על מוצר לפרטים מלאים ובקשת הצעת מחיר.
          </p>
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
