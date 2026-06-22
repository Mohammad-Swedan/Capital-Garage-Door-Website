"use client";

import * as React from "react";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { XIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SmartPriceCalculator } from "@/components/sections/smart-calculator";

interface CalculatorDialogProps {
  trigger?: React.ReactElement;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

/**
 * Hosts the chat-style SmartPriceCalculator in a modal — bottom sheet on
 * phone, large centered panel on desktop, mirroring BookingDialog's pattern.
 */
export function CalculatorDialog({ trigger, open, onOpenChange }: CalculatorDialogProps) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogPrimitive.Trigger render={trigger} />}
      <DialogPrimitive.Portal>
        <DialogPrimitive.Backdrop
          className="fixed inset-0 z-50 bg-black/30 transition-opacity duration-200 data-ending-style:opacity-0 data-starting-style:opacity-0 supports-backdrop-filter:backdrop-blur-xs"
        />
        <DialogPrimitive.Popup
          className={cn(
            "fixed z-50 flex flex-col overflow-hidden bg-transparent outline-none transition-all duration-300 ease-out",
            "left-0 right-0 top-auto bottom-0 h-[92dvh]",
            "data-starting-style:translate-y-full data-ending-style:translate-y-full",
            "sm:top-1/2 sm:left-1/2 sm:right-auto sm:bottom-auto sm:h-[min(44rem,88dvh)] sm:w-full sm:max-w-2xl sm:-translate-x-1/2 sm:-translate-y-1/2",
            "sm:data-starting-style:translate-y-[-50%] sm:data-ending-style:translate-y-[-50%] sm:data-starting-style:scale-95 sm:data-ending-style:scale-95 sm:data-starting-style:opacity-0 sm:data-ending-style:opacity-0"
          )}
        >
          <DialogPrimitive.Title className="sr-only">Garage Door Price Calculator</DialogPrimitive.Title>
          <DialogPrimitive.Description className="sr-only">
            Get an instant cost estimate for your garage door service.
          </DialogPrimitive.Description>

          <DialogPrimitive.Close
            render={<Button variant="ghost" size="icon-sm" />}
            className="absolute right-3 top-3 z-20 rounded-full bg-white/90 shadow-md ring-1 ring-slate-200 hover:bg-white sm:right-4 sm:top-4"
          >
            <XIcon className="h-4 w-4 text-slate-700" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>

          <div className="h-full w-full overflow-hidden rounded-t-3xl sm:rounded-3xl [&>div]:h-full [&>div]:max-w-none [&>div]:rounded-t-3xl [&>div]:border-0 [&>div]:shadow-none [&>div]:sm:rounded-3xl">
            <SmartPriceCalculator />
          </div>
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
