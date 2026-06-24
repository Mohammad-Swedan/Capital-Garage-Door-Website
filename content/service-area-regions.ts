import type { CoverageRegion } from "@/types/coverage-area";

/**
 * Suburb directory shown on /service-areas, grouped by region. `slug` is
 * ready to link to a future per-suburb local-SEO page once one exists —
 * chips render as plain cards until then (see lib/data/service-area-regions.ts).
 */
export const serviceAreaRegions: CoverageRegion[] = [
  {
    name: "Inner Perth",
    suburbs: [
      { name: "Subiaco", slug: "subiaco" },
      { name: "Victoria Park", slug: "victoria-park" },
      { name: "South Perth", slug: "south-perth" },
      { name: "Belmont", slug: "belmont" },
      { name: "Bayswater", slug: "bayswater" },
    ],
  },
  {
    name: "Northern Suburbs",
    suburbs: [
      { name: "Joondalup", slug: "joondalup" },
      { name: "Hillarys", slug: "hillarys" },
      { name: "Wanneroo", slug: "wanneroo" },
      { name: "Balcatta", slug: "balcatta" },
      { name: "Osborne Park", slug: "osborne-park" },
      { name: "Dianella", slug: "dianella" },
      { name: "Ellenbrook", slug: "ellenbrook" },
      { name: "Morley", slug: "morley" },
    ],
  },
  {
    name: "Southern Suburbs",
    suburbs: [
      { name: "Canning Vale", slug: "canning-vale" },
      { name: "Rockingham", slug: "rockingham" },
      { name: "Baldivis", slug: "baldivis" },
      { name: "Cockburn Central", slug: "cockburn-central" },
      { name: "Kwinana", slug: "kwinana" },
      { name: "Willetton", slug: "willetton" },
      { name: "Armadale", slug: "armadale" },
    ],
  },
  {
    name: "Eastern Suburbs",
    suburbs: [
      { name: "Midland", slug: "midland" },
      { name: "Kalamunda", slug: "kalamunda" },
    ],
  },
  {
    name: "Coastal Suburbs",
    suburbs: [
      { name: "Fremantle", slug: "fremantle" },
      { name: "Scarborough", slug: "scarborough" },
      { name: "Applecross", slug: "applecross" },
    ],
  },
];
