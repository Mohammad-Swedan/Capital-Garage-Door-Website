import type { ServicePage } from "@/types/service-page";

/**
 * /garage-door-hinge-roller-replacement-perth — worn hinges, nylon rollers and roller stems on
 * sectional doors (the noisy, jerky, "catches on the way up" fault).
 *
 * Why this page exists (2026-11-01 research, docs/seo/serp-pulls-2026-11-01.md):
 *  - Keyword Planner (Perth): "garage door roller replacement" 20/mo, "garage door hinge
 *    replacement" 10/mo; the noisy-door and parts clusters in Search Console (noisy/wont-open
 *    229 impressions, lock/parts 395) have no service page. Lowest-demand page of the program,
 *    built because it is the catalog's attendance-fee row ("Hinges & rollers / wheels") and the
 *    fix behind most noisy-door call-outs; the Morley hinge-and-roller job is its photo proof.
 *
 * No literal price in the prose: the live CMS page pins "Hinges & rollers / wheels" and
 * "Safety check-up / inspection"; the costGuidance rows below are the CMS_SERVICE_PAGES=off
 * fallback and mirror pricing-data.ts.
 */
export const garageDoorHingeRollerReplacementPerth: ServicePage = {
  serviceName: "Garage Door Hinge & Roller Replacement Perth",
  slug: "garage-door-hinge-roller-replacement-perth",
  pageType: "service",

  hero: {
    h1: "Garage Door Hinge & Roller Replacement Perth",
    subtitle:
      "Worn nylon rollers, sheared roller stems and cracked hinges replaced across Perth, so a noisy, jerky sectional door runs quietly and squarely in its tracks again, usually in one visit.",
    badges: [
      { icon: "Settings", label: "Rollers & Hinges" },
      { icon: "Volume2", label: "Noisy Door Fix" },
      { icon: "Clock3", label: "One Visit, All Parts" },
      { icon: "MapPin", label: "All Perth Suburbs" },
    ],
    image:
      "https://jadara-hub.b-cdn.net/capital-garage-door/gallery/garage-door-hinge-roller-replacement-morley-perth.webp",
    imageAlt: "New black hinge and roller bracket fitted to a sectional garage door track in Morley, Perth",
    floatingCardLabel: "Quiet Again",
  },

  directAnswer:
    "Capital Garage Doors replaces garage door hinges and rollers across Perth. The rollers carry a sectional door's panels through the tracks and the hinges let the panels fold as the door curves overhead; when rollers wear flat, split or shear their stems and hinges crack, the door gets loud, jerks, catches on the way up or twists in the tracks. We fit nylon rollers with sealed bearings and steel hinges matched to each panel position, replacing every worn one in a single visit under one attendance fee, then re-balance the door and reset the opener.",

  intro: {
    heading: "Why Rollers and Hinges Wear Out, and What a Proper Replacement Looks Like",
    paragraphs: [
      "A sectional door has ten or more rollers and a hinge at every panel joint, and each one moves every time the door opens. The original rollers on many Perth doors are plain nylon wheels on a bare steel stem; after ten or fifteen years the nylon wears flat or splits, the stem seizes in its bracket, and the roller starts to drag rather than roll. The door gets noisier, the opener works harder, and eventually a stem shears and the panel drops out of the track. Hinges fail more slowly, cracking at the knuckle on the bottom and middle panels where the load is greatest.",
      "Replacing one roller at a time is false economy, because the others have done the same number of cycles. We fit a full set of nylon rollers with sealed ball-bearing cores, which run quieter and do not need the stem greased, and we replace the cracked hinges with the correct numbered hinge for each position: hinges are graded by panel height, and fitting the wrong number is why a DIY door often binds after new hinges go on. The bottom brackets, which carry the cables, are checked at the same time.",
      "Because the rollers and hinges set how the door sits in its tracks, the job ends with the door balanced by hand and the opener's force and travel limits reset. The Morley job in the recent work below is the typical case: a loud door that caught halfway, fixed with a new hinge and roller set on one visit. If the noise turns out to be the springs or the opener instead, our technicians diagnose that on the day and quote it separately.",
    ],
  },

  problems: [
    { label: "Door grinding, squealing or rattling", icon: "Volume2" },
    { label: "Door jerks or catches part-way up", icon: "PauseCircle" },
    { label: "Roller worn flat, split or stem sheared", icon: "Settings" },
    { label: "Hinge cracked or pulled from the panel", icon: "AlertTriangle" },
    { label: "Panel twisting or sitting crooked", icon: "Move" },
    { label: "Opener straining on a door that used to be easy", icon: "Cpu" },
  ],

  includedItems: [
    "Full set of sealed-bearing nylon rollers fitted",
    "Cracked or stretched hinges replaced with the correct numbered hinge",
    "Bottom brackets and cable fixings checked",
    "Tracks cleaned and aligned, loose hangers tightened",
    "Door balanced by hand after the parts go in",
    "Opener force and travel limits reset, safety reverse tested",
    "All parts replaced in one visit under one attendance fee",
    "A fixed quote agreed before any work starts",
  ],

  processSteps: [
    {
      title: "Describe the noise",
      description:
        "Grinding, a squeal, a bang on the way up: each points to rollers, hinges or something else, and we bring the parts for all of them.",
      icon: "Volume2",
    },
    {
      title: "Inspect every roller and hinge",
      description:
        "Each roller is checked for flat spots, splits and seized stems, each hinge for cracks and elongated holes.",
      icon: "Search",
    },
    {
      title: "Replace the set",
      description:
        "Sealed-bearing rollers and correctly numbered hinges go in panel by panel, with the door supported in the tracks.",
      icon: "Wrench",
    },
    {
      title: "Align and balance",
      description:
        "Tracks are cleaned and squared, hangers tightened, and the door balanced so it holds at half height by hand.",
      icon: "Move",
    },
    {
      title: "Reset and test",
      description:
        "Opener limits and force are reset for the lighter-running door and the safety reverse is proven.",
      icon: "BadgeCheck",
    },
  ],

  // Mirrors pricing-data.ts — the live CMS page pins the same catalog rows.
  costGuidance: {
    intro:
      "Straight from our price list. Hinges and rollers are priced per part on top of one attendance fee, so replacing the whole set in a single visit costs less than doing them one at a time. As a guide:",
    rows: [
      {
        label: "Hinges & rollers / wheels",
        price: "$30 each + $140 call-out",
        note: "One call-out fee plus each roller or hinge fitted",
      },
      {
        label: "Safety check-up / inspection",
        price: "$120",
        note: "If you would rather have the door assessed first",
      },
    ],
  },

  whyChoose: [
    {
      title: "Whole set, one fee",
      description: "Every worn roller and hinge replaced in one visit under a single attendance fee.",
      icon: "PackageCheck",
    },
    {
      title: "Sealed-bearing rollers",
      description: "Quieter than the plain nylon originals, and the stem never needs greasing.",
      icon: "Settings",
    },
    {
      title: "Correct hinge numbers",
      description: "Hinges are matched to each panel position, so the door folds cleanly instead of binding.",
      icon: "BadgeCheck",
    },
    {
      title: "Balanced afterwards",
      description: "New parts change how the door runs; we balance it and reset the opener so it lasts.",
      icon: "Scale",
    },
    {
      title: "Honest diagnosis",
      description: "If the noise is the springs or the opener, we say so and quote that instead.",
      icon: "Search",
    },
    {
      title: "All of Perth",
      description: "Northern suburbs to Mandurah, with the common roller and hinge sizes on the van.",
      icon: "MapPin",
    },
  ],

  relatedServices: [
    {
      name: "Noisy Garage Door? Causes & Fixes",
      href: "/problems/noisy-garage-door",
      description: "Which noises mean rollers, which mean springs, and which mean the opener.",
      icon: "HelpCircle",
    },
    {
      name: "Garage Door Servicing Perth",
      href: "/garage-door-maintenance-perth",
      description: "An annual service lubricates rollers and hinges before they wear out.",
      icon: "ShieldCheck",
    },
    {
      name: "Garage Door Off Track Repair Perth",
      href: "/garage-door-off-track-repair-perth",
      description: "When a sheared roller stem has already let a panel jump the track.",
      icon: "Move",
    },
    {
      name: "Garage Door Repair Cost Perth",
      href: "/garage-door-repair-cost-perth",
      description: "Every repair on our price list, hinges and rollers included.",
      icon: "FileText",
    },
    {
      name: "Garage Door Spring Replacement Perth",
      href: "/garage-door-spring-repair-perth",
      description: "A tired spring makes a door heavy and loud, whatever the rollers are like.",
      icon: "Settings",
    },
    {
      name: "Garage Door Repairs Perth",
      href: "/garage-door-repairs-perth",
      description: "Springs, cables, motors, tracks and panels — the full repair service.",
      icon: "Wrench",
    },
  ],

  serviceAreas: [
    "Morley",
    "Bayswater",
    "Midland",
    "Joondalup",
    "Scarborough",
    "Canning Vale",
    "Thornlie",
    "Cockburn Central",
    "Rockingham",
    "Mandurah",
  ],

  // Real Google reviews (the CMS page pins the same reviews by customer name).
  reviews: [
    {
      name: "Chantelle N.",
      rating: 5,
      text:
        "Quick, efficient and friendly service. Really happy with Mussab's professional work — knew exactly what he needed to fix and gave us a full rundown before he left. Will definitely call again when we need service and repair work done.",
      service: "Garage Door Repair",
    },
    {
      name: "Khaled K.",
      rating: 5,
      text:
        "Capital Garage Doors provided exceptional service from start to finish. Their team was professional, prompt and knowledgeable, ensuring my garage door was repaired efficiently. The quality of work exceeded my expectations and the pricing was fair.",
      service: "Garage Door Service",
    },
  ],

  faqs: [
    {
      question: "How much does it cost to replace garage door rollers in Perth?",
      answer:
        "Rollers and hinges are priced per part on top of one attendance fee, and the guide-price table on this page shows the attendance figure from our price list. A full roller set on a standard double sectional door is ten to twelve rollers, and because the fee is charged once, replacing the whole set in one visit costs far less than coming back for each one as it fails. We confirm the total before any part goes on.",
    },
    {
      question: "How do I know if my garage door rollers need replacing?",
      answer:
        "Listen and look. A door that grinds or squeals as it moves, jerks at the same spot every time, or rattles in the tracks usually has rollers that are worn flat, split or seized on their stems. With the door closed, look at the rollers in the vertical tracks: cracked or flattened nylon, rust on the stem, or a roller sitting at an angle in its bracket all mean it is time. A roller that has sheared will have dropped a panel out of the track, which is an off-track repair.",
    },
    {
      question: "Nylon or steel garage door rollers: which is better?",
      answer:
        "For a Perth home, sealed-bearing nylon rollers. They run quieter than steel, do not rust, and the sealed bearing means the stem is not grinding in a dry bracket. Plain steel rollers are louder and wear the tracks; plain nylon rollers without a bearing, which many doors came with, wear flat within ten to fifteen years. The exception is a heavy commercial or oversized door, where a steel roller with a bearing may be specified for the load.",
    },
    {
      question: "Can I replace garage door hinges and rollers myself?",
      answer:
        "The hinges and rollers on the top and middle panels can be changed one at a time with the door down and the opener unplugged, as long as the correct numbered hinge goes back in each position. Leave the bottom brackets and the bottom rollers alone: the lift cables attach to the bottom brackets and are under full spring tension, and removing one is how people get hurt. If any part of the job involves the bottom panel or the cables, book a technician.",
    },
    {
      question: "Why is my garage door still noisy after new rollers?",
      answer:
        "Usually because the rollers were not the whole story. A tired spring makes the opener drag a heavy door and rattle the whole assembly; a sagging horizontal track makes the rollers bang at the curve; a worn chain or gear in the opener grinds regardless of the door. Lubricating the wrong parts, or greasing the tracks, also makes a door louder. A service checks all of these, which is why we balance the door and reset the opener as part of every roller job.",
    },
    {
      question: "How often should garage door rollers and hinges be replaced?",
      answer:
        "Plain nylon rollers typically last ten to fifteen years on a door used a few times a day, sealed-bearing rollers longer, and hinges last until they crack, usually well past that. Heavily used doors and coastal doors wear faster. The practical rule is to have them checked at an annual service and replace the set when the first ones show flat spots or seized stems, rather than waiting for a sheared roller to drop a panel out of the track.",
    },
  ],

  cta: {
    heading: "Loud, Jerky or Catching on the Way Up?",
    subtitle:
      "Tell us what the door sounds like and we will bring a full roller and hinge set for a one-visit fix anywhere in Perth.",
  },

  seo: {
    title: "Garage Door Hinge & Roller Replacement Perth",
    description:
      "Worn garage door rollers and cracked hinges replaced across Perth in one visit: sealed-bearing rollers, correct hinges, door balanced, opener reset. Book now.",
  },
};
