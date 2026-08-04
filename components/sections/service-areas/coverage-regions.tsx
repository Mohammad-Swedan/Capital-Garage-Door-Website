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
        </Reveal>

        <div className="mt-10 flex flex-col gap-10">
          {regions.map((region, regionIndex) => (
            <Reveal key={region.name} delay={regionIndex * 0.05}>
              <h3 className="font-heading text-lg font-semibold text-primary">{region.name}</h3>
              {REGION_INTROS[region.name] && (
                <p className="mt-1.5 max-w-3xl text-sm leading-relaxed text-muted-foreground">
                  {REGION_INTROS[region.name]}
                </p>
              )}
              <ul className="mt-4 grid gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {region.suburbs.map((suburb) =>
                  suburb.href ? (
                    <li key={suburb.slug}>
                      <Link
                        href={suburb.href}
                        className={cn(
                          CHIP_BASE,
                          "group transition-colors hover:border-cta/40 hover:text-cta focus-visible:ring-2 focus-visible:ring-cta focus-visible:outline-none",
                        )}
                      >
                        <MapPin className="h-4 w-4 shrink-0 text-primary transition-colors group-hover:text-cta" aria-hidden="true" />
                        <span className="flex-1">{suburb.name}</span>
                        <ArrowUpRight
                          className="h-3.5 w-3.5 shrink-0 text-muted-foreground/50 transition-all group-hover:translate-x-0.5 group-hover:text-cta"
                          aria-hidden="true"
                        />
                      </Link>
                    </li>
                  ) : (
                    <li key={suburb.slug} className={CHIP_BASE}>
                      <MapPin className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                      {suburb.name}
                    </li>
                  ),
                )}
              </ul>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
