import type { BrandPage } from "@/types/brand";

/**
 * /danmar-garage-doors-perth — the only brand in this batch with a native "danmar garage doors
 * perth" query (PAA set, DataForSEO 2026-08-27): Danmar is a genuine Perth manufacturer (35+
 * years, docs/marketing/brand-research-2026-08/entities/danmar.md), so the page leads on
 * local-manufacturing rather than a generic brand pitch. Serviced without a formal supply arrangement.
 */
export const danmarGarageDoorsPerth: BrandPage = {
  brand: "danmar",
  kind: "door",
  slug: "danmar-garage-doors-perth",
  updatedAt: "2026-08-28",
  seo: {
    title: "Danmar Garage Doors Perth | Repairs, Service & Install",
    description:
      "Danmar garage door repairs and genuine timber & panel matching across Perth. Proudly Perth-manufactured, same-day service. Call for a fixed quote.",
  },
  hero: {
    h1: "Danmar Garage Doors in Perth — Repairs, Panels & New Door Installs",
    subtitle:
      "Perth's own timber, aluminium and Thermopanel door manufacturer, kept running by local technicians: panels matched, springs re-tensioned, and honest advice on repair versus replace.",
    pills: [
      { icon: "Wrench", label: "Same-day Danmar repairs" },
      { icon: "ShieldCheck", label: "Genuine timber & panel matching" },
      { icon: "Building2", label: "35+ years, Perth-made" },
      { icon: "MapPin", label: "All Perth suburbs" },
    ],
  },
  quickFacts: [
    { label: "Origin", value: "Perth, WA" },
    { label: "Made in", value: "Manufactured locally, 35+ years" },
    { label: "Known for", value: "Thermoflat, natural timber & aluminium sectional doors" },
    { label: "Door types", value: "Sectional & side-slide sectional, commercial" },
    { label: "What we do", value: "Service, repair & replace" },
  ],
  directAnswer:
    "Danmar garage doors are the timber, aluminium and Thermopanel sectional doors built locally in Perth, and Capital Garage Doors repairs, services and replaces them across the whole metro area. Being a genuinely local manufacturer means matching a damaged timber slat, aluminium panel or Thermoflat section is usually straightforward rather than a special order from interstate. A full service to keep a Danmar door balanced and running smoothly is {{price:service}}, with same-day visits available for anything more urgent.",
  intro: {
    heading: "Danmar — A Genuinely Perth-Made Garage Door",
    paragraphs: [
      "Danmar is one of the few garage door brands actually made in Perth rather than shipped in from an interstate or overseas factory. The business has been building doors locally for more than 35 years, working in natural timber, contemporary aluminium and its own Thermopanel insulated steel, plus a side-slide sectional design for garages where a standard overhead door won't fit. That local manufacturing base is a real practical advantage: when a timber slat, an aluminium panel or a Thermoflat section needs matching, the replacement is usually cut from the same local supply chain rather than sourced from an overseas warehouse months later.",
      "Danmar doors turn up across a wide range of Perth homes, from character properties finished in natural timber to newer builds running the flatter Thermoflat and aluminium ranges. Timber doors need a different kind of care than steel — Perth's sun and dry heat can crack or warp an unsealed timber panel over the years, while the aluminium and Thermopanel ranges are more prone to the usual spring, roller and track wear every sectional door sees. The calls we get most are a timber door that's swollen or sticking on its tracks, a spring that's lost tension, and rollers worn out from a sandy driveway.",
      "Because Danmar manufactures locally, we can genuinely repair rather than replace in most cases — timber slats, aluminium sections and hardware are sourced through the same local supply the doors were originally built from, so a repaired door looks and performs like the original rather than a mismatched patch. When a timber door has warped beyond a straightforward fix, or a decades-old Danmar has simply reached the end of its structural life, we'll say so plainly and quote a straightforward replacement rather than pouring good money into a door that won't hold a repair.",
    ],
  },
  services: [
    {
      title: "Danmar door repairs",
      description:
        "Timber slats, aluminium panels, springs and tracks diagnosed and repaired on the day, sourced through the same local supply chain Danmar doors are built from.",
      icon: "Wrench",
      href: "/garage-door-repairs-perth",
    },
    {
      title: "Danmar panel replacement",
      description:
        "Damaged or warped timber slats and aluminium sections matched and replaced so the fix blends with the rest of the door instead of standing out.",
      icon: "ShieldCheck",
      href: "/garage-door-panel-replacement-perth",
    },
    {
      title: "New Danmar door install",
      description:
        "A new Danmar timber, aluminium or Thermopanel sectional door supplied and installed when repair no longer stacks up, built to your garage's exact size.",
      icon: "Cpu",
      href: "/garage-door-installation-perth",
    },
    {
      title: "Annual door service",
      description:
        "Rollers, hinges, cables and the door's balance checked and adjusted, plus timber doors inspected for early signs of warping or sun damage.",
      icon: "CalendarCheck",
      href: "/garage-door-maintenance-perth",
    },
  ],
  models: [
    { name: "Thermoflat", type: "Sectional door", tech: "Insulated flat-panel", note: "Marketed as one of the flattest garage doors available — a popular pick on newer Perth builds." },
    { name: "Natural Timber Doors", type: "Sectional door", note: "Genuine timber-faced doors in styles like Heritage and Ranch, popular on character homes." },
    { name: "Contemporary Aluminium Doors", type: "Sectional door", note: "Aluminium-framed panels, including a glazed option, for a modern street front." },
    { name: "Side Slide Sectional Doors", type: "Side-slide sectional door", note: "A space-saving Danmar design that slides sideways rather than lifting overhead." },
  ],
  faults: [
    { label: "Door won't open at all", icon: "Power", problemSlug: "garage-door-wont-open" },
    { label: "Timber door swollen and sticking", icon: "MoveVertical", problemSlug: "garage-door-stuck-halfway" },
    { label: "Won't close fully or reverses", icon: "AlertTriangle", problemSlug: "garage-door-wont-close" },
    { label: "Broken spring or frayed cable", icon: "Cable", problemSlug: "garage-door-spring-or-cable-broken" },
    { label: "Door has jumped its tracks", icon: "Unplug", problemSlug: "garage-door-off-track" },
    { label: "Grinding or rattling on the way up", icon: "Volume2", problemSlug: "noisy-garage-door" },
  ],
  parts: {
    heading: "Genuine Timber, Aluminium & Hardware — Or an Honest New-Door Quote",
    paragraphs: [
      "Danmar's local Perth manufacturing means matching a damaged timber slat, aluminium panel or Thermopanel section is rarely a special-order problem — we can usually source the exact profile and finish through the same local supply chain the door was built from, rather than guessing at an interstate equivalent. Springs, cables and hardware are replaced with correctly rated components for the door's size and weight, not a generic universal kit.",
      "A new door is the honest answer when a timber door has warped or rotted beyond a structural repair, or a Danmar door from decades ago has simply reached the end of its service life. In those cases we quote a straightforward Danmar replacement in timber, aluminium or Thermopanel, or point you to the full range of doors we supply and install across Perth at /garage-doors-perth — whichever suits your home and budget.",
    ],
  },
  pricingPins: ["spring", "cable", "damaged", "service", "new-standard"],
  costIntro:
    "Danmar repairs are priced from the same guide list we use on every Perth garage door: a broken spring is {{price:spring}}, a snapped cable is {{price:cable}}, and a damaged timber or aluminium panel is quoted once we've seen it, typically from {{price:damaged}}. A full service is {{price:service}}, and a new standard Danmar sectional door installed is from {{price:new-standard}}. You get the figure in writing before any work starts.",
  costFactors: [
    "Whether the fault is a part (spring, cable, roller) or a full panel/slat replacement",
    "Timber versus aluminium or Thermopanel — timber repairs take more matching work",
    "Door size and weight — double doors and insulated panels cost more to match",
    "Whether tracks and hardware need straightening before the door will run true again",
  ],
  faqs: [
    {
      question: "Are Danmar garage doors a good brand?",
      answer:
        "Yes — Danmar is a genuinely local Perth manufacturer with more than 35 years building timber, aluminium and Thermopanel sectional doors, which is unusual among garage door brands sold in WA. In our experience servicing them, the doors are well made and the local manufacturing means genuine replacement parts are easy to source. Like any door, a Danmar will eventually need a service or repair — that's ordinary wear, not a fault in the brand.",
    },
    {
      question: "What is the most common problem with Danmar garage doors?",
      answer:
        "On timber Danmar doors the most common issue is a slat that's swollen or warped from sun exposure, making the door stick on its tracks. On the aluminium and Thermopanel ranges it's the same wear every sectional door sees — a spring that's lost tension, worn rollers, or a track knocked out of alignment. Nearly all of these are straightforward repairs rather than reasons to replace the door.",
    },
    {
      question: "Does a Danmar garage door have to be an exact size, or can it be custom-made?",
      answer:
        "Danmar builds doors to the exact opening it's measuring for rather than a fixed range of stock sizes, which is one advantage of buying from a local manufacturer. If you're replacing an existing door we measure the opening on-site and order a Danmar sized to fit precisely, and unusual openings — narrow, extra-tall or an angled reveal — can generally be accommodated too.",
    },
    {
      question: "What does it cost to install a new Danmar garage door in Perth?",
      answer:
        "A new standard Danmar sectional door supplied and installed in Perth starts from {{price:new-standard}}, including the door, hardware, removal of the old one and a workmanship warranty. Timber doors and larger double openings cost more than a standard steel or aluminium single door. We measure your opening and give you the exact figure before any work starts.",
    },
    {
      question: "Is Danmar actually manufactured in Perth?",
      answer:
        "Yes — Danmar is a privately owned Perth business that has manufactured its own doors locally for more than 35 years, rather than importing an interstate or overseas range under a local name. That local manufacturing is why matching a damaged timber slat or aluminium panel is usually straightforward for us, and why parts availability tends to be better than for imported brands.",
    },
    {
      question: "How much does it cost to service a Danmar garage door?",
      answer:
        "A full service on a Danmar garage door in Perth is {{price:service}}, covering rollers, hinges, cables and tracks, plus an inspection of timber panels for early sun or moisture damage. Regular servicing is what keeps a timber Danmar door sealing and sliding properly for the long term, and it's the first thing we check before diagnosing any other fault.",
    },
    {
      question: "Do you service Danmar doors across all of Perth?",
      answer:
        "Yes — technicians cover the whole Perth metro area, from Joondalup and Duncraig in the north to Rockingham and Mandurah in the south, with same-day slots on most days. Call with your suburb and a description of the fault and we'll give you an arrival window and a fixed price before we start.",
    },
  ],
  relatedBrands: ["steel-line", "gliderol", "centurion", "dominator"],
  relatedServices: [
    { label: "All garage door brands in Perth", href: "/garage-door-brands-perth" },
    { label: "Garage door repairs Perth", href: "/garage-door-repairs-perth" },
    { label: "Garage door panel replacement", href: "/garage-door-panel-replacement-perth" },
    { label: "New garage door installation Perth", href: "/garage-door-installation-perth" },
    { label: "Garage door repair cost guide", href: "/garage-door-repair-cost-perth" },
  ],
  serviceAreas: ["Scarborough", "Padbury", "Kingsley", "Riverton", "Willetton", "Cannington", "Gosnells", "Southern River"],
  cta: {
    heading: "Danmar Door Playing Up? Get It Sorted Today",
    subtitle: "Tell us the fault and your suburb — you'll get a same-day slot and a fixed price before we start.",
  },
};
