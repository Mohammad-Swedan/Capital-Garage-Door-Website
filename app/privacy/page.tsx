import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { ObfuscatedEmail } from "@/components/ui/obfuscated-email";
import { buildMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy | Capital Garage Doors",
  description:
    "How Capital Garage Doors collects, uses and protects your personal information — what we store when you request a quote or booking, and how to reach us about it.",
  path: "/privacy",
});

export default function PrivacyPage() {
  const { business } = siteConfig;

  return (
    <>
      <Container className="pt-6">
        <Breadcrumbs items={[{ name: "Home", url: "/" }, { name: "Privacy Policy", url: "/privacy" }]} />
      </Container>

      <Container className="max-w-3xl py-12 sm:py-16">
        <h1 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Privacy Policy
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">Last updated: 11 October 2026</p>

        <div className="mt-8 flex flex-col gap-8 text-sm leading-relaxed text-muted-foreground sm:text-base">
          <section>
            <h2 className="font-heading text-lg font-semibold text-foreground">Introduction</h2>
            <p className="mt-2">
              {business.legalName} (&quot;{siteConfig.name}&quot;, &quot;we&quot;, &quot;us&quot;) respects your
              privacy. This policy explains what information we collect when you use our website or request a
              quote, how we use it, and the choices you have.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-foreground">Information We Collect</h2>
            <p className="mt-2">When you contact us, request a quote, use our price calculator, or chat with our Smart Garage Assistant, we may collect:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Your name, phone number, email address, and property address</li>
              <li>Details about your garage door and the service you&apos;re requesting</li>
              <li>Any photos or videos you choose to upload with your request</li>
              <li>Messages you send to our Smart Garage Assistant chat, which we store to answer your enquiry, follow up, and improve the service (an AI provider processes the message text to generate replies; please don&apos;t share sensitive information you don&apos;t want recorded)</li>
              <li>Basic usage data (pages visited, device/browser type) via standard analytics tools</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-foreground">How We Use Your Information</h2>
            <p className="mt-2">We use the information you provide to:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Respond to quote requests and schedule service</li>
              <li>Communicate with you about bookings, quotes, and follow-ups</li>
              <li>Improve our website and services</li>
              <li>Comply with legal obligations</li>
            </ul>
            <p className="mt-2">We do not sell your personal information to third parties.</p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-foreground">Cookies &amp; Analytics</h2>
            <p className="mt-2">
              Our website may use cookies and similar technologies to remember preferences and understand how
              visitors use the site. You can disable cookies in your browser settings; this may affect some
              site features.
            </p>
            <p className="mt-2">
              We also measure visits ourselves, so we can tell which pages and which advertising bring in work.
              Through our own server, into the customer-management system we run, the site records the page you
              landed on, the site that referred you (if your browser passes one), any campaign tags or ad click
              identifiers in the address you arrived on, a coarse device type (phone, tablet or desktop), an
              approximate location (country, and region or city when our network provider supplies one), the
              pages you view, how far you scroll and how long each page is open, page-speed measurements, and
              which buttons you tap (for example a phone number or the quote form) and where they sit on the page.
            </p>
            <p className="mt-2">
              Two first-party cookies tie this together. <code>cgd_sid</code> identifies a single visit and
              expires after 30 minutes without activity. <code>cgd_vid</code> is set by our server on your first
              page view, contains only a random string, and lasts up to 400 days so a later visit can be
              connected to an earlier one. Neither holds your name, contact details or a login. Your IP address is
              used by our server for rate-limiting and that approximate location only, and is not stored with
              these records.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-foreground">Data Sharing</h2>
            <p className="mt-2">
              We may share information with trusted service providers who help us operate our business (e.g.
              scheduling or payment processing tools), and only to the extent necessary for them to perform
              those services. We may also disclose information if required by law.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-foreground">Data Security</h2>
            <p className="mt-2">
              We take reasonable technical and organisational steps to protect the information we hold from
              unauthorised access, loss, or misuse, including secure storage and restricted staff access. No
              method of transmission or storage is completely secure, but we work to keep your information safe.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-foreground">Your Rights</h2>
            <p className="mt-2">
              You can request access to, correction of, or deletion of the personal information we hold about
              you by contacting us using the details below.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-foreground">Contact Us</h2>
            <p className="mt-2">
              If you have questions about this policy, contact us at{" "}
              <ObfuscatedEmail className="font-medium text-primary hover:underline" /> or{" "}
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
