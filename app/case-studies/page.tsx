import type { Metadata } from "next";
import { Phone, FileText } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { PageHero } from "@/components/sections/page-hero";
import { InternalLinkCard } from "@/components/sections/internal-link-card";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { getCaseStudies } from "@/lib/data/case-studies";
import { collectionPageSchema } from "@/lib/seo/schema";
import { buildMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = buildMetadata({
  title: "Garage Door Case Studies Perth | Capital Garage Door",
  description:
    "Real completed garage door repairs, motor replacements, and installations across Perth — see the problem, diagnosis, and solution for each job.",
  path: "/case-studies",
});

export default async function CaseStudiesPage() {
  const phone = siteConfig.business.phone;
  const caseStudies = await getCaseStudies();

  return (
    <>
      <JsonLd
        data={collectionPageSchema({
          name: "Garage Door Case Studies",
          description:
            "Real completed garage door repairs, motor replacements, and installations across Perth.",
          path: "/case-studies",
        })}
      />

      <Container className="pt-6">
        <Breadcrumbs items={[{ name: "Home", url: "/" }, { name: "Case Studies", url: "/case-studies" }]} />
      </Container>

      <PageHero
        eyebrow="Local Proof"
        title="Garage Door Case Studies"
        subtitle="Real jobs completed for Perth homes and businesses — see the problem, diagnosis, and solution behind each one."
        ctas={[
          { label: "Call Now", href: `tel:${phone}`, icon: <Phone className="h-4 w-4" aria-hidden="true" /> },
          { label: "Request a Quote", href: "/contact", variant: "outline", icon: <FileText className="h-4 w-4" aria-hidden="true" /> },
        ]}
      />

      <section className="bg-background py-14 sm:py-20">
        <Container>
          <Reveal>
            <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              All Case Studies
            </h2>
          </Reveal>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {caseStudies.map((caseStudy, index) => (
              <Reveal key={caseStudy.slug} delay={index * 0.05}>
                <InternalLinkCard
                  href={`/case-studies/${caseStudy.slug}`}
                  title={caseStudy.title}
                  description={caseStudy.subtitle}
                />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
