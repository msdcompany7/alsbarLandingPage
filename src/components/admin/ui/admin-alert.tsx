import { AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

type AdminAlertProps = {
  children: React.ReactNode;
  variant?: "success" | "error" | "info";
  className?: string;
};

const styles = {
  success: "border-success/25 bg-success/5 text-success",
  error: "border-danger/25 bg-danger/5 text-danger",
  info: "border-border bg-surface-alt text-text-secondary",
};

export function AdminAlert({ children, variant = "info", className }: AdminAlertProps) {
  const Icon = variant === "success" ? CheckCircle2 : AlertCircle;

  return (
    <p
      className={cn(
        "flex items-start gap-2.5 rounded-xl border px-4 py-3 text-sm leading-relaxed",
        styles[variant],
        className,
      )}
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0" />
      <span>{children}</span>
    </p>
  );
}
