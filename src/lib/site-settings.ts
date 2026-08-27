import { siteConfig } from "@/lib/site-config";
import { siteSettingFields } from "@/lib/site-setting-fields";
import type { SiteSettings } from "@/lib/site-settings-types";
import { db } from "@/lib/db";

export type { SiteSettings } from "@/lib/site-settings-types";
export { siteSettingFields };

const defaults: SiteSettings = {
  name: siteConfig.name,
  tagline: siteConfig.tagline,
  description: siteConfig.description,
  phone: siteConfig.phone,
  whatsapp: siteConfig.whatsapp,
  email: siteConfig.email,
  address: siteConfig.address,
  wazeUrl: siteConfig.wazeUrl,
  heroTitle: "פתרונות תאורה וחשמל",
  heroSubtitle: "S.Light · חשמל אלסבינר",
  yearsInBusiness: siteConfig.stats.yearsInBusiness,
  serviceArea: siteConfig.stats.serviceArea,
  supportHours: siteConfig.stats.supportHours,
};

function parseNumber(value: string | undefined, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const rows = await db.siteSetting.findMany();
    const map = Object.fromEntries(rows.map((row) => [row.key, row.value]));

    return {
      name: map["site.name"] ?? defaults.name,
      tagline: map["site.tagline"] ?? defaults.tagline,
      description: map["site.description"] ?? defaults.description,
      phone: map["site.phone"] ?? defaults.phone,
      whatsapp: map["site.whatsapp"] ?? defaults.whatsapp,
      email: map["site.email"] ?? defaults.email,
      address: map["site.address"] ?? defaults.address,
      wazeUrl: map["site.waze_url"] ?? defaults.wazeUrl,
      heroTitle: map["site.hero_title"] ?? defaults.heroTitle,
      heroSubtitle: map["site.hero_subtitle"] ?? defaults.heroSubtitle,
      yearsInBusiness: parseNumber(map["site.years_in_business"], defaults.yearsInBusiness),
      serviceArea: map["site.service_area"] ?? defaults.serviceArea,
      supportHours: map["site.support_hours"] ?? defaults.supportHours,
    };
  } catch {
    return defaults;
  }
}

export function siteSettingsToPhoneHref(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("0")) {
    return `tel:+972${digits.slice(1)}`;
  }
  return `tel:+${digits}`;
}
