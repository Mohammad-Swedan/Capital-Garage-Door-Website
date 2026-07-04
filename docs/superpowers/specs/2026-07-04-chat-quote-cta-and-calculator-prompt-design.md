# Chat: persistent quote CTA + reliable calculator-on-pricing — design

**Date:** 2026-07-04
**Goal:** Two enhancements to the Smart Garage Assistant chat:
1. A persistent "Get a quote" CTA in the chat, always reachable, opening the live quote embed.
2. When the customer asks about pricing, the AI reliably offers a button to open the price
   calculator (which opens *inside* the chat).

## Context

The chat's CTA buttons are the model-generated `actions` in the CMS envelope
(`{ reply, suggestions, actions }`), rendered by `components/sections/chat/chat-actions.tsx`.
Two relevant action types already flow end-to-end:
- `quote` → the widget raises the `quote` overlay (`InChatQuote`), which since the
  2026-07-04 quote-embed change hosts the live booking-system quote widget.
- `calculator` → the widget raises the `calculator` overlay (the `SmartPriceCalculator`
  inside the chat sheet).

So both entry points exist, but they only appear when the LLM chooses to emit them. This
change makes each **reliably present**.

## Feature 1 — persistent header "Get a quote" button (frontend)

**File:** `components/sections/ai-chat-widget.tsx` (header control cluster, ~line 252).

Add a compact button before the existing Call pill, giving `[ Quote ] [ Call ] [ ✕ ]`.
- **Action:** `onClick` sets `overlay = "quote"` (the existing overlay state), which already
  renders `<InChatQuote onClose={…} />` — the embed. No new state, no new component.
- **Style:** translucent white (`bg-white/15 ring-1 ring-white/25 hover:bg-white/25`) so the
  solid-white **Call** pill stays the strongest CTA (call = emergency path). Same 36px
  round footprint as Call on mobile; icon + "Quote" label on `sm+` (matching Call's
  `sr-only sm:not-sr-only` pattern). Icon: `ReceiptText` (already imported; the quote
  action's icon).
- **Tracking:** `trackChatEvent("chat_quote_open", { source: "header" })` on click.

The header sits under the overlays (`z-10` vs overlay `z-20`), so no need to hide the button
while an overlay is open.

## Feature 2 — reliable calculator action on pricing intent (CMS prompt)

**File:** `CapitalGarageDoor.Cms.Application/Features/Assistant/AssistantPrompt.cs`
(separate CMS repo).

The `calculator` action already exists in the ACTION CATALOGUE but with a soft trigger
("when they want a ballpark price and an interactive estimate would help"). Two edits:
1. Sharpen the catalogue line so pricing questions are the explicit trigger.
2. Add a sentence to PRICING RULES: whenever answering about price / cost / "how much" /
   an estimate, include the `calculator` action so the customer can get an instant
   interactive estimate.

No schema/DTO/code change — the action type is already handled by the frontend and the
`ChatActionDto`.

## Trade-offs

- Feature 2 leans on the LLM (user's explicit choice over frontend keyword detection): right
  the large majority of the time, not a hard per-turn guarantee. Fallback if a guarantee is
  ever needed: frontend keyword detection appending a `calculator` action — noted, not built.
- Verification: the CMS was down (port 5179) during this work; the prompt edit is a plain
  string change that takes effect only after the CMS is rebuilt/restarted, and cannot be
  runtime-verified against the live LLM from here. Feature 1 is browser-verified; Feature 2
  is verified by prompt diff.

## Out of scope

No changes to the booking/quote embed itself, the calculator, `chat-actions.tsx`, or the
action/DTO schema.
