import Image from "next/image";
import Link from "next/link";
import type { PublicCategory } from "@/lib/catalog";
import { cn } from "@/lib/utils";

const CATEGORY_IMAGE_FALLBACK = "/placeholder-product.svg";

type CategoryTileProps = {
  category: PublicCategory;
  compact?: boolean;
};

export function CategoryTile({ category, compact = false }: CategoryTileProps) {
  const imageSrc = category.image?.trim() || CATEGORY_IMAGE_FALLBACK;

  if (compact) {
    return (
      <Link
        href={`/categories/${category.slug}`}
        className={cn(
          "group block overflow-hidden rounded-lg border border-border bg-surface shadow-[var(--shadow-soft)]",
          "transition-all hover:border-accent/30 hover:shadow-[var(--shadow-card)]",
        )}
      >
        <div className="relative aspect-[5/4] overflow-hidden sm:aspect-[4/3]">
          <Image
            src={imageSrc}
            alt={category.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/85 via-primary/25 to-transparent" />
          <h3 className="absolute inset-x-0 bottom-0 line-clamp-2 px-2 pb-2 text-center text-[11px] font-bold leading-snug text-white sm:px-2.5 sm:pb-2.5 sm:text-xs">
            {category.name}
          </h3>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/categories/${category.slug}`}
      className="card-hover group relative block aspect-[4/3] overflow-hidden rounded-2xl sm:aspect-[5/4] lg:aspect-[4/3]"
    >
      <Image
        src={imageSrc}
        alt={category.name}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/35 to-primary/5" />
      <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
        <h3 className="text-lg font-bold text-white sm:text-xl">{category.name}</h3>
        {category.productCount > 0 && (
          <p className="mt-1 text-sm text-white/80">{category.productCount} מוצרים</p>
        )}
      </div>
    </Link>
  );
}
