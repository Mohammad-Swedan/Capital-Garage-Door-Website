import Link from "next/link";
import { MapPin, ArrowUpRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";
import type { CoverageRegion } from "@/types/coverage-area";

interface CoverageRegionsProps {
  regions: CoverageRegion[];
}

const CHIP_BASE = "flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium text-foreground";

/**
 * One corridor sentence per CMS region, keyed by the region's exact name. These carry the
 * corridor keywords GSC shows this page already ranking for ("garage door repairs perth
 * northern suburbs" pos ~10, "southern suburbs", "east perth") — every suburb named here is
 * confirmed present in that region's CMS suburb list; don't invent localities. A region the
 * map doesn't know simply renders without an intro.
 */
const REGION_INTROS: Record<string, string> = {
  "Inner Perth":
    "Garage door repairs in and around the city — East Perth, Victoria Park, South Perth, Bayswater and the inner ring, usually our shortest travel times of all.",
  "Northern Suburbs":
    "Same-day garage door repairs across Perth's northern suburbs — Joondalup, Wanneroo, Morley, Ellenbrook and the whole northern corridor.",
  "Southern Suburbs":
    "Our busiest corridor: garage door repairs in Perth's southern suburbs — Canning Vale, Thornlie, Gosnells, Baldivis, Rockingham, down to Mandurah.",
  "Coastal Suburbs":
    "Fremantle, Success, Atwell, Scarborough and the coastal strip — where salt air is hard on springs and hardware, so doors here see us often.",
  "Western Suburbs":
    "Nedlands, Claremont, Cottesloe, Mosman Park and the western suburbs — repairs, motor upgrades and new door installations.",
  "Northern Coastal":
    "Clarkson, Butler, Mullaloo, Sorrento and the beachside suburbs north of Hillarys, right up the northern coastal corridor.",
  "Swan Valley & North-East":
    "Aveley, Brabham, Dayton, The Vines and the Swan Valley growth belt — plenty of newer homes with builder-grade doors coming due for service.",
  "Eastern Suburbs & Hills":
    "Midland, Swan View, Greenmount and up into the Perth Hills — the eastern suburbs are covered on daily runs.",
};

/**
 * Suburb directory grouped by region. Suburbs with a dedicated page (CMS `href`)
 * render as links to their local-SEO page; the rest are plain coverage chips.
 */
export function CoverageRegions({ regions }: CoverageRegionsProps) {
  return (
    <section className="bg-background py-14 sm:py-20">
      <Container>
        <Reveal>
          <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Suburbs We Service
          </h2>
          {/* Legend: linked chips are visually distinct (blue, arrow button) — say so once so the
              affordance is learned before the first region, not discovered by accident. */}
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            <span className="mr-1 inline-flex translate-y-[3px] items-center gap-1 rounded-lg border border-[#0f4e9b]/30 bg-[#0f4e9b]/6 px-2 py-0.5 text-xs font-semibold text-primary">
              <MapPin className="h-3 w-3" aria-hidden="true" />
              Blue suburbs
              <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
            </span>{" "}
            have their own local page — tap one for guide prices, local FAQs and recent jobs nearby. Every
            other suburb listed is fully covered too.
          </p>
        </Reveal>

        <div className="mt-10 flex flex-col gap-10">
          {regions.map((region, regionIndex) => {
            // Linked suburbs first: they're the pages worth discovering, and grouping them keeps
            // the "blue = tappable" pattern scannable instead of scattered through the grid.
            const ordered = [
              ...region.suburbs.filter((s) => s.href),
              ...region.suburbs.filter((s) => !s.href),
            ];
            return (
              <Reveal key={region.name} delay={regionIndex * 0.05}>
                <h3 className="font-heading text-lg font-semibold text-primary">{region.name}</h3>
                {REGION_INTROS[region.name] && (
                  <p className="mt-1.5 max-w-3xl text-sm leading-relaxed text-muted-foreground">
                    {REGION_INTROS[region.name]}
                  </p>
                )}
                <ul className="mt-4 grid gap-3 sm:grid-cols-3 lg:grid-cols-4">
                  {ordered.map((suburb) =>
                    suburb.href ? (
                      <li key={suburb.slug}>
                        <Link
                          href={suburb.href}
                          aria-label={`${suburb.name} — view the local garage door page`}
                          className={cn(
                            "group flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold",
                            "border border-[#0f4e9b]/30 bg-[#0f4e9b]/6 text-primary shadow-xs",
                            "transition-all duration-150 hover:-translate-y-0.5 hover:border-[#0f4e9b]/55 hover:bg-[#0f4e9b]/10 hover:shadow-md",
                            "focus-visible:ring-2 focus-visible:ring-cta focus-visible:outline-none",
                          )}
                        >
                          <MapPin className="h-4 w-4 shrink-0 text-[#0f4e9b]" aria-hidden="true" />
                          <span className="flex-1 underline-offset-2 group-hover:underline">{suburb.name}</span>
                          <span
                            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#0f4e9b]/12 text-[#0f4e9b] transition-colors group-hover:bg-cta group-hover:text-cta-foreground"
                            aria-hidden="true"
                          >
                            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-px group-hover:-translate-y-px" />
                          </span>
                        </Link>
                      </li>
                    ) : (
                      <li key={suburb.slug} className={cn(CHIP_BASE, "text-muted-foreground")}>
                        <MapPin className="h-4 w-4 shrink-0 text-muted-foreground/60" aria-hidden="true" />
                        {suburb.name}
                      </li>
                    ),
                  )}
                </ul>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
