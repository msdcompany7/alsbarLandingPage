import Link from "next/link";
import type { ReactNode } from "react";
import { FolderTree, Pencil, Plus } from "lucide-react";
import { AdminCard } from "@/components/admin/ui/admin-card";
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
import { listCategoriesForAdminTable } from "@/lib/firestore/categories";
import { countAllProductsInCategory } from "@/lib/firestore/products";

type CategoryRecord = Awaited<ReturnType<typeof listCategoriesForAdminTable>>[number];

async function buildCategoryRows(
  categories: CategoryRecord[],
  childrenByParent: Map<string, CategoryRecord[]>,
  productCounts: Map<string, number>,
  depth = 0,
): Promise<ReactNode[]> {
  const rows: ReactNode[] = [];

  for (const category of categories) {
    rows.push(
      <AdminTableRow key={category.id}>
        <AdminTableCell>
          <div
            className="font-semibold text-text-primary"
            style={{ paddingInlineStart: depth * 20 }}
          >
            {category.nameHe}
          </div>
          <div
            className="text-xs text-text-secondary"
            dir="ltr"
            style={{ paddingInlineStart: depth * 20 }}
          >
            {category.slug}
          </div>
        </AdminTableCell>
        <AdminTableCell className="text-text-secondary">
          {category.parent?.nameHe ?? "—"}
        </AdminTableCell>
        <AdminTableCell className="text-text-secondary">
          {productCounts.get(category.id) ?? 0}
        </AdminTableCell>
        <AdminTableCell className="text-text-secondary">{category.sortOrder}</AdminTableCell>
        <AdminTableCell>
          <Link
            href={`/admin/categories/${category.id}`}
            className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-sm font-semibold text-primary transition-colors hover:bg-surface-alt hover:text-accent"
          >
            <Pencil className="h-3.5 w-3.5" />
            עריכה
          </Link>
        </AdminTableCell>
      </AdminTableRow>,
    );

    const children = childrenByParent.get(category.id) ?? [];
    if (children.length > 0) {
      rows.push(
        ...(await buildCategoryRows(children, childrenByParent, productCounts, depth + 1)),
      );
    }
  }

  return rows;
}

export default async function AdminCategoriesPage() {
  const categories = await listCategoriesForAdminTable();
  const productCounts = new Map(
    await Promise.all(
      categories.map(async (category) => [
        category.id,
        await countAllProductsInCategory(category.id),
      ] as const),
    ),
  );

  const roots = categories.filter((category) => !category.parentId);
  const childrenByParent = new Map<string, CategoryRecord[]>();

  for (const category of categories) {
    if (!category.parentId) continue;
    const siblings = childrenByParent.get(category.parentId) ?? [];
    siblings.push(category);
    childrenByParent.set(category.parentId, siblings);
  }

  const rows = await buildCategoryRows(roots, childrenByParent, productCounts);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="קטגוריות"
        description={`${categories.length} קטגוריות במערכת`}
        actions={
          <Button href="/admin/categories/new" variant="primary" size="sm" className="rounded-xl">
            <Plus className="h-4 w-4" />
            הוסף קטגוריה
          </Button>
        }
      />

      <AdminCard className="flex items-start gap-3 border-accent/20 bg-accent-soft/30 text-sm text-text-secondary">
        <FolderTree className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
        <p>
          ניתן ליצור עד שני רמות: קטגוריה ראשית ותת-קטגוריה. לא ניתן למחוק קטגוריה עם מוצרים
          או תתי-קטגוריות.
        </p>
      </AdminCard>

      <AdminTable>
        <AdminTableElement>
          <AdminTableHead>
            <AdminTableHeadCell>קטגוריה</AdminTableHeadCell>
            <AdminTableHeadCell>הורה</AdminTableHeadCell>
            <AdminTableHeadCell>מוצרים</AdminTableHeadCell>
            <AdminTableHeadCell>סדר</AdminTableHeadCell>
            <AdminTableHeadCell>פעולות</AdminTableHeadCell>
          </AdminTableHead>
          <AdminTableBody>
            {roots.length === 0 ? (
              <AdminTableRow>
                <AdminTableCell colSpan={5} className="py-10 text-center text-text-secondary">
                  אין קטגוריות עדיין.
                </AdminTableCell>
              </AdminTableRow>
            ) : (
              rows
            )}
          </AdminTableBody>
        </AdminTableElement>
      </AdminTable>
    </div>
  );
}
