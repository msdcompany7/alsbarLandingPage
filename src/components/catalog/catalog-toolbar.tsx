"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Package, Search, SlidersHorizontal } from "lucide-react";
import { buildCatalogUrl, type SortOption } from "@/lib/catalog-url";
import { cn } from "@/lib/utils";

const sortLabels: Record<SortOption, string> = {
  newest: "חדש ביותר",
  name: "שם (א-ת)",
  views: "הנצפים ביותר",
};

type CatalogToolbarProps = {
  q?: string;
  category?: string;
  sort?: SortOption;
  total: number;
  onOpenFilters?: () => void;
};

export function CatalogToolbar({
  q,
  category,
  sort = "newest",
  total,
  onOpenFilters,
}: CatalogToolbarProps) {
  const router = useRouter();
  const [search, setSearch] = useState(q ?? "");

  function handleSearch(e: FormEvent) {
    e.preventDefault();
    router.push(buildCatalogUrl({ q: search || undefined, category, sort, page: 1 }));
  }

  function handleSortChange(value: SortOption) {
    router.push(buildCatalogUrl({ q, category, sort: value, page: 1 }));
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-4 shadow-[var(--shadow-soft)] sm:p-5">
      <form onSubmit={handleSearch} className="relative">
        <Search className="pointer-events-none absolute start-4 top-1/2 h-5 w-5 -translate-y-1/2 text-accent" />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="חיפוש לפי שם, SKU או קטגוריה..."
          className={cn(
            "w-full rounded-xl border border-border bg-surface-alt/60 py-3.5 pe-4 ps-12 text-sm",
            "placeholder:text-text-secondary/80 focus:border-accent focus:bg-surface focus:outline-none focus:ring-2 focus:ring-accent/15",
          )}
        />
      </form>

      <div className="mt-4 flex flex-col gap-3 border-t border-border/70 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="inline-flex items-center gap-2 text-sm text-text-secondary">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-soft text-accent">
            <Package className="h-4 w-4" />
          </span>
          <span>
            נמצאו{" "}
            <span className="font-bold text-primary">{total}</span>{" "}
            מוצרים
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onOpenFilters}
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface-alt/60 px-3.5 py-2.5 text-sm font-medium text-text-primary transition-colors hover:border-accent/30 hover:bg-accent-soft/40 lg:hidden"
          >
            <SlidersHorizontal className="h-4 w-4 text-accent" />
            קטגוריות
          </button>

          <label className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface-alt/60 px-3 py-2 text-sm text-text-secondary">
            <span className="font-medium">מיון</span>
            <select
              value={sort}
              onChange={(e) => handleSortChange(e.target.value as SortOption)}
              className="rounded-lg border-0 bg-transparent py-0.5 pe-6 ps-1 text-sm font-semibold text-primary focus:outline-none focus:ring-0"
            >
              {(Object.keys(sortLabels) as SortOption[]).map((key) => (
                <option key={key} value={key}>
                  {sortLabels[key]}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>
    </div>
  );
}

export { sortLabels };
