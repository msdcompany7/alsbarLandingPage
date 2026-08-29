import { cn } from "@/lib/utils";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  error?: string;
};

export function Input({ className, error, ...props }: InputProps) {
  return (
    <div>
      <input
        className={cn(
          "w-full rounded-xl border bg-surface px-4 py-3 text-sm text-text-primary transition-colors",
          "placeholder:text-text-secondary/80",
          "focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20",
          error ? "border-danger" : "border-border",
          className,
        )}
        {...props}
      />
      {error && <p className="mt-1.5 text-sm text-danger">{error}</p>}
    </div>
  );
}
