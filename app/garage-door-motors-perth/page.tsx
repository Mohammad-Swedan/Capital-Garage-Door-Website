import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, FileSearch } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { SectionHeading } from "@/components/page/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { FAQSection } from "@/components/page/faq-section";
import { CTASection } from "@/components/sections/cta-section";
import { WarrantyTiers, type WarrantyTier } from "@/components/sections/warranty/warranty-tiers";
import { ServiceQuoteForm } from "@/components/sections/service/quote-form";
import { ServiceContactPanel } from "@/components/sections/service/service-contact-panel";
import { StickyMobileCta } from "@/components/layout/sticky-mobile-cta";
import { MotorHero } from "@/components/sections/motors/motor-hero";
import { ForceSelector } from "@/components/sections/motors/force-selector";
import { MotorFeatureGrid } from "@/components/sections/motors/feature-grid";
import { MotorHowItWorks } from "@/components/sections/motors/how-it-works";
import { MotorWhatsInTheBox } from "@/components/sections/motors/whats-in-the-box";
import { MotorInstallBand } from "@/components/sections/motors/install-band";
import {
  MOTOR_IMAGES,
  MOTOR_MODELS,
  MOTOR_OG_IMAGE,
  MOTOR_PRICE,
  MOTORS_PATH,
} from "@/components/sections/motors/motor-data";
import { buildMetadata } from "@/lib/seo/metadata";
import { faqSchema, productSchema, speakableSchema } from "@/lib/seo/schema";
import type { FAQ } from "@/types";

export const metadata: Metadata = buildMetadata({
  title: "Garage Door Motors Perth | Capital 1100N & 1500N",
  description:
    "Capital garage door motors supplied & installed in Perth for $770–$990. Quiet belt drive, WiFi app, LED light and a 5-year warranty, extendable to 7.",
  path: MOTORS_PATH,
  image: MOTOR_OG_IMAGE,
});

// Mirrors the cover described on /warranty (keep in sync with app/warranty/page.tsx
// TIERS) — the public claim must be identical on both pages.
const TIERS: WarrantyTier[] = [
  {
    name: "Standard Warranty",
    duration: "5 Years",
    tagline: "Included with every Capital motor we supply and install.",
    features: [
      "5-year manufacturer warranty on the motor & drive unit",
      "12-month workmanship warranty on our installation",
      "Genuine replacement parts on covered faults",
      "Phone support from our local Perth team",
    ],
    conditions: "Applies automatically once your installation is registered against your property.",
  },
  {
    name: "Extended Warranty",
    duration: "7 Years",
    tagline: "Two extra years of motor cover for owners who keep up annual servicing.",
    badge: "Requires yearly maintenance",
    highlighted: true,
    features: [
      "Everything in the Standard warranty",
      "7-year cover on the motor & drive unit",
      "Priority booking on any warranty call-out",
      "A yearly service that keeps your door safe and the cover valid",
    ],
    conditions: "Stays valid while your door is professionally serviced once every 12 months.",
  },
];

const FAQS: FAQ[] = [
  {
    question: "How much does a garage door motor cost in Perth?",
    answer:
      "A new Capital garage door motor costs $770–$990 supplied and installed in Perth. That covers the motor (1100N or 1500N), belt rail kit, two remotes, wall control, safety sensors, installation, programming and disposal of your old opener — you get an exact price before any work starts.",
  },
  {
    question: "Which motor do I need — the 1100N or the 1500N?",
    answer:
      "The Capital 1100N suits single and standard double sectional doors, which covers most Perth homes. The 1500N adds extra pulling power for large, heavy or insulated doors. If you're unsure, our technician checks your door on the day and fits the right one — both sit in the same installed price range.",
  },
  {
    question: "How long is the warranty on a Capital motor?",
    answer:
      "Every Capital motor comes with a 5-year standard warranty on the motor and drive unit, plus a 12-month workmanship warranty on the installation. Keep up a professional service once a year and the motor cover extends to 7 years. You register your warranty online in a couple of minutes after installation.",
  },
  {
    question: "Can you replace just the motor and keep my existing door?",
    answer:
      "Yes — if your door and springs are in good condition, we simply swap the opener. We check the door's balance and hardware first, because a motor should never be used to drag a faulty door. If the door itself needs attention, you'll know before any work starts.",
  },
  {
    question: "How long does installation take?",
    answer:
      "Most motor replacements take under two hours, including removing the old unit, fitting the new rail and motor, programming your remotes and app, and running a full safety test. Same-day slots are available across Perth.",
  },
  {
    question: "Will the door still open in a blackout?",
    answer:
      "Yes. Every motor has a manual release cord so you can open the door by hand, and there's an optional battery backup that keeps the motor itself working through a power cut — worth adding if your garage is the main way into the house.",
  },
  {
    question: "Can I open the door from my phone?",
    answer:
      "Yes. WiFi app control is built into both models. We set the app up on your phone before we leave, so you can open, close and check the door from anywhere.",
  },
];

