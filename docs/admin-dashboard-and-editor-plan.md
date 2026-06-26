# Admin Restyle & In-Place Visual Page Editor — Implementation Plan

Status: **Design document. No feature code here.** This is the blueprint for two related pieces of
work in the public-site repo (`app/admin/**`):

1. **Restyle the admin** so it shares the site's theme, fonts, and component language instead of the
   current plain/utilitarian look.
2. **Rebuild the page editor as an in-place visual editor** — when you add/edit a page it renders AS
   THAT TEMPLATE'S REAL DESIGN and you edit content where it actually sits (click the H1, edit it in
   place; edit each section inline in its real position), not as a flat list of labelled form fields.

It builds on `docs/cms-architecture.md` (read §6 there for the per-type `Data` shapes — this plan
references them constantly but does not repeat them in full).

---

## 0. What exists today (grounding)

Read before changing anything; the editor must not break any of this.

**Design system**
- `app/globals.css` — Tailwind v4 `@theme inline` tokens. Brand: `--primary #1b3b8c` (navy),
  `--cta #c8222a` (red), `--foreground #0d1f45`, `oklch`-based muted/border/accent, `--radius
  0.625rem` with a radius scale up to `--radius-4xl`. Has bespoke keyframes/classes
  (`cgd-rise`, `cgd-reveal`, glass tooltips, door textures) used by the public site.
- `app/layout.tsx` — fonts wired as CSS vars: `--font-heading` (Poppins 600/700), `--font-body`
  (Open Sans), `--font-display` (Archivo Black). Tailwind exposes them as `font-heading`,
  `font-sans`, `font-display`.
- `config/site.ts` — brand name, phone, nav. `components.json` — shadcn `base-nova` style, lucide
  icons, `@base-ui/react` primitives.
- `components/ui/*` — button, card, input, label, textarea, select, dialog, sheet, tabs, accordion,
  separator, badge, breadcrumb, avatar, skeleton, etc. (already themed). `Button` variants:
  `default` (navy), `secondary`, `outline`, `ghost`, `destructive`, `link`; sizes `xs|sm|default|lg|icon*`.
- `components/layout/*` — `Container`, `header`, `footer`, `site-chrome`, `sticky-mobile-cta`.
- `components/motion/*` — `Reveal` (IntersectionObserver fade/slide, used everywhere in templates),
  `lazy-motion-provider`, `smooth-scroll-provider` (Lenis), `garage-door-loader`.

**Home page visual language** (`app/page.tsx` + `components/sections/*`)
- Hero (`components/sections/hero.tsx`) is a heavy client component: framer-motion van animation,
  springs, `useInView`, dynamic `BookingDialog`. Section wrappers use `Container`, soft gradient
  backdrops, grid line masks (`bg-[linear-gradient(...)] mask-[radial-gradient(...)]`), navy→dark
  image cards with `ring-1 ring-white/10` and big soft shadows, `font-display` numerals, rounded
  `2xl/3xl` cards, `Reveal` stagger via `delay={index*0.06}`.

**The 8 template types** (the public renderers to make editable — keep unchanged):
| Type | Template component | Section components dir |
| --- | --- | --- |
| ServicePage | `components/sections/service/service-page-template.tsx` | `components/sections/service/*` |
| ComparisonPage | `components/sections/comparison/comparison-page-template.tsx` | `components/sections/comparison/*` |
| CostGuidePage | `components/sections/cost-guide/cost-guide-page-template.tsx` | `components/sections/cost-guide/*` |
| ServiceSuburbPage | `components/page/service-suburb-page-template.tsx` | `components/page/*` |
| Article | `components/sections/blog/article-page-template.tsx` | `components/sections/blog/*` |
| CaseStudyPage | `components/sections/case-study/case-study-page-template.tsx` | `components/sections/case-study/*` |
| ProblemPage | `components/sections/problem/problem-page-template.tsx` | `components/sections/problem/*` |
| LandingPage | `components/sections/landing/landing-page-template.tsx` | `components/sections/landing/*` |

Each template is presentational: takes one typed prop (`data: ServicePage`, etc. from `types/*`),
composes `Container` + section components, renders text via plain `{value}` interpolation, lists via
`.map`, icons via `resolveIcon(name)` (`lib/icons.ts`, a closed lucide map), images via next/image.

