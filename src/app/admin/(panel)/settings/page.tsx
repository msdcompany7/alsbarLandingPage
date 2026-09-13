import { SettingsForm } from "@/components/admin/settings-form";
import { AdminCard } from "@/components/admin/ui/admin-card";
import { AdminPageHeader } from "@/components/admin/ui/admin-page-header";
import { getSiteSettings } from "@/lib/site-settings";

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <AdminPageHeader
        title="הגדרות אתר"
        description="עדכנו פרטי קשר, כותרות Hero ומידע שמוצג בכל האתר."
      />
      <AdminCard padding="lg">
        <SettingsForm initial={settings} />
      </AdminCard>
    </div>
  );
}
