"use client";

import * as React from "react";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { Loader2, XIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const BOOKING_URL = "https://booking-system-cgd.netlify.app/";

interface BookingDialogProps {
  /** Optional element that opens the sheet (rendered as the dialog trigger). */
  trigger?: React.ReactElement;
  /** Controlled open state — use with `onOpenChange` to drive the sheet externally. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

/**
 * Shows the live booking system (booking-system-cgd.netlify.app) in an iframe.
 * Slides up as a bottom sheet on phone (matching the chat-assistant pattern),
 * and as a centered panel on larger screens. Either pass a `trigger` element,
 * or drive it externally via `open`/`onOpenChange` (e.g. to share one sheet
 * across several triggers in the hero).
 */
export function BookingDialog({ trigger, open, onOpenChange }: BookingDialogProps) {
  // Bumped on every open so <BookingFrame> remounts with a fresh loading
  // state instead of showing a stale iframe from the previous session.
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
          <DialogPrimitive.Title className="sr-only">Book your service</DialogPrimitive.Title>
          <DialogPrimitive.Description className="sr-only">
            Schedule a garage door appointment using our online booking form.
          </DialogPrimitive.Description>

          {/* Drag-handle affordance — phone only, signals "swipe down to dismiss". */}
          <div className="flex shrink-0 justify-center pt-3 pb-1 sm:hidden">
            <span className="h-1.5 w-10 rounded-full bg-foreground/15" />
          </div>

          <div className="flex shrink-0 items-center justify-between border-b border-border/60 px-4 py-3 sm:px-5">
            <span className="font-heading text-base font-semibold">Book your service</span>
            <DialogPrimitive.Close render={<Button variant="ghost" size="icon-sm" />}>
              <XIcon />
              <span className="sr-only">Close</span>
            </DialogPrimitive.Close>
          </div>

          <BookingFrame key={sessionKey} />
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

function BookingFrame() {
  const [loaded, setLoaded] = React.useState(false);

  return (
    <div className="relative flex-1 bg-background">
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-background">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" aria-hidden="true" />
        </div>
      )}
      <iframe
        src={BOOKING_URL}
        title="Book your garage door service"
        className={cn(
          "h-full w-full border-0 transition-opacity duration-200",
          loaded ? "opacity-100" : "opacity-0"
        )}
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}
