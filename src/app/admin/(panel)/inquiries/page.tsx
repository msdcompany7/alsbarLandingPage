import { InquiryRow } from "@/components/admin/inquiry-row";
import { AdminEmptyState } from "@/components/admin/ui/admin-empty-state";
import { AdminPageHeader } from "@/components/admin/ui/admin-page-header";
import { listInquiries } from "@/lib/firestore/inquiries";
import { MessageSquare } from "lucide-react";

export default async function AdminInquiriesPage() {
  const inquiries = await listInquiries();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="פניות"
        description={`${inquiries.length} פניות · סמנו סטטוס לפי טיפול`}
      />

      {inquiries.length === 0 ? (
        <AdminEmptyState
          icon={MessageSquare}
          title="אין פניות עדיין"
          description="פניות מטופס יצירת הקשר יופיעו כאן."
        />
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
