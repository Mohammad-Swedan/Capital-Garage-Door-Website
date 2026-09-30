import Link from "next/link";
import type { GuideLink } from "@/lib/pricing/guide-links";
import { cn } from "@/lib/utils";

interface PriceGuideLinksProps {
  links: GuideLink[];
  /** Label before the links. Pass "" when the sentence above already introduces them. */
  lead?: string;
  className?: string;
}

/**
 * A short row of internal links into the pricing content (the /cost-guides price list and the
 * cost guides), rendered under price tables so every page that shows a price links the pages
 * that rank for prices. Build the list with `priceLinksFor` / `siblingGuideLinks`
 * (lib/pricing/guide-links.ts).
 *
 * No hooks and no server-only imports: it renders inside server templates AND inside the admin
 * editor's client-side canvas. `prefetch={false}` keeps these below-the-fold links from queuing
 * route prefetches on load (the footer follows the same rule). Renders nothing for an empty list.
 */
export function PriceGuideLinks({ links, lead = "More on pricing:", className }: PriceGuideLinksProps) {
  if (links.length === 0) return null;

  return (
    <p className={cn("mt-4 flex flex-wrap items-baseline gap-x-4 gap-y-2 text-sm", className)}>
      {lead ? <span className="text-muted-foreground">{lead}</span> : null}
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          prefetch={false}
          className="font-medium text-primary underline underline-offset-4 transition-colors hover:text-cta"
        >
          {link.label}
        </Link>
      ))}
    </p>
  );
}
