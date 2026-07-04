import { QuoteFrame } from "@/components/sections/quote-frame";
import { bookingServiceIdFor, BOOKING_SERVICE_IDS } from "@/lib/booking-embed";

interface LandingQuoteFormProps {
  /** Service this landing page is about — mapped to the widget's service picker. */
  service: string;
}

/**
 * Quote request for Google Ads landing pages — the live booking-system quote widget,
 * pre-selected to the page's service (emergency landing pages map to the emergency
 * service). Submissions land directly in the CRM.
 */
export function LandingQuoteForm({ service }: LandingQuoteFormProps) {
  return (
    <div className="flex flex-col gap-4">
      <QuoteFrame
        prefill={{ serviceId: bookingServiceIdFor(service) ?? BOOKING_SERVICE_IDS.repair }}
      />
      <p className="text-center text-xs text-muted-foreground">
        No call-out fee to quote · We typically reply within the hour during business hours.
      </p>
    </div>
  );
}
