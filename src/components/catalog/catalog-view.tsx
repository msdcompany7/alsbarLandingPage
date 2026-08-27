"use client";

import { useState } from "react";
import { ActiveFilters } from "@/components/catalog/active-filters";
import { CatalogFiltersDrawer } from "@/components/catalog/catalog-filters-drawer";
import { CatalogSidebar } from "@/components/catalog/catalog-sidebar";
import { CatalogToolbar } from "@/components/catalog/catalog-toolbar";
import { Pagination } from "@/components/catalog/pagination";
import { ProductCard } from "@/components/ui/product-card";
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
      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        <CatalogSidebar
          categories={categories}
          activeCategory={category}
          q={q}
          sort={sort}
          className="hidden lg:block"
        />

        <div>
          <CatalogToolbar
            q={q}
            category={category}
            sort={sort}
            total={total}
            onOpenFilters={() => setFiltersOpen(true)}
          />

          <div className="mt-4">
            <ActiveFilters
              category={category}
              categoryName={categoryName}
              q={q}
              sort={sort}
            />
          </div>

          {products.length === 0 ? (
            <div className="mt-12 rounded-xl border border-dashed border-border bg-surface p-12 text-center">
              <p className="text-lg font-semibold text-text-primary">
                לא נמצאו מוצרים
              </p>
              <p className="mt-2 text-text-secondary">
                {"נסו לשנות את החיפוש או לנקות את הסינון."}
              </p>
            </div>
          ) : (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
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