**Data flow (two paths into the same templates):**
- Public: `app/[slug]/page.tsx` (and `/blog/[slug]`, `/case-studies/[slug]`, `/problems/[slug]`,
  `/lp/[slug]`) → `lib/data/*` → `<XPageTemplate data={...} />`. `dynamicParams = true` so
  CMS-published slugs render on demand.
- CMS: `lib/cms/client.ts#cmsResolve()` returns a `PageResolveDto` → `lib/cms/map-*.ts` maps it to
  the template's typed shape (e.g. `mapServicePage`) → same template. **The map functions are the
  authoritative DTO→props contract and the editor should reuse them.**

**Admin today** (`app/admin/**`, all field-based):
- `app/admin/layout.tsx` — `robots: { index:false, follow:false }`; `app/robots.ts` disallows
  `/admin` + `/api`. (Keep both.)
- `app/admin/login/page.tsx` + `components/admin/login-form.tsx`.
- `app/admin/(dashboard)/layout.tsx` — plain sticky top nav (Pages / Services / Pricing / Service
  areas / Gallery) + sign out. `max-w-5xl`.
- `app/admin/(dashboard)/pages/page.tsx` — a `<table>` grid.
- `pages/new/page.tsx` — template-type picker grid → renders the matching `<XPageForm />`.
- `pages/[id]/edit/page.tsx` — fetches `getPage(id)`, dispatches to `<XPageForm initial={...} />`.
- `components/admin/fields.tsx` — the box primitives: `Field`, `TextField`, `TextAreaField`,
  `CheckboxField`, `SelectField`, `ListField` (string arrays), `RepeaterField` (object arrays),
  `FaqEditor`, `RelatedLinksEditor`, `AssetUploadField` (POSTs to `/admin/api/upload`).
- `components/admin/*-form.tsx` (8 forms) — each holds local `useState` per field, has a
  `buildPayload()` that assembles the `CreatePageCommand` (see below), and a fixed save/publish bar.
- `app/admin/actions.ts#savePageAction(payload, publish)` — create-or-update by `id`, then optional
  publish; `lib/cms/admin.ts` wraps the ASP.NET endpoints; `app/admin/api/upload/route.ts` proxies
  uploads to the CMS (Bunny/CDN behind ASP.NET).

**The save payload (`CreatePageCommand`)** — what every editor must produce (from
`service-page-form.tsx#buildPayload`):
```ts
{
  id?: number,                 // present => update
  templateType, routeGroup,    // e.g. "ServicePage", "Flat"
  slug, title, seoTitle, seoDescription, noIndex, status, // "Draft" | "Published"
  heroImageAssetId: number | null,
  data: { /* the §6 bespoke JSON for this template type */ },
  faqs: [{ question, answer, sortOrder }],
  relatedLinks: [{ targetPageId, staticHref, labelOverride, linkGroup, sortOrder }],
  pricingRows: [...], reviews: [...], services: [...],  // relational "pins"
}
```
Critical constraint (`page-form-types.ts`): the backend **replaces ALL children on update**, so a
form that omits `pricingRows`/`reviews`/`services` would silently delete them. Every editor must
round-trip pins it doesn't manage (`initial?.x ?? []`).

---

## A. Admin chrome restyle

Goal: feel unmistakably like Capital Garage Door (same navy/red, Poppins/Open Sans, shadcn
components, rounded cards, soft shadows) while reading clearly as an internal tool — and staying
`noindex`/robots-disallowed. The admin already imports `globals.css` (shared `<html>`), so the
tokens are available; today's screens just don't use the component vocabulary.

### A.1 Shell (`app/admin/(dashboard)/layout.tsx`)
Replace the plain top bar with a **two-part app shell**:
- **Sidebar** (desktop) / **`Sheet` drawer** (mobile, from `components/ui/sheet.tsx`): brand lockup
  at top (navy wordmark in `font-heading`, small "CMS" pill in `--cta`), grouped nav with lucide
  icons — Content (Pages), Catalogs (Services, Pricing, Service areas, Gallery). Active item: navy
  left-border + `bg-primary/8`. Use `--sidebar*` tokens already defined in `globals.css`.
