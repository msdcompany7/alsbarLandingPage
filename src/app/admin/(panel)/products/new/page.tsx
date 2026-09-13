import { ProductEditor } from "@/components/admin/product-editor";
import { AdminCard } from "@/components/admin/ui/admin-card";
import { AdminPageHeader } from "@/components/admin/ui/admin-page-header";
import { getCategorySelectOptions } from "@/lib/firestore/categories";

export default async function NewProductPage() {
  const categories = await getCategorySelectOptions();

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <AdminPageHeader title="מוצר חדש" description="הוספת מוצר חדש לקטלוג." />
      <AdminCard padding="lg">
        <ProductEditor categories={categories} />
      </AdminCard>
    </div>
  );
}
