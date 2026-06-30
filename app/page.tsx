import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Hero } from "@/components/sections/hero";
import { CalculatorCta } from "@/components/sections/calculator-cta";
import { LazyOnVisible } from "@/components/motion/lazy-on-visible";
import { JsonLd } from "@/components/seo/json-ld";
import { getServices } from "@/lib/data/services";
import { servicesItemListSchema } from "@/lib/seo/schema";
import { buildMetadata } from "@/lib/seo/metadata";

const AboutSection = dynamic(() => import("@/components/sections/about").then(m => m.AboutSection));
const ServicesGrid = dynamic(() => import("@/components/sections/services-grid").then(m => m.ServicesGrid));
const WhyChooseUs = dynamic(() => import("@/components/sections/why-choose-us").then(m => m.WhyChooseUs));
const ServiceAreaMap = dynamic(() => import("@/components/sections/service-area-map").then(m => m.ServiceAreaMap));
const Testimonials = dynamic(() => import("@/components/sections/testimonials").then(m => m.Testimonials));
const SmartCta = dynamic(() => import("@/components/sections/smart-cta").then(m => m.SmartCta));
const ScrollDoorReveal = dynamic(() => import("@/components/sections/scroll-door-reveal").then(m => m.ScrollDoorReveal));

export const metadata: Metadata = buildMetadata({
  title: "Garage Door Repair & Installation Perth | Capital Garage Door",
  description:
    "Perth's trusted garage door experts — same-day repairs, new installations, motor replacements and servicing across all suburbs. Licensed, insured, free quotes.",
  path: "/",
});

export default async function Home() {
  // Services ItemList structured data (helps search engines understand what we offer on "/").
  const services = await getServices();
  const servicesList = servicesItemListSchema(
    services.map((s) => ({ name: s.name, url: s.canonicalHref, image: s.image })),
    "/",
  );

  return (
    <>
      <JsonLd data={servicesList} />
      <Hero />
      <AboutSection />
      <ServicesGrid />
      <WhyChooseUs />
      <ServiceAreaMap />
      <Testimonials />
      <SmartCta />
      <CalculatorCta />
      {/* gsap + ScrollTrigger only load once the user scrolls near this last
          section, keeping them out of the initial main-thread work. */}
      <LazyOnVisible className="min-h-screen">
        <ScrollDoorReveal />
      </LazyOnVisible>
    </>
  );
}
