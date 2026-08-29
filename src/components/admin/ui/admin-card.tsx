import { cn } from "@/lib/utils";

type AdminCardProps = {
  children: React.ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
};

const paddingMap = {
  none: "",
  sm: "p-4",
  md: "p-5 sm:p-6",
  lg: "p-6 sm:p-8",
};

export function AdminCard({ children, className, padding = "md" }: AdminCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border/80 bg-surface shadow-[var(--shadow-soft)]",
        paddingMap[padding],
        className,
      )}
    >
      {children}
    </div>
  );
}

type AdminCardHeaderProps = {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
};

export function AdminCardHeader({ title, description, action, className }: AdminCardHeaderProps) {
  return (
    <div className={cn("mb-5 flex items-start justify-between gap-4", className)}>
      <div>
        <h2 className="text-lg font-bold text-primary">{title}</h2>
        {description && <p className="mt-1 text-sm text-text-secondary">{description}</p>}
      </div>
      {action}
    </div>
  );
}
