import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  actionHref?: string;
  actionLabel?: string;
  align?: "start" | "center";
  className?: string;
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  actionHref,
  actionLabel,
  align = "start",
  className,
}: SectionHeaderProps) {
  const centered = align === "center";

  return (
    <Reveal
      className={cn(
        "mb-10 md:mb-12",
        centered && "mx-auto max-w-2xl text-center",
        className,
      )}
    >
      <div
        className={cn(
          "flex flex-col gap-4",
          !centered && "sm:flex-row sm:items-end sm:justify-between",
        )}
      >
        <div className={cn(centered && "mx-auto")}>
          {eyebrow && <p className="eyebrow mb-2">{eyebrow}</p>}
          <h2 className="heading-section">{title}</h2>
          {description && (
            <p className={cn("lead mt-3", !centered && "max-w-xl")}>{description}</p>
          )}
        </div>

        {actionHref && actionLabel && !centered && (
          <Link
            href={actionHref}
            className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-accent"
          >
            {actionLabel}
            <ArrowLeft className="h-4 w-4 transition-transform hover:-translate-x-0.5" />
          </Link>
        )}
      </div>

      {actionHref && actionLabel && centered && (
        <Link
          href={actionHref}
          className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-accent"
        >
          {actionLabel}
          <ArrowLeft className="h-4 w-4" />
        </Link>
      )}
    </Reveal>
  );
}
