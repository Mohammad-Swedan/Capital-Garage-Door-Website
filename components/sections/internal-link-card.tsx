import Link from "next/link";
import { ArrowRight, type LucideIcon } from "lucide-react";

interface InternalLinkCardProps {
  href: string;
  title: string;
  description?: string;
  icon?: LucideIcon;
}

/** Small reusable card for cross-linking related services/pages — boosts internal SEO linking. */
export function InternalLinkCard({ href, title, description, icon: Icon }: InternalLinkCardProps) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-5 transition-colors hover:border-cta/30 hover:shadow-[0_8px_32px_rgba(13,31,69,0.08)]"
    >
      {Icon && (
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
      )}
      <div className="flex-1">
        <h3 className="font-heading text-base font-semibold text-foreground group-hover:text-cta sm:text-lg">
          {title}
        </h3>
        {description && <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>}
      </div>
      <ArrowRight
        className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-cta"
        aria-hidden="true"
      />
    </Link>
  );
}
