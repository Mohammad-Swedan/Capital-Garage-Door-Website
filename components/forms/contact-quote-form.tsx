import { QuoteFrame } from "@/components/sections/quote-frame";

/**
 * Quote request for the /contact page — the live booking-system quote widget.
 * Nothing is known about the visitor here, so no fields are pre-filled;
 * submissions land directly in the CRM.
 */
export function ContactQuoteForm() {
  return (
    <div className="flex flex-col gap-4">
      <QuoteFrame />
      <p className="text-center text-xs text-muted-foreground">
        No call-out fee to quote · We typically reply within the hour during business hours.
      </p>
    </div>
  );
}
