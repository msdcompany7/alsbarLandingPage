import type { ProductSpec } from "@/lib/catalog";
import { PRODUCT_CSV_HEADERS } from "@/lib/validation/product-csv";

function escapeCsvValue(value: string) {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function formatCsvRow(values: string[]) {
  return values.map(escapeCsvValue).join(",");
}

export function formatSpecsForCsv(specs: ProductSpec[]) {
  if (specs.length === 0) return "";
  return JSON.stringify(specs);
}

export function productToCsvRow(product: {
  slug: string;
  nameHe: string;
  nameEn: string | null;
  sku: string | null;
  category: { slug: string };
  shortDescription: string | null;
  description: string | null;
  status: string;
  isFeatured: boolean;
  specs: unknown;
  images: { url: string }[];
}) {
  const specs = Array.isArray(product.specs) ? (product.specs as ProductSpec[]) : [];

  return formatCsvRow([
    product.slug,
    product.nameHe,
    product.nameEn ?? "",
    product.sku ?? "",
    product.category.slug,
    product.shortDescription ?? "",
    product.description ?? "",
    product.status,
    product.isFeatured ? "true" : "false",
    product.images.map((image) => image.url).join("|"),
    formatSpecsForCsv(specs),
  ]);
}

export function buildProductsCsv(
  products: Parameters<typeof productToCsvRow>[0][],
) {
  const lines = [PRODUCT_CSV_HEADERS.join(",")];
  for (const product of products) {
    lines.push(productToCsvRow(product));
  }
  return `\uFEFF${lines.join("\n")}`;
}

function parseCsvLine(line: string): string[] {
  const values: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === "," && !inQuotes) {
      values.push(current);
      current = "";
      continue;
    }

    current += char;
  }

  values.push(current);
  return values;
}

export function parseCsv(text: string): Record<string, string>[] {
  const lines = text
    .replace(/^\uFEFF/, "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length < 2) return [];

  const headers = parseCsvLine(lines[0]).map((header) => header.trim().toLowerCase());

  return lines.slice(1).map((line) => {
    const values = parseCsvLine(line);
    const row: Record<string, string> = {};

    headers.forEach((header, index) => {
      row[header] = values[index]?.trim() ?? "";
    });

    return row;
  });
}
