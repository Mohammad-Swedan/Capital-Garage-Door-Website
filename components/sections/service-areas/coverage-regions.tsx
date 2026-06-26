import { MapPin } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import type { CoverageRegion } from "@/types/coverage-area";

interface CoverageRegionsProps {
  regions: CoverageRegion[];
}

/** Suburb directory grouped by region — chips carry a `slug` ready to link once per-suburb pages exist. */
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
              <ul className="mt-4 grid gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {region.suburbs.map((suburb) => (
                  <li
                    key={suburb.slug}
                    className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium text-foreground"
                  >
                    <MapPin className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                    {suburb.name}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