- **Top bar**: breadcrumb (`components/ui/breadcrumb.tsx`), a "View site" external link, and a user
  menu with Sign out. Keep it `bg-background/95 backdrop-blur` sticky like today.
- Background: `bg-muted/30` content area so white `Card`s pop — visually distinct from the public
  site (which is white) so it reads as "admin," using the same palette.
- Do **not** mount public chrome here (no `Header`/`Footer`/`SiteChrome`, no Lenis smooth-scroll, no
  garage-door intro). The admin keeps its own minimal `app/admin/layout.tsx`.

### A.2 Login (`app/admin/login/page.tsx` + `login-form.tsx`)
Centered `Card` on a subtle branded backdrop (reuse the hero's grid-line mask + navy radial-glow
divs, low opacity). Brand lockup above the card. Inputs → `components/ui/input.tsx` +
`label.tsx`; submit → `Button` (default navy). Error in a `bg-destructive/10` callout.

### A.3 Pages grid (`app/admin/(dashboard)/pages/page.tsx`)
Keep a table for density but restyle with shadcn tokens; add affordances:
- Toolbar: search input + `Tabs` or `Select` to filter by template type + status; primary
  **"+ New page"** `Button`. (Replace the misleading "+ New service page" label.)
- Status as `Badge` (published = emerald, draft = amber, noindex = muted outline).
- Row actions via a small menu (Edit / View / Publish / Unpublish / Delete) reusing
  `PageRowActions`.
- Empty/error states as `Card`s, not bare rows.
- Optional: a small dashboard landing (`(dashboard)/page.tsx`) with counts per type as `Card`
  tiles linking into filtered lists.

### A.4 Catalog screens (services / pricing-items / service-areas / gallery)
These are legitimately tabular/CRUD and should **stay form-based** (the in-place editor is only for
the 8 page templates). Restyle only: wrap lists in `Card`/table tokens, use `Dialog` for
create/edit where it's a small record, `Button` variants, `Badge` for status. Standardize on a
shared `<AdminPageHeader title actions />` and `<AdminCard />` wrapper so all catalog screens match.

### A.5 Tokens, fonts, consistency, and safety
- Reuse existing tokens only; no new palette. Headings `font-heading`, body `font-sans`; reserve
  `font-display` for the public site (don't import the loud display face into admin chrome — keep
  admin calmer).
- New shared admin primitives live in `components/admin/ui/*` (e.g. `admin-shell.tsx`,
  `admin-page-header.tsx`, `sidebar-nav.tsx`) to avoid bloating `components/ui/*`.
- **Keep `app/admin/layout.tsx`'s `robots:{index:false,follow:false}` and `app/robots.ts`'s
  `/admin` disallow.** The editor renders real public-looking pages, so this matters more than
  before — never drop it.

---

## B. The in-place visual editor — THE CORE

> **Recommended approach: Editable Context + thin `<Editable>` wrappers injected into the real
> templates, behind an `editing` flag — same components, two modes.** Detailed below as Option 3,
> after weighing the alternatives.

### B.1 The core problem
We want the editor to render the *actual* template (so it looks exactly like the page) yet make
each piece of text/image/list editable in place — without forking the 8 templates into "view" and
"edit" copies (forking doubles maintenance and guarantees drift between admin and live).

### B.2 Options considered

**Option 1 — Live preview pane beside the form (split screen).** Keep field forms; add an iframe/
pane rendering the template from current draft state. *Cheap, low-risk, reuses everything.* But it's
**not** "edit in place" — you still edit in a form list. Fails the core goal. (Good as a fallback /
"advanced view," see §C.)

**Option 2 — Fork each template into an editable variant** (or a giant per-type editor that
re-implements the layout with inputs). Pixel-perfect control, but 8× the code, and every public
design change must be mirrored. Rejected — violates "without forking them."

**Option 3 — Editable context + `<Editable>` wrappers inside the real templates (RECOMMENDED).**
Wrap the *string/array/image leaves* of each template in tiny components that:
- in **view mode** render exactly what they render today (children / plain text), so the public path
  is byte-for-byte unchanged;
- in **edit mode** (provided by a React context) become click-to-edit: text leaves turn into inline
  `contentEditable`/auto-grow inputs positioned exactly where the text sits; list leaves get
  add/remove/reorder affordances; image leaves open the asset picker.

