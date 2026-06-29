import type { Metadata } from "next";
import { Phone, FileText } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { PageHero } from "@/components/sections/page-hero";
import { ServiceCard } from "@/components/sections/service-card";
import { FAQSection } from "@/components/sections/faq-section";
import { CTASection } from "@/components/sections/cta-section";
import { StickyMobileCta } from "@/components/layout/sticky-mobile-cta";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { getServicePages } from "@/lib/data/service-pages";
import {
  collectionPageSchema,
  servicesItemListSchema,
  faqSchema,
} from "@/lib/seo/schema";
import { buildMetadata } from "@/lib/seo/metadata";
import type { FAQ } from "@/types";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = buildMetadata({
  title: "Garage Door Services Perth | Repairs, Installation & Servicing",
  description:
    "Explore Capital Garage Door's full range of garage door services across Perth — repairs, new door installation, spring repair, opener repair, emergency call-outs, and maintenance. Local technicians, upfront quotes.",
  path: "/services",
});

const SERVICES_FAQS: FAQ[] = [
  {
    question: "What garage door services do you offer in Perth?",
    answer:
      "We cover the full range: garage door repairs, new door installation, broken spring replacement, opener and motor repair, 24/7 emergency call-outs, and preventive maintenance — for both homes and businesses across the Perth metro area.",
  },
  {
    question: "Do you service both residential and commercial garage doors?",
    answer:
      "Yes. Our technicians work on residential sectional, roller, and tilt doors as well as higher-use commercial garage and roller doors across Perth.",
  },
  {
    question: "How quickly can you come out?",
    answer:
      "Same-day service is available across most of Perth for repairs, and urgent, security-critical jobs are prioritised with after-hours emergency response.",
  },
  {
    question: "Will I get a quote before any work begins?",
    answer:
      "Always. We inspect the door first and give you a clear, upfront quote before starting — no surprises on the day.",
  },
  {
    question: "Do you work on all garage door and opener brands?",
    answer:
      "Yes, our technicians service all major garage door and opener brands, including chain, belt, and direct-drive motor systems.",
  },
];

export default async function ServicesPage() {
  const phone = siteConfig.business.phone;
  const servicePages = await getServicePages();

  return (
    <>
      <JsonLd
        data={collectionPageSchema({
          name: "Garage Door Services Perth",
          description:
            "The full range of garage door services across Perth — repairs, installation, spring repair, opener repair, emergency response, and maintenance.",
          path: "/services",
        })}
      />
      <JsonLd
        data={servicesItemListSchema(
          servicePages.map((p) => ({
            name: p.serviceName,
            url: `/${p.slug}`,
            image: p.hero.image,
          })),
          "/services",
        )}
      />
      <JsonLd data={faqSchema(SERVICES_FAQS)} />

      <Container className="pt-6">
        <Breadcrumbs items={[{ name: "Home", url: "/" }, { name: "Services", url: "/services" }]} />
      </Container>

      <PageHero
        eyebrow="Perth-Wide Coverage"
        title="Garage Door Services in Perth"
        subtitle="From everyday repairs to full installations, Capital Garage Door covers the complete range of residential and commercial garage door services across Perth — with local technicians, same-day options, and upfront quotes."
        ctas={[
          { label: "Call Now", href: `tel:${phone}`, icon: <Phone className="h-4 w-4" aria-hidden="true" /> },
          { label: "Request a Quote", href: "/contact", variant: "outline", icon: <FileText className="h-4 w-4" aria-hidden="true" /> },
        ]}
      />

      <section className="bg-background pt-12 sm:pt-16">
        <Container>
          <Reveal>
            <p className="max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Whatever your garage door needs — a fast repair, a new door, a broken spring, an opener
              fault, or just a tune-up to keep it running smoothly — our licensed Perth technicians
              handle it all. Pick a service below to see what&apos;s involved, typical costs, and the
              answers to common questions.
            </p>
          </Reveal>
        </Container>
      </section>

      <section className="bg-background py-12 sm:py-16">
        <Container>
          <Reveal>
            <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              All Garage Door Services
            </h2>
          </Reveal>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {servicePages.map((page, index) => (
              <Reveal key={page.slug} delay={index * 0.05} className="h-full">
                <ServiceCard page={page} />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <FAQSection faqs={SERVICES_FAQS} heading="Garage Door Services — FAQs" />

      <CTASection
        heading="Not Sure Which Service You Need?"
        body="Tell us what your garage door is doing and our local Perth team will point you in the right direction — and give you a clear quote."
        buttons={[
          { label: "Call Now", href: `tel:${phone}`, icon: <Phone className="h-4 w-4" aria-hidden="true" /> },
          { label: "Request a Quote", href: "/contact", variant: "outline", icon: <FileText className="h-4 w-4" aria-hidden="true" /> },
        ]}
      />

      <StickyMobileCta />
    </>
  );
}
