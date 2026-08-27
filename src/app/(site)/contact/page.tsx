import type { Metadata } from "next";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { ContactForm } from "@/components/contact/contact-form";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Container } from "@/components/ui/container";
import { siteConfig } from "@/lib/site-config";
import { getSiteSettings, siteSettingsToPhoneHref } from "@/lib/site-settings";
import { buildWhatsAppUrl } from "@/lib/utils";

export const metadata: Metadata = {
  title: "צור קשר",
  description: `יצירת קשר — טופס, טלפון, WhatsApp, כתובת ושעות פעילות.`,
};

export default async function ContactPage() {
  const settings = await getSiteSettings();
  const phoneHref = siteSettingsToPhoneHref(settings.phone);
  const whatsappUrl = buildWhatsAppUrl(
    settings.whatsapp,
    `שלום, אשמח ליצור קשר עם ${settings.name}`,
  );

  return (
    <section className="section-padding bg-surface-alt">
      <Container>
        <Breadcrumbs
          items={[
            { label: "בית", href: "/" },
            { label: "צור קשר" },
          ]}
          className="mb-6"
        />

        <div className="mb-10 max-w-2xl">
          <h1 className="text-3xl font-bold text-primary md:text-4xl">צור קשר</h1>
          <p className="mt-3 text-text-secondary">
            {"ניתן למלא את הטופס, לשלוח הודעה ב-WhatsApp או להתקשר — נחזור אליכם בהקדם עם מענה מקצועי."}
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-start">
          <div className="rounded-xl border border-border bg-surface p-6 shadow-sm md:p-8">
            <h2 className="mb-6 text-xl font-bold text-primary">שליחת פנייה</h2>
            <ContactForm />
          </div>

          <aside className="space-y-4">
            <div className="rounded-xl border border-border bg-surface p-6 shadow-sm">
              <h2 className="mb-5 text-lg font-bold text-primary">דרכים נוספות</h2>
              <ul className="space-y-4">
                <li>
                  <a
                    href={phoneHref}
                    className="flex items-center gap-4 rounded-lg p-2 transition-colors hover:bg-surface-alt"
                  >
                    <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/5 text-primary">
                      <Phone className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="font-semibold text-text-primary">טלפון</p>
                      <p dir="ltr" className="text-sm text-text-secondary">
                        {settings.phone}
                      </p>
                    </div>
                  </a>
                </li>
                <li>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 rounded-lg p-2 transition-colors hover:bg-surface-alt"
                  >
                    <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#25D366]/10 text-[#25D366]">
                      <MessageCircle className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="font-semibold text-text-primary">WhatsApp</p>
                      <p className="text-sm text-text-secondary">מענה מהיר בצ&apos;אט</p>
                    </div>
                  </a>
                </li>
                <li>
                  <a
                    href={`mailto:${settings.email}`}
                    className="flex items-center gap-4 rounded-lg p-2 transition-colors hover:bg-surface-alt"
                  >
                    <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/5 text-primary">
                      <Mail className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="font-semibold text-text-primary">אימייל</p>
                      <p dir="ltr" className="text-sm text-text-secondary">
                        {settings.email}
                      </p>
                    </div>
                  </a>
                </li>
              </ul>
            </div>

            <div className="rounded-xl border border-border bg-surface p-6 shadow-sm">
              <div className="flex items-start gap-3">
                <MapPin className="mt-1 h-5 w-5 shrink-0 text-accent" />
                <div>
                  <p className="font-semibold text-text-primary">כתובת</p>
                  <p className="mt-1 text-sm text-text-secondary">{settings.address}</p>
                </div>
              </div>
              <div className="mt-5 flex items-start gap-3 border-t border-border pt-5">
                <Clock className="mt-1 h-5 w-5 shrink-0 text-accent" />
                <div className="w-full">
                  <p className="font-semibold text-text-primary">שעות פעילות</p>
                  <ul className="mt-2 space-y-1.5 text-sm text-text-secondary">
                    {siteConfig.hours.map((row) => (
                      <li key={row.days} className="flex justify-between gap-4">
                        <span>{row.days}</span>
                        <span dir="ltr">{row.time}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </Container>
    </section>
  );
}
