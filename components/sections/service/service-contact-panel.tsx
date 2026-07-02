import { Phone, MapPin, Clock, ShieldCheck } from "lucide-react";
import { siteConfig } from "@/config/site";
import { formatHour } from "@/lib/utils";

const { business } = siteConfig;

/**
 * On-page NAP + business-hours panel shown beside the service-page quote form.
 * Surfaces address, click-to-call, and opening hours in the page body (not just
 * the footer) — a local-SEO / conversion signal (on-page-seo.md Category 14).
 * Server component: all data is static from siteConfig.
 */
export function ServiceContactPanel({ serviceName }: { serviceName: string }) {
  const { address } = business;
  const weekday = business.hours.find((h) => h.day === "Monday");
  const saturday = business.hours.find((h) => h.day === "Saturday");
  const sunday = business.hours.find((h) => h.day === "Sunday");

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-xs font-bold tracking-wider text-cta uppercase">Get a quote</p>
        <h2 className="mt-2 font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Book {serviceName} in Perth
        </h2>
        <p className="mt-3 text-muted-foreground">
          Licensed, insured, and local. Send the form and we&apos;ll get back to you fast with a
          fair, no-obligation quote — or call now and speak to a technician.
        </p>
      </div>

      <ul className="flex flex-col gap-4 text-sm">
        <li className="flex items-start gap-3">
          <Phone className="mt-0.5 h-5 w-5 shrink-0 text-cta" aria-hidden="true" />
          <a
            href={`tel:${business.phone}`}
            className="font-semibold text-foreground hover:text-cta"
          >
            {business.phoneDisplay}
          </a>
        </li>
        <li className="flex items-start gap-3">
          <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-cta" aria-hidden="true" />
          <address className="text-muted-foreground not-italic">
            {address.streetAddress}, {address.addressLocality} {address.addressRegion}{" "}
            {address.postalCode}
          </address>
        </li>
        <li className="flex items-start gap-3">
          <Clock className="mt-0.5 h-5 w-5 shrink-0 text-cta" aria-hidden="true" />
          <div className="flex-1 space-y-1 text-muted-foreground">
            <div className="flex justify-between gap-6">
              <span>Mon&ndash;Fri</span>
              <span className="font-medium text-foreground">
                {formatHour(weekday?.opens ?? "")} &ndash; {formatHour(weekday?.closes ?? "")}
              </span>
            </div>
            <div className="flex justify-between gap-6">
              <span>Saturday</span>
              <span className="font-medium text-foreground">
                {formatHour(saturday?.opens ?? "")} &ndash; {formatHour(saturday?.closes ?? "")}
              </span>
            </div>
            <div className="flex justify-between gap-6">
              <span>Sunday</span>
              <span className="font-medium text-foreground">{formatHour(sunday?.opens ?? "")}</span>
            </div>
          </div>
        </li>
      </ul>

      <span className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-muted/50 px-3.5 py-1.5 text-xs font-medium text-muted-foreground">
        <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
        Licensed &amp; Insured
      </span>
    </div>
  );
}
