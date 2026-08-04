# Lead-completion events + AU citations pack — design (2026-08-04)

Two approved growth workstreams. Goal: more customers, measurably — (A) record real quote/booking
submissions in GA4 (today only form-*opens* are tracked; submissions vanish into the cross-origin
booking iframe), and (B) build the business's first citation/backlink base (~0 known backlinks vs
competitors ranking on as few as 14).

## Part A — booking-widget completion events

### The postMessage contract (widget → embedding page)

- **Quote submitted:** `{ type: "cgd:quote-complete", serviceId: number | null }` — no personal data.
- **Booking completed:** `{ type: "cgd:booking-complete", ref, name, phone }` — exactly the shape
  `components/sections/chat/in-chat-booking.tsx` has been waiting for since it shipped (it powers the
  in-thread "Booked!" confirmation and auto-close).
- **Sending rule:** only when actually embedded (`window.parent !== window`), and only to an
  explicit parent-origin allow-list — `https://capitalgaragedoors.com.au`,
  `https://cgdperth.netlify.app` (warm standby), `http://localhost:3000`, `http://localhost:3001`.
  `postMessage` silently drops on origin mismatch, so the booking payload (which echoes the
  customer's own name/phone back to the page they're on) can never reach an unknown parent.
  Send in a loop over the list; fire-and-forget.

### Widget repo changes (`BookingService-Interface`, deployed by Netlify from `main`)

1. `src/lib/parent-notify.ts` (new, ~20 lines): the allow-list + `notifyParent(payload)` helper.
2. `src/components/customer/QuoteRequestForm.tsx`: in the request mutation's `onSuccess` (the
   existing inline-success path), call `notifyParent({ type: "cgd:quote-complete", serviceId })`.
3. `src/pages/customer/ConfirmationPage.tsx`: when the booking query resolves, emit
   `cgd:booking-complete` once (guarded by a ref). Trigger on `window.parent !== window`, **not**
   on the `/embed/` path check — the site's BookingDialog embeds the app root, so the non-embed
   confirmation route also renders inside an iframe and must emit too.

### Site repo changes (this repo)

1. `lib/analytics.ts`: add `quote_submit` and `booking_submit` to `AnalyticsEvent`.
2. `components/analytics/interaction-tracking.tsx`: one global `message` listener (same delegated
   pattern as `call_click`) — accept only `event.origin === <booking app origin>` (reuse the
   existing origin constant used by `in-chat-booking.tsx` / `lib/booking-embed.ts`), map
   `cgd:quote-complete` → `track("quote_submit", { path, service_id })` and
   `cgd:booking-complete` → `track("booking_submit", { path })`. **Name/phone are never forwarded
   to analytics** — they exist only for the in-chat confirmation UI.
3. `components/sections/booking-dialog.tsx`: update the now-stale "emits no completion message"
   comment; same for the `lib/booking-embed.ts` contract notes and the CLAUDE.md analytics table +
   quote-embed section ("no completion message" claims become wrong the moment this ships).
4. In-chat booking auto-close: zero changes — its listener starts receiving the event for free.

### Verification & rollout

- `npm run typecheck` + `npm run build` in the widget repo; `npx tsc --noEmit` + build here.
- Local end-to-end: site dev + widget dev, submit one quote marked "TEST — please ignore" →
  assert both events appear in `dataLayer`/gtag; delete the test record from the CRM.
- Deploy widget first (push its repo → Netlify), then this repo (push → VPS). One production TEST
  quote to confirm, then delete it.
- Rollback: `git revert` on either side — the message is fire-and-forget, so a one-sided deploy
  changes nothing user-visible.
- User action (2 min): GA4 → Admin → Events → mark `quote_submit` and `booking_submit` as key
  events, so reports and (later) Google Ads treat them as conversions.

### Out of scope (deliberately)

No server-side CRM → GA4 Measurement Protocol backstop — it can't attribute a lead to the page
that produced it without fragile client-id plumbing. Revisit only if/when Google Ads launches.

## Part B — citations & backlinks pack

### Deliverables (this repo — public, so the pack contains only already-public business info)

1. `docs/marketing/citations-pack.md`:
   - Exact NAP block sourced from `config/site.ts` + the Google Business Profile (13 Amrock
     Street) — the same string everywhere, character for character; hours phrased per
     `formatHoursSummary()`. The business **email is not written in the doc** (this repo never
     publishes it in plaintext) — each entry says "use the business email".
   - Three description lengths (~50 / ~150 / ~750 chars), category picks, service list, service
     area, logo + photo CDN URLs ready to upload.
   - Tier-1 AU citation list (~15): Bing Places, Apple Business Connect, Yellow Pages AU, White
     Pages AU, TrueLocal, Localsearch, StartLocal, AussieWeb, Yelp AU, Hotfrog AU, Cylex AU,
     Oneflare, hipages, ServiceSeeking, Word of Mouth — each with URL, free/paid flag, and quirks
     (ABN required, phone/postcard verification, etc.).
   - Supplier/dealer outreach email drafts: B&D accredited dealer listing, Steel-Line, Centurion
     stockist pages (all brands the site already names).
   - Shortlist of 5–8 Perth community/sport sponsorship link candidates.
2. `docs/marketing/citations-tracker.csv` — site, url, tier, cost, status, live_url,
   date_submitted, date_verified, notes.

### Split of work

- **Me:** write the pack + tracker; after each signup, verify the listing is live (fetch + record
  `live_url`), watch Bing Webmaster Tools for the links registering, and report what's live vs
  pending on request.
- **User:** the account signups/submissions themselves (they need your email + phone verification),
  and have the **ABN** handy — several directories require it (it's also still the `config/site.ts`
  TODO, so filling it unlocks the footer/schema at the same time).

### Success criteria

- **A:** `quote_submit` / `booking_submit` visible in GA4 Realtime from a production test; lead
  counts per landing page available in GA4 Explore.
- **B:** ≥10 live, NAP-consistent listings within 2–3 weeks of signups; first non-directory link
  (supplier/dealer page) within a month; both visible in Bing Webmaster's inbound-link report.
