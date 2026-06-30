# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

> The line above is not decorative. This repo runs **Next.js 16 + React 19** with breaking changes from older versions. Before writing routing, metadata, data-fetching, or `<Image>` code, read the relevant guide in `node_modules/next/dist/docs/`. `params` are async (`Promise`), `generateMetadata`/page components `await` them, and `images.qualities` must allow-list every `quality` value used.

## Commands

```bash
npm run dev      # next dev -H 0.0.0.0 (binds all interfaces so a phone on the LAN can load it)
npm run build    # next build — also the real type/route check; run before considering work done
npm run start    # serve the production build
npm run lint     # eslint (flat config, eslint.config.mjs)
```

There is no test suite. `npm run build` is the closest thing to a correctness gate — it fails on type errors, bad routes, and disallowed image qualities. Import alias is `@/*` → repo root (e.g. `@/lib/data/...`, `@/components/...`).

## Architecture

This is a marketing/SEO site for a Perth garage-door business. Almost every page is **data-driven** — from local TypeScript content by default, or from the **live CMS** where its cutover flags are on (see **CMS** below) — rendered through a small set of reusable template components. Public pages are statically generated at build time (`generateStaticParams` + `dynamicParams = false`) with ISR revalidation; there is no per-request fetching for them (the CMS, when enabled, is read at build/revalidate, not per request). The `/admin/*` CMS dashboard is the exception — it is dynamic/server-rendered.

### The content pipeline (the core pattern)

Each page *type* flows through four layers — to add or change content you usually touch only the first:

1. **`content/<type>/...`** — the content store. Two shapes exist, both ending in a **registry** that exports an array:
   - **Directory-per-type** (one file per instance): `content/<type>/<slug>.ts` is a plain typed object; the sibling `content/<type>/index.ts` imports each instance and exports them as an array. Used by the larger page types — `articles`, `case-studies`, `comparison-pages`, `cost-guides`, `landing-pages`, `service-pages`.
   - **Single-file registry**: a flat `content/<type>.ts` exporting the array directly. Used for the smaller/list-style datasets — `services.ts`, `problems.ts`, `reviews.ts`, `testimonials.ts`, `gallery.ts`, `service-areas.ts`, `service-area-regions.ts`, `service-suburb-pages.ts`, `blog.ts`.
   - Ship a new page by adding the entry (and pushing onto the registry array) — no routing or component changes.
2. **`lib/data/<type>.ts`** — an `async` data-access layer (`get…BySlug`, `get…Slugs`, `get…`) wrapping the registry. There is one per content type (see `lib/data/` for the full list). **All call sites (routes, templates, sitemap) go through this layer, never the `content/` registries directly.** It is deliberately async so the backing store swaps from local files to the CMS API without changing call sites — a cutover that is **now live** behind per-type flags (see **CMS** below; original design in `docs/cms-architecture.md`).
3. **`types/<type>.ts`** — the interface shared by the content file, the data layer, and the template. `types/index.ts` holds the cross-cutting ones (`FAQ`, `Service`, `Problem`, `ServiceArea`, `BreadcrumbItem`).
4. **`components/.../<type>-page-template.tsx`** — the `…PageTemplate` component that consumes one typed object and renders the page from composable section components in `components/sections/<type>/` (or `components/page/` for the service-suburb template).

### Routing

Most routes are thin: resolve slug → call the data layer → render the template, plus `generateMetadata` using `buildMetadata`.

- **`app/[slug]/page.tsx` is shared by four "flat" page types** — service, comparison, cost-guide, and service-suburb pages all live in one top-level slug namespace and are resolved by trying each registry in turn (in that order; the first match wins, so slugs must be unique across all four). `generateMetadata` and the default export each walk the same chain. **Never add a sibling `app/[other]/page.tsx`** — Next.js rejects two differently-named dynamic segments at the same path level (ambiguous-route build error). Add a new flat type by extending this file's resolution chain *and* its `generateStaticParams` `Set`.
- Other types have their own namespaced dynamic routes: `app/blog/[slug]`, `app/case-studies/[slug]`, `app/problems/[slug]`, `app/lp/[slug]`.
- `app/lp/*` are **paid landing pages**: conversion-first, `noindex`, never linked in-site, and they use their own minimal chrome from `app/lp/layout.tsx`.
- **Static listing / standalone pages** (their own folder, no dynamic segment): `app/page.tsx` (home), and the index pages `app/services`, `app/service-areas`, `app/cost-guides`, `app/blog`, `app/case-studies`, `app/problems`, `app/reviews`, `app/gallery`. Plus standalone pages `app/about`, `app/contact`, `app/calculator`, `app/privacy`, `app/terms`, `app/warranty`, `app/warranty-registration`. These pull lists from the data layer but aren't part of the slug-resolution chain. `app/service-areas` is a single listing page (regions + suburbs) — there is **no** `app/service-areas/[slug]` route; individual suburb pages are flat pages served by `app/[slug]`.