The template stays one file. The only change to a template is swapping a raw `{data.hero.h1}` for
`<EditableText path="hero.h1">{data.hero.h1}</EditableText>` (or wrapping a `.map` in
`<EditableList path="processSteps">`). Outside edit mode these are transparent.

**Option 4 — A third-party visual builder (Puck, Builder.io, Plasmic, Craft.js).** Powerful, but
they impose their own block model and data shape; our content is fixed typed templates with a
relational backend (FAQs/pins/links as FKs), not freeform blocks. Adopting one means re-modeling
content and fighting the tool to render *our* exact sections. Rejected for v1; revisit only if
requirements shift toward freeform page-building (explicitly a non-goal per architecture §2).

### B.3 Recommended architecture in detail

#### (a) Editing context + draft store
A client provider `components/admin/editor/editable-context.tsx`:
```ts
interface EditableCtx {
  editing: boolean;
  draft: TemplateData;                 // the live, mutable copy of the template's typed props
  get(path: string): unknown;          // dot/bracket path, e.g. "processSteps[2].title"
  set(path: string, value: unknown): void;
  listOps(path): { add, removeAt, move };
  selectAsset(path): Promise<void>;    // opens the asset picker, writes assetId+url back
  errors: Record<string /*path*/, string>;
  registerField(path, meta): void;     // for the outline/validation panel
}
```
- The draft is a single object matching the template's **typed props** (e.g. `ServicePage`), seeded
  by reusing the existing `map-*.ts` (DTO→props) so the edit view and the live view start identical.
- `set(path, value)` does an immutable update at a dot-path (use a tiny helper, or `immer`/`lodash`
  — see libraries). Re-render is cheap because templates are presentational.
- State lives in a `useReducer`/`zustand` store at the editor route, **not** in the template — the
  template only *reads* via context, so the same component tree works for live (no provider →
  `editing:false` default) and edit (provider supplies draft).

#### (b) The `<Editable*>` primitives (`components/admin/editor/editable.tsx`)
All render children verbatim when `!editing`:
- **`<EditableText path multiline?>`** — view: `<>{ctx.get(path)}</>`. Edit: an inline editor sized
  to the text. **Recommendation: use a controlled auto-grow `<textarea>`/`<input>` styled to inherit
  the surrounding font/size/line-height** (transparent background, no border until hover/focus,
  dotted hover ring), NOT raw `contentEditable`. This dodges the well-known `contentEditable` pitfalls
  (React fighting the DOM, paste sanitization, caret jumps) while still appearing in place because it
  inherits the template's typography. A small `useEditableInherit()` hook copies computed font styles
  onto the input.
- **`<EditableRichText path>`** (Article body paragraphs, callout bodies) — only where multi-line
  formatting matters. Keep it minimal (plain text + line breaks) for v1; a real rich-text lib
  (TipTap) is optional later. Most leaves are plain text and don't need it.
- **`<EditableList path renderItem itemTemplate>`** — view: maps as today. Edit: each item gets a
  hover toolbar (drag handle, delete, duplicate); a "+ Add" affordance appears at the end styled as a
  ghost card matching the real item. Reorder via `move(from,to)`. `itemTemplate` supplies the blank
  object for "add" (e.g. `{ title:"", description:"", icon:"Wrench" }`).
- **`<EditableImage path>`** — view: the real `next/image`. Edit: overlay a "Change image" button on
  hover that opens the asset picker; writes the chosen `assetId` (and a preview URL for immediate
  render) back to the draft.
- **`<EditableIcon path>`** — small picker over the closed `lib/icons.ts` map (grid of the ~30 lucide
  icons) so icon names stay valid.
- **`<EditableGroup path label>`** (optional) — a hover chrome that labels a whole section
  ("Process steps") and hosts section-level actions; helps orientation without turning it into a form.

These primitives are the *entire* per-leaf editing surface; they're written once and reused across
all 8 templates.

