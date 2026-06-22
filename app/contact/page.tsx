import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft, Phone, Mail, MapPin, Clock } from "lucide-react";
import { Container } from "@/components/layout/container";
import { ContactForm } from "@/components/forms/contact-form";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Capital Garage Door for a free quote, same-day repairs, or general questions. Call, email, or send us a message.",
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactPage() {
  const { business } = siteConfig;

  return (
    <div className="relative w-full overflow-hidden bg-background py-12 sm:py-16 lg:py-20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -top-24 left-1/2 h-90 w-200 -translate-x-1/2 rounded-full bg-primary/6 blur-3xl" />
      </div>

      <Container className="relative z-10">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider transition-colors hover:text-cta"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>

        <div className="mb-10 max-w-2xl">
          <h1 className="font-display text-3xl font-black tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Get In <span className="text-cta">Touch</span>
          </h1>
          <p className="mt-4 text-base text-muted-foreground sm:text-lg">
            Need a free quote or have a question? Send us a message and
            we&apos;ll get back to you shortly — or call us for same-day
            emergency service.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
          {/* Business info */}
          <div className="flex flex-col gap-6">
            <a
              href={`tel:${business.phone}`}
              className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-5 transition-colors hover:border-cta/30"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-cta/10 text-cta">
                <Phone className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                  Call Now
                </p>
                <p className="font-display text-lg font-bold text-foreground group-hover:text-cta">
                  {business.phoneDisplay}
                </p>
              </div>
            </a>

            <a
              href={`mailto:${business.email}`}
              className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/30"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Mail className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                  Email
                </p>
                <p className="font-display text-lg font-bold text-foreground group-hover:text-primary">
                  {business.email}
                </p>
              </div>
            </a>

            <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-foreground/8 text-foreground">
                <MapPin className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                  Service Area
                </p>
                <p className="font-display text-lg font-bold text-foreground">
                  All Perth Suburbs
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-foreground/8 text-foreground">
                <Clock className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                  Hours
                </p>
                <p className="font-display text-base font-bold text-foreground">
                  Mon&ndash;Fri 8am&ndash;6pm &middot; Sat 9am&ndash;3pm
                </p>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  24/7 emergency service available
                </p>
              </div>
            </div>
          </div>

          {/* Contact form */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-[0_8px_32px_rgba(13,31,69,0.08)] sm:p-8">
            <ContactForm />
          </div>
        </div>
      </Container>
    </div>
  );
}
