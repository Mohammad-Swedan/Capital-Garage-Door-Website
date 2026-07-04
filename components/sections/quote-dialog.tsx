"use client";

import * as React from "react";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { XIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { QuoteFrame } from "@/components/sections/quote-frame";
import type { QuoteEmbedPrefill } from "@/lib/booking-embed";

interface QuoteDialogProps {
  /** Optional element that opens the sheet (rendered as the dialog trigger). */
  trigger?: React.ReactElement;
  /** Controlled open state — use with `onOpenChange` to drive the sheet externally. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Fields to pre-fill in the quote widget (suburb, serviceId, …). */
  prefill?: QuoteEmbedPrefill;
}

/**
 * Shows the live quote-request widget (booking-system-cgd.netlify.app/embed/quote) in the
 * same sheet/panel chrome as BookingDialog: a bottom sheet on phone, a centered panel on
 * larger screens. Either pass a `trigger` element, or drive it externally via
 * `open`/`onOpenChange`.
 */
export function QuoteDialog({ trigger, open, onOpenChange, prefill }: QuoteDialogProps) {
  // Bumped on every open so the frame remounts with a fresh loading state
  // instead of showing a stale wizard from the previous session.
  const [sessionKey, setSessionKey] = React.useState(0);

  const handleOpenChange = (next: boolean) => {
    if (next) setSessionKey((key) => key + 1);
    onOpenChange?.(next);
  };

  return (
    <DialogPrimitive.Root open={open} onOpenChange={handleOpenChange}>
      {trigger && <DialogPrimitive.Trigger render={trigger} />}
      <DialogPrimitive.Portal>
        <DialogPrimitive.Backdrop
          className="fixed inset-0 z-50 bg-black/20 transition-opacity duration-200 data-ending-style:opacity-0 data-starting-style:opacity-0 supports-backdrop-filter:backdrop-blur-xs"
        />
        <DialogPrimitive.Popup
          className={cn(
            "fixed z-50 flex flex-col overflow-hidden bg-popover text-popover-foreground shadow-2xl outline-none ring-1 ring-foreground/10 transition-all duration-300 ease-out",
            // Phone: bottom sheet that slides up from off-screen.
            "left-0 right-0 top-auto bottom-0 h-[88dvh] max-h-176 rounded-t-3xl",
            "data-starting-style:translate-y-full data-ending-style:translate-y-full",
            // Tablet/desktop: centered panel that fades + scales in.
            "sm:top-1/2 sm:left-1/2 sm:right-auto sm:bottom-auto sm:h-[min(42rem,85dvh)] sm:w-full sm:max-w-lg sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-3xl",
            "sm:data-starting-style:translate-y-[-50%] sm:data-ending-style:translate-y-[-50%] sm:data-starting-style:scale-95 sm:data-ending-style:scale-95 sm:data-starting-style:opacity-0 sm:data-ending-style:opacity-0"
          )}
        >
          <DialogPrimitive.Title className="sr-only">Request a quote</DialogPrimitive.Title>
          <DialogPrimitive.Description className="sr-only">
            Request a garage door quote using our online quote form.
          </DialogPrimitive.Description>

          {/* Drag-handle affordance — phone only, signals "swipe down to dismiss". */}
          <div className="flex shrink-0 justify-center pt-3 pb-1 sm:hidden">
            <span className="h-1.5 w-10 rounded-full bg-foreground/15" />
          </div>

          <div className="flex shrink-0 items-center justify-between border-b border-border/60 px-4 py-3 sm:px-5">
            <span className="font-heading text-base font-semibold">Request a quote</span>
            <DialogPrimitive.Close render={<Button variant="ghost" size="icon-sm" />}>
              <XIcon />
              <span className="sr-only">Close</span>
            </DialogPrimitive.Close>
          </div>

          <QuoteFrame key={sessionKey} fill prefill={prefill} className="rounded-none" />
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
