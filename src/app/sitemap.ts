import type { MetadataRoute } from "next";
import { db } from "@/lib/db";
import { publishedProductWhere } from "@/lib/catalog";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://electricity-shop.co.il";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    "",
    "/products",
    "/about",
    "/events",
    "/contact",
    "/privacy",
    "/accessibility",
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.7,
  }));

  try {
    const [products, categories] = await Promise.all([
      db.product.findMany({
        where: publishedProductWhere,
        select: { slug: true, updatedAt: true },
      }),
      db.category.findMany({ select: { slug: true, updatedAt: true } }),
    ]);

    return [
      ...staticPages,
      ...categories.map((category) => ({
        url: `${baseUrl}/categories/${category.slug}`,
        lastModified: category.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      })),
      ...products.map((product) => ({
        url: `${baseUrl}/products/${product.slug}`,
        lastModified: product.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.9,
      })),
    ];
  } catch {
    return staticPages;
  }
}
