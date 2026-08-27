import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "הצהרת נגישות",
};

export default function AccessibilityPage() {
  return (
    <section className="section-padding bg-surface">
      <Container className="max-w-3xl prose prose-slate">
        <h1 className="text-3xl font-bold text-primary">הצהרת נגישות</h1>
        <p className="text-text-secondary">
          {siteConfig.name} מחויבת להנגיש את אתר האינטרנט לאנשים עם מוגבלות,
          בהתאם לתקן הישראלי (ת&quot;י 5568) ולהנחיות WCAG 2.1 ברמה AA.
        </p>
        <h2 className="text-xl font-bold text-primary">אמצעי נגישות</h2>
        <ul className="text-text-secondary">
          <li>תמיכה בניווט מקלדת</li>
          <li>ניגודיות צבעים מתאימה</li>
          <li>טקסט חלופי לתמונות</li>
          <li>מבנה סמנטי וכותרות היררכיות</li>
          <li>תמיכה ב-RTL לעברית</li>
        </ul>
        <h2 className="text-xl font-bold text-primary">רכז/ת נגישות</h2>
        <p className="text-text-secondary">
          לפניות בנושא נגישות:{" "}
          <a href={`mailto:${siteConfig.email}`} dir="ltr">
            {siteConfig.email}
          </a>{" "}
          · <span dir="ltr">{siteConfig.phone}</span>
        </p>
        <p className="text-sm text-text-secondary">
          תאריך עדכון אחרון: אוגוסט 2026
        </p>
      </Container>
    </section>
  );
}
