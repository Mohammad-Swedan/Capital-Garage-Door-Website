# Capital Garage Door — CMS Architecture

Status: **Design draft, not yet implemented.** This document is the full spec for the CMS we designed — backend in ASP.NET Core + SQL Server, content modeled as "template instances," editor app as a separate Next.js admin, public site fetching from the API instead of local `content/*.ts` files.

---

## 1. Goals

- Let a non-developer create/edit pages of an existing type (service page, comparison page, cost guide, case study, blog article, problem page, landing page) without touching code.
- Keep the existing Next.js template components (`ServicePageTemplate`, `ComparisonPageTemplate`, etc.) unchanged — the CMS supplies data in the same shape they already consume.
- Avoid the broken-link class of bug found during the SEO audit (hardcoded hrefs that 404 after a slug changes) by making internal links real foreign keys where it matters.
- Single editor for v1 — no draft/approval workflow, no versioning. Save = live (with a Draft/Published flag kept as a cheap escape hatch).
- Images go through a CDN; ASP.NET handles the upload/storage integration.

## 2. Non-goals (v1)

- No generic drag-and-drop page/block builder. Every page is an instance of a fixed template type.
- No multi-role permissions, approval workflows, or version history/rollback.
- No multi-tenant support — this is a single-site CMS.

## 3. Tech stack

| Layer           | Choice                                                                       |
| --------------- | ---------------------------------------------------------------------------- |
| Public site     | Next.js (existing repo), dynamic rendering + ISR with on-demand revalidation |
| Admin/editor UI | Separate Next.js app (or `/admin` route group) calling the API               |
| Backend API     | ASP.NET Core Web API + EF Core                                               |
| Database        | SQL Server                                                                   |
| Auth            | ASP.NET Identity issuing JWT bearer tokens to the admin app                  |
| Images          | CDN (provider TBD — see Open Questions), uploaded via the ASP.NET API        |

---

## 4. Content model: template instances

Every page on the site is an **instance** of a fixed **template type**. The set of template types is closed and code-defined (adding a new type means a new template component + a migration); creating a new _page_ of an existing type is pure data entry.

| Template Type                     | Route group    | Route pattern          | Existing component          | Notes                                         |
| --------------------------------- | -------------- | ---------------------- | --------------------------- | --------------------------------------------- |
| `ServicePage`                     | `flat`         | `/[slug]`              | `ServicePageTemplate`       | e.g. `/garage-door-repairs-perth`             |
| `ComparisonPage`                  | `flat`         | `/[slug]`              | `ComparisonPageTemplate`    | e.g. `/roller-door-vs-sectional-door`         |
| `CostGuidePage` -- (`Guid pages`) | `flat`         | `/[slug]`              | `CostGuidePageTemplate`     | e.g. `/garage-door-repair-cost-perth`         |
| `ServiceSuburbPage`               | `flat`         | `/[slug]`              | `ServiceSuburbPageTemplate` | e.g. `/garage-door-repairs-joondalup`         |
| `CaseStudyPage`                   | `case-studies` | `/case-studies/[slug]` | `CaseStudyPageTemplate`     |                                               |
| `Article`                         | `blog`         | `/blog/[slug]`         | `ArticlePageTemplate`       |                                               |
| `ProblemPage`                     | `problems`     | `/problems/[slug]`     | `ProblemPageTemplate`       |                                               |
| `LandingPage`                     | `lp`           | `/lp/[slug]`           | `LandingPageTemplate`       | always `NoIndex = true`, never linked in-site |

`flat` is a single shared slug namespace — the four flat types currently resolve through one `app/[slug]/page.tsx` that tries each registry in turn. The other four route groups each have their own slug namespace.

---

## 5. Database schema

