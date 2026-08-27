import { db } from "@/lib/db";
import { ProductEditor } from "@/components/admin/product-editor";

export default async function NewProductPage() {
  const categories = await db.category.findMany({
    orderBy: { sortOrder: "asc" },
    select: { id: true, nameHe: true },
  });

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary">הוספת מוצר</h1>
        <p className="mt-2 text-text-secondary">
          מלאu את הפרטים ופרסם כשאתם מוכנים.
        </p>
      </div>
      <div className="rounded-xl border border-border bg-surface p-6 shadow-sm">
        <ProductEditor categories={categories} />
      </div>
    </div>
  );
}
