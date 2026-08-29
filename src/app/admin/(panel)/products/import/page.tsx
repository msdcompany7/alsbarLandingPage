import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CsvImportForm } from "@/components/admin/csv-import-form";
import { CsvExportButton } from "@/components/admin/csv-export-button";
import { AdminCard, AdminCardHeader } from "@/components/admin/ui/admin-card";
import { AdminPageHeader } from "@/components/admin/ui/admin-page-header";

export default function AdminProductsImportPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <AdminPageHeader
        title="ייבוא / ייצוא מוצרים"
        description="ייבוא מרוכז מקובץ CSV עם תצוגה מקדימה, או ייצוא גיבוי של כל המוצרים."
        backLink={
          <Link
            href="/admin/products"
            className="mb-3 inline-flex items-center gap-1.5 text-sm font-semibold text-text-secondary transition-colors hover:text-primary"
          >
            <ArrowRight className="h-4 w-4" />
            חזרה למוצרים
          </Link>
        }
        actions={<CsvExportButton />}
      />

      <AdminCard padding="lg">
        <AdminCardHeader title="ייבוא CSV" description="העלו קובץ, בדקו תצוגה מקדימה ואשרו ייבוא." />
        <CsvImportForm />
      </AdminCard>
    </div>
  );
}