export default function GarageDoorMotorsPage() {
  return (
    <>
      {MOTOR_MODELS.map((model) => (
        <JsonLd
          key={model.id}
          data={productSchema({
            name: model.name,
            description: model.description,
            image: MOTOR_IMAGES.heroDark.src,
            sku: model.sku,
            forceNewtons: model.force,
            priceMin: MOTOR_PRICE.min,
            priceMax: MOTOR_PRICE.max,
            warrantyYears: 5,
            path: MOTORS_PATH,
          })}
        />
      ))}
      <JsonLd data={faqSchema(FAQS)} />
      <JsonLd data={speakableSchema(MOTORS_PATH, ["#direct-answer"])} />

      <Container className="pt-6">
        <Breadcrumbs
          items={[
            { name: "Home", url: "/" },
            { name: "Garage Door Motors Perth", url: MOTORS_PATH },
          ]}
        />
      </Container>

      <div className="mt-6">
        <MotorHero />
      </div>

      {/* Direct answer — primary keyword + price in the first 100 words. */}
      <section className="bg-background pt-12 sm:pt-16">
        <Container>
          <div className="mx-auto max-w-3xl">
            <p id="direct-answer" className="text-pretty text-lg leading-relaxed text-foreground">
              Looking for a new <strong>garage door motor in Perth</strong>? We supply and install
              our own Capital 1100N and 1500N openers for{" "}
              <strong>
                ${MOTOR_PRICE.min}–${MOTOR_PRICE.max}
              </strong>{" "}
              — including the belt rail, two remotes, wall control, safety sensors, programming and
              removal of your old unit. Both are whisper-quiet belt-drive motors with WiFi app
              control and a built-in LED light, backed by a{" "}
              <Link href="/warranty" className="font-semibold text-primary hover:underline">
                5-year warranty
              </Link>{" "}
              you can extend to 7.
            </p>
            <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
              Weighing up repair versus replacement? Our{" "}
              <Link
                href="/garage-door-repair-cost-perth"
                className="font-semibold text-primary hover:underline"
              >
                garage door repair cost guide
              </Link>{" "}
              covers typical Perth prices, and if your current opener just needs attention, the{" "}
              <Link
                href="/garage-door-opener-repair-perth"
                className="font-semibold text-primary hover:underline"
              >
                opener repair service
              </Link>{" "}
              can often save it.
            </p>
          </div>
        </Container>
      </section>

      {/* Model picker — studio render + the interactive force selector island. */}
      <section className="bg-background py-14 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Choose your power"
            title="Two Motors. One Simple Choice."
            description="Same features, same warranty, same installed price range — pick the pulling force that matches your door."
            align="center"
          />
          <div className="mt-10 grid items-center gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:gap-12">
            <Reveal>
              <div className="overflow-hidden rounded-3xl border border-border bg-white p-4 shadow-[0_12px_40px_rgba(13,31,69,0.1)] sm:p-6">
                <Image
                  src={MOTOR_IMAGES.studio.src}
                  alt={MOTOR_IMAGES.studio.alt}
                  width={MOTOR_IMAGES.studio.width}
                  height={MOTOR_IMAGES.studio.height}
                  quality={75}
                  sizes="(min-width: 1024px) 44vw, 92vw"
                  className="h-auto w-full"
                />
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <ForceSelector />
            </Reveal>
          </div>
        </Container>
      </section>

      <MotorFeatureGrid />
      <MotorHowItWorks />
      <MotorWhatsInTheBox />
      <MotorInstallBand />

      <WarrantyTiers
        eyebrow="Backed for the long run"
        title="5-Year Standard, or 7-Year Extended"
        description="Every Capital motor is covered from the day it's installed. Keep up a yearly service and that cover stretches to a full seven years."
        tiers={TIERS}
      />

      <CTASection
        heading="Your Motor's Covered — Make It Official"
        body="Registration takes a couple of minutes and puts your 5-year cover on record against your property. Annual servicing unlocks the full 7 years."
        buttons={[
          {
            label: "Register Your Warranty",
            href: "/warranty-registration",
            icon: <ShieldCheck className="h-4 w-4" aria-hidden="true" />,
          },
          {
            label: "See What's Covered",
            href: "/warranty",
            variant: "outline",
            icon: <FileSearch className="h-4 w-4" aria-hidden="true" />,
          },
        ]}
      />

      <FAQSection
        eyebrow="Motor FAQ"
        title="Garage Door Motor Questions, Answered"
        description="Straight answers on price, sizing, warranty and what happens on install day."
        faqs={FAQS}
      />

      {/* Quote section — same mounting pattern as the flat service pages;
          ServiceQuoteForm owns the #quote anchor the hero CTA scrolls to. */}
      <section className="bg-muted/40">
        <Container className="py-12 sm:py-16">
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start lg:gap-12">
            <ServiceContactPanel serviceName="Garage Door Motor Installation" />
            <ServiceQuoteForm
              serviceName="Capital Garage Doors Motors"
              heading="Get a Motor Quote"
            />
          </div>
        </Container>
      </section>

      <StickyMobileCta />
    </>
  );
}
