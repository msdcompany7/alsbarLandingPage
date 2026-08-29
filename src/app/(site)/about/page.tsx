import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Award, Clock, MapPin, Package } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";

export const metadata: Metadata = {
  title: "אודות",
  description: `אודות ${siteConfig.name} — ספק חשמל מקצועי עם ניסיון של ${siteConfig.stats.yearsInBusiness}+ שנים.`,
};

const statItems = [
  {
    icon: Award,
    value: `${siteConfig.stats.yearsInBusiness}+`,
    label: "שנות ניסיון",
  },
  {
    icon: Package,
    value: `${siteConfig.stats.productCount}+`,
    label: "מוצרים במלאi",
  },
  {
    icon: MapPin,
    value: siteConfig.stats.serviceArea,
    label: "אזורי שירות",
  },
  {
    icon: Clock,
    value: siteConfig.stats.supportHours,
    label: "שעות מענה",
  },
];

export default function AboutPage() {
  return (
    <section className="section-padding bg-surface-alt/40">
      <Container>
        <Reveal className="max-w-3xl">
          <p className="eyebrow mb-2">אודותינו</p>
          <h1 className="heading-page">אודות {siteConfig.name}</h1>
          <p className="lead mt-4">{siteConfig.tagline}</p>
          <p className="mt-2 text-base font-semibold text-primary">{siteConfig.brandNameHe}</p>
        </Reveal>

        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
          {statItems.map((item, index) => (
            <Reveal key={item.label} delay={index * 70}>
              <div className="rounded-2xl border border-border bg-surface p-5 shadow-[var(--shadow-soft)]">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-soft text-accent">
                  <item.icon className="h-5 w-5" />
                </span>
                <p className="mt-4 text-xl font-bold text-primary">{item.value}</p>
                <p className="mt-1 text-sm text-text-secondary">{item.label}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={120}>
          <div className="mt-10 rounded-2xl border border-border bg-surface p-6 shadow-[var(--shadow-soft)] sm:p-8 lg:p-10">
            <div className="mx-auto max-w-3xl space-y-6 text-base leading-relaxed text-text-secondary sm:text-lg">
              <p>
                {siteConfig.name} היא חנות ציוד חשמל מקצועית המשרתת קבלנים, חשמלאים ולקוחות
                פרטיים כבר יותר מ-{siteConfig.stats.yearsInBusiness} שנים. אנחנו מתמחים במלאi
                רחב, שירות אישי והצעות מחיר מהירות.
              </p>
              <p>
                המטרה שלנו פשוטה: לספק לכם את הציוד הנכון, בזמן הנכון, עם ייעוץ מקצועי שחוסך
                זמן וכסף בפרויקט.
              </p>
              <p>
                אין תשלום מקוון באתר — אנחנו עובדים עם הצעות מחיר מותאמות לפי סוג לקוח ופרויקט.
                צרו קשר בטלפון, ב-WhatsApp או דרך טופס יצירת הקשר.
              </p>
            </div>

            <div className="mx-auto mt-10 flex max-w-3xl flex-col gap-3 border-t border-border pt-8 sm:flex-row sm:items-center">
              <Button href="/contact" variant="primary" size="lg" className="sm:min-w-[160px]">
                צור קשר
              </Button>
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold text-primary transition-colors hover:text-accent"
              >
                <ArrowLeft className="h-4 w-4" />
                לקטלוג המוצרים
              </Link>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
