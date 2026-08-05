import type { Metadata } from "next";
import { Phone, ShieldCheck, Clock, CircleDollarSign, Siren } from "lucide-react";
import { Container } from "@/components/layout/container";
import { StickyMobileCta } from "@/components/layout/sticky-mobile-cta";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { faqSchema } from "@/lib/seo/schema";
import { QuoteFrame } from "@/components/sections/quote-frame";
import { FAQSection } from "@/components/sections/faq-section";
import { buildMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/config/site";
import { formatHoursSummary } from "@/lib/utils";
import type { BreadcrumbItem, FAQ } from "@/types";

/**
 * /quote — the dedicated, distraction-free quote page. The live booking-system
 * quote widget IS the page (submissions land straight in the CRM); everything
 * else is just enough trust + FAQ to satisfy the "garage door quote perth"
 * intent. Linked from the header CTA, the footer, and the mobile menu —
 * /contact keeps its fuller contact-details + map variant of the same embed.
 */

export const metadata: Metadata = buildMetadata({
  title: "Get a Free Garage Door Quote Perth | Fast Response",
  description:
    "Request a free garage door quote online — repairs, new doors, motors and servicing across Perth. No call-out fee to quote, replies within the hour.",
  path: "/quote",
});

const HOURS_SUMMARY = formatHoursSummary(siteConfig.business.hours);

const FAQS: FAQ[] = [
  {
    question: "How fast will I get my garage door quote?",
    answer: `We typically reply within the hour during business hours (${HOURS_SUMMARY}). Straightforward repairs are often quoted from your description and photos alone; for new doors and complex jobs we'll arrange a free measure first.`,
  },
  {
    question: "Does a quote cost anything or commit me to booking?",
    answer:
      "No — quoting is free, there's no call-out fee to quote, and sending the form commits you to nothing. We come back with a clear price or honest guidance, and you decide from there.",
  },
  {
    question: "What should I include for the most accurate quote?",
    answer:
      "The door type (sectional, roller, tilt), what's wrong or what you're after, your suburb, and a photo if you can take one safely. A photo of the door and of any damaged part usually lets us quote a repair without a site visit.",
  },
  {
    question: "It's urgent — should I still use the form?",
    answer:
      "If the door is stuck open, off its tracks, or your car is trapped, call us instead — emergencies are dispatched by phone, 24/7. The form is the right tool for everything that can wait a few hours.",
  },
];

const breadcrumbs: BreadcrumbItem[] = [
  { name: "Home", url: "/" },
  { name: "Get a Quote", url: "/quote" },
];

const TRUST_POINTS = [
  { icon: CircleDollarSign, text: "No call-out fee to quote — the price is agreed before any work starts" },
  { icon: Clock, text: "Replies within the hour during business hours" },
  { icon: ShieldCheck, text: "Licensed, insured, and warranty-backed workmanship" },
] as const;

export default function QuotePage() {
  const phone = siteConfig.business.phone;

  return (
    <>
      <JsonLd data={faqSchema(FAQS)} />
      <Container className="pt-6">
        <Breadcrumbs items={breadcrumbs} />
      </Container>

      <section className="bg-muted/40">
        <Container className="py-10 sm:py-14">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-bold tracking-wide text-cta uppercase">Free &amp; Obligation-Free</p>
            <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Get a Free Garage Door Quote
            </h1>
            <p className="mt-3 text-muted-foreground">
              Repairs, new doors, motors or servicing — tell us what you need and we&apos;ll come back
              with a clear price. Anywhere in Perth.
            </p>
          </div>

          <div className="mx-auto mt-8 grid max-w-5xl gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-start lg:gap-12">
            <div
              id="quote"
              className="scroll-mt-24 rounded-2xl border border-border bg-card p-5 shadow-sm ring-1 ring-foreground/5 sm:p-7"
            >
              <QuoteFrame />
              <p className="mt-4 text-center text-xs text-muted-foreground">
                Your request goes straight to our team — no middleman, no spam.
              </p>
            </div>

            <aside className="flex flex-col gap-5">
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm ring-1 ring-foreground/5">
                <h2 className="font-heading text-base font-semibold text-foreground">
                  What to expect
                </h2>
                <ul className="mt-4 flex flex-col gap-3 text-sm text-foreground">
                  {TRUST_POINTS.map(({ icon: Icon, text }) => (
                    <li key={text} className="flex items-start gap-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Icon className="h-4 w-4" aria-hidden="true" />
                      </span>
                      <span className="leading-relaxed">{text}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-cta/25 bg-cta/5 p-6">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-cta/15 text-cta">
                  <Siren className="h-5 w-5" aria-hidden="true" />
                </span>
                <h2 className="mt-3 font-heading text-base font-semibold text-foreground">
                  Emergency? Don&apos;t wait for a quote.
                </h2>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  Door stuck open, car trapped, or a snapped spring — call now and we&apos;ll dispatch
                  the nearest technician, 24/7.
                </p>
                <a
                  href={`tel:${phone}`}
                  className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-full bg-cta px-5 py-2.5 text-sm font-bold text-cta-foreground transition-colors hover:bg-cta/90"
                >
                  <Phone className="h-4 w-4" aria-hidden="true" />
                  Call {siteConfig.business.phoneDisplay}
                </a>
              </div>
            </aside>
          </div>
        </Container>
      </section>

      <FAQSection heading="Quote FAQs" faqs={FAQS} />

      <StickyMobileCta />
    </>
  );
}
