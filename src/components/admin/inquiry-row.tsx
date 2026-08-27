"use client";

import type { InquiryStatus } from "@/generated/prisma";
import { updateInquiryStatus } from "@/lib/admin/actions";
import { cn } from "@/lib/utils";

const statusLabels: Record<InquiryStatus, string> = {
  new: "חדש",
  read: "נקרא",
  handled: "טופל",
};

const statusStyles: Record<InquiryStatus, string> = {
  new: "bg-accent/15 text-primary",
  read: "bg-primary/10 text-primary",
  handled: "bg-success/10 text-success",
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
    <article className="rounded-xl border border-border bg-surface p-5 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-bold text-primary">{inquiry.name}</h3>
            <span
              className={cn(
                "rounded-full px-2.5 py-0.5 text-xs font-semibold",
                statusStyles[inquiry.status],
              )}
            >
              {statusLabels[inquiry.status]}
            </span>
          </div>
          <p className="mt-2 text-sm text-text-secondary" dir="ltr">
            {inquiry.phone}
            {inquiry.email ? ` · ${inquiry.email}` : ""}
          </p>
          <p className="mt-1 text-xs text-text-secondary">
            {new Intl.DateTimeFormat("he-IL", {
              dateStyle: "medium",
              timeStyle: "short",
            }).format(inquiry.createdAt)}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {(["new", "read", "handled"] as InquiryStatus[]).map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => handleStatusChange(status)}
              className={cn(
                "rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors",
                inquiry.status === status
                  ? "border-primary bg-primary text-white"
                  : "border-border text-text-secondary hover:border-primary hover:text-primary",
              )}
            >
              {statusLabels[status]}
            </button>
          ))}
        </div>
      </div>

      {inquiry.message && (
        <p className="mt-4 rounded-lg bg-surface-alt p-4 text-sm leading-relaxed text-text-primary">
          {inquiry.message}
        </p>
      )}
    </article>
  );
}
