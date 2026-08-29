import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

type SiteLogoProps = {
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  framed?: boolean;
};

export function SiteLogo({
  className,
  imageClassName,
  priority = false,
  framed = false,
}: SiteLogoProps) {
  const image = (
    <Image
      src="/logo.jpg"
      alt="S.Light — חשמל אלסבינר"
      width={220}
      height={72}
      priority={priority}
      className={cn(
        framed ? "h-9 w-auto object-contain sm:h-10 lg:h-11" : "h-10 w-auto object-contain sm:h-12 lg:h-14",
        imageClassName,
      )}
    />
  );

  return (
    <Link
      href="/"
      className={cn("inline-flex shrink-0 items-center transition-opacity hover:opacity-90", className)}
      aria-label="S.Light — חשמל אלסבינר, דף הבית"
    >
      {framed ? (
        <span className="inline-flex items-center rounded-xl bg-primary px-3 py-2 sm:px-3.5 sm:py-2.5">
          {image}
        </span>
      ) : (
        image
      )}
    </Link>
  );
}
