import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/ui/page-hero";
import { ProductCard } from "@/components/ui/product-card";
import { Reveal } from "@/components/ui/reveal";
import {
  getAllCategorySlugs,
  getCategoryBySlug,
  getProducts,
} from "@/lib/products";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await getAllCategorySlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    return { title: "קטגוריה לא נמצאה" };
  }

  return {
    title: category.name,
    description: category.description,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const { products } = await getProducts({ category: slug, pageSize: 100 });

  return (
    <>
      <PageHero
        title={category.name}
        description={category.description}
        breadcrumbs={[
          { label: "בית", href: "/" },
          { label: "מוצרים", href: "/products" },
          { label: category.name },
        ]}
      />

      <section className="section-padding bg-surface">
        <Container>
          <Reveal>
            <p className="mb-8 text-sm text-text-secondary">
              {products.length} מוצרים בקטגוריה זו
            </p>
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4 xl:gap-6">
            {products.map((product, index) => (
              <Reveal key={product.id} delay={index * 60}>
                <ProductCard product={product} />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
