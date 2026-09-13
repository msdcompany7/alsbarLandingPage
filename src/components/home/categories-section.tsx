import type { PublicCategory } from "@/lib/catalog";
import { CategoryTile } from "@/components/ui/category-tile";
import { Container } from "@/components/ui/container";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

type CategoriesSectionProps = {
  categories: PublicCategory[];
};

export function CategoriesSection({ categories }: CategoriesSectionProps) {
  if (categories.length === 0) return null;

  return (
    <section className="section-padding-sm bg-surface">
      <Container>
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3 sm:mb-6">
          <div>
            <p className="eyebrow mb-1.5">קטלוג מוצרים</p>
            <h2 className="text-xl font-bold text-primary sm:text-2xl">קטגוריות מוצרים</h2>
          </div>
          <Link
            href="/products"
            className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-primary transition-colors hover:text-accent"
          >
            לכל המוצרים
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-2.5 md:grid-cols-4 lg:grid-cols-6">
          {categories.map((category) => (
            <CategoryTile key={category.id} category={category} compact />
          ))}
        </div>
      </Container>
    </section>
  );
}
