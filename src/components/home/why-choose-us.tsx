import { Award, Headphones, Package } from "lucide-react";
import { whyChooseUs } from "@/lib/mock-data";
import { Container } from "@/components/ui/container";

const iconMap = {
  award: Award,
  package: Package,
  headphones: Headphones,
} as const;

export function WhyChooseUs() {
  return (
    <section className="section-padding bg-surface">
      <Container>
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-accent">
            למה אנחנו
          </p>
          <h2 className="text-3xl font-bold text-primary md:text-[2rem]">
            למה לבחור בנו?
          </h2>
          <p className="mt-3 text-text-secondary">
            אנחנו מספקים לקבלנים ולחשמלאים את מה שהם צריכים — בזמן, באיכות ובמחיר הוגן.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {whyChooseUs.map((item) => {
            const Icon = iconMap[item.icon];
            return (
              <article
                key={item.title}
                className="rounded-xl border border-border bg-surface p-8 shadow-sm transition-shadow hover:shadow-md"
              >
                <span className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-primary/5 text-primary">
                  <Icon className="h-7 w-7" />
                </span>
                <h3 className="mb-3 text-xl font-bold text-primary">{item.title}</h3>
                <p className="text-text-secondary leading-relaxed">{item.description}</p>
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
