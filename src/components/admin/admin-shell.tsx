"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FolderTree,
  LayoutDashboard,
  MessageSquare,
  Package,
  ExternalLink,
  LogOut,
  Settings,
} from "lucide-react";
import { SiteLogo } from "@/components/layout/site-logo";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin", label: "לוח בקרה", icon: LayoutDashboard, exact: true },
  { href: "/admin/inquiries", label: "פניות", icon: MessageSquare },
  { href: "/admin/products", label: "מוצרים", icon: Package },
  { href: "/admin/categories", label: "קטגוריות", icon: FolderTree },
  { href: "/admin/settings", label: "הגדרות", icon: Settings },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-surface-alt">
      <div className="flex min-h-screen">
        <aside className="hidden w-64 shrink-0 border-e border-border bg-primary lg:flex lg:flex-col">
          <div className="border-b border-white/10 px-5 py-5">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-white/50">
              ניהול אתר
            </p>
            <SiteLogo imageClassName="h-11" />
          </div>

          <nav className="flex-1 space-y-1 p-3">
            {navItems.map((item) => {
              const active = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    active
                      ? "bg-accent text-white"
                      : "text-white/80 hover:bg-white/10 hover:text-white",
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="space-y-1 border-t border-white/10 p-3">
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white"
            >
              <ExternalLink className="h-4 w-4" />
              צפייה באתר
            </Link>
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/admin/login" })}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/70 hover:bg-white/10 hover:text-red-300"
            >
              <LogOut className="h-4 w-4" />
              התנתקות
            </button>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="border-b border-border bg-surface px-4 py-4 lg:px-8">
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm text-text-secondary lg:hidden">S.Light</p>
              <p className="hidden text-sm text-text-secondary lg:block">
                מערכת ניהול תוכן — S.Light
              </p>
              <Link
                href="/admin/products/new"
                className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent-hover"
              >
                + הוסף מוצר
              </Link>
            </div>
          </header>
          <main className="flex-1 p-4 lg:p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
