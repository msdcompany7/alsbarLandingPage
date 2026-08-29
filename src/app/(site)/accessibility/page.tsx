import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/ui/page-hero";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "הצהרת נגישות",
};

export default function AccessibilityPage() {
  return (
    <>
      <PageHero
        title="הצהרת נגישות"
        breadcrumbs={[
          { label: "בית", href: "/" },
          { label: "הצהרת נגישות" },
        ]}
      />
      <section className="section-padding bg-surface">
        <Container className="max-w-3xl prose">
          <p>
            {siteConfig.name} מחויבת להנגיש את אתר האינטרנט לאנשים עם מוגבלות,
            בהתאם לתקן הישראלי (ת&quot;י 5568) ולהנחיות WCAG 2.1 ברמה AA.
          </p>
          <h2>אמצעי נגישות</h2>
          <ul>
            <li>תמיכה בניווט מקלדת</li>
            <li>ניגודיות צבעים מתאימה</li>
            <li>טקסט חלופי לתמונות</li>
            <li>מבנה סמנטי וכותרות היררכיות</li>
            <li>תמיכה ב-RTL לעברית</li>
          </ul>
          <h2>רכז/ת נגישות</h2>
          <p>
            לפניות בנושא נגישות:{" "}
            <a href={`mailto:${siteConfig.email}`} dir="ltr" className="text-primary hover:text-accent">
              {siteConfig.email}
            </a>{" "}
            · <span dir="ltr">{siteConfig.phone}</span>
          </p>
          <p className="text-sm">
            תאריך עדכון אחרון: אוגוסט 2026
          </p>
        </Container>
      </section>
    </>
  );
}
