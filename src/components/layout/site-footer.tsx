import Link from "next/link";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { SiteLogo } from "@/components/layout/site-logo";
import { getCategories } from "@/lib/products";
import { siteConfig } from "@/lib/site-config";
import type { SiteSettings } from "@/lib/site-settings";
import { Container } from "@/components/ui/container";

type SiteFooterProps = {
  settings: SiteSettings;
  phoneHref: string;
};

export async function SiteFooter({ settings, phoneHref }: SiteFooterProps) {
  const categories = await getCategories();

  return (
    <footer className="border-t border-white/10 bg-primary text-white">
      <Container className="py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <SiteLogo imageClassName="h-12 sm:h-14" />
            <p className="text-sm leading-relaxed text-white/75">
              {settings.tagline}. אנחנו כאן לכל פרויקט — מבית פרטי ועד אתר בנייה
              גדול.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-accent">
              קטגוריות
            </h3>
            <ul className="space-y-2.5">
              {categories.slice(0, 6).map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/categories/${cat.slug}`}
                    className="text-sm text-white/75 transition-colors hover:text-accent"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-accent">
              יצירת קשר
            </h3>
            <ul className="space-y-3 text-sm text-white/75">
              <li className="flex items-start gap-2.5">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <a href={phoneHref} dir="ltr" className="hover:text-white">
                  {settings.phone}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <a href={`mailto:${settings.email}`} dir="ltr" className="hover:text-white">
                  {settings.email}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <span>{settings.address}</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-accent">
              שעות פעילות
            </h3>
            <ul className="space-y-2.5">
              {siteConfig.hours.map((row) => (
                <li
                  key={row.days}
                  className="flex items-center justify-between gap-4 text-sm text-white/75"
                >
                  <span className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-accent" />
                    {row.days}
                  </span>
                  <span dir="ltr">{row.time}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>

      <div className="border-t border-white/10">
        <Container className="flex flex-col items-center justify-between gap-3 py-5 text-sm text-white/60 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {siteConfig.brandNameHe} · S.Light. כל הזכויות שמורות.
          </p>
          <div className="flex gap-5">
            <Link href="/privacy" className="hover:text-accent">
              מדיניות פרטיות
            </Link>
            <Link href="/accessibility" className="hover:text-accent">
              הצהרת נגישות
            </Link>
          </div>
        </Container>
      </div>
    </footer>
  );
}