Conventions: every primary key is `int IDENTITY(1,1)`. `Data` columns store JSON as `NVARCHAR(MAX)` with a `CHECK (ISJSON(Data) = 1)` constraint (safe on any SQL Server version — see Open Questions if you're on SQL Server 2025 / Azure SQL and want the native `json` type instead).

### 5.1 `Pages` — the template instances

```sql
CREATE TABLE Pages (
  Id              INT IDENTITY(1,1) PRIMARY KEY,
  TemplateType    VARCHAR(50)   NOT NULL,   -- "ServicePage" | "ComparisonPage" | "CostGuidePage" |
                                             -- "ServiceSuburbPage" | "CaseStudyPage" | "Article" |
                                             -- "ProblemPage" | "LandingPage"
  RouteGroup      VARCHAR(20)   NOT NULL,   -- "flat" | "case-studies" | "blog" | "problems" | "lp"
  Slug            VARCHAR(200)  NOT NULL,
  Title           NVARCHAR(300) NOT NULL,
  Status          VARCHAR(20)   NOT NULL DEFAULT 'Published',  -- "Draft" | "Published"
  NoIndex         BIT           NOT NULL DEFAULT 0,
  SeoTitle        NVARCHAR(300) NOT NULL,
  SeoDescription  NVARCHAR(500) NOT NULL,
  HeroImageAssetId INT NULL REFERENCES Assets(Id),
  Data            NVARCHAR(MAX) NOT NULL CHECK (ISJSON(Data) = 1),
  CreatedAt       DATETIME2     NOT NULL DEFAULT SYSUTCDATETIME(),
  UpdatedAt       DATETIME2     NOT NULL DEFAULT SYSUTCDATETIME(),
  PublishedAt     DATETIME2     NULL,
  CONSTRAINT UQ_Pages_RouteGroup_Slug UNIQUE (RouteGroup, Slug)
);
```

`Data` holds only the parts of each template that are bespoke to that page (hero copy, process steps, content blocks, etc.) — anything reusable or list-like has been pulled out into the tables below. See §6 for the exact `Data` shape per template type.

### 5.2 Reusable entities

```sql
CREATE TABLE Assets (
  Id          INT IDENTITY(1,1) PRIMARY KEY,
  CdnUrl      NVARCHAR(500) NOT NULL,
  AltText     NVARCHAR(300) NOT NULL,
  Width       INT NULL,
  Height      INT NULL,
  UploadedAt  DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
);

CREATE TABLE Faqs (
  Id        INT IDENTITY(1,1) PRIMARY KEY,
  PageId    INT NOT NULL REFERENCES Pages(Id) ON DELETE CASCADE,
  Question  NVARCHAR(500) NOT NULL,
  Answer    NVARCHAR(MAX) NOT NULL,
  SortOrder INT NOT NULL DEFAULT 0
);

CREATE TABLE Reviews (
  Id             INT IDENTITY(1,1) PRIMARY KEY,
  CustomerName   NVARCHAR(200) NOT NULL,
  Rating         TINYINT NOT NULL CHECK (Rating BETWEEN 1 AND 5),
  Text           NVARCHAR(MAX) NOT NULL,
  ReviewDate     DATE NOT NULL,
  Service        NVARCHAR(200) NULL,
  Suburb         NVARCHAR(200) NULL,
  SourcePlatform NVARCHAR(50) NULL,        -- "Google" | "Facebook" | "Website"
  IsFeatured     BIT NOT NULL DEFAULT 0
);

-- Pin specific reviews to specific pages (a suburb page showing 3 local reviews,
-- a landing page showing a curated set) while Reviews stays a single global pool
-- (also used for the /reviews aggregate rating).
CREATE TABLE PageReviews (
  PageId    INT NOT NULL REFERENCES Pages(Id) ON DELETE CASCADE,
  ReviewId  INT NOT NULL REFERENCES Reviews(Id),
  SortOrder INT NOT NULL DEFAULT 0,
  PRIMARY KEY (PageId, ReviewId)
);

-- The homepage service-tile catalog (6 items today).
CREATE TABLE Services (
  Id               INT IDENTITY(1,1) PRIMARY KEY,
  Slug             VARCHAR(100) NOT NULL UNIQUE,
  Name             NVARCHAR(200) NOT NULL,
  ShortDescription NVARCHAR(300) NOT NULL,
  IconName         VARCHAR(50) NOT NULL,
  AssetId          INT NULL REFERENCES Assets(Id),
  CanonicalPageId  INT NULL REFERENCES Pages(Id),  -- null until a dedicated page exists
  SortOrder        INT NOT NULL DEFAULT 0
);

CREATE TABLE GalleryItems (
  Id             INT IDENTITY(1,1) PRIMARY KEY,
  AssetId        INT NOT NULL REFERENCES Assets(Id),
  BeforeAssetId  INT NULL REFERENCES Assets(Id),   -- for "Before & After" category
  Category       VARCHAR(50) NOT NULL,              -- Repairs | Installations | Motors |
                                                     -- Roller Doors | Commercial | Before & After
  Caption        NVARCHAR(300) NULL,
  SortOrder      INT NOT NULL DEFAULT 0
);

CREATE TABLE ServiceAreaRegions (
  Id        INT IDENTITY(1,1) PRIMARY KEY,
  Name      NVARCHAR(100) NOT NULL,        -- "Northern Suburbs", "Coastal Suburbs", etc.
  SortOrder INT NOT NULL DEFAULT 0
);

CREATE TABLE Suburbs (
  Id        INT IDENTITY(1,1) PRIMARY KEY,
  RegionId  INT NOT NULL REFERENCES ServiceAreaRegions(Id),
  Name      NVARCHAR(100) NOT NULL,
  Slug      VARCHAR(100) NULL,
  PageId    INT NULL REFERENCES Pages(Id),  -- set once a ServiceSuburbPage exists for this suburb
  SortOrder INT NOT NULL DEFAULT 0
);
```

`Services.CanonicalPageId` and `Suburbs.PageId` generalize the fallback pattern already in the live code (`canonicalHref` defaulting to `/garage-door-repairs-perth`; suburb chips that "render as plain cards until [a page] exists"). When null, the admin UI shows "no dedicated page yet." Once someone creates one and links it here, the tile/chip becomes clickable with no manual href editing.

### 5.3 Internal links — real foreign keys

```sql
CREATE TABLE PageRelatedLinks (
  Id             INT IDENTITY(1,1) PRIMARY KEY,
  SourcePageId   INT NOT NULL REFERENCES Pages(Id) ON DELETE CASCADE,
  TargetPageId   INT NULL REFERENCES Pages(Id),
  StaticHref     VARCHAR(300) NULL,         -- escape hatch for non-CMS routes (/contact, tel:...)
  LabelOverride  NVARCHAR(200) NULL,        -- falls back to TargetPage.Title if null
  LinkGroup      VARCHAR(50) NOT NULL,      -- "relatedServices" | "nearbySuburbs" | "relatedPages" |
                                             -- "relatedArticles"
  SortOrder      INT NOT NULL DEFAULT 0,
  CONSTRAINT CK_PageRelatedLinks_Target CHECK (
    (TargetPageId IS NOT NULL AND StaticHref IS NULL) OR
    (TargetPageId IS NULL AND StaticHref IS NOT NULL)
  )
);

-- "Related services" that point at the Services catalog rather than an arbitrary page
-- (used by ProblemPage.relatedServices today).
CREATE TABLE PageServices (
  PageId    INT NOT NULL REFERENCES Pages(Id) ON DELETE CASCADE,
  ServiceId INT NOT NULL REFERENCES Services(Id),
  SortOrder INT NOT NULL DEFAULT 0,
  PRIMARY KEY (PageId, ServiceId)
);
```

If a target page's slug ever changes, every `PageRelatedLinks` row pointing at it via `TargetPageId` keeps working automatically — this is the fix for the exact bug class I corrected by hand during the SEO audit (hardcoded `href` strings that 404'd after a restructure).

