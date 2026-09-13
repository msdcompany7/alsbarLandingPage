import Link from "next/link";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { buildCatalogUrl, type SortOption } from "@/lib/catalog-url";
import { cn } from "@/lib/utils";

type PaginationProps = {
  page: number;
  totalPages: number;
  q?: string;
  category?: string;
  sort?: SortOption;
};

export function Pagination({
  page,
  totalPages,
  q,
  category,
  sort,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav
      aria-label="עימוד"
      className="mt-10 flex flex-wrap items-center justify-center gap-1 rounded-2xl border border-border bg-surface p-2 shadow-[var(--shadow-soft)]"
    >
      <Link
        href={buildCatalogUrl({ q, category, sort, page: page - 1 })}
        aria-disabled={page <= 1}
        className={cn(
          "inline-flex items-center gap-1 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
          page <= 1
            ? "pointer-events-none text-text-secondary/50"
            : "text-primary hover:bg-surface-alt",
        )}
      >
        <ChevronRight className="h-4 w-4" />
        הקודם
      </Link>

      <div className="flex items-center gap-1">
        {pages.map((p) => (
          <Link
            key={p}
            href={buildCatalogUrl({ q, category, sort, page: p })}
            className={cn(
              "flex h-10 min-w-10 items-center justify-center rounded-xl px-2 text-sm font-semibold transition-colors",
              p === page
                ? "bg-accent text-white shadow-sm"
                : "text-text-primary hover:bg-surface-alt",
            )}
            aria-current={p === page ? "page" : undefined}
          >
            {p}
          </Link>
        ))}
      </div>

      <Link
        href={buildCatalogUrl({ q, category, sort, page: page + 1 })}
        aria-disabled={page >= totalPages}
        className={cn(
          "inline-flex items-center gap-1 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
          page >= totalPages
            ? "pointer-events-none text-text-secondary/50"
            : "text-primary hover:bg-surface-alt",
        )}
      >
        הבא
        <ChevronLeft className="h-4 w-4" />
      </Link>
    </nav>
  );
}
