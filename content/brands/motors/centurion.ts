import type { BrandPage } from "@/types/brand";

/**
 * /centurion-garage-door-motors-perth — "centurion garage door opener perth" (DataForSEO
 * 2026-08-27; docs/marketing/brand-research-2026-08/paa/centurion-garage-door-motors-perth.md).
 * IMPORTANT DISAMBIGUATION (see docs/marketing/brand-research-2026-08/entities/centurion.md):
 * this page is about Centurion Garage Doors (cgdoors.com.au, Wangara WA, est. 1976), the
 * Australian door-and-opener manufacturer whose own-brand opener is the Euro 1250 — NOT
 * Centurion Systems (centsys.com.au), an unrelated South African gate-automation company. The
 * page states this plainly rather than assuming the reader already knows. Centurion is NOT a
 * a page for a retail-network brand (entities.ts flags this brand false on that flag) — that
 * wording is deliberately avoided. No WA
 * manufacturing claim is made (not confirmed on an official page) beyond identifying the
 * company's Wangara head office for disambiguation purposes. Models limited to the two the
 * research file verifies (Euro 1250 + its 1250W upgrade kit).
 */
export const centurionGarageDoorMotorsPerth: BrandPage = {
  brand: "centurion",
  kind: "motor",
  slug: "centurion-garage-door-motors-perth",
  updatedAt: "2026-09-01",
  seo: {
    title: "Centurion Garage Door Openers Perth | Repairs & Remotes",
    description:
      "Centurion Euro 1250 opener acting up? Perth-wide same-day repairs, remote coding and replacement. Call for a fixed quote.",
  },
  hero: {
    h1: "Centurion Garage Door Motors & Openers in Perth — Euro 1250 Repairs & Remotes",
    subtitle:
      "The Euro 1250 opener that ships with Centurion Garage Doors' own sectional and roller doors — diagnosed, repaired and replaced by local technicians, whoever installed it.",
    pills: [
      { icon: "Wrench", label: "Same-day Euro 1250 repairs" },
      { icon: "Radio", label: "Remotes coded on the spot" },
      { icon: "ShieldCheck", label: "Service any Centurion opener" },
      { icon: "MapPin", label: "All Perth suburbs" },
    ],
  },
  quickFacts: [
    { label: "Origin", value: "Australia" },
    { label: "Known for", value: "Euro 1250 opener & MY CGD app" },
    { label: "Door types", value: "Sectional, roller & commercial" },
    { label: "What we do", value: "Service, repair & replace" },
  ],
  directAnswer:
    "Centurion garage door openers — the Euro 1250 unit built by Centurion Garage Doors, the Wangara, WA manufacturer, not the unrelated Centurion Systems gate-motor brand — are serviced, repaired and replaced across Perth by Capital Garage Doors. Most faults, from a remote that won't pair to sensors knocked out of alignment, are fixed in one same-day visit. When a Euro 1250 has genuinely reached the end of its life, a full replacement with a new Capital motor is {{price:motor-replace}} supplied and installed, remotes and programming included.",
  intro: {
    heading: "The Euro 1250 — Centurion Garage Doors' Own Opener",
    paragraphs: [
      "When Perth homeowners search for a Centurion garage door opener, they generally mean Centurion Garage Doors — the family-owned Australian manufacturer headquartered in Wangara, WA, in business since 1976 — not Centurion Systems, an unrelated South African gate-automation company that makes swing and sliding gate motors. Centurion Garage Doors builds its own sectional and roller doors and pairs them with its own-brand Euro 1250 opener, so the two products usually arrive as a matched package rather than an aftermarket opener bolted onto someone else's door. This page covers the Euro 1250 opener specifically, wherever it turns up on a Perth garage.",
      "Because the Euro 1250 usually comes bundled with a new Centurion door rather than bought separately, most of our call-outs are on established homes where the opener has been running for years without a service. The faults we see most are a remote that has stopped pairing, safety sensors knocked out of alignment so the door reverses before it touches the floor, and a chain or belt drive labouring because the door's springs have lost tension and the motor is doing the springs' job as well as its own. Heat inside an uninsulated Perth garage also takes a toll on the logic board over a decade of summers.",
      "We didn't supply your door, and it makes no difference — we service and repair Euro 1250 openers no matter who fitted the door they're on. Most faults on a unit under about ten years old come down to a sensor, a remote or a gear kit, and a straightforward repair gets it running again the same day. Where the drive itself has failed, or the door has outgrown what the original opener was ever rated for, we fit a new belt-drive Capital motor with app control and a five-year warranty instead of chasing parts for a discontinued opener.",
    ],
  },
  services: [
    {
      title: "Centurion Euro 1250 repairs",
      description:
        "Board, sensor, gear and remote faults diagnosed on the day, with the common parts carried so most repairs finish in one visit.",
      icon: "Wrench",
      href: "/garage-door-opener-repair-perth",
    },
    {
      title: "Centurion remotes & programming",
      description:
        "Replacement remotes supplied and coded to your Euro 1250, lost remotes wiped from its memory, wall buttons and keypads paired.",
      icon: "Radio",
      href: "/garage-door-remote-replacement-perth",
    },
    {
      title: "Replace a worn-out Euro 1250",
      description:
        "When repair no longer stacks up, a new belt-drive Capital motor with app control, fitted the same day with a five-year warranty.",
      icon: "Cpu",
      href: "/garage-door-motors-perth",
    },
    {
      title: "Annual opener service",
      description:
        "Force and travel limits reset, safety reverse tested, drive inspected and the door balanced so the motor isn't overworked.",
      icon: "ShieldCheck",
      href: "/garage-door-maintenance-perth",
    },
  ],
  models: [
    {
      name: "Euro 1250",
      type: "Sectional & roller door opener",
      note: "Centurion Garage Doors' own-brand opener, fitted as standard across its sectional and roller door range.",
    },
    {
      name: "Euro 1250W upgrade kit",
      type: "WiFi upgrade kit",
      tech: "MY CGD app",
      note: "Adds MY CGD smartphone app control to an existing Euro 1250 opener.",
    },
  ],
  faults: [
    { label: "Euro 1250 hums but won't lift", icon: "Power", problemSlug: "garage-door-motor-not-responding" },
    { label: "Remote stopped pairing or lost", icon: "Radio", problemSlug: "garage-door-remote-not-working" },
    { label: "Door reverses before it closes", icon: "AlertTriangle", problemSlug: "garage-door-wont-close" },
    { label: "Door stops part-way up", icon: "MoveVertical", problemSlug: "garage-door-stuck-halfway" },
    { label: "Grinding or straining opener", icon: "Volume2", problemSlug: "noisy-garage-door" },
  ],
  decision: {
    repairWhen: [
      "The Euro 1250 is under about ten years old and the fault is a sensor, remote or gear kit issue.",
      "The motor still lifts the door smoothly once the springs are correctly tensioned — the drive itself is healthy.",
      "You only need remotes coded, a wall button paired or the MY CGD app reconnected to the opener.",
      "A repair at {{price:motor-repair}} restores a Euro 1250 that still has years of life left in it.",
    ],
    replaceWhen: [
      "The drive board has failed and genuine Centurion parts for an older Euro 1250 are hard to source.",
      "The opener has been repaired before and a second major fault has turned up within a couple of years.",
      "You want app control, a battery backup or a quieter drive the original Euro 1250 was never fitted with.",
      "A new motor at {{price:motor-replace}} costs little more than a second repair and resets the warranty clock.",
    ],
  },
  pricingPins: ["motor-repair", "motor-replace", "wifi", "remote", "service"],
  costIntro:
    "Centurion Euro 1250 work is priced from the same guide list as every opener brand we touch: a repair covers diagnosis and the common parts, and a replacement at {{price:motor-replace}} includes the new motor, remotes, programming and removal of the old unit. You get the figure in writing before any work starts.",
  costFactors: [
    "Whether the fault is a part (sensor, gear, remote) or the drive board itself",
    "Door type and weight — a heavier sectional or commercial door needs a higher-rated motor",
    "Extras like app control, battery backup or additional remotes",
    "Whether the door's springs and hardware need attention before a new motor can be trusted",
  ],
  faqs: [
    {
      question: "What's the best replacement remote for a Centurion garage door opener?",
      answer:
        "The safest option is a remote coded specifically to your Euro 1250 by a technician on site, since Centurion isn't a common general-retail shelf item and generic universal remotes don't always pair reliably with its receiver. We supply and code compatible remotes to your opener during a visit, and can also wipe a lost remote from its memory so it can no longer open your door.",
    },
    {
      question: "Are Centurion garage doors and their Euro 1250 opener any good?",
      answer:
        "Yes — Centurion Garage Doors is a long-running Australian manufacturer, and the Euro 1250 is a solidly built opener that holds up well when the door it's lifting is properly balanced. Most of the problems we're called out for come from an unbalanced or ageing door putting extra strain on the motor rather than a fault with the opener itself, which is why every repair starts with checking the door, not just the drive.",
    },
    {
      question: "Is Centurion Garage Doors the same company as Centurion Systems gate motors?",
      answer:
        "No — they're two completely unrelated companies that happen to share a name. Centurion Garage Doors, headquartered in Wangara, WA, makes garage doors and the Euro 1250 opener covered on this page. Centurion Systems is a separate, South African-founded business that makes gate and access-control automation — swing gates, sliding gates and boom gates — not garage door openers. If your motor is on a garage door, you're dealing with Centurion Garage Doors.",
    },
    {
      question: "How do I reset a Centurion Euro 1250 garage door opener?",
      answer:
        "The exact steps depend on the control board fitted, since the Euro 1250 has been updated over the years, so we'd rather talk you through it over the phone with the unit in front of you than risk a generic guide that doesn't match your board. If a reset doesn't restore normal operation, it usually points to a genuine fault rather than a settings issue, and we can diagnose it on a same-day visit.",
    },
    {
      question: "What are the most common problems with Centurion garage door motors?",
      answer:
        "The faults we see most on Euro 1250 openers are a remote that has stopped pairing, safety sensors that have drifted out of alignment so the door reverses before it closes, and a chain or belt drive labouring because the door's springs have lost tension. Heat inside an uninsulated Perth garage also takes a toll on the logic board over a decade of summers, which is the one fault that usually points toward replacement rather than repair.",
    },
    {
      question: "Is Centurion one of the most reliable garage door opener brands in Perth?",
      answer:
        "It holds up well against the other brands we service, largely because it's fitted new as a matched pair with a Centurion door rather than added on afterwards, so the motor and door are sized correctly for each other from day one. Reliability on any opener comes down mostly to whether the door itself is balanced and serviced — a Euro 1250 fighting an unbalanced door will fail sooner than the same unit on a well-maintained one.",
    },
    {
      question: "How much does it cost to replace a Centurion garage door opener in Perth?",
      answer:
        "A full replacement with a new Capital motor is {{price:motor-replace}}, supplied and installed, covering the motor and rail, two remotes, a wall control, safety sensors, programming and removal of the old Euro 1250. If the existing opener can be repaired instead, that's typically {{price:motor-repair}} — we tell you which applies, and the fixed price, before any work starts.",
    },
  ],
  relatedBrands: ["b-and-d", "merlin", "chamberlain", "gliderol"],
  relatedServices: [
    { label: "All garage door motor brands in Perth", href: "/garage-door-motor-brands-perth" },
    { label: "Garage door opener repair Perth", href: "/garage-door-opener-repair-perth" },
    { label: "Garage door remote replacement", href: "/garage-door-remote-replacement-perth" },
    { label: "Capital 1100N & 1500N motors", href: "/garage-door-motors-perth" },
    { label: "Motor replacement cost guide", href: "/garage-door-motor-replacement-cost-perth" },
  ],
  serviceAreas: ["Malaga", "Osborne Park", "Stirling", "Kingsley", "Duncraig", "Joondalup", "Midland", "High Wycombe"],
  productImage: {
    src: "https://jadara-hub.b-cdn.net/capital-garage-door/brands/centurion-euro-1250-opener.webp",
    width: 1600,
    height: 965,
    alt: "Centurion Euro 1250 sectional garage door opener — manufacturer product image",
    caption: "Centurion Euro 1250 sectional opener. Image: Centurion Garage Doors.",
    source:
      "https://www.cgdoors.com.au/store/garage-door-openers/centurion-sectional-openers/centurion-euro-1250/ — official manufacturer product image — nominative use",
  },
  cta: {
    heading: "Centurion Euro 1250 Playing Up? Get It Sorted Today",
    subtitle: "Tell us what the opener's doing and your suburb — you'll get a same-day slot and a fixed price before we start.",
  },
};
