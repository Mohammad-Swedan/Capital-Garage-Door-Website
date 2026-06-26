import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { InternalLinkCard } from "@/components/sections/internal-link-card";
import { getServices } from "@/lib/data/services";
import { resolveIcon } from "@/lib/icons";
import type { ProblemRelatedService } from "@/types";

interface RelatedServicesProps {
  heading?: string;
  services: ProblemRelatedService[];
}

/** Grid of internal links to relevant services — resolves icon/description from the services content layer when the slug matches. */
export async function RelatedServices({ heading = "Recommended Services", services }: RelatedServicesProps) {
  const allServices = await getServices();

  return (
    <section className="bg-background py-14 sm:py-20">
      <Container>
        <Reveal>
          <span className="cgd-eyebrow text-cta">Explore More</span>
          <h2 className="mt-3 cgd-h2 text-balance text-foreground">
            {heading}
          </h2>
        </Reveal>
        <div className="mt-9 grid gap-4 sm:grid-cols-2">
          {services.map((service, index) => {
            const match = allServices.find((s) => s.slug === service.slug);
            return (
              <Reveal key={service.slug} delay={index * 0.05}>
                <InternalLinkCard
                  href={match?.canonicalHref ?? "/services"}
                  title={service.label}
                  description={match?.shortDescription}
                  icon={match ? resolveIcon(match.icon) : undefined}
                />
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
