import Link from "next/link";
import { cn } from "@/lib/utils";

const variants = {
  primary:
    "bg-accent text-white hover:bg-accent-hover focus-visible:ring-accent",
  secondary:
    "bg-transparent border-2 border-white/80 text-white hover:bg-white/10 focus-visible:ring-white",
  navy: "bg-primary text-white hover:bg-primary-light focus-visible:ring-primary",
  ghost:
    "bg-transparent text-primary hover:bg-surface-alt focus-visible:ring-primary",
  outline:
    "bg-transparent border border-border text-text-primary hover:bg-surface-alt focus-visible:ring-primary",
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
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-[15px]",
    lg: "px-8 py-4 text-base",
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
