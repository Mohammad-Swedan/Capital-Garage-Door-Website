import { ChevronLeft } from "lucide-react";
import { QuoteFrame } from "@/components/sections/quote-frame";
import type { QuoteEmbedPrefill } from "@/lib/booking-embed";

/**
 * Quote request shown as a panel INSIDE the chat/calculator card (rather than a separate
 * dialog), so the user never loses their place. Hosts the live booking-system quote widget —
 * submissions land directly in the CRM. The calculator hand-off pre-fills suburb/service via
 * the widget's URL params; there is no quote-complete postMessage from the widget (yet), so
 * the manual "Back to chat" button is how the user returns.
 */
export function InChatQuote({
  prefill,
  onClose,
}: {
  /** Fields to pre-fill in the widget (from the calculator selection), if known. */
  prefill?: QuoteEmbedPrefill;
  onClose: () => void;
}) {
  return (
    <div className="absolute inset-0 z-20 flex flex-col bg-background">
      <div className="flex shrink-0 items-center gap-2 border-b border-border bg-background px-3 py-2.5">
        <button
          type="button"
          onClick={onClose}
          className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold text-primary transition-colors hover:bg-primary/5"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          Back to chat
        </button>
        <span className="ml-auto text-sm font-semibold text-foreground">Request a quote</span>
      </div>

      <QuoteFrame fill prefill={prefill} className="rounded-none" />
    </div>
  );
}
