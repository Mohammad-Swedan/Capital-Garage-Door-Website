import type { Metadata } from "next";
import Link from "next/link";
import { Check, ShieldCheck, ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { WarrantyRegistrationFrame } from "@/components/sections/warranty/registration-frame";
import { buildMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = buildMetadata({
  title: "Register or Check Your Warranty | Capital Garage Door",
  description:
    "Register your Capital Garage Door motor warranty or check your warranty status online. Enter your install details to activate your 5-year cover (extendable to 7 years).",
  path: "/warranty-registration",
});

const WHAT_YOU_NEED = [
  "Your install or invoice date",
  "The address the motor was installed at",
  "Your name and contact details",
];

export default function WarrantyRegistrationPage() {
  const { phone, phoneDisplay } = siteConfig.business;

  return (
    <>
      {/* Warm the TLS/DNS connection to the external warranty app early so the
          embedded iframe below starts rendering sooner. React 19 hoists these
          to <head>. */}
      <link rel="preconnect" href="https://booking-system-cgd.netlify.app" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href="https://booking-system-cgd.netlify.app" />

      <Container className="pt-6">
        <Breadcrumbs
          items={[
            { name: "Home", url: "/" },
            { name: "Warranty", url: "/warranty" },
            { name: "Register", url: "/warranty-registration" },
          ]}
        />
      </Container>

      <section className="bg-background">
        <Container className="py-10 sm:py-14">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-600/20 bg-emerald-600/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wide text-emerald-700">
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
              Warranty
            </span>
            <h1 className="mt-5 text-balance font-display text-[clamp(1.75rem,5vw,3rem)] font-black leading-[1.08] tracking-tight text-foreground">
              Register or Check Your Warranty
            </h1>
            <p className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              New customer? Activate your motor warranty so it&apos;s on record against your property.
              Already registered? Use the same form to check your warranty status. It only takes a couple
              of minutes.
            </p>

            <ul className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:gap-x-6">
              {WHAT_YOU_NEED.map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-foreground/90">
                  <Check className="h-4 w-4 shrink-0 text-emerald-600" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      <section className="bg-muted/30 pb-16 sm:pb-20">
        <Container>
          <WarrantyRegistrationFrame />

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Prefer to talk it through? Call{" "}
            <a href={`tel:${phone}`} className="font-semibold text-foreground hover:text-primary">
              {phoneDisplay}
            </a>{" "}
            ·{" "}
            <Link
              href="/warranty"
              className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
            >
              Learn what your warranty covers
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </p>
        </Container>
      </section>
    </>
  );
}
