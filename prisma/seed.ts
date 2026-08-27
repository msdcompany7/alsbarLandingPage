import { PrismaClient } from "../src/generated/prisma";
import bcrypt from "bcryptjs";
import { categories, products } from "../src/lib/mock-data";
import { siteConfig } from "../src/lib/site-config";

const db = new PrismaClient();

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

async function main() {
  const adminEmail = "admin@electricity-shop.local";
  const passwordHash = await bcrypt.hash("Admin123!", 12);

  await db.adminUser.upsert({
    where: { email: adminEmail },
    update: { passwordHash, name: "מנהל מערכת" },
    create: {
      email: adminEmail,
      passwordHash,
      name: "מנהל מערכת",
    },
  });

  const categoryMap = new Map<string, string>();

  for (const [index, category] of categories.entries()) {
    const record = await db.category.upsert({
      where: { slug: category.slug },
      update: {
        nameHe: category.name,
        description: category.description,
        imageUrl: category.image,
        sortOrder: index,
      },
      create: {
        slug: category.slug,
        nameHe: category.name,
        description: category.description,
        imageUrl: category.image,
        sortOrder: index,
      },
    });
    categoryMap.set(category.slug, record.id);
  }

  for (const [index, product] of products.entries()) {
    const categoryId = categoryMap.get(product.categorySlug);
    if (!categoryId) continue;

    const record = await db.product.upsert({
      where: { slug: product.slug },
      update: {
        nameHe: product.name,
        nameEn: product.nameEn,
        sku: product.sku,
        shortDescription: product.shortDescription,
        description: product.description,
        categoryId,
        specs: product.specs,
        isFeatured: product.featured ?? false,
        status: "published",
        sortOrder: index,
        viewCount: product.viewCount,
      },
      create: {
        slug: product.slug,
        nameHe: product.name,
        nameEn: product.nameEn,
        sku: product.sku,
        shortDescription: product.shortDescription,
        description: product.description,
        categoryId,
        specs: product.specs,
        isFeatured: product.featured ?? false,
        status: "published",
        sortOrder: index,
        viewCount: product.viewCount,
      },
    });

    await db.productImage.deleteMany({ where: { productId: record.id } });

    for (const [imageIndex, url] of product.images.entries()) {
      await db.productImage.create({
        data: {
          productId: record.id,
          url,
          altTextHe: product.name,
          sortOrder: imageIndex,
        },
      });
    }
  }

  for (const [key, value] of Object.entries(siteSettingsSeed)) {
    await db.siteSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  }

  console.log("Website seed complete.");
  console.log(`Admin login: ${adminEmail} / Admin123!`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
