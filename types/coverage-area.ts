/** A suburb listed on the /service-areas page. `slug` matches the suburb segment of its flat service-suburb URL (e.g. "joondalup" → /garage-door-repairs-joondalup). `href` is set when a dedicated suburb page exists (the CMS links it), so the directory chip becomes a link. */
export interface CoverageSuburb {
  name: string;
  slug: string;
  href?: string;
}

export interface CoverageRegion {
  name: string;
  suburbs: CoverageSuburb[];
}
