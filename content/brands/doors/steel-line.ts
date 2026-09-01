import type { BrandPage } from "@/types/brand";

/**
 * /steel-line-garage-doors-perth — Steel-Line is Australia's largest garage door manufacturer
 * (45+ years, dedicated Perth branch at Wangara) and is the door most commonly specified in
 * Perth's newer growth-corridor estates thanks to its wide colour/material range and F-linX
 * automation. This page owns the LOCAL repair/service/install slice; FAQs mirror the Perth PAA
 * set (docs/marketing/brand-research-2026-08/paa/steel-line-garage-doors-perth.md). Dealer brand.
 */
export const steelLineGarageDoorsPerth: BrandPage = {
  brand: "steel-line",
  kind: "door",
  slug: "steel-line-garage-doors-perth",
  updatedAt: "2026-09-01",
  seo: {
    title: "Steel-Line Garage Doors Perth | Repairs, Service & Install",
    description:
      "Authorised Steel-Line dealer in Perth: same-day repairs, panel replacement, servicing and new door installs. Genuine parts. Call for a fixed quote.",
  },
  hero: {
    h1: "Steel-Line Garage Doors in Perth — Repairs, Servicing & New Installs",
    subtitle:
      "Australia's largest garage door manufacturer, kept running by local technicians: same-day repairs, genuine panels and a straight answer on repair versus replacement.",
    pills: [
      { icon: "Wrench", label: "Same-day Steel-Line repairs" },
      { icon: "ShieldCheck", label: "Authorised dealer" },
      { icon: "Building2", label: "Residential & commercial" },
      { icon: "MapPin", label: "All Perth suburbs" },
    ],
  },
  quickFacts: [
    { label: "Origin", value: "Australia" },
    { label: "Made in", value: "Australian manufactured, 45+ years" },
    { label: "Known for", value: "Custom Collection, F-linX & Australia's widest door range" },
    { label: "Door types", value: "Roller, sectional, tilt & commercial" },
    { label: "What we do", value: "Supply, install, service & repair" },
  ],
  directAnswer:
    "Steel-Line garage doors are supplied, installed, serviced and repaired across Perth by Capital Garage Doors, an authorised dealer for Australia's largest garage door manufacturer. From a roller door with a broken spring to a full Custom Collection sectional replacement, most faults are fixed in one same-day visit, and a routine service to keep panels, tracks and the F-linX opener running smoothly is {{price:service}}.",
  intro: {
    heading: "Why Steel-Line Is Everywhere in Perth's New Estates",
    paragraphs: [
      "Drive through any of Perth's growth corridors — the southern estates around Baldivis and Piara Waters, the northern releases past Alkimos — and Steel-Line doors turn up on a huge share of the new builds. As Australia's largest garage door manufacturer with a dedicated Wangara branch, it has the colour range, panel finishes and lead times to suit volume home builders, which is exactly why the brand is so common on street after street of recently completed homes.",
      "Steel-Line's range goes well beyond a plain roller door. The Custom Collection and Sectional Doors lines run to DecoWood, UniCote LUX, Western Red Cedar and Colorbond finishes with insulated Mammoth panels, while the F-linX wireless platform ties the opener into smart-home setups. Tilt doors and the Louvre and Barn Style Specialty range turn up less often but are far from rare on older or architecturally designed Perth homes, and the same manufacturer also builds commercial roller shutters, counterweight and folding doors for sheds and small industrial sites across the metro area.",
      "That range and popularity mean we see the same faults again and again: a roller curtain that has jumped its guides, a sectional panel dented in a reversing mishap, or an F-linX opener that has stopped talking to its remotes. Because the brand is so common here, our vans carry the parts and panel profiles that fail most often on Steel-Line doors, so most repairs finish in a single visit.",
    ],
  },
  services: [
    {
      title: "Steel-Line door repairs",
      description: "Springs, cables, rollers, tracks and F-linX opener faults diagnosed and fixed on the day, with common Steel-Line parts carried on board.",
      icon: "Wrench",
      href: "/garage-door-repairs-perth",
    },
    {
      title: "Steel-Line panel replacement",
      description: "Dented or faded Custom Collection and Sectional panels matched and replaced without needing to re-do the whole door.",
      icon: "LayoutPanelTop",
      href: "/garage-door-panel-replacement-perth",
    },
    {
      title: "New Steel-Line door install",
      description: "Supply and installation of a new Steel-Line roller, sectional or tilt door as an authorised dealer, sized and finished to your home.",
      icon: "DoorOpen",
      href: "/garage-door-installation-perth",
    },
    {
      title: "Annual Steel-Line service",
      description: "Springs, tracks, rollers and the F-linX opener checked, lubricated and rebalanced so the door keeps running smoothly and safely.",
      icon: "ShieldCheck",
      href: "/garage-door-maintenance-perth",
    },
  ],
  models: [
    { name: "Custom Collection", type: "Sectional door", tech: "DecoWood, UniCote LUX & Colorbond finishes", note: "Steel-Line's premium designer sectional range, common on newer Perth builds." },
    { name: "Sectional Doors", type: "Sectional door", tech: "Insulated Mammoth panels", note: "The standard insulated sectional line fitted across most new estates." },
    { name: "Roller Doors", type: "Roller door", note: "Compact Colorbond steel curtain, the entry-level option on many project homes." },
    { name: "Tilt Doors", type: "Tilt door", note: "One-piece tilt panel, still found on older Perth homes." },
    { name: "Specialty Doors", type: "Architectural door", tech: "Louvre & Barn Style ranges", note: "Feature doors on architecturally designed or renovated homes." },
  ],
  faults: [
    { label: "Steel-Line door won't open", icon: "Power", problemSlug: "garage-door-wont-open" },
    { label: "Roller curtain or sectional panel off its tracks", icon: "AlertTriangle", problemSlug: "garage-door-off-track" },
    { label: "Door stuck halfway up the rail", icon: "MoveVertical", problemSlug: "garage-door-stuck-halfway" },
    { label: "Snapped spring or frayed cable", icon: "Unplug", problemSlug: "garage-door-spring-or-cable-broken" },
    { label: "Grinding or rattling when moving", icon: "Volume2", problemSlug: "noisy-garage-door" },
  ],
  parts: {
    heading: "Genuine Steel-Line Panels & Parts",
    paragraphs: [
      "As an authorised Steel-Line dealer we can order genuine Custom Collection and Sectional Doors panels, roller curtain sections and Specialty Doors components to match your existing colour and profile, rather than forcing a full-door replacement over a single damaged section. Springs, cables, rollers and F-linX opener parts are sourced to the correct rating for your door, so a repair holds up the same way the original installation did.",
      "Where a panel or colour has been discontinued, or the door has taken enough damage that patching it no longer makes sense, we say so plainly and quote a straight replacement instead of stretching out a repair that won't last. For a full comparison of new-door options across every brand we install, see /garage-doors-perth.",
    ],
  },
  pricingPins: ["spring", "cable", "damaged", "service", "new-standard"],
  costIntro:
    "Steel-Line work is priced from the same guide list as every door we touch: a spring or cable repair covers diagnosis and the part, and a new Steel-Line sectional or roller door supplied and installed starts at {{price:new-standard}}. You get the figure in writing before any work starts.",
  costFactors: [
    "Door type and size — roller, sectional or tilt, and single or double width",
    "Panel finish — plain Colorbond steel versus DecoWood, UniCote LUX or Western Red Cedar",
    "Whether springs, cables or the F-linX opener need attention alongside the panel work",
    "Insulation level and any custom colour or Specialty Doors feature finish",
  ],
  faqs: [
    {
      question: "How much does a Steel-Line garage door cost in Perth?",
      answer:
        "A new Steel-Line door supplied and installed in Perth starts at {{price:new-standard}}, covering a standard Colorbond sectional or roller door with tracks, hardware and removal of the old door. Premium finishes such as DecoWood, UniCote LUX or a custom colour cost more, and we confirm the exact figure for your size and finish before any work is booked.",
    },
    {
      question: "Are Steel-Line garage doors any good?",
      answer:
        "Yes — Steel-Line is Australia's largest garage door manufacturer, and its Custom Collection and Sectional ranges hold up well in Perth's climate when the springs and tracks are kept serviced. Like any brand, doors that are never serviced eventually develop worn rollers or slack tension; the door itself is well made, and most issues we see come from a lack of routine maintenance rather than the panel.",
    },
    {
      question: "My Steel-Line garage door won't open — what could be the problem?",
      answer:
        "The most common causes are a broken torsion spring taking the weight off the motor, a curtain or panel that has jumped its guides, or an F-linX opener that has lost its programming. We diagnose on-site and, in most cases, fix it in the same visit — call with the fault and we'll give you a same-day slot.",
    },
    {
      question: "What is the most common problem with Steel-Line garage doors?",
      answer:
        "Spring and cable wear is the fault we see most, followed by rollers and guides that have corroded or gone out of alignment on roller-door curtains. On sectional doors, a dented panel from a reversing mishap or a knock is the other frequent call-out, and both are usually a same-day fix rather than a full door replacement.",
    },
    {
      question: "How do I manually open a Steel-Line garage door?",
      answer:
        "Pull the red release cord hanging from the opener trolley to disconnect the door from the motor, then lift the door by hand using the handle — it should move smoothly if the springs are properly tensioned. If it feels heavy or won't stay open on its own, the springs likely need attention; treat that as a fault to book in rather than continuing to force it manually.",
    },
    {
      question: "Do you service Steel-Line doors you didn't install?",
      answer:
        "Yes. We repair, service and replace Steel-Line doors regardless of who originally supplied and fitted them — most of our Steel-Line call-outs are on doors installed by a builder or another dealer. Bring us the model or era of the door and we'll carry the right panels and parts on the van.",
    },
    {
      question: "Can you match a discontinued Steel-Line panel or colour?",
      answer:
        "Often, yes — we order current-range Steel-Line panels and finishes to match as closely as possible, and for older or discontinued colours we'll tell you upfront whether a close match is available or whether a full-panel or new-door replacement is the more honest option. We never install a mismatched panel without flagging it first.",
    },
    {
      question: "Do you cover Steel-Line repairs across all of Perth?",
      answer:
        "Yes — technicians cover the whole Perth metro area, from the southern growth corridor around Baldivis and Piara Waters to Rockingham and Canning Vale, with same-day slots on most days. Call with your suburb and what the door is doing and we'll give you an arrival window.",
    },
  ],
  relatedBrands: ["b-and-d", "gliderol", "centurion", "perth-windsor-doors"],
  relatedServices: [
    { label: "All garage door brands in Perth", href: "/garage-door-brands-perth" },
    { label: "Garage door repairs Perth", href: "/garage-door-repairs-perth" },
    { label: "Garage door panel replacement", href: "/garage-door-panel-replacement-perth" },
    { label: "Sectional garage doors Perth", href: "/sectional-garage-doors-perth" },
    { label: "Steel-Line garage door motors", href: "/steel-line-garage-door-motors-perth" },
    { label: "Repair cost guide", href: "/garage-door-repair-cost-perth" },
  ],
  serviceAreas: ["Baldivis", "Piara Waters", "Harrisdale", "Forrestdale", "Southern River", "Canning Vale", "Success", "Rockingham"],
  caseStudySlugs: [
    "steel-line-garage-door-installation-baldivis-perth",
    "garage-door-repairs-lynwood-steel-line-motor-replacement-perth",
  ],
  productImage: {
    src: "https://jadara-hub.b-cdn.net/capital-garage-door/brands/steel-line-sectional-door.webp",
    width: 1600,
    height: 1066,
    alt: "Steel-Line Slimline sectional garage door in Dover White on a Hamptons-style home — manufacturer image",
    caption: "Steel-Line Slimline sectional door, Dover White. Image: Steel-Line.",
    source:
      "https://www.steel-line.com.au/garage-door-openers/sectional-door-openers/ — official manufacturer product image — nominative use (authorised dealer)",
  },
  cta: {
    heading: "Steel-Line Door Playing Up? Get It Sorted Today",
    subtitle: "Tell us the fault and your suburb — you'll get a same-day slot and a fixed price before we start.",
  },
};
