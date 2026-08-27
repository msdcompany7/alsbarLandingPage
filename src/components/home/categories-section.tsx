import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { PublicCategory } from "@/lib/catalog";
import { CategoryTile } from "@/components/ui/category-tile";
import { Container } from "@/components/ui/container";

type CategoriesSectionProps = {
  categories: PublicCategory[];
};

export function CategoriesSection({ categories }: CategoriesSectionProps) {
  if (categories.length === 0) return null;

  return (
    <section className="section-padding bg-surface">
      <Container>
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-accent">
              קטלוג מוצרים
            </p>
            <h2 className="text-3xl font-bold text-primary md:text-[2rem]">
              קטגוריות מוצרים
            </h2>
            <p className="mt-2 max-w-xl text-text-secondary">
              {"מצאu במהירות את הציוד שאתם צריכים — מכבלים ועד לוחות חשמל."}
            </p>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-accent"
          >
            לכל המוצרים
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <CategoryTile key={category.id} category={category} />
          ))}
        </div>
      </Container>
    </section>
  );
}
