import type { BrandPage } from "@/types/brand";

/**
 * /boss-garage-door-motors-perth — Boss's official site (bossoperators.com.au) is dead/empty, so
 * research (docs/marketing/brand-research-2026-08/entities/boss.md) is thin and largely
 * third-party. Per controller ruling: NO specs, NO warranty terms, NO ownership/founding claims
 * (the "founded 1980" and "acquired by Steel-Line" claims are explicitly unverified against a
 * primary source and are NOT stated here). The page is built around what Capital does as a Boss
 * dealer — supply, install, remotes, service, repair, replacement. No `models` field: the only
 * named product codes in the research came from reseller listings, not a primary Boss source, so
 * remotes/keypads are described generically throughout. FAQs mirror the Perth PAA set
 * (docs/marketing/brand-research-2026-08/paa/boss-garage-door-motors-perth.md).
 */
export const bossGarageDoorMotorsPerth: BrandPage = {
  brand: "boss",
  kind: "motor",
  slug: "boss-garage-door-motors-perth",
  updatedAt: "2026-08-28",
  seo: {
    title: "Boss Garage Door Motors Perth | Repairs & Remotes",
    description:
      "Boss garage door motor playing up? Same-day Perth repairs, remote coding and replacement, from an authorised Boss dealer. Call for a fixed quote.",
  },
  hero: {
    h1: "Boss Garage Door Motors in Perth — Repairs, Remotes & Replacement",
    subtitle:
      "An authorised Boss dealer keeping sectional, roller and gate openers running across Perth — faults diagnosed on the day and remotes coded on the spot.",
    pills: [
      { icon: "Wrench", label: "Same-day Boss repairs" },
      { icon: "Radio", label: "Remotes & keypads coded" },
      { icon: "ShieldCheck", label: "Authorised Boss dealer" },
      { icon: "MapPin", label: "All Perth suburbs" },
    ],
  },
  quickFacts: [
    { label: "Origin", value: "Australia" },
    { label: "Known for", value: "Sectional, panel-tilt, roller & gate openers" },
    { label: "Remotes", value: "Handheld remotes & wireless keypads" },
    { label: "What we do", value: "Supply, install, service & repair" },
  ],
  directAnswer:
    "Boss garage door motors are repaired, re-programmed and replaced across Perth by Capital Garage Door, an authorised Boss dealer for sectional, roller and gate openers. Most faults — a motor that won't respond, a remote that's stopped pairing, a keypad that won't accept a code — are sorted in one same-day visit. When a Boss opener has genuinely reached the end of its life, a full replacement is {{price:motor-replace}} supplied and installed, with new remotes included.",
  intro: {
    heading: "Boss Openers Still Running Across Perth",
    paragraphs: [
      "Boss is one of the older opener and remote brands still turning up on Perth garages, most often on doors that were fitted years ago and have quietly kept working since. The brand doesn't have the retail or online presence that newer app-connected openers do, so plenty of owners aren't sure who still supports a Boss unit or where to get a matching remote — which is exactly the gap our technicians fill.",
      "As a Boss dealer, we stock the handheld remotes and wireless keypads these openers are commonly built around, so a lost or worn-out remote can usually be replaced and coded in the one visit rather than left as a guessing game. The faults we see most are tired or unresponsive remotes, a motor that's started to labour or hum without lifting the door, and gear or drive wear that comes with age on any opener that's been running for a decade or more.",
      "We repair Boss openers whenever the fault is a part rather than the drive itself — most calls end there. Where a unit has genuinely reached the end of its working life and parts are getting hard to source, we'll say so plainly and quote a straightforward replacement with a new motor and coded remotes, fitted the same day.",
    ],
  },
  services: [
    {
      title: "Boss opener repairs",
      description: "Motor, gear and remote faults diagnosed on the day, with the common parts carried on board so most repairs finish in one visit.",
      icon: "Wrench",
      href: "/garage-door-opener-repair-perth",
    },
    {
      title: "Boss remotes & keypad programming",
      description: "Handheld remotes supplied and coded to your opener, and wireless keypads programmed or reset in the same visit.",
      icon: "Radio",
      href: "/garage-door-remote-replacement-perth",
    },
    {
      title: "Replace a worn-out Boss opener",
      description: "When repair no longer makes sense, a new Capital motor fitted the same day with WiFi app control and coded remotes.",
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
  faults: [
    { label: "Motor hums or labours but won't lift", icon: "Power", problemSlug: "garage-door-motor-not-responding" },
    { label: "Remote stopped pairing", icon: "Radio", problemSlug: "garage-door-remote-not-working" },
    { label: "Keypad won't accept a code", icon: "AlertTriangle", problemSlug: "garage-door-wont-open" },
    { label: "Door stops part-way up", icon: "MoveVertical", problemSlug: "garage-door-stuck-halfway" },
    { label: "Grinding or straining opener", icon: "Volume2", problemSlug: "noisy-garage-door" },
  ],
  decision: {
    repairWhen: [
      "The fault is a remote, keypad, sensor or gear kit rather than the motor's drive itself.",
      "The opener still lifts the door smoothly once the springs are re-tensioned — the drive is healthy.",
      "You only need a remote coded or a keypad reprogrammed.",
      "A repair at {{price:motor-repair}} restores a unit with years of working life left in it.",
    ],
    replaceWhen: [
      "The motor is straining, humming or intermittently failing and a previous repair hasn't held.",
      "Boss parts for that unit are proving hard to source and repeat call-outs aren't worth it.",
      "You want WiFi app control or a quieter drive that an older Boss motor can't offer.",
      "A new motor at {{price:motor-replace}} costs little more than repeated repairs on a tired unit.",
    ],
  },
  pricingPins: ["motor-repair", "motor-replace", "wifi", "remote", "service"],
  costIntro:
    "Boss opener work is priced from the same guide list as every opener we touch: a repair covers diagnosis and the common parts, a replacement at {{price:motor-replace}} includes the new motor, remotes, programming and removal of the old unit. You get the figure in writing before any work starts.",
  costFactors: [
    "Whether the fault is a part (remote, keypad, sensor, gear) or the motor's drive itself",
    "Door type and weight — sectional, panel-tilt, roller and gate openers are rated differently",
    "Extras like WiFi control, a battery backup or additional remotes",
    "Whether the door's springs and hardware need attention before a motor can be trusted",
  ],
  faqs: [
    {
      question: "Is Boss a reliable garage door opener brand?",
      answer:
        "The Boss units we service are generally solid, older-style openers with simple, repairable mechanics — reliability comes down to maintenance as much as brand. A Boss motor left to drag an unbalanced or unserviced door will wear out its gears far sooner than one that's had regular attention, which is why every repair starts with checking the door itself.",
    },
    {
      question: "How do I program a new remote for my Boss garage door opener?",
      answer:
        "We supply handheld remotes matched to your Boss opener and code them on the spot during a visit, and we can wipe a lost remote from the unit's memory so it can no longer open your door. A wireless keypad can be reprogrammed with a new code in the same visit if needed.",
    },
    {
      question: "How much does it cost to replace a Boss garage door motor in Perth?",
      answer:
        "A like-for-like replacement of a Boss opener is {{price:motor-replace}} supplied and installed, covering the new motor, remotes, safety sensors, programming and removal of the old unit. If your existing Boss motor can be repaired instead, that's typically {{price:motor-repair}} — we tell you which applies before any work starts.",
    },
    {
      question: "How long does it take to replace a Boss garage door opener?",
      answer:
        "Most Boss motor replacements are finished in a single visit, generally two to three hours including fitting the motor, setting travel limits, testing the safety reverse and coding your remotes. We'll give you a realistic window when you book so you're not waiting around all day.",
    },
    {
      question: "How long do Boss garage door openers typically last?",
      answer:
        "Many of the Boss units we're called to are well over a decade old and still going, which says more about simple mechanics than any published lifespan figure. What actually determines how long an opener lasts is whether the door it's lifting is balanced and serviced — an unbalanced door shortens any motor's life, Boss included.",
    },
    {
      question: "Are you an authorised Boss dealer in Perth?",
      answer:
        "Yes — we supply, install, service and repair Boss openers as an authorised dealer, which means we carry the handheld remotes and wireless keypads these openers use rather than sending you to guess at a generic substitute. That applies whether we fitted the original opener or you're calling about a Boss unit installed years ago by someone else.",
    },
    {
      question: "Can you find a remote for an old Boss opener that seems discontinued?",
      answer:
        "Usually, yes. Boss doesn't have the retail presence some newer brands do, but as a dealer we can generally source or code a compatible remote or keypad to an older unit. Call with the model or wording printed on the opener's head unit and we'll confirm what fits before booking a visit.",
    },
  ],
  relatedBrands: ["merlin", "chamberlain", "b-and-d", "gliderol"],
  relatedServices: [
    { label: "All garage door motor brands in Perth", href: "/garage-door-motor-brands-perth" },
    { label: "Garage door opener repair Perth", href: "/garage-door-opener-repair-perth" },
    { label: "Garage door remote replacement", href: "/garage-door-remote-replacement-perth" },
    { label: "Capital 1100N & 1500N motors", href: "/garage-door-motors-perth" },
    { label: "Motor replacement cost guide", href: "/garage-door-motor-replacement-cost-perth" },
  ],
  serviceAreas: ["Belmont", "Bayswater", "Maddington", "Gosnells", "Cannington", "Lathlain", "Southern River", "High Wycombe"],
  cta: {
    heading: "Boss Opener Playing Up? Get It Sorted Today",
    subtitle: "Tell us what's printed on the opener's head unit and what it's doing — you'll get a same-day slot and a fixed price before we start.",
  },
};
