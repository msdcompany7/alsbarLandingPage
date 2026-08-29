import type { PublicProduct } from "@/lib/catalog";
import { Container } from "@/components/ui/container";
import { ProductCard } from "@/components/ui/product-card";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeader } from "@/components/ui/section-header";

type FeaturedProductsProps = {
  products: PublicProduct[];
};

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  if (products.length === 0) return null;

  return (
    <section className="section-padding bg-surface-alt/70 bg-grid-light">
      <Container>
        <SectionHeader
          eyebrow="מומלצים"
          title="מוצרים נבחרים"
          description="פריטים פופולריים מהמלאי — לחצu לפרטים ובקשת הצעת מחיר."
          actionHref="/products"
          actionLabel="צפu בכל המוצרים"
        />

        <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 lg:gap-6">
          {products.map((product, index) => (
            <Reveal key={product.id} delay={index * 70}>
              <ProductCard product={product} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
