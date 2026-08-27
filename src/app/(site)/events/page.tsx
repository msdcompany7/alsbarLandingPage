import type { Metadata } from "next";
import { CalendarDays, MapPin } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Container } from "@/components/ui/container";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "אירועים",
  description: `אירועים, ירידים וסדנאות של ${siteConfig.brandNameHe} — ${siteConfig.name}.`,
};

function formatEventDate(date: string) {
  return new Intl.DateTimeFormat("he-IL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${date}T12:00:00`));
}

export default function EventsPage() {
  const events = [...siteConfig.events].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

  return (
    <section className="section-padding bg-surface-alt">
      <Container>
        <Breadcrumbs
          items={[
            { label: "בית", href: "/" },
            { label: "אירועים" },
          ]}
          className="mb-6"
        />

        <div className="mb-10 max-w-2xl">
          <h1 className="text-3xl font-bold text-primary md:text-4xl">אירועים</h1>
          <p className="mt-3 text-text-secondary">
            ירידים, סדנאות ומפגשי לקוחות — הישארו מעודכנים בפעילות {siteConfig.brandNameHe}.
          </p>
        </div>

        <ul className="grid gap-6 lg:grid-cols-2">
          {events.map((event) => (
            <li
              key={`${event.title}-${event.date}`}
              className="rounded-xl border border-border bg-surface p-6 shadow-sm md:p-8"
            >
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
                <CalendarDays className="h-3.5 w-3.5" />
                {formatEventDate(event.date)}
              </div>
              <h2 className="text-xl font-bold text-primary">{event.title}</h2>
              <p className="mt-3 flex items-start gap-2 text-sm text-text-secondary">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                {event.location}
              </p>
              <p className="mt-4 leading-relaxed text-text-secondary">{event.description}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
