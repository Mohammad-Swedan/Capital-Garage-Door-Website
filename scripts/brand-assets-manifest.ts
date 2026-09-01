/**
 * Manifest for scripts/fetch-brand-assets.ts — every brand logo / product image the site pulls
 * from the web, with provenance. One entry per file uploaded to the Bunny CDN under
 * capital-garage-door/brands/. Filled by web research; the runner validates `brand` against
 * content/brands/entities.ts and enforces the processing/quality gates.
 *
 * Sourcing rules (same posture as the 8 shipped dealer logos):
 *  - `sourcePage` must sit on the entity's own official domain (entity.url), on Wikimedia
 *    Commons, or on the brand's official press portal. Brandfetch etc. are locators only.
 *  - `licence` records the basis: "official site logo — nominative use", "manufacturer press
 *    asset", "Wikimedia: PD-textlogo", "Wikimedia: CC BY-SA 4.0 — attribution in caption", …
 *  - Product images ONLY from press/media portals or Wikimedia — never scraped product shots.
 */

export type BrandAssetKind = "logo" | "product";

export interface BrandAssetEntry {
  /** BrandEntity.slug — validated against entities.ts by the runner. */
  brand: string;
  kind: BrandAssetKind;
  /** Exact file URL fetched (empty string when localFile is set). */
  sourceUrl: string;
  /** Human-checkable provenance page: press portal, Wikimedia file page, or the official site. */
  sourcePage: string;
  /** Licence basis for using the asset. */
  licence: string;
  /** Remote filename under capital-garage-door/brands/, e.g. "merlin.webp". */
  out: string;
  /** Escape hatch when a site blocks scripted fetch: absolute path to a downloaded file. */
  localFile?: string;
  /** Product entries only — honest description, never implying a Capital job photo. */
  alt?: string;
  /** Product entries only — visible caption; carry attribution here when the licence needs it. */
  caption?: string;
  /** Processing overrides. Defaults: logo → 800 / trim; product → 1600 / no trim. */
  maxWidth?: number;
  trim?: boolean;
}

/**
 * Deliberately skipped (monogram stays): `guardian` — the entity covers two unrelated companies
 * (US opener brand + Perth door supplier), so any one logo would misattribute; `magic-button` —
 * no distinct official logo asset exists (liftmaster.com.au carries only the Liftmaster mark).
 */
