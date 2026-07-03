import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Hero } from "@/components/sections/hero";
import { CalculatorCta } from "@/components/sections/calculator-cta";
import { FAQSection } from "@/components/sections/faq-section";
import { ServiceAreaMap } from "@/components/sections/service-area-map";
import { WhyChooseUs } from "@/components/sections/why-choose-us";
import { LazyOnVisible } from "@/components/motion/lazy-on-visible";
import { JsonLd } from "@/components/seo/json-ld";
import { getServices } from "@/lib/data/services";
import { servicesItemListSchema, faqSchema } from "@/lib/seo/schema";
import { buildMetadata } from "@/lib/seo/metadata";
import type { FAQ } from "@/types";

const AboutSection = dynamic(() => import("@/components/sections/about").then(m => m.AboutSection));
const ServicesGrid = dynamic(() => import("@/components/sections/services-grid").then(m => m.ServicesGrid));
const Testimonials = dynamic(() => import("@/components/sections/testimonials").then(m => m.Testimonials));
const SmartCta = dynamic(() => import("@/components/sections/smart-cta").then(m => m.SmartCta));
const ScrollDoorReveal = dynamic(() => import("@/components/sections/scroll-door-reveal").then(m => m.ScrollDoorReveal));

export const metadata: Metadata = buildMetadata({
  title: "Garage Door Repair & Installation Perth | Capital Garage Door",
  description:
    "Perth's garage door repair experts — emergency & same-day repairs, new installs, roller doors, motors & servicing across all suburbs. Free upfront quotes.",
  path: "/",
});

// Home FAQ — targets real Google Search Console question/cost queries (springs
// lifespan, cost-to-fix, motor replacement, servicing, roller & commercial
// doors). Rendered via <FAQSection> and emitted as FAQPage JSON-LD below.
const HOME_FAQS: FAQ[] = [
  {
    question: "Do you offer emergency garage door repairs in Perth?",
    answer:
      "Yes — we provide 24/7 emergency garage door repairs across Perth and the surrounding suburbs, including doors stuck open, off their tracks, or that won't close securely. Our team aims to be on-site the same day, with stocked vans for on-the-spot fixes.",
  },
  {
    question: "How much does a garage door repair cost in Perth?",
    answer:
      "Every garage door repair is quoted upfront before any work starts, so there are no surprises. The price depends on the fault — a spring, cable, roller or motor issue — so the fastest way to get a figure is our online price calculator or a free quote.",
  },
  {
    question: "How much is a garage door motor or opener replacement?",
    answer:
      "A new garage door motor (opener) replacement in Perth varies with the brand and whether you want smart Wi-Fi control. We quote the job upfront and can often supply and fit a new opener on the same visit — get an instant range from our price calculator.",
  },
  {
    question: "How long do garage door springs last?",
    answer:
      "Garage door springs typically last around 7–12 years, or roughly 10,000 open-and-close cycles. Heavy daily use, rust and a poorly balanced door shorten that. If the door feels heavy, slams shut, or you hear a loud bang, the springs are likely near the end of their life.",
  },
  {
    question: "When should I replace my garage door springs?",
    answer:
      "Replace garage door springs as soon as you notice a snapped coil, a door that won't stay open, jerky movement, or a loud bang from the garage. Springs are under high tension and dangerous to handle yourself, so they should always be replaced by a trained technician.",
  },
  {
    question: "How often should a garage door be serviced?",
    answer:
      "We recommend a garage door service once a year. A regular tune-up lubricates and re-tensions the moving parts, catches worn springs, cables and rollers early, and keeps the door running quietly and safely — usually far cheaper than an emergency repair later.",
  },
  {
    question: "Do you repair roller doors and commercial garage doors?",
    answer:
      "Yes. As well as residential sectional doors, we repair and install roller doors and service commercial and industrial garage doors across Perth — from a single roller door to multiple units on a warehouse or workshop. Tell us what you need and we'll advise the best option.",
  },
];

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
      <JsonLd data={faqSchema(HOME_FAQS)} />
      <Hero />
      <AboutSection />
      <ServicesGrid />
      <WhyChooseUs />
      <ServiceAreaMap />
      <Testimonials />
      <SmartCta />
      <CalculatorCta />
      <FAQSection faqs={HOME_FAQS} heading="Garage Door FAQs" />
      {/* gsap + ScrollTrigger only load once the user scrolls near this last
          section, keeping them out of the initial main-thread work. */}
      <LazyOnVisible className="min-h-screen">
        <ScrollDoorReveal />
      </LazyOnVisible>
    </>
  );
}
