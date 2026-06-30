import { m, type Variants } from "framer-motion";
import {
  ArrowRight,
  CalendarCheck,
  Calculator,
  MapPin,
  Phone,
  ReceiptText,
  type LucideIcon,
} from "lucide-react";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import type { ChatAction, ChatActionType } from "./types";

/**
 * Renders the model's call-to-action buttons, each in its own distinct style so the primary next step
 * (book / call) reads as the strongest. `call` is a native tel: anchor; everything else routes through
 * `onAction` so the widget can raise an in-chat overlay (booking / calculator / quote), prefill a
 * suburb check, or navigate to an internal page.
 */

type Variant = "primaryRed" | "primaryBlue" | "outline" | "ghost";

const ACTION_META: Record<ChatActionType, { icon: LucideIcon; variant: Variant }> = {
  call: { icon: Phone, variant: "primaryRed" },
  book: { icon: CalendarCheck, variant: "primaryBlue" },
  calculator: { icon: Calculator, variant: "outline" },
  quote: { icon: ReceiptText, variant: "outline" },
  suburb: { icon: MapPin, variant: "outline" },
  link: { icon: ArrowRight, variant: "ghost" },
};

const VARIANT_CLASS: Record<Variant, string> = {
  primaryRed:
    "bg-gradient-to-br from-[#e0443a] via-cta to-[#a81c23] text-cta-foreground shadow-[0_4px_14px_rgba(200,34,42,0.35)] hover:brightness-105",
  primaryBlue:
    "bg-gradient-to-br from-primary to-[#0f4e9b] text-white shadow-[0_4px_14px_rgba(15,78,155,0.32)] hover:brightness-105",
  outline:
    "border border-primary/25 bg-background text-primary hover:border-primary/45 hover:bg-primary/5",
  ghost:
    "border border-border bg-muted/40 text-foreground hover:bg-muted/70",
};

const baseClass =
  "inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-semibold transition-all";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.25, ease: "easeOut" } },
};

export function ChatActions({
  actions,
  onAction,
}: {
  actions: ChatAction[];
  onAction: (action: ChatAction) => void;
}) {
  if (actions.length === 0) return null;

  return (
    <m.div variants={container} initial="hidden" animate="show" className="flex flex-wrap gap-2">
      {actions.map((action, i) => {
        const meta = ACTION_META[action.type];
        if (!meta) return null;
        const Icon = meta.icon;
        const className = cn(baseClass, VARIANT_CLASS[meta.variant]);
        const key = `${action.type}-${action.value ?? action.href ?? i}`;

        // Native tel: link for the call CTA — most reliable on mobile.
        if (action.type === "call") {
          return (
            <m.a
              key={key}
              variants={item}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              href={`tel:${siteConfig.business.phone}`}
              onClick={() => onAction(action)}
              className={className}
            >
              <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              {action.label}
            </m.a>
          );
        }

        return (
          <m.button
            key={key}
            type="button"
            variants={item}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => onAction(action)}
            className={className}
          >
            <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            {action.label}
          </m.button>
        );
      })}
    </m.div>
  );
}
