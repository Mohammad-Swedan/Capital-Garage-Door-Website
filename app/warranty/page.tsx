import type { Metadata } from "next";
import { Phone, ShieldCheck, ClipboardCheck } from "lucide-react";
import { Container } from "@/components/layout/container";
import { PageHero } from "@/components/sections/page-hero";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { CTASection } from "@/components/sections/cta-section";
import { TrustCards } from "@/components/page/trust-cards";
import { FAQSection } from "@/components/page/faq-section";
import { JsonLd } from "@/components/seo/json-ld";
import { WarrantyTiers, type WarrantyTier } from "@/components/sections/warranty/warranty-tiers";
import {
  WarrantyShowcase,
  type WarrantyShowcaseItem,
} from "@/components/sections/warranty/warranty-showcase";
import { WarrantySteps, type WarrantyStep } from "@/components/sections/warranty/warranty-steps";
import { buildMetadata } from "@/lib/seo/metadata";
import { faqSchema } from "@/lib/seo/schema";
import { siteConfig } from "@/config/site";
import type { FAQ, TrustReason } from "@/types";

export const metadata: Metadata = buildMetadata({
  title: "Garage Door Motor Warranty | Capital Garage Door",
  description:
    "Every garage door motor we install in Perth is backed by a 5-year warranty — extendable to 7 years with annual servicing. See what's covered and register your warranty online.",
  path: "/warranty",
});

