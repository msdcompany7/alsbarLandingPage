import Link from "next/link";
import { Pencil } from "lucide-react";
import { db } from "@/lib/db";
import { cn } from "@/lib/utils";

const statusLabels = {
  draft: "טיוטה",
  published: "פורסם",
  archived: "בארכיון",
} as const;

export default async function AdminProductsPage() {
  const products = await db.product.findMany({
    where: { deletedAt: null },
    include: {
      category: true,
      images: { orderBy: { sortOrder: "asc" }, take: 1 },
    },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">מוצרים</h1>
          <p className="mt-2 text-text-secondary">{products.length} מוצרים במערכת</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/products/import"
            className="inline-flex items-center justify-center rounded-lg border border-border bg-surface px-5 py-3 text-sm font-semibold text-primary hover:bg-surface-alt"
          >
            ייבוא / ייצוא CSV
          </Link>
          <Link
            href="/admin/products/new"
            className="inline-flex items-center justify-center rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-primary hover:bg-accent-hover"
          >
            + הוסף מוצר
          </Link>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-surface-alt text-text-secondary">
              <tr>
                <th scope="col" className="px-4 py-3 text-start font-semibold">מוצר</th>
                <th scope="col" className="px-4 py-3 text-start font-semibold">קטגוריה</th>
                <th scope="col" className="px-4 py-3 text-start font-semibold">סטטוס</th>
                <th scope="col" className="px-4 py-3 text-start font-semibold">פעולות</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-t border-border">
                  <td className="px-4 py-3">
                    <div className="font-semibold text-text-primary">{product.nameHe}</div>
                    <div className="text-xs text-text-secondary" dir="ltr">
                      {product.slug}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-text-secondary">{product.category.nameHe}</td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-0.5 text-xs font-semibold",
                        product.status === "published"
                          ? "bg-success/10 text-success"
                          : product.status === "draft"
                            ? "bg-accent/15 text-primary"
                            : "bg-surface-alt text-text-secondary",
                      )}
                    >
                      {statusLabels[product.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/products/${product.id}`}
                      className="inline-flex items-center gap-1 font-medium text-primary hover:text-accent"
                    >
                      <Pencil className="h-4 w-4" />
                      עריכה
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
