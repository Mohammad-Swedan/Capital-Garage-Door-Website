import type { ServicePage } from "@/types/service-page";

/**
 * /garage-door-seal-replacement-perth — bottom rubber seals, side and top brush seals, and
 * roller door pelmets (hoods).
 *
 * Why this page exists (2026-11-01 research, docs/seo/serp-pulls-2026-11-01.md):
 *  - National demand is real ("garage door seals" AU 2,400/mo; bottom seal 480, weather seal
 *    320, roller door seal 390) and the sister site's seals post earns 14 clicks a quarter;
 *    Keyword Planner Perth "garage door seal replacement" 10/mo. Capital has no page for the
 *    local fitted job, which the catalog prices as "Weather seal (rubber & brush)" and
 *    "Pelmet / hood replaced" (both already pinned on the servicing page).
 *  - Supporting page by design: it converts the dust/water/vermin complaint into a booking
 *    and gives the servicing and roller-door pages a seal-specific link target.
 *
 * No literal price in the prose; the costGuidance rows below are the CMS_SERVICE_PAGES=off
 * fallback and mirror pricing-data.ts.
 */
export const garageDoorSealReplacementPerth: ServicePage = {
  serviceName: "Garage Door Seal Replacement Perth",
  slug: "garage-door-seal-replacement-perth",
  pageType: "service",

  hero: {
    h1: "Garage Door Seal Replacement Perth",
    subtitle:
      "Perished bottom rubbers, worn side and top brush seals and rusted roller door pelmets replaced across Perth, so dust, rain, leaves and vermin stay outside the garage.",
    badges: [
      { icon: "Layers", label: "Rubber & Brush Seals" },
      { icon: "Home", label: "Dust, Water & Pest Stop" },
      { icon: "Clock3", label: "Fitted in One Visit" },
      { icon: "MapPin", label: "All Perth Suburbs" },
    ],
    image:
      "https://jadara-hub.b-cdn.net/capital-garage-door/gallery/garage-door-repair-completed-kardinya-perth.webp",
    imageAlt: "Completed sectional garage door in Kardinya, Perth, closed and sealed against the driveway after a repair visit",
    floatingCardLabel: "Sealed & Tested",
  },

  directAnswer:
    "Capital Garage Doors replaces garage door seals across Perth. The bottom rubber on a sectional door, the side and top brush seals on a roller door, and the pelmet that covers a roller door's drum all perish in Perth sun, crack with age or get chewed by rodents, and once they go the garage fills with red dust, winter rain tracks across the slab and mice find the gap. We fit the correct profile of rubber or brush seal to your door, square the door to the floor if it is sitting unevenly, and replace a rusted or dented pelmet, usually on a single same-day visit with the price agreed first.",

  intro: {
    heading: "Why Seals Fail in Perth, and Which Seal Your Door Needs",
    paragraphs: [
      "A garage door seal has a harder job in Perth than almost anywhere: forty-degree afternoons bake the rubber until it cracks, winter southerlies drive rain under the door, the sand in the northern and coastal suburbs grinds the bottom edge, and rodents chew through a soft seal in a season. The result is the complaint we hear every week, a garage that cannot be kept clean, a wet patch inside the door after every storm, or droppings along the back wall. The fix is usually a seal, not a door.",
      "The right seal depends on the door. A sectional door uses a bottom rubber that slides into the aluminium retainer on the lowest panel; it comes in several profiles, and the wrong one either will not fit the channel or leaves a gap at the corners. A roller door seals with brush strips in the side guides and under the pelmet, plus a rubber or brush along the bottom rail. Tilt doors take a bottom rubber and side brushes. We carry the common profiles for the doors fitted across Perth and match the one your retainer takes rather than forcing a generic strip into it.",
      "A seal only works if the door meets the floor evenly, so we check the door's balance and its height setting before fitting the new rubber, and on a roller door we check the guides and the pelmet, which is the steel hood that keeps rain and birds out of the drum. A rusted or dented pelmet is replaced at the same time. If the gap is caused by a slab that has settled or a bottom panel that has rusted, we tell you, because no seal will close a gap that size and a panel or a threshold is the honest fix.",
    ],
  },

  problems: [
    { label: "Red dust and sand blowing under the door", icon: "Home" },
    { label: "Rain tracking across the slab in winter", icon: "AlertTriangle" },
    { label: "Mice, rats or cockroaches getting in", icon: "Search" },
    { label: "Bottom rubber cracked, flattened or missing", icon: "Layers" },
    { label: "Side or top brush seal worn away", icon: "Settings" },
    { label: "Roller door pelmet rusted or dented", icon: "DoorOpen" },
  ],

  includedItems: [
    "Bottom rubber matched to your sectional or tilt door's retainer profile",
    "Side and top brush seals for roller doors and sectional doors",
    "Roller door pelmet (hood) replaced when rusted or dented",
    "Door balance and closing height checked so the seal meets the floor evenly",
    "Guides and retainers cleaned so the new seal sits flat",
    "Gaps from a settled slab or rusted panel identified and quoted honestly",
    "Fitted on the same visit as a service if you combine them",
    "A fixed quote agreed before any work starts",
  ],

  processSteps: [
    {
      title: "Send a photo of the gap",
      description:
        "A photo of the bottom corner and the door type tells us which seal profile and length to bring.",
      icon: "Camera",
    },
    {
      title: "Check the door first",
      description:
        "We make sure the door closes square and at the right height, because a seal cannot fix a door that stops short.",
      icon: "Search",
    },
    {
      title: "Fit the new seal",
      description:
        "The old rubber or brush comes out, the retainer or guide is cleaned, and the matched seal goes in full length.",
      icon: "Wrench",
    },
    {
      title: "Replace the pelmet if needed",
      description:
        "A rusted or dented roller door hood is swapped so rain and birds stay out of the drum.",
      icon: "Layers",
    },
    {
      title: "Test against the floor",
      description:
        "The door is closed and the seal line checked end to end; the opener's close limit is adjusted if it needs it.",
      icon: "BadgeCheck",
    },
  ],

  // Mirrors pricing-data.ts — the live CMS page pins the same catalog rows.
  costGuidance: {
    intro:
      "Straight from our price list. Seals are priced per door with attendance included; a pelmet is a separate row because it is a steel part made to the door's width. As a guide:",
    rows: [
      {
        label: "Weather seal (rubber & brush)",
        price: "$180–$280",
        note: "Bottom rubber or brush seals supplied and fitted, door checked square",
      },
      {
        label: "Pelmet / hood replaced",
        price: "$280–$440",
        note: "Roller door pelmet made to width, supplied and fitted",
      },
    ],
  },

  whyChoose: [
    {
      title: "Right profile, not a generic strip",
      description: "We match the seal to your door's retainer or guide, so it fits the channel and closes the corners.",
      icon: "Layers",
    },
    {
      title: "Door checked first",
      description: "A seal only works on a door that meets the floor; we set the balance and close limit before fitting it.",
      icon: "Scale",
    },
    {
      title: "Honest about big gaps",
      description: "A settled slab or a rusted bottom panel needs a different fix, and we say so rather than sell a seal.",
      icon: "Search",
    },
    {
      title: "Pelmets too",
      description: "Rusted roller door hoods are replaced on the same visit, made to the door's width.",
      icon: "DoorOpen",
    },
    {
      title: "Combine with a service",
      description: "Seals are often fitted during an annual service, which saves a second attendance.",
      icon: "ShieldCheck",
    },
    {
      title: "All of Perth",
      description: "From the dusty northern estates to the wet southern winters, with the common profiles on the van.",
      icon: "MapPin",
    },
  ],

  relatedServices: [
    {
      name: "Garage Door Servicing Perth",
      href: "/garage-door-maintenance-perth",
      description: "Seals, balance and the close limit are checked on every service.",
      icon: "ShieldCheck",
    },
    {
      name: "Roller Door Repairs Perth",
      href: "/roller-door-repairs-perth",
      description: "Pelmets, guides, brush seals and curtains on roller doors.",
      icon: "Settings",
    },
    {
      name: "Garage Door Panel Replacement Perth",
      href: "/garage-door-panel-replacement-perth",
      description: "When the gap is a rusted or bent bottom panel, not the seal.",
      icon: "Layers",
    },
    {
      name: "Garage Door Repair Cost Perth",
      href: "/garage-door-repair-cost-perth",
      description: "Every repair on our price list, seals and pelmets included.",
      icon: "FileText",
    },
    {
      name: "Garage Door Won't Close?",
      href: "/problems/garage-door-wont-close",
      description: "A door that stops short of the floor leaves a gap no seal can close.",
      icon: "HelpCircle",
    },
    {
      name: "Garage Door Repairs Perth",
      href: "/garage-door-repairs-perth",
      description: "Springs, cables, motors, tracks and panels — the full repair service.",
      icon: "Wrench",
    },
  ],

  serviceAreas: [
    "Ellenbrook",
    "Butler",
    "Baldivis",
    "Scarborough",
    "Joondalup",
    "Canning Vale",
    "Midland",
    "Cockburn Central",
    "Rockingham",
    "Mandurah",
  ],

  // Real Google reviews (the CMS page pins the same reviews by customer name).
  reviews: [
    {
      name: "Khaled K.",
      rating: 5,
      text: "Capital Garage Doors provided exceptional service from start to finish. Their team was professional, prompt and thorough.",
      service: "Garage Door Service",
    },
    {
      name: "Charlotte D.",
      rating: 5,
      text: "I highly recommend Capital Garage Doors and am very appreciative of Moussab's excellent, prompt and efficient work on our roller door.",
      service: "Roller Door Repair",
    },
  ],

  faqs: [
    {
      question: "How much does it cost to replace a garage door seal in Perth?",
      answer:
        "The weather seal row in the guide-price table on this page is our listed price to supply and fit a bottom rubber or a set of brush seals on a standard residential door, with attendance included. A roller door pelmet is the separate row, because it is a steel hood made to the door's width. If you combine the seal with an annual service you pay one attendance, which is how most of our seal jobs are booked.",
    },
    {
      question: "How do I stop dust and sand coming under my garage door?",
      answer:
        "Fit a bottom seal that matches your door and make sure the door closes evenly onto it. On most Perth sectional doors the original rubber has flattened or cracked and no longer touches the slab along its full length; a new rubber in the correct profile usually solves it. If the slab is uneven, a thicker bulb seal or a threshold strip glued to the floor closes the low spots. Side brushes stop the fine dust that comes in around the edges of a roller door.",
    },
    {
      question: "How do I keep water out of my garage in winter?",
      answer:
        "Water comes in under the door when the driveway falls toward the garage or the bottom seal has a gap. A new bottom rubber fixes the gap; a rubber threshold strip bonded to the slab in front of the door stops water that sheets down a sloping driveway. On a roller door, a rusted pelmet lets rain run into the drum and down the inside of the curtain, so the pelmet is the first thing we check when a roller door garage is wet.",
    },
    {
      question: "Can you stop mice and rats getting under the garage door?",
      answer:
        "Yes, as long as the door itself is sound. Rodents need only a small gap, and a chewed or flattened bottom seal gives them one at each corner. We fit a dense rubber seal that closes the corners and, where the slab is uneven, a threshold strip. If the bottom panel of a sectional door has rusted through at the edge, the gap is in the panel and we quote a panel repair instead, because a seal on a rusted panel does not last.",
    },
    {
      question: "What type of garage door seal do I need?",
      answer:
        "It depends on the door. Sectional doors take a bottom rubber that slides into the retainer on the lowest panel, in a T-shaped, P-shaped or bulb profile depending on the make. Roller doors use brush strips in the side guides and under the pelmet, plus a rubber or brush along the bottom rail. Tilt doors take a bottom rubber and side brushes. Send us a photo of the bottom corner and we will identify the profile before the visit.",
    },
    {
      question: "How long does a garage door seal last in Perth?",
      answer:
        "Five to ten years for a bottom rubber on a door in the sun, longer on a sheltered south-facing door, and less where sand grinds the bottom edge or rodents are active. Brush seals last longer than rubber but thin out over time. A seal is one of the items checked on an annual service, which is the easiest time to replace it, and keeping the slab in front of the door swept extends its life noticeably.",
    },
  ],

  cta: {
    heading: "Dust, Water or Pests Getting Under the Door?",
    subtitle:
      "Send a photo of the bottom corner and your door type, and we will bring the matching seal for a one-visit fix anywhere in Perth.",
  },

  seo: {
    title: "Garage Door Seal Replacement Perth | Weather & Brush Seals",
    description:
      "Garage door bottom rubbers, brush seals and roller door pelmets replaced across Perth to stop dust, rain and vermin. Matched to your door, fitted in one visit.",
  },
};
