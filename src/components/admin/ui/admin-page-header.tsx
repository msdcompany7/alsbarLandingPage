import { cn } from "@/lib/utils";

type AdminPageHeaderProps = {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  backLink?: React.ReactNode;
  className?: string;
};

export function AdminPageHeader({
  title,
  description,
  actions,
  backLink,
  className,
}: AdminPageHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between", className)}>
      <div className="min-w-0">
        {backLink}
        <h1 className="text-2xl font-bold tracking-tight text-primary sm:text-3xl">{title}</h1>
        {description && (
          <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-text-secondary sm:text-base">
            {description}
          </p>
        )}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}
