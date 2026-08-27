"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, Phone, Search, X } from "lucide-react";
import { SiteLogo } from "@/components/layout/site-logo";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

type SiteHeaderProps = {
  phone: string;
  phoneHref: string;
};

export function SiteHeader({ phone, phoneHref }: SiteHeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b border-white/10 bg-primary transition-all duration-300",
        scrolled && "shadow-lg shadow-black/20",
      )}
    >
      <Container as="nav" className="flex h-16 items-center justify-between gap-4 lg:h-[80px]">
        <SiteLogo priority />

        <ul className="hidden items-center gap-1 lg:flex">
          {siteConfig.nav.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="rounded-lg px-4 py-2 text-[15px] font-medium text-white/90 transition-colors hover:bg-white/10 hover:text-white"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            aria-label="חיפוש"
            className="hidden rounded-lg p-2.5 text-white/80 transition-colors hover:bg-white/10 hover:text-white sm:inline-flex"
          >
            <Search className="h-5 w-5" />
          </button>

          <Button href={phoneHref} external variant="primary" size="sm" className="hidden sm:inline-flex">
            <Phone className="h-4 w-4" />
            <span dir="ltr">{phone}</span>
          </Button>

          <button
            type="button"
            aria-label={mobileOpen ? "סגור תפריט" : "פתח תפריט"}
            className="rounded-lg p-2.5 text-white hover:bg-white/10 lg:hidden"
            onClick={() => setMobileOpen((open) => !open)}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </Container>

      {mobileOpen && (
        <div className="fixed inset-0 top-16 z-40 bg-primary lg:hidden">
          <Container className="flex flex-col gap-1 py-6">
            {siteConfig.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-4 py-3 text-lg font-medium text-white hover:bg-white/10"
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Button href={phoneHref} external variant="primary" className="mt-4 w-full">
              <Phone className="h-4 w-4" />
              <span dir="ltr">{phone}</span>
            </Button>
          </Container>
        </div>
      )}
    </header>
  );
}