### Site chrome & layout

`app/layout.tsx` (root) loads fonts, the global `LocalBusiness` JSON-LD, and wraps everything in `LazyMotionProvider` → `SiteChrome`. **`components/layout/site-chrome.tsx` is a client component that branches on `usePathname()`**: `/lp/*` routes get bare chrome (the landing layout supplies header/footer); every other route gets the full header, footer, smooth-scroll, scroll progress, and the welcome intro loader.

### SEO

- `config/site.ts` — single source of truth for NAP (name/address/phone), nav, hours, social, URLs. Several address/geo fields are still `TODO` placeholders.
- `lib/seo/metadata.ts` — `buildMetadata({ title, description, path, image?, noIndex? })` produces a `Metadata` object with canonical/OG/Twitter defaults. Use it for every page's `generateMetadata`.
- `lib/seo/schema.ts` — JSON-LD builders (LocalBusiness, Service, FAQ, etc.), rendered via `components/seo/json-ld.tsx`.
- `app/sitemap.ts`, `app/robots.ts`, `app/manifest.ts` are generated from the data layer + site config.

### Icons

Content stores icons as **strings** (e.g. `"Wrench"`). `lib/icons.ts` maps the string to a Lucide component via `resolveIcon(name)` / `iconMap` (falls back to `Wrench`). When content references a new icon, add it to `iconMap` or it silently falls back. (`components/page/icons.ts` is a parallel map for the page-template section components.)

### UI primitives

`components/ui/*` are the low-level primitives (button, dialog, card, accordion, carousel, tabs, sheet, select, etc.). They are built on **Base UI (`@base-ui/react`), not Radix** — there is no `@radix-ui` dependency. When adding or wiring a primitive, import from `@base-ui/react/...` and follow the existing files. `cn()` (clsx + tailwind-merge) lives in `lib/utils.ts` and is the standard className combiner. Styling is **Tailwind v4** (`app/globals.css`, no `tailwind.config`); a few components use v4-only syntax like `mask-[...]` and arbitrary `bg-[size:...]`.

### Interactive / conversion features (client components)

Beyond the static templates, several client-side widgets drive conversions. Most are mounted through the page templates and CTAs (`components/page/cta-buttons.tsx`, `components/sections/smart-cta.tsx`, `components/layout/sticky-mobile-cta.tsx`) and are dynamically imported with `ssr: false` to keep them off the critical path:

