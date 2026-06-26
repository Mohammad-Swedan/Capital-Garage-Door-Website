import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-card hover:bg-primary/90 hover:shadow-elevated active:shadow-card",
        outline:
          "border-border bg-background hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
        ghost:
          "hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",
        link: "text-primary underline-offset-4 hover:underline",
        // ── Agent 6 premium additions ──────────────────────────────────────
        // Solid red CTA with brand-tinted lift on hover. The marketing call.
        cta: "bg-cta text-cta-foreground shadow-card hover:-translate-y-px hover:bg-[color-mix(in_oklab,var(--cta),white_8%)] hover:shadow-[0_8px_24px_color-mix(in_oklab,var(--cta),transparent_70%)] active:translate-y-0 active:shadow-card",
        // Navy→red gradient with a sheen sweep on hover. The hero/feature CTA.
        gradient:
          "relative isolate overflow-hidden bg-[image:var(--gradient-cta)] text-cta-foreground shadow-elevated hover:-translate-y-px hover:shadow-float active:translate-y-0 before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:bg-[image:var(--gradient-sheen)] before:opacity-0 before:[transform:translateX(-120%)] before:transition-[transform,opacity] before:duration-700 hover:before:opacity-100 hover:before:[transform:translateX(120%)] motion-reduce:before:hidden motion-reduce:hover:translate-y-0",
        // Navy gradient with a subtle inner top-highlight — premium, calmer.
        premium:
          "bg-[image:var(--gradient-navy)] text-primary-foreground shadow-[var(--shadow-inner-highlight),var(--shadow-elevated)] hover:-translate-y-px hover:shadow-[var(--shadow-inner-highlight),var(--shadow-float)] active:translate-y-0 motion-reduce:hover:translate-y-0",
      },
      size: {
        default:
          "h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        xs: "h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-9 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        icon: "size-8",
        "icon-xs":
          "size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg",
        "icon-lg": "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  render,
  nativeButton,
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      render={render}
      // When `render` swaps in a non-<button> element (e.g. a Next.js <Link>),
      // tell Base UI not to assume native button semantics. Callers can still
      // override explicitly (e.g. when rendering a real <button>).
      nativeButton={nativeButton ?? render === undefined}
      {...props}
    />
  )
}

export { Button, buttonVariants }
