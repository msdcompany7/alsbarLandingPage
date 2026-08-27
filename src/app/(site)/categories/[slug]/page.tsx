import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Container } from "@/components/ui/container";
import { ProductCard } from "@/components/ui/product-card";
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
    <section className="section-padding bg-surface-alt">
      <Container>
        <Breadcrumbs
          items={[
            { label: "בית", href: "/" },
            { label: "מוצרים", href: "/products" },
            { label: category.name },
          ]}
          className="mb-6"
        />

        <div className="mb-10 max-w-3xl">
          <h1 className="text-3xl font-bold text-primary md:text-4xl">
            {category.name}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-text-secondary">
            {category.description}
          </p>
          <p className="mt-2 text-sm text-text-secondary">
            {products.length} מוצרים בקטגוריה זו
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </Container>
    </section>
  );
}
