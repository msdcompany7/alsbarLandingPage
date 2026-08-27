import type { SiteSettings } from "@/lib/site-settings-types";

export const siteSettingFields: {
  key: keyof SiteSettings | string;
  dbKey: string;
  label: string;
  type?: "number";
}[] = [
  { key: "name", dbKey: "site.name", label: "שם העסק" },
  { key: "tagline", dbKey: "site.tagline", label: "שורת תיאור קצרה" },
  { key: "description", dbKey: "site.description", label: "תיאור לדף הבית" },
  { key: "heroTitle", dbKey: "site.hero_title", label: "כותרת Hero" },
  { key: "heroSubtitle", dbKey: "site.hero_subtitle", label: "תת-כותרת Hero" },
  { key: "phone", dbKey: "site.phone", label: "טלפון" },
  { key: "whatsapp", dbKey: "site.whatsapp", label: "WhatsApp (מספר בינלאומי)" },
  { key: "email", dbKey: "site.email", label: "אימייל" },
  { key: "address", dbKey: "site.address", label: "כתובת" },
  { key: "wazeUrl", dbKey: "site.waze_url", label: "קישור Waze" },
  {
    key: "yearsInBusiness",
    dbKey: "site.years_in_business",
    label: "שנות פעילות",
    type: "number",
  },
  { key: "serviceArea", dbKey: "site.service_area", label: "אזור שירות" },
  { key: "supportHours", dbKey: "site.support_hours", label: "שעות מענה" },
];
