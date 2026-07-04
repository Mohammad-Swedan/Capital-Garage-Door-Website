import { Phone } from "lucide-react";
import { QuoteFrame } from "@/components/sections/quote-frame";
import { bookingServiceIdFor, BOOKING_SERVICE_IDS } from "@/lib/booking-embed";
import { siteConfig } from "@/config/site";

interface QuoteFormProps {
  problem: string;
  heading?: string;
}

/**
 * Quote request for problem pages — the live booking-system quote widget, pre-selected
 * to the repair service (problem pages describe repair issues). Owns the #get-quote
 * anchor the "Request Help" CTA scrolls to. Submissions land in the CRM.
 */
export function QuoteForm({ problem, heading = "Get a Free Quote" }: QuoteFormProps) {
  return (
    <div id="get-quote" className="scroll-mt-24 rounded-3xl border border-border bg-card p-6 shadow-[0_8px_32px_rgba(13,31,69,0.08)] sm:p-8">
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
          prefill={{ serviceId: bookingServiceIdFor(problem) ?? BOOKING_SERVICE_IDS.repair }}
        />
      </div>
    </div>
  );
}
