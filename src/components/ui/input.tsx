import { cn } from "@/lib/utils";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  error?: string;
};

export function Input({ className, error, ...props }: InputProps) {
  return (
    <div>
      <input
        className={cn(
          "w-full rounded-lg border bg-surface px-4 py-3 text-sm text-text-primary",
          "placeholder:text-text-secondary",
          "focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20",
          error ? "border-danger" : "border-border",
          className,
        )}
        {...props}
      />
      {error && <p className="mt-1.5 text-sm text-danger">{error}</p>}
    </div>
  );
}