### 5.4 Centralized pricing

```sql
CREATE TABLE PricingItems (
  Id          INT IDENTITY(1,1) PRIMARY KEY,
  Scenario    NVARCHAR(200) NOT NULL,        -- "Spring or cable issue"
  PriceMin    DECIMAL(10,2) NULL,
  PriceMax    DECIMAL(10,2) NULL,
  PriceLabel  NVARCHAR(100) NULL,            -- free-text fallback, e.g. "From $129 call-out"
  Note        NVARCHAR(300) NULL,
  Category    NVARCHAR(100) NULL,            -- admin-side grouping/filtering
  -- The following three are only populated for CostGuidePage-style rows
  -- (richer "what's included" table rows vs. a simple price lookup).
  Includes    NVARCHAR(MAX) NULL,
  CostFactors NVARCHAR(MAX) NULL,
  NextStep    NVARCHAR(MAX) NULL,
  UpdatedAt   DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
);

CREATE TABLE PagePricingRows (
  PageId        INT NOT NULL REFERENCES Pages(Id) ON DELETE CASCADE,
  PricingItemId INT NOT NULL REFERENCES PricingItems(Id),
  SortOrder     INT NOT NULL DEFAULT 0,
  NoteOverride  NVARCHAR(300) NULL,
  PRIMARY KEY (PageId, PricingItemId)
);
```