export const BRAND_ASSETS: BrandAssetEntry[] = [
  {
    brand: "merlin",
    kind: "logo",
    sourceUrl: "https://www.gomerlin.com.au/globalassets/merlin_logo.png",
    sourcePage: "https://www.gomerlin.com.au/",
    licence: "official site logo — nominative use",
    out: "merlin.webp",
  },
  {
    brand: "chamberlain",
    kind: "logo",
    sourceUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Chamberlain_logo.svg",
    sourcePage: "https://commons.wikimedia.org/wiki/File:Chamberlain_logo.svg",
    licence: "Wikimedia Commons: PD-textlogo (public domain); mark sourced from chamberlaingroup.com",
    out: "chamberlain.webp",
  },
  {
    brand: "liftmaster",
    kind: "logo",
    sourceUrl: "https://www.liftmaster.com.au/images/logo.jpg",
    sourcePage: "https://www.liftmaster.com.au/",
    licence: "official site logo — nominative use",
    out: "liftmaster.webp",
  },
  {
    brand: "centurion",
    kind: "logo",
    sourceUrl:
      "https://www.cgdoors.com.au/wp-content/themes/centurion-divi-child/image/logo_centurion_proper_manleft.svg",
    sourcePage: "https://www.cgdoors.com.au/",
    licence: "official site logo — nominative use (Centurion Garage Doors, Wangara WA)",
    out: "centurion.webp",
  },
  {
    brand: "ata",
    kind: "logo",
    sourceUrl: "https://www.automatictechnology.com/ata-multisite/images/ATA-Logo-Transparent-dark.png",
    sourcePage: "https://www.automatictechnology.com/au",
    licence: "official site logo — nominative use",
    out: "ata.webp",
  },
  {
    brand: "grifco",
    kind: "logo",
    sourceUrl: "https://www.grifco.com.au/globalassets/grifco/grifco-logo.svg",
    sourcePage: "https://www.grifco.com.au/",
    licence: "official site logo — nominative use",
    out: "grifco.webp",
  },
  {
    brand: "dominator",
    kind: "logo",
    sourceUrl: "https://www.dominator.co.nz/img/site/logos/dominator-logo.svg",
    sourcePage: "https://www.dominator.co.nz/",
    licence: "official site logo — nominative use (brand-proper NZ mark, not the NSW distributor lockup)",
    out: "dominator.webp",
  },
  {
    brand: "marantec",
    kind: "logo",
    sourceUrl: "https://www.marantec.com/fileadmin/marantec/img/logos/marantec-logo.svg",
    sourcePage: "https://www.marantec.com/en/",
    licence: "official site logo — nominative use",
    out: "marantec.webp",
  },
  {
    brand: "genie",
    kind: "logo",
    sourceUrl:
      "https://static.wixstatic.com/media/3ef5a4_49c4784524c1451784cec60ff54464a9~mv2.png/v1/crop/x_406,y_746,w_4400,h_1990/fill/w_1100,h_497,al_c,q_90/Genie_Pill_BrandYouTrust_Logo_RGB.png",
    sourcePage: "https://www.geniecompany.com/",
    licence: "official site logo — nominative use (site's own Wix asset, upscaled crop of the header mark)",
    out: "genie.webp",
  },
  {
    brand: "somfy",
    kind: "logo",
    sourceUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Somfy_logo.svg",
    sourcePage: "https://commons.wikimedia.org/wiki/File:Somfy_logo.svg",
    licence: "Wikimedia Commons: PD-textlogo (public domain)",
    out: "somfy.webp",
  },
  {
    brand: "nice",
    kind: "logo",
    sourceUrl: "https://www.niceforyou.com/themes/custom/immedia/img/share/logo.png",
    sourcePage: "https://www.niceforyou.com/au",
    licence: "official site logo — nominative use (global Nice mark; the AU arm trades as Nice GDS)",
    out: "nice.webp",
  },
  {
    brand: "dea",
    kind: "logo",
    sourceUrl: "https://www.deasystem.com/images/logo-head.svg",
    sourcePage: "https://www.deasystem.com/en/",
    licence: "official site logo — nominative use",
    out: "dea.webp",
  },
  {
    brand: "danmar",
    kind: "logo",
    sourceUrl: "https://www.danmardoorswa.com.au/wp-content/uploads/2025/02/logo-landscape-charcoal.svg",
    sourcePage: "https://www.danmardoorswa.com.au/",
    licence: "official site logo — nominative use (Danmar Doors WA — NOT danmardoors.com.au)",
    out: "danmar.webp",
  },
  {
    brand: "taurean",
    kind: "logo",
    sourceUrl: "https://www.taureands.com.au/wp-content/themes/taureands/images/site-logo.png",
    sourcePage: "https://www.taureands.com.au/",
    licence: "official site logo — nominative use",
    out: "taurean.webp",
  },
  {
    brand: "doorworks",
    kind: "logo",
    sourceUrl: "https://doorworks.com.au/wp-content/uploads/2025/01/Doorworks-Logo-Positive-scaled.png",
    sourcePage: "https://doorworks.com.au/",
    licence: "official site logo — nominative use",
    out: "doorworks.webp",
  },
  {
    brand: "best-doors",
    kind: "logo",
    sourceUrl: "https://bestdoors.com.au/wp-content/uploads/2026/05/Best-Doors-Logo-500px-x-500px.png",
    sourcePage: "https://bestdoors.com.au/",
    licence: "official site logo — nominative use",
    out: "best-doors.webp",
  },
  {
    brand: "hormann",
    kind: "logo",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/H%C3%B6rmann_(T%C3%BCrenhersteller)_logo.svg",
    sourcePage: "https://commons.wikimedia.org/wiki/File:H%C3%B6rmann_(T%C3%BCrenhersteller)_logo.svg",
    licence: "Wikimedia Commons: PD-textlogo (public domain)",
    out: "hormann.webp",
  },
  {
    brand: "gryphon",
    kind: "logo",
    sourceUrl: "https://gryphongaragedoors.com/wp-content/uploads/2024/02/gryphon-garage-doors-logo.jpg",
    sourcePage: "https://gryphongaragedoors.com/",
    licence: "official site logo — nominative use",
    out: "gryphon.webp",
  },
  {
    brand: "merlin",
    kind: "product",
    sourceUrl: "https://upload.wikimedia.org/wikipedia/commons/7/70/Merlin_auto_garage_opener.jpg",
    sourcePage: "https://commons.wikimedia.org/wiki/File:Merlin_auto_garage_opener.jpg",
    licence: "Wikimedia: CC BY-SA 4.0 — attribution in caption",
    out: "merlin-opener-installed.webp",
    alt: "Merlin garage door opener head unit mounted on a garage ceiling in Australia",
    caption: "A Merlin opener installed in an Australian garage. Photo: Photnart, Wikimedia Commons (CC BY-SA 4.0).",
  },
];
