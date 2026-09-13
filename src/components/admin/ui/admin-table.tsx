import { cn } from "@/lib/utils";

type AdminTableProps = {
  children: React.ReactNode;
  className?: string;
};

export function AdminTable({ children, className }: AdminTableProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-border/80 bg-surface shadow-[var(--shadow-soft)]",
        className,
      )}
    >
      <div className="overflow-x-auto">{children}</div>
    </div>
  );
}

export function AdminTableElement({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <table className={cn("min-w-full text-sm", className)}>{children}</table>;
}

export function AdminTableHead({ children }: { children: React.ReactNode }) {
  return (
    <thead className="border-b border-border bg-surface-alt/80">
      <tr>{children}</tr>
    </thead>
  );
}

export function AdminTableHeadCell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <th
      scope="col"
      className={cn(
        "px-4 py-3.5 text-start text-xs font-bold uppercase tracking-wide text-text-secondary",
        className,
      )}
    >
      {children}
    </th>
  );
}

export function AdminTableBody({ children }: { children: React.ReactNode }) {
  return <tbody className="divide-y divide-border/70">{children}</tbody>;
}

export function AdminTableRow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <tr className={cn("transition-colors hover:bg-surface-alt/50", className)}>{children}</tr>
  );
}

export function AdminTableCell({
  children,
  className,
  colSpan,
  dir,
}: {
  children: React.ReactNode;
  className?: string;
  colSpan?: number;
  dir?: "ltr" | "rtl" | "auto";
}) {
  return (
    <td colSpan={colSpan} dir={dir} className={cn("px-4 py-3.5 align-middle", className)}>
      {children}
    </td>
  );
}
