import Link from "next/link";
import { Clock, MessageCircle, Phone } from "lucide-react";
import type { PublicProduct } from "@/lib/catalog";
import type { SiteSettings } from "@/lib/site-settings-types";
import { siteSettingsToPhoneHref } from "@/lib/site-settings";
import { buildWhatsAppUrl } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SpecTable } from "@/components/product/spec-table";

type ProductInfoProps = {
  product: PublicProduct;
  productUrl: string;
  settings: SiteSettings;
};

export function ProductInfo({ product, productUrl, settings }: ProductInfoProps) {
  const quoteMessage = `שלום, אשמח לקבל הצעת מחיר עבור:\n${product.name}\n${productUrl}`;
  const whatsappUrl = buildWhatsAppUrl(settings.whatsapp, quoteMessage);
  const phoneHref = siteSettingsToPhoneHref(settings.phone);

  return (
    <div className="space-y-6 lg:sticky lg:top-24">
      <div>
        <Link
          href={`/categories/${product.categorySlug}`}
          className="inline-flex rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold text-accent transition-colors hover:bg-accent/15"
        >
          {product.category}
        </Link>
        <h1 className="mt-4 text-2xl font-bold leading-tight text-primary sm:text-3xl lg:text-4xl">
          {product.name}
        </h1>
        {product.sku && (
          <p className="mt-2 text-sm text-text-secondary">
            מק&quot;ט: <span dir="ltr">{product.sku}</span>
          </p>
        )}
      </div>

      <p className="text-base leading-relaxed text-text-secondary sm:text-lg">
        {product.shortDescription}
      </p>

      {product.specs.length > 0 && (
        <div className="rounded-2xl border border-border bg-surface-alt p-5">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-text-secondary">
            מפרט
          </h2>
          <SpecTable specs={product.specs} />
        </div>
      )}

      <div className="rounded-2xl border border-border bg-surface p-5 shadow-[var(--shadow-soft)] sm:p-6">
        <p className="mb-4 text-sm text-text-secondary">
          המחירים אינם מוצגים באתר. שלחו בקשה ונחזור אליכם עם הצעה מותאמת.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button href={whatsappUrl} external variant="primary" size="lg" className="flex-1">
            <MessageCircle className="h-5 w-5" />
            בקשת הצעת מחיר
          </Button>
          <Button href={phoneHref} external variant="outline" size="lg">
            <Phone className="h-5 w-5" />
            <span dir="ltr">{settings.phone}</span>
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm text-text-secondary">
        <Clock className="h-4 w-4 text-accent" />
        <span>
          שעות פעילות:{" "}
          <span dir="ltr">{settings.supportHours}</span>
        </span>
      </div>
    </div>
  );
}
