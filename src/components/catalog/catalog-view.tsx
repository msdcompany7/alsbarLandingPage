"use client";

import { useState } from "react";
import { PackageSearch } from "lucide-react";
import { ActiveFilters } from "@/components/catalog/active-filters";
import { CatalogFiltersDrawer } from "@/components/catalog/catalog-filters-drawer";
import { CatalogSidebar } from "@/components/catalog/catalog-sidebar";
import { CatalogToolbar } from "@/components/catalog/catalog-toolbar";
import { Pagination } from "@/components/catalog/pagination";
import { ProductCard } from "@/components/ui/product-card";
import { Reveal } from "@/components/ui/reveal";
import type { PublicCategory, PublicProduct } from "@/lib/catalog";
import type { SortOption } from "@/lib/catalog-url";

type CatalogViewProps = {
  categories: PublicCategory[];
  products: PublicProduct[];
  total: number;
  page: number;
  totalPages: number;
  categoryName?: string;
  q?: string;
  category?: string;
  sort?: SortOption;
};

export function CatalogView({
  categories,
  products,
  total,
  page,
  totalPages,
  categoryName,
  q,
  category,
  sort,
}: CatalogViewProps) {
  const [filtersOpen, setFiltersOpen] = useState(false);

  return (
    <>
      <div className="grid gap-6 lg:grid-cols-[280px_1fr] lg:gap-8">
        <CatalogSidebar
          categories={categories}
          activeCategory={category}
          q={q}
          sort={sort}
          className="hidden lg:block"
        />

        <div className="min-w-0 space-y-5">
          <CatalogToolbar
            q={q}
            category={category}
            sort={sort}
            total={total}
            onOpenFilters={() => setFiltersOpen(true)}
          />

          <ActiveFilters
            category={category}
            categoryName={categoryName}
            q={q}
            sort={sort}
          />

          {products.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-surface-alt/70 px-6 py-14 text-center sm:px-10">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-soft text-accent">
                <PackageSearch className="h-7 w-7" />
              </span>
              <p className="mt-5 text-lg font-bold text-primary">לא נמצאו מוצרים</p>
              <p className="mx-auto mt-2 max-w-md text-sm text-text-secondary">
                נסו לשנות את החיפוש, לבחור קטגוריה אחרת, או לנקות את הסינון.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3 xl:gap-6">
              {products.map((product, index) => (
                <Reveal key={product.id} delay={Math.min(index * 60, 360)}>
                  <ProductCard product={product} />
                </Reveal>
              ))}
            </div>
          )}

          <Pagination
            page={page}
            totalPages={totalPages}
            q={q}
            category={category}
            sort={sort}
          />
        </div>
      </div>

      <CatalogFiltersDrawer
        categories={categories}
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        activeCategory={category}
        q={q}
        sort={sort}
      />
    </>
  );
}
