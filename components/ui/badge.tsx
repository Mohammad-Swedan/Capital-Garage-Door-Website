import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-4xl border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground [a]:hover:bg-primary/80",
        secondary:
          "bg-secondary text-secondary-foreground [a]:hover:bg-secondary/80",
        destructive:
          "bg-destructive/10 text-destructive focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:focus-visible:ring-destructive/40 [a]:hover:bg-destructive/20",
        outline:
          "border-border text-foreground [a]:hover:bg-muted [a]:hover:text-muted-foreground",
        ghost:
          "hover:bg-muted hover:text-muted-foreground dark:hover:bg-muted/50",
        link: "text-primary underline-offset-4 hover:underline",
        // ── Agent 6 tonal variants ─────────────────────────────────────────
        // Soft, low-chroma fills for status/labelling. Tinted in dark mode.
        brand:
          "bg-brand-soft text-primary [a]:hover:bg-[color-mix(in_oklab,var(--brand),transparent_82%)] dark:text-foreground",
        cta: "bg-cta-soft text-cta [a]:hover:bg-[color-mix(in_oklab,var(--cta),transparent_82%)] dark:text-foreground",
        success:
          "bg-[color-mix(in_oklab,oklch(0.62_0.17_150),transparent_88%)] text-[oklch(0.46_0.15_150)] dark:text-[oklch(0.8_0.16_150)]",
        warning:
          "bg-[color-mix(in_oklab,oklch(0.78_0.16_75),transparent_85%)] text-[oklch(0.5_0.13_70)] dark:text-[oklch(0.85_0.15_80)]",
        info: "bg-[color-mix(in_oklab,oklch(0.6_0.16_240),transparent_88%)] text-[oklch(0.45_0.16_250)] dark:text-[oklch(0.8_0.13_245)]",
        // Solid red CTA pill.
        solid:
          "bg-cta text-cta-foreground [a]:hover:bg-[color-mix(in_oklab,var(--cta),black_8%)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant }), className),
      },
      props
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  })
}

export { Badge, badgeVariants }
