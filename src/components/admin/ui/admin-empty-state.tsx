import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type AdminEmptyStateProps = {
  title: string;
  description?: string;
  icon?: LucideIcon;
  action?: React.ReactNode;
  className?: string;
};

export function AdminEmptyState({
  title,
  description,
  icon: Icon,
  action,
  className,
}: AdminEmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-surface/60 px-6 py-14 text-center",
        className,
      )}
    >
      {Icon && (
        <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-alt text-text-secondary">
          <Icon className="h-6 w-6" />
        </span>
      )}
      <p className="text-base font-semibold text-primary">{title}</p>
      {description && <p className="mt-1.5 max-w-sm text-sm text-text-secondary">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
