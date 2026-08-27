import Link from "next/link";
import { FolderTree, MessageSquare, Package, Plus } from "lucide-react";
import { db } from "@/lib/db";

export default async function AdminDashboardPage() {
  const [productCount, publishedCount, newInquiries, recentInquiries] =
    await Promise.all([
      db.product.count({ where: { deletedAt: null } }),
      db.product.count({ where: { status: "published", deletedAt: null } }),
      db.inquiry.count({ where: { status: "new" } }),
      db.inquiry.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
    ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-primary">לוח בקרה</h1>
        <p className="mt-2 text-text-secondary">סקירה מהירה של האתר והפניות האחרונות.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "סה\"כ מוצרים", value: productCount },
          { label: "מוצרים מפורסמים", value: publishedCount },
          { label: "פניות חדשות", value: newInquiries },
          { label: "קטגוריות", value: await db.category.count() },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-border bg-surface p-5 shadow-sm"
          >
            <p className="text-sm text-text-secondary">{stat.label}</p>
            <p className="mt-2 text-3xl font-bold text-primary">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Link
          href="/admin/products/new"
          className="flex items-center gap-4 rounded-xl border border-border bg-surface p-5 shadow-sm transition-shadow hover:shadow-md"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent text-primary">
            <Plus className="h-6 w-6" />
          </span>
          <div>
            <p className="font-bold text-primary">הוסף מוצר</p>
            <p className="text-sm text-text-secondary">פרסם פריט חדש בקטלוג</p>
          </div>
        </Link>
        <Link
          href="/admin/categories"
          className="flex items-center gap-4 rounded-xl border border-border bg-surface p-5 shadow-sm transition-shadow hover:shadow-md"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <FolderTree className="h-6 w-6" />
          </span>
          <div>
            <p className="font-bold text-primary">ניהול קטגוריות</p>
            <p className="text-sm text-text-secondary">יצירה, סדר ותתי-קטגוריות</p>
          </div>
        </Link>
        <Link
          href="/admin/inquiries"
          className="flex items-center gap-4 rounded-xl border border-border bg-surface p-5 shadow-sm transition-shadow hover:shadow-md"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <MessageSquare className="h-6 w-6" />
          </span>
          <div>
            <p className="font-bold text-primary">פניות לקוחות</p>
            <p className="text-sm text-text-secondary">{newInquiries} ממתינות לטיפול</p>
          </div>
        </Link>
      </div>

      <section className="rounded-xl border border-border bg-surface p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-primary">פניות אחרונות</h2>
          <Link href="/admin/inquiries" className="text-sm font-semibold text-accent hover:underline">
            הכל
          </Link>
        </div>
        {recentInquiries.length === 0 ? (
          <p className="text-sm text-text-secondary">אין פניות עדיין.</p>
        ) : (
          <ul className="space-y-3">
            {recentInquiries.map((inquiry) => (
              <li
                key={inquiry.id}
                className="flex items-center justify-between gap-4 rounded-lg bg-surface-alt px-4 py-3 text-sm"
              >
                <div>
                  <p className="font-semibold text-text-primary">{inquiry.name}</p>
                  <p className="text-text-secondary" dir="ltr">
                    {inquiry.phone}
                  </p>
                </div>
                <span className="text-xs text-text-secondary">
                  {new Intl.DateTimeFormat("he-IL", {
                    dateStyle: "short",
                    timeStyle: "short",
                  }).format(inquiry.createdAt)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <Link
        href="/admin/products"
        className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-accent"
      >
        <Package className="h-4 w-4" />
        ניהול כל המוצרים
      </Link>
    </div>
  );
}
