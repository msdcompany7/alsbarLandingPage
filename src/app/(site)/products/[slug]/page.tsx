import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductInfo } from "@/components/product/product-info";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Container } from "@/components/ui/container";
import { ProductCard } from "@/components/ui/product-card";
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
      <section className="border-b border-border bg-surface-alt py-6">
        <Container>
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
          <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-start">
            <ProductGallery images={product.images} productName={product.name} />
            <ProductInfo product={product} productUrl={productUrl} settings={settings} />
          </div>

          {product.description && (
            <div
              className="prose prose-slate mt-12 max-w-none rounded-xl border border-border bg-surface-alt p-6 md:p-8"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(product.description) }}
            />
          )}
        </Container>
      </section>

      {related.length > 0 && (
        <section className="section-padding bg-surface-alt">
          <Container>
            <h2 className="mb-8 text-2xl font-bold text-primary">מוצרים קשורים</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((item) => (
                <ProductCard key={item.id} product={item} />
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
