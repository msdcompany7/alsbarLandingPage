import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CsvImportForm } from "@/components/admin/csv-import-form";
import { CsvExportButton } from "@/components/admin/csv-export-button";

export default function AdminProductsImportPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link
            href="/admin/products"
            className="mb-3 inline-flex items-center gap-1 text-sm font-medium text-text-secondary hover:text-primary"
          >
            <ArrowRight className="h-4 w-4" />
            חזרה למוצרים
          </Link>
          <h1 className="text-3xl font-bold text-primary">ייבוא / ייצוא מוצרים</h1>
          <p className="mt-2 text-text-secondary">
            ייבוא מרוכז מקובץ CSV עם תצוגה מקדימה, או ייצוא גיבוי של כל המוצרים.
          </p>
        </div>
        <CsvExportButton />
      </div>

      <div className="rounded-xl border border-border bg-surface p-6 shadow-sm">
        <h2 className="mb-6 text-xl font-bold text-primary">ייבוא CSV</h2>
        <CsvImportForm />
      </div>
    </div>
  );
}
