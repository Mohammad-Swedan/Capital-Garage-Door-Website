import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { InternalLinkCard } from "@/components/sections/internal-link-card";
import { resolveIcon } from "@/lib/icons";
import { EditableGroup } from "@/components/admin/editor/editable";
import type { ArticleServiceLink } from "@/types/article";

interface RelatedServicesCtaProps {
  heading?: string;
  services: ArticleServiceLink[];
}

/** Internal links from an article to relevant service pages — converts educational traffic into service leads. */
export function RelatedServicesCta({ heading = "Need a Hand With This?", services }: RelatedServicesCtaProps) {
  return (
    <section className="bg-muted/30 py-14 sm:py-20">
      <Container>
        <EditableGroup label="Related services · edit in Settings → Links">
        <Reveal>
          <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{heading}</h2>
        </Reveal>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <Reveal key={service.href} delay={index * 0.05}>
              <InternalLinkCard
                href={service.href}
                title={service.label}
                description={service.description}
                icon={service.icon ? resolveIcon(service.icon) : undefined}
              />
            </Reveal>
          ))}
        </div>
        </EditableGroup>
      </Container>
    </section>
  );
}
