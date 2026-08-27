import { Award, Clock, MapPin, Package } from "lucide-react";
import type { SiteSettings } from "@/lib/site-settings";
import { Container } from "@/components/ui/container";

type TrustBarProps = {
  settings: SiteSettings;
  productCount: number;
};

export function TrustBar({ settings, productCount }: TrustBarProps) {
  const items = [
    {
      icon: Award,
      value: `${settings.yearsInBusiness}+`,
      label: "שנות פעילות",
    },
    {
      icon: Package,
      value: `${productCount}+`,
      label: "מוצרים במלאי",
    },
    {
      icon: MapPin,
      value: settings.serviceArea,
      label: "אזורי שירות",
    },
    {
      icon: Clock,
      value: settings.supportHours,
      label: "שעות מענה",
    },
  ];

  return (
    <section className="border-b border-border bg-surface-alt">
      <Container>
        <ul className="grid grid-cols-2 gap-6 py-8 lg:grid-cols-4 lg:gap-8">
          {items.map((item) => (
            <li key={item.label} className="flex items-center gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary text-accent">
                <item.icon className="h-6 w-6" />
              </span>
              <div>
                <p className="text-lg font-bold text-primary">{item.value}</p>
                <p className="text-sm text-text-secondary">{item.label}</p>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
