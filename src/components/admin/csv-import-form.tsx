"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Upload } from "lucide-react";
import { parseCsv } from "@/lib/admin/csv";
import { importProducts } from "@/lib/admin/actions";
import {
  PRODUCT_CSV_HEADERS,
  validateProductCsvRow,
  type ProductCsvRow,
} from "@/lib/validation/product-csv";
import { Button } from "@/components/ui/button";
import { AdminAlert } from "@/components/admin/ui/admin-alert";
import {
  AdminTable,
  AdminTableBody,
  AdminTableCell,
  AdminTableElement,
  AdminTableHead,
  AdminTableHeadCell,
  AdminTableRow,
} from "@/components/admin/ui/admin-table";

type PreviewRow = {
  rowNumber: number;
  slug: string;
  nameHe: string;
  categorySlug: string;
  status: string;
  errors: string[];
  data?: ProductCsvRow;
};

export function CsvImportForm() {
  const router = useRouter();
  const [fileName, setFileName] = useState<string | null>(null);
  const [previewRows, setPreviewRows] = useState<PreviewRow[]>([]);
  const [parseError, setParseError] = useState<string | null>(null);
  const [resultMessage, setResultMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const validRows = useMemo(
    () => previewRows.filter((row) => row.errors.length === 0 && row.data),
    [previewRows],
  );

  const invalidCount = previewRows.length - validRows.length;

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    setResultMessage(null);
    setParseError(null);
    setPreviewRows([]);

    if (!file) {
      setFileName(null);
      return;
    }

    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result ?? "");
      const rows = parseCsv(text);

      if (rows.length === 0) {
        setParseError("הקובץ ריק או לא תקין");
        return;
      }

      const preview = rows.map((row, index) => {
        const validation = validateProductCsvRow(row, index + 2);
        return {
          rowNumber: validation.rowNumber,
          slug: row.slug || "—",
          nameHe: row.name_he || "—",
          categorySlug: row.category_slug || "—",
          status: row.status || "draft",
          errors: validation.errors,
          data: validation.data,
        };
      });

      setPreviewRows(preview);
    };
    reader.readAsText(file, "UTF-8");
  }

  function handleImport() {
    if (validRows.length === 0) return;

    setResultMessage(null);

    startTransition(async () => {
      const result = await importProducts(
        validRows.map((row) => row.data!).filter(Boolean),
      );

      setResultMessage(
        `ייבוא הושלם: ${result.created} נוצרו, ${result.updated} עודכנו, ${result.skipped} דולגו.` +
          (result.errors.length > 0 ? ` ${result.errors.length} שגיאות.` : ""),
      );

      if (result.errors.length > 0) {
        setParseError(result.errors.slice(0, 5).join(" · "));
      }

      router.refresh();
    });
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border/80 bg-surface-alt/70 p-5">
        <p className="text-sm font-semibold text-text-primary">עמודות נדרשות בקובץ CSV</p>
        <p className="mt-2 text-xs text-text-secondary" dir="ltr">
          {PRODUCT_CSV_HEADERS.join(", ")}
        </p>
        <p className="mt-3 text-sm text-text-secondary">
          `image_urls` — כתובות מופרדות ב-| · `specs` — JSON או `תווית:ערך|תווית:ערך`
        </p>
      </div>

      <div className="rounded-2xl border-2 border-dashed border-border/80 bg-surface-alt/40 p-8">
        <Upload className="mx-auto h-8 w-8 text-text-secondary" />
        <p className="mt-3 text-center text-sm font-medium text-text-primary">
          בחרו קובץ CSV לתצוגה מקדימה
        </p>
        <label className="mt-4 flex justify-center">
          <span className="cursor-pointer rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-light hover:shadow-md">
            בחירת קובץ
          </span>
          <input
            type="file"
            accept=".csv,text/csv"
            className="sr-only"
            onChange={handleFileChange}
            aria-label="בחירת קובץ CSV לייבוא"
          />
        </label>
        {fileName && (
          <p className="mt-3 text-center text-xs text-text-secondary">{fileName}</p>
        )}
      </div>

      {parseError && <AdminAlert variant="error">{parseError}</AdminAlert>}

      {previewRows.length > 0 && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="font-semibold text-text-primary">
              {previewRows.length} שורות בקובץ
            </span>
            <span className="text-success">{validRows.length} תקינות</span>
            {invalidCount > 0 && <span className="text-danger">{invalidCount} עם שגיאות</span>}
          </div>

          <AdminTable>
            <div className="max-h-96 overflow-auto">
              <AdminTableElement>
                <AdminTableHead>
                  <AdminTableHeadCell>#</AdminTableHeadCell>
                  <AdminTableHeadCell>slug</AdminTableHeadCell>
                  <AdminTableHeadCell>שם</AdminTableHeadCell>
                  <AdminTableHeadCell>קטגוריה</AdminTableHeadCell>
                  <AdminTableHeadCell>סטטוס</AdminTableHeadCell>
                  <AdminTableHeadCell>תקינות</AdminTableHeadCell>
                </AdminTableHead>
                <AdminTableBody>
                  {previewRows.map((row) => (
                    <AdminTableRow key={row.rowNumber}>
                      <AdminTableCell className="text-text-secondary">{row.rowNumber}</AdminTableCell>
                      <AdminTableCell dir="ltr">{row.slug}</AdminTableCell>
                      <AdminTableCell>{row.nameHe}</AdminTableCell>
                      <AdminTableCell dir="ltr">{row.categorySlug}</AdminTableCell>
                      <AdminTableCell>{row.status}</AdminTableCell>
                      <AdminTableCell>
                        {row.errors.length === 0 ? (
                          <span className="font-semibold text-success">תקין</span>
                        ) : (
                          <span className="text-danger">{row.errors.join(" · ")}</span>
                        )}
                      </AdminTableCell>
                    </AdminTableRow>
                  ))}
                </AdminTableBody>
              </AdminTableElement>
            </div>
          </AdminTable>

          <Button
            type="button"
            variant="navy"
            disabled={isPending || validRows.length === 0}
            onClick={handleImport}
            className="rounded-xl"
          >
            {isPending ? "מייבא..." : `ייבוא ${validRows.length} מוצרים`}
          </Button>
        </div>
      )}

      {resultMessage && (
        <AdminAlert variant={parseError ? "info" : "success"}>{resultMessage}</AdminAlert>
      )}
    </div>
  );
}
