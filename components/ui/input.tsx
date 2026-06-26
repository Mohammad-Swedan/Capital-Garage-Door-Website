import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/lib/utils"

type InputProps = React.ComponentProps<"input"> & {
  /** `filled` swaps the transparent field for a tinted muted surface. */
  variant?: "default" | "filled"
  /** `lg` gives a larger, more tappable field (44px) for forms/mobile. */
  inputSize?: "default" | "lg"
}

function Input({
  className,
  type,
  variant = "default",
  inputSize = "default",
  ...props
}: InputProps) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      data-variant={variant}
      className={cn(
        // Shared base — identical to the original aside from a slightly richer
        // focus ring (now also tints the border toward the ring colour).
        "w-full min-w-0 rounded-lg border bg-transparent px-2.5 py-1 text-base transition-[color,box-shadow,background-color,border-color] outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
        // Default keeps the original border + dark transparent fill.
        variant === "default" && "border-input dark:bg-input/30",
        // Filled: muted surface, border only appears on focus/invalid.
        variant === "filled" &&
          "border-transparent bg-muted/60 hover:bg-muted focus-visible:bg-background dark:bg-input/40 dark:hover:bg-input/55",
        // Default height matches the original h-8; lg is a comfortable touch size.
        inputSize === "default" && "h-8",
        inputSize === "lg" && "h-11 rounded-xl px-3.5 text-base md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Input }
export type { InputProps }
