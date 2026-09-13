import { CategoriesSection } from "@/components/home/categories-section";
import { CtaSection } from "@/components/home/cta-section";
import { FeaturedProducts } from "@/components/home/featured-products";
import { HeroSection } from "@/components/home/hero-section";
import { LocationSection } from "@/components/home/location-section";
import { TrustBar } from "@/components/home/trust-bar";
import { WhyChooseUs } from "@/components/home/why-choose-us";
import {
  getCategories,
  getFeaturedProducts,
  getPublishedProductCount,
} from "@/lib/products";
import { getSiteSettings } from "@/lib/site-settings";

export default async function HomePage() {
  const [categories, featuredProducts, settings, productCount] = await Promise.all([
    getCategories(),
    getFeaturedProducts(),
    getSiteSettings(),
    getPublishedProductCount(),
  ]);

  return (
    <>
      <HeroSection settings={settings} productCount={productCount} />
      <TrustBar settings={settings} productCount={productCount} />
      <CategoriesSection categories={categories} />
      <FeaturedProducts products={featuredProducts} />
      <WhyChooseUs />
      <LocationSection settings={settings} />
      <CtaSection settings={settings} />
    </>
  );
}
