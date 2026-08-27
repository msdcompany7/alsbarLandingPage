import { MessageCircle, ShoppingBag } from "lucide-react";
import { HeroVideoBackground } from "@/components/home/hero-video-background";
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
    <section className="relative flex min-h-[75vh] items-center overflow-hidden bg-primary lg:min-h-[80vh]">
      <HeroVideoBackground />

      <Container className="relative z-10 py-20 lg:py-28">
        <div className="max-w-2xl">
          <p className="mb-4 inline-flex items-center rounded-full border border-white/20 bg-black/30 px-4 py-1.5 text-sm font-medium text-white/90 backdrop-blur-md">
            {settings.yearsInBusiness}+ שנות ניסיון · {productCount}+ מוצרים
          </p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button href="/products" variant="primary" size="lg">
              <ShoppingBag className="h-5 w-5" />
              גלו את המוצרים
            </Button>
            <Button href={whatsappUrl} external variant="secondary" size="lg">
              <MessageCircle className="h-5 w-5" />
              WhatsApp
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
