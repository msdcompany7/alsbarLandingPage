"use client";

import type { InquiryStatus } from "@/lib/types/database";
import { updateInquiryStatus } from "@/lib/admin/actions";
import { AdminBadge } from "@/components/admin/ui/admin-badge";
import { cn } from "@/lib/utils";

const statusLabels: Record<InquiryStatus, string> = {
  new: "חדש",
  read: "נקרא",
  handled: "טופל",
};

const statusVariants: Record<InquiryStatus, "warning" | "primary" | "success"> = {
  new: "warning",
  read: "primary",
  handled: "success",
};

type InquiryRowProps = {
  inquiry: {
    id: string;
    name: string;
    phone: string;
    email: string | null;
    message: string | null;
    status: InquiryStatus;
    createdAt: Date;
  };
};

export function InquiryRow({ inquiry }: InquiryRowProps) {
  async function handleStatusChange(status: InquiryStatus) {
    await updateInquiryStatus(inquiry.id, status);
  }

  return (
    <article className="rounded-2xl border border-border/80 bg-surface p-5 shadow-[var(--shadow-soft)] transition-shadow hover:shadow-[var(--shadow-card)]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-bold text-primary">{inquiry.name}</h3>
            <AdminBadge variant={statusVariants[inquiry.status]}>
              {statusLabels[inquiry.status]}
            </AdminBadge>
          </div>
          <p className="mt-2 text-sm text-text-secondary" dir="ltr">
            {inquiry.phone}
            {inquiry.email ? ` · ${inquiry.email}` : ""}
          </p>
          <p className="mt-1 text-xs font-medium text-text-secondary">
            {new Intl.DateTimeFormat("he-IL", {
              dateStyle: "medium",
              timeStyle: "short",
            }).format(inquiry.createdAt)}
          </p>
        </div>

        <div className="inline-flex flex-wrap gap-1.5 rounded-xl border border-border bg-surface-alt/60 p-1">
          {(["new", "read", "handled"] as InquiryStatus[]).map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => handleStatusChange(status)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-semibold transition-all",
                inquiry.status === status
                  ? "bg-primary text-white shadow-sm"
                  : "text-text-secondary hover:bg-surface hover:text-primary",
              )}
            >
              {statusLabels[status]}
            </button>
          ))}
        </div>
      </div>

      {inquiry.message && (
        <p className="mt-4 rounded-xl border border-border/70 bg-surface-alt/70 p-4 text-sm leading-relaxed text-text-primary">
          {inquiry.message}
        </p>
      )}
    </article>
  );
}
