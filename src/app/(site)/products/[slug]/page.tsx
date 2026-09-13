import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductInfo } from "@/components/product/product-info";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Container } from "@/components/ui/container";
import { ProductCard } from "@/components/ui/product-card";
import { Reveal } from "@/components/ui/reveal";
import { sanitizeHtml } from "@/lib/sanitize";
import {
  getAllProductSlugs,
  getProductBySlug,
  getRelatedProducts,
} from "@/lib/products";
import { getSiteSettings } from "@/lib/site-settings";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await getAllProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return { title: "מוצר לא נמצא" };
  }

  return {
    title: product.name,
    description: product.shortDescription,
    openGraph: {
      title: product.name,
      description: product.shortDescription,
      images: [{ url: product.image }],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const related = await getRelatedProducts(product);
  const settings = await getSiteSettings();
  const productUrl = `https://electricity-shop.co.il/products/${product.slug}`;

  return (
    <>
      <section className="border-b border-border bg-surface-alt/80 bg-grid-light">
        <Container className="py-4 sm:py-5">
          <Breadcrumbs
            items={[
              { label: "בית", href: "/" },
              { label: "מוצרים", href: "/products" },
              { label: product.category, href: `/categories/${product.categorySlug}` },
              { label: product.name },
            ]}
          />
        </Container>
      </section>

      <section className="section-padding bg-surface">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:items-start lg:gap-12">
            <Reveal>
              <ProductGallery images={product.images} productName={product.name} />
            </Reveal>
            <Reveal delay={80}>
              <ProductInfo product={product} productUrl={productUrl} settings={settings} />
            </Reveal>
          </div>

          {product.description && (
            <Reveal delay={120}>
              <div
                className="prose mt-12 max-w-none rounded-2xl border border-border bg-surface-alt p-6 md:p-8"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(product.description) }}
              />
            </Reveal>
          )}
        </Container>
      </section>

      {related.length > 0 && (
        <section className="section-padding bg-surface-alt/70 bg-grid-light">
          <Container>
            <Reveal>
              <h2 className="heading-section mb-8">מוצרים קשורים</h2>
            </Reveal>
            <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 lg:gap-6">
              {related.map((item, index) => (
                <Reveal key={item.id} delay={index * 70}>
                  <ProductCard product={item} />
                </Reveal>
              ))}
            </div>
          </Container>
        </section>
      )}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.name,
            description: product.shortDescription,
            image: product.images,
            sku: product.sku,
            brand: { "@type": "Brand", name: settings.name },
            offers: {
              "@type": "Offer",
              availability: "https://schema.org/InStock",
              priceCurrency: "ILS",
              url: productUrl,
            },
          }),
        }}
      />
    </>
  );
}
