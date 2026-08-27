import { CategoryEditor } from "@/components/admin/category-editor";
import { db } from "@/lib/db";

export default async function NewCategoryPage() {
  const parentOptions = await db.category.findMany({
    where: { parentId: null },
    orderBy: { sortOrder: "asc" },
    select: { id: true, nameHe: true },
  });

  const nextSortOrder = await db.category.count();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary">קטגוריה חדשה</h1>
        <p className="mt-2 text-text-secondary">יצירת קטגוריה ראשית או תת-קטגוריה.</p>
      </div>
      <div className="rounded-xl border border-border bg-surface p-6 shadow-sm">
        <CategoryEditor parentOptions={parentOptions} initial={{ sortOrder: nextSortOrder }} />
      </div>
    </div>
  );
}
