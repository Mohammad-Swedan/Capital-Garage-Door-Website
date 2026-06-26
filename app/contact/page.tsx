import type { Metadata } from "next";
import { Phone, Mail, MapPin, Clock, Siren, FileText, Camera, ShieldCheck } from "lucide-react";
import { Container } from "@/components/layout/container";
import { StickyMobileCta } from "@/components/layout/sticky-mobile-cta";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { contactPointSchema } from "@/lib/seo/schema";
import { PageHero } from "@/components/sections/page-hero";
import { ContactInfoCards } from "@/components/sections/contact-info-cards";
import { ContactQuoteForm } from "@/components/forms/contact-quote-form";
import { ServiceAreaGrid } from "@/components/sections/service/service-area-grid";
import { TrustCards } from "@/components/page/trust-cards";
import { FAQSection } from "@/components/sections/faq-section";
import { CTASection } from "@/components/sections/cta-section";
import { buildMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/config/site";
import type { BreadcrumbItem, FAQ, TrustReason } from "@/types";

export const metadata: Metadata = buildMetadata({
  title: "Contact Us | Request a Garage Door Quote in Perth",
  description:
    "Request a free garage door repair, installation, or servicing quote in Perth. Call now, upload a photo, or fill out the form and Capital Garage Doors will get back to you fast.",
  path: "/contact",
});

const PERTH_SUBURBS = [
  "Joondalup",
  "Canning Vale",
  "Fremantle",
  "Scarborough",
  "Midland",
  "Rockingham",
  "Morley",
  "Baldivis",
  "Subiaco",
  "Victoria Park",
];

const WHY_CONTACT_US: TrustReason[] = [
  {
    title: "Local Perth team",
    description: "Perth-based technicians who know the suburbs and turn up when they say they will.",
    icon: "MapPin",
  },
  {
    title: "Clear, upfront quotes",
    description: "No call-out fee to quote and no surprise charges — you'll know the price before we start.",
    icon: "FileText",
  },
  {
    title: "Friendly service",
    description: "Straightforward advice, no pressure tactics — just honest help with your garage door.",
    icon: "BadgeCheck",
  },
  {
    title: "Warranty support",
    description: "Parts and workmanship are backed by warranty, so you're covered after we leave.",
    icon: "ShieldCheck",
  },
  {
    title: "Residential and commercial",
    description: "From home garage doors to commercial roller shutters — we handle both.",
    icon: "LayoutPanelTop",
  },
];

const FAQS: FAQ[] = [
  {
    question: "How quickly will you respond?",
    answer:
      "We typically reply within the hour during business hours (Mon–Fri 8am–6pm, Sat 9am–3pm). Emergency requests are prioritised, with 24/7 emergency repairs available across Perth.",
  },
  {
    question: "Can I upload a photo?",
    answer:
      "Yes — the quote form below lets you attach a photo or short video of the issue. It helps our technicians diagnose the problem faster and often means a more accurate quote before we arrive.",
  },
  {
    question: "Do you service my suburb?",
    answer:
      "We service Perth and the surrounding suburbs, including Joondalup, Canning Vale, Fremantle, Scarborough, Rockingham and more. Don't see your suburb listed? Get in touch — we likely still cover it.",
  },
  {
    question: "Do you offer emergency repairs?",
    answer:
      "Yes. We offer emergency garage door repairs for urgent issues like a door stuck open, off its tracks, or not closing securely. Select \"Emergency\" as your urgency in the form below, or call us directly.",
  },
  {
    question: "Can I request a quote without booking?",
    answer:
      "Absolutely. Sending the form is obligation-free — we'll review your details and come back with guidance or a quote before anything is booked in.",
  },
];

const breadcrumbs: BreadcrumbItem[] = [
  { name: "Home", url: "/" },
  { name: "Contact", url: "/contact" },
];

export default function ContactPage() {
  const { business } = siteConfig;
  const phone = business.phone;

  return (
    <main>
      <JsonLd data={contactPointSchema()} />
      <Container className="pt-6">
        <Breadcrumbs items={breadcrumbs} />
      </Container>

      <PageHero
        eyebrow="Get Your Free Quote"
        title="Request a Garage Door Quote in Perth"
        subtitle="Tell us what you need help with and Capital Garage Doors will get back to you as soon as possible."
        ctas={[
          { label: "Call Now", href: `tel:${phone}`, icon: <Phone className="h-4 w-4" aria-hidden="true" /> },
          {
            label: "Request Quote",
            href: "#quote",
            variant: "outline",
            icon: <FileText className="h-4 w-4" aria-hidden="true" />,
          },
        ]}
      />

      <ContactInfoCards
        cards={[
          { icon: Phone, label: "Call Now", value: business.phoneDisplay, href: `tel:${phone}` },
          { icon: Mail, label: "Email", value: business.email, href: `mailto:${business.email}` },
          { icon: MapPin, label: "Service Areas", value: "All Perth Suburbs" },
          { icon: Clock, label: "Business Hours", value: "Mon–Fri 8am–6pm · Sat 9am–3pm" },
          { icon: Siren, label: "Emergency Repairs", value: "24/7 Availability", href: `tel:${phone}`, badge: "24/7" },
        ]}
      />

      <section id="quote" className="scroll-mt-24 bg-muted/40">
        <Container className="py-12 sm:py-16">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start lg:gap-12">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm ring-1 ring-foreground/5 sm:p-8">
              <h2 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Request a Quote
              </h2>
              <p className="mt-2 mb-6 text-muted-foreground">
                Fill in the details below — the more we know, the faster and more accurate your quote will be.
              </p>
              <ContactQuoteForm />
            </div>

            <aside className="flex flex-col gap-5">
              <div className="rounded-2xl border border-border bg-gradient-to-br from-card to-muted/30 p-6 shadow-sm ring-1 ring-foreground/5">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Camera className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 font-heading text-base font-semibold text-foreground">
                  Why upload a photo or video?
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  A quick snap of the issue helps our technicians get it right the first time.
                </p>
                <ul className="mt-4 flex flex-col gap-2 text-sm text-foreground">
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-cta" />
                    Faster diagnosis
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-cta" />
                    More accurate quote
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-cta" />
                    Fewer follow-up calls
                  </li>
                </ul>
              </div>

              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm ring-1 ring-foreground/5">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-600/10 text-emerald-700">
                  <ShieldCheck className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 font-heading text-base font-semibold text-foreground">
                  Backed by Capital Garage Doors
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  No call-out fee to quote, replies within the hour during business hours, and every job is
                  licensed, insured, and warranty-backed.
                </p>
              </div>
            </aside>
          </div>
        </Container>
      </section>

      <ServiceAreaGrid heading="Perth Suburbs We Service" areas={PERTH_SUBURBS} />

      <TrustCards
        eyebrow="Why choose us"
        title="Why Perth Trusts Capital Garage Doors"
        reasons={WHY_CONTACT_US}
      />

      <FAQSection heading="Contact & Quote FAQs" faqs={FAQS} />

      <CTASection
        tone="emergency"
        heading="Need Urgent Help?"
        body="Door stuck, off its tracks, or won't close securely? Our emergency team is ready to help."
        buttons={[
          { label: "Call Now", href: `tel:${phone}`, icon: <Phone className="h-4 w-4" aria-hidden="true" /> },
          {
            label: "Request Emergency Repair",
            href: "#quote",
            variant: "outline",
            icon: <Siren className="h-4 w-4" aria-hidden="true" />,
          },
        ]}
      />

      <StickyMobileCta />
    </main>
  );
}
