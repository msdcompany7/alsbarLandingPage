import { notFound } from "next/navigation";
import { CategoryEditor } from "@/components/admin/category-editor";
import { db } from "@/lib/db";

type EditCategoryPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditCategoryPage({ params }: EditCategoryPageProps) {
  const { id } = await params;

  const [category, parentOptions] = await Promise.all([
    db.category.findUnique({ where: { id } }),
    db.category.findMany({
      where: { parentId: null, NOT: { id } },
      orderBy: { sortOrder: "asc" },
      select: { id: true, nameHe: true },
    }),
  ]);

  if (!category) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary">עריכת קטגוריה</h1>
        <p className="mt-2 text-text-secondary">{category.nameHe}</p>
      </div>
      <div className="rounded-xl border border-border bg-surface p-6 shadow-sm">
        <CategoryEditor
          parentOptions={parentOptions}
          initial={{
            id: category.id,
            slug: category.slug,
            nameHe: category.nameHe,
            nameEn: category.nameEn ?? "",
            description: category.description ?? "",
            parentId: category.parentId,
            imageUrl: category.imageUrl ?? "",
            icon: category.icon ?? "",
            sortOrder: category.sortOrder,
          }}
        />
      </div>
    </div>
  );
}
