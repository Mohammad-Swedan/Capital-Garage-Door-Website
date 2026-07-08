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
import { getReviewsSummary } from "@/lib/data/reviews";
import { getTestimonials } from "@/lib/data/testimonials";
import { servicesItemListSchema, faqSchema, testimonialReviewSchemas } from "@/lib/seo/schema";
import { buildMetadata } from "@/lib/seo/metadata";
import type { FAQ } from "@/types";

const AboutSection = dynamic(() => import("@/components/sections/about").then(m => m.AboutSection));
const ServicesGrid = dynamic(() => import("@/components/sections/services-grid").then(m => m.ServicesGrid));
const Testimonials = dynamic(() => import("@/components/sections/testimonials").then(m => m.Testimonials));
const SmartCta = dynamic(() => import("@/components/sections/smart-cta").then(m => m.SmartCta));
const ScrollDoorReveal = dynamic(() => import("@/components/sections/scroll-door-reveal").then(m => m.ScrollDoorReveal));

export const metadata: Metadata = buildMetadata({
  title: "Garage Door Repairs Perth | Capital Garage Door",
  description:
    "Perth's garage door repair experts — emergency & same-day repairs, new installs, roller doors, motors & servicing across all suburbs. Free upfront quotes.",
  path: "/",
});

// Home FAQ — targets real Google Search Console question/cost queries (springs
// lifespan, cost-to-fix, motor replacement, servicing, roller & commercial
// doors). Rendered via <FAQSection> and emitted as FAQPage JSON-LD below.
//
// Answers are written as SELF-CONTAINED ~90–165-word passages (the blog's
// "Short Answer" pattern): that length is what AI answer engines cite whole,
// and the audit found the previous 42–48-word answers too thin to be quoted.
// Every dollar figure comes from the calculator's pricing-data.ts (the same
// single source of truth the CMS pricing catalog is seeded from) — keep them
// in sync when prices change.
const HOME_FAQS: FAQ[] = [
  {
    question: "Do you offer emergency garage door repairs in Perth?",
    answer:
      "Yes — we provide 24/7 emergency garage door repairs across all Perth suburbs, from Joondalup and Wanneroo down to Rockingham and Baldivis. Typical emergencies include a door stuck open, a car trapped inside, a snapped spring or cable, or a door that has come off its tracks and won't close securely. Call 0475 333 335 and we'll give you a clear arrival window — our technicians drive fully stocked vans, so most emergency repairs are finished on the first visit, and we aim to be on-site the same day. Standard repair pricing applies during business hours; after-hours emergency call-outs add a flat $500 surcharge, which we confirm with you before dispatching a technician — never after the work is done.",
  },
  {
    question: "How much does a garage door repair cost in Perth?",
    answer:
      "Most common garage door repairs in Perth fall between $150 and $1,100, depending on the fault. As a guide from our own price list: broken springs run $240–$1,000 depending on the door and the number of springs, a snapped or off-drum cable is $280–$550, motor or opener repairs are $380–$490, getting a door back on its tracks is $440–$770, and panel or section damage is $550–$1,100. Safety sensors sit around $150–$300, and worn hinges and rollers are $30 each plus a $140 call-out. Every job is quoted upfront before any work starts, there's no call-out fee to quote, and the price we agree is the price you pay. For a figure tailored to your door, try our online price calculator.",
  },
  {
    question: "How much is a garage door motor or opener replacement?",
    answer:
      "A full garage door motor (opener) replacement in Perth typically costs $770–$990 supplied and installed, including removal of the old unit and programming your remotes. If the motor can be repaired instead, that's usually $380–$490. Adding smart Wi-Fi control — open, close and check your door from your phone — is around $280–$380 supplied and installed, and spare or replacement remotes are $95 each plus $120 to attend and program. We repair and install all major brands, and also supply our own Capital 1100N and 1500N motors with factory warranties. In most cases we can supply and fit a new opener on the same visit.",
  },
  {
    question: "How long do garage door springs last?",
    answer:
      "Garage door springs typically last 7–12 years, or roughly 10,000 open-and-close cycles — about two to four cycles a day for a decade. Heavy daily use, coastal salt air (a real factor in Perth's beachside suburbs like Scarborough and Fremantle), and a poorly balanced door all shorten that life. The warning signs a spring is near the end: the door feels much heavier than usual, slams shut, lifts crookedly, or you hear a loud bang from the garage — that bang is usually the spring letting go. Springs often fail as a pair, so if one has gone we check both and quote replacement upfront: $240–$1,000 depending on the door and spring count.",
  },
  {
    question: "When should I replace my garage door springs?",
    answer:
      "Replace garage door springs as soon as you notice a snapped coil, a visible gap in the spring, a door that won't stay open or feels unusually heavy, jerky movement, or a loud bang from the garage. Don't keep using the door in the meantime — running the opener against a broken spring can burn out the motor and bend panels, turning a $240–$1,000 spring replacement into a far bigger repair. Springs are under extreme tension and are the most dangerous part of a garage door to handle, so replacement is always a job for a trained technician with proper winding bars. We replace torsion and extension springs across Perth, usually same-day.",
  },
  {
    question: "How often should a garage door be serviced?",
    answer:
      "We recommend a professional garage door service once a year — and every six months in coastal Perth suburbs, where salt air corrodes springs and cables faster. A service starts from $140 plus any parts, and covers lubricating and re-tensioning the moving parts, checking the door's balance, and inspecting springs, cables and rollers for wear before they fail. A yearly tune-up keeps the door quiet and safe, extends the life of the motor, and is almost always cheaper than the emergency repair it prevents. If your door is noisy, slow, or hasn't been looked at in over two years, a $120 safety check-up is the easiest place to start.",
  },
  {
    question: "Do you repair roller doors and commercial garage doors?",
    answer:
      "Yes. Alongside residential sectional doors, we repair, service and install roller doors and commercial/industrial doors across Perth. Common roller-door jobs include lock and arm replacements at $380–$440, weather seals at $280–$480, and full removal-and-reinstall work at $880–$1,500. For businesses, we service warehouse and workshop roller shutters — a commercial roller-door service starts around $280–$380 per door. New doors are covered too: a standard sectional or roller door supplied and installed runs $3,000–$5,000, while commercial and custom doors range $5,000–$15,000. Tell us what you're working with and we'll quote it upfront, whether it's one home roller door or every door on a commercial site.",
  },
];

export default async function Home() {
  // Services ItemList structured data (helps search engines understand what we offer on "/").
  const [services, summary, testimonials] = await Promise.all([
    getServices(),
    getReviewsSummary(),
    getTestimonials(),
  ]);
  const servicesList = servicesItemListSchema(
    services.map((s) => ({ name: s.name, url: s.canonicalHref, image: s.image })),
    "/",
  );

  return (
    <>
      <JsonLd data={servicesList} />
      <JsonLd data={faqSchema(HOME_FAQS)} />
      {/* Individual Review nodes for the visible testimonial marquee — they
          substantiate the site-wide aggregateRating with attributable quotes. */}
      <JsonLd data={testimonialReviewSchemas(testimonials)} />
      <Hero rating={{ value: summary.averageRating, count: summary.totalReviews }} />
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
