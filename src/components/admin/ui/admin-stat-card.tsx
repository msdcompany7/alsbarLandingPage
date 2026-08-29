import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type AdminStatCardProps = {
  label: string;
  value: number | string;
  icon?: LucideIcon;
  accent?: "default" | "orange" | "success" | "muted";
  className?: string;
};

const accentStyles = {
  default: "bg-primary/8 text-primary",
  orange: "bg-accent/12 text-accent",
  success: "bg-success/10 text-success",
  muted: "bg-surface-alt text-text-secondary",
};

export function AdminStatCard({
  label,
  value,
  icon: Icon,
  accent = "default",
  className,
}: AdminStatCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border/80 bg-surface p-5 shadow-[var(--shadow-soft)] transition-shadow hover:shadow-[var(--shadow-card)]",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-text-secondary">{label}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-primary">{value}</p>
        </div>
        {Icon && (
          <span
            className={cn(
              "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
              accentStyles[accent],
            )}
          >
            <Icon className="h-5 w-5" />
          </span>
        )}
      </div>
    </div>
  );
}
