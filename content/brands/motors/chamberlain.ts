import type { BrandPage } from "@/types/brand";

/**
 * /chamberlain-garage-door-motors-perth — Chamberlain is Chamberlain Group's DIY/self-install
 * storefront (distinct from LiftMaster, the same group's professional range — the two must never
 * be conflated). Model names verified against
 * docs/marketing/brand-research-2026-08/entities/chamberlain.md. Angle: the self-install kit
 * bought online as a boxed kit, and the set-up/programming issues that follow a DIY fit — a
 * different emphasis to the Merlin page. FAQs mirror the Perth PAA set
 * (docs/marketing/brand-research-2026-08/paa/chamberlain-garage-door-motors-perth.md). Chamberlain
 * does not carry the special retail-network wording flag some other brands do (entities.ts) — keep
 * this file free of that language (see brief rule 16).
 */
export const chamberlainGarageDoorMotorsPerth: BrandPage = {
  brand: "chamberlain",
  kind: "motor",
  slug: "chamberlain-garage-door-motors-perth",
  updatedAt: "2026-09-01",
  seo: {
    title: "Chamberlain Garage Door Openers Perth | Repairs",
    description:
      "Chamberlain RollerLift or SectionalLift opener not working right? Perth-wide same-day repairs, myQ setup and remote coding, or a professional replacement.",
  },
  hero: {
    h1: "Chamberlain Garage Door Motors & Openers in Perth — Repairs, Setup & Replacement",
    subtitle:
      "The DIY brand behind thousands of self-installed RollerLift and SectionalLift kits across Perth — we fix the faults, finish the setup, and replace the ones that won't be saved.",
    pills: [
      { icon: "Wrench", label: "Same-day Chamberlain repairs" },
      { icon: "Wifi", label: "myQ app setup & pairing" },
      { icon: "Radio", label: "Remotes coded on the spot" },
      { icon: "MapPin", label: "All Perth suburbs" },
    ],
  },
  quickFacts: [
    { label: "Origin", value: "USA" },
    { label: "Owned by", value: "Chamberlain Group" },
    { label: "Known for", value: "RollerLift & SectionalLift DIY openers" },
    { label: "Smart control", value: "myQ smartphone app" },
    { label: "What we do", value: "Service, repair, program & replace" },
  ],
  directAnswer:
    "Chamberlain garage door motors are repaired, correctly set up and replaced across Perth by Capital Garage Doors. Chamberlain sells RollerLift and SectionalLift openers as self-install kits, so many of our call-outs are travel limits or safety sensors that were never quite right, not a faulty motor — sorted in one same-day visit. When a unit genuinely needs replacing, a professionally fitted motor is {{price:motor-replace}}, remotes and myQ programming included.",
  intro: {
    heading: "Perth's Most Common Self-Install Opener",
    paragraphs: [
      "Chamberlain is the do-it-yourself brand of the Chamberlain Group, the same company behind the professional-grade LiftMaster range — but sold as a self-install boxed kit through its own online storefront rather than fitted by an installer network. That makes it one of the most common openers Perth homeowners have installed themselves, usually the RollerLift on a roller door or the SectionalLift on a sectional one, both running the same myQ app as the rest of the Chamberlain Group family.",
      "A well-set-up Chamberlain kit is a perfectly capable opener, but a self-install skips a few steps a technician does automatically: correctly setting travel and force limits, aligning the safety sensors so they can't be tripped by shadows, and torquing the header bracket into solid framing rather than plasterboard. Most of our Chamberlain call-outs trace back to one of those three, showing up as a door that reverses for no reason, stops short of the floor, or a myQ app that won't stay connected to home WiFi.",
      "Where the motor itself has failed — a stripped drive chain, a dead logic board, gears worn from years of dragging an unbalanced door — we replace it with a professionally installed unit and set it up properly the first time, including a workmanship warranty a self-install kit doesn't come with. Where the kit is basically sound, we correct the setup and hand it back working the way it should have from day one.",
    ],
  },
  services: [
    {
      title: "Chamberlain opener repairs",
      description:
        "Travel limits, safety sensors, drive faults and worn gears diagnosed on the day, common parts carried so most repairs finish in one visit.",
      icon: "Wrench",
      href: "/garage-door-opener-repair-perth",
    },
    {
      title: "myQ app & remote setup",
      description:
        "Correct pairing of the myQ app to your home WiFi, new remotes coded to your RollerLift or SectionalLift, wall buttons and keypads fitted.",
      icon: "Radio",
      href: "/garage-door-remote-replacement-perth",
    },
    {
      title: "Replace a failed Chamberlain",
      description:
        "When the kit itself has failed, a new belt-drive Capital motor with app control, professionally fitted the same day with a five-year warranty.",
      icon: "Cpu",
      href: "/garage-door-motors-perth",
    },
    {
      title: "Annual opener service",
      description:
        "Travel and force limits checked against the door's true weight, safety reverse tested, and the drive inspected before it fails outright.",
      icon: "ShieldCheck",
      href: "/garage-door-maintenance-perth",
    },
  ],
  models: [
    {
      name: "RollerLift (CR655MYQ)",
      type: "Roller door opener",
      tech: "myQ smart control",
      note: "Chamberlain's single-motor roller-door kit, the self-install unit we see most on Perth roller doors.",
    },
    {
      name: "RollerLift Plus (CR855MYQ)",
      type: "Roller door opener",
      tech: "myQ smart control",
      note: "The higher-output RollerLift, sized for wider or double roller doors.",
    },
    {
      name: "SectionalLift (CS65MYQ)",
      type: "Sectional door opener",
      tech: "myQ smart control",
      note: "Chamberlain's entry sectional-door opener kit, built for a single garage.",
    },
    {
      name: "SectionalLift Plus (CS105MYQ)",
      type: "Sectional door opener",
      tech: "myQ smart control",
      note: "The Plus-tier SectionalLift, rated for heavier double sectional doors.",
    },
  ],
  faults: [
    { label: "Won't stay paired to myQ or home WiFi", icon: "Radio", problemSlug: "garage-door-remote-not-working" },
    { label: "Safety sensors misaligned after a DIY install", icon: "AlertTriangle", problemSlug: "garage-door-wont-close" },
    { label: "Travel limits wrong — door stops short", icon: "MoveVertical", problemSlug: "garage-door-stuck-halfway" },
    { label: "Motor doesn't respond to wall button or remote", icon: "Power", problemSlug: "garage-door-motor-not-responding" },
    { label: "Grinding or straining self-install motor", icon: "Volume2", problemSlug: "noisy-garage-door" },
  ],
  decision: {
    repairWhen: [
      "The kit is under about ten years old and the fault is a sensor, a limit setting or a remote pairing issue.",
      "The motor still lifts the door smoothly once travel limits and safety beams are corrected, not a genuine drive fault.",
      "You only need the myQ app reconnected, a new remote coded or a wall button paired.",
      "A repair at {{price:motor-repair}} fixes a DIY set-up issue without buying a new unit.",
    ],
    replaceWhen: [
      "The original RollerLift or SectionalLift drive chain has stripped or the logic board has failed.",
      "A previous self-install has left the motor overworking an unbalanced door and the gears are visibly worn.",
      "You want a professionally installed unit with a proper workmanship warranty, not another self-install kit.",
      "A new motor at {{price:motor-replace}} includes correct setup, remotes and myQ programming in one visit.",
    ],
  },
  pricingPins: ["motor-repair", "motor-replace", "wifi", "remote", "service"],
  costIntro:
    "Chamberlain work is priced from the same guide list as every opener brand we touch: a repair covers diagnosis, correct set-up and the common parts, and a full replacement at {{price:motor-replace}} includes the new motor, remotes, myQ programming and removal of the old unit. You get the figure in writing before any work starts.",
  costFactors: [
    "Whether the issue is a set-up fix (limits, sensors, WiFi) or a genuine part failure",
    "Door type and weight — RollerLift and SectionalLift kits are rated differently",
    "Extras like myQ app control, battery backup or additional remotes",
    "Whether a self-install has left the door's springs or hardware needing attention too",
  ],
  faqs: [
    {
      question: "How much does a new Chamberlain garage door opener cost to have fitted in Perth?",
      answer:
        "A professionally fitted Chamberlain-equivalent replacement is {{price:motor-replace}}, covering the motor, remotes, wall control, safety sensors, myQ programming and correct installation. If your existing RollerLift or SectionalLift just needs a set-up fix or a part, a repair is typically {{price:motor-repair}} — we quote both before starting.",
    },
    {
      question: "What is the life expectancy of a Chamberlain garage door opener?",
      answer:
        "Ten to fifteen years is realistic for a Chamberlain kit in Perth, provided it was set up correctly and the door is serviced. A unit installed with travel limits or sensors slightly out wears its gears faster from the day it's fitted, which is why we check the whole setup on every repair, not just the fault that prompted the call.",
    },
    {
      question: "Is Chamberlain a good quality garage door opener?",
      answer:
        "Yes — Chamberlain is the DIY brand of Chamberlain Group, the world's largest opener manufacturer, and the RollerLift and SectionalLift kits are solidly built for the price. Most of the problems we see trace back to the self-install process rather than the hardware itself, which is a fair trade-off if you're comfortable fitting it yourself and having a technician tidy up the setup afterwards.",
    },
    {
      question: "What are the best brands of garage door opener for a Perth home?",
      answer:
        "Chamberlain suits homeowners who want a capable myQ-connected opener at a DIY price point; Merlin, B&D and LiftMaster (Chamberlain Group's professional range) suit those who'd rather have it supplied and installed from the start. All perform well in Perth when correctly rated for the door and serviced yearly — the badge matters less than the setup.",
    },
    {
      question: "Can I get my self-installed Chamberlain opener serviced or repaired?",
      answer:
        "Yes — we service and repair Chamberlain kits regardless of who installed them, including checking the travel limits, safety sensors and WiFi pairing that a DIY fit most often gets slightly wrong. If the drive itself has failed, we'll tell you honestly whether a repair or a professional replacement is the better value.",
    },
    {
      question: "Do you service Chamberlain openers across all of Perth?",
      answer:
        "Yes — technicians cover the whole Perth metro area, from Scarborough and Padbury in the north to Rockingham and Success in the south, with same-day slots on most days. Call with your suburb and the model printed on the RollerLift or SectionalLift label and we'll give you an arrival window.",
    },
  ],
  relatedBrands: ["merlin", "liftmaster", "b-and-d", "boss"],
  relatedServices: [
    { label: "All garage door motor brands in Perth", href: "/garage-door-motor-brands-perth" },
    { label: "Garage door opener repair Perth", href: "/garage-door-opener-repair-perth" },
    { label: "Garage door remote replacement", href: "/garage-door-remote-replacement-perth" },
    { label: "Capital 1100N & 1500N motors", href: "/garage-door-motors-perth" },
    { label: "Motor replacement cost guide", href: "/garage-door-motor-replacement-cost-perth" },
  ],
  serviceAreas: ["Scarborough", "Rockingham", "Success", "Atwell", "Padbury", "Bayswater", "Willetton", "Belmont"],
  productImage: {
    src: "https://jadara-hub.b-cdn.net/capital-garage-door/brands/chamberlain-sectionallift-opener.webp",
    width: 986,
    height: 740,
    alt: "Chamberlain SectionalLift garage door opener — manufacturer product image",
    caption: "Chamberlain SectionalLift opener with myQ. Image: Chamberlain.",
    source:
      "https://www.chamberlaindiy.com.au/garage-door-openers/ — official manufacturer product image — nominative use",
  },
  cta: {
    heading: "Chamberlain Not Behaving? Get It Sorted Today",
    subtitle: "Tell us the model on the RollerLift or SectionalLift label and what it's doing — you'll get a same-day slot and a fixed price before we start.",
  },
};
