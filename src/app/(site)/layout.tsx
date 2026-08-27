import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { MobileCallBar } from "@/components/layout/mobile-call-bar";
import { WhatsAppFab } from "@/components/layout/whatsapp-fab";
import { siteConfig } from "@/lib/site-config";
import { getSiteSettings, siteSettingsToPhoneHref } from "@/lib/site-settings";

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} | ${siteConfig.brandNameHe}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  openGraph: {
    type: "website",
    locale: "he_IL",
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
  },
};

export default async function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettings();
  const phoneHref = siteSettingsToPhoneHref(settings.phone);

  return (
    <div className="flex min-h-full flex-col pb-16 sm:pb-0">
      <SiteHeader phone={settings.phone} phoneHref={phoneHref} />
      <main className="flex-1">{children}</main>
      <SiteFooter settings={settings} phoneHref={phoneHref} />
      <WhatsAppFab whatsapp={settings.whatsapp} siteName={settings.name} />
      <MobileCallBar phone={settings.phone} phoneHref={phoneHref} whatsapp={settings.whatsapp} />
    </div>
  );
}
