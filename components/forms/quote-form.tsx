import { QuoteFrame } from "@/components/sections/quote-frame";
import { bookingServiceIdFor, BOOKING_SERVICE_IDS } from "@/lib/booking-embed";

interface QuoteFormProps {
  /** Page's service, e.g. "Garage Door Repairs" — mapped to the widget's service picker. */
  service: string;
  /** Page's suburb, e.g. "Joondalup" — pre-filled in the widget. */
  suburb: string;
}

/**
 * Quote request for Service+Suburb pages — the live booking-system quote widget,
 * pre-filled with the page's suburb and closest service. Submissions land in the CRM.
 */
export function QuoteForm({ service, suburb }: QuoteFormProps) {
  return (
    <div className="flex flex-col gap-4">
      <QuoteFrame
        prefill={{
          suburb,
          serviceId: bookingServiceIdFor(service) ?? BOOKING_SERVICE_IDS.repair,
        }}
      />
      <p className="text-center text-xs text-muted-foreground">
        No call-out fee to quote · We typically reply within the hour during business hours.
      </p>
    </div>
  );
}
