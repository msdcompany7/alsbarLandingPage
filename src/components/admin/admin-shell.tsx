"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ExternalLink,
  FolderTree,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Package,
  Settings,
  X,
} from "lucide-react";
import { signOut } from "firebase/auth";
import { SiteLogo } from "@/components/layout/site-logo";
import { getFirebaseAuth } from "@/lib/firebase/client";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin", label: "לוח בקרה", icon: LayoutDashboard, exact: true },
  { href: "/admin/inquiries", label: "פניות", icon: MessageSquare },
  { href: "/admin/products", label: "מוצרים", icon: Package },
  { href: "/admin/categories", label: "קטגוריות", icon: FolderTree },
  { href: "/admin/settings", label: "הגדרות", icon: Settings },
];

function NavLinks({
  pathname,
  onNavigate,
  className,
}: {
  pathname: string;
  onNavigate?: () => void;
  className?: string;
}) {
  return (
    <ul className={cn("space-y-1", className)}>
      {navItems.map((item) => {
        const active = item.exact
          ? pathname === item.href
          : pathname.startsWith(item.href);

        return (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-200",
                active
                  ? "bg-accent text-white shadow-[0_4px_14px_-6px_rgba(255,106,0,0.55)]"
                  : "text-white/75 hover:bg-white/10 hover:text-white",
              )}
            >
              <span
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-lg transition-colors",
                  active ? "bg-white/15" : "bg-white/5 group-hover:bg-white/10",
                )}
              >
                <item.icon className="h-4 w-4" />
              </span>
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  async function handleLogout() {
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" });
      await signOut(getFirebaseAuth());
    } finally {
      router.push("/admin/login");
      router.refresh();
    }
  }

  return (
    <div className="admin-shell min-h-screen bg-[#f3f4f6]">
      <div className="flex min-h-screen">
        <aside className="admin-sidebar hidden w-[17.5rem] shrink-0 flex-col lg:flex">
          <div className="border-b border-white/10 px-5 py-6">
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-white/45">
              CMS · S.Light
            </p>
            <SiteLogo priority framed />
          </div>

          <nav className="flex-1 overflow-y-auto px-3 py-4">
            <NavLinks pathname={pathname} />
          </nav>

          <div className="space-y-1 border-t border-white/10 p-3">
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/65 transition-colors hover:bg-white/10 hover:text-white"
            >
              <ExternalLink className="h-4 w-4" />
              צפייה באתר
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/65 transition-colors hover:bg-red-500/15 hover:text-red-200"
            >
              <LogOut className="h-4 w-4" />
              התנתקות
            </button>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          {/* Mobile-only utility bar — no page title or page actions */}
          <header className="sticky top-0 z-40 border-b border-border/60 bg-white/90 px-4 py-3 backdrop-blur-xl lg:hidden">
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <button
                  type="button"
                  aria-label={mobileOpen ? "סגור תפריט" : "פתח תפריט"}
                  aria-expanded={mobileOpen}
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-surface text-primary transition-colors hover:bg-surface-alt"
                  onClick={() => setMobileOpen((open) => !open)}
                >
                  {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-primary">ניהול S.Light</p>
                  <p className="text-xs text-text-secondary">מערכת ניהול תוכן</p>
                </div>
              </div>

              <Link
                href="/"
                target="_blank"
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-surface text-text-secondary transition-colors hover:border-accent/30 hover:text-primary"
                aria-label="צפייה באתר"
              >
                <ExternalLink className="h-4 w-4" />
              </Link>
            </div>
          </header>

          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl">{children}</div>
          </main>
        </div>
      </div>

      <div
        className={cn(
          "fixed inset-y-0 start-0 z-50 w-[min(100%,18rem)] border-s border-white/10 bg-primary shadow-2xl transition-transform duration-300 lg:hidden",
          mobileOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-4">
            <SiteLogo priority framed />
            <button
              type="button"
              aria-label="סגור תפריט"
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-white/70 hover:bg-white/10 hover:text-white"
              onClick={() => setMobileOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <nav className="flex-1 overflow-y-auto px-3 py-4">
            <NavLinks pathname={pathname} onNavigate={() => setMobileOpen(false)} />
          </nav>
          <div className="space-y-1 border-t border-white/10 p-3">
            <Link
              href="/"
              target="_blank"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/65 hover:bg-white/10 hover:text-white"
            >
              <ExternalLink className="h-4 w-4" />
              צפייה באתר
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/65 hover:bg-red-500/15 hover:text-red-200"
            >
              <LogOut className="h-4 w-4" />
              התנתקות
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <button
          type="button"
          aria-label="סגור תפריט"
          className="fixed inset-0 z-40 bg-primary/40 backdrop-blur-[2px] lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </div>
  );
}
