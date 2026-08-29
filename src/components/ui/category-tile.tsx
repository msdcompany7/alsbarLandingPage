import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { PublicCategory } from "@/lib/catalog";

type CategoryTileProps = {
  category: PublicCategory;
};

export function CategoryTile({ category }: CategoryTileProps) {
  return (
    <Link
      href={`/categories/${category.slug}`}
      className="card-hover group relative block aspect-[4/3] overflow-hidden rounded-2xl sm:aspect-[5/4] lg:aspect-[4/3]"
    >
      <Image
        src={category.image}
        alt={category.name}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/35 to-primary/5" />
      <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
        <h3 className="text-lg font-bold text-white sm:text-xl">{category.name}</h3>
        <p className="mt-1 text-sm text-white/80">{category.productCount} מוצרים</p>
        <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-accent sm:text-sm">
          לצפייה בקטגוריה
          <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}