- **Smart price calculator** — `components/sections/smart-calculator/` (`index.tsx`, `estimate-logic.ts`, `option-card.tsx`, `price-breakdown.tsx`, `suburb-input.tsx`). A fully client-side estimator: pricing is computed locally in `estimate-logic.ts`, no API. Surfaced both at the `app/calculator` route and via `components/sections/calculator-dialog.tsx`.
- **Booking dialog** — `components/sections/booking-dialog.tsx` embeds an **external live booking system in an iframe** (`https://booking-system-cgd.netlify.app/`). This is a separate app, not part of this repo. The same external app also serves the warranty register/check-status form, embedded full-page at `app/warranty-registration` via `components/sections/warranty/registration-frame.tsx` (`/warranty/register`).
- **AI chat widget (Smart Garage Assistant)** — `components/sections/ai-chat-widget.tsx` (+ `components/sections/chat/*`). **LLM-backed and structured.** `sendMessage` POSTs the conversation (plus a per-tab `sessionId`) to the same-origin proxy `app/api/chat/route.ts`, which forwards (with the `x-assistant-secret` shared secret) to the CMS `POST /api/assistant/chat`. The CMS returns a **structured envelope `{ reply, suggestions, actions }`** (not plain text): the model generates follow-up `suggestions` (chips) and typed `actions` rendered uniquely by `chat-actions.tsx` — `call` (tel:), `book`/`calculator`/`quote` (open **in-chat overlays** inside the sheet via `in-chat-booking.tsx` / the `SmartPriceCalculator` / `in-chat-quote.tsx`), `suburb` (prefill+send), `link` (internal nav). **Hybrid RAG:** the CMS pre-retrieves cheap context and the model may emit JSON `queries` to pull precise pricing/services/suburbs/FAQs from the DB before answering (pricing incl. private `InternalNote`, never returned). The in-chat booking iframe listens for a `cgd:booking-complete` postMessage to auto-close (the booking app doesn't send it yet — manual "Back to chat" is the fallback). **Conversation logging + lead capture:** best-effort, the CMS upserts one `AssistantConversation` row per `sessionId` (transcript = client-facing turns only); the quote form POSTs leads to `app/api/chat/lead` → CMS `POST /api/assistant/lead`; admin views them at `app/admin/(dashboard)/conversations`. (Requires the `AssistantConversations` table/migration in the CMS.) The DeepSeek key lives **only** in the CMS (`DeepSeek__ApiKey`), never in this repo; `deepseek-v4-flash` is a reasoning model (read only `content`, never `reasoning_content`). Non-streaming; the widget shows a typing indicator and falls back to a "call us" message on error. (The price calculator is **not** LLM-wired — still deterministic, see below.)
- **Sticky mobile CTA** — `components/layout/sticky-mobile-cta.tsx`, mounted by `SiteChrome` for non-`/lp` routes.

### Server actions & forms

`lib/actions/*.ts` (`submitQuote`, contact) are `"use server"` actions used by the form components (`components/forms/*`). **They are stubs that `console.log` the payload** — no email/CRM/API is wired up yet (search for the `TODO: send to email provider / CRM` markers). Lead forms collect UTM/gclid attribution fields.

### Motion & performance (sensitive)

`framer-motion` is loaded lazily through `LazyMotionProvider`; GSAP + Lenis power the smooth-scroll and the garage-door intro/reveal animations. These areas are performance-tuned — consult the auto-memory notes (first-load performance, ScrollDoorReveal rendering) before touching the intro, scroll, or canvas-reveal code. `next.config.ts` enables `experimental.inlineCss` (prod only) and restricts image `qualities` to `[60, 75]`.

### CMS (live — ASP.NET Core + SQL Server)

The CMS that `docs/cms-architecture.md` designed is **built and running**, not a draft. It's a separate ASP.NET Core (clean-architecture) backend in **its own repo** at `C:\Users\Mohammad swedan\source\repos\Capital Garage Door CMS\` (API project `CapitalGarageDoor.Cms.Api`), serving `http://localhost:5179` in dev (`CMS_API_URL` overrides). In Development it auto-applies EF migrations and seeds the admin account against SQL Server **LocalDB** on startup — run it with `dotnet run --project "CapitalGarageDoor.Cms.Api" --launch-profile http`.

**Frontend integration (this repo):**
- `lib/cms/*` — the typed API client (`client.ts`), admin/auth (`admin.ts`), reviews (`reviews-client.ts`), DTO→type mappers (`map-*.ts`), editor serializers, and content importers.
- `app/admin/*` — the CMS admin dashboard + page editor, plus `app/admin/api/*` route handlers that proxy the backend. `app/api/revalidate` is the ISR webhook the backend calls on publish.
- `app/api/chat/route.ts` — same-origin proxy for the **Smart Garage Assistant**. Forwards conversations to the CMS `POST /api/assistant/chat` (DeepSeek LLM + RAG over CMS content) with the `ASSISTANT_PROXY_SECRET` shared secret (= backend `Assistant:ProxySecret`). The DeepSeek key is **CMS-side only** (`DeepSeek__ApiKey`); it is never in this repo or the client bundle. See the AI chat widget under *Interactive / conversion features*.
- The `lib/data/*.ts` cutover seam is **active**: per-type flags in `.env.local` (`CMS_SERVICE_PAGES`, `CMS_COMPARISON_PAGES`, …, `CMS_CATALOGS`, `CMS_REVIEWS` = `"on"`) decide whether each type reads from the CMS or falls back to local `content/*.ts`.

**Build/runtime dependency:** `app/[slug]` resolution (`lib/cms/client.ts` `cmsResolve()`) **throws** when the API is unreachable, so `npm run build` — which prerenders those pages — **requires the backend running**, or it fails at static generation with `ECONNREFUSED`. Catalog/review reads fall back gracefully (`try/catch → []`), so non-`[slug]` routes (incl. the home page) still render without it. For a backend-free type check, use `npx tsc --noEmit`. `docs/admin-dashboard-and-editor-plan.md` covers the admin/editor build.

## Keeping this file current

**Update CLAUDE.md whenever you make a major change to the system.** That includes: adding or removing a subsystem (e.g. the CMS, a new external service), an architectural shift, a new build- or runtime dependency, route-structure changes, or anything that would make a description above wrong. A stale CLAUDE.md silently misleads every future session — the "CMS (not built)" section was wrong for weeks because this rule wasn't followed. Fix the affected section in the **same change** that introduces the shift, not later.
