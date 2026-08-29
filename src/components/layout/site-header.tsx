"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, Phone, X } from "lucide-react";
import { SiteLogo } from "@/components/layout/site-logo";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

type SiteHeaderProps = {
  phone: string;
  phoneHref: string;
};

function isActiveNav(href: string, pathname: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader({ phone, phoneHref }: SiteHeaderProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
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

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-all duration-300",
        scrolled
          ? "border-border/70 bg-white/95 shadow-[0_8px_30px_-20px_rgba(0,0,0,0.35)] backdrop-blur-xl"
          : "border-border/50 bg-white/90 backdrop-blur-md",
      )}
    >
      <Container as="nav" aria-label="ניווט ראשי">
        <div className="flex h-[4.75rem] items-center justify-between gap-3 sm:h-[5.25rem] lg:grid lg:grid-cols-[minmax(0,240px)_1fr_auto] lg:items-center lg:gap-10">
          <div className="flex min-w-0 items-center lg:justify-start">
            <SiteLogo priority framed />
          </div>

          <ul className="hidden items-center justify-center gap-1 lg:flex xl:gap-2">
            {siteConfig.nav.map((item) => {
              const active = isActiveNav(item.href, pathname);

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative rounded-xl px-5 py-3 text-base font-semibold tracking-tight transition-colors sm:px-6 sm:text-[17px] lg:py-3.5 lg:text-lg",
                      active
                        ? "text-primary"
                        : "text-text-secondary hover:bg-surface-alt hover:text-primary",
                    )}
                  >
                    {item.label}
                    <span
                      className={cn(
                        "absolute inset-x-4 -bottom-0.5 h-1 rounded-full bg-accent transition-all duration-300 sm:inset-x-5",
                        active ? "opacity-100" : "opacity-0 scale-x-0",
                      )}
                      aria-hidden
                    />
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="flex shrink-0 items-center justify-end gap-2 sm:gap-3">
            <a
              href={phoneHref}
              className="hidden items-center gap-3 rounded-xl border border-border bg-surface px-4 py-2.5 transition-all hover:border-accent/30 hover:bg-accent-soft/40 md:inline-flex lg:px-5 lg:py-3"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-white shadow-sm lg:h-11 lg:w-11">
                <Phone className="h-4 w-4 lg:h-[18px] lg:w-[18px]" />
              </span>
              <span className="text-start leading-tight">
                <span className="block text-xs font-medium text-text-secondary">
                  התקשרו עכשיו
                </span>
                <span dir="ltr" className="block text-sm font-bold text-primary lg:text-base">
                  {phone}
                </span>
              </span>
            </a>

            <Button
              href={phoneHref}
              external
              variant="primary"
              size="sm"
              className="md:hidden"
            >
              <Phone className="h-4 w-4" />
              <span dir="ltr">{phone}</span>
            </Button>

            <button
              type="button"
              aria-label={mobileOpen ? "סגור תפריט" : "פתח תפריט"}
              aria-expanded={mobileOpen}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border text-primary transition-colors hover:bg-surface-alt lg:hidden"
              onClick={() => setMobileOpen((open) => !open)}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </Container>

      <div
        className={cn(
          "fixed inset-x-0 top-[4.75rem] z-40 border-b border-border bg-white shadow-lg transition-all duration-300 sm:top-[5.25rem] lg:hidden",
          mobileOpen
            ? "visible translate-y-0 opacity-100"
            : "pointer-events-none invisible -translate-y-2 opacity-0",
        )}
        style={{ maxHeight: "calc(100dvh - 5.25rem)" }}
      >
        <Container className="flex max-h-[calc(100dvh-5.25rem)] flex-col gap-1 overflow-y-auto py-4">
          <p className="mb-1 px-2 text-xs font-semibold uppercase tracking-wide text-text-secondary">
            תפריט
          </p>
          {siteConfig.nav.map((item) => {
            const active = isActiveNav(item.href, pathname);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-xl px-4 py-4 text-lg font-semibold transition-colors",
                  active
                    ? "bg-accent-soft text-primary"
                    : "text-text-primary hover:bg-surface-alt",
                )}
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            );
          })}

          <a
            href={phoneHref}
            className="mt-3 flex items-center gap-3 rounded-xl border border-border bg-surface-alt px-4 py-3.5"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-white">
              <Phone className="h-4 w-4" />
            </span>
            <span>
              <span className="block text-xs text-text-secondary">התקשרו עכשיו</span>
              <span dir="ltr" className="block text-sm font-bold text-primary">
                {phone}
              </span>
            </span>
          </a>
        </Container>
      </div>

      {mobileOpen && (
        <button
          type="button"
          aria-label="סגור תפריט"
          className="fixed inset-0 top-[4.75rem] z-30 bg-primary/25 sm:top-[5.25rem] lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </header>
  );
}
