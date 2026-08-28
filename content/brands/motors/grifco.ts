import type { BrandPage } from "@/types/brand";

/**
 * /grifco-garage-door-motors-perth — Grifco is a commercial/industrial door-automation brand
 * (per docs/marketing/brand-research-2026-08/entities/grifco.md: warehouses, roller shutters,
 * fire shutters, sectional doors — not a residential opener range), so this page is written for
 * commercial owners/managers rather than homeowners. Australian-made claim (Somersby, NSW) IS
 * stated on-site and is used; the research file's "Chamberlain Group" ownership note is explicitly
 * an inference from a warranty-registration domain, not a direct-quote citation, so no ownership
 * claim appears here (entities.ts also carries no `ownership` field for this entity). Not a supply-network brand.
 * pricingPins add "commercial-roller" per controller ruling; `services` are the 4 specified hrefs
 * (commercial-roller-doors, industrial-roller-doors, opener-repair, maintenance) rather than the
 * standard residential 4. No warranty *term* is stated anywhere (the research found none), so the
 * warranty FAQ answers honestly without inventing a figure. FAQs mirror the Perth PAA set
 * (docs/marketing/brand-research-2026-08/paa/grifco-garage-door-motors-perth.md).
 */
export const grifcoGarageDoorMotorsPerth: BrandPage = {
  brand: "grifco",
  kind: "motor",
  slug: "grifco-garage-door-motors-perth",
  updatedAt: "2026-08-28",
  seo: {
    title: "Grifco Commercial Door Motors Perth | Repairs & Service",
    description:
      "Grifco commercial roller shutter or door motor down? Perth-wide same-day repairs and servicing for warehouses, strata and workshops. Call for a fixed quote.",
  },
  hero: {
    h1: "Grifco Commercial Door & Shutter Motors in Perth — Repairs, Service & Replacement",
    subtitle:
      "Australian-made commercial door automation, kept running across Perth's warehouses, strata complexes and workshops — faults diagnosed on site and downtime kept to a minimum.",
    pills: [
      { icon: "Wrench", label: "Same-day Grifco repairs" },
      { icon: "Building2", label: "Warehouses & strata specialists" },
      { icon: "Wifi", label: "myQ connectivity supported" },
      { icon: "MapPin", label: "All Perth commercial sites" },
    ],
  },
  quickFacts: [
    { label: "Origin", value: "Australia (Somersby, NSW)" },
    { label: "Known for", value: "E-Drive, M-Drive & Fire Shutter Operator ranges" },
    { label: "Smart control", value: "myQ app on selected models" },
    { label: "Segment", value: "Commercial & industrial roller shutters, doors & fire shutters" },
    { label: "What we do", value: "Service, repair & replace" },
  ],
  directAnswer:
    "Grifco commercial door and shutter motors are repaired, serviced and replaced across Perth by Capital Garage Doors, covering the warehouses, strata complexes and workshops where the brand is most often fitted. Most faults on the E-Drive, M-Drive and other Drive-series operators — a motor that won't respond, a control-board fault, a fire shutter that won't reset — are diagnosed on site. When a unit has genuinely reached the end of its life, a full commercial replacement is quoted against {{price:commercial-roller}}, supplied and installed.",
  intro: {
    heading: "Grifco: Australian-Made Commercial Door Automation",
    paragraphs: [
      "Grifco is an Australian-manufactured brand, built and tested at its Somersby, NSW facility, and it sits squarely in the commercial and industrial end of door automation rather than the residential market — warehouses, strata complexes, workshops and light-industrial units are where we see it most across Perth. The company positions itself around more than a century of heritage in large-scale door and shutter automation, and its nine-strong Drive-series range (E-Drive through to LG-Drive) plus a dedicated Fire Shutter Operator reflects that focus: purpose-built operators for roller shutters, roller doors and fire-rated shutters rather than a single one-size-fits-all opener.",
      "Because these motors run harder use cycles than a suburban garage — some open and close dozens of times a day on a warehouse dock — the faults we see are more often wear-related than dramatic: a control board that's dropped out under load, a chain or drive coupling that's stretched, a fire shutter operator that won't reset after a test, or limit switches that have drifted on a heavily used roller shutter. Selected Grifco units carry myQ connectivity, so remote-monitoring faults occasionally show up too, usually a WiFi pairing or firmware issue rather than the motor itself.",
      "Downtime on a commercial door has a different cost to a home garage — a stuck roller shutter can stop deliveries or leave a site insecure overnight — so we prioritise commercial and strata call-outs and carry the parts these Drive-series operators need most. Where a motor is beyond an economical repair, we replace it with a correctly rated commercial unit sized to the door and duty cycle, fitted with a workmanship warranty. We also service Grifco installations regardless of who originally fitted them, including scheduled maintenance for strata and multi-tenant sites.",
    ],
  },
  services: [
    {
      title: "Grifco motor & control-board repairs",
      description: "Motor, control-board and limit-switch faults on E-Drive, M-Drive and other Grifco operators diagnosed and fixed on the day.",
      icon: "Cpu",
      href: "/garage-door-opener-repair-perth",
    },
    {
      title: "Commercial roller door service",
      description: "Grifco-equipped roller doors on warehouses, strata and light-industrial sites repaired, serviced and replaced with minimal disruption to the business.",
      icon: "Building2",
      href: "/commercial-roller-doors-perth",
    },
    {
      title: "Industrial roller shutter motors",
      description: "Heavy-duty Drive-series operators for industrial roller shutters diagnosed, repaired and replaced by technicians who work commercial sites daily.",
      icon: "Wrench",
      href: "/industrial-roller-doors-perth",
    },
    {
      title: "Scheduled commercial maintenance",
      description: "Regular servicing for warehouse, strata and workshop doors — limits, safety reverse and drive condition checked before a fault causes downtime.",
      icon: "ShieldCheck",
      href: "/garage-door-maintenance-perth",
    },
  ],
  models: [
    { name: "E-Drive", type: "Commercial roller door operator", note: "Grifco's most common Drive-series unit, fitted to standard commercial roller doors." },
    { name: "M-Drive", type: "Commercial roller shutter operator", note: "A heavier-duty operator for larger or higher-cycle roller shutters." },
    { name: "LG-Drive", type: "Large commercial roller operator", note: "The higher end of the Drive range, rated for bigger industrial doors." },
    { name: "Fire Shutter Operator", type: "Fire-rated shutter operator", note: "A dedicated operator for fire-rated roller shutters, with its own reset and testing requirements." },
  ],
  faults: [
    { label: "Motor won't respond under load", icon: "Power", problemSlug: "garage-door-motor-not-responding" },
    { label: "Roller shutter stops mid-travel", icon: "MoveVertical", problemSlug: "garage-door-stuck-halfway" },
    { label: "Control board or limit switches drifting", icon: "AlertTriangle", problemSlug: "garage-door-off-track" },
    { label: "Chain or coupling stretched, grinding drive", icon: "Volume2", problemSlug: "noisy-garage-door" },
    { label: "myQ app won't stay connected", icon: "Radio", problemSlug: "garage-door-remote-not-working" },
  ],
  decision: {
    repairWhen: [
      "The fault is a control-board setting, a limit switch or a remote/myQ pairing rather than the drive itself.",
      "The motor still lifts the shutter smoothly once limits and drive tension are corrected.",
      "You only need the fire shutter operator's reset sequence run or its safety edge tested.",
      "A repair at {{price:motor-repair}} restores an operator with years of duty cycles left in it.",
    ],
    replaceWhen: [
      "The operator has failed structurally — a stripped drive coupling or a burnt-out motor winding.",
      "The current unit is undersized for the door's weight or the site's daily cycle count.",
      "A fire-rated shutter's operator can no longer be certified against current compliance requirements.",
      "A correctly rated commercial replacement, quoted against {{price:commercial-roller}}, costs less over time than repeated repairs.",
    ],
  },
  pricingPins: ["motor-repair", "motor-replace", "commercial-roller", "service"],
  costIntro:
    "Commercial Grifco work is quoted against the same guide list as every job we price: a repair covers diagnosis and the common parts, a full replacement is scoped against our commercial roller door pricing at {{price:commercial-roller}}, and routine site servicing follows the standard {{price:service}} maintenance visit. Every commercial quote accounts for the door's size, duty cycle and any fire-rating requirement before a figure is confirmed in writing.",
  costFactors: [
    "Door size, weight and daily duty cycle — a high-traffic warehouse door is rated differently to a light-use workshop",
    "Whether the shutter is fire-rated, which brings its own compliance and testing requirements",
    "Whether the fault is a part (control board, limit switch, remote) or the drive mechanism itself",
    "Site access and after-hours requirements for strata or multi-tenant commercial properties",
  ],
  faqs: [
    {
      question: "How much does it cost to replace a Grifco commercial roller door motor in Perth?",
      answer:
        "Commercial replacements are quoted individually against door size, duty cycle and any fire-rating requirement, starting from our commercial roller door guide price at {{price:commercial-roller}}. A straightforward repair is typically {{price:motor-repair}} — we inspect the operator on site and give you a written figure for both options before any work starts.",
    },
    {
      question: "What is the warranty period on a Grifco roller door motor?",
      answer:
        "Grifco doesn't publish a single fixed warranty figure that applies to every operator in the range, so we check the specific unit and any remaining manufacturer cover when we quote. Every replacement or repair we carry out is backed by our own workmanship warranty regardless, so you're covered on the fit even where the manufacturer term has lapsed.",
    },
    {
      question: "How do I reset a Grifco roller door after a fault or a fire test?",
      answer:
        "The reset sequence depends on the specific Drive-series unit and whether it's a fire shutter operator, which has its own testing and reset requirements for compliance. Rather than guess at a control-board sequence on a commercial door, call us with the model printed on the operator and we'll talk you through it or attend if it needs a technician.",
    },
    {
      question: "How long should a Grifco commercial door motor last?",
      answer:
        "Commercial operators generally run longer service lives when they're serviced regularly and rated correctly for the door's size and daily cycle count — many of the Drive-series units we service are well over a decade old. An undersized or unserviced operator on a high-traffic door wears out its drive far sooner, which is why we check the whole installation, not just the fault that prompted the call.",
    },
    {
      question: "Can you supply spare parts for an older Grifco operator?",
      answer:
        "Yes — as commercial technicians we can generally source control boards, limit switches, drive components and other spare parts for Grifco's Drive-series and Fire Shutter Operator ranges, including older units. Call with the model on the operator's data plate and we'll confirm what's available before booking a site visit.",
    },
    {
      question: "Do you service Grifco fire shutter operators, including strata and multi-tenant sites?",
      answer:
        "Yes — we service, repair and reset Grifco's Fire Shutter Operator range, including the testing and reset sequences fire-rated shutters require for compliance, and we regularly work strata complexes and multi-tenant warehouses, coordinating access and after-hours call-outs directly with a strata manager or facilities contact.",
    },
    {
      question: "Is Grifco a good brand for a commercial or industrial door?",
      answer:
        "Grifco is Australian-manufactured and built specifically for commercial and industrial duty cycles rather than adapted from a residential range, which shows in how the Drive-series operators hold up on high-traffic warehouse and workshop doors. Reliability still comes down to correct sizing and regular servicing — an operator rated for the wrong duty cycle will fail early regardless of brand.",
    },
  ],
  relatedBrands: ["ata", "b-and-d", "steel-line", "boss"],
  relatedServices: [
    { label: "All garage door motor brands in Perth", href: "/garage-door-motor-brands-perth" },
    { label: "Commercial roller doors Perth", href: "/commercial-roller-doors-perth" },
    { label: "Commercial garage doors Perth", href: "/commercial-garage-doors-perth" },
    { label: "Garage door opener repair Perth", href: "/garage-door-opener-repair-perth" },
    { label: "Garage door maintenance Perth", href: "/garage-door-maintenance-perth" },
  ],
  serviceAreas: ["Malaga", "Osborne Park", "Canning Vale", "Bayswater", "Cockburn Central", "Maddington", "Midland", "Belmont"],
  cta: {
    heading: "Grifco Operator Down? Get It Sorted Fast",
    subtitle: "Tell us the model on the operator's data plate and what your site's doing without it — you'll get a priority slot and a fixed quote before we start.",
  },
};
