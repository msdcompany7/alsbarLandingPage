import { Award, Headphones, Package } from "lucide-react";
import { whyChooseUs } from "@/lib/mock-data";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeader } from "@/components/ui/section-header";

const iconMap = {
  award: Award,
  package: Package,
  headphones: Headphones,
} as const;

export function WhyChooseUs() {
  return (
    <section className="section-padding bg-surface">
      <Container>
        <SectionHeader
          eyebrow="למה אנחנו"
          title="למה לבחור בנו?"
          description="אנחנו מספקים לקבלנים ולחשמלאים את מה שהם צריכים — בזמן, באיכות ובמחיר הוגן."
          align="center"
        />

        <div className="grid gap-5 md:grid-cols-3 md:gap-6 lg:gap-8">
          {whyChooseUs.map((item, index) => {
            const Icon = iconMap[item.icon];
            return (
              <Reveal key={item.title} delay={index * 90}>
                <article className="card-hover h-full rounded-2xl border border-border bg-surface p-6 sm:p-8">
                  <span className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-soft text-accent">
                    <Icon className="h-7 w-7" />
                  </span>
                  <h3 className="mb-3 text-xl font-bold text-primary">{item.title}</h3>
                  <p className="leading-relaxed text-text-secondary">{item.description}</p>
                </article>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
