import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/ui/page-hero";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "מדיניות פרטיות",
};

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        title="מדיניות פרטיות"
        breadcrumbs={[
          { label: "בית", href: "/" },
          { label: "מדיניות פרטיות" },
        ]}
      />
      <section className="section-padding bg-surface">
        <Container className="max-w-3xl prose">
          <p>
            {siteConfig.name} מכבדת את פרטיות המבקרים באתר. מסמך זה מתאר כיצד
            אנו אוספים, משתמשים ושומרים מידע אישי.
          </p>
          <h2>מה אנו אוספים</h2>
          <p>
            בעת יצירת קשר דרך טופס, WhatsApp או טלפון — שם, מספר טלפון, אימייל
            (אם סופק) ותוכן ההודעה.
          </p>
          <h2>למה אנו משתמשים במידע</h2>
          <p>
            לצורך מענה לפניות, הכנת הצעות מחיר, שיפור השירות ותיעוד תקשורת עסקית.
          </p>
          <h2>שמירת מידע</h2>
          <p>
            המידע נשמר כל עוד נדרש לצורך מתן שירות ועמידה בדרישות חוק. ניתן לפנות
            אלינו לבקשת מחיקה בכתובת{" "}
            <a href={`mailto:${siteConfig.email}`} dir="ltr" className="text-primary hover:text-accent">
              {siteConfig.email}
            </a>
            .
          </p>
        </Container>
      </section>
    </>
  );
}
