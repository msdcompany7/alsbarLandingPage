/**
 * One-time Firestore seed script for COMPLETELY FRESH installations only.
 *
 * Requires explicit opt-in:
 *   ALLOW_SAMPLE_SEED=true
 */
import "./load-env";
import { getAdminAuth, getAdminDb } from "../src/lib/firebase/admin";
import { categories, products } from "../src/lib/mock-data";
import { siteConfig } from "../src/lib/site-config";
import { seedSiteSettings } from "../src/lib/firestore/site-settings";

if (process.env.ALLOW_SAMPLE_SEED !== "true") {
  console.error("Refusing to run sample seed.");
  console.error("This command is for fresh installs with an empty Firestore database.");
  console.error("If you truly want mock/sample data, set ALLOW_SAMPLE_SEED=true in .env");
  process.exit(1);
}

const siteSettingsSeed: Record<string, string> = {
  "site.name": siteConfig.name,
  "site.tagline": siteConfig.tagline,
  "site.description": siteConfig.description,
  "site.phone": siteConfig.phone,
  "site.whatsapp": siteConfig.whatsapp,
  "site.email": siteConfig.email,
  "site.address": siteConfig.address,
  "site.waze_url": siteConfig.wazeUrl,
  "site.hero_title": "פתרונות תאורה וחשמל",
  "site.hero_subtitle": "S.Light · חשמל אלסבינר",
  "site.years_in_business": String(siteConfig.stats.yearsInBusiness),
  "site.service_area": siteConfig.stats.serviceArea,
  "site.support_hours": siteConfig.stats.supportHours,
};

async function ensureAdminUser() {
  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@electricity-shop.local";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "Admin123!";
  const auth = getAdminAuth();

  let user;
  try {
    user = await auth.getUserByEmail(adminEmail);
    await auth.updateUser(user.uid, {
      password: adminPassword,
      displayName: "מנהל מערכת",
    });
  } catch {
    user = await auth.createUser({
      email: adminEmail,
      password: adminPassword,
      displayName: "מנהל מערכת",
      emailVerified: true,
    });
  }

  await auth.setCustomUserClaims(user.uid, { admin: true });
  console.log(`Admin user ready: ${adminEmail}`);
}

async function seedCategoriesAndProducts() {
  const db = getAdminDb();
  const categoryMap = new Map<string, string>();

  for (const [index, category] of categories.entries()) {
    const snapshot = await db
      .collection("categories")
      .where("slug", "==", category.slug)
      .limit(1)
      .get();

    const payload = {
      slug: category.slug,
      nameHe: category.name,
      nameEn: null,
      description: category.description,
      parentId: null,
      imageUrl: category.image,
      icon: null,
      sortOrder: index,
      updatedAt: new Date(),
    };

    if (snapshot.empty) {
      const ref = db.collection("categories").doc();
      await ref.set({ ...payload, createdAt: new Date() });
      categoryMap.set(category.slug, ref.id);
    } else {
      const doc = snapshot.docs[0]!;
      await doc.ref.set(payload, { merge: true });
      categoryMap.set(category.slug, doc.id);
    }
  }

  for (const [index, product] of products.entries()) {
    const categoryId = categoryMap.get(product.categorySlug);
    if (!categoryId) continue;

    const snapshot = await db
      .collection("products")
      .where("slug", "==", product.slug)
      .limit(1)
      .get();

    const payload = {
      slug: product.slug,
      nameHe: product.name,
      nameEn: product.nameEn ?? null,
      sku: product.sku ?? null,
      shortDescription: product.shortDescription,
      description: product.description,
      categoryId,
      specs: product.specs,
      isFeatured: product.featured ?? false,
      status: "published",
      sortOrder: index,
      viewCount: product.viewCount,
      metaTitle: null,
      metaDescription: null,
      deletedAt: null,
      images: product.images.map((url, imageIndex) => ({
        url,
        altTextHe: product.name,
        sortOrder: imageIndex,
      })),
      updatedAt: new Date(),
    };

    if (snapshot.empty) {
      await db.collection("products").doc().set({
        ...payload,
        createdAt: new Date(),
      });
    } else {
      await snapshot.docs[0]!.ref.set(payload, { merge: true });
    }
  }
}

async function main() {
  await ensureAdminUser();
  await seedCategoriesAndProducts();
  await seedSiteSettings(siteSettingsSeed);
  console.log("Sample Firestore seed complete.");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
