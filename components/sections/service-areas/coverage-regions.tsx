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
          <span className="cgd-eyebrow text-cta">Coverage</span>
          <h2 className="mt-3 cgd-h2 text-balance text-foreground">
            Suburbs We Service
          </h2>
        </Reveal>

        <div className="mt-10 flex flex-col gap-10">
          {regions.map((region, regionIndex) => (
            <Reveal key={region.name} delay={regionIndex * 0.05}>
              <h3 className="cgd-h3 text-lg text-brand">{region.name}</h3>
              <ul className="mt-4 grid gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {region.suburbs.map((suburb) => (
                  <li
                    key={suburb.slug}
                    className="flex items-center gap-2 rounded-xl border border-border/70 bg-surface-elevated px-4 py-3 text-sm font-medium text-foreground shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:border-brand/30"
                  >
                    <MapPin className="h-4 w-4 shrink-0 text-brand" aria-hidden="true" />
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
