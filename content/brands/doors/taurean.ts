import type { BrandPage } from "@/types/brand";

/**
 * /taurean-garage-doors-perth — PAA (DataForSEO 2026-08-27) is comparison-heavy (Gliderol vs B&D,
 * Merlin vs B&D) even though those aren't Taurean questions; answered honestly rather than
 * dropped, without implying a Gliderol affiliation. Per
 * docs/marketing/brand-research-2026-08/entities/taurean.md, Taurean is operated by Stramit
 * Corporation as part of the Fletcher Building Group and is explicitly NOT a Gliderol group
 * brand — recorded exactly, no relationship implied. Serviced without a formal supply arrangement.
 */
export const taureanGarageDoorsPerth: BrandPage = {
  brand: "taurean",
  kind: "door",
  slug: "taurean-garage-doors-perth",
  updatedAt: "2026-08-28",
  seo: {
    title: "Taurean Garage Doors Perth | Repairs, Service & Install",
    description:
      "Taurean garage door repairs, genuine curtain & panel matching and new-door installs across Perth. Same-day service on Windstrong roller doors. Fixed quotes.",
  },
  hero: {
    h1: "Taurean Garage Doors in Perth — Repairs, Panels & New Door Installs",
    subtitle:
      "Fletcher Building-backed roller and sectional doors kept running by local technicians: curtains freed, springs re-tensioned, and an honest call on repair versus a new door.",
    pills: [
      { icon: "Wrench", label: "Same-day Taurean repairs" },
      { icon: "ShieldCheck", label: "Genuine curtain & panel matching" },
      { icon: "Building2", label: "Backed by Fletcher Building" },
      { icon: "MapPin", label: "All Perth suburbs" },
    ],
  },
  quickFacts: [
    { label: "Origin", value: "Australia" },
    { label: "Owned by", value: "Stramit Corporation / Fletcher Building Group" },
    { label: "Known for", value: "Windstrong cyclone-rated roller doors" },
    { label: "Door types", value: "Roller, sectional & commercial" },
    { label: "What we do", value: "Service, repair & replace" },
  ],
  directAnswer:
    "Taurean garage doors — the Windstrong roller and sectional doors backed by Stramit and the Fletcher Building Group — are repaired, serviced and replaced across Perth by Capital Garage Doors. Jammed curtains, worn springs, stiff tracks and faulty motors on automated units are diagnosed and fixed on the day, most from stock on the van. A full service to keep a Taurean door running smoothly is {{price:service}}, and when a door is genuinely past repair we supply and fit a new one with the same trusted workmanship.",
  intro: {
    heading: "Taurean Garage Doors — Fletcher Building's Australian Roller Door Brand",
    paragraphs: [
      "Taurean is the roller and sectional door brand operated by Stramit Corporation as part of the Fletcher Building Group, the same conglomerate behind a range of Australian and New Zealand building products. That corporate backing means consistent Australian manufacturing standards and a genuine cyclone-rated range — the Windstrong roller door — engineered for wind-exposed properties, which matters on Perth's coastal fringe as much as it does further north. Taurean doors turn up on both residential garages and commercial and industrial buildings across the metro area, wherever a builder or developer has specified the brand.",
      "On the residential side, Taurean's roller doors are common on newer builds and coastal properties where the Windstrong cyclone rating was specified for wind loading, and the sectional range appears on standard double garages across the suburbs. Roller doors in particular see a specific set of faults: the curtain can bind or run stiffly in its guides, the springs that counterbalance the curtain's weight lose tension over time, and the TauraEdge track system can work loose or collect grit from a sandy Perth driveway. Automated units also bring the usual opener faults — a motor that hums but won't lift, or a remote that's stopped pairing.",
      "We repair Taurean doors whenever the curtain, track and spring set are still sound — most roller door faults come down to tension, alignment or a worn guide rather than the door itself failing, and a repair restores smooth, quiet operation for a fraction of a new door's cost. When a curtain has corroded through, the barrel has failed, or repeated repairs are starting to outweigh the cost of a new door, we'll say so plainly and quote a straightforward Taurean replacement rather than continuing to patch a door that's had its day.",
    ],
  },
  services: [
    {
      title: "Taurean door repairs",
      description:
        "Jammed curtains, worn springs, stiff tracks and faulty motors diagnosed and repaired on the day, with the common Taurean parts carried on the van.",
      icon: "Wrench",
      href: "/garage-door-repairs-perth",
    },
    {
      title: "Taurean curtain & panel replacement",
      description:
        "Damaged roller curtain slats and sectional panels matched and replaced so the repair blends with the rest of the door instead of standing out.",
      icon: "ShieldCheck",
      href: "/garage-door-panel-replacement-perth",
    },
    {
      title: "New Taurean door install",
      description:
        "A new Taurean Windstrong roller or sectional door supplied and installed when repair no longer makes sense, sized to your opening including cyclone-rated options.",
      icon: "Cpu",
      href: "/garage-door-installation-perth",
    },
    {
      title: "Annual door service",
      description:
        "Curtain, springs, track and the door's balance checked and adjusted so the motor isn't doing the springs' job and the door keeps running quietly.",
      icon: "CalendarCheck",
      href: "/garage-door-maintenance-perth",
    },
  ],
  models: [
    { name: "Windstrong", type: "Roller door", tech: "Windlocked / cyclone-rated", note: "Taurean's flagship cyclone-region roller door, engineered for wind-exposed and coastal Perth properties." },
    { name: "TauraEdge", type: "Roller door track system", note: "The track system fitted to Taurean roller doors for smoother, quieter operation." },
    { name: "Sectional Doors", type: "Sectional door", note: "Taurean's residential sectional range for standard garage openings across Perth." },
    { name: "Insulated Panel Doors", type: "Insulated sectional door", note: "An insulated panel option for extra thermal and noise performance." },
  ],
  faults: [
    { label: "Door won't open at all", icon: "Power", problemSlug: "garage-door-wont-open" },
    { label: "Curtain binds part-way up or down", icon: "MoveVertical", problemSlug: "garage-door-stuck-halfway" },
    { label: "Won't close fully or reverses", icon: "AlertTriangle", problemSlug: "garage-door-wont-close" },
    { label: "Broken spring or frayed cable", icon: "Cable", problemSlug: "garage-door-spring-or-cable-broken" },
    { label: "Remote has stopped pairing", icon: "Radio", problemSlug: "garage-door-remote-not-working" },
    { label: "Grinding or rattling curtain", icon: "Volume2", problemSlug: "noisy-garage-door" },
  ],
  parts: {
    heading: "Genuine Curtain, Track & Hardware — Or an Honest New-Door Quote",
    paragraphs: [
      "Taurean's roller door curtains, TauraEdge track and springs are replaced with correctly rated components matched to your door's width and wind rating, not a generic universal kit — especially important on a Windstrong cyclone-rated door where the wrong part can compromise the rating it was certified for. Sectional panels are matched for colour and profile so a repaired section blends in rather than standing out.",
      "A new door is the honest answer when a roller curtain has corroded through, the barrel has failed, or a sectional door's panels have degraded beyond a straightforward repair. In those cases we quote a straightforward Taurean replacement, including the Windstrong cyclone-rated range where wind loading matters, or point you to the full range of doors we supply and install across Perth at /garage-doors-perth — whichever suits your home and budget.",
    ],
  },
  pricingPins: ["spring", "cable", "damaged", "service", "new-standard"],
  costIntro:
    "Taurean repairs are priced from the same guide list we use on every Perth garage door: a broken spring is {{price:spring}}, a snapped cable is {{price:cable}}, and a damaged curtain or panel is quoted once we've seen it, typically from {{price:damaged}}. A full service is {{price:service}}, and a new standard Taurean roller or sectional door installed is from {{price:new-standard}}. You get the figure in writing before any work starts.",
  costFactors: [
    "Whether the fault is a part (spring, cable, roller) or a full curtain/panel replacement",
    "Standard or Windstrong cyclone-rated — wind-rated doors use heavier-duty components",
    "Door size and opening width — wider commercial and double openings cost more",
    "Whether the track and guides need straightening before the door will run true again",
  ],
  faqs: [
    {
      question: "What are some common problems with Taurean roller doors?",
      answer:
        "The faults we see most on Taurean roller doors in Perth are curtains that jam or run stiffly in the guides, springs that have lost tension so the door feels heavy to lift, and remotes or motors that stop responding on automated units. Coastal air can also corrode fixings and the curtain's galvanised finish over time. Nearly all of these are straightforward service items rather than reasons to replace the whole door.",
    },
    {
      question: "How much does a new Taurean garage door cost in Perth?",
      answer:
        "A new standard Taurean roller or sectional door supplied and installed in Perth starts from {{price:new-standard}}, including the door, track, hardware, removal of the old one and a workmanship warranty. Cyclone-rated Windstrong roller doors and larger commercial openings cost more than a standard residential single door. We measure your opening and give you the exact figure before any work starts.",
    },
    {
      question: "What is the best garage door brand in Australia?",
      answer:
        "There's no single \"best\" brand — it comes down to budget, door style and what suits your opening. Taurean is part of the Fletcher Building Group and manufactures its Windstrong roller doors to Australian standards, including cyclone-rated options, which makes it a solid choice for exposed or coastal Perth properties. We service every major brand and will give you an honest opinion on the door already on your garage.",
    },
    {
      question: "How does Taurean compare with brands like Gliderol or B&D?",
      answer:
        "All three are established Australian-made door brands and we service every one of them, so the honest answer is that the right choice depends on your budget and what your builder or installer already stocks rather than one being clearly superior. Taurean is backed by Stramit and the Fletcher Building Group and is well regarded for its Windstrong cyclone-rated roller doors, while Gliderol and B&D each have their own strong residential ranges. We're happy to talk through the differences for your specific door.",
    },
    {
      question: "Is Taurean related to Gliderol?",
      answer:
        "No — despite both being long-established Australian roller door brands, Taurean and Gliderol are separate, unrelated companies. Taurean is operated by Stramit Corporation as part of the Fletcher Building Group, while Gliderol is a different Australian manufacturer with its own factories and installer network. We service and repair both brands, but they don't share parts, warranties or ownership.",
    },
    {
      question: "Do you service Taurean doors across all of Perth?",
      answer:
        "Yes — technicians cover the whole Perth metro area, from Joondalup and Stirling in the north to Rockingham, Baldivis and Mandurah in the south, with same-day slots on most days. Call with your suburb and a description of the fault and we'll give you an arrival window and a fixed price before we start.",
    },
  ],
  relatedBrands: ["steel-line", "b-and-d", "centurion", "dominator"],
  relatedServices: [
    { label: "All garage door brands in Perth", href: "/garage-door-brands-perth" },
    { label: "Garage door repairs Perth", href: "/garage-door-repairs-perth" },
    { label: "Roller door repairs Perth", href: "/roller-door-repairs-perth" },
    { label: "Roller doors Perth", href: "/roller-doors-perth" },
    { label: "New garage door installation Perth", href: "/garage-door-installation-perth" },
    { label: "Commercial roller doors Perth", href: "/commercial-roller-doors-perth" },
  ],
  serviceAreas: ["Rockingham", "Port Kennedy", "Baldivis", "Mandurah", "Cockburn Central", "Atwell", "Success", "Kalamunda"],
  cta: {
    heading: "Taurean Door Playing Up? Get It Sorted Today",
    subtitle: "Tell us the fault and your suburb — you'll get a same-day slot and a fixed price before we start.",
  },
};
