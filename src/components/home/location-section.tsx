import { Clock, MapPin, Navigation, Phone } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import type { SiteSettings } from "@/lib/site-settings";
import { siteSettingsToPhoneHref } from "@/lib/site-settings";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";

type LocationSectionProps = {
  settings: SiteSettings;
};

export function LocationSection({ settings }: LocationSectionProps) {
  const phoneHref = siteSettingsToPhoneHref(settings.phone);

  return (
    <section className="section-padding bg-surface-alt">
      <Container>
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-12">
          <Reveal>
            <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-[var(--shadow-soft)]">
              <iframe
                title="מפת החנות"
                src={siteConfig.googleMapsEmbed}
                className="aspect-[4/3] w-full border-0 lg:aspect-[5/4]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div>
              <p className="eyebrow mb-2">בואו לבקר</p>
              <h2 className="heading-section">איך מגיעים אלינו</h2>
              <p className="lead mt-3 max-w-xl">
                החנות פתוחה לקהל — בואו לראות את המלאי, לקבל ייעוץ מקצועי ולקחת ציוד
                ישירות מהמדף.
              </p>
            </div>

            <ul className="mt-8 space-y-5">
              <li className="flex items-start gap-3 rounded-xl border border-border bg-surface p-4">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                <div>
                  <p className="font-semibold text-text-primary">כתובת</p>
                  <p className="mt-1 text-text-secondary">{settings.address}</p>
                </div>
              </li>
              <li className="flex items-start gap-3 rounded-xl border border-border bg-surface p-4">
                <Phone className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                <div>
                  <p className="font-semibold text-text-primary">טלפון</p>
                  <a
                    href={phoneHref}
                    dir="ltr"
                    className="mt-1 inline-block text-text-secondary hover:text-primary"
                  >
                    {settings.phone}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3 rounded-xl border border-border bg-surface p-4">
                <Clock className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                <div className="w-full">
                  <p className="font-semibold text-text-primary">שעות פתיחה</p>
                  <ul className="mt-2 space-y-1.5 text-sm text-text-secondary">
                    {siteConfig.hours.map((row) => (
                      <li key={row.days} className="flex justify-between gap-4">
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
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
