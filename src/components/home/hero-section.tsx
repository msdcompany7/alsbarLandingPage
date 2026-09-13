import { MessageCircle, ShoppingBag, Zap } from "lucide-react";
import { HeroVideoBackground } from "@/components/home/hero-video-background";
import { Reveal } from "@/components/ui/reveal";
import type { SiteSettings } from "@/lib/site-settings";
import { buildWhatsAppUrl } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

type HeroSectionProps = {
  settings: SiteSettings;
  productCount: number;
};

export function HeroSection({ settings, productCount }: HeroSectionProps) {
  const whatsappUrl = buildWhatsAppUrl(
    settings.whatsapp,
    `שלום, אשמח לקבל מידע על מוצרי ${settings.name}`,
  );

  return (
    <section className="relative flex min-h-[88svh] items-end overflow-hidden bg-primary sm:min-h-[90svh] lg:min-h-[92vh] lg:items-center">
      <HeroVideoBackground />

      <Container className="relative z-10 w-full pb-10 pt-24 sm:pb-12 sm:pt-28 lg:py-20">
        <Reveal className="max-w-2xl">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/25 bg-black/35 px-4 py-1.5 text-xs font-medium text-white/95 backdrop-blur-md sm:text-sm">
            <Zap className="h-3.5 w-3.5 text-accent" />
            {settings.yearsInBusiness}+ שנות ניסיון · {productCount}+ מוצרים · {settings.serviceArea}
          </p>

          <h1 className="text-balance text-3xl font-bold leading-[1.12] tracking-tight text-white sm:text-4xl md:text-5xl lg:text-[3.35rem]">
            {settings.heroTitle}
          </h1>

          <p className="mt-4 max-w-xl text-base leading-relaxed text-white/85 sm:mt-5 sm:text-lg">
            {settings.heroSubtitle}
          </p>

          <p className="mt-3 text-sm text-white/70">{settings.tagline}</p>

          <div className="mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap">
            <Button href="/products" variant="primary" size="lg" className="w-full sm:w-auto">
              <ShoppingBag className="h-5 w-5" />
              גלו את המוצרים
            </Button>
            <Button href={whatsappUrl} external variant="secondary" size="lg" className="w-full sm:w-auto">
              <MessageCircle className="h-5 w-5" />
              WhatsApp
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
