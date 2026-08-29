import Link from "next/link";
import { FolderTree, MessageSquare, Package, Plus } from "lucide-react";
import { AdminActionCard } from "@/components/admin/ui/admin-action-card";
import { AdminCard, AdminCardHeader } from "@/components/admin/ui/admin-card";
import { AdminPageHeader } from "@/components/admin/ui/admin-page-header";
import { AdminStatCard } from "@/components/admin/ui/admin-stat-card";
import { countCategories } from "@/lib/firestore/categories";
import { getRecentInquiries, countNewInquiries } from "@/lib/firestore/inquiries";
import {
  countActiveProducts,
  countPublishedProducts,
} from "@/lib/firestore/products";

export default async function AdminDashboardPage() {
  const [productCount, publishedCount, newInquiries, recentInquiries, categoryCount] =
    await Promise.all([
      countActiveProducts(),
      countPublishedProducts(),
      countNewInquiries(),
      getRecentInquiries(5),
      countCategories(),
    ]);

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="לוח בקרה"
        description="סקירה מהירה של האתר, המוצרים והפניות האחרונות."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard label='סה"כ מוצרים' value={productCount} icon={Package} accent="default" />
        <AdminStatCard
          label="מוצרים מפורסמים"
          value={publishedCount}
          icon={Package}
          accent="success"
        />
        <AdminStatCard
          label="פניות חדשות"
          value={newInquiries}
          icon={MessageSquare}
          accent="orange"
        />
        <AdminStatCard
          label="קטגוריות"
          value={categoryCount}
          icon={FolderTree}
          accent="muted"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <AdminActionCard
          href="/admin/products/new"
          title="הוסף מוצר"
          description="פרסם פריט חדש בקטלוג"
          icon={Plus}
          accent="orange"
        />
        <AdminActionCard
          href="/admin/categories"
          title="ניהול קטגוריות"
          description="יצירה, סדר ותתי-קטגוריות"
          icon={FolderTree}
          accent="dark"
        />
        <AdminActionCard
          href="/admin/inquiries"
          title="פניות לקוחות"
          description={`${newInquiries} ממתינות לטיפול`}
          icon={MessageSquare}
          accent="neutral"
        />
      </div>

      <AdminCard>
        <AdminCardHeader
          title="פניות אחרונות"
          action={
            <Link
              href="/admin/inquiries"
              className="text-sm font-semibold text-accent transition-colors hover:text-accent-hover"
            >
              הכל
            </Link>
          }
        />
        {recentInquiries.length === 0 ? (
          <p className="text-sm text-text-secondary">אין פניות עדיין.</p>
        ) : (
          <ul className="space-y-2">
            {recentInquiries.map((inquiry) => (
              <li
                key={inquiry.id}
                className="flex items-center justify-between gap-4 rounded-xl border border-border/70 bg-surface-alt/60 px-4 py-3.5 text-sm transition-colors hover:bg-surface-alt"
              >
                <div>
                  <p className="font-semibold text-text-primary">{inquiry.name}</p>
                  <p className="text-text-secondary" dir="ltr">
                    {inquiry.phone}
                  </p>
                </div>
                <span className="shrink-0 text-xs font-medium text-text-secondary">
                  {new Intl.DateTimeFormat("he-IL", {
                    dateStyle: "short",
                    timeStyle: "short",
                  }).format(inquiry.createdAt)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </AdminCard>

      <Link
        href="/admin/products"
        className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-accent"
      >
        <Package className="h-4 w-4" />
        ניהול כל המוצרים
      </Link>
    </div>
  );
}
