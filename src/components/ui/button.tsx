import Link from "next/link";
import { cn } from "@/lib/utils";

const variants = {
  primary:
    "bg-accent text-white shadow-sm hover:bg-accent-hover hover:-translate-y-0.5 hover:shadow-md focus-visible:ring-accent",
  secondary:
    "bg-white/10 border-2 border-white/70 text-white backdrop-blur-sm hover:bg-white/15 focus-visible:ring-white",
  navy:
    "bg-primary text-white shadow-sm hover:bg-primary-light hover:-translate-y-0.5 hover:shadow-md focus-visible:ring-primary",
  ghost:
    "bg-transparent text-primary hover:bg-surface-alt focus-visible:ring-primary",
  outline:
    "bg-transparent border border-border text-text-primary hover:border-primary/30 hover:bg-surface-alt focus-visible:ring-primary",
} as const;

type ButtonProps = {
  href?: string;
  variant?: keyof typeof variants;
  size?: "sm" | "md" | "lg";
  className?: string;
  children: React.ReactNode;
  external?: boolean;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
};

export function Button({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
  external,
  onClick,
  type = "button",
  disabled,
}: ButtonProps) {
  const sizes = {
    sm: "min-h-10 px-4 py-2 text-sm",
    md: "min-h-11 px-6 py-3 text-[15px]",
    lg: "min-h-12 px-7 py-3.5 text-base sm:min-h-[3.25rem] sm:px-8 sm:py-4",
  };

  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-200",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-50",
    variants[variant],
    sizes[size],
    className,
  );

  if (href) {
    if (external) {
      return (
        <a
          href={href}
          className={classes}
          target="_blank"
          rel="noopener noreferrer"
        >
          {children}
        </a>
      );
    }

    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={classes} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}
