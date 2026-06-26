import { cn } from "@/lib/utils";

/**
 * Standard header for admin list/catalog screens: a heading + optional
 * description/meta on the left, and an `actions` slot (buttons) on the right.
 * Presentational and server-safe — no client hooks.
 */
export function AdminPageHeader({
  title,
  description,
  eyebrow,
  actions,
  className,
}: {
  title: string;
  description?: React.ReactNode;
  /** Optional small uppercase label above the title (e.g. section name). */
  eyebrow?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 border-b border-border/70 pb-5 sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
    >
      <div className="space-y-1.5">
        {eyebrow && (
          <p className="cgd-eyebrow text-brand">{eyebrow}</p>
        )}
        <h1 className="cgd-h2 text-foreground">{title}</h1>
        {description && (
          <p className="cgd-small text-muted-foreground">{description}</p>
        )}
      </div>
      {actions && (
        <div className="flex flex-wrap items-center gap-2">{actions}</div>
      )}
    </div>
  );
}
