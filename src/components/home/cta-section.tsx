import { MessageCircle } from "lucide-react";
import type { SiteSettings } from "@/lib/site-settings";
import { buildWhatsAppUrl } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

type CtaSectionProps = {
  settings: SiteSettings;
};

export function CtaSection({ settings }: CtaSectionProps) {
  const whatsappUrl = buildWhatsAppUrl(
    settings.whatsapp,
    "שלום, אשמח לקבל הצעת מחיר לפרויקט שלי",
  );

  return (
    <section className="bg-primary py-16 md:py-20">
      <Container className="text-center">
        <h2 className="text-balance text-2xl font-bold text-white md:text-3xl">
          צריכים הצעת מחיר? שלחו לנו הודעה — נחזור אליכם בהקדם
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-white/75">
          אין צורך בחשבון או בתשלום מקוון. פשוט תארו מה אתם צריכים ונכין הצעה מותאמת.
        </p>
        <Button
          href={whatsappUrl}
          external
          variant="primary"
          size="lg"
          className="mt-8"
        >
          <MessageCircle className="h-5 w-5" />
          שלחו הודעה ב-WhatsApp
        </Button>
      </Container>
    </section>
  );
}
