import type { BrandPage } from "@/types/brand";

/**
 * /b-and-d-garage-door-motors-perth — B&D is Australia's best-known door/opener manufacturer and
 * one of the eight dealer brands (entities.ts `dealer: true`), so "authorised"/"dealer" wording is
 * allowed on this page only. Facts verified against
 * docs/marketing/brand-research-2026-08/entities/b-and-d.md — only two named opener product lines
 * are confirmed (Controll-A-Door for roller doors, Smart Pro for sectional), so `models` lists
 * exactly those two rather than padding with unverified names. Angle: B&D's huge, ageing Perth
 * install base (the brand most homes already have) versus a self-install kit. FAQs mirror the
 * Perth PAA set (docs/marketing/brand-research-2026-08/paa/b-and-d-garage-door-motors-perth.md).
 */
export const bAndDGarageDoorMotorsPerth: BrandPage = {
  brand: "b-and-d",
  kind: "motor",
  slug: "b-and-d-garage-door-motors-perth",
  updatedAt: "2026-08-28",
  seo: {
    title: "B&D Garage Door Motors Perth | Repairs & Replace",
    description:
      "B&D garage door motor stopped working? Authorised Perth service for Controll-A-Door & Smart Pro openers — same-day repairs, remotes and honest replace quotes.",
  },
  hero: {
    h1: "B&D Garage Door Motors in Perth — Repairs, Remotes & Authorised Replacement",
    subtitle:
      "Australia's most-installed door brand, serviced by an authorised local dealer: Controll-A-Door and Smart Pro faults fixed the same day, remotes coded, and a straight answer on repair versus replace.",
    pills: [
      { icon: "ShieldCheck", label: "Authorised B&D dealer" },
      { icon: "Wrench", label: "Same-day repairs" },
      { icon: "Radio", label: "Remotes coded on the spot" },
      { icon: "MapPin", label: "All Perth suburbs" },
    ],
  },
  quickFacts: [
    { label: "Origin", value: "Australia (Botany, Sydney)" },
    { label: "Door types", value: "Roller, sectional & commercial openers" },
    { label: "Known for", value: "Controll-A-Door & Smart Pro openers" },
    { label: "Smart control", value: "B&D App" },
    { label: "What we do", value: "Supply, install, service & repair" },
  ],
  directAnswer:
    "B&D garage door motors are serviced, repaired and replaced across Perth by Capital Garage Doors, an authorised B&D dealer. Because B&D is the country's most common door and opener brand, most faults — a Controll-A-Door that's gone quiet, a Smart Pro that won't pair with the app, a remote that's stopped working — are diagnosed and fixed in one same-day visit. Where a motor has genuinely reached the end of its life, a full replacement is {{price:motor-replace}} supplied and installed with B&D's own warranty.",
  intro: {
    heading: "The Opener Behind Most Perth Garages",
    paragraphs: [
      "B&D is the name on more Perth garage doors than any other, and that shows up just as clearly in the openers we service. Decades of B&D installations across the metro area mean we see everything from ageing Power Drive-era units still running on original hardware to current Controll-A-Door and Smart Pro motors on new sectional and roller doors. As an authorised B&D dealer, we carry genuine remotes, sensors and drive parts, so a repair usually means the correct part on the first visit rather than a return trip.",
      "Being the market leader for so long has an ordinary side effect: a lot of B&D motors in Perth are simply old. Gearboxes wear from years of lifting a door whose springs have quietly lost tension, remotes stop pairing as their internal codes drift or batteries fail, and safety sensors knocked slightly out of line make a perfectly good motor reverse the door instead of closing it. Newer Smart Pro units add the B&D App to the mix, and WiFi drop-outs or a phone that won't reconnect are now a regular part of the call-out list too.",
      "Because we're an authorised dealer, replacement isn't a compromise — it's a genuine B&D Controll-A-Door or Smart Pro motor, supplied and fitted with B&D's own warranty behind it, not a generic substitute picked off a parts-supplier shelf. We still repair whenever the motor has years of useful life left in it; replacement only comes up once the gearbox or board has genuinely failed, or when an older unit simply can't be matched to current B&D parts any more.",
    ],
  },
  services: [
    {
      title: "B&D opener repairs",
      description:
        "Controll-A-Door and Smart Pro faults diagnosed on the day, genuine B&D parts carried so most repairs finish in one visit.",
      icon: "Wrench",
      href: "/garage-door-opener-repair-perth",
    },
    {
      title: "B&D remotes & app pairing",
      description:
        "Genuine remotes supplied and coded to your opener, lost remotes wiped from its memory, and the B&D App connected or reconnected.",
      icon: "Radio",
      href: "/garage-door-remote-replacement-perth",
    },
    {
      title: "Authorised B&D replacement",
      description:
        "When a motor is beyond repair, a genuine new B&D Controll-A-Door or Smart Pro unit supplied and installed with B&D's own warranty.",
      icon: "Cpu",
      href: "/garage-door-motors-perth",
    },
    {
      title: "Annual opener service",
      description:
        "Travel and force limits re-set, safety reverse tested, drive checked and the door balanced so the motor isn't carrying the springs' load.",
      icon: "ShieldCheck",
      href: "/garage-door-maintenance-perth",
    },
  ],
  models: [
    {
      name: "Controll-A-Door (Power Drive)",
      type: "Roller door opener",
      tech: "B&D App on current units",
      note: "B&D's roller-door opener range, fitted beside the drum — the unit we replace most on Perth roller doors.",
    },
    {
      name: "Smart Pro",
      type: "Sectional door opener",
      tech: "B&D App smart control",
      note: "B&D's app-connected sectional-door opener, the current motor fitted alongside new Panelift and Roll-A-Door installs.",
    },
  ],
  faults: [
    { label: "Older B&D opener stopped responding to the remote", icon: "Power", problemSlug: "garage-door-motor-not-responding" },
    { label: "Remote needs re-coding or replacing", icon: "Radio", problemSlug: "garage-door-remote-not-working" },
    { label: "Door reverses instead of closing", icon: "AlertTriangle", problemSlug: "garage-door-wont-close" },
    { label: "Motor straining or grinding on a worn gearbox", icon: "Volume2", problemSlug: "noisy-garage-door" },
    { label: "Door stuck halfway, travel limits drifted", icon: "MoveVertical", problemSlug: "garage-door-stuck-halfway" },
  ],
  decision: {
    repairWhen: [
      "The opener is a Controll-A-Door or Smart Pro under about ten years old with a sensor, remote or gear fault.",
      "The motor still lifts smoothly once the door's springs are correctly re-tensioned.",
      "You only need a genuine replacement remote coded or the B&D App reconnected.",
      "A repair at {{price:motor-repair}} restores an otherwise sound Controll-A-Door or Smart Pro unit.",
    ],
    replaceWhen: [
      "It's an older Power Drive-era motor with a failing board and B&D no longer stocks parts for it.",
      "The gearbox has stripped and a second repair would cost nearly as much as a new motor.",
      "You want the B&D App, battery backup or the quieter belt-driven Smart Pro.",
      "As an authorised B&D dealer we supply and install a genuine new motor at {{price:motor-replace}}, backed by B&D's own warranty.",
    ],
  },
  pricingPins: ["motor-repair", "motor-replace", "wifi", "remote", "service"],
  costIntro:
    "B&D work is priced from the same guide list as every opener we service: a repair covers diagnosis and genuine parts, and a full replacement at {{price:motor-replace}} includes the new B&D motor, remotes, app programming and removal of the old unit. You get the figure in writing before any work starts.",
  costFactors: [
    "Whether the fault is a part (sensor, gear, remote) or the gearbox and board itself",
    "Door type and weight — a heavy insulated sectional needs a higher-rated motor",
    "Extras like the B&D App, battery backup or additional genuine remotes",
    "Whether the door's springs and hardware need attention before a motor can be trusted",
  ],
  faqs: [
    {
      question: "How much does a B&D garage door motor cost to replace in Perth?",
      answer:
        "A genuine B&D replacement motor, supplied and installed by an authorised dealer, is {{price:motor-replace}}. That covers the motor, remotes, wall control, safety sensors, B&D App programming and removal of the old unit, backed by B&D's own warranty. If your existing Controll-A-Door or Smart Pro can be repaired instead, that's typically {{price:motor-repair}} — we quote both before starting.",
    },
    {
      question: "How do I reset my B&D roller door motor?",
      answer:
        "The reset process depends on the exact Controll-A-Door model and whether it's an older unit or a current B&D App-connected one, so getting it wrong can leave the travel limits mismatched to the door. If a reset hasn't fixed the fault or you're not confident doing it yourself, we can reset and reprogram it correctly in one same-day visit.",
    },
    {
      question: "What is the average lifespan of a B&D garage door motor?",
      answer:
        "Ten to fifteen years is typical for a B&D motor in Perth when the door is serviced and the springs are keeping it balanced — some older units run well beyond that with the odd repair. A motor forced to lift an unbalanced door wears its gearbox far sooner, which is why every B&D repair we do starts with checking the door itself.",
    },
    {
      question: "Can I just replace the motor, or do I need a whole new B&D door?",
      answer:
        "In almost every case just the motor needs replacing — the Roll-A-Door or Panelift curtain and panels usually outlast two or three openers. A new door only comes into it if the panels themselves are damaged, badly corroded or the door is no longer worth insulating, which we'll say plainly if we see it.",
    },
    {
      question: "How can I tell if my B&D garage door motor is failing?",
      answer:
        "Warning signs include the motor humming without lifting the door, remotes that work intermittently or only up close, grinding or straining noises, and travel limits that drift so the door stops in a different spot each time. Any of these is worth a same-day check before the motor fails completely and leaves the door stuck.",
    },
    {
      question: "Are you an authorised B&D dealer in Perth?",
      answer:
        "Yes — we're an authorised B&D dealer, which means genuine B&D parts and openers, factory-backed warranty on new motors, and technicians trained on the current Controll-A-Door and Smart Pro ranges as well as older units still common across Perth. It also means a replacement is never a generic substitute for the brand on your door.",
    },
    {
      question: "Can you supply and fit a new B&D motor if mine can't be repaired?",
      answer:
        "Yes — as an authorised dealer we supply and install genuine new B&D Controll-A-Door and Smart Pro motors, matched to your door type and weight, with remotes and app programming set up before we leave. It's fitted at {{price:motor-replace}} with B&D's own warranty, not a third-party alternative.",
    },
  ],
  relatedBrands: ["gliderol", "steel-line", "boss", "ata"],
  relatedServices: [
    { label: "All garage door motor brands in Perth", href: "/garage-door-motor-brands-perth" },
    { label: "Garage door opener repair Perth", href: "/garage-door-opener-repair-perth" },
    { label: "Garage door remote replacement", href: "/garage-door-remote-replacement-perth" },
    { label: "Capital 1100N & 1500N motors", href: "/garage-door-motors-perth" },
    { label: "Motor replacement cost guide", href: "/garage-door-motor-replacement-cost-perth" },
  ],
  serviceAreas: ["Stirling", "Osborne Park", "High Wycombe", "Port Kennedy", "Maddington", "Huntingdale", "Kingsley", "Riverton"],
  cta: {
    heading: "B&D Motor Playing Up? Get It Sorted Today",
    subtitle: "Tell us the model on the opener's label and what it's doing — you'll get a same-day slot and a fixed, authorised-dealer price before we start.",
  },
};
