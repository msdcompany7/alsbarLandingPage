import { notFound } from "next/navigation";
import { CategoryEditor } from "@/components/admin/category-editor";
import { AdminCard } from "@/components/admin/ui/admin-card";
import { AdminPageHeader } from "@/components/admin/ui/admin-page-header";
import {
  getCategoryById,
  listRootCategoriesForSelectExcluding,
} from "@/lib/firestore/categories";

type EditCategoryPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditCategoryPage({ params }: EditCategoryPageProps) {
  const { id } = await params;

  const [category, parentOptions] = await Promise.all([
    getCategoryById(id),
    listRootCategoriesForSelectExcluding(id),
  ]);

  if (!category) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <AdminPageHeader title="עריכת קטגוריה" description={category.nameHe} />
      <AdminCard padding="lg">
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
      </AdminCard>
    </div>
  );
}
