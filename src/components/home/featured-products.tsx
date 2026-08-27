import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { PublicProduct } from "@/lib/catalog";
import { Container } from "@/components/ui/container";
import { ProductCard } from "@/components/ui/product-card";

type FeaturedProductsProps = {
  products: PublicProduct[];
};

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  if (products.length === 0) return null;

  return (
    <section className="section-padding bg-surface-alt">
      <Container>
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-accent">
              מומלצים
            </p>
            <h2 className="text-3xl font-bold text-primary md:text-[2rem]">
              מוצרים נבחרים
            </h2>
            <p className="mt-2 max-w-xl text-text-secondary">
              פריטים פופולריים מהמלאי — לחצu לפרטים ובקשת הצעת מחיר.
            </p>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-accent"
          >
            צפu בכל המוצרים
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </Container>
    </section>
  );
}
