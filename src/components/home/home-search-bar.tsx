"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import type { PublicCategory } from "@/lib/catalog";
import { resolveSearchDestination } from "@/lib/catalog-search";
import { cn } from "@/lib/utils";

type HomeSearchBarProps = {
  categories: PublicCategory[];
  className?: string;
};

export function HomeSearchBar({ categories, className }: HomeSearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    router.push(resolveSearchDestination(categories, query));
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "flex w-full max-w-xl flex-col gap-2 sm:flex-row sm:items-center",
        className,
      )}
    >
      <div className="relative min-w-0 flex-1">
        <Search className="pointer-events-none absolute start-4 top-1/2 h-5 w-5 -translate-y-1/2 text-accent" />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="חיפוש מוצר או קטגוריה..."
          className={cn(
            "w-full rounded-xl border border-white/20 bg-white/95 py-3.5 pe-4 ps-12 text-sm text-text-primary shadow-lg",
            "placeholder:text-text-secondary/80 backdrop-blur-sm",
            "focus:border-accent focus:bg-white focus:outline-none focus:ring-2 focus:ring-accent/25",
          )}
        />
      </div>
      <button
        type="submit"
        className="inline-flex shrink-0 items-center justify-center rounded-xl bg-accent px-5 py-3.5 text-sm font-semibold text-white shadow-lg transition-colors hover:bg-accent-hover sm:min-w-[6.5rem]"
      >
        חיפוש
      </button>
    </form>
  );
}
