import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

type AdminActionCardProps = {
  href: string;
  title: string;
  description: string;
  icon: LucideIcon;
  accent?: "orange" | "dark" | "neutral";
};

const accentStyles = {
  orange: "bg-accent text-white",
  dark: "bg-primary text-white",
  neutral: "bg-surface-alt text-primary ring-1 ring-border",
};

export function AdminActionCard({
  href,
  title,
  description,
  icon: Icon,
  accent = "neutral",
}: AdminActionCardProps) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-4 rounded-2xl border border-border/80 bg-surface p-5 shadow-[var(--shadow-soft)] transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/25 hover:shadow-[var(--shadow-card)]"
    >
      <span
        className={cn(
          "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-105",
          accentStyles[accent],
        )}
      >
        <Icon className="h-5 w-5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-bold text-primary">{title}</p>
        <p className="mt-0.5 text-sm text-text-secondary">{description}</p>
      </div>
      <ArrowLeft className="h-4 w-4 shrink-0 text-text-secondary opacity-0 transition-all group-hover:opacity-100 group-hover:text-accent" />
    </Link>
  );
}