// Headline terms are easy to edit: the 5-year / 7-year cover was confirmed by the
// business; parts/workmanship specifics are written as editable copy.
const TIERS: WarrantyTier[] = [
  {
    name: "Standard Warranty",
    duration: "5 Years",
    tagline: "Included with every garage door motor we supply and install.",
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

const COVERAGE: TrustReason[] = [
  {
    title: "Motor & Drive Unit",
    description:
      "The heart of your opener — covered against mechanical and electrical failure for the life of the warranty.",
    icon: "Cpu",
  },
  {
    title: "Electronics & Remotes",
    description: "Control boards, wall buttons and the remotes we supply are covered for faults.",
    icon: "Zap",
  },
  {
    title: "Genuine Replacement Parts",
    description: "Covered repairs use genuine parts, so your door keeps running the way it should.",
    icon: "BadgeCheck",
  },
  {
    title: "Professional Workmanship",
    description: "Our installation is guaranteed — if a fault traces back to our work, we put it right.",
    icon: "Wrench",
  },
  {
    title: "Priority Call-Out",
    description: "Warranty jobs go to the front of the queue, so a covered fault is sorted fast.",
    icon: "Siren",
  },
  {
    title: "Local Aftercare",
    description: "A real Perth team on the phone whenever you have a warranty question.",
    icon: "LifeBuoy",
  },
];

const SHOWCASE: WarrantyShowcaseItem[] = [
  {
    title: "Premium Opener Motors",
    caption: "Quiet, reliable drive units chosen to last — and backed by our warranty.",
    alt: "Capital Garage Door opener motor",
  },
  {
    title: "Built-In Safety Sensors",
    caption: "Auto-reverse safety beams that stop the door on contact, fitted as standard.",
    alt: "Garage door safety sensor",
  },
  {
    title: "Smart Remotes & Wall Control",
    caption: "Supplied remotes and wall controls are covered for faults under your warranty.",
    alt: "Garage door remote and wall control",
  },
];

const STEPS: WarrantyStep[] = [
  {
    title: "We install your motor",
    description:
      "Our technician fits and tests your new opener, then records the make, model and install date.",
  },
  {
    title: "Register your warranty",
    description:
      "Activate your cover online in a couple of minutes so it's on record against your property.",
  },
  {
    title: "Keep up yearly maintenance",
    description:
      "An annual service keeps your door running safely — and unlocks the 7-year extended cover.",
  },
  {
    title: "You're covered",
    description:
      "If a covered part fails, we prioritise your call-out and put it right with genuine parts.",
  },
];

const FAQS: FAQ[] = [
  {
    question: "What does the motor warranty cover?",
    answer:
      "Your warranty covers the motor and drive unit against mechanical and electrical failure, along with the electronics and remotes we supply. Our installation workmanship is also guaranteed for 12 months — if a fault traces back to our work, we fix it.",
  },
  {
    question: "How long is the warranty?",
    answer:
      "Every garage door motor we install comes with a 5-year standard warranty. You can extend that to 7 years by keeping up a professional service once a year, which keeps your door safe and the extended cover valid.",
  },
  {
    question: "What's the difference between the 5-year and 7-year cover?",
    answer:
      "The 5-year cover applies automatically. The 7-year extended cover adds two more years on the motor and drive unit, on the condition that your door is professionally serviced every 12 months.",
  },
  {
    question: "How do I register my warranty?",
    answer:
      "Use our online warranty registration. Enter your details and install or invoice information, and your cover is recorded against your property in a couple of minutes.",
  },
  {
    question: "How do I check my warranty status or make a claim?",
    answer:
      "Head to the warranty registration page, where you can check your warranty status or start a claim. Our team follows up to arrange a priority call-out for covered faults.",
  },
  {
    question: "Does the extended warranty really need yearly servicing?",
    answer:
      "Yes. The extended 7-year cover is offered on the basis that your door is serviced once a year. Regular maintenance catches small issues early and keeps the motor running well — which is exactly why we can back it for longer.",
  },
];

export default function WarrantyPage() {
  const phone = siteConfig.business.phone;

  return (
    <>
      <JsonLd data={faqSchema(FAQS)} />

      <Container className="pt-6">
        <Breadcrumbs items={[{ name: "Home", url: "/" }, { name: "Warranty", url: "/warranty" }]} />
      </Container>

      <PageHero
        eyebrow="Backed for the Long Run"
        title="Garage Motor Warranty You Can Count On"
        subtitle="Every motor we install is protected by a 5-year warranty — and you can extend it to 7 years simply by keeping up an annual service. Register your cover or check your status anytime."
        ctas={[
          {
            label: "Register Your Warranty",
            href: "/warranty-registration",
            icon: <ShieldCheck className="h-4 w-4" aria-hidden="true" />,
          },
          {
            label: "Check Warranty Status",
            href: "/warranty-registration",
            variant: "outline",
            icon: <ClipboardCheck className="h-4 w-4" aria-hidden="true" />,
          },
        ]}
      />

      <WarrantyTiers
        eyebrow="Two Levels of Cover"
        title="5-Year Standard, or 7-Year Extended"
        description="Standard cover comes with every motor. Keep up a yearly service and your motor stays protected for a full seven years."
        tiers={TIERS}
      />

      <TrustCards
        eyebrow="What's Covered"
        title="Real Protection on the Parts That Matter"
        description="Your warranty is about peace of mind — here's exactly what it stands behind."
        reasons={COVERAGE}
      />

      <WarrantyShowcase
        eyebrow="Our Motors"
        title="Quality Hardware, Built to Last"
        description="We fit dependable, safety-first openers — and stand behind them with a warranty that matches their quality."
        items={SHOWCASE}
      />

      <WarrantySteps
        eyebrow="How It Works"
        title="From Install to Covered in Four Steps"
        steps={STEPS}
      />

      <FAQSection
        eyebrow="Warranty FAQ"
        title="Common Warranty Questions"
        description="Everything you need to know about your cover, from what's included to how to make a claim."
        faqs={FAQS}
      />

      <CTASection
        heading="Already Had a Motor Installed? Lock In Your Cover"
        body="Register your warranty in a couple of minutes, or check the status of an existing one."
        buttons={[
          {
            label: "Register Your Warranty",
            href: "/warranty-registration",
          },
          {
            label: "Call Us",
            href: `tel:${phone}`,
            variant: "outline",
            icon: <Phone className="h-4 w-4" aria-hidden="true" />,
          },
        ]}
      />
    </>
  );
}
