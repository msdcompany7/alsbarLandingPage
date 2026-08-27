import { Clock, MapPin, Navigation, Phone } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import type { SiteSettings } from "@/lib/site-settings";
import { siteSettingsToPhoneHref } from "@/lib/site-settings";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

type LocationSectionProps = {
  settings: SiteSettings;
};

export function LocationSection({ settings }: LocationSectionProps) {
  const phoneHref = siteSettingsToPhoneHref(settings.phone);

  return (
    <section className="section-padding bg-surface-alt">
      <Container>
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div className="overflow-hidden rounded-xl border border-border shadow-sm">
            <iframe
              title="מפת החנות"
              src={siteConfig.googleMapsEmbed}
              className="aspect-[4/3] w-full border-0 lg:aspect-square"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>

          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-accent">
              בואו לבקר
            </p>
            <h2 className="text-3xl font-bold text-primary md:text-[2rem]">
              איך מגיעים אלינו
            </h2>
            <p className="mt-3 text-text-secondary">
              החנות פתוחה לקהל — בואו לראות את המלאי, לקבל ייעוץ מקצועי ולקחת ציוד
              ישירות מהמדף.
            </p>

            <ul className="mt-8 space-y-5">
              <li className="flex items-start gap-3">
                <MapPin className="mt-1 h-5 w-5 shrink-0 text-accent" />
                <div>
                  <p className="font-semibold text-text-primary">כתובת</p>
                  <p className="text-text-secondary">{settings.address}</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="mt-1 h-5 w-5 shrink-0 text-accent" />
                <div>
                  <p className="font-semibold text-text-primary">טלפון</p>
                  <a
                    href={phoneHref}
                    dir="ltr"
                    className="text-text-secondary hover:text-primary"
                  >
                    {settings.phone}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="mt-1 h-5 w-5 shrink-0 text-accent" />
                <div>
                  <p className="font-semibold text-text-primary">שעות פתיחה</p>
                  <ul className="mt-1 space-y-1 text-text-secondary">
                    {siteConfig.hours.map((row) => (
                      <li key={row.days} className="flex justify-between gap-6">
                        <span>{row.days}</span>
                        <span dir="ltr">{row.time}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            </ul>

            <div className="mt-8">
              <Button href={settings.wazeUrl} external variant="navy">
                <Navigation className="h-4 w-4" />
                ניווט ב-Waze
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