This is a deliberate generalization: `ServicePage.costGuidance.rows` and `Problem.costRows` are simple scenario→price lookups, while `CostGuidePage.costTable.rows` is a richer table (includes/cost-factors/next-step columns). Rather than two separate pricing tables, `PricingItems` carries a few nullable narrative columns used only by the richer rows. **Flagged in Open Questions** — confirm this is the right call vs. keeping them as two separate tables.

---

## 6. `Pages.Data` shape per template type

These mirror the existing TypeScript interfaces (`types/service-page.ts`, `types/comparison-page.ts`, etc.) with the now-relational fields removed: `faqs` (→ `Faqs`), `relatedServices`/`relatedPages`/`nearbySuburbs`/`relatedArticles` (→ `PageRelatedLinks` or `PageServices`), `reviews` (→ `PageReviews`), pricing rows (→ `PagePricingRows`), image `src`/`alt` pairs (→ `Assets`, referenced by `assetId`), and `updatedAt`/`publishedAt` (→ real `Pages` columns).

**`ServicePage`**

```json
{
  "hero": {
    "h1": "",
    "subtitle": "",
    "badges": [{ "icon": "", "label": "" }],
    "imageAlt": "",
    "floatingCardLabel": ""
  },
  "directAnswer": "",
  "intro": { "heading": "", "paragraphs": [""] },
  "problems": [{ "label": "", "icon": "", "problemPageId": null }],
  "includedItems": [""],
  "processSteps": [{ "title": "", "description": "", "icon": "" }],
  "costGuidanceIntro": "",
  "whyChoose": [{ "title": "", "description": "", "icon": "" }],
  "serviceAreas": [""],
  "cta": { "heading": "", "subtitle": "" }
}
```

(`hero.image` is now `Pages.HeroImageAssetId`. `problems[].problemPageId` replaces the old loose `slug?` reference with a real nullable FK to `Pages`.)

**`ComparisonPage`**

```json
{
  "topicLabel": "",
  "hero": { "h1": "", "subtitle": "" },
  "directAnswer": "",
  "comparisonTable": {
    "optionALabel": "",
    "optionBLabel": "",
    "rows": [{ "feature": "", "optionA": "", "optionB": "" }]
  },
  "optionA": {
    "name": "",
    "icon": "",
    "summary": "",
    "benefits": [""],
    "limitations": [""],
    "bestFor": [""]
  },
  "optionB": { "...": "same shape as optionA" },
  "decisionCards": [
    {
      "heading": "",
      "icon": "",
      "tone": "optionA|optionB|uncertain",
      "points": [""]
    }
  ],
  "cta": { "heading": "", "subtitle": "" }
}
```

**`CostGuidePage`**