#### (c) Making templates dual-mode without forking
For each template, replace raw leaves with `<Editable*>` wrappers bound to dot-paths into the typed
props. Example (ServiceHero):
```tsx
// before:  <h1 ...>{hero.h1}</h1>
// after:   <h1 ...><EditableText path="hero.h1">{hero.h1}</EditableText></h1>
```
Because `<EditableText>` returns `children` (or a fragment) when not editing, **the public render is
unchanged** and SSR output is identical. The wrappers are imported from a module that, on the public
path, resolves to a no-op passthrough (see B.5 motion/SSR). Paths must mirror the **typed props**
(what the template reads), and a per-type adapter (B.4) translates between props-shape and the
save-payload `data` shape.

To keep diffs small and reviewable, wrap leaves template-by-template (one PR per type), starting with
ServicePage (§D Phase 3).

#### (d) Repeaters / arrays in place
Driven by `<EditableList>`:
- **Process steps / why-choose / badges / decision cards / causes / available services**: each card
  renders the real card; hovering reveals a drag handle (reorder), duplicate, and delete; a trailing
  "ghost" add-card. New item seeded from `itemTemplate`.
- **String lists** (intro paragraphs, includedItems, serviceAreas, benefits/limitations, safeChecks):
  same pattern, each line editable inline with add/remove.
- **FAQs**: render the real `FAQSection` accordion in edit mode with each Q/A editable and add/remove
  — but FAQs are a **relational pin** (see B.6), so the list writes to the editor's `faqs` array, not
  to `data`.
- **Comparison table rows / cost table rows**: edit the real `<table>` cells in place; add/remove
  rows via row hover controls. Cost-guide rows are `PagePricingRows` (pins) — edited in place but
  saved to `pricingRows` (B.6).
- **Article content blocks**: the richest repeater. Render the real `ArticleContent` switch; in edit
  mode each block has inline editing for its fields and a block toolbar (move up/down, delete,
  change type); a "+ Add block" menu lists the block types (heading/paragraph/list/checklist/callout/
  image/quote) and inserts a blank of that type. This is the one type that feels closest to a block
  editor — and that's correct, because the content model *is* blocks here.

Library for reorder: **`@dnd-kit/core` + `@dnd-kit/sortable`** (accessible, headless, no opinion on
styling). Optional — arrow up/down buttons are a fine v1 fallback with zero deps.

#### (e) Images in place
`<EditableImage>` → an **Asset Picker** dialog (`components/ui/dialog.tsx`): tabs for "Upload" (drag/
drop → existing `POST /admin/api/upload` → Bunny, returns `{id, cdnUrl}`) and "Library" (recent
assets; needs a small `GET /admin/api/assets` proxy if not already present — flag as a backend dep).
On select, write `heroImageAssetId` (or the block/case-study `assetId`) **and** a transient preview
URL into the draft so the template re-renders instantly with the new image. Alt text edits inline via
an `<EditableText>` on the image's caption/alt affordance.

#### (f) Mapping edits back to the save payload
The draft is in **props shape**; the payload needs **`data` (§6) shape + relational arrays**. Add a
per-type **serializer** `components/admin/editor/serializers/<type>.ts` that is the inverse of the
existing `map-*.ts`:
```ts
// map-service-page.ts:  PageResolveDto  ->  ServicePage (props)        [exists, reuse for load]
// serialize-service.ts: ServicePage (draft) + pins  ->  CreatePageCommand   [new, for save]
```
The serializer pulls relational bits out of the draft (or out of separate pin state — see B.6) into
`faqs` / `relatedLinks` / `pricingRows` / `reviews` / `services`, assembles `data` per §6, and
**echoes untouched pins** (`initial?.x ?? []`). This pairing (`map-*` for load, `serialize-*` for
save) is the only substantial per-type code, and each is a flat, testable pure function. Then call
the **unchanged** `savePageAction(payload, publish)`.

#### (g) SEO/meta + relational data that isn't "on the page"
Some fields have no visible spot on the page. Put them in a **Settings drawer** (`Sheet` from the
right) toggled from the editor toolbar, with `Tabs`:
- **General**: `title`, `slug` (with live `/preview` of the resulting URL), `status` (Draft/
  Published), `noIndex`.
- **SEO**: `seoTitle`, `seoDescription`, with a Google-result snippet preview (reuses tokens).
- **Related links**: the `RelatedLinksEditor` experience (target page picker by id, or static href)
  — these *can* also be edited in place where the template shows a "related services" grid, but the
  drawer is the canonical place for link-group management.
