import { CategoryEditor } from "@/components/admin/category-editor";
import { AdminCard } from "@/components/admin/ui/admin-card";
import { AdminPageHeader } from "@/components/admin/ui/admin-page-header";
import {
  countCategories,
  listRootCategoriesForSelect,
} from "@/lib/firestore/categories";

export default async function NewCategoryPage() {
  const [parentOptions, nextSortOrder] = await Promise.all([
    listRootCategoriesForSelect(),
    countCategories(),
  ]);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <AdminPageHeader
        title="קטגוריה חדשה"
        description="יצירת קטגוריה ראשית או תת-קטגוריה."
      />
      <AdminCard padding="lg">
        <CategoryEditor parentOptions={parentOptions} initial={{ sortOrder: nextSortOrder }} />
      </AdminCard>
    </div>
  );
}
