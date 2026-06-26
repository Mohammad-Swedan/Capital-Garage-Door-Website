import * as React from "react"

import { cn } from "@/lib/utils"

type TextareaProps = React.ComponentProps<"textarea"> & {
  /** `filled` swaps the transparent field for a tinted muted surface. */
  variant?: "default" | "filled"
}

function Textarea({
  className,
  variant = "default",
  ...props
}: TextareaProps) {
  return (
    <textarea
      data-slot="textarea"
      data-variant={variant}
      className={cn(
        "flex field-sizing-content min-h-16 w-full rounded-lg border bg-transparent px-2.5 py-2 text-base transition-[color,box-shadow,background-color,border-color] outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
        variant === "default" && "border-input dark:bg-input/30",
        variant === "filled" &&
          "border-transparent bg-muted/60 hover:bg-muted focus-visible:bg-background dark:bg-input/40 dark:hover:bg-input/55",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
export type { TextareaProps }
