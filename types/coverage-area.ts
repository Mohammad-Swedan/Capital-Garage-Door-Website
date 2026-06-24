/** A suburb listed on the /service-areas page. `slug` matches the suburb segment of its flat service-suburb URL (e.g. "joondalup" → /garage-door-repairs-joondalup), once that page exists. */
export interface CoverageSuburb {
  name: string;
  slug: string;
}

export interface CoverageRegion {
  name: string;
  suburbs: CoverageSuburb[];
}
