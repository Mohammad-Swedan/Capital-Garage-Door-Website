import Link from "next/link";
import { Calculator, ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { ctaPrimaryClass } from "@/components/page/cta-buttons";
import { NAV_MENUS, type NavMenuLink } from "@/config/nav-menus";
import { COST_GUIDE_LINKS, PRICE_LIST_LINK } from "@/lib/pricing/guide-links";
import { cn } from "@/lib/utils";

/** The price list, then every cost guide. */
const PRICE_LINKS: NavMenuLink[] = [PRICE_LIST_LINK, ...Object.values(COST_GUIDE_LINKS)];
/** The Doors mega-menu's "Door types" column: plain page links (the brand tiles live apart). */
const DOOR_TYPES = NAV_MENUS.doors.columns[0];

/**
 * Compact "try the smart calculator" band — replaces the long price-table section.
 * A plain server component (no client JS): the button links to the real `/calculator`
 * route, which also adds the home → /calculator internal link for SEO.
 *
 * Underneath, a server-rendered text-link nav puts the price list, every cost guide and every
 * door-type page one crawlable hop from the home page (the most-crawled page). Plain text links,
 * `prefetch={false}` so they add nothing to the home page's load.
 */
export function CalculatorCta() {
  return (
    <section className="bg-background py-12 sm:py-16">
      <Container>
        <div className="relative overflow-hidden rounded-3xl border border-primary/10 bg-primary/5 px-6 py-8 sm:px-10 sm:py-10">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl"
          />
          <div className="relative flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
            <div className="flex items-start gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Calculator className="h-6 w-6" aria-hidden="true" />
              </span>
              <div>
                <h2 className="font-display text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                  Garage door repair, motor &amp; spring replacement costs in Perth
                </h2>
                <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                  See what a repair, new motor or spring replacement typically costs — get a
                  personalised price range for your exact door in under a minute with our smart
                  calculator, built on real Perth pricing. Prefer to read first? See our{" "}
                  <Link
                    href={PRICE_LIST_LINK.href}
                    className="font-semibold text-primary underline underline-offset-2 hover:text-primary/80"
                  >
                    full Perth garage door price list
                  </Link>
                  .
                </p>
              </div>
            </div>
            <Link href="/calculator" className={cn(ctaPrimaryClass, "shrink-0")}>
              Try the calculator
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <nav
            aria-label="Garage door prices and door types"
            className="relative mt-7 grid gap-6 border-t border-primary/10 pt-6 sm:grid-cols-2 sm:gap-10"
          >
            <LinkGroup id="calculator-cta-prices" title="Prices & cost guides" links={PRICE_LINKS} />
            <LinkGroup id="calculator-cta-door-types" title={DOOR_TYPES.title} links={DOOR_TYPES.links} />
          </nav>
        </div>
      </Container>
    </section>
  );
}

/** A small uppercase label (a `<p>`, not a heading — nav labels stay out of the outline) + links. */
function LinkGroup({ id, title, links }: { id: string; title: string; links: NavMenuLink[] }) {
  return (
    <div>
      <p id={id} className="font-heading text-[11px] font-bold tracking-[0.14em] text-muted-foreground uppercase">
        {title}
      </p>
      <ul aria-labelledby={id} className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1.5 text-sm">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              prefetch={false}
              className="text-muted-foreground underline decoration-muted-foreground/30 underline-offset-4 transition-colors hover:text-primary hover:decoration-primary"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
