import type { BrandPage } from "@/types/brand";

/**
 * /gliderol-garage-door-motors-perth — Gliderol is primarily a Perth door brand (roller +
 * sectional, since 1974) that also builds its own automation: the Genesis Series sectional
 * opener and the Glidermatic GRD roller operator. This page owns the LOCAL repair/remote/
 * replacement slice for those openers. Gliderol IS a dealer brand here — "authorised dealer"
 * wording is used. FAQs mirror the Perth PAA set (docs/marketing/brand-research-2026-08/paa/
 * gliderol-garage-door-motors-perth.md). Facts per docs/marketing/brand-research-2026-08/
 * entities/gliderol.md — ownership and a smart-app name were NOT confirmed, so neither is
 * claimed on this page.
 */
export const gliderolGarageDoorMotorsPerth: BrandPage = {
  brand: "gliderol",
  kind: "motor",
  slug: "gliderol-garage-door-motors-perth",
  updatedAt: "2026-08-28",
  seo: {
    title: "Gliderol Garage Door Motors Perth | Repairs & Remotes",
    description:
      "Gliderol opener not working? Same-day Perth repairs, remote coding and replacement for Genesis and Glidermatic GRD openers, from an authorised Gliderol dealer.",
  },
  hero: {
    h1: "Gliderol Garage Door Motors in Perth — Repairs, Remotes & Replacement",
    subtitle:
      "Authorised Gliderol dealer technicians repairing, coding and replacing Genesis and Glidermatic GRD openers across Perth, with a same-day slot and a fixed price before we start.",
    pills: [
      { icon: "Wrench", label: "Same-day Gliderol repairs" },
      { icon: "Radio", label: "Remotes coded on the spot" },
      { icon: "ShieldCheck", label: "Authorised Gliderol dealer" },
      { icon: "MapPin", label: "All Perth suburbs" },
    ],
  },
  quickFacts: [
    { label: "Origin", value: "Australia — manufacturing since 1974" },
    { label: "Known for", value: "Genesis Series & Glidermatic GRD openers" },
    { label: "Door types", value: "Sectional & roller" },
    { label: "What we do", value: "Supply, install, service & repair" },
  ],
  directAnswer:
    "Gliderol garage door motors are repaired, serviced and replaced across Perth by Capital Garage Door, an authorised Gliderol dealer. Most faults on a Genesis Series sectional opener or a Glidermatic GRD roller unit — a motor that won't respond, a remote that's stopped pairing, a door that reverses before it closes — are fixed in one same-day visit. When a Gliderol opener has genuinely reached the end of its life, a full replacement is {{price:motor-replace}} supplied and installed, remotes and programming included.",
  intro: {
    heading: "Gliderol Doors and Openers Across Perth",
    paragraphs: [
      "Gliderol has been manufacturing garage doors in Australia since 1974, and across Perth its roller and sectional doors turn up on everything from established brick-and-tile homes to newer estate builds in the outer suburbs. Fewer owners realise Gliderol also builds its own automation to match — the Genesis Series for sectional doors and the Glidermatic GRD for roller doors — so a home with a Gliderol door quite often has a Gliderol opener quietly running above it.",
      "As an authorised Gliderol dealer, we carry the parts these openers actually need rather than reaching for a generic substitute. The calls we get most are a Glidermatic GRD that hums without lifting the roller curtain, a Genesis unit whose remote has stopped pairing, or a door that stops mid-travel because the limit settings have drifted. Perth's summer heat is hard on any opener's circuit board sitting in an unventilated garage, and a Gliderol unit is no exception.",
      "Most Gliderol opener faults are a straightforward repair — a sensor, a gear, a remote or a limit reset — and we say so plainly when that's the case. Where a unit is genuinely old and parts are getting harder to source, we'll recommend a clean replacement rather than chase a fault that keeps returning, and if the matching Gliderol door itself ever needs attention, our technicians handle that too.",
    ],
  },
  services: [
    {
      title: "Gliderol opener repairs",
      description: "Genesis and Glidermatic GRD faults diagnosed on the day, with the parts these units actually use carried on board so most repairs finish in one visit.",
      icon: "Wrench",
      href: "/garage-door-opener-repair-perth",
    },
    {
      title: "Gliderol remotes & programming",
      description: "Genuine-compatible remotes supplied and coded to your Genesis or Glidermatic unit, with lost remotes wiped from its memory.",
      icon: "Radio",
      href: "/garage-door-remote-replacement-perth",
    },
    {
      title: "Replace a worn-out Gliderol opener",
      description: "When a repair no longer stacks up, a new Capital motor fitted the same day with a fresh workmanship warranty and coded remotes.",
      icon: "Cpu",
      href: "/garage-door-motors-perth",
    },
    {
      title: "Annual opener service",
      description: "Force and travel limits re-set, safety reverse tested, drive checked and the door balanced so the opener isn't doing the springs' job.",
      icon: "ShieldCheck",
      href: "/garage-door-maintenance-perth",
    },
  ],
  models: [
    { name: "Genesis Series", type: "Sectional door opener", note: "Gliderol's opener for sectional doors — the unit we see most on Perth two-car garages." },
    { name: "Glidermatic GRD Heavy Duty", type: "Roller door opener", note: "A single-motor roller operator for standard-weight Gliderol roller doors." },
    { name: "Glidermatic GRD Dual", type: "Roller door opener", note: "A dual-motor version of the GRD for larger or heavier roller doors." },
  ],
  faults: [
    { label: "Glidermatic motor hums but won't lift", icon: "Power", problemSlug: "garage-door-motor-not-responding" },
    { label: "Remote stopped pairing or lost", icon: "Radio", problemSlug: "garage-door-remote-not-working" },
    { label: "Door reverses before it closes", icon: "AlertTriangle", problemSlug: "garage-door-wont-close" },
    { label: "Door stops part-way up", icon: "MoveVertical", problemSlug: "garage-door-stuck-halfway" },
    { label: "Grinding or straining opener", icon: "Volume2", problemSlug: "noisy-garage-door" },
  ],
  decision: {
    repairWhen: [
      "The opener is a Genesis or Glidermatic unit under about ten years old with a sensor, remote or gear fault.",
      "The motor still lifts the door smoothly once the springs are re-tensioned — the drive itself is healthy.",
      "You only need remotes coded, a wall button paired or the limit settings re-set.",
      "A repair at {{price:motor-repair}} restores a unit with plenty of life left in the drive.",
    ],
    replaceWhen: [
      "It's an older Gliderol unit with a failing board and parts are becoming hard to source.",
      "The opener has been repaired before and a second major fault has appeared within a couple of years.",
      "You want WiFi app control, a battery backup or a quieter belt drive the old unit can't offer.",
      "A new motor at {{price:motor-replace}} costs little more than the repair and resets the warranty clock.",
    ],
  },
  pricingPins: ["motor-repair", "motor-replace", "wifi", "remote", "service"],
  costIntro:
    "Gliderol opener work is priced from the same guide list as every opener we touch: a repair covers diagnosis and the common parts, a replacement at {{price:motor-replace}} includes the new motor, remotes, programming and removal of the old unit. You get the figure in writing before any work starts.",
  costFactors: [
    "Whether the fault is a part (sensor, gear, remote) or the drive board itself",
    "Whether the opener is a Genesis sectional unit or a single- or dual-motor Glidermatic GRD",
    "Extras like WiFi control, a battery backup or additional remotes",
    "Whether the door's springs and hardware need attention before a motor can be trusted",
  ],
  faqs: [
    {
      question: "Can you replace the motor in my Gliderol garage door?",
      answer:
        "Yes. As an authorised Gliderol dealer we replace both Genesis sectional openers and Glidermatic GRD roller units, either like-for-like or with an upgraded Capital motor if you'd prefer WiFi app control. A full replacement is {{price:motor-replace}} supplied and installed, with remotes and programming included. If the fault can be repaired instead, we'll say so and quote that lower figure.",
    },
    {
      question: "What are the most common problems with Gliderol garage door motors in Perth?",
      answer:
        "The faults we see most are a Glidermatic GRD that hums without lifting the roller curtain, a Genesis remote that's stopped pairing, safety sensors knocked out of alignment so the door reverses before closing, and travel limits that drift so the door stops short. Heat-stressed circuit boards on older units are the fault that usually tips the decision toward replacement.",
    },
    {
      question: "How much does it cost to replace a Gliderol garage door motor in Perth?",
      answer:
        "A like-for-like replacement of a Gliderol opener is {{price:motor-replace}} supplied and installed, covering the motor, remotes, safety sensors, programming and disposal of the old unit. If your existing Gliderol motor can be repaired instead, that's typically {{price:motor-repair}} — we quote both so the choice is yours.",
    },
    {
      question: "What's the difference between B&D and Gliderol garage door openers?",
      answer:
        "Both are long-standing Australian manufacturers with their own opener ranges — B&D's Controll-A-Door line and Gliderol's Genesis and Glidermatic GRD units. In practice the difference that matters is which one is already fitted to your door: we stock parts and genuine-compatible remotes for both, so either brand is repaired the same way, on the same day.",
    },
    {
      question: "Is Gliderol a good garage door brand?",
      answer:
        "Gliderol has manufactured doors and openers in Australia since 1974 and its Genesis and Glidermatic GRD units are generally solid performers when the door itself is balanced and serviced. Like any opener, reliability comes down to maintenance as much as brand — a Gliderol motor left to drag an unbalanced door will wear out faster than one that's serviced yearly.",
    },
    {
      question: "Are you an authorised Gliderol dealer in Perth?",
      answer:
        "Yes — we supply, install, service and repair Gliderol openers as an authorised dealer, which means genuine-compatible parts and remotes rather than a generic substitute. That applies whether we installed the original opener or you're calling us about a Gliderol unit fitted by someone else years ago.",
    },
    {
      question: "Do you service Gliderol openers across all of Perth?",
      answer:
        "Yes — technicians cover the whole Perth metro area, from Joondalup and Clarkson in the north to Rockingham, Baldivis and Mandurah in the south, with same-day slots on most days. Call with your suburb and the model printed on the opener's head unit and we'll give you an arrival window.",
    },
  ],
  relatedBrands: ["b-and-d", "steel-line", "merlin", "chamberlain"],
  relatedServices: [
    { label: "All garage door motor brands in Perth", href: "/garage-door-motor-brands-perth" },
    { label: "Garage door opener repair Perth", href: "/garage-door-opener-repair-perth" },
    { label: "Garage door remote replacement", href: "/garage-door-remote-replacement-perth" },
    { label: "Capital 1100N & 1500N motors", href: "/garage-door-motors-perth" },
    { label: "Gliderol garage doors Perth", href: "/gliderol-garage-doors-perth" },
  ],
  serviceAreas: ["Joondalup", "Midland", "Scarborough", "Baldivis", "Rockingham", "Canning Vale", "Cockburn Central", "Mandurah"],
  cta: {
    heading: "Gliderol Opener Playing Up? Get It Sorted Today",
    subtitle: "Tell us the model on the opener's head unit and what it's doing — you'll get a same-day slot and a fixed price before we start.",
  },
};
