import Link from "next/link";
import { X } from "lucide-react";
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
      {q && (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1 text-sm">
          חיפוש: &quot;{q}&quot;
          <Link
            href={buildCatalogUrl({ category })}
            className="rounded-full p-0.5 text-text-secondary hover:text-primary"
            aria-label="הסר חיפוש"
          >
            <X className="h-3.5 w-3.5" />
          </Link>
        </span>
      )}
      {categoryName && (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm text-primary">
          {categoryName}
          <Link
            href={buildCatalogUrl({ q })}
            className="rounded-full p-0.5 hover:text-accent"
            aria-label="הסר קטגוריה"
          >
            <X className="h-3.5 w-3.5" />
          </Link>
        </span>
      )}
    </div>
  );
}
