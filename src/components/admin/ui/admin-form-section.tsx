import { cn } from "@/lib/utils";

type AdminFormSectionProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
};

export function AdminFormSection({
  title,
  description,
  children,
  className,
}: AdminFormSectionProps) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-border/80 bg-surface-alt/50 p-5 sm:p-6",
        className,
      )}
    >
      <div className="mb-4">
        <h3 className="text-sm font-bold text-primary">{title}</h3>
        {description && <p className="mt-1 text-xs text-text-secondary">{description}</p>}
      </div>
      {children}
    </section>
  );
}
