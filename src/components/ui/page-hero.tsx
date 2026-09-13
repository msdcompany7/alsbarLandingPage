import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type PageHeroProps = {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  className?: string;
};

export function PageHero({ title, description, breadcrumbs, className }: PageHeroProps) {
  return (
    <section className={cn("border-b border-border bg-surface-alt/80 bg-grid-light", className)}>
      <Container className="section-padding-sm">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <Breadcrumbs items={breadcrumbs} className="mb-5" />
        )}
        <Reveal>
          <h1 className="heading-page">{title}</h1>
          {description && <p className="lead mt-4 max-w-2xl">{description}</p>}
        </Reveal>
      </Container>
    </section>
  );
}
