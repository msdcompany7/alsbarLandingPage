import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { ProductEditor } from "@/components/admin/product-editor";

type EditProductPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;

  const [product, categories] = await Promise.all([
    db.product.findFirst({
      where: { id, deletedAt: null },
      include: { images: { orderBy: { sortOrder: "asc" } } },
    }),
    db.category.findMany({
      orderBy: { sortOrder: "asc" },
      select: { id: true, nameHe: true },
    }),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary">עריכת מוצר</h1>
        <p className="mt-2 text-text-secondary">{product.nameHe}</p>
      </div>
      <div className="rounded-xl border border-border bg-surface p-6 shadow-sm">
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
      </div>
    </div>
  );
}
