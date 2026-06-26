import type { Metadata } from "next";
import { Phone, FileText } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { PageHero } from "@/components/sections/page-hero";
import { InternalLinkCard } from "@/components/sections/internal-link-card";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { getProblems } from "@/lib/data/problems";
import { collectionPageSchema } from "@/lib/seo/schema";
import { buildMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = buildMetadata({
  title: "Common Garage Door Problems | Capital Garage Door",
  description:
    "Browse common garage door problems — won't open, won't close, stuck, noisy, or off-track — with causes, safe checks, and when to call a technician.",
  path: "/problems",
});

export default async function ProblemsPage() {
  const phone = siteConfig.business.phone;
  const problems = await getProblems();

  return (
    <>
      <JsonLd
        data={collectionPageSchema({
          name: "Common Garage Door Problems",
          description:
            "Browse common garage door problems — causes, safe checks, and when to call a technician.",
          path: "/problems",
        })}
      />

      <Container className="pt-6">
        <Breadcrumbs items={[{ name: "Home", url: "/" }, { name: "Problems", url: "/problems" }]} />
      </Container>

      <PageHero
        eyebrow="Troubleshooting"
        title="Common Garage Door Problems"
        subtitle="Not sure what's wrong with your garage door? Find your issue below for likely causes, safe checks, and signs it's time to call a technician."
        ctas={[
          { label: "Call Now", href: `tel:${phone}`, icon: <Phone className="h-4 w-4" aria-hidden="true" /> },
          { label: "Request a Quote", href: "/contact", variant: "outline", icon: <FileText className="h-4 w-4" aria-hidden="true" /> },
        ]}
      />

      <section className="bg-background py-14 sm:py-20">
        <Container>
          <Reveal>
            <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              All Problems
            </h2>
          </Reveal>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {problems.map((problem, index) => (
              <Reveal key={problem.slug} delay={index * 0.05}>
                <InternalLinkCard
                  href={`/problems/${problem.slug}`}
                  title={problem.name}
                  description={problem.directAnswer}
                />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