- **Pins**: review pins (search/pick from the global Reviews pool), pricing rows (pick `PricingItems`
  + per-page note override), service pins. Where the template visibly renders them (review cards,
  cost table), allow in-place add/reorder too; the drawer is the full manager.

Rationale: page-like editing for everything that's visually on the page; a tidy drawer for metadata
and FK plumbing that has no on-page representation. This matches the architecture's relational model
(FAQs/links/pins as real children) without forcing the user into a form for the visible content.

#### (h) Draft vs published, validation, save bar
- **Editor toolbar** (sticky top, inside the editor route, styled like the public sticky CTA bar but
  admin-toned): left = page title + status `Badge` + "Editing" indicator; center = device-width
  toggle (desktop/mobile preview) + "Preview" (toggles `editing` off to see the clean page); right =
  **Save draft** / **Save & publish** (reusing `savePageAction(payload, publish)`), plus a Settings
  button (opens the drawer) and "Discard changes."
- **Validation**: client-side per-path validation (required H1, slug format, SEO length hints).
  Surface errors *in place* — the offending `<Editable>` gets an `aria-invalid` red ring + a small
  inline message — and aggregate them in the Settings drawer's "Issues" tab with jump-to links
  (using the `registerField` registry). On save, also surface server `errors` from `savePageAction`
  the same way.
- **Dirty tracking**: warn on navigate-away if the draft differs from the loaded snapshot.

