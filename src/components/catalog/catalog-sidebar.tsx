import Link from "next/link";
import { X } from "lucide-react";
import type { PublicCategory } from "@/lib/catalog";
import { buildCatalogUrl, type SortOption } from "@/lib/catalog-url";
import { cn } from "@/lib/utils";

type CatalogSidebarProps = {
  categories: PublicCategory[];
  activeCategory?: string;
  q?: string;
  sort?: SortOption;
  className?: string;
};

export function CatalogSidebar({
  categories,
  activeCategory,
  q,
  sort,
  className,
}: CatalogSidebarProps) {
  return (
    <aside className={cn("space-y-6", className)}>
      <div>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-text-secondary">
          קטגוריות
        </h2>
        <ul className="space-y-1">
          <li>
            <Link
              href={buildCatalogUrl({ q, sort })}
              className={cn(
                "flex items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-colors",
                !activeCategory
                  ? "bg-primary font-semibold text-white"
                  : "text-text-primary hover:bg-surface-alt",
              )}
            >
              <span>כל המוצרים</span>
            </Link>
          </li>
          {categories.map((category) => (
            <li key={category.slug}>
              <Link
                href={buildCatalogUrl({ category: category.slug, q, sort })}
                className={cn(
                  "flex items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-colors",
                  activeCategory === category.slug
                    ? "bg-primary font-semibold text-white"
                    : "text-text-primary hover:bg-surface-alt",
                )}
              >
                <span>{category.name}</span>
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-xs",
                    activeCategory === category.slug
                      ? "bg-white/20 text-white"
                      : "bg-surface-alt text-text-secondary",
                  )}
                >
                  {category.productCount}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {activeCategory && (
        <Link
          href={buildCatalogUrl({ q, sort })}
          className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline"
        >
          <X className="h-4 w-4" />
          נקה סינון
        </Link>
      )}
    </aside>
  );
}
