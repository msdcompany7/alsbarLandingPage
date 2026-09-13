import { notFound } from "next/navigation";
import { ProductEditor } from "@/components/admin/product-editor";
import { AdminCard } from "@/components/admin/ui/admin-card";
import { AdminPageHeader } from "@/components/admin/ui/admin-page-header";
import { getCategorySelectOptions } from "@/lib/firestore/categories";
import { getAdminProductById } from "@/lib/firestore/products";

type EditProductPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;

  const [product, categories] = await Promise.all([
    getAdminProductById(id),
    getCategorySelectOptions(),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <AdminPageHeader title="עריכת מוצר" description={product.nameHe} />
      <AdminCard padding="lg">
        <ProductEditor
          categories={categories}
          initial={{
            id: product.id,
            nameHe: product.nameHe,
            slug: product.slug,
            categoryId: product.categoryId,
            shortDescription: product.shortDescription ?? "",
            description: product.description ?? "",
            sku: product.sku ?? "",
            status: product.status,
            isFeatured: product.isFeatured,
            images: product.images.map((image) => ({
              url: image.url,
              altTextHe: image.altTextHe ?? undefined,
            })),
          }}
        />
      </AdminCard>
    </div>
  );
}
