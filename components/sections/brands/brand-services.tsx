import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/page/section-heading";
import { resolvePageIcon } from "@/components/page/icons";
import type { BrandEntity, BrandServiceCard } from "@/types/brand";

interface BrandServicesProps {
  entity: BrandEntity;
  services: BrandServiceCard[];
}

/**
 * The four things we actually do for owners of this brand, each linking to the money page that
 * covers it — this is the brand page's main outbound internal-link surface.
 */
export function BrandServices({ entity, services }: BrandServicesProps) {
  if (services.length === 0) return null;

  return (
    <section className="bg-muted/40">
      <Container className="py-12 sm:py-16">
        <SectionHeading
          eyebrow="What we do"
          title={`What we do for ${entity.name} owners in Perth`}
        />
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service, i) => {
            const Icon = resolvePageIcon(service.icon);
            return (
              <Reveal key={service.title} delay={0.05 * i} className="h-full">
                <Link
                  href={service.href}
                  className="group flex h-full flex-col gap-3 rounded-2xl border border-border bg-card p-6 shadow-sm ring-1 ring-foreground/5 transition-all hover:-translate-y-0.5 hover:border-[#0f4e9b]/30 hover:shadow-[0_14px_30px_rgba(13,31,69,0.1)]"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="font-heading text-lg font-bold text-foreground group-hover:text-[#0f4e9b]">
                    {service.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {service.description}
                  </p>
                  <span className="mt-auto inline-flex items-center gap-1.5 pt-2 text-sm font-semibold text-[#0f4e9b]">
                    Learn more
                    <ArrowRight
                      className="h-4 w-4 transition-transform group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
