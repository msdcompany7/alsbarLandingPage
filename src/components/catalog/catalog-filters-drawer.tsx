"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { CatalogSidebar } from "@/components/catalog/catalog-sidebar";
import type { PublicCategory } from "@/lib/catalog";
import type { SortOption } from "@/lib/catalog-url";

type CatalogFiltersDrawerProps = {
  categories: PublicCategory[];
  open: boolean;
  onClose: () => void;
  activeCategory?: string;
  q?: string;
  sort?: SortOption;
};

export function CatalogFiltersDrawer({
  categories,
  open,
  onClose,
  activeCategory,
  q,
  sort,
}: CatalogFiltersDrawerProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (open) {
      setVisible(true);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      const timer = setTimeout(() => setVisible(false), 300);
      return () => clearTimeout(timer);
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open && !visible) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <button
        type="button"
        aria-label="סגור סינון"
        className={`absolute inset-0 bg-primary/40 transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />
      <div
        className={`absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-2xl bg-surface p-6 shadow-xl transition-transform duration-300 ${
          open ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-primary">סינון מוצרים</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-text-secondary hover:bg-surface-alt"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <CatalogSidebar
          categories={categories}
          activeCategory={activeCategory}
          q={q}
          sort={sort}
        />
      </div>
    </div>
  );
}
