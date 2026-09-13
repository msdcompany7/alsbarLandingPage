import Link from "next/link";
import type { PublicCategory } from "@/lib/catalog";
import { cn } from "@/lib/utils";

type CategoryTileProps = {
  category: PublicCategory;
  compact?: boolean;
};

export function CategoryTile({ category, compact = false }: CategoryTileProps) {
  if (compact) {
    return (
      <Link
        href={`/categories/${category.slug}`}
        className={cn(
          "group flex min-h-10 items-center justify-center rounded-lg border border-border bg-surface px-2 py-2 text-center",
          "text-xs font-semibold leading-snug text-text-primary transition-colors sm:min-h-11 sm:px-2.5 sm:text-sm",
          "hover:border-accent/35 hover:bg-accent-soft/25 hover:text-primary",
        )}
      >
        <span className="line-clamp-2">{category.name}</span>
      </Link>
    );
  }

  return (
    <Link
      href={`/categories/${category.slug}`}
      className="card-hover group relative block aspect-[4/3] overflow-hidden rounded-2xl sm:aspect-[5/4] lg:aspect-[4/3]"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-light to-primary/90" />
      <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
        <h3 className="text-base font-bold text-white sm:text-lg">{category.name}</h3>
        {category.productCount > 0 && (
          <p className="mt-1 text-xs text-white/75">{category.productCount} מוצרים</p>
        )}
      </div>
    </Link>
  );
}
