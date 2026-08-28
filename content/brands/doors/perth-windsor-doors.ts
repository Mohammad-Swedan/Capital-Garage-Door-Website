import type { BrandPage } from "@/types/brand";

/**
 * /windsor-garage-doors-perth (slug exception — Perth Windsor Doors, check script exempt) — a
 * genuinely WA-manufactured door brand, 25+ years, per docs/marketing/brand-research-2026-08/
 * entities/perth-windsor-doors.md ("Locally manufactured in Western Australia" stated on the
 * official site). Also a preferred Steel-Line dealer — flagged in copy so customers can tell
 * which range they actually have. No specific founding year on the site, so none stated here.
 * Dealer brand. The Perth PAA set for "perth windsor doors" (docs/marketing/brand-research-2026-08/
 * paa/windsor-garage-doors-perth.md) returned mostly brand-neutral questions rather than
 * Windsor-specific ones — every FAQ below is rephrased from that file's actual PAA list (best
 * brand / Gliderol vs B&D / number one manufacturer / install cost / new trend), so no
 * "brand-neutral fallback from other pages" fill was needed.
 */
export const windsorGarageDoorsPerth: BrandPage = {
  brand: "perth-windsor-doors",
  kind: "door",
  slug: "windsor-garage-doors-perth",
  updatedAt: "2026-08-28",
  seo: {
    title: "Windsor Garage Doors Perth | Repairs, Service & Install",
    description:
      "Authorised Perth Windsor Doors dealer for roller, sectional and cyclonic-rated door repairs, service and install. Same-day, WA-made panels. Call today.",
  },
  hero: {
    h1: "Perth Windsor Doors in Perth — Repairs, Service & New Door Installs",
    subtitle:
      "A genuinely WA-manufactured door range, kept running by local technicians: panels matched from local stock, springs re-tensioned, and an honest call on repair versus replace.",
    pills: [
      { icon: "Wrench", label: "Same-day Windsor repairs" },
      { icon: "ShieldCheck", label: "Authorised Windsor dealer" },
      { icon: "Building2", label: "WA-manufactured doors" },
      { icon: "MapPin", label: "All Perth suburbs" },
    ],
  },
  quickFacts: [
    { label: "Origin", value: "Perth, WA" },
    { label: "Made in", value: "Locally manufactured in Western Australia" },
    { label: "Known for", value: "Roller, sectional, DecoWood & cyclonic-rated doors" },
    { label: "Door types", value: "Roller, sectional & commercial" },
    { label: "What we do", value: "Supply, install, service & repair" },
  ],
  directAnswer:
    "Perth Windsor Doors' roller, sectional, DecoWood and cyclonic-rated doors are supplied, installed, serviced and repaired across Perth by Capital Garage Doors, an authorised Perth Windsor Doors dealer. As a genuinely Perth-manufactured range, matching a damaged panel or hardware is usually straightforward rather than a long-lead special order. Most faults — a spring that's lost tension, rollers worn from years of use, a track knocked out of true — are fixed in one same-day visit, and a full service is {{price:service}}.",
  intro: {
    heading: "A Garage Door Genuinely Made in Western Australia",
    paragraphs: [
      "Perth Windsor Doors is one of the smaller number of garage door brands actually manufactured in Western Australia rather than trucked in from an interstate factory, with more than 25 years supplying, installing and servicing doors across the Perth metro area. That local manufacturing base means the range can be finished to order — woodgrain, smooth, rendered or matt textures, Colorbond and UniCote LUX colour ranges — rather than picked from a handful of stock panels, which is part of why the brand turns up on homes wanting a more custom street front.",
      "The core range covers roller and sectional doors, DecoWood-style doors, insulated panels, timber doors and dedicated Ranch and Heritage styles for character homes, plus a cyclonic-rated line built for Perth's high-wind coastal suburbs. Perth Windsor Doors is also a preferred Steel-Line dealer, so some customers end up with a Steel-Line-branded door supplied through the same business — worth confirming which range you actually have if you're not sure, since parts and panel profiles differ between the two.",
      "As with any locally made door, the faults we see on Perth Windsor Doors installations are ordinary wear rather than anything specific to the brand: a spring that's lost its tension, a track that's drifted out of alignment, or rollers worn from a sandy Perth driveway. Because the doors are manufactured locally, matching a damaged panel or a custom finish is usually far more straightforward than for an imported brand, and as an authorised dealer we can order genuine sections rather than an approximate substitute.",
    ],
  },
  services: [
    {
      title: "Perth Windsor Doors repairs",
      description: "Springs, cables, rollers, tracks and DecoWood or cyclonic panel faults diagnosed and fixed on the day, common parts carried on board.",
      icon: "Wrench",
      href: "/garage-door-repairs-perth",
    },
    {
      title: "Perth Windsor Doors panel replacement",
      description: "Damaged or weathered panels matched and replaced from local supply as an authorised dealer, without redoing the whole door structure.",
      icon: "LayoutPanelTop",
      href: "/garage-door-panel-replacement-perth",
    },
    {
      title: "New Perth Windsor Doors install",
      description: "Supply and installation of a new roller, sectional or cyclonic-rated door as an authorised dealer, built to your exact opening.",
      icon: "DoorOpen",
      href: "/garage-door-installation-perth",
    },
    {
      title: "Annual door service",
      description: "Springs, tracks, rollers and hardware checked, lubricated and rebalanced every year against Perth's heat and dust so the door keeps running smoothly and safely.",
      icon: "ShieldCheck",
      href: "/garage-door-maintenance-perth",
    },
  ],
  models: [
    { name: "DecoWood Doors", type: "Sectional door", note: "A woodgrain-textured finish option across the Perth Windsor Doors sectional range." },
    { name: "Insulated Doors", type: "Sectional door", tech: "Insulated panel", note: "Perth Windsor Doors' insulated sectional line for temperature and noise control." },
    { name: "Cyclonic Doors", type: "Roller & sectional door", note: "Cyclone-rated doors built for Perth's high-wind coastal suburbs." },
    { name: "Ranch & Heritage Doors", type: "Sectional door", note: "Character-home styles finished for older and heritage-style Perth properties." },
  ],
  faults: [
    { label: "Door won't open at all", icon: "Power", problemSlug: "garage-door-wont-open" },
    { label: "Won't close fully or reverses", icon: "AlertTriangle", problemSlug: "garage-door-wont-close" },
    { label: "Broken spring or frayed cable", icon: "Cable", problemSlug: "garage-door-spring-or-cable-broken" },
    { label: "Door has jumped its tracks", icon: "Unplug", problemSlug: "garage-door-off-track" },
    { label: "Door stops part-way up", icon: "MoveVertical", problemSlug: "garage-door-stuck-halfway" },
    { label: "Grinding or rattling on the way up", icon: "Volume2", problemSlug: "noisy-garage-door" },
  ],
  parts: {
    heading: "Genuine Panels, Local Manufacturing — Or an Honest New-Door Quote",
    paragraphs: [
      "As an authorised Perth Windsor Doors dealer, and because the range is manufactured locally, we can order genuine roller and sectional panels, DecoWood and cyclonic-rated sections to match your existing door rather than guessing at an interstate equivalent. Springs, cables and hardware are replaced with correctly rated components for the door's exact size and weight.",
      "A new door is the honest answer when an older Perth Windsor Doors installation's custom colour or texture has been discontinued from the current range, when the frame and track hardware have reached the end of their working life alongside the panels, or when reworking a heavily weathered custom finish would cost close to a straightforward replacement. In those situations we quote a new Perth Windsor Doors install in a comparable style and finish, sized to your exact opening — or, if a different brand or budget suits better, the full range of doors we supply and install across Perth is at /garage-doors-perth.",
    ],
  },
  pricingPins: ["spring", "cable", "damaged", "service", "new-standard"],
  costIntro:
    "Perth Windsor Doors work is priced from the same guide list as every door we touch: a broken spring is {{price:spring}}, a snapped cable is {{price:cable}}, and a damaged panel is quoted once we've seen it, typically from {{price:damaged}}. A full service is {{price:service}}, and a new standard door installed starts from {{price:new-standard}}. You get the figure in writing before any work starts.",
  costFactors: [
    "Whether the fault is a part (spring, cable, roller) or a full panel replacement",
    "Door type and finish — DecoWood, insulated or cyclonic-rated panels cost more to match",
    "Door size and weight — double doors and insulated panels need higher-rated hardware",
    "Whether tracks and hardware need straightening before the door will run true again",
  ],
  faqs: [
    {
      question: "Is Perth Windsor Doors a good brand?",
      answer:
        "Yes — Perth Windsor Doors has more than 25 years supplying, installing and servicing garage doors, and being genuinely manufactured in Western Australia means the range can be finished to order rather than picked from a handful of imported stock panels. In our experience servicing them, the doors are solidly built and, because they're made locally, parts and panel matching are usually straightforward.",
    },
    {
      question: "How does Perth Windsor Doors compare to Gliderol or B&D?",
      answer:
        "Gliderol and B&D are larger national manufacturers with a bigger dealer footprint across Australia, while Perth Windsor Doors is a WA-based manufacturer offering more finish and colour customisation — woodgrain, rendered, Colorbond and UniCote LUX options, plus cyclonic-rated doors for coastal suburbs. All three are solid choices; the right one comes down to the finish you want and how your opening is shaped.",
    },
    {
      question: "Who manufactures Perth Windsor Doors?",
      answer:
        "Perth Windsor Doors manufactures its own roller, sectional, DecoWood, insulated and cyclonic-rated range locally in Western Australia, and is also a preferred dealer for Steel-Line garage doors — so a door supplied through the business could be either its own product or a Steel-Line door, depending what was ordered. We'll help you confirm exactly which one you have before quoting a repair.",
    },
    {
      question: "What does it cost to install a new Perth Windsor Doors garage door in Perth?",
      answer:
        "A new standard Perth Windsor Doors garage door supplied and installed starts from {{price:new-standard}}, covering the door, tracks, hardware and removal of the old one. Custom finishes like DecoWood, Colorbond or a cyclonic-rated panel, and larger or insulated doors, cost more. We measure your opening and confirm the exact figure for your chosen finish before any work starts.",
    },
    {
      question: "What's a popular new trend in Perth Windsor Doors' range?",
      answer:
        "Custom finishes are the main trend we see requested — woodgrain-textured DecoWood panels, rendered or matt Colorbond finishes, and the UniCote LUX colour range, all aimed at a more architectural street front than a plain steel panel. Cyclonic-rated doors are also increasingly requested in Perth's coastal suburbs for the extra wind rating.",
    },
    {
      question: "Is Perth Windsor Doors actually manufactured in Perth?",
      answer:
        "Yes — Perth Windsor Doors states its roller, sectional and cyclonic-rated range is locally manufactured in Western Australia, rather than an interstate or imported range sold under a local name. That local manufacturing is why matching a damaged panel or an unusual custom finish is usually more straightforward for us than it is for an imported brand.",
    },
    {
      question: "Do you service Perth Windsor Doors doors across all of Perth?",
      answer:
        "Yes — technicians cover the whole Perth metro area, including Canning Vale, Piara Waters, Success, Cockburn Central, Atwell, Harrisdale, Forrestdale and Southern River, with same-day slots on most days. Call with your suburb and a description of the fault and we'll give you an arrival window and a fixed price before we start.",
    },
  ],
  relatedBrands: ["steel-line", "gliderol", "danmar", "b-and-d"],
  relatedServices: [
    { label: "All garage door brands in Perth", href: "/garage-door-brands-perth" },
    { label: "Garage door repairs Perth", href: "/garage-door-repairs-perth" },
    { label: "Garage door panel replacement", href: "/garage-door-panel-replacement-perth" },
    { label: "New garage door installation Perth", href: "/garage-door-installation-perth" },
    { label: "Garage door repair cost guide", href: "/garage-door-repair-cost-perth" },
  ],
  serviceAreas: ["Canning Vale", "Piara Waters", "Success", "Cockburn Central", "Atwell", "Harrisdale", "Forrestdale", "Southern River"],
  cta: {
    heading: "Perth Windsor Door Playing Up? Get It Sorted Today",
    subtitle: "Tell us the fault and your suburb — you'll get a same-day slot and a fixed price before we start.",
  },
};
