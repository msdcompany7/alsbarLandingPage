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
import { cn } from "@/lib/utils";

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
      <div className="rounded-xl border border-border bg-surface-alt p-5">
        <p className="text-sm font-semibold text-text-primary">עמודות נדרשות בקובץ CSV</p>
        <p className="mt-2 text-xs text-text-secondary" dir="ltr">
          {PRODUCT_CSV_HEADERS.join(", ")}
        </p>
        <p className="mt-3 text-sm text-text-secondary">
          `image_urls` — כתובות מופרדות ב-| · `specs` — JSON או `תווית:ערך|תווית:ערך`
        </p>
      </div>

      <div className="rounded-xl border-2 border-dashed border-border bg-surface p-6">
        <Upload className="mx-auto h-8 w-8 text-text-secondary" />
        <p className="mt-3 text-center text-sm font-medium text-text-primary">
          בחרו קובץ CSV לתצוגה מקדימה
        </p>
        <label className="mt-4 flex justify-center">
          <span className="cursor-pointer rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-light">
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

      {parseError && (
        <p className="rounded-lg border border-danger/20 bg-danger/5 px-4 py-3 text-sm text-danger">
          {parseError}
        </p>
      )}

      {previewRows.length > 0 && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="font-semibold text-text-primary">
              {previewRows.length} שורות בקובץ
            </span>
            <span className="text-success">{validRows.length} תקינות</span>
            {invalidCount > 0 && <span className="text-danger">{invalidCount} עם שגיאות</span>}
          </div>

          <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
            <div className="max-h-96 overflow-auto">
              <table className="min-w-full text-sm">
                <thead className="sticky top-0 bg-surface-alt text-text-secondary">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-start font-semibold">
                      #
                    </th>
                    <th scope="col" className="px-4 py-3 text-start font-semibold">
                      slug
                    </th>
                    <th scope="col" className="px-4 py-3 text-start font-semibold">
                      שם
                    </th>
                    <th scope="col" className="px-4 py-3 text-start font-semibold">
                      קטגוריה
                    </th>
                    <th scope="col" className="px-4 py-3 text-start font-semibold">
                      סטטוס
                    </th>
                    <th scope="col" className="px-4 py-3 text-start font-semibold">
                      תקינות
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {previewRows.map((row) => (
                    <tr key={row.rowNumber} className="border-t border-border">
                      <td className="px-4 py-3 text-text-secondary">{row.rowNumber}</td>
                      <td className="px-4 py-3" dir="ltr">
                        {row.slug}
                      </td>
                      <td className="px-4 py-3">{row.nameHe}</td>
                      <td className="px-4 py-3" dir="ltr">
                        {row.categorySlug}
                      </td>
                      <td className="px-4 py-3">{row.status}</td>
                      <td className="px-4 py-3">
                        {row.errors.length === 0 ? (
                          <span className="text-success">תקין</span>
                        ) : (
                          <span className="text-danger">{row.errors.join(" · ")}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <Button
            type="button"
            variant="navy"
            disabled={isPending || validRows.length === 0}
            onClick={handleImport}
          >
            {isPending ? "מייבא..." : `ייבוא ${validRows.length} מוצרים`}
          </Button>
        </div>
      )}

      {resultMessage && (
        <p
          className={cn(
            "rounded-lg border px-4 py-3 text-sm",
            parseError
              ? "border-accent/20 bg-accent/5 text-primary"
              : "border-success/20 bg-success/5 text-success",
          )}
        >
          {resultMessage}
        </p>
      )}
    </div>
  );
}
