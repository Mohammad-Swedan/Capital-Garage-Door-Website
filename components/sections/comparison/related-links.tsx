import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { InternalLinkCard } from "@/components/sections/internal-link-card";
import { resolveIcon } from "@/lib/icons";
import type { ComparisonRelatedLink } from "@/types/comparison-page";

interface ComparisonRelatedLinksProps {
  heading?: string;
  links: ComparisonRelatedLink[];
}

/** Internal links to relevant services — boosts internal SEO and helps visitors act on the comparison they just read. */
export function ComparisonRelatedLinks({ heading = "Related Services", links }: ComparisonRelatedLinksProps) {
  return (
    <section className="bg-background py-14 sm:py-20">
      <Container>
        <Reveal>
          <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {heading}
          </h2>
        </Reveal>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {links.map((link, index) => (
            <Reveal key={link.href} delay={index * 0.05}>
              <InternalLinkCard
                href={link.href}
                title={link.name}
                description={link.description}
                icon={resolveIcon(link.icon)}
              />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