```json
{
  "topicLabel": "",
  "hero": { "h1": "", "subtitle": "" },
  "directAnswer": "",
  "costTable": { "heading": "", "intro": "", "disclaimer": "" },
  "factors": {
    "heading": "",
    "items": [{ "icon": "", "title": "", "description": "" }]
  },
  "scenarios": {
    "heading": "",
    "items": [{ "icon": "", "title": "", "mayAffectQuote": "" }]
  },
  "repairVsReplace": {
    "heading": "",
    "intro": "",
    "repairWhen": [""],
    "replaceWhen": [""]
  },
  "howToQuote": {
    "heading": "",
    "steps": [{ "icon": "", "title": "", "description": "" }]
  },
  "cta": { "heading": "", "subtitle": "" }
}
```

(`costTable.rows` → `PagePricingRows`, using `PricingItems.Includes`/`CostFactors`/`NextStep`.)

**`ServiceSuburbPage`**

```json
{
  "service": "",
  "suburb": "",
  "region": "",
  "hero": { "subtitle": "", "trustBadges": [""] },
  "directAnswer": "",
  "localIntro": [""],
  "availableServices": [{ "title": "", "description": "", "icon": "" }],
  "problems": [{ "title": "", "description": "", "icon": "" }],
  "costGuidance": { "intro": "", "factors": [""], "note": "" },
  "whyChooseUs": [{ "title": "", "description": "", "icon": "" }],
  "localProof": [
    {
      "serviceType": "",
      "suburb": "",
      "problem": "",
      "solution": "",
      "beforeAssetId": null,
      "afterAssetId": null
    }
  ]
}
```

