import type { BrandHub } from "@/types/brand";

export const BRAND_HUBS: Record<"door" | "motor", BrandHub> = {
  door: {
    kind: "door",
    slug: "garage-door-brands-perth",
    name: "Garage Door Brands Perth",
    shortName: "Door Brands",
    seo: {
      title: "Garage Door Brands Perth | Every Brand Serviced & Installed",
      description:
        "Every garage door brand in Perth — Steel-Line, B&D, Gliderol, Centurion, Danmar & more. Find your brand, see what we repair, service and install, and get a same-day quote.",
    },
    hero: {
      h1: "Garage Door Brands in Perth — Every Brand We Service, Repair & Install",
      subtitle:
        "Roller, sectional or tilt, new build or 1980s original: find the brand on your door and see exactly what our Perth technicians can do for it.",
    },
    intro: [],
    faqs: [],
  },
  motor: {
    kind: "motor",
    slug: "garage-door-motor-brands-perth",
    name: "Garage Door Motor Brands Perth",
    shortName: "Motor Brands",
    seo: {
      title: "Garage Door Motor & Opener Brands Perth | Repairs & Remotes",
      description:
        "Merlin, Chamberlain, B&D, Gliderol, ATA, Boss & every other garage door motor brand in Perth — repaired, re-programmed or replaced same-day. Find your opener brand here.",
    },
    hero: {
      h1: "Garage Door Motor & Opener Brands in Perth",
      subtitle:
        "Whatever is bolted to your garage ceiling, we repair it, code remotes for it, and replace it when it's done — every major opener brand, all of Perth.",
    },
    intro: [],
    faqs: [],
  },
};
