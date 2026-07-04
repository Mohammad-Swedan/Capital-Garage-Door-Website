import { Phone } from "lucide-react";
import { QuoteFrame } from "@/components/sections/quote-frame";
import { bookingServiceIdFor, BOOKING_SERVICE_IDS } from "@/lib/booking-embed";
import { siteConfig } from "@/config/site";

interface ServiceQuoteFormProps {
  serviceName: string;
  heading?: string;
}

/**
 * Quote request for service pages — the live booking-system quote widget, pre-selected
 * to the closest matching service. Owns the #quote anchor every "Request a Quote" CTA
 * scrolls to. Submissions land directly in the CRM.
 */
export function ServiceQuoteForm({ serviceName, heading = "Request a Free Quote" }: ServiceQuoteFormProps) {
  return (
    <div id="quote" className="scroll-mt-24 rounded-3xl border border-border bg-card p-6 shadow-[0_8px_32px_rgba(13,31,69,0.08)] sm:p-8">
      <div className="flex flex-col gap-1.5 sm:flex-row sm:items-baseline sm:justify-between">
        <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {heading}
        </h2>
        <a
          href={`tel:${siteConfig.business.phone}`}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-cta hover:underline"
        >
          <Phone className="h-4 w-4" aria-hidden="true" />
          Prefer to call? {siteConfig.business.phoneDisplay}
        </a>
      </div>

      <div className="mt-6">
        <QuoteFrame
          prefill={{ serviceId: bookingServiceIdFor(serviceName) ?? BOOKING_SERVICE_IDS.repair }}
        />
      </div>
    </div>
  );
}
