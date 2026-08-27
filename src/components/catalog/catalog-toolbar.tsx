"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
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
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-text-secondary">
          נמצאו <span className="font-semibold text-text-primary">{total}</span>{" "}
          מוצרים
        </p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenFilters}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-sm font-medium text-text-primary lg:hidden"
          >
            <SlidersHorizontal className="h-4 w-4" />
            סינון
          </button>

          <label className="flex items-center gap-2 text-sm text-text-secondary">
            <span className="hidden sm:inline">מיון:</span>
            <select
              value={sort}
              onChange={(e) => handleSortChange(e.target.value as SortOption)}
              className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
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

      <form onSubmit={handleSearch} className="relative">
        <Search className="pointer-events-none absolute start-3 top-1/2 h-5 w-5 -translate-y-1/2 text-text-secondary" />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="חיפוש לפי שם, SKU או קטגוריה..."
          className={cn(
            "w-full rounded-lg border border-border bg-surface py-3 pe-4 ps-11 text-sm",
            "placeholder:text-text-secondary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20",
          )}
        />
      </form>
    </div>
  );
}

export { sortLabels };
