import Image from "next/image";
import Link from "next/link";
import type { PublicCategory } from "@/lib/catalog";

type CategoryTileProps = {
  category: PublicCategory;
};

export function CategoryTile({ category }: CategoryTileProps) {
  return (
    <Link
      href={`/categories/${category.slug}`}
      className="group relative aspect-[4/3] overflow-hidden rounded-xl"
    >
      <Image
        src={category.image}
        alt={category.name}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-5">
        <h3 className="text-xl font-bold text-white">{category.name}</h3>
        <p className="mt-1 text-sm text-white/80">
          {category.productCount} מוצרים
        </p>
      </div>
    </Link>
  );
}
