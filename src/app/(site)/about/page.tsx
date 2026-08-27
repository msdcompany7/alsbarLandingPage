import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = {
  title: "אודות",
  description: `אודות ${siteConfig.name} — ספק חשמל מקצועי עם ניסיון של ${siteConfig.stats.yearsInBusiness}+ שנים.`,
};

export default function AboutPage() {
  return (
    <section className="section-padding bg-surface">
      <Container className="max-w-3xl">
        <h1 className="text-3xl font-bold text-primary md:text-4xl">אודות {siteConfig.name}</h1>
        <div className="mt-8 space-y-6 text-lg leading-relaxed text-text-secondary">
          <p>
            {siteConfig.name} היא חנות ציוד חשמל מקצועית המשרתת קבלנים, חשמלאים ולקוחות
            פרטיים כבר יותר מ-{siteConfig.stats.yearsInBusiness} שנים. אנחנו מתמחים במלאי
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
        <div className="mt-10 flex flex-wrap gap-3">
          <Button href="/contact" variant="navy">
            צור קשר
          </Button>
          <Link
            href="/products"
            className="inline-flex items-center gap-1 px-4 py-3 text-sm font-semibold text-primary hover:text-accent"
          >
            <ArrowRight className="h-4 w-4" />
            לקטלוג המוצרים
          </Link>
        </div>
      </Container>
    </section>
  );
}
