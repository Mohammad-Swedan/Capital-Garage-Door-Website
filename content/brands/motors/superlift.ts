import type { BrandPage } from "@/types/brand";

/**
 * /superlift-garage-door-motors-perth — Superlift is WA-headquartered (Forrestfield) with 30+
 * years in the market, per docs/marketing/brand-research-2026-08/entities/superlift.md. Superlift
 * sells openers only (no doors), so this page never makes a door claim — the "garage doors"
 * search intent people carry for the name is opener intent. It is a dealer brand (entities.ts),
 * so "authorised dealer" language is used throughout. No smart-app claim: the research file found
 * none stated on-site, so the page describes remotes/keypads, never an app. Models (RDO-5, RDO-6,
 * SDO-5) are the only ones the research verified; the gate opener (SSLG-2) is out of scope for a
 * garage-door page. FAQs mirror the Perth PAA set
 * (docs/marketing/brand-research-2026-08/paa/superlift-garage-door-motors-perth.md).
 */
export const superliftGarageDoorMotorsPerth: BrandPage = {
  brand: "superlift",
  kind: "motor",
  slug: "superlift-garage-door-motors-perth",
  updatedAt: "2026-08-28",
  seo: {
    title: "Superlift Garage Door Openers Perth | Repairs & Remotes",
    description:
      "Superlift garage door opener not working? Perth same-day repairs, remote coding and replacement from an authorised Superlift dealer. Call for a fixed quote.",
  },
  hero: {
    h1: "Superlift Garage Door Openers in Perth — Repairs, Remotes & Replacement",
    subtitle:
      "A WA-headquartered opener brand with over 30 years in the market — Capital Garage Doors is an authorised Superlift dealer supplying, installing, servicing and repairing every model.",
    pills: [
      { icon: "Wrench", label: "Same-day Superlift repairs" },
      { icon: "Radio", label: "Remotes coded on the spot" },
      { icon: "ShieldCheck", label: "Authorised Superlift dealer" },
      { icon: "MapPin", label: "All Perth suburbs" },
    ],
  },
  quickFacts: [
    { label: "Origin", value: "Perth, WA" },
    { label: "Known for", value: "RDO-5, RDO-6 roller & SDO-5 sectional/tilt openers" },
    { label: "Door types", value: "Roller, sectional & tilt" },
    { label: "What we do", value: "Supply, install, service & repair" },
  ],
  directAnswer:
    "Superlift garage door openers are repaired, re-programmed and replaced across Perth by Capital Garage Doors, an authorised Superlift dealer. Most faults on the RDO roller and SDO sectional/tilt ranges — a motor that won't respond, a remote that's stopped pairing, a keypad that won't hold a code — are sorted in one same-day visit. When a Superlift opener has genuinely reached the end of its life, a full replacement is {{price:motor-replace}} supplied and installed, remotes included.",
  intro: {
    heading: "A WA-Headquartered Opener Brand Perth Knows Well",
    paragraphs: [
      "Superlift is headquartered in Forrestfield, on Perth's eastern fringe, and has been building garage door openers for more than 30 years — a genuinely local company rather than an overseas import wearing an Australian-sounding name. That local base is part of why the brand shows up so often on Perth garages: word of mouth travels fast in a city where the company behind the opener is also the one servicing it years later. As an authorised Superlift dealer, Capital Garage Doors supplies, installs, services and repairs the brand's full residential range, whether we fitted the original unit or not.",
      "The range covers most Perth door types: the RDO-5 and RDO-6 for roller doors, and the SDO-5 for sectional and tilt doors, all built around simple handheld remotes rather than the app-connected control some newer brands push as standard. That simplicity is generally reliable, but it does mean the calls we get most often are remote-related — a handset that's stopped pairing, a keypad that won't accept a code, or a motor that hums under load once a door's springs have lost tension and the opener is doing more lifting than it was ever rated for.",
      "We repair a Superlift opener whenever the fault is a part rather than the drive itself, and because we're an authorised dealer we carry the genuine remotes and keypads the range uses, so most repairs finish in a single visit. Where a motor has been labouring for years or a previous repair hasn't held, we say so plainly rather than chase a diagnosis that won't last. A replacement is a genuine Superlift unit supplied and installed with coded remotes and a workmanship warranty, not a generic substitute picked off a parts-supplier shelf.",
    ],
  },
  services: [
    {
      title: "Superlift opener repairs",
      description: "Motor, gear, remote and keypad faults diagnosed on the day, with the common parts carried on board so most repairs finish in one visit.",
      icon: "Wrench",
      href: "/garage-door-opener-repair-perth",
    },
    {
      title: "Superlift remotes & keypad programming",
      description: "Genuine remotes supplied and coded to your RDO or SDO opener, with wireless keypads programmed or reset in the same visit.",
      icon: "Radio",
      href: "/garage-door-remote-replacement-perth",
    },
    {
      title: "Replace a worn-out Superlift opener",
      description: "When repair no longer stacks up, a new Capital motor fitted the same day with WiFi app control and freshly coded remotes.",
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
    { name: "RDO-5", type: "Roller door opener", note: "Superlift's standard roller-door opener, the unit we see most on Perth roller doors." },
    { name: "RDO-6", type: "Roller door opener", note: "The higher-output roller opener in the range, sized for wider or heavier roller doors." },
    { name: "SDO-5", type: "Sectional & tilt door opener", note: "Fitted to both sectional and one-piece tilt doors across Perth." },
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
      "The fault is a remote, keypad, sensor or gear kit rather than the motor's own drive mechanism.",
      "The opener still lifts smoothly once the door's springs are re-tensioned — the drive itself is healthy.",
      "You only need a remote coded, a keypad reprogrammed or a wall button paired to the opener.",
      "A repair at {{price:motor-repair}} restores a unit with years of working life still left in it.",
    ],
    replaceWhen: [
      "The motor is straining, humming or intermittently failing and a previous repair hasn't held for long.",
      "The opener is an older unit and genuine Superlift parts are proving hard to source locally.",
      "You want a heavier-duty motor rated for a bigger or insulated door than the original was built for.",
      "A new motor at {{price:motor-replace}} costs little more than repeated repairs on a tired unit.",
    ],
  },
  pricingPins: ["motor-repair", "motor-replace", "wifi", "remote", "service"],
  costIntro:
    "Superlift opener work is priced from the same guide list as every brand we touch: a repair covers diagnosis and the common parts, and a full replacement at {{price:motor-replace}} includes the new motor, remotes, programming and removal of the old unit — genuine Superlift stock, supplied as an authorised dealer. You get the figure in writing before any work starts.",
  costFactors: [
    "Whether the fault is a part (remote, keypad, sensor, gear) or the motor's drive itself",
    "Door type and weight — roller and sectional/tilt openers are rated differently",
    "Extras like a heavier-duty motor, a battery backup or additional remotes",
    "Whether the door's springs and hardware need attention before a motor can be trusted",
  ],
  faqs: [
    {
      question: "Which remotes work with a Superlift garage door opener in Perth?",
      answer:
        "Genuine Superlift remotes matched to your RDO or SDO opener, which we supply and code to the unit on the spot as an authorised dealer. We can also wipe a lost remote from the opener's memory so it can no longer be used, and pair a wireless keypad or wall button in the same visit.",
    },
    {
      question: "How do I program a new remote for my Superlift opener?",
      answer:
        "We code new remotes to your Superlift opener during a single visit using the unit's own learn button or programming sequence, so there's no guesswork on your end. If you'd rather try it yourself first, the steps are usually on a sticker inside the motor's cover — call us if it doesn't take and we'll sort it on the spot.",
    },
    {
      question: "Is Superlift a reliable garage door opener brand?",
      answer:
        "Owner feedback we see is generally positive, and our own experience matches it — the RDO and SDO ranges are built around solid mechanics rather than software that can go wrong. Reliability still comes down to maintenance as much as brand: an opener left to lift an unbalanced, unserviced door will wear out its gears far sooner than one that's had regular attention.",
    },
    {
      question: "How long does a Superlift garage door opener last?",
      answer:
        "Well over a decade is typical for a Superlift opener that's serviced and lifting a properly balanced door. What actually shortens an opener's life is a door whose springs have lost tension, forcing the motor to do work it was never built for — which is why every repair we do starts with checking the door, not just the motor.",
    },
    {
      question: "Can you supply spare parts for an older Superlift opener?",
      answer:
        "In most cases, yes. As an authorised Superlift dealer we can generally source remotes, keypads and common wear parts even for older units, rather than leaving you to hunt online. Call with whatever's printed on the motor's head unit or cover and we'll confirm what's available before booking a visit.",
    },
    {
      question: "How much does it cost to replace a Superlift garage door motor in Perth?",
      answer:
        "A genuine Superlift replacement, supplied and installed as an authorised dealer, is {{price:motor-replace}}. That covers the new motor, remotes, safety sensors, programming and removal of the old unit. If your existing Superlift opener can be repaired instead, that's typically {{price:motor-repair}} — we tell you which applies before any work starts.",
    },
    {
      question: "Are you an authorised Superlift dealer in Perth?",
      answer:
        "Yes — we supply, install, service and repair the full Superlift range as an authorised dealer, which means genuine remotes and parts rather than a generic substitute. That applies whether we fitted the original opener or you're calling about a Superlift unit installed years ago by someone else.",
    },
  ],
  relatedBrands: ["boss", "jaytech", "avanti", "b-and-d"],
  relatedServices: [
    { label: "All garage door motor brands in Perth", href: "/garage-door-motor-brands-perth" },
    { label: "Garage door opener repair Perth", href: "/garage-door-opener-repair-perth" },
    { label: "Garage door remote replacement", href: "/garage-door-remote-replacement-perth" },
    { label: "Capital 1100N & 1500N motors", href: "/garage-door-motors-perth" },
    { label: "Motor replacement cost guide", href: "/garage-door-motor-replacement-cost-perth" },
  ],
  serviceAreas: ["Midland", "High Wycombe", "Kalamunda", "Forrestdale", "Canning Vale", "Thornlie", "Cockburn Central", "Rockingham"],
  cta: {
    heading: "Superlift Opener Playing Up? Get It Sorted Today",
    subtitle: "Tell us what's printed on the motor's head unit and what it's doing — you'll get a same-day slot and a fixed price before we start.",
  },
};
