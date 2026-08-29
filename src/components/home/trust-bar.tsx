import { Award, Clock, MapPin, Package } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
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
    <section className="relative z-10 -mt-6 sm:-mt-8">
      <Container>
        <Reveal>
          <ul className="grid grid-cols-2 gap-3 rounded-2xl border border-border bg-white p-4 shadow-[var(--shadow-card)] sm:gap-4 sm:p-5 lg:grid-cols-4 lg:gap-6 lg:p-6">
            {items.map((item, index) => (
              <li
                key={item.label}
                className="flex items-center gap-3 sm:gap-4"
                style={{ transitionDelay: `${index * 60}ms` }}
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent sm:h-12 sm:w-12">
                  <item.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-base font-bold text-primary sm:text-lg">{item.value}</p>
                  <p className="text-xs text-text-secondary sm:text-sm">{item.label}</p>
                </div>
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </section>
  );
}
