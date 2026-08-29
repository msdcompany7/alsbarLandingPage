import { siteConfig } from "@/lib/site-config";
import { siteSettingFields } from "@/lib/site-setting-fields";
import type { SiteSettings } from "@/lib/site-settings-types";
import { getSiteSettingsFromFirestore } from "@/lib/firestore/site-settings";

export type { SiteSettings } from "@/lib/site-settings-types";
export { siteSettingFields };

export async function getSiteSettings(): Promise<SiteSettings> {
  return getSiteSettingsFromFirestore();
}

export function siteSettingsToPhoneHref(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("0")) {
    return `tel:+972${digits.slice(1)}`;
  }
  return `tel:+${digits}`;
}
