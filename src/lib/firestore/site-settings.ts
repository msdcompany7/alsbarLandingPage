import { getAdminDb } from "@/lib/firebase/admin";
import { siteConfig } from "@/lib/site-config";
import { siteSettingFields } from "@/lib/site-setting-fields";
import type { SiteSettings } from "@/lib/site-settings-types";

const COLLECTION = "siteSettings";

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

export async function getSiteSettingsFromFirestore(): Promise<SiteSettings> {
  try {
    const snapshot = await getAdminDb().collection(COLLECTION).get();
    const map = Object.fromEntries(
      snapshot.docs.map((doc) => [doc.id, String(doc.data().value ?? "")]),
    );

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

export async function saveSiteSettingsToFirestore(settings: SiteSettings) {
  const batch = getAdminDb().batch();

  for (const field of siteSettingFields) {
    const key = field.key as keyof SiteSettings;
    const ref = getAdminDb().collection(COLLECTION).doc(field.dbKey);
    batch.set(
      ref,
      {
        value: String(settings[key]),
        updatedAt: new Date(),
      },
      { merge: true },
    );
  }

  await batch.commit();
}

export async function seedSiteSettings(settings: Record<string, string>) {
  const batch = getAdminDb().batch();

  for (const [key, value] of Object.entries(settings)) {
    const ref = getAdminDb().collection(COLLECTION).doc(key);
    batch.set(ref, { value, updatedAt: new Date() }, { merge: true });
  }

  await batch.commit();
}
