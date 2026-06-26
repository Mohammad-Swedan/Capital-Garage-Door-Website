import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { InternalLinkCard } from "@/components/sections/internal-link-card";
import { resolveIcon } from "@/lib/icons";
import { EditableGroup } from "@/components/admin/editor/editable";
import type { CostGuideRelatedLink } from "@/types/cost-guide";

interface CostGuideRelatedLinksProps {
  heading?: string;
  links: CostGuideRelatedLink[];
}

/**
 * Internal links to relevant services — boosts internal SEO and gives visitors a next step beyond just requesting a quote.
 *
 * Related links are a relational pin (real FKs server-side) managed CANONICALLY
 * in the editor's Settings drawer rather than inline — the `EditableGroup` here
 * just labels the section while editing. Renders byte-identically on the public site.
 */
export function CostGuideRelatedLinks({ heading = "Related Services", links }: CostGuideRelatedLinksProps) {
  return (
    <section className="bg-background py-14 sm:py-20">
      <Container>
        <EditableGroup label="Related links · edit in Settings → Links">
          <Reveal>
            <span className="cgd-eyebrow text-cta">Explore More</span>
            <h2 className="mt-3 cgd-h2 text-balance text-foreground">
              {heading}
            </h2>
          </Reveal>
          <div className="mt-9 grid gap-4 sm:grid-cols-2">
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
        </EditableGroup>
      </Container>
    </section>
  );
}
