import type { BrandPage } from "@/types/brand";

/**
 * /jaytech-garage-door-motors-perth — Jaytech is an Australian-owned opener brand founded 2012 by
 * two garage door technicians who are also qualified engineers (docs/marketing/brand-research-
 * 2026-08/entities/jaytech.md); the flagship 1200 V4+ sectional opener was tested across roughly
 * 3,000 installations before going to wholesale. Motor-only per research — no door claims. Dealer
 * brand. FAQs mirror the Perth PAA set (docs/marketing/brand-research-2026-08/paa/
 * jaytech-garage-door-motors-perth.md).
 */
export const jaytechGarageDoorMotorsPerth: BrandPage = {
  brand: "jaytech",
  kind: "motor",
  slug: "jaytech-garage-door-motors-perth",
  updatedAt: "2026-08-28",
  seo: {
    title: "Jaytech Garage Door Motors Perth | Repairs & Remotes",
    description:
      "Authorised Jaytech dealer in Perth for 1200 V4+ and RDO opener repairs, remotes and replacement. Same-day service, fixed quotes. Call today.",
  },
  hero: {
    h1: "Jaytech Garage Door Motors in Perth — Repairs, Remotes & Replacement",
    subtitle:
      "An authorised Jaytech dealer keeping the 1200 V4+ and RDO opener ranges running across Perth — faults diagnosed on the day, rolling-code remotes coded on the spot.",
    pills: [
      { icon: "Wrench", label: "Same-day Jaytech repairs" },
      { icon: "Radio", label: "Rolling-code remotes coded" },
      { icon: "ShieldCheck", label: "Authorised Jaytech dealer" },
      { icon: "MapPin", label: "All Perth suburbs" },
    ],
  },
  quickFacts: [
    { label: "Origin", value: "Australia (founded 2012)" },
    { label: "Door types", value: "Sectional, roller & industrial roller" },
    { label: "Known for", value: "1200 V4+ sectional & RDO roller openers" },
    { label: "Smart control", value: "Works with ismartgate & iZone WiFi add-ons" },
    { label: "What we do", value: "Supply, install, service & repair" },
  ],
  directAnswer:
    "Jaytech garage door motors are supplied, installed, serviced and repaired across Perth by Capital Garage Doors, an authorised Jaytech dealer for the 1200 V4+ sectional and RDO roller ranges. Most faults — a remote that's stopped pairing, a motor that hums without lifting, a keypad that won't accept a code — are diagnosed and fixed in one same-day visit. When a Jaytech has genuinely reached the end of its life, a full replacement is {{price:motor-replace}} supplied and installed, with rolling-code remotes programmed on the spot.",
  intro: {
    heading: "An Opener Built by the People Who Repair Them",
    paragraphs: [
      "Jaytech is one of the newer entrants in the Australian opener market, and its origin story is different from most: the brand was founded in 2012 by two garage door technicians who are also qualified engineers, and the flagship 1200 V4+ sectional opener was tested across roughly 3,000 real installations before it went to wholesale. That tradie-first background shows up in the detail — rolling-code remotes that can't be cloned, and a design built around the faults technicians actually see in the field rather than a spec sheet written in a lab overseas.",
      "The range covers two very different jobs. The Jaytech 1200 V4+ is the sectional-door flagship, backed by a full seven-year warranty and increasingly common on newer Perth sectional doors. The RDO 1000+ is the standard roller-door opener fitted to typical residential roller doors, while the heavier RDO 1800+ is built for industrial and commercial roller doors that need a stronger drive. None of the three ship with a Jaytech-branded smartphone app, but they work with third-party WiFi add-ons like ismartgate and iZone for owners who want control from a phone.",
      "Because Jaytech is engineered and supported by people who actually repair openers, parts availability across Australia is generally better than for a brand sold purely through retail. Most of the faults we see are remotes that have lost their pairing, a keypad that won't take a code, or gears wearing after years lifting an unbalanced door — all straightforward repairs. Where a 1200 V4+, RDO 1000+ or RDO 1800+ has a genuine drive failure or has simply reached the end of its working life, we replace it as an authorised dealer, with remotes programmed and a fresh warranty on the new unit.",
    ],
  },
  services: [
    {
      title: "Jaytech opener repairs",
      description: "Motor, gear, keypad and rolling-code remote faults diagnosed on the day, with the common parts carried on board so most repairs finish in one visit.",
      icon: "Wrench",
      href: "/garage-door-opener-repair-perth",
    },
    {
      title: "Jaytech remotes & programming",
      description: "Rolling-code remotes supplied and coded to your 1200 V4+ or RDO opener, lost remotes wiped from its memory, and keypads paired.",
      icon: "Radio",
      href: "/garage-door-remote-replacement-perth",
    },
    {
      title: "Replace a worn-out Jaytech",
      description: "When repair no longer makes sense, a new Capital motor fitted the same day with WiFi app control and freshly coded remotes.",
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
    { name: "Jaytech 1200 V4+", type: "Sectional door opener", tech: "Rolling-code remotes", note: "The brand's flagship sectional opener, backed by a full seven-year warranty." },
    { name: "RDO 1000+", type: "Roller door opener", note: "Jaytech's standard roller-door opener, fitted to typical residential roller doors." },
    { name: "RDO 1800+", type: "Industrial roller door opener", note: "The heavier-duty roller opener built for industrial and commercial roller doors." },
  ],
  faults: [
    { label: "Motor hums but won't lift the door", icon: "Power", problemSlug: "garage-door-motor-not-responding" },
    { label: "Remote stopped pairing or won't code", icon: "Radio", problemSlug: "garage-door-remote-not-working" },
    { label: "Keypad won't accept a code", icon: "AlertTriangle", problemSlug: "garage-door-wont-open" },
    { label: "Door stops part-way up", icon: "MoveVertical", problemSlug: "garage-door-stuck-halfway" },
    { label: "Grinding or straining opener", icon: "Volume2", problemSlug: "noisy-garage-door" },
  ],
  decision: {
    repairWhen: [
      "The 1200 V4+, RDO 1000+ or RDO 1800+ is under warranty and the fault is a remote, sensor or gear kit.",
      "The opener still lifts the door smoothly once the springs are re-tensioned — the drive itself is healthy.",
      "You only need a rolling-code remote reprogrammed, a keypad reset or a WiFi add-on reconnected.",
      "A repair at {{price:motor-repair}} restores a unit that still has years of working life left.",
    ],
    replaceWhen: [
      "The drive itself has failed and the unit is well outside its seven-year warranty period.",
      "Repeated repairs haven't held and the gears or logic board are visibly worn from age.",
      "You want a fresh warranty, WiFi app control or a quieter drive the old unit can't offer.",
      "A new motor at {{price:motor-replace}} costs little more than another repair and resets the warranty clock.",
    ],
  },
  pricingPins: ["motor-repair", "motor-replace", "wifi", "remote", "service"],
  costIntro:
    "Jaytech work is priced from the same guide list as every opener brand we touch: a repair covers diagnosis and the common parts, and a full replacement at {{price:motor-replace}} includes the new motor, rail, rolling-code remotes, programming and removal of the old unit. You get the figure in writing before any work starts.",
  costFactors: [
    "Whether the fault is a part (remote, sensor, gear) or the drive board itself",
    "Door type and weight — 1200 V4+, RDO 1000+ and RDO 1800+ are rated differently",
    "Extras like a WiFi add-on (ismartgate/iZone), battery backup or additional remotes",
    "Whether the door's springs and hardware need attention before a motor can be trusted",
  ],
  faqs: [
    {
      question: "How do I program a new remote for my Jaytech garage door opener?",
      answer:
        "Jaytech openers use rolling-code remotes, which pair to the head unit through a short button sequence on the motor itself rather than a phone app. We supply genuine-compatible remotes and code them to your 1200 V4+, RDO 1000+ or RDO 1800+ on the spot, and we can wipe a lost remote from the unit's memory so it can no longer open your door. Wall buttons and third-party keypads can be paired in the same visit.",
    },
    {
      question: "How much does a Jaytech 1200 V4+ garage door opener cost installed in Perth?",
      answer:
        "A Jaytech 1200 V4+ or RDO roller opener supplied and installed in Perth is {{price:motor-replace}}, covering the motor and rail, rolling-code remotes, a wall control, safety sensors, programming and disposal of the old unit. If your existing Jaytech can be repaired instead, that's typically {{price:motor-repair}} — as an authorised dealer we quote both before starting any work.",
    },
    {
      question: "What is the most reliable brand of garage door opener?",
      answer:
        "There's no single 'most reliable' brand — reliability comes down to how well an opener is matched to the door's weight and how consistently it's serviced. Jaytech's 1200 V4+ is a solid, technician-designed choice with a full seven-year warranty, and we see it holding up well across Perth. We install and repair several quality brands and give an honest recommendation for your door rather than pushing one name.",
    },
    {
      question: "Can I buy a Jaytech 1200 V4+ remote from a hardware store and have it programmed?",
      answer:
        "If you've already bought a compatible remote elsewhere, yes — we can program it, though as an authorised dealer we'll check it's the correct rolling-code type for your 1200 V4+ or RDO opener first. Most customers find it simpler to have us supply and code a genuine remote in the one visit, since the price includes programming and testing that a self-bought remote doesn't.",
    },
    {
      question: "What type of garage door opener is the Jaytech 1200 V4+?",
      answer:
        "The Jaytech 1200 V4+ is a sectional-door opener — the head unit that mounts on the ceiling and drives your garage door along an overhead rail, rather than a wall-mounted or gate motor. It's the brand's flagship model, backed by a full seven-year warranty, and it's increasingly common on newer Perth sectional doors we're called out to service and repair.",
    },
    {
      question: "Are you an authorised Jaytech dealer in Perth?",
      answer:
        "Yes — we supply, install, service and repair the full Jaytech range as an authorised dealer, including the 1200 V4+ sectional opener and the RDO 1000+ and RDO 1800+ roller ranges. That applies whether we fitted the original opener or you're calling about a Jaytech unit another installer put in years ago.",
    },
    {
      question: "Do you service Jaytech openers across all of Perth?",
      answer:
        "Yes — technicians cover the whole Perth metro area, including Kingsley, Duncraig, Riverton, Willetton, Belmont, Bayswater, High Wycombe and Maddington, with same-day slots on most days. Call with the model printed on the opener's head unit and your suburb and we'll give you an arrival window.",
    },
  ],
  relatedBrands: ["merlin", "b-and-d", "liftmaster", "boss"],
  relatedServices: [
    { label: "All garage door motor brands in Perth", href: "/garage-door-motor-brands-perth" },
    { label: "Garage door opener repair Perth", href: "/garage-door-opener-repair-perth" },
    { label: "Garage door remote replacement", href: "/garage-door-remote-replacement-perth" },
    { label: "Capital 1100N & 1500N motors", href: "/garage-door-motors-perth" },
    { label: "Motor replacement cost guide", href: "/garage-door-motor-replacement-cost-perth" },
  ],
  serviceAreas: ["Kingsley", "Duncraig", "Riverton", "Willetton", "Belmont", "Bayswater", "High Wycombe", "Maddington"],
  cta: {
    heading: "Jaytech Opener Playing Up? Get It Sorted Today",
    subtitle: "Tell us the model printed on the opener's head unit and what it's doing — you'll get a same-day slot and a fixed price before we start.",
  },
};
