import type { BrandPage } from "@/types/brand";

/**
 * /merlin-garage-door-motors-perth — "merlin garage door opener" is a high-volume national query;
 * this page owns the LOCAL slice — repair, remotes, myQ programming and replacement in Perth.
 * FAQs mirror the Perth PAA set (docs/marketing/brand-research-2026-08/paa/merlin-garage-door-motors-perth.md).
 * Model names verified against docs/marketing/brand-research-2026-08/entities/merlin.md — the
 * Commander range is Merlin's SECTIONAL line (not "SilentDrive", which the research only confirms
 * as a roller-door opener from a single customer testimonial); no "Tiltmaster" name is verified,
 * so tilt is described generically. Merlin does not carry the special retail-network wording flag
 * some other brands do (entities.ts) — keep this file free of that language (see brief rule 16).
 */
export const merlinGarageDoorMotorsPerth: BrandPage = {
  brand: "merlin",
  kind: "motor",
  slug: "merlin-garage-door-motors-perth",
  updatedAt: "2026-09-01",
  seo: {
    title: "Merlin Garage Door Openers Perth | Repairs & Remotes",
    description:
      "Merlin garage door motor playing up? Perth-wide same-day repairs, remote coding and replacement for Commander and SilentDrive openers. Call for a fixed quote.",
  },
  hero: {
    h1: "Merlin Garage Door Motors & Openers in Perth — Repairs, Remotes & Replacement",
    subtitle:
      "Perth's most common myQ-connected opener brand, kept running by local technicians: faults diagnosed on the day, remotes coded on the spot, and an honest call on repair versus replacement.",
    pills: [
      { icon: "Wrench", label: "Same-day Merlin repairs" },
      { icon: "Radio", label: "Remotes coded on the spot" },
      { icon: "Wifi", label: "myQ app set up" },
      { icon: "MapPin", label: "All Perth suburbs" },
    ],
  },
  quickFacts: [
    { label: "Origin", value: "Australia / New Zealand" },
    { label: "Known for", value: "Commander sectional & SilentDrive roller openers" },
    { label: "Smart control", value: "myQ smartphone app" },
    { label: "Door types", value: "Sectional, roller & tilt" },
    { label: "What we do", value: "Service, repair, program & replace" },
  ],
  directAnswer:
    "Merlin garage door motors are repaired, reprogrammed and replaced across Perth by Capital Garage Doors. Most faults — a Commander unit that hums but won't lift, a remote that stopped pairing, a door that reverses before it closes — are fixed in one same-day visit; when a Merlin opener has genuinely reached the end of its life, a full replacement is {{price:motor-replace}} supplied and installed, with remotes and myQ programming included.",
  intro: {
    heading: "Why So Many Perth Garages Run a Merlin",
    paragraphs: [
      "Merlin's Commander range is one of the most common opener families fitted to sectional garage doors across Perth's newer suburbs — a myQ-connected motor mounted above thousands of double garages built through the growth corridors from Baldivis to Alkimos over the past fifteen years. Merlin sells through a network of local installers rather than one national retail chain, so the brand shows up on volume-built homes where the sectional door itself came from several different manufacturers. The Commander motor above it is often the one consistent detail a service call can rely on.",
      "Merlin openers are generally well engineered, but Perth conditions are hard on them. Summer heat baked into an uninsulated garage roof stresses the logic board and remote batteries, coastal air corrodes limit switches and sensor contacts near the ocean suburbs, and a door whose springs have lost tension forces the Commander motor to drag far more weight than it was rated for. The calls we get most are a motor that hums without lifting, a remote that pairs from the driveway but drops out from the street, or a door that opens fine then reverses because a safety beam has slipped out of alignment.",
      "We repair Commander and SilentDrive units whenever the numbers make sense and say so plainly when they don't. If your opener is under about ten years old and the fault is a sensor, a remote, a gear kit or a travel limit, a repair is nearly always the right call. If it's an older unit with a failing logic board and Merlin no longer stocks parts for it locally, a new belt-drive motor with myQ control costs little more than the repair and comes with a fresh warranty on the fit.",
    ],
  },
  services: [
    {
      title: "Merlin opener repairs",
      description:
        "Commander and SilentDrive faults diagnosed on the day, with the common sensor, gear and board parts on board so most repairs finish in one visit.",
      icon: "Wrench",
      href: "/garage-door-opener-repair-perth",
    },
    {
      title: "Merlin remotes & myQ programming",
      description:
        "Replacement remotes supplied and coded to your opener, lost remotes wiped from its memory, and the myQ app reconnected or paired for the first time.",
      icon: "Radio",
      href: "/garage-door-remote-replacement-perth",
    },
    {
      title: "Replace a worn-out Merlin",
      description:
        "When repair no longer stacks up, a new belt-drive Capital motor with app control, fitted the same day and backed by a five-year warranty.",
      icon: "Cpu",
      href: "/garage-door-motors-perth",
    },
    {
      title: "Annual opener service",
      description:
        "Travel and force limits re-set, safety reverse tested, drive checked and the door balanced so the motor isn't doing the springs' job.",
      icon: "ShieldCheck",
      href: "/garage-door-maintenance-perth",
    },
  ],
  models: [
    {
      name: "Commander Essential (MS65MYQ)",
      type: "Sectional door opener",
      tech: "myQ smart control",
      note: "Merlin's entry sectional-door opener — the model we replace most on single-garage doors.",
    },
    {
      name: "Commander Elite (MS105MYQ)",
      type: "Sectional door opener",
      tech: "myQ smart control",
      note: "A mid-tier Commander unit common on double-garage sectional doors across Perth.",
    },
    {
      name: "Commander Ultimate (MJ3800MYQ)",
      type: "Sectional door opener",
      tech: "myQ smart control",
      note: "The top-tier Commander model, built for heavier insulated sectional doors.",
    },
    {
      name: "SilentDrive",
      type: "Roller door opener",
      tech: "myQ smart control",
      note: "Merlin's roller-door opener line, mounted beside the drum on Perth roller doors.",
    },
  ],
  faults: [
    { label: "Commander motor hums but won't lift", icon: "Power", problemSlug: "garage-door-motor-not-responding" },
    { label: "Remote stopped pairing or was lost", icon: "Radio", problemSlug: "garage-door-remote-not-working" },
    { label: "Door opens, then reverses before closing", icon: "AlertTriangle", problemSlug: "garage-door-wont-close" },
    { label: "Door stops part-way up or down", icon: "MoveVertical", problemSlug: "garage-door-stuck-halfway" },
    { label: "Grinding or straining Commander motor", icon: "Volume2", problemSlug: "noisy-garage-door" },
  ],
  decision: {
    repairWhen: [
      "The Commander or SilentDrive is under about ten years old and the fault is a sensor, remote, gear kit or limit setting.",
      "The motor still lifts smoothly once the door's springs are correctly re-tensioned — the drive itself is healthy.",
      "You only need remotes coded, a wall button paired or the myQ app reconnected.",
      "A repair at {{price:motor-repair}} restores a unit that still has years of life left in the drive.",
    ],
    replaceWhen: [
      "It's an older chain-drive unit with a failing logic board and Merlin no longer stocks parts for it.",
      "The motor has already been repaired once and a second major fault has appeared within a couple of years.",
      "You want myQ app control, a battery backup or a quieter belt drive the old unit can't offer.",
      "A new motor at {{price:motor-replace}} costs little more than the repair and resets the warranty clock.",
    ],
  },
  pricingPins: ["motor-repair", "motor-replace", "wifi", "remote", "service"],
  costIntro:
    "Merlin work is priced from the same guide list as every opener brand we service: a repair covers diagnosis and the common parts, and a full replacement at {{price:motor-replace}} includes the new motor, remotes, myQ programming and removal of the old unit. You get the figure in writing before any work starts.",
  costFactors: [
    "Whether the fault is a part (sensor, gear, remote) or the logic board itself",
    "Door type and weight — a heavy insulated sectional needs a higher-rated motor",
    "Extras like myQ app control, battery backup or additional remotes",
    "Whether the door's springs and hardware need attention before a motor can be trusted",
  ],
  faqs: [
    {
      question: "How much does a Merlin garage door motor cost to replace in Perth?",
      answer:
        "A like-for-like replacement of a Merlin opener with a new belt-drive motor is {{price:motor-replace}} supplied and installed in Perth. That covers the motor and rail, two remotes, a wall control, safety sensors, myQ programming and disposal of the old unit. If the existing Merlin can be repaired instead, that is typically {{price:motor-repair}} — we tell you which applies before any work starts.",
    },
    {
      question: "Does Bunnings sell Merlin garage door motors, and can you fit one I've bought?",
      answer:
        "Merlin sells through a network of local installers rather than big-box retail, so it isn't a common Bunnings shelf item the way some DIY opener brands are. If you've already sourced a Merlin unit another way, we can still fit it — we'll check it's rated for your door's weight first, and the installed price includes the rail, remotes and myQ programming plus a workmanship warranty.",
    },
    {
      question: "Is a Merlin garage door motor any good?",
      answer:
        "Yes — Merlin is one of the most widely fitted opener brands in Perth, and the Commander range is generally well engineered for the local climate when it's installed and maintained correctly. Most of the faults we see are wear items (sensors, gears, remotes) rather than a poor drive design, which is why the majority of Merlin call-outs end in a repair, not a replacement.",
    },
    {
      question: "What are the best garage door motors for Perth homes?",
      answer:
        "There's no single best brand — Merlin, B&D, Chamberlain and several other openers all perform well in Perth when matched to the right door weight and serviced yearly. What matters more than the badge is whether the motor is correctly rated for your door and whether the springs are keeping the load balanced, which is the first thing we check on any repair or replacement job.",
    },
    {
      question: "How long do Merlin garage door opener motors usually last?",
      answer:
        "Ten to fifteen years is typical in Perth if the door is serviced annually and the springs are keeping it balanced. A Commander motor forced to drag an unbalanced door wears its gears and board much sooner, which is why every repair we do starts with checking the door itself, not just the motor.",
    },
    {
      question: "Can you program a new remote for my Merlin opener?",
      answer:
        "Yes. We supply compatible remotes and code them to your Commander or SilentDrive opener on the spot, and we can wipe a lost remote from the unit's memory so it can no longer open your door. Wall buttons, wireless keypads and the myQ app can all be paired in the same visit.",
    },
    {
      question: "Do you service Merlin openers across all of Perth?",
      answer:
        "Yes — technicians cover the whole Perth metro area, from Joondalup and Clarkson in the north to Rockingham, Baldivis and Mandurah in the south, with same-day slots on most days. Call with your suburb and the model printed on the opener's label and we'll give you an arrival window.",
    },
  ],
  relatedBrands: ["chamberlain", "b-and-d", "gliderol", "steel-line"],
  relatedServices: [
    { label: "All garage door motor brands in Perth", href: "/garage-door-motor-brands-perth" },
    { label: "Garage door opener repair Perth", href: "/garage-door-opener-repair-perth" },
    { label: "Garage door remote replacement", href: "/garage-door-remote-replacement-perth" },
    { label: "Capital 1100N & 1500N motors", href: "/garage-door-motors-perth" },
    { label: "Motor replacement cost guide", href: "/garage-door-motor-replacement-cost-perth" },
  ],
  serviceAreas: ["Joondalup", "Clarkson", "Midland", "Canning Vale", "Thornlie", "Cockburn Central", "Baldivis", "Mandurah"],
  productImage: {
    src: "https://jadara-hub.b-cdn.net/capital-garage-door/brands/merlin-opener-installed.webp",
    width: 1600,
    height: 900,
    alt: "Merlin garage door opener head unit mounted on a garage ceiling in Australia",
    caption: "A Merlin opener installed in an Australian garage. Photo: Photnart, Wikimedia Commons (CC BY-SA 4.0).",
    source:
      "https://commons.wikimedia.org/wiki/File:Merlin_auto_garage_opener.jpg — Wikimedia: CC BY-SA 4.0 — attribution in caption",
  },
  cta: {
    heading: "Merlin Playing Up? Get It Sorted Today",
    subtitle: "Tell us the model on the opener's label and what it's doing — you'll get a same-day slot and a fixed price before we start.",
  },
};
