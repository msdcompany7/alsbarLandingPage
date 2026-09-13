"use client";

import { useState, useTransition } from "react";
import { saveSiteSettings } from "@/lib/admin/actions";
import type { SiteSettings } from "@/lib/site-settings-types";
import { siteSettingFields } from "@/lib/site-setting-fields";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AdminAlert } from "@/components/admin/ui/admin-alert";

type SettingsFormProps = {
  initial: SiteSettings;
};

export function SettingsForm({ initial }: SettingsFormProps) {
  const [form, setForm] = useState<SiteSettings>(initial);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function updateField<K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setError(null);

    startTransition(async () => {
      try {
        await saveSiteSettings(form);
        setMessage("ההגדרות נשמרו בהצלחה");
      } catch {
        setError("שמירת ההגדרות נכשלה");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-5 md:grid-cols-2">
        {siteSettingFields.map((field) => {
          const key = field.key as keyof SiteSettings;
          const value = form[key];

          return (
            <div key={field.dbKey} className={field.key === "description" ? "md:col-span-2" : ""}>
              <Label htmlFor={field.dbKey}>{field.label}</Label>
              {field.key === "description" ? (
                <Textarea
                  id={field.dbKey}
                  value={String(value)}
                  onChange={(e) => updateField(key, e.target.value as SiteSettings[typeof key])}
                />
              ) : (
                <Input
                  id={field.dbKey}
                  type={field.type === "number" ? "number" : "text"}
                  dir={
                    ["phone", "whatsapp", "email", "wazeUrl"].includes(field.key as string)
                      ? "ltr"
                      : undefined
                  }
                  className={
                    ["phone", "whatsapp", "email", "wazeUrl"].includes(field.key as string)
                      ? "text-start"
                      : undefined
                  }
                  value={String(value)}
                  onChange={(e) =>
                    updateField(
                      key,
                      (field.type === "number"
                        ? Number(e.target.value)
                        : e.target.value) as SiteSettings[typeof key],
                    )
                  }
                />
              )}
            </div>
          );
        })}
      </div>

      {message && <AdminAlert variant="success">{message}</AdminAlert>}
      {error && <AdminAlert variant="error">{error}</AdminAlert>}

      <Button type="submit" variant="navy" disabled={isPending} className="rounded-xl">
        {isPending ? "שומר..." : "שמירת הגדרות"}
      </Button>
    </form>
  );
}
