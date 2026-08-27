import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/page/section-heading";
import type { BrandEntity, BrandModel } from "@/types/brand";

interface BrandModelsProps {
  entity: BrandEntity;
  models: BrandModel[];
}

/**
 * The model names a Perth owner is likely to find on their own label, so the page answers
 * "which one have I got?" before the visitor has to call. Renders nothing when a brand page
 * carries no verified model list — an unresearched brand shows no section rather than a guess.
 */
export function BrandModels({ entity, models }: BrandModelsProps) {
  if (models.length === 0) return null;

  return (
    <section className="bg-background">
      <Container className="py-12 sm:py-16">
        <SectionHeading
          eyebrow="Model range"
          title={`${entity.name} models we see in Perth`}
          description="Names to look for on the label — we work on all of them."
        />
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {models.map((model, i) => (
            <Reveal key={model.name} delay={0.05 * i} className="h-full">
              <article className="flex h-full flex-col gap-3 rounded-2xl border border-border bg-card p-6 shadow-sm ring-1 ring-foreground/5">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-2">
                  <h3 className="font-heading text-lg font-bold text-foreground">{model.name}</h3>
                  <span className="rounded-full bg-[#0f4e9b]/8 px-2.5 py-1 text-[11px] font-bold tracking-wide text-[#0f4e9b] uppercase">
                    {model.type}
                  </span>
                </div>
                {model.tech && (
                  <p className="font-mono text-xs tracking-tight text-muted-foreground">
                    {model.tech}
                  </p>
                )}
                <p className="text-sm leading-relaxed text-muted-foreground">{model.note}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
