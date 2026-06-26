import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { InternalLinkCard } from "@/components/sections/internal-link-card";
import { resolveIcon } from "@/lib/icons";
import { EditableGroup } from "@/components/admin/editor/editable";
import type { ServiceRelatedLink } from "@/types/service-page";

interface ServiceRelatedLinksProps {
  heading?: string;
  links: ServiceRelatedLink[];
}

/**
 * Internal links to sibling service pages — boosts internal SEO and helps visitors
 * find the exact service they need.
 *
 * Related links are a relational pin (real FKs server-side). Because the props
 * shape flattens them to label+href (lossy for targetPageId), they are managed
 * CANONICALLY in the editor's Settings drawer rather than inline — the
 * `EditableGroup` here just labels the section while editing.
 */
export function ServiceRelatedLinks({ heading = "Related Services", links }: ServiceRelatedLinksProps) {
  return (
    <section className="bg-background py-14 sm:py-20">
      <Container>
        <EditableGroup label="Related links · edit in Settings → Links">
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
        </EditableGroup>
      </Container>
    </section>
  );
}
