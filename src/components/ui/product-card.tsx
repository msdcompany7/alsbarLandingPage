import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { PublicProduct } from "@/lib/catalog";

type ProductCardProps = {
  product: PublicProduct;
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-border bg-surface shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-surface-alt">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute top-3 start-3 rounded-md bg-primary/90 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
          {product.category}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <h3 className="text-lg font-semibold leading-snug text-text-primary transition-colors group-hover:text-primary">
          {product.name}
        </h3>
        <p className="line-clamp-2 text-sm text-text-secondary">
          {product.shortDescription}
        </p>
        <span className="mt-auto inline-flex items-center gap-1 pt-2 text-sm font-semibold text-accent">
          בקשת הצעת מחיר
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
