import { cn } from "@/lib/utils";

type AdminSelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

export function AdminSelect({ className, ...props }: AdminSelectProps) {
  return (
    <select
      className={cn(
        "w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text-primary transition-colors",
        "focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20",
        className,
      )}
      {...props}
    />
  );
}
