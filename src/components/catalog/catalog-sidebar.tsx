import Link from "next/link";
import { LayoutGrid, X } from "lucide-react";
import type { PublicCategory } from "@/lib/catalog";
import { buildCatalogUrl, type SortOption } from "@/lib/catalog-url";
import { cn } from "@/lib/utils";

type CatalogSidebarProps = {
  categories: PublicCategory[];
  activeCategory?: string;
  q?: string;
  sort?: SortOption;
  className?: string;
  variant?: "sidebar" | "drawer";
};

export function CatalogSidebar({
  categories,
  activeCategory,
  q,
  sort,
  className,
  variant = "sidebar",
}: CatalogSidebarProps) {
  const isSidebar = variant === "sidebar";

  return (
    <aside className={cn(className)}>
      <div
        className={cn(
          isSidebar &&
            "sticky top-24 rounded-2xl border border-border bg-surface p-4 shadow-[var(--shadow-soft)] sm:p-5",
        )}
      >
        <div className="mb-4 flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-soft text-accent">
            <LayoutGrid className="h-4 w-4" />
          </span>
          <div>
            <h2 className="text-sm font-bold text-primary">קטגוריות</h2>
            <p className="text-xs text-text-secondary">סננו לפי סוג מוצר</p>
          </div>
        </div>

        <ul className="space-y-1">
          <li>
            <Link
              href={buildCatalogUrl({ q, sort })}
              className={cn(
                "flex items-center justify-between rounded-xl px-3 py-2.5 text-sm transition-all",
                !activeCategory
                  ? "bg-accent font-semibold text-white shadow-sm"
                  : "text-text-primary hover:bg-surface-alt",
              )}
            >
              <span>כל המוצרים</span>
            </Link>
          </li>
          {categories.map((category) => {
            const active = activeCategory === category.slug;

            return (
              <li key={category.slug}>
                <Link
                  href={buildCatalogUrl({ category: category.slug, q, sort })}
                  className={cn(
                    "flex items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-sm transition-all",
                    active
                      ? "bg-primary font-semibold text-white shadow-sm"
                      : "text-text-primary hover:bg-surface-alt",
                  )}
                >
                  <span className="min-w-0 truncate">{category.name}</span>
                  <span
                    className={cn(
                      "shrink-0 rounded-full px-2 py-0.5 text-xs font-medium",
                      active
                        ? "bg-white/20 text-white"
                        : "bg-surface-alt text-text-secondary",
                    )}
                  >
                    {category.productCount}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>

        {activeCategory && (
          <Link
            href={buildCatalogUrl({ q, sort })}
            className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-accent/25 bg-accent-soft/50 px-3 py-2.5 text-sm font-semibold text-accent transition-colors hover:bg-accent-soft"
          >
            <X className="h-4 w-4" />
            נקה סינון
          </Link>
        )}
      </div>
    </aside>
  );
}
