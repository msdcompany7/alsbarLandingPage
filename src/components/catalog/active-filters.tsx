import Link from "next/link";
import { Search, Tag, X } from "lucide-react";
import { buildCatalogUrl, type SortOption } from "@/lib/catalog-url";

type ActiveFiltersProps = {
  category?: string;
  categoryName?: string;
  q?: string;
  sort?: SortOption;
};

export function ActiveFilters({ category, categoryName, q }: ActiveFiltersProps) {
  const hasFilters = category || q;

  if (!hasFilters) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
        סינון פעיל:
      </span>
      {q && (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-sm shadow-sm">
          <Search className="h-3.5 w-3.5 text-accent" />
          <span className="max-w-[12rem] truncate">&quot;{q}&quot;</span>
          <Link
            href={buildCatalogUrl({ category })}
            className="rounded-full p-0.5 text-text-secondary transition-colors hover:bg-surface-alt hover:text-primary"
            aria-label="הסר חיפוש"
          >
            <X className="h-3.5 w-3.5" />
          </Link>
        </span>
      )}
      {categoryName && (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/20 bg-accent-soft px-3 py-1.5 text-sm font-medium text-primary">
          <Tag className="h-3.5 w-3.5 text-accent" />
          {categoryName}
          <Link
            href={buildCatalogUrl({ q })}
            className="rounded-full p-0.5 text-primary/70 transition-colors hover:bg-white/60 hover:text-accent"
            aria-label="הסר קטגוריה"
          >
            <X className="h-3.5 w-3.5" />
          </Link>
        </span>
      )}
    </div>
  );
}
