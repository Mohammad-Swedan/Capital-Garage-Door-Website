"use client";

import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip";
import { cn } from "@/lib/utils";

function TooltipProvider(props: TooltipPrimitive.Provider.Props) {
  return <TooltipPrimitive.Provider {...props} />;
}

function TooltipPopup({
  className,
  ...props
}: TooltipPrimitive.Popup.Props) {
  return (
    <TooltipPrimitive.Popup
      className={cn(
        "rounded-md bg-popover px-2.5 py-1 text-xs font-medium text-popover-foreground shadow-elevated ring-1 ring-border/40",
        "origin-[var(--transform-origin)] transition-[opacity,scale,translate] duration-100",
        "data-[starting-style]:scale-90 data-[starting-style]:opacity-0",
        "data-[ending-style]:opacity-0",
        className,
      )}
      {...props}
    />
  );
}

export { TooltipProvider, TooltipPopup, TooltipPrimitive };
