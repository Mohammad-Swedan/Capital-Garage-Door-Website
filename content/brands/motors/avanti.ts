import type { BrandPage } from "@/types/brand";

/**
 * /avanti-garage-door-motors-perth — "avanti garage door opener perth" (DataForSEO 2026-08-27;
 * docs/marketing/brand-research-2026-08/paa/avanti-garage-door-motors-perth.md). Avanti IS a
 * dealer brand (entities.ts dealer: true) — "authorised dealer" / "we supply, install, service
 * and repair" language is used deliberately, matching the entity flag. Avanti is a Philippines-
 * manufactured opener brand (avantigdo.com) sold in Australia via dealer networks, not big-box
 * retail — no door claims, per docs/marketing/brand-research-2026-08/entities/avanti.md (motor
 * only). Model names (SDO4, RDO1, RDO10C) are the garage-door-relevant lines from that file; the
 * gate-motor lines (D5-EVO, Vantage) are intentionally excluded as out of scope for this page.
 */
export const avantiGarageDoorMotorsPerth: BrandPage = {
  brand: "avanti",
  kind: "motor",
  slug: "avanti-garage-door-motors-perth",
  updatedAt: "2026-09-01",
  seo: {
    title: "Avanti Garage Door Openers Perth | Repairs & Install",
    description:
      "Perth's Avanti dealer: same-day opener repairs, remote coding, and SDO4 or RDO roller door openers supplied and installed. Call for a fixed quote.",
  },
  hero: {
    h1: "Avanti Garage Door Motors & Openers in Perth — Supply, Repairs & Remotes",
    subtitle:
      "Perth's local Avanti dealer: brand-new SDO4 and RDO openers supplied and installed, plus same-day repairs and remote coding for units already on the door.",
    pills: [
      { icon: "ShieldCheck", label: "Authorised Avanti dealer" },
      { icon: "Wrench", label: "Same-day repairs" },
      { icon: "Radio", label: "Remotes coded on the spot" },
      { icon: "MapPin", label: "All Perth suburbs" },
    ],
  },
  quickFacts: [
    { label: "Origin", value: "Philippines" },
    { label: "Known for", value: "SDO4, RDO1 & RDO10C openers" },
    { label: "Door types", value: "Sectional & roller" },
    { label: "What we do", value: "Supply, install, service & repair" },
  ],
  directAnswer:
    "Avanti garage door openers are supplied, installed, serviced and repaired across Perth by Capital Garage Doors, an authorised Avanti dealer. Whether you need a new SDO4 sectional or RDO roller door opener fitted, or an existing unit fixed, most call-outs are handled in one same-day visit. A full new-opener installation is {{price:motor-replace}} supplied and installed, remotes and programming included, and every job — new install or repair — carries a written quote and a workmanship warranty before work begins.",
  intro: {
    heading: "Avanti — Perth's Value Opener, Supplied and Serviced Locally",
    paragraphs: [
      "Avanti is a global opener manufacturer based in the Philippines, in business for more than three decades and supplying garage door openers into markets including Australia. It doesn't sell through big-box retail here — its SDO4 sectional and RDO1 and RDO10C roller door openers reach Perth garages through local dealer networks, and Capital Garage Doors is one of them. That means we supply and install brand-new Avanti units as well as servicing, repairing and replacing ones already fitted, whether we put them in originally or another installer did.",
      "Avanti tends to turn up as the value opener on project-home builds and investment properties across Perth's growth corridors, fitted new by a builder or landlord looking for a capable unit without a premium price tag. It's a genuine DC-motor manufacturer rather than a private-label badge, so the SDO4 and RDO models hold up reasonably well when installed and balanced correctly. The faults we see most often are ordinary opener wear — a remote that stops pairing, a safety sensor knocked out of alignment, or gears straining because the door's springs are no longer carrying their share of the weight.",
      "As an Avanti dealer, we can supply and fit a brand-new SDO4 or RDO opener on a sectional or roller door, complete with remotes, programming and a proper workmanship warranty. Just as often we're called to service or repair an Avanti a customer already owns, regardless of who installed it — checking travel limits, aligning safety beams and coding fresh remotes are the bulk of the work. When a unit has genuinely reached the end of its life, replacing it at {{price:motor-replace}} resets the warranty and usually includes a quieter, better-specified drive than the original.",
    ],
  },
  services: [
    {
      title: "Avanti opener repairs",
      description:
        "Board, sensor, remote and gear faults diagnosed on the day, with the common parts carried so most repairs finish in one visit.",
      icon: "Wrench",
      href: "/garage-door-opener-repair-perth",
    },
    {
      title: "Avanti remotes & programming",
      description:
        "Replacement remotes supplied and coded to your SDO4 or RDO opener, lost remotes wiped from memory, wall buttons paired.",
      icon: "Radio",
      href: "/garage-door-remote-replacement-perth",
    },
    {
      title: "Supply & install a new Avanti",
      description:
        "A brand-new SDO4 sectional or RDO roller door opener, supplied and fitted the same day with remotes, programming and a workmanship warranty.",
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
      name: "SDO4",
      type: "Sectional door opener",
      note: "Avanti's sectional-door unit, the model we fit and service most often on Perth sectional doors.",
    },
    {
      name: "RDO1",
      type: "Roller door opener",
      note: "Avanti's entry roller-door opener, sized for a standard single roller door.",
    },
    {
      name: "RDO10C",
      type: "Roller door opener",
      note: "A higher-output roller-door unit in the RDO range, suited to wider or heavier roller doors.",
    },
  ],
  faults: [
    { label: "Opener doesn't respond to remote or button", icon: "Power", problemSlug: "garage-door-motor-not-responding" },
    { label: "Remote stopped pairing or won't code", icon: "Radio", problemSlug: "garage-door-remote-not-working" },
    { label: "Door reverses before it fully closes", icon: "AlertTriangle", problemSlug: "garage-door-wont-close" },
    { label: "Door stops part-way through its travel", icon: "MoveVertical", problemSlug: "garage-door-stuck-halfway" },
    { label: "Grinding or straining drive", icon: "Volume2", problemSlug: "noisy-garage-door" },
  ],
  decision: {
    repairWhen: [
      "The opener is under about ten years old and the fault is a sensor, remote or gear issue.",
      "The motor still lifts the door smoothly once travel limits and safety beams are correctly set.",
      "You only need remotes coded, a wall button paired or a safety sensor realigned.",
      "A repair at {{price:motor-repair}} restores an Avanti unit that still has years of life in it.",
    ],
    replaceWhen: [
      "The drive board or motor itself has failed and a repair would only be a short-term fix.",
      "The opener has been repaired before and a second unrelated fault has appeared within a year or two.",
      "You want a brand-new unit with a workmanship warranty rather than patching an ageing opener.",
      "A new Avanti at {{price:motor-replace}} supplied and installed resets the warranty and includes fresh remotes.",
    ],
  },
  pricingPins: ["motor-repair", "motor-replace", "wifi", "remote", "service"],
  costIntro:
    "Avanti work is priced from the same guide list as every opener brand we touch: a repair covers diagnosis and the common parts, and a full supply-and-install at {{price:motor-replace}} includes the new SDO4 or RDO motor, remotes, programming and removal of the old unit. You get the figure in writing before any work starts.",
  costFactors: [
    "Whether the fault is a part (sensor, gear, remote) or the drive itself",
    "Door type and weight — a heavier double sectional needs a higher-rated motor",
    "Whether it's a brand-new supply-and-install or a repair on an existing unit",
    "Whether the door's springs and hardware need attention before a motor can be trusted",
  ],
  faqs: [
    {
      question: "How much does an Avanti garage door opener cost supplied and installed in Perth?",
      answer:
        "A brand-new Avanti SDO4 or RDO opener supplied and installed is {{price:motor-replace}}, covering the motor, remotes, wall control, safety sensors, programming and removal of anything it's replacing. If your existing Avanti just needs a repair, that's typically {{price:motor-repair}} — we quote both before starting any work.",
    },
    {
      question: "How do I reset an Avanti garage door opener?",
      answer:
        "The reset procedure varies slightly between the SDO4 and RDO models, so we'd rather talk you through it with the unit in front of you than risk steps that don't match your board. If a reset doesn't restore normal operation, that generally points to a genuine fault rather than a settings issue, and it's worth booking a same-day repair visit instead.",
    },
    {
      question: "Is Avanti a reliable brand of garage door opener?",
      answer:
        "Avanti is a genuine DC-motor manufacturer, not a private-label badge, and the SDO4 and RDO models hold up well when correctly installed and matched to the door's weight. Most of the faults we see trace back to installation shortcuts — an unbalanced door, a misaligned sensor — rather than the opener itself, which is why we check the whole setup, not just the fault reported.",
    },
    {
      question: "How do I program a replacement remote for my Avanti garage door opener?",
      answer:
        "We supply and code Avanti-compatible remotes to your SDO4 or RDO opener on the spot, and can wipe a lost remote from the unit's memory at the same time so it can no longer open your door. Wall buttons and keypads can be paired in the same visit.",
    },
    {
      question: "Are you an authorised Avanti dealer in Perth?",
      answer:
        "Yes — Capital Garage Doors is an authorised Avanti dealer, which means we supply and install brand-new SDO4 and RDO openers as well as servicing and repairing units already on a Perth door, regardless of who fitted them originally. You get genuine-compatible parts and a workmanship warranty on anything we install.",
    },
    {
      question: "What's the replacement remote for my Avanti garage door opener, and can I buy just the remote?",
      answer:
        "Yes — we supply compatible replacement remotes for SDO4 and RDO openers and code them to your unit during a visit, without needing to book a full service. Bring or describe the model printed on your opener's label and we'll match the right remote before we arrive.",
    },
    {
      question: "Do you repair Avanti openers you didn't originally install?",
      answer:
        "Yes — we service and repair Avanti openers across Perth regardless of who supplied or installed them originally, including units fitted by another dealer or a builder. We'll diagnose the fault, quote a fixed price and tell you honestly whether a repair or a full replacement is the better value.",
    },
  ],
  relatedBrands: ["superlift", "boss", "jaytech", "b-and-d"],
  relatedServices: [
    { label: "All garage door motor brands in Perth", href: "/garage-door-motor-brands-perth" },
    { label: "Garage door opener repair Perth", href: "/garage-door-opener-repair-perth" },
    { label: "Garage door remote replacement", href: "/garage-door-remote-replacement-perth" },
    { label: "Capital 1100N & 1500N motors", href: "/garage-door-motors-perth" },
    { label: "Motor replacement cost guide", href: "/garage-door-motor-replacement-cost-perth" },
  ],
  serviceAreas: ["Southern River", "Harrisdale", "Piara Waters", "Forrestdale", "Gosnells", "Cannington", "Lathlain", "Riverton"],
  productImage: {
    src: "https://jadara-hub.b-cdn.net/capital-garage-door/brands/avanti-sdo4-opener.webp",
    width: 612,
    height: 408,
    alt: "Avanti SDO4 sectional garage door opener — manufacturer product image",
    caption: "Avanti SDO4 sectional opener. Image: Avanti.",
    source:
      "https://avantigdo.com/public-catalog/sdo4-garage-door-opener/ — official manufacturer product image — nominative use (authorised dealer)",
  },
  cta: {
    heading: "Need an Avanti Opener Supplied, Fitted or Fixed?",
    subtitle: "Tell us whether it's a new install or an existing opener playing up — you'll get a same-day slot and a fixed price before we start.",
  },
};
