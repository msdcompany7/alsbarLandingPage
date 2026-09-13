import { cn } from "@/lib/utils";

const variants = {
  success: "bg-success/10 text-success ring-success/20",
  warning: "bg-accent/12 text-accent ring-accent/20",
  muted: "bg-surface-alt text-text-secondary ring-border",
  primary: "bg-primary/8 text-primary ring-primary/10",
  danger: "bg-danger/10 text-danger ring-danger/20",
} as const;

type AdminBadgeProps = {
  children: React.ReactNode;
  variant?: keyof typeof variants;
  className?: string;
};

export function AdminBadge({ children, variant = "muted", className }: AdminBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ring-1 ring-inset",
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
