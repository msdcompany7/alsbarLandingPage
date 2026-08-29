import Link from "next/link";
import { Pencil, Plus } from "lucide-react";
import { AdminBadge } from "@/components/admin/ui/admin-badge";
import { AdminPageHeader } from "@/components/admin/ui/admin-page-header";
import {
  AdminTable,
  AdminTableBody,
  AdminTableCell,
  AdminTableElement,
  AdminTableHead,
  AdminTableHeadCell,
  AdminTableRow,
} from "@/components/admin/ui/admin-table";
import { Button } from "@/components/ui/button";
import { listAdminProducts } from "@/lib/firestore/products";

const statusLabels = {
  draft: "טיוטה",
  published: "פורסם",
  archived: "בארכיון",
} as const;

const statusVariants = {
  draft: "warning",
  published: "success",
  archived: "muted",
} as const;

export default async function AdminProductsPage() {
  const products = await listAdminProducts();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="מוצרים"
        description={`${products.length} מוצרים במערכת`}
        actions={
          <>
            <Button href="/admin/products/import" variant="outline" size="sm" className="rounded-xl">
              ייבוא / ייצוא CSV
            </Button>
            <Button href="/admin/products/new" variant="primary" size="sm" className="rounded-xl">
              <Plus className="h-4 w-4" />
              הוסף מוצר
            </Button>
          </>
        }
      />

      <AdminTable>
        <AdminTableElement>
          <AdminTableHead>
            <AdminTableHeadCell>מוצר</AdminTableHeadCell>
            <AdminTableHeadCell>קטגוריה</AdminTableHeadCell>
            <AdminTableHeadCell>סטטוס</AdminTableHeadCell>
            <AdminTableHeadCell>פעולות</AdminTableHeadCell>
          </AdminTableHead>
          <AdminTableBody>
            {products.map((product) => (
              <AdminTableRow key={product.id}>
                <AdminTableCell>
                  <div className="font-semibold text-text-primary">{product.nameHe}</div>
                  <div className="text-xs text-text-secondary" dir="ltr">
                    {product.slug}
                  </div>
                </AdminTableCell>
                <AdminTableCell className="text-text-secondary">
                  {product.category.nameHe}
                </AdminTableCell>
                <AdminTableCell>
                  <AdminBadge variant={statusVariants[product.status]}>
                    {statusLabels[product.status]}
                  </AdminBadge>
                </AdminTableCell>
                <AdminTableCell>
                  <Link
                    href={`/admin/products/${product.id}`}
                    className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-sm font-semibold text-primary transition-colors hover:bg-surface-alt hover:text-accent"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    עריכה
                  </Link>
                </AdminTableCell>
              </AdminTableRow>
            ))}
          </AdminTableBody>
        </AdminTableElement>
      </AdminTable>
    </div>
  );
}