(`nearbySuburbs` and `relatedPages` → `PageRelatedLinks`. This page's "identity" as a suburb page is also reflected by `Suburbs.PageId` pointing back at it.)

**`CaseStudyPage`**

```json
{
  "title": "",
  "subtitle": "",
  "service": "",
  "suburb": "",
  "doorType": "",
  "jobType": "",
  "result": "",
  "summary": { "problem": "", "diagnosis": "", "solution": "" },
  "problem": { "intro": "", "points": [""] },
  "diagnosis": { "intro": "", "points": [""] },
  "solution": { "intro": "", "points": [""] },
  "images": [{ "assetId": 0, "caption": "" }],
  "partsUsed": [""]
}
```

(`relatedServices` → `PageRelatedLinks`.)

**`Article`**

```json
{
  "category": "",
  "excerpt": "",
  "author": "",
  "shortAnswer": "",
  "readingTimeOverride": null,
  "tableOfContentsOverride": null,
  "contentBlocks": [
    { "type": "heading", "level": 2, "text": "", "id": "" },
    { "type": "paragraph", "text": "" },
    { "type": "list", "ordered": false, "items": [""] },
    { "type": "checklist", "title": "", "items": [""] },
    {
      "type": "callout",
      "variant": "tip|info|safety|warning",
      "title": "",
      "body": ""
    },
    { "type": "image", "assetId": 0, "caption": "" },
    { "type": "quote", "text": "", "cite": "" }
  ],
  "expertTips": [
    { "kind": "maintenance|safety|technician|cost", "title": "", "body": "" }
  ]
}
```

(`featuredImage`/`featuredImageAlt` → `Pages.HeroImageAssetId`. `relatedServices` and `relatedArticles` → `PageRelatedLinks` with `LinkGroup` = `"relatedServices"` / `"relatedArticles"`. `publishedAt`/`updatedAt` → `Pages.PublishedAt`/`Pages.UpdatedAt`.)

**`ProblemPage`**

```json
{
  "heroSubtitle": "",
  "directAnswer": "",
  "causes": [{ "icon": "", "title": "", "description": "" }],
  "safeChecks": [""],
  "doNotDo": [""],
  "callTechnicianSigns": [""],
  "emergency": { "heading": "", "body": "" }
}
```

(`h1`/`metaTitle`/`metaDescription` → `Pages.Title`/`SeoTitle`/`SeoDescription`. `relatedServices` → `PageServices`. `costRows` → `PagePricingRows`.)

**`LandingPage`**

```json
{
  "pageType": "",
  "serviceLabel": "",
  "hero": {
    "eyebrow": "",
    "h1": "",
    "subtitle": "",
    "badges": [{ "icon": "", "label": "" }]
  },
  "directAnswer": "",
  "form": { "heading": "", "subheading": "" },
  "problems": {
    "eyebrow": "",
    "heading": "",
    "description": "",
    "items": [{ "title": "", "description": "", "icon": "" }]
  },
  "whyChoose": {
    "eyebrow": "",
    "heading": "",
    "description": "",
    "items": [{ "title": "", "description": "", "icon": "" }]
  },
  "serviceAreas": { "heading": "", "description": "", "suburbs": [""] },
  "reviewsHeading": "",
  "finalCta": { "heading": "", "body": "" }
}
```

(`reviews.items` → `PageReviews`. `NoIndex` defaults to `true` for this template.)

---

## 7. API surface (ASP.NET Core)

### Public (anonymous, read-only)

| Method | Path                                          | Purpose                                                                                                                                                                               |
| ------ | --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| GET    | `/api/pages/resolve?routeGroup=flat&slug=...` | Resolves one page by route group + slug; returns `Page` + `Data` + expanded `Faqs`/`Reviews`/`RelatedLinks`/`PricingRows`, shaped to drop straight into the matching Next.js template |
| GET    | `/api/pages/sitemap`                          | Published-only slim feed (`slug`, `routeGroup`, `templateType`, `updatedAt`, `noIndex`) for `app/sitemap.ts`                                                                          |

### Admin (JWT-authenticated)

| Method              | Path                                           | Purpose                                                                                       |
| ------------------- | ---------------------------------------------- | --------------------------------------------------------------------------------------------- |
| GET                 | `/api/admin/pages?templateType=...`            | List/filter for the admin grid                                                                |
| GET                 | `/api/admin/pages/{id}`                        | Full record for editing                                                                       |
| POST                | `/api/admin/pages`                             | Create — full nested DTO (Page + Faqs + RelatedLinks + PricingRows in one transactional call) |
| PUT                 | `/api/admin/pages/{id}`                        | Update — same nested DTO                                                                      |
| DELETE              | `/api/admin/pages/{id}`                        | Delete                                                                                        |
| POST                | `/api/admin/pages/{id}/publish`                | Sets `Status = Published`, `PublishedAt = now`, calls the Next.js revalidate webhook          |
| POST                | `/api/admin/assets/upload`                     | Streams a file to the CDN provider, returns the new `Assets` row                              |
| GET/POST/PUT/DELETE | `/api/admin/reviews`                           | CRUD                                                                                          |
| GET/POST/PUT/DELETE | `/api/admin/services`                          | CRUD                                                                                          |
| GET/POST/PUT/DELETE | `/api/admin/pricing-items`                     | CRUD                                                                                          |
| GET/POST/PUT/DELETE | `/api/admin/service-area-regions` / `/suburbs` | CRUD                                                                                          |

### Example: `GET /api/pages/resolve?routeGroup=flat&slug=garage-door-repairs-perth`

```json
{
  "id": 1,
  "templateType": "ServicePage",
  "slug": "garage-door-repairs-perth",
  "title": "Garage Door Repairs Perth",
  "seoTitle": "...",
  "seoDescription": "...",
  "noIndex": false,
  "heroImage": { "cdnUrl": "https://cdn.../hero.webp", "altText": "..." },
  "data": { "hero": { "...": "..." }, "intro": { "...": "..." }, "...": "..." },
  "faqs": [{ "question": "...", "answer": "..." }],
  "relatedLinks": { "relatedServices": [{ "label": "...", "href": "/..." }] },
  "pricingRows": [{ "scenario": "...", "priceLabel": "...", "note": "..." }],
  "reviews": [{ "customerName": "...", "rating": 5, "text": "..." }]
}
```

---

## 8. Rendering & revalidation flow

The site currently builds every flat/dynamic page at build time (`generateStaticParams`, `dynamicParams = false`) — no per-request fetching at all. Moving to CMS-backed content means:

1. `lib/data/*.ts` functions change their implementation to `fetch()` the ASP.NET API instead of reading `content/*.ts` — call sites (templates, `app/sitemap.ts`) don't change.
2. Drop `dynamicParams = false`; pages render on-demand and are cached via Next.js's `fetch` cache.
3. Add `app/api/revalidate/route.ts` — a POST endpoint protected by a shared secret header, calling `revalidatePath`/`revalidateTag`.
4. ASP.NET's `POST /api/admin/pages/{id}/publish` calls that webhook after committing the publish, so the new/edited page is live within seconds — no rebuild needed.

---

## 9. Auth

- ASP.NET Identity in the API project, issuing JWT bearer tokens.
- The admin Next.js app logs in against `/api/auth/login`, stores the token, attaches it as `Authorization: Bearer ...` on every admin request.
- Public `resolve`/`sitemap` endpoints stay anonymous.
- v1 is a single editor account — the schema doesn't need roles/permissions tables yet, but Identity's default tables already support adding them later without a redesign.

---

## 10. Editorial workflow (v1)

- No draft/approval pipeline. `Status` defaults to `Published`; saving a page is saving it live.
- `Status = Draft` still exists as a manual escape hatch (e.g., to unpublish something without deleting it), but there's no preview-before-publish UI in v1.
- No version history/rollback table in v1.

---

## 11. Images / CDN

- ASP.NET's `/api/admin/assets/upload` endpoint handles the upload and pushes the file to the CDN provider, then writes an `Assets` row (`CdnUrl`, `AltText`, `Width`, `Height`).
- Every image reference elsewhere in the schema (`Pages.HeroImageAssetId`, `GalleryItems.AssetId`, `Services.AssetId`, case-study `images[].assetId`, article `image` content blocks) is an `Assets.Id` FK, not a bare URL string — so alt text and dimensions are managed once, centrally, and Next.js `<Image>` always has real width/height.

---

## 12. Phased build plan

1. **Schema** — EF Core models + migrations for everything in §5.
2. **API, one template end-to-end** — `ServicePage` resolve + admin CRUD + publish + revalidate webhook, proven all the way through to the live Next.js page.
3. **Remaining template types** — repeat the pattern for `ComparisonPage`, `CostGuidePage`, `ServiceSuburbPage`, `CaseStudyPage`, `Article`, `ProblemPage`, `LandingPage`.
4. **Shared catalogs** — `Reviews`, `Services`, `PricingItems`, `ServiceAreaRegions`/`Suburbs`, `GalleryItems` CRUD + their public read endpoints.
5. **Admin app** — auth, page list/grid, one edit form per template type.
6. **Cutover** — swap `lib/data/*.ts` from `content/*.ts` to the API, drop `dynamicParams = false`, retire the `content/` directory.

---

## 13. Open questions (need your input)

1. **`PricingItems` extension** — §5.4 adds `Includes`/`CostFactors`/`NextStep` columns to the shared pricing table just to cover `CostGuidePage`'s richer rows. Are you OK with one shared table carrying those extra nullable columns, or would you rather keep `CostGuidePage` rows as their own separate table?
2. **CDN provider** — which one (Azure Blob Storage + CDN, Cloudflare R2, AWS S3 + CloudFront, other)? Doesn't change the schema, but changes which SDK the upload endpoint uses.
3. **SQL Server version** — are you on SQL Server 2025 / Azure SQL (native `json` data type available) or an earlier version (2016–2022, where we use `NVARCHAR(MAX)` + `ISJSON` as specified above)?
4. **`Service.faqs`** — the current `Services` catalog has an optional per-service FAQ list, mostly redundant with the FAQs already authored on that service's canonical page. Proposal: drop it from the catalog and rely on the canonical page's FAQs. OK?
5. Anything from the current `content/*.ts` files I should double check I haven't missed a field on? I derived §6 directly from the TypeScript interfaces, but flag anything that looks off.
