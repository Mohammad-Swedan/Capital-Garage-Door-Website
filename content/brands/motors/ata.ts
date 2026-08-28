import type { BrandPage } from "@/types/brand";

/**
 * /ata-garage-door-motors-perth — "ata garage door opener perth" (DataForSEO 2026-08-27;
 * docs/marketing/brand-research-2026-08/paa/ata-garage-door-motors-perth.md). ATA (Automatic
 * Technology Australia) is part of the B&D Group (docs/marketing/brand-research-2026-08/entities/ata.md)
 * but this is not a page for a retail-network brand (entities.ts flags this brand false on that
 * flag) — that wording is deliberately avoided.
 * Model names limited to the two the research file verifies: EasyRoller (residential) and Dave
 * (commercial operator, high/low-power cartridge options) — angle covers both the residential
 * roller-door install and the commercial/strata use case.
 */
export const ataGarageDoorMotorsPerth: BrandPage = {
  brand: "ata",
  kind: "motor",
  slug: "ata-garage-door-motors-perth",
  updatedAt: "2026-08-28",
  seo: {
    title: "ATA Garage Door Openers Perth | Repairs & EasyRoller",
    description:
      "ATA EasyRoller or Dave opener not working right? Perth-wide same-day repairs, remote programming and replacement. Call now.",
  },
  hero: {
    h1: "ATA Garage Door Motors & Openers in Perth — EasyRoller & Dave Repairs",
    subtitle:
      "Australian-engineered openers behind many Perth roller doors and commercial roller shutters — diagnosed, repaired and replaced by local technicians, whoever installed them.",
    pills: [
      { icon: "Wrench", label: "Same-day ATA repairs" },
      { icon: "Radio", label: "Remotes coded on the spot" },
      { icon: "Building2", label: "Residential & commercial" },
      { icon: "MapPin", label: "All Perth suburbs" },
    ],
  },
  quickFacts: [
    { label: "Origin", value: "Australia" },
    { label: "Owned by", value: "B&D Group" },
    { label: "Known for", value: "EasyRoller & Dave commercial operators" },
    { label: "Door types", value: "Roller & commercial" },
    { label: "What we do", value: "Service, repair & replace" },
  ],
  directAnswer:
    "ATA (Automatic Technology Australia) garage door openers — the residential EasyRoller and the commercial Dave operator — are serviced, repaired and replaced across Perth by Capital Garage Doors. Most faults, from a chain that has stretched to a remote that won't respond, are fixed in one same-day visit. When a unit has genuinely reached the end of its life, a full replacement is {{price:motor-replace}} supplied and installed, sized correctly for the door it's lifting.",
  intro: {
    heading: "ATA — EasyRoller and Dave Openers Around Perth",
    paragraphs: [
      "ATA — Automatic Technology Australia — has been engineering openers in Australia since 1978 and is part of the B&D Group, one of the country's best-known door manufacturers. Its residential range centres on the EasyRoller, a roller door opener, while the commercial Dave operator, available with different power cartridges, handles heavier roller and industrial doors. Because ATA designs and builds locally rather than badge-engineering an imported unit, replacement parts and gearing tend to be more consistent across model years than with some import brands — useful when we're repairing an older unit rather than starting from scratch.",
      "EasyRoller units turn up most on Perth roller doors fitted to older project homes and rear-lane garages, where a roller door was the simplest retrofit for the opening. The Dave operator, by contrast, is more common on strata complexes, storage facilities and light-industrial roller shutters that need a heavier-duty motor than a residential unit provides. On both, the recurring faults are much the same as any roller-door opener: a remote that stops responding, a chain that has stretched and started slipping, or a motor that strains because the curtain itself has dropped out of alignment in its guides.",
      "We service, repair and replace EasyRoller and Dave openers across Perth regardless of who supplied the door. A repair covers the parts that fail most — chain, gears, remote board, travel limits — and gets a unit back on a residential or commercial roller door the same day. Where a Dave operator has genuinely outlived its cartridge or an EasyRoller's drive has failed beyond repair, we fit a replacement motor sized correctly for the door's weight rather than guessing at a like-for-like swap.",
    ],
  },
  services: [
    {
      title: "ATA opener repairs",
      description:
        "Chain, gear, remote and travel-limit faults diagnosed on the day, with the common parts carried so most repairs finish in one visit.",
      icon: "Wrench",
      href: "/garage-door-opener-repair-perth",
    },
    {
      title: "ATA remotes & programming",
      description:
        "Replacement remotes supplied and coded to your EasyRoller or Dave operator, lost remotes wiped from memory, wall buttons paired.",
      icon: "Radio",
      href: "/garage-door-remote-replacement-perth",
    },
    {
      title: "Replace a worn-out ATA opener",
      description:
        "When repair no longer stacks up, a new Capital motor sized to your roller or commercial door, fitted the same day with a warranty.",
      icon: "Cpu",
      href: "/garage-door-motors-perth",
    },
    {
      title: "Annual opener service",
      description:
        "Chain tension checked, travel limits and safety reverse reset, the drive inspected before it fails outright, and the roller curtain aligned so the motor isn't straining against it.",
      icon: "ShieldCheck",
      href: "/garage-door-maintenance-perth",
    },
  ],
  models: [
    {
      name: "Dave",
      type: "Commercial roller door operator",
      tech: "High/low-power cartridge options",
      note: "ATA's flagship commercial operator, sized for heavier roller and industrial doors.",
    },
    {
      name: "EasyRoller (GDO 6V5)",
      type: "Residential roller door opener",
      note: "ATA's residential roller-door unit, the one we see most on Perth roller garages.",
    },
  ],
  faults: [
    { label: "Opener doesn't respond to remote or button", icon: "Power", problemSlug: "garage-door-motor-not-responding" },
    { label: "Chain has stretched or is slipping", icon: "Wrench", problemSlug: "garage-door-wont-open" },
    { label: "Remote stopped pairing or lost", icon: "Radio", problemSlug: "garage-door-remote-not-working" },
    { label: "Curtain binding or off its guides", icon: "AlertTriangle", problemSlug: "garage-door-off-track" },
    { label: "Grinding or straining drive", icon: "Volume2", problemSlug: "noisy-garage-door" },
  ],
  decision: {
    repairWhen: [
      "The opener is under about ten years old and the fault is a chain, gear, remote or limit setting.",
      "The motor still lifts the door smoothly once the curtain is realigned in its guides.",
      "You only need remotes coded, a wall button paired or travel limits reset.",
      "A repair at {{price:motor-repair}} restores an EasyRoller or Dave unit with years of life left.",
    ],
    replaceWhen: [
      "The drive gears or motor itself have failed and parts for an older unit are hard to source.",
      "A Dave operator has been repaired before and a heavier-duty cartridge or a new unit makes more sense.",
      "You want a quieter drive or a motor properly rated for a door it's been straining to lift.",
      "A new motor at {{price:motor-replace}} costs little more than a second repair and resets the warranty.",
    ],
  },
  pricingPins: ["motor-repair", "motor-replace", "wifi", "remote", "service"],
  costIntro:
    "ATA work is priced from the same guide list as every opener brand we touch: a repair covers diagnosis and the common parts, and a replacement at {{price:motor-replace}} includes the new motor, remotes, programming and removal of the old unit. You get the figure in writing before any work starts.",
  costFactors: [
    "Whether the fault is a part (chain, gear, remote) or the drive itself",
    "Door type and duty — a commercial Dave operator is priced differently to a residential EasyRoller",
    "Extras like additional remotes or a heavier-duty power cartridge",
    "Whether the door's curtain or guides need attention before a motor can be trusted",
  ],
  faqs: [
    {
      question: "How do I program a replacement remote for my ATA garage door opener?",
      answer:
        "We supply compatible remotes for EasyRoller and Dave openers and code them to your unit on the spot, and can wipe a lost remote from the receiver's memory at the same time so it can no longer open your door. Wall buttons and keypads can be paired in the same visit.",
    },
    {
      question: "Is ATA the same company as B&D?",
      answer:
        "They're related but not identical — ATA (Automatic Technology Australia) is part of the B&D Group, the same company behind the well-known B&D door brand, but ATA operates as its own opener range with its own EasyRoller and Dave product lines. We service and repair ATA units on their own merits, not as a sub-line of B&D.",
    },
    {
      question: "Where can I find manuals for my ATA garage door opener?",
      answer:
        "ATA publishes manuals and support material on its own website, automatictechnology.com/au. If you can't find the right one for your model, our technicians carry the reference material for the EasyRoller and Dave ranges and can identify your unit and its settings during a service visit.",
    },
    {
      question: "What are the best brands of garage door openers in Australia, and does ATA rank among them?",
      answer:
        "ATA is a genuine contender — it's Australian-engineered, backed by 45-plus years of opener history and part of the B&D Group, one of the country's best-known door manufacturers. It sits alongside brands like Merlin, Chamberlain and B&D itself as a solidly built option, particularly for roller and commercial doors where its EasyRoller and Dave ranges are purpose-built.",
    },
    {
      question: "How long does an ATA garage door opener last in Perth?",
      answer:
        "Ten to fifteen years is typical for an EasyRoller if the roller door is serviced and running true in its guides. A Dave commercial operator often runs longer under lighter use, but heavy daily cycling in a commercial setting will shorten that — which is why we check the door's duty cycle, not just the motor, when something starts failing.",
    },
    {
      question: "Is ATA a reliable brand of garage door opener?",
      answer:
        "Yes — ATA designs and builds locally rather than badge-engineering an imported unit, and its EasyRoller and Dave ranges hold up well when sized correctly for the door. Most faults we see come from a curtain that has drifted out of its guides overworking the motor, rather than the opener itself being poorly made.",
    },
    {
      question: "How much does it cost to replace an ATA garage door opener in Perth?",
      answer:
        "A full replacement with a new Capital motor sized to your door is {{price:motor-replace}}, supplied and installed, covering the motor, remotes, wall control, safety sensors, programming and removal of the old unit. If the existing EasyRoller or Dave can be repaired instead, that's typically {{price:motor-repair}} — we tell you which applies before any work starts.",
    },
  ],
  relatedBrands: ["b-and-d", "merlin", "grifco", "boss"],
  relatedServices: [
    { label: "All garage door motor brands in Perth", href: "/garage-door-motor-brands-perth" },
    { label: "Garage door opener repair Perth", href: "/garage-door-opener-repair-perth" },
    { label: "Garage door remote replacement", href: "/garage-door-remote-replacement-perth" },
    { label: "Commercial roller doors Perth", href: "/commercial-roller-doors-perth" },
    { label: "Capital 1100N & 1500N motors", href: "/garage-door-motors-perth" },
    { label: "Motor replacement cost guide", href: "/garage-door-motor-replacement-cost-perth" },
  ],
  serviceAreas: ["Belmont", "Cannington", "Gosnells", "Maddington", "Huntingdale", "Thornlie", "Kalamunda", "Lathlain"],
  cta: {
    heading: "ATA Opener Playing Up? Get It Sorted Today",
    subtitle: "Tell us the model — EasyRoller or Dave — and what it's doing, and you'll get a same-day slot and a fixed price before we start.",
  },
};
