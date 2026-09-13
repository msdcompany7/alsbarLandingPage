"use client";

import { useState, useTransition } from "react";
import { Download } from "lucide-react";
import { exportProductsCsv } from "@/lib/admin/actions";
import { Button } from "@/components/ui/button";

export function CsvExportButton() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleExport() {
    setError(null);

    startTransition(async () => {
      try {
        const csv = await exportProductsCsv();
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `products-${new Date().toISOString().slice(0, 10)}.csv`;
        link.click();
        URL.revokeObjectURL(url);
      } catch {
        setError("ייצוא הקובץ נכשל");
      }
    });
  }

  return (
    <div>
      <Button type="button" variant="outline" onClick={handleExport} disabled={isPending} className="rounded-xl">
        <Download className="h-4 w-4" />
        {isPending ? "מייצא..." : "ייצוא CSV"}
      </Button>
      {error && <p className="mt-2 text-sm text-danger">{error}</p>}
    </div>
  );
}
