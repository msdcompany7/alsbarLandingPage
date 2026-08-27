import { cn } from "@/lib/utils";

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  error?: string;
};

export function Textarea({ className, error, ...props }: TextareaProps) {
  return (
    <div>
      <textarea
        className={cn(
          "min-h-[140px] w-full resize-y rounded-lg border bg-surface px-4 py-3 text-sm text-text-primary",
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
