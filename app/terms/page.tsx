import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { buildMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = buildMetadata({
  title: "Terms of Service | Capital Garage Door",
  description: "The terms and conditions for using the Capital Garage Door website and services.",
  path: "/terms",
});

export default function TermsPage() {
  const { business } = siteConfig;

  return (
    <>
      <Container className="pt-6">
        <Breadcrumbs items={[{ name: "Home", url: "/" }, { name: "Terms of Service", url: "/terms" }]} />
      </Container>

      <Container className="max-w-3xl py-12 sm:py-16">
        <h1 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Terms of Service
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">Last updated: 23 June 2026</p>

        <div className="mt-8 flex flex-col gap-8 text-sm leading-relaxed text-muted-foreground sm:text-base">
          <section>
            <h2 className="font-heading text-lg font-semibold text-foreground">Agreement to Terms</h2>
            <p className="mt-2">
              By using this website or booking a service with {business.legalName} (&quot;{siteConfig.name}
              &quot;, &quot;we&quot;, &quot;us&quot;), you agree to these terms. If you do not agree, please do
              not use our website or services.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-foreground">Quotes &amp; Pricing</h2>
            <p className="mt-2">
              Quotes provided online, by phone, or via our price calculator are estimates based on the
              information you provide. Final pricing is confirmed after an on-site assessment and may vary
              depending on the actual condition of your garage door, parts required, and access to the site.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-foreground">Bookings &amp; Scheduling</h2>
            <p className="mt-2">
              Booking confirmations and arrival windows are estimates. We&apos;ll make reasonable efforts to
              notify you of delays, particularly for emergency call-outs where conditions can affect response
              time.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-foreground">Warranty</h2>
            <p className="mt-2">
              Workmanship and parts supplied by us are covered by the warranty terms communicated to you at the
              time of service. Warranty does not cover damage caused by misuse, unauthorized repairs, or normal
              wear and tear outside the warranty period.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-foreground">Website Use</h2>
            <p className="mt-2">
              Content on this website is provided for general information only and does not constitute
              professional advice. You agree not to misuse the website, including attempting to interfere with
              its normal operation or security.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-foreground">Limitation of Liability</h2>
            <p className="mt-2">
              To the extent permitted by law, {siteConfig.name} is not liable for indirect or consequential
              losses arising from use of this website. Nothing in these terms limits any rights you have under
              the Australian Consumer Law that cannot be excluded.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-foreground">Governing Law</h2>
            <p className="mt-2">
              These terms are governed by the laws of {business.address.addressRegion}, Australia.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-foreground">Contact Us</h2>
            <p className="mt-2">
              Questions about these terms can be sent to{" "}
              <a href={`mailto:${business.email}`} className="font-medium text-primary hover:underline">
                {business.email}
              </a>{" "}
              or{" "}
              <a href={`tel:${business.phone}`} className="font-medium text-primary hover:underline">
                {business.phoneDisplay}
              </a>
              .
            </p>
          </section>
        </div>
      </Container>
    </>
  );
}
