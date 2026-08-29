import { cn } from "@/lib/utils";

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  error?: string;
};

export function Textarea({ className, error, ...props }: TextareaProps) {
  return (
    <div>
      <textarea
        className={cn(
          "min-h-[140px] w-full resize-y rounded-xl border bg-surface px-4 py-3 text-sm text-text-primary transition-colors",
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
