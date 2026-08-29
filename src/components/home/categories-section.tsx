import type { PublicCategory } from "@/lib/catalog";
import { CategoryTile } from "@/components/ui/category-tile";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeader } from "@/components/ui/section-header";

type CategoriesSectionProps = {
  categories: PublicCategory[];
};

export function CategoriesSection({ categories }: CategoriesSectionProps) {
  if (categories.length === 0) return null;

  return (
    <section className="section-padding bg-surface">
      <Container>
        <SectionHeader
          eyebrow="קטלוג מוצרים"
          title="קטגוריות מוצרים"
          description="מצאu במהירות את הציוד שאתם צריכים — מכבלים ועד לוחות חשמל."
          actionHref="/products"
          actionLabel="לכל המוצרים"
        />

        <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
          {categories.map((category, index) => (
            <Reveal key={category.id} delay={index * 80}>
              <CategoryTile category={category} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