#### (i) Covering all 8 types with minimal bespoke code
Shared and written once: the context/store, all `<Editable*>` primitives, the asset picker, the
settings drawer, the toolbar, dnd wiring. **Per type you only add:** (1) the `<Editable*>` wrappers
inside that template (mechanical), and (2) a `serialize-<type>.ts` (mirrors the existing
`map-<type>.ts`). A registry maps `templateType → { Template, map, serialize, itemTemplates }` so the
editor route is a thin dispatcher (mirrors today's `pages/[id]/edit` switch). Adding a 9th type later
= add a template + a map + a serialize + wrap leaves; no editor-core changes.

### B.4 Editor route wiring
- New client editor lives at e.g. `app/admin/(dashboard)/pages/[id]/edit/page.tsx` (server: load via
  `getPage`, build `initial`, pass to a client `<PageEditor templateType initial />`) and
  `pages/new/page.tsx` (`initial` = a per-type **blank draft** from `itemTemplates`/defaults).
- `<PageEditor>` wraps the chosen template in `<EditableProvider editing draft=...>` and renders the
  toolbar + settings drawer around it. For new pages, seed a sensible skeleton (one process step, one
  FAQ, placeholder hero) so the canvas isn't empty.

### B.5 Honest trade-offs / risks
- **`contentEditable` pitfalls** → avoided by using inherited-style inputs/textareas instead (B.5b).
  The one place rich text is tempting (Article paragraphs) stays plain-text in v1; TipTap only if
  needed.
- **SSR vs client** → templates are currently server components; in edit mode the whole editor route
  is a client component (fine — admin isn't SEO-sensitive and is `noindex`). To keep the public path
  a pure server render, the `<Editable*>` wrappers must compile to a **passthrough with zero client
  cost** when used on the public site. Recommended: the wrappers read context with a default of
  `editing:false`; the public path never wraps them in a provider, so they render children directly.
  Confirm none of them introduce `"use client"` into a server-rendered public template — if a
  template is a server component, the wrapper should be a server-safe passthrough that only upgrades
  to interactive under the provider. (Simplest safe pattern: the editor route imports the template
  through a thin client boundary; the public route imports it as today.)
- **Motion interfering with editing** → some sections animate (`Reveal` fade/slide; the home/landing
  hero uses framer-motion springs, `useInView`, pointer tilt). While editing, motion fights clicks
  and obscures content. **Mitigation:** the `EditableProvider` sets a `data-editing` flag; add a CSS
  rule under it that neutralizes `cgd-reveal`/`cgd-rise` (show immediately, no transform) and the
  editor disables interactive hero animations (pass an `editing` prop that short-circuits the
  motion, or render a static hero variant for the heavy `Hero`/`LandingHero`). Reuse the existing
  `prefers-reduced-motion` code paths where possible.
- **Keeping the public render path untouched** → guaranteed by the passthrough wrappers + reusing
  `map-*.ts`; add a snapshot/visual check that a sample page renders identically with and without the
  (inactive) wrappers before/after wrapping each template.
- **Click targets vs. layout** → inline inputs must not shift layout when focused; size them to the
  content and use outline/ring (not border-box growth). Empty fields need a visible placeholder
  ("Add heading…") so they're discoverable when blank.
- **Fixed/overlapping chrome** → templates have `StickyMobileCta`, sticky bars; the editor toolbar
  must not collide. Render the template inside a scroll container offset below the toolbar, and hide
  the public sticky CTAs while editing.
- **Backend dependency** → an asset "Library" tab and live preview need a `GET assets` list endpoint;
  if absent, ship Upload-only first.

### B.6 Relational pins recap (don't lose data)
FAQs, related links, pricing rows, reviews, services are **children replaced wholesale on save**.
The editor must (a) load them into pin state from `initial`, (b) let the user edit the ones with
on-page representation in place (FAQs accordion, cost table, review cards, related-services grid),
(c) manage the rest in the Settings drawer, and (d) always serialize *all* of them back (untouched
ones echoed) so nothing is silently deleted. This is the single most important correctness rule.

---

## C. Migration path (don't break what works)

Phased, additive, with the field forms preserved as a fallback:

1. **Restyle first, behaviour unchanged (A).** Pure visual; zero risk to data flow. Ship the shell,
   login, grid, catalog restyle. The existing field forms keep working under the new chrome.
2. **Introduce the editor scaffolding** (context, primitives, asset picker, toolbar, settings
   drawer) with **no template wired** — develop against a throwaway demo template.
3. **One template end-to-end: ServicePage.** Wrap its leaves, write `serialize-service.ts`, wire the
   new editor route behind a flag/segment so it's opt-in. Prove create + edit + publish round-trips
   to a live page identical to the old form's output (diff the payloads).
4. **Keep the field form as "Advanced view."** On every editor, a toggle swaps the in-place canvas
   for the existing `<XPageForm>` (Option 1 split/forms). Same draft state feeds both, so power users
   / debugging keep the exhaustive field list. This is the safety net: if a field has no in-place
   home yet, it's still editable in Advanced view.
5. **Roll out the remaining 7 types** one per PR (Comparison, CostGuide, ServiceSuburb, Problem,
   Article, CaseStudy, Landing — roughly simplest→richest; Article last as the block editor).
6. **Flip the default** to the in-place editor once all 8 are wrapped and verified; field forms
   remain reachable via "Advanced view" indefinitely (cheap insurance).
7. **Cleanup** only after a soak period: optionally retire forms whose every field is covered
   in place.

No backend changes are required for the editor (it reuses `savePageAction` + the existing payload);
the only optional backend asks are a `GET assets` list and (already exists) the upload proxy.

---

## D. Phased implementation plan (concrete, file-level, rough effort)

Effort is relative (S ≈ <1 day, M ≈ 1–3 days, L ≈ 3–5 days) for one developer; sequential.

### Phase 1 — Admin chrome restyle (M)
- `components/admin/ui/admin-shell.tsx`, `sidebar-nav.tsx`, `admin-page-header.tsx` (new shared
  primitives).
- Rewrite `app/admin/(dashboard)/layout.tsx` to use the shell (sidebar + `Sheet` mobile drawer).
- Restyle `app/admin/login/page.tsx` + `components/admin/login-form.tsx`.
- Restyle `app/admin/(dashboard)/pages/page.tsx` (toolbar, `Badge` status, row menu) and add an
  optional dashboard `(dashboard)/page.tsx`.
- Restyle catalog list screens (services / pricing-items / service-areas / gallery) with shared
  header/card + `Dialog` editors; no behavior change.
- Verify `robots`/`noindex` untouched.
- *Deliverable:* admin looks like CGD; all current forms still work.

### Phase 2 — Editor foundation (L)
- `components/admin/editor/editable-context.tsx` (provider + store; pick `zustand` or `useReducer`).
- `components/admin/editor/editable.tsx` (`EditableText`, `EditableRichText`, `EditableList`,
  `EditableImage`, `EditableIcon`, `EditableGroup`) — with the inherited-style inline input approach.
- `components/admin/editor/asset-picker.tsx` (Upload tab via `/admin/api/upload`; Library tab gated
  on a `GET assets` endpoint).
- `components/admin/editor/editor-toolbar.tsx` + `settings-drawer.tsx` (General/SEO/Links/Pins/Issues
  tabs).
- `components/admin/editor/registry.ts` (`templateType → { Template, map, serialize, itemTemplates }`)
  and `path` get/set helpers.
- CSS: an admin-only `data-editing` rule set (neutralize reveal/rise, edit affordance styles).
- *Deliverable:* foundation demoed on a stub template; no production template wired yet.

### Phase 3 — ServicePage end-to-end (M)
- Wrap leaves in `components/sections/service/*` (`service-hero`, `intro-section`, `problem-cards`,
  `included-checklist`, `process-steps`, `cost-table`, `why-choose`, `related-links`,
  `service-area-grid`, `review-cards`, plus `faq-section`) with `<Editable*>`.
- `components/admin/editor/serializers/serialize-service.ts` (inverse of `lib/cms/map-service-page.ts`).
- New client editor route `pages/[id]/edit` + `pages/new` wiring a `<PageEditor>` (behind a segment/
  flag), with "Advanced view" toggle to the existing `ServicePageForm`.
- Verify payload parity with the old form; create/edit/publish to a live page; confirm public render
  unchanged.
- *Deliverable:* a fully in-place ServicePage editor; proves the pattern.

### Phase 4 — Remaining 7 templates (L, ~M per type)
Per type, in order Comparison → CostGuide → ServiceSuburb → Problem → CaseStudy → Landing → Article:
- Wrap leaves in that template's section components.
- Add `serialize-<type>.ts` mirroring its `map-<type>.ts`.
- Register it; add per-type `itemTemplates` (blank repeater rows) and any type-specific pin handling
  (CostGuide pricing rows; Landing/ServiceSuburb review pins; Problem `PageServices`).
- Special cases: **Landing** hero is heavy framer-motion → provide a static/edit hero variant;
  **Article** needs the block-add menu + per-block toolbars (the richest piece).
- *Deliverable:* all 8 types editable in place.

### Phase 5 — Polish, validation, cutover (M)
- In-place + drawer validation with jump-to-issue; dirty-nav guard; device-width preview;
  hide public sticky CTAs while editing.
- Flip default to in-place editor; keep "Advanced view" forms reachable.
- Visual regression spot-checks (public render identical) and a payload diff test per type.
- *Deliverable:* in-place editor is the default; field forms remain as fallback.

### Libraries worth considering
- **State**: `zustand` (tiny) or built-in `useReducer` — recommend `zustand` for ergonomic path
  updates; `immer` for immutable dot-path sets.
- **Reorder**: `@dnd-kit/core` + `/sortable` (accessible) — optional; arrow buttons as no-dep v1.
- **Rich text** (Article only, optional/later): `@tiptap/react`.
- Avoid full visual-builder frameworks (Puck/Builder/Plasmic/Craft) — wrong fit for fixed typed
  templates with a relational backend (see B.2 Option 4).

---

## Summary of the recommendation
- **Admin restyle (A):** an app-shell (sidebar + drawer) using existing `components/ui/*` and theme
  tokens, navy/red brand, Poppins/Open Sans, `Card`/`Badge`/`Dialog`/`Sheet`; keep `noindex`.
- **Editor (B):** render the **real templates** in a **dual-mode** way via an **Editable context +
  thin `<Editable*>` wrappers** (Option 3) — no forking, public path unchanged. Repeaters edit in
  place with hover toolbars + `@dnd-kit`; images via an asset picker over `/admin/api/upload`; SEO/
  meta/FK pins in a Settings `Sheet`; save through the existing `savePageAction` via per-type
  `serialize-*` functions that mirror the existing `map-*` loaders. All 8 types share one editor
  core; per type you only wrap leaves + add a serializer.
- **Migration (C):** restyle first; build the editor scaffolding; prove it on **ServicePage**
  end-to-end; keep the current field forms as an **"Advanced view" fallback**; roll out the other 7;
  flip the default last.
- **Phases (D):** 1 restyle → 2 editor foundation → 3 ServicePage e2e → 4 remaining 7 → 5 polish +
  cutover.
