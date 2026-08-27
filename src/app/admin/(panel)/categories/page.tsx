import Link from "next/link";
import type { ReactNode } from "react";
import { FolderTree, Pencil, Plus } from "lucide-react";
import { db } from "@/lib/db";

type CategoryRecord = Awaited<
  ReturnType<typeof db.category.findMany<{ include: { parent: { select: { nameHe: true } }; _count: { select: { products: true; children: true } } } }>>
>[number];

function buildCategoryRows(
  categories: CategoryRecord[],
  childrenByParent: Map<string, CategoryRecord[]>,
  depth = 0,
): ReactNode[] {
  const rows: ReactNode[] = [];

  for (const category of categories) {
    rows.push(
      <tr key={category.id} className="border-t border-border">
        <td className="px-4 py-3">
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
        </td>
        <td className="px-4 py-3 text-text-secondary">{category.parent?.nameHe ?? "—"}</td>
        <td className="px-4 py-3 text-text-secondary">{category._count.products}</td>
        <td className="px-4 py-3 text-text-secondary">{category.sortOrder}</td>
        <td className="px-4 py-3">
          <Link
            href={`/admin/categories/${category.id}`}
            className="inline-flex items-center gap-1 font-medium text-primary hover:text-accent"
          >
            <Pencil className="h-4 w-4" />
            עריכה
          </Link>
        </td>
      </tr>,
    );

    const children = childrenByParent.get(category.id) ?? [];
    if (children.length > 0) {
      rows.push(...buildCategoryRows(children, childrenByParent, depth + 1));
    }
  }

  return rows;
}

export default async function AdminCategoriesPage() {
  const categories = await db.category.findMany({
    include: {
      parent: { select: { nameHe: true } },
      _count: { select: { products: true, children: true } },
    },
    orderBy: [{ sortOrder: "asc" }, { nameHe: "asc" }],
  });

  const roots = categories.filter((category) => !category.parentId);
  const childrenByParent = new Map<string, CategoryRecord[]>();

  for (const category of categories) {
    if (!category.parentId) continue;
    const siblings = childrenByParent.get(category.parentId) ?? [];
    siblings.push(category);
    childrenByParent.set(category.parentId, siblings);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">קטגוריות</h1>
          <p className="mt-2 text-text-secondary">{categories.length} קטגוריות במערכת</p>
        </div>
        <Link
          href="/admin/categories/new"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-primary hover:bg-accent-hover"
        >
          <Plus className="h-4 w-4" />
          הוסף קטגוריה
        </Link>
      </div>

      <div className="rounded-xl border border-border bg-surface p-5 text-sm text-text-secondary">
        <div className="flex items-start gap-3">
          <FolderTree className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
          <p>
            ניתן ליצור עד שני רמות: קטגוריה ראשית ותת-קטגוריה. לא ניתן למחוק קטגוריה עם מוצרים
            או תתי-קטגוריות.
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-surface-alt text-text-secondary">
              <tr>
                <th scope="col" className="px-4 py-3 text-start font-semibold">
                  קטגוריה
                </th>
                <th scope="col" className="px-4 py-3 text-start font-semibold">
                  הורה
                </th>
                <th scope="col" className="px-4 py-3 text-start font-semibold">
                  מוצרים
                </th>
                <th scope="col" className="px-4 py-3 text-start font-semibold">
                  סדר
                </th>
                <th scope="col" className="px-4 py-3 text-start font-semibold">
                  פעולות
                </th>
              </tr>
            </thead>
            <tbody>
              {roots.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-text-secondary">
                    אין קטגוריות עדיין.
                  </td>
                </tr>
              ) : (
                buildCategoryRows(roots, childrenByParent)
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
