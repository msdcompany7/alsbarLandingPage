"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import type { PublicCategory } from "@/lib/catalog";
import { resolveSearchDestination } from "@/lib/catalog-search";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/container";

type SiteSearchPanelProps = {
  open: boolean;
  onClose: () => void;
  categories: PublicCategory[];
};

export function SiteSearchPanel({ open, onClose, categories }: SiteSearchPanelProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!open) {
      setQuery("");
      return;
    }

    inputRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const destination = resolveSearchDestination(categories, query);
    onClose();
    router.push(destination);
  }

  if (!open) return null;

  return (
    <>
      <button
        type="button"
        aria-label="סגור חיפוש"
        className="fixed inset-0 z-[60] bg-primary/30 backdrop-blur-[2px]"
        onClick={onClose}
      />

      <div className="fixed inset-x-0 top-[4.75rem] z-[70] border-b border-border bg-white shadow-lg sm:top-[5.25rem]">
        <Container className="py-4 sm:py-5">
          <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative min-w-0 flex-1">
              <Search className="pointer-events-none absolute start-4 top-1/2 h-5 w-5 -translate-y-1/2 text-accent" />
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="חיפוש מוצר או קטגוריה..."
                className={cn(
                  "w-full rounded-xl border border-border bg-surface-alt/70 py-3.5 pe-4 ps-12 text-sm text-text-primary",
                  "placeholder:text-text-secondary/80 focus:border-accent focus:bg-surface focus:outline-none focus:ring-2 focus:ring-accent/15",
                )}
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="inline-flex flex-1 items-center justify-center rounded-xl bg-accent px-5 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-accent-hover sm:min-w-[6.5rem] sm:flex-none"
              >
                חיפוש
              </button>
              <button
                type="button"
                aria-label="סגור"
                onClick={onClose}
                className="inline-flex h-[3.25rem] w-[3.25rem] items-center justify-center rounded-xl border border-border text-text-secondary transition-colors hover:bg-surface-alt hover:text-primary sm:hidden"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </form>
        </Container>
      </div>
    </>
  );
}
