import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "מדיניות פרטיות",
};

export default function PrivacyPage() {
  return (
    <section className="section-padding bg-surface">
      <Container className="max-w-3xl prose prose-slate">
        <h1 className="text-3xl font-bold text-primary">מדיניות פרטיות</h1>
        <p className="text-text-secondary">
          {siteConfig.name} מכבדת את פרטיות המבקרים באתר. מסמך זה מתאר כיצד
          אנו אוספים, משתמשים ושומרים מידע אישי.
        </p>
        <h2 className="text-xl font-bold text-primary">מה אנו אוספים</h2>
        <p className="text-text-secondary">
          בעת יצירת קשר דרך טופס, WhatsApp או טלפון — שם, מספר טלפון, אימייל
          (אם סופק) ותוכן ההודעה.
        </p>
        <h2 className="text-xl font-bold text-primary">למה אנו משתמשים במידע</h2>
        <p className="text-text-secondary">
          לצורך מענה לפניות, הכנת הצעות מחיר, שיפור השירות ותיעוד תקשורת עסקית.
        </p>
        <h2 className="text-xl font-bold text-primary">שמירת מידע</h2>
        <p className="text-text-secondary">
          המידע נשמר כל עוד נדרש לצורך מתן שירות ועמידה בדרישות חוק. ניתן לפנות
          אלינו לבקשת מחיקה בכתובת{" "}
          <a href={`mailto:${siteConfig.email}`} dir="ltr">
            {siteConfig.email}
          </a>
          .
        </p>
      </Container>
    </section>
  );
}
