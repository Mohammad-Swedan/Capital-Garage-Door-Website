import type { ServicePage } from "@/types/service-page";

/**
 * /garage-door-lock-repair-perth — roller and sectional door locks, lock arms and handles.
 *
 * Why this page exists (2026-11-01 research, docs/seo/serp-pulls-2026-11-01.md):
 *  - Keyword Planner (Perth): "roller door lock" 90/mo, "garage door lock replacement" 10/mo;
 *    Search Console shows "garage door lock repair perth" (21 impressions @ 35, home page) and
 *    a lock/parts cluster of 395 impressions with no page to land on.
 *  - The sister site's lock product page earns about 23 clicks a quarter; Capital sells the
 *    fitted job, not the part, so this is a service page pinned to the catalog's
 *    "Roller door lock + arms" row.
 *  - Supporting page by design (the plan's small-page set); it also catches "garage door
 *    handle", "roller door lock stuck/jammed" and "lost garage door key" long tail.
 *
 * No literal price in the prose: the live CMS page pins "Roller door lock + arms" and
 * "Hinges & rollers / wheels" (the attendance-fee row that covers a sectional door's
 * handle/lock hardware); the costGuidance rows below are the CMS_SERVICE_PAGES=off fallback.
 */
export const garageDoorLockRepairPerth: ServicePage = {
  serviceName: "Garage Door Lock Repair Perth",
  slug: "garage-door-lock-repair-perth",
  pageType: "service",

  hero: {
    h1: "Garage Door Lock Repair & Replacement Perth",
    subtitle:
      "Jammed, seized or broken roller door locks, bent lock arms and sectional door handles replaced across Perth, with new keys cut to the lock and the door tested closed and secure.",
    badges: [
      { icon: "Lock", label: "Roller & Sectional Locks" },
      { icon: "Clock3", label: "Same-Day Visits" },
      { icon: "ShieldCheck", label: "Door Secured Before We Leave" },
      { icon: "MapPin", label: "All Perth Suburbs" },
    ],
    image:
      "https://jadara-hub.b-cdn.net/capital-garage-door/gallery/garage-door-cable-track-repair-perth.webp",
    imageAlt: "Technician working on the hardware of a sectional garage door in Perth",
    floatingCardLabel: "Keys Supplied",
  },

  directAnswer:
    "Capital Garage Doors repairs and replaces garage door locks across Perth. On a roller door that means the centre lock and the two lock arms that slide into the guides; on a sectional or tilt door it is the handle, the latch and the inside slide bolt. We carry the common lock assemblies and arms on the van, so a seized or broken lock is usually replaced on the first visit, with new keys supplied and the door tested to close and lock properly before we leave.",

  intro: {
    heading: "Why Garage Door Locks Fail, and What We Fit Instead",
    paragraphs: [
      "A roller door lock lives a hard life. It sits at the bottom of a steel curtain that is slammed, rained on and wound up and down thousands of times, and its two spring-loaded arms wear a groove in the guides every time the door closes. Eventually the barrel seizes, a key snaps off inside it, an arm bends so the door will not latch, or the whole lock pulls out of the curtain. Sectional doors fail differently: the outside handle strips, the latch cable stretches, or the inside slide bolt is left engaged and the motor tears the latch out.",
      "We replace the lock as an assembly rather than trying to rebuild a corroded barrel, because a repaired lock on a coastal door rarely lasts a summer. The new lock is fitted through the curtain or panel with fresh fixings, the arms are set so they engage the guides cleanly without binding, and we cut and supply keys for it. If the lock failed because the door itself is out of balance or the curtain is sitting crooked in the guides, we correct that first, or the new lock will jam the same way.",
      "A door that cannot be locked is a security problem, so lock jobs are booked as same-day visits where we can. If the door is a motorised roller or sectional door, we also check that the manual lock is not fighting the motor: a door that is locked and then driven by the opener strips the lock, the latch or the motor's gear, and that is the most common reason we see a lock job become a motor job.",
    ],
  },

  problems: [
    { label: "Roller door lock seized or key snapped", icon: "Lock" },
    { label: "Lock arms bent — door won't latch", icon: "AlertTriangle" },
    { label: "Lock pulled out of the curtain", icon: "XCircle" },
    { label: "Sectional door handle or latch broken", icon: "Settings" },
    { label: "Lost keys — lock needs replacing", icon: "Search" },
    { label: "Door locked while the motor ran", icon: "Cpu" },
  ],

  includedItems: [
    "Roller door centre lock and lock arms replaced as an assembly",
    "Sectional and tilt door handles, latches and slide bolts replaced",
    "New keys cut and supplied with the lock",
    "Guides checked and cleared so the arms engage without binding",
    "Door balance and curtain alignment corrected if they caused the jam",
    "Motor and manual lock checked so they cannot fight each other",
    "Same-day visits for doors that cannot be secured",
    "A fixed quote agreed before any work starts",
  ],

  processSteps: [
    {
      title: "Tell us the door type",
      description:
        "Roller, sectional or tilt, and a photo of the lock or handle, so we bring the matching assembly and arms.",
      icon: "Camera",
    },
    {
      title: "Open the door safely",
      description:
        "A seized lock with the door shut is the usual call. We release it without damaging the curtain or the panels.",
      icon: "ShieldCheck",
    },
    {
      title: "Fit the new lock",
      description:
        "The old assembly comes out, the new lock and arms go in with fresh fixings, and the arms are set to the guides.",
      icon: "Wrench",
    },
    {
      title: "Cut and test the keys",
      description:
        "Keys are cut to the new lock and tested from outside and inside, with the door closed and under its own weight.",
      icon: "Lock",
    },
    {
      title: "Check what caused it",
      description:
        "Worn guides, a crooked curtain or a motor fighting the lock are fixed or quoted on the spot so the new lock lasts.",
      icon: "Search",
    },
  ],

  // Mirrors pricing-data.ts — the live CMS page pins the same catalog rows.
  costGuidance: {
    intro:
      "Straight from our price list. A roller door lock is replaced as a complete assembly with its arms and keys; a sectional door's handle or latch is hardware fitted under one attendance fee. As a guide:",
    rows: [
      {
        label: "Roller door lock and lock arms",
        price: "$380–$440",
        note: "Complete assembly fitted, keys supplied, arms set to the guides",
      },
      {
        label: "Sectional door handle, latch or slide bolt",
        price: "$140 + parts",
        note: "One attendance fee plus the hardware fitted on the day",
      },
    ],
  },

  whyChoose: [
    {
      title: "Lock on the van",
      description:
        "We carry the common roller door lock assemblies and arms, so most lock jobs are finished in one visit.",
      icon: "Truck",
    },
    {
      title: "Keys included",
      description: "The new lock comes with its keys cut and tested, not a trip to a locksmith afterwards.",
      icon: "Lock",
    },
    {
      title: "Cause fixed too",
      description:
        "Worn guides, a crooked curtain or a motor fighting the lock are sorted so the new lock does not seize again.",
      icon: "Search",
    },
    {
      title: "Same-day where it matters",
      description: "A door that cannot be locked is booked as a priority across Perth.",
      icon: "Clock3",
    },
    {
      title: "All door types",
      description: "Roller, sectional and tilt doors, manual and motorised, for homes and small business premises.",
      icon: "DoorOpen",
    },
    {
      title: "Price agreed first",
      description: "The lock is a listed price; anything extra is quoted before we start.",
      icon: "FileText",
    },
  ],

  relatedServices: [
    {
      name: "Roller Door Repairs Perth",
      href: "/roller-door-repairs-perth",
      description: "Jammed curtains, springs, guides, pelmets and motors on roller doors.",
      icon: "Settings",
    },
    {
      name: "Garage Door Repairs Perth",
      href: "/garage-door-repairs-perth",
      description: "Springs, cables, motors, tracks and panels — the full repair service.",
      icon: "Wrench",
    },
    {
      name: "Garage Door Repair Cost Perth",
      href: "/garage-door-repair-cost-perth",
      description: "Every repair on our price list, locks and hardware included.",
      icon: "FileText",
    },
    {
      name: "Garage Door Opener Repair Perth",
      href: "/garage-door-opener-repair-perth",
      description: "When a locked door has stripped the motor's gear or latch.",
      icon: "Cpu",
    },
    {
      name: "Garage Door Won't Open?",
      href: "/problems/garage-door-wont-open",
      description: "How to tell a seized lock from a spring, cable or motor fault.",
      icon: "HelpCircle",
    },
    {
      name: "Garage Door Servicing Perth",
      href: "/garage-door-maintenance-perth",
      description: "An annual service lubricates the lock and guides before they seize.",
      icon: "ShieldCheck",
    },
  ],

  serviceAreas: [
    "Morley",
    "Midland",
    "Joondalup",
    "Scarborough",
    "Canning Vale",
    "Thornlie",
    "Fremantle",
    "Cockburn Central",
    "Rockingham",
    "Mandurah",
  ],

  // Real Google reviews (the CMS page pins the same reviews by customer name).
  reviews: [
    {
      name: "Janelle S.",
      rating: 5,
      text: "Musab was extremely efficient, professional, organised and a nice bloke. Would highly recommend his service and will be using him again.",
      service: "Roller Door Repair",
    },
    {
      name: "Chantelle N.",
      rating: 5,
      text: "Quick, efficient and friendly service. Really happy with Mussab's professional work — knew exactly what he needed to do.",
      service: "Garage Door Repair",
    },
  ],

  faqs: [
    {
      question: "How much does it cost to replace a roller door lock in Perth?",
      answer:
        "A roller door lock is priced as a complete assembly on our price list, and the guide-price table on this page shows the current figure. It covers the new centre lock, both lock arms, the fitting through the curtain and a set of keys. If the guides are worn or the curtain is sitting crooked, which is usually why the old lock seized, we tell you before we start and quote any extra work on the spot.",
    },
    {
      question: "My roller door lock is stuck and the door won't open. What should I do?",
      answer:
        "Do not force the door or lever the arms with a screwdriver: a bent arm wedges harder into the guide and can tear the lock out of the curtain. Try the key gently in both directions while pushing the door down slightly to take the weight off the arms. If it still will not release, call us. We free seized locks without damaging the curtain, and on a same-day visit for a door that cannot be opened.",
    },
    {
      question: "Can you replace a lock if I've lost the keys?",
      answer:
        "Yes. For a roller door we fit a new lock assembly and supply new keys, which is quicker and cheaper than having the old barrel re-keyed on a corroded lock. For a sectional or tilt door with a keyed handle, we replace the handle and latch. If the door is motorised, you may not need a key at all day to day, and we can show you how the manual release works for power cuts.",
    },
    {
      question: "Why does my roller door lock keep seizing?",
      answer:
        "Salt air and dust in the barrel are the usual causes on Perth doors, especially near the coast, and a lock that is never lubricated will seize within a few years. The other cause is misalignment: if the curtain sits crooked or the guides are worn, the arms bind every time the door closes and the lock wears out early. A new lock fixes the first problem; we correct the alignment to fix the second.",
    },
    {
      question: "Do I need a lock if my garage door has a motor?",
      answer:
        "A motorised door is held closed by the motor's gearbox, so the manual lock is a backup for power cuts and holidays rather than everyday security. The important thing is never to run the motor while the manual lock is engaged: that strips the lock, the latch or the motor's drive gear. Many people have the lock removed or pinned open on a motorised door, and we can advise on the day what suits yours.",
    },
    {
      question: "Can you fix a sectional garage door handle or latch?",
      answer:
        "Yes. Sectional and tilt doors use an outside handle with a latch cable and an inside slide bolt rather than a roller door lock. A stripped handle, a stretched latch cable or a slide bolt that was left engaged while the motor ran are all replaced as hardware under one attendance fee, which is the second row in the guide-price table on this page.",
    },
  ],

  cta: {
    heading: "Door Won't Lock, or Won't Unlock?",
    subtitle:
      "Send a photo of the lock or handle and we will bring the right assembly and keys for a one-visit fix anywhere in Perth.",
  },

  seo: {
    title: "Garage Door Lock Repair & Replacement Perth",
    description:
      "Roller door locks, lock arms and sectional door handles replaced across Perth, keys supplied, door secured same-day. Seized or broken lock? Get a fixed quote.",
  },
};
