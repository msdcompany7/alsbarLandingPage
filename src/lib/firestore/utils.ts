import type { FirestoreTimestampLike } from "@/lib/types/database";

export function toDate(value: FirestoreTimestampLike): Date {
  if (!value) {
    return new Date();
  }

  if (value instanceof Date) {
    return value;
  }

  return value.toDate();
}

export function toIsoDate(value: FirestoreTimestampLike): string {
  return toDate(value).toISOString().slice(0, 10);
}

export function includesQuery(value: string | null | undefined, query: string) {
  if (!value) {
    return false;
  }

  return value.toLowerCase().includes(query.toLowerCase());
}

export function paginateArray<T>(items: T[], page: number, pageSize: number) {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;

  return {
    items: items.slice(start, start + pageSize),
    total,
    page: safePage,
    pageSize,
    totalPages,
  };
}

export function sortByDateDesc<T extends { createdAt: Date }>(items: T[]) {
  return [...items].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export function sortByNameHeAsc<T extends { nameHe: string }>(items: T[]) {
  return [...items].sort((a, b) => a.nameHe.localeCompare(b.nameHe, "he"));
}

export function sortByViewCountDesc<T extends { viewCount: number }>(items: T[]) {
  return [...items].sort((a, b) => b.viewCount - a.viewCount);
}

export function sortBySortOrderAsc<T extends { sortOrder: number; nameHe?: string }>(
  items: T[],
) {
  return [...items].sort((a, b) => {
    if (a.sortOrder !== b.sortOrder) {
      return a.sortOrder - b.sortOrder;
    }

    if (a.nameHe && b.nameHe) {
      return a.nameHe.localeCompare(b.nameHe, "he");
    }

    return 0;
  });
}
