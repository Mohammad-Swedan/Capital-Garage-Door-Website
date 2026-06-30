import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Phone, FileText, Target, ShieldCheck, ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { PageHero } from "@/components/sections/page-hero";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { CTASection } from "@/components/sections/cta-section";
import { TrustCards } from "@/components/page/trust-cards";
import { JsonLd } from "@/components/seo/json-ld";
import { BrandsMarquee, BRANDS } from "@/components/sections/brands-marquee";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, organizationSchema, aboutPageSchema } from "@/lib/seo/schema";
import { siteConfig } from "@/config/site";
import type { TrustReason } from "@/types";

const AboutSection = dynamic(() => import("@/components/sections/about").then((m) => m.AboutSection));
const WhyChooseUs = dynamic(() => import("@/components/sections/why-choose-us").then((m) => m.WhyChooseUs));

const SYSTEM_FEATURES: TrustReason[] = [
  {
    title: "Online Bookings",
    description: "Book a technician in a couple of minutes — no back-and-forth phone tag to find a time.",
    icon: "CalendarCheck",
  },
  {
    title: "Clear, Fast Quotes",
    description: "Upload a photo and get a clear estimate before we arrive, so there are no surprises on the day.",
    icon: "FileText",
  },
  {
    title: "Warranty Registration",
    description: "Every job is logged against your property, so your workmanship and parts warranty is on record.",
    icon: "ShieldCheck",
  },
  {
    title: "Service Reminders",
    description: "We'll remind you when your door is due for a check-up, so small issues don't become big repairs.",
    icon: "Bell",
  },
  {
    title: "After-Service Support",
    description: "Got a question after we've left? Our team is a phone call away for warranty or follow-up support.",
    icon: "LifeBuoy",
  },
];

export const metadata: Metadata = buildMetadata({
  title: "About Us | Capital Garage Door",
  description:
    "Perth's local garage door repair, installation & maintenance team — licensed, insured, and an authorized dealer for B&D, Steel-Line, Gliderol, Avanti and more.",
  path: "/about",
});

export default function AboutPage() {
  const phone = siteConfig.business.phone;
  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "About", url: "/about" },
  ];

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(breadcrumbs),
          organizationSchema(),
          aboutPageSchema(BRANDS.map((b) => b.name)),
        ]}
      />

      <Container className="pt-6">
        <Breadcrumbs items={breadcrumbs} />
      </Container>

      <PageHero
        eyebrow="Who We Are"
        title="About Capital Garage Door"
        subtitle="Perth's trusted local team for garage door repairs, installations, and maintenance — licensed, insured, and built on honest pricing."
        ctas={[
          { label: "Call Now", href: `tel:${phone}`, icon: <Phone className="h-4 w-4" aria-hidden="true" /> },
          { label: "Request a Quote", href: "/contact", variant: "outline", icon: <FileText className="h-4 w-4" aria-hidden="true" /> },
        ]}
      />

      <AboutSection />

      <BrandsMarquee />

      <section className="bg-muted/40 py-14 sm:py-20">
        <Container className="max-w-2xl text-center">
          <Reveal className="flex flex-col items-center gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Target className="h-6 w-6" aria-hidden="true" />
            </span>
            <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Our Mission
            </h2>
            <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
              To make garage door repair and installation reliable, transparent, and stress-free for every Perth
              homeowner — backed by professional technicians, honest pricing, and technology that keeps you
              informed every step of the way.
            </p>
          </Reveal>
        </Container>
      </section>

      <WhyChooseUs />

      <TrustCards
        eyebrow="Built for Better Service"
        title="How Our System Supports You"
        description="Beyond the toolbox — the systems we use to make booking, tracking, and trusting your service simple."
        reasons={SYSTEM_FEATURES}
      />

      <Container className="pb-4">
        <Link
          href="/warranty-registration"
          className="mx-auto flex max-w-2xl items-center justify-center gap-2 rounded-2xl border border-border bg-muted/40 px-5 py-4 text-center text-sm font-medium text-foreground transition-colors hover:border-primary/30 hover:bg-muted/70"
        >
          <ShieldCheck className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
          Already had a motor installed? Register or check your warranty
          <ArrowRight className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
        </Link>
      </Container>

      <CTASection
        heading="Ready to Work With a Local Team You Can Trust?"
        body="Call now or request a free, no-obligation quote and we'll get back to you fast."
        buttons={[
          { label: "Call Now", href: `tel:${phone}`, icon: <Phone className="h-4 w-4" aria-hidden="true" /> },
          { label: "Request a Quote", href: "/contact", variant: "outline", icon: <FileText className="h-4 w-4" aria-hidden="true" /> },
        ]}
      />
    </>
  );
}
