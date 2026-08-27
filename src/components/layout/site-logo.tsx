import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

type SiteLogoProps = {
  className?: string;
  imageClassName?: string;
  priority?: boolean;
};

export function SiteLogo({ className, imageClassName, priority = false }: SiteLogoProps) {
  return (
    <Link
      href="/"
      className={cn("inline-flex shrink-0 items-center transition-opacity hover:opacity-90", className)}
      aria-label="S.Light — חשמל אלסבינר, דף הבית"
    >
      <Image
        src="/logo.jpg"
        alt="S.Light — חשמל אלסבינר"
        width={220}
        height={72}
        priority={priority}
        className={cn("h-10 w-auto object-contain sm:h-12 lg:h-14", imageClassName)}
      />
    </Link>
  );
}
