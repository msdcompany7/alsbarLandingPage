import { InquiryRow } from "@/components/admin/inquiry-row";
import { db } from "@/lib/db";

export default async function AdminInquiriesPage() {
  const inquiries = await db.inquiry.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary">פניות</h1>
        <p className="mt-2 text-text-secondary">
          {inquiries.length} פניות · סמנו סטטוס לפי טיפול
        </p>
      </div>

      {inquiries.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-surface p-12 text-center">
          <p className="text-text-secondary">אין פניות עדיין.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {inquiries.map((inquiry) => (
            <InquiryRow key={inquiry.id} inquiry={inquiry} />
          ))}
        </div>
      )}
    </div>
  );
}
