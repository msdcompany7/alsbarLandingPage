import { SettingsForm } from "@/components/admin/settings-form";
import { getSiteSettings } from "@/lib/site-settings";

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary">הגדרות אתר</h1>
        <p className="mt-2 text-text-secondary">
          עדכנו פרטי קשר, כותרות Hero ומידע שמוצג בכל האתר.
        </p>
      </div>
      <div className="rounded-xl border border-border bg-surface p-6 shadow-sm">
        <SettingsForm initial={settings} />
      </div>
    </div>
  );
}
