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

This is a marketing/SEO site for a Perth garage-door business. Almost every page is **data-driven from local TypeScript content**, rendered through a small set of reusable template components. The whole site is statically generated at build time (`generateStaticParams` + `dynamicParams = false`); there is no per-request fetching.

### The content pipeline (the core pattern)

Each page *type* flows through four layers — to add or change content you usually touch only the first:

1. **`content/<type>/...`** — the content store. Two shapes exist, both ending in a **registry** that exports an array:
   - **Directory-per-type** (one file per instance): `content/<type>/<slug>.ts` is a plain typed object; the sibling `content/<type>/index.ts` imports each instance and exports them as an array. Used by the larger page types — `articles`, `case-studies`, `comparison-pages`, `cost-guides`, `landing-pages`, `service-pages`.
   - **Single-file registry**: a flat `content/<type>.ts` exporting the array directly. Used for the smaller/list-style datasets — `services.ts`, `problems.ts`, `reviews.ts`, `testimonials.ts`, `gallery.ts`, `service-areas.ts`, `service-area-regions.ts`, `service-suburb-pages.ts`, `blog.ts`.
   - Ship a new page by adding the entry (and pushing onto the registry array) — no routing or component changes.
2. **`lib/data/<type>.ts`** — an `async` data-access layer (`get…BySlug`, `get…Slugs`, `get…`) wrapping the registry. There is one per content type (see `lib/data/` for the full list). **All call sites (routes, templates, sitemap) go through this layer, never the `content/` registries directly.** It is deliberately async so the backing store can later swap from local files to a CMS API without changing call sites (see `docs/cms-architecture.md`).
3. **`types/<type>.ts`** — the interface shared by the content file, the data layer, and the template. `types/index.ts` holds the cross-cutting ones (`FAQ`, `Service`, `Problem`, `ServiceArea`, `BreadcrumbItem`).
4. **`components/.../<type>-page-template.tsx`** — the `…PageTemplate` component that consumes one typed object and renders the page from composable section components in `components/sections/<type>/` (or `components/page/` for the service-suburb template).

### Routing

Most routes are thin: resolve slug → call the data layer → render the template, plus `generateMetadata` using `buildMetadata`.

- **`app/[slug]/page.tsx` is shared by four "flat" page types** — service, comparison, cost-guide, and service-suburb pages all live in one top-level slug namespace and are resolved by trying each registry in turn (in that order; the first match wins, so slugs must be unique across all four). `generateMetadata` and the default export each walk the same chain. **Never add a sibling `app/[other]/page.tsx`** — Next.js rejects two differently-named dynamic segments at the same path level (ambiguous-route build error). Add a new flat type by extending this file's resolution chain *and* its `generateStaticParams` `Set`.
- Other types have their own namespaced dynamic routes: `app/blog/[slug]`, `app/case-studies/[slug]`, `app/problems/[slug]`, `app/lp/[slug]`.
- `app/lp/*` are **paid landing pages**: conversion-first, `noindex`, never linked in-site, and they use their own minimal chrome from `app/lp/layout.tsx`.
- **Static listing / standalone pages** (their own folder, no dynamic segment): `app/page.tsx` (home), and the index pages `app/services`, `app/service-areas`, `app/cost-guides`, `app/blog`, `app/case-studies`, `app/problems`, `app/reviews`, `app/gallery`. Plus standalone pages `app/about`, `app/contact`, `app/calculator`, `app/privacy`, `app/terms`. These pull lists from the data layer but aren't part of the slug-resolution chain. `app/service-areas` is a single listing page (regions + suburbs) — there is **no** `app/service-areas/[slug]` route; individual suburb pages are flat pages served by `app/[slug]`.

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
- **Booking dialog** — `components/sections/booking-dialog.tsx` embeds an **external live booking system in an iframe** (`https://booking-system-cgd.netlify.app/`). This is a separate app, not part of this repo.
- **AI chat widget** — `components/sections/ai-chat-widget.tsx`. **Scripted/canned UX only — there is no LLM backend or `fetch`**; "Powered by … knowledge base" is cosmetic. Don't assume a real model is wired up.
- **Sticky mobile CTA** — `components/layout/sticky-mobile-cta.tsx`, mounted by `SiteChrome` for non-`/lp` routes.

### Server actions & forms

`lib/actions/*.ts` (`submitQuote`, contact) are `"use server"` actions used by the form components (`components/forms/*`). **They are stubs that `console.log` the payload** — no email/CRM/API is wired up yet (search for the `TODO: send to email provider / CRM` markers). Lead forms collect UTM/gclid attribution fields.

### Motion & performance (sensitive)

`framer-motion` is loaded lazily through `LazyMotionProvider`; GSAP + Lenis power the smooth-scroll and the garage-door intro/reveal animations. These areas are performance-tuned — consult the auto-memory notes (first-load performance, ScrollDoorReveal rendering) before touching the intro, scroll, or canvas-reveal code. `next.config.ts` enables `experimental.inlineCss` (prod only) and restricts image `qualities` to `[60, 75]`.

### CMS (not built)

`docs/cms-architecture.md` is a **design draft only** for a future ASP.NET Core + SQL Server CMS that would replace the `content/*.ts` files by having `lib/data/*.ts` fetch from an API. Nothing in it is implemented. It's useful context for *why* the data layer is shaped the way it is (async, registry-per-type, FK-style internal links), but treat it as forward-looking, not current.
