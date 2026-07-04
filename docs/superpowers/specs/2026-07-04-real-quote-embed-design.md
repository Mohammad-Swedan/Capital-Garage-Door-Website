# Real quote-request embed — design

**Date:** 2026-07-04
**Goal:** Every "request a quote" surface on the site currently posts to the `submitQuote` stub
(console.log only). Replace them all with the business's real quote widget, embedded from the
live booking system: `https://booking-system-cgd.netlify.app/embed/quote`, pre-filling fields
via URL query where the page already knows them.

## Embed contract (from the booking-system docs + verified against the deployed bundle)

- Embed URL: `https://booking-system-cgd.netlify.app/embed/quote`
- Allowed prefill query keys: `firstName`, `lastName`, `email`, `mobilePhone`, `address`,
  `address2`, `suburb`, `state`, `postCode`, `serviceId`.
- Iframe attributes per the widget docs: `allow="payment"`,
  `sandbox="allow-scripts allow-same-origin allow-forms allow-popups"`, no border,
  12px radius, width 100%, initial height 700.
- Auto-resize: the widget posts `{ type: "booking-widget-resize", height }` to the parent
  (ResizeObserver-driven, target origin `*`). Host listens and sets the iframe height so the
  wizard never shows an internal scrollbar. There is **no** quote-complete postMessage (verified
  in the bundle) — the old `onSubmitted` lead-capture callback cannot be preserved; the CRM now
  receives the lead directly, which is the point.
- Live service catalog (GET `https://crmservice.runasp.net/api/Categories`, anonymous):
  - **3** Expert Garage Door Repairs (repairs default — matches the user's example URL)
  - **2** Free Installation Quote – By Phone
  - **7** Garage Door Tune-Up
  - **9** Emergency Repair
  - (1 Free Phone Consultation, 8 On-Site Measure & Design — not used as defaults)

## Architecture

1. **`lib/booking-embed.ts`** (plain TS, shared): origin/path constants, `QuoteEmbedPrefill`
   type (exactly the allowed keys), `buildQuoteEmbedSrc(prefill)`, `BOOKING_SERVICE_IDS`
   (repair 3 / installation 2 / tuneUp 7 / emergency 9), and `bookingServiceIdFor(text)` —
   keyword mapper from service/topic labels to a service id (returns undefined when unsure).
2. **`components/sections/quote-frame.tsx`** (client): `QuoteFrame({ prefill, fill })` —
   the iframe with spec attributes + loading spinner. Default mode auto-resizes from the
   `booking-widget-resize` messages (origin- and source-checked); `fill` mode is `h-full`
   for dialog/chat overlays where the frame owns the panel and scrolls internally.
3. **`components/sections/quote-dialog.tsx`** (client): `QuoteDialog` — clone of
   `BookingDialog` (bottom sheet on phone / centered panel on sm+), hosting a `fill`
   QuoteFrame, remounted per open.
4. **`GetQuoteButton`** added to `components/page/cta-buttons.tsx` (same pattern as
   `BookNowButton`, dynamic `ssr:false` QuoteDialog); used by the home About section in place
   of its `/contact` link.

## Surfaces replaced (form → embed)

| Surface | File | Prefill |
|---|---|---|
| Service+suburb pages | `components/forms/quote-form.tsx` | `suburb`, serviceId from service |
| /contact | `components/forms/contact-quote-form.tsx` | — |
| /lp/* landing pages | `components/forms/landing-quote-form.tsx` (call site `landing-hero.tsx` simplified) | serviceId from serviceLabel (emergency → 9) |
| Service pages + motors page | `components/sections/service/quote-form.tsx` | serviceId from serviceName |
| Problem pages | `components/sections/problem/quote-form.tsx` | serviceId → repair (3) |
| Cost guides | `components/sections/cost-guide/quote-form.tsx` | serviceId from topic, default repair |
| Comparison pages | `components/sections/comparison/quote-form.tsx` | serviceId from topic, default installation-quote (2) |
| Chat + calculator overlay | `components/sections/chat/in-chat-quote.tsx` | calculator: `suburb` + serviceId from serviceType/emergency; chat: none |
| Home About section CTA | `components/sections/about.tsx` | opens `QuoteDialog` |

Section shells (card, heading, "Prefer to call?" link) and anchor ids (`#quote`, `#get-quote`)
are kept so every existing "Request Quote"/"Upload Photo" CTA and hero anchor keeps working.

## Removals

- `lib/actions/quote.ts` (`submitQuote` stub) — no callers remain.
- `components/sections/chat/quote-prefill.ts` (`buildChatQuoteNotes`) — the embed has no
  notes field, so transcript summaries can't be injected.
- `QuotePrefill.notes`/`service` and the `estimate` argument of `buildQuotePrefill`
  (`estimate-logic.ts`) — reshaped to `{ suburb, serviceId }`.
- `QuoteLead`/`onSubmitted` plumbing in `ai-chat-widget.tsx` and `smart-calculator/index.tsx`
  (no completion message exists to drive it). `app/api/chat/lead` route stays (still the
  documented lead endpoint; harmless without callers).

## Trade-offs accepted

- UTM/gclid attribution fields previously posted with the stub forms are not forwardable
  (not in the allowed key list) — noted for a future booking-app enhancement.
- Old forms had a free-text message + photo upload at top level; the embed wizard handles
  its own fields from here.
