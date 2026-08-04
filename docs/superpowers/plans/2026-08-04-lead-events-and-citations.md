# Lead-Completion Events + AU Citations Pack — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make submitted quotes and completed bookings measurable per landing page in GA4, and produce the business's first citation/backlink acquisition pack.

**Architecture:** The booking widget (a separate React/Vite app embedded cross-origin in an iframe) gains a `notifyParent()` helper that `postMessage`s two completion events to an allow-list of our own origins. This site adds one global `message` listener beside the existing delegated click listener, maps the message to a GA4 event through a pure exported function, and drops all personal data. The citations work is documentation only — a pack plus a tracker the user works through.

**Tech Stack:** Widget repo = React 18 + Vite + TypeScript + react-router-dom + TanStack Query (`C:\Users\Mohammad swedan\desktop\projects\BookingService-Interface\BookingService-Interface`, GitHub `Mohammad-Swedan/BookingService-Interface`, deployed by Netlify from `main` to `https://booking-system-cgd.netlify.app`). Site repo = Next.js 16 + React 19 (this repo; push to `main` deploys to the VPS).

## Global Constraints

- **Neither repo has a test runner.** The widget's `package.json` has no `test` script; this repo's CLAUDE.md states "There is no test suite" and names `npm run build` as the correctness gate. Verification in this plan is therefore: typecheck, lint, build, one `npx tsx` assertion script for the single pure function, and scripted browser end-to-end checks. Do **not** add vitest/jest to either repo — out of scope.
- **This repo is public.** No secrets, credentials, or the VPS origin IP in any committed file.
- **Personal data never reaches analytics.** `name`, `phone`, `email`, address and the booking ref are for UI only. Analytics params are limited to `service_id` plus the automatic `page`.
- **`postMessage` target origins are always explicit.** Never `"*"` for the completion messages (the existing resize reporter's `"*"` is fine — it carries only a number and embedder origins are unknown by design).
- **GA4 naming:** snake_case, event and parameter names ≤40 chars. Event names are permanent — renaming one splits its history.
- **NAP is exact and single-source.** Name, address, phone and hours come from `config/site.ts` and must match the Google Business Profile character for character. Hours in prose follow `formatHoursSummary()` (`lib/utils.ts`).
- **Message type strings are fixed by an existing consumer.** `components/sections/chat/in-chat-booking.tsx` already listens for `{ type: "cgd:booking-complete", ref, name, phone }`. That exact shape is the contract — do not rename it.
- **Commit messages** end with `Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>`.
- **Do not push either repo until Task 4.** Both pushes are production deploys.

---

### Task 1: Widget — `notifyParent` helper + quote-completion event

**Files:**
- Create: `C:\Users\Mohammad swedan\desktop\projects\BookingService-Interface\BookingService-Interface\src\utils\parentNotify.ts`
- Modify: `C:\Users\Mohammad swedan\desktop\projects\BookingService-Interface\BookingService-Interface\src\components\customer\QuoteRequestForm.tsx` (the `requestQuoteMutation` `onSuccess` callback, currently lines 140–149)

**Interfaces:**
- Consumes: nothing.
- Produces: `notifyParent(message: ParentMessage): void` and `type ParentMessage` — used again by Task 2. The wire format `{ type: "cgd:quote-complete", serviceId: number | null }` is consumed by Task 3.

- [ ] **Step 1: Create the helper**

Create `src/utils/parentNotify.ts` (`src/utils/` is this repo's convention — see `formatters.ts`, `timezone.ts`, `calendarUtils.ts`):

```ts
/**
 * Fire-and-forget completion notices to the page embedding this app in an iframe.
 *
 * Only Capital Garage Doors' own sites are ever told. `postMessage` silently
 * drops a message whose targetOrigin doesn't match the frame's actual origin, so
 * posting once per allow-list entry delivers to exactly one of them and to no
 * one else — the booking payload echoes the customer's own name and phone back
 * to the page they are already on, and must not leak to an unknown embedder.
 *
 * The resize reporter (useEmbedResizeReporter) deliberately uses "*" instead:
 * it carries only a number, and its embedders are unknown by design.
 */
const ALLOWED_PARENT_ORIGINS = [
  "https://capitalgaragedoors.com.au",
  "https://www.capitalgaragedoors.com.au",
  // Warm standby deploy of the same site.
  "https://cgdperth.netlify.app",
  // Local development of the embedding site / the test harness.
  "http://localhost:3000",
  "http://localhost:3001",
] as const;

export type ParentMessage =
  | { type: "cgd:quote-complete"; serviceId: number | null }
  | { type: "cgd:booking-complete"; ref: string; name: string; phone: string };

/** No-op when not framed. Never throws — a failed notice must not break the UI. */
export function notifyParent(message: ParentMessage): void {
  if (typeof window === "undefined" || window.parent === window) return;
  for (const origin of ALLOWED_PARENT_ORIGINS) {
    try {
      window.parent.postMessage(message, origin);
    } catch {
      // Origin mismatch or a gone parent — nothing to do.
    }
  }
}
```

- [ ] **Step 2: Import the helper in the quote form**

In `src/components/customer/QuoteRequestForm.tsx`, add to the existing import block:

```ts
import { notifyParent } from "../../utils/parentNotify";
```

- [ ] **Step 3: Emit on successful submission**

In the same file, the mutation's `onSuccess` currently reads:

```ts
    onSuccess: (response) => {
      toast.success("Quote request sent!");
      try {
        sessionStorage.removeItem(DRAFT_KEY);
      } catch {
        // Ignore.
      }
      setSuccessMessage(response?.message || null);
      setSubmitted(true); // Inline success — never navigate (iframe-friendly).
    },
```

Replace it with:

```ts
    onSuccess: (response) => {
      toast.success("Quote request sent!");
      try {
        sessionStorage.removeItem(DRAFT_KEY);
      } catch {
        // Ignore.
      }
      setSuccessMessage(response?.message || null);
      setSubmitted(true); // Inline success — never navigate (iframe-friendly).
      // Tell the embedding site a real lead was created, so it can count the
      // conversion against the page the visitor came from. No personal data.
      notifyParent({
        type: "cgd:quote-complete",
        serviceId: serviceId ? Number(serviceId) : null,
      });
    },
```

(`serviceId` is the component's existing `useState<string>` holding the selected service, `""` when "Not sure / other".)

- [ ] **Step 4: Typecheck and lint**

Run from `C:\Users\Mohammad swedan\desktop\projects\BookingService-Interface\BookingService-Interface`:

```bash
npm run typecheck
npm run lint
```

Expected: both clean. If `npm run lint` reports pre-existing errors in files this task did not touch, note them and move on — only regressions in `parentNotify.ts` and `QuoteRequestForm.tsx` matter.

- [ ] **Step 5: Build**

```bash
npm run build
```

Expected: succeeds.

- [ ] **Step 6: Commit (do not push)**

```bash
git add src/utils/parentNotify.ts src/components/customer/QuoteRequestForm.tsx
git commit -m "feat: notify embedding site when a quote request is submitted

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 2: Widget — booking-completion event on the confirmation screen

**Files:**
- Modify: `C:\Users\Mohammad swedan\desktop\projects\BookingService-Interface\BookingService-Interface\src\pages\customer\ConfirmationPage.tsx`

**Interfaces:**
- Consumes: `notifyParent`, `ParentMessage` from Task 1.
- Produces: the wire message `{ type: "cgd:booking-complete", ref, name, phone }`, consumed by Task 3 and by this site's existing `components/sections/chat/in-chat-booking.tsx`.

- [ ] **Step 1: Add the import**

In `src/pages/customer/ConfirmationPage.tsx`, beside the existing `useIsEmbed` import:

```ts
import { notifyParent } from "../../utils/parentNotify";
```

- [ ] **Step 2: Emit once when the booking resolves**

The component already has `useRef` imported and a `booking` query. Add this effect immediately **after** the `useQuery({ queryKey: ["booking", bookingId], … })` call and **before** the `if (!bookingId)` early return — hooks must run unconditionally on every render:

```tsx
  // Tell the embedding site the booking completed. Guarded by a ref because the
  // query can settle more than once (retries, refetch on focus) and this must
  // count as exactly one conversion.
  //
  // Deliberately keyed on being framed rather than on useIsEmbed(): the site's
  // BookingDialog iframes the app ROOT, so a booking made there finishes on this
  // NON-/embed confirmation route and must still report.
  const notifiedRef = useRef(false);
  useEffect(() => {
    if (!booking || notifiedRef.current) return;
    notifiedRef.current = true;
    notifyParent({
      type: "cgd:booking-complete",
      ref: booking.id,
      name: `${booking.customer.firstName} ${booking.customer.lastName}`.trim(),
      phone: booking.customer.mobilePhone,
    });
  }, [booking]);
```

(`Booking` is typed in `src/types/api.ts:123` — `id: string`, `customer: Customer` with `firstName`, `lastName`, `mobilePhone`.)

- [ ] **Step 3: Typecheck and lint**

```bash
npm run typecheck
npm run lint
```

Expected: clean. In particular no `react-hooks/rules-of-hooks` error — if one appears, the effect was placed after an early `return`.

- [ ] **Step 4: Build**

```bash
npm run build
```

Expected: succeeds.

- [ ] **Step 5: Commit (do not push)**

```bash
git add src/pages/customer/ConfirmationPage.tsx
git commit -m "feat: notify embedding site when a booking is confirmed

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 3: Site — parse the completion message and track it in GA4

**Files:**
- Modify: `lib/booking-embed.ts` (append the parser; update the file header)
- Modify: `lib/analytics.ts` (two new event names; correct the "cannot measure" doc block)
- Modify: `components/analytics/interaction-tracking.tsx` (add the `message` listener)
- Modify: `components/sections/booking-dialog.tsx` (correct the stale comment at lines 41–43)
- Modify: `components/sections/chat/in-chat-booking.tsx` (correct the "Until that ships" comment, line 14)
- Modify: `CLAUDE.md` (analytics table + the three "no completion message" claims)
- Temp (not committed): `C:\Users\MOHAMM~1\AppData\Local\Temp\claude\C--Users-Mohammad-swedan-desktop-projects-Capital-Garage-Door\4b9f9eec-944e-430a-bd3f-8d7bd792708f\scratchpad\check-parse.ts`

**Interfaces:**
- Consumes: the two wire messages from Tasks 1 and 2; `BOOKING_EMBED_ORIGIN` (already exported from `lib/booking-embed.ts`); `track` from `lib/analytics.ts`.
- Produces: `parseBookingCompletion(data: unknown): { event: "quote_submit" | "booking_submit"; params: Record<string, unknown> } | null`, exported from `lib/booking-embed.ts`. GA4 events `quote_submit` and `booking_submit`.

- [ ] **Step 1: Add the parser to `lib/booking-embed.ts`**

Append to the end of the file:

```ts
/**
 * Narrow an untrusted `MessageEvent.data` to one of the booking app's completion
 * messages and map it to the analytics event it should produce. Returns null for
 * anything else — notably `{ type: "booking-widget-resize" }`, which the widget
 * posts on every height change and must never be counted as a lead.
 *
 * `name`/`phone`/`ref` from a booking are dropped on purpose: they exist for the
 * in-chat confirmation UI (components/sections/chat/in-chat-booking.tsx), and
 * personal data must never reach analytics.
 *
 * Callers MUST check `event.origin === BOOKING_EMBED_ORIGIN` first — this
 * function trusts the shape, not the sender.
 */
export function parseBookingCompletion(
  data: unknown,
): { event: "quote_submit" | "booking_submit"; params: Record<string, unknown> } | null {
  if (!data || typeof data !== "object") return null;
  const type = (data as { type?: unknown }).type;

  if (type === "cgd:quote-complete") {
    const serviceId = (data as { serviceId?: unknown }).serviceId;
    return {
      event: "quote_submit",
      params: typeof serviceId === "number" ? { service_id: serviceId } : {},
    };
  }

  if (type === "cgd:booking-complete") {
    return { event: "booking_submit", params: {} };
  }

  return null;
}
```

- [ ] **Step 2: Write the assertion script and run it (expect FAIL first if run before Step 1)**

Write `check-parse.ts` in the scratchpad directory:

```ts
import assert from "node:assert/strict";
import { parseBookingCompletion } from "../../../../../../Users/Mohammad swedan/desktop/projects/Capital Garage Door/lib/booking-embed";

assert.deepEqual(parseBookingCompletion({ type: "cgd:quote-complete", serviceId: 3 }), {
  event: "quote_submit",
  params: { service_id: 3 },
});
assert.deepEqual(parseBookingCompletion({ type: "cgd:quote-complete", serviceId: null }), {
  event: "quote_submit",
  params: {},
});
assert.deepEqual(
  parseBookingCompletion({ type: "cgd:booking-complete", ref: "abc", name: "Jo", phone: "0400" }),
  { event: "booking_submit", params: {} },
);
assert.equal(parseBookingCompletion({ type: "booking-widget-resize", height: 900 }), null);
assert.equal(parseBookingCompletion("cgd:quote-complete"), null);
assert.equal(parseBookingCompletion(null), null);
console.log("parseBookingCompletion: all assertions passed");
```

If the relative import proves awkward on Windows, instead place the file at `scripts/check-parse.ts` in the repo, import from `@/lib/booking-embed`, run it, then **delete it before committing** — it is a throwaway check, not a shipped script. (If it is placed in `scripts/`, it needs no `export {}` because it has imports; see the "scripts need module scope" note in CLAUDE.md's neighbours.)

Run:

```bash
npx tsx <path-to>/check-parse.ts
```

Expected: `parseBookingCompletion: all assertions passed`. A `booking_submit` returned for the resize message, or a crash on `null`, is a real bug — fix the parser, not the assertions.

- [ ] **Step 3: Add the two event names in `lib/analytics.ts`**

In the `AnalyticsEvent` union, after the `"suburb_search"` member, change the terminating semicolon and append:

```ts
  /** A settled query in the /service-areas suburb finder — `results: 0` = demand we don't list. */
  | "suburb_search"
  /** A quote request was actually SUBMITTED in the embedded booking widget — a real lead. */
  | "quote_submit"
  /** A booking was completed in the embedded booking widget — a real lead. */
  | "booking_submit";
```

- [ ] **Step 4: Correct the analytics doc block**

In the same file, replace the whole `## What this deliberately cannot measure` section (currently the paragraph beginning "The quote and booking widgets are a third-party app…") with:

```
 * ## What this deliberately cannot measure
 *
 * Phone calls placed by reading the number off the screen rather than tapping it
 * are invisible to any client-side analytics — `call_click` counts taps only.
 *
 * Quote and booking SUBMISSIONS are measured (`quote_submit`/`booking_submit`),
 * via a postMessage the booking app posts to us; see parseBookingCompletion in
 * lib/booking-embed.ts. That message carries no personal data, so a lead's
 * identity still exists only in the booking CRM — analytics answers "which page
 * produced a lead", never "who".
```

- [ ] **Step 5: Add the listener in `components/analytics/interaction-tracking.tsx`**

Add to the imports:

```ts
import { BOOKING_EMBED_ORIGIN, parseBookingCompletion } from "@/lib/booking-embed";
```

Inside the existing `useEffect`, after the `onClick` function definition and before `document.addEventListener("click", onClick);`, insert:

```ts
    // Lead completions reported by the embedded booking app (cross-origin iframe).
    // Same delegation argument as the click listener: quote and booking frames are
    // mounted by half a dozen components, so one listener at the window beats
    // wiring each surface.
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== BOOKING_EMBED_ORIGIN) return;
      const completion = parseBookingCompletion(event.data);
      if (!completion) return;
      track(completion.event, completion.params);
    };
```

Then replace the listener registration/cleanup at the end of the effect:

```ts
    document.addEventListener("click", onClick);
    window.addEventListener("message", onMessage);
    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("message", onMessage);
    };
```

- [ ] **Step 6: Update the component's doc comment**

In the same file, extend the JSDoc's final paragraph (the one beginning "Mounted unconditionally…") by appending:

```
 *
 * It also listens for the booking app's completion postMessages, which is what
 * turns `quote_open`/`booking_open` (intent) into `quote_submit`/`booking_submit`
 * (an actual lead, attributed to the page it came from).
```

- [ ] **Step 7: Correct the three stale "no completion message" comments**

`components/sections/booking-dialog.tsx`, lines 41–43, currently:

```ts
    // Intent only. The booking app is cross-origin and emits no completion
    // message (it does not send the `cgd:booking-complete` event BookingFrame
    // listens for), so a finished booking is visible only in the CRM.
```

becomes:

```ts
    // Intent only — the matching completion is `booking_submit`, tracked
    // centrally in components/analytics/interaction-tracking.tsx from the
    // booking app's `cgd:booking-complete` postMessage.
```

`components/sections/chat/in-chat-booking.tsx`, line 14, currently:

```ts
 * Until that ships, the manual back/close button is the fallback — no functional gap.
```

becomes:

```ts
 * The booking app sends this from its confirmation screen (src/pages/customer/
 * ConfirmationPage.tsx, via src/utils/parentNotify.ts). The manual back/close
 * button remains the fallback if the message is ever missed.
```

`lib/booking-embed.ts` header — append a line after the existing paragraph:

```ts
 * The widget also posts back: `booking-widget-resize` (height, handled by
 * components/sections/quote-frame.tsx) and the two completion messages parsed by
 * `parseBookingCompletion` below.
```

- [ ] **Step 8: Update CLAUDE.md**

Four edits:

1. In the **Analytics & conversion tracking** event table, add two rows after the `booking_open` row:

```
| `quote_submit` | `components/analytics/interaction-tracking.tsx` | **real lead.** From the booking app's `cgd:quote-complete` postMessage (origin-checked); carries `service_id` only. |
| `booking_submit` | same listener | **real lead.** From `cgd:booking-complete`. No personal data — name/phone go to the in-chat confirmation UI only. |
```

2. In the same section, replace the "**What this deliberately cannot measure**" paragraph's claim that the widgets emit no completion message with: submissions ARE measured via the two postMessages above; what remains unmeasurable is calls placed by reading the number, and the identity of a lead (which lives only in the CRM).

3. In the **Quote embed** bullet, replace "There is **no** quote-complete postMessage from the widget (verified in its bundle), so no in-chat confirmation/lead callback" with a statement that the widget now posts `cgd:quote-complete` (serviceId only) and `cgd:booking-complete` (ref/name/phone) to an origin allow-list, that this site tracks them as `quote_submit`/`booking_submit`, and that UTM/gclid attribution is still not forwardable (not in the allowed params).

4. In the **AI chat widget** bullet, replace "the booking app doesn't send it yet — manual 'Back to chat' is the fallback" with: the booking app now sends `cgd:booking-complete` from its confirmation screen, so in-chat auto-close works; the manual button remains the fallback.

- [ ] **Step 9: Typecheck and lint**

```bash
npx tsc --noEmit
npx eslint lib/booking-embed.ts lib/analytics.ts components/analytics/interaction-tracking.tsx components/sections/booking-dialog.tsx components/sections/chat/in-chat-booking.tsx
```

Expected: both clean. (Repo-wide `npm run lint` has ~88 pre-existing errors — lint only the changed files.)

- [ ] **Step 10: Build**

```bash
npm run build
```

Expected: succeeds. This reaches the live CMS at `https://cgd.runasp.net` (or whatever `.env.local` sets) — a `ECONNREFUSED` at static generation means the CMS is unreachable, not a code fault.

- [ ] **Step 11: Delete the throwaway check script, then commit (do not push)**

```bash
git status --short   # confirm no scratch file is staged
git add lib/booking-embed.ts lib/analytics.ts components/analytics/interaction-tracking.tsx components/sections/booking-dialog.tsx components/sections/chat/in-chat-booking.tsx CLAUDE.md
git commit -m "Track real quote/booking submissions from the booking widget

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 4: End-to-end verification and deploy

**Files:**
- Temp (not committed): `<scratchpad>\embed-harness.html`

**Interfaces:**
- Consumes: everything from Tasks 1–3.
- Produces: confirmed `quote_submit` and `booking_submit` events in the live GA4 property.

- [ ] **Step 1: Build the local harness**

Write `<scratchpad>\embed-harness.html`:

```html
<!doctype html>
<meta charset="utf-8" />
<title>Booking widget postMessage harness</title>
<h1>Harness — watch the log below</h1>
<pre id="log" style="font: 13px monospace; background: #111; color: #0f0; padding: 12px"></pre>
<iframe src="http://localhost:5173/embed/quote" style="width: 100%; height: 900px; border: 1px solid #ccc"></iframe>
<script>
  addEventListener("message", (e) => {
    if (e.data && e.data.type === "booking-widget-resize") return; // noisy
    document.getElementById("log").textContent +=
      JSON.stringify({ origin: e.origin, data: e.data }) + "\n";
  });
</script>
```

- [ ] **Step 2: Run the widget dev server and the harness**

Two background shells, from the widget repo and the scratchpad respectively:

```bash
npm run dev            # Vite, http://localhost:5173
npx --yes serve -l 3001 <scratchpad>   # http://localhost:3001 — on the allow-list
```

- [ ] **Step 3: Submit one clearly-marked test quote through the harness**

Open `http://localhost:3001/embed-harness.html`. Fill the form with first name `TEST`, last name `IGNORE`, a real-format phone and email you control, and a description that reads `TEST — automated check, please ignore and delete`.

Expected in the log: `{"origin":"http://localhost:5173","data":{"type":"cgd:quote-complete","serviceId":…}}`.

If nothing logs, check in order: the iframe really is cross-origin (it is — different port), `window.parent !== window` is true, and the harness is served from `http://localhost:3001` and not opened as a `file://` URL (a `file://` parent has origin `null` and is correctly rejected).

- [ ] **Step 4: Delete the test record from the CRM**

Log into the booking admin and delete the `TEST IGNORE` quote request (Financial Management → Quote Requests). Do not leave test data in the customer database.

- [ ] **Step 5: Stop the dev servers**

Stop both background shells. On Windows a stopped shell can leave the node child alive — if a port is still bound, find the PID and `taskkill //PID <pid> //F`.

- [ ] **Step 6: Push the widget repo (production deploy #1)**

```bash
git -C "C:\Users\Mohammad swedan\desktop\projects\BookingService-Interface\BookingService-Interface" push origin main
```

Netlify builds `main` automatically. Wait for the deploy, then confirm the new code is live by fetching the built bundle and grepping for the message type:

```bash
curl -s https://booking-system-cgd.netlify.app/embed/quote | grep -o 'assets/[^"]*\.js' | head -3
```

then `curl -s https://booking-system-cgd.netlify.app/<asset>` and grep for `cgd:quote-complete`. Deploy the widget **first** — the site listener is harmless without it, but the reverse leaves messages with no listener.

- [ ] **Step 7: Push this repo (production deploy #2)**

```bash
git push origin main
```

Watch the GitHub Actions run to completion (`gh run list --limit 1`, then `gh run watch <id>`). An `ssh: i/o timeout` in the deploy step is a known transient — `gh run rerun <id>`.

- [ ] **Step 8: Production smoke test**

On `https://capitalgaragedoors.com.au/contact` (or any page with a quote CTA), open the quote dialog, submit one quote marked `TEST — please ignore` exactly as in Step 3. Before submitting, open devtools and run:

```js
window.__leads = [];
addEventListener("message", (e) => { if (e.data?.type?.startsWith?.("cgd:")) window.__leads.push(e.data); });
```

After submitting, check `window.__leads` contains the quote-complete message, and that `dataLayer` holds a `quote_submit` entry:

```js
window.dataLayer.filter((d) => d.event === "quote_submit" || (d[1] === "quote_submit"));
```

Then confirm it lands in **GA4 → Reports → Realtime → Event count by Event name** within ~60 seconds.

- [ ] **Step 9: Delete the production test record**

Delete the `TEST` quote request from the CRM, same as Step 4.

- [ ] **Step 10: Write the user-action note**

Report to the user (do not attempt it — it needs their GA4 login): **GA4 → Admin → Events → mark `quote_submit` and `booking_submit` as key events**, so they count as conversions in reports and are importable into Google Ads later. Note that `booking_submit` will not appear in the events list until the first booking completes, so it may need marking a day or two later.

---

### Task 5: Citations & backlinks pack

**Files:**
- Create: `docs/marketing/citations-pack.md`
- Create: `docs/marketing/citations-tracker.csv`
- Modify: `CLAUDE.md` (the `config/site.ts` bullet's stale ABN TODO)

**Interfaces:**
- Consumes: `config/site.ts` (NAP, ABN, legal name, hours, social), `lib/utils.ts` `formatHoursSummary()`, the GBP audit memory at `C:\Users\Mohammad swedan\.claude\projects\C--Users-Mohammad-swedan-desktop-projects-Capital-Garage-Door\memory\gbp-local-pack-findings.md` (verified CID + primary category).
- Produces: documentation only. No code depends on it.

- [ ] **Step 1: Read the sources of truth**

Read `config/site.ts`, `lib/utils.ts`'s `formatHoursSummary()`, and the GBP memory file. Everything in the pack must come from those — invent nothing. Confirmed values as of 2026-08-04:

- Trading name: `Capital Garage Doors`
- Legal entity: `Capital Garage Door Pty Ltd` (verified against the ABR)
- ABN: `86 689 651 643`
- Address: `13 Amrock Street, Southern River WA 6110, Australia`
- Phone: `0475 333 335` (international `+61 475 333 335`)
- Email: `info@capitalgaragedoors.com.au` (already committed in `config/site.ts`; the *site* must still never render it as plaintext — see `ObfuscatedEmail`)
- Website: `https://capitalgaragedoors.com.au`
- Hours: Mon–Fri 7:00 am – 6:00 pm, Sat–Sun 8:00 am – 4:00 pm
- Socials: the Facebook, Instagram, YouTube and Google review URLs in `siteConfig.social`

- [ ] **Step 2: Write `docs/marketing/citations-pack.md`**

Sections, in order:

1. **How to use this** — one paragraph: paste the same NAP block everywhere, character for character; a mismatch is worse than no listing.
2. **Master NAP block** — the values from Step 1 as a copy-paste block.
3. **Categories** — primary and secondary categories, taken from the verified GBP category in the memory file.
4. **Descriptions** — three, written here, not at execution time: ~50 chars, ~150 chars, ~750 chars. All must be truthful, mention Perth and same-day service, and contain **no prices** (prices live only in the CMS pricing catalog).
5. **Services list** — from `siteConfig.footerNav`'s Services group.
6. **Service area** — Perth metro, Two Rocks to Mandurah, coast to the hills.
7. **Images to upload** — logo and 3–4 job photos; use existing Bunny CDN URLs from the gallery so every listing shows real work.
8. **Tier-1 Australian citations** — this table, with a `Notes` column filled in per row (free vs paid, ABN required, verification method):

| # | Site | Submit at |
|---|---|---|
| 1 | Bing Places | bingplaces.com |
| 2 | Apple Business Connect | businessconnect.apple.com |
| 3 | Yellow Pages AU | yellowpages.com.au |
| 4 | White Pages AU | whitepages.com.au |
| 5 | TrueLocal | truelocal.com.au |
| 6 | Localsearch | localsearch.com.au |
| 7 | StartLocal | startlocal.com.au |
| 8 | AussieWeb | aussieweb.com.au |
| 9 | Yelp AU | biz.yelp.com |
| 10 | Hotfrog AU | hotfrog.com.au |
| 11 | Cylex AU | cylex.net.au |
| 12 | Word of Mouth | wordofmouth.com.au |
| 13 | Oneflare | oneflare.com.au |
| 14 | hipages | hipages.com.au |
| 15 | ServiceSeeking | serviceseeking.com.au |

Mark 13–15 explicitly as **paid lead marketplaces, optional** — they charge per lead and compete with the site's own leads; they are listed for the citation value, and the user decides.

9. **Profiles already owned** — a checklist to re-verify the NAP on the existing Facebook, Instagram and YouTube profiles matches the master block exactly (these are free, already-earned citations that commonly drift).
10. **Supplier / dealer listings** — the highest-value non-directory links, because they are industry-relevant. For each of B&D (`bnd.com.au`), Steel-Line (`steel-line.com.au`) and Centurion (`centsys.com.au`): check whether the site has a dealer/stockist locator, find the contact route, and send the outreach email. Include one reusable email draft (short, states the business is an installer of their product in Perth, asks to be listed in the dealer locator, gives the NAP block).
11. **Local sponsorship / community links** — a short research procedure, not a fabricated list: search `"<suburb> junior football club" sponsors`, `"<suburb> community" sponsors` and similar for the suburbs that already have pages (Southern River, Gosnells, Canning Vale, Cockburn Central, Atwell, Baldivis, Joondalup); keep only pages that actually publish outbound sponsor links; record 5–8 candidates with the contact and the likely cost.

**Do not put an inflated timeline or a guaranteed ranking outcome in this document.** Citations are a foundation, not a ranking lever on their own.

- [ ] **Step 3: Write `docs/marketing/citations-tracker.csv`**

Header row exactly:

```csv
site,url,tier,cost,status,live_url,date_submitted,date_verified,notes
```

Pre-fill one row per entry from the pack's tier-1 table plus the three supplier targets, with `status` = `not_started` and the other date/URL columns empty.

- [ ] **Step 4: Fix the stale ABN claim in CLAUDE.md**

The `config/site.ts` bullet says the ABN is a TODO. It is not — `config/site.ts` carries `86 689 651 643` and the verified legal name. Replace the TODO wording with a statement that both are set and verified against the ABR, and that they render in the footer and as schema `taxID`.

- [ ] **Step 5: Commit (this can be pushed with the Task 3 commit or separately — docs only, no deploy risk)**

```bash
git add docs/marketing/citations-pack.md docs/marketing/citations-tracker.csv CLAUDE.md
git commit -m "docs: AU citations + backlinks acquisition pack and tracker

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

- [ ] **Step 6: Hand off to the user**

Report: the pack is ready, the ABN is already on file (so no blocker), and the signups need their email/phone verification. Offer to verify each listing goes live and to record `live_url` in the tracker as they complete them.

---

## Self-Review

**Spec coverage.** Part A's postMessage contract → Tasks 1–2 (allow-list, both message shapes, the `window.parent !== window` rule, the deliberate choice not to key on `useIsEmbed()`). Part A's site changes → Task 3 (event names, listener, no personal data, all four doc corrections). Verification/rollout → Task 4 (typecheck/build both repos, local E2E, widget-first deploy order, production smoke, test-record deletion, the GA4 key-event user action). Spec's "out of scope" (no Measurement Protocol backstop) → no task, correctly. Part B's pack, tracker, work split and success criteria → Task 5.

**Corrections found while planning.** The spec said the pack should omit the business email and that the user must supply the ABN. Both were wrong: `config/site.ts` already commits `info@capitalgaragedoors.com.au` and the verified ABN `86 689 651 643`. Task 5 uses the real values and fixes CLAUDE.md's stale TODO instead. The ABN is therefore **not** a blocker on the citations work.

**Placeholders.** None — every code step carries the literal code, every doc step names the exact text being replaced, and the two "write prose" steps (the pack's descriptions and outreach email) specify their constraints and sources rather than deferring the decision.

**Type consistency.** `notifyParent`/`ParentMessage` (Task 1) are imported unchanged in Task 2. The wire strings `cgd:quote-complete` and `cgd:booking-complete` match across Tasks 1, 2, 3 and the pre-existing `in-chat-booking.tsx` listener. `parseBookingCompletion` returns `{ event, params }` in Task 3 Step 1 and is consumed with those exact keys in Step 5 and asserted with them in Step 2. `booking.id`, `booking.customer.firstName/lastName/mobilePhone` match `src/types/api.ts:123`.
