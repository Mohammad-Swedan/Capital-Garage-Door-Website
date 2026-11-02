import type { ServicePage } from "@/types/service-page";

/**
 * /garage-door-cable-repair-perth — snapped, frayed and off-drum lift cables.
 *
 * Why this page exists (2026-11-01 research, docs/seo/serp-pulls-2026-11-01.md):
 *  - Search Console (AU, 90 days to 2026-10-29): "garage door cable repair
 *    perth" 301 impressions at position 12.0 with 0 clicks, landing on the
 *    repair-cost guide; the cable cluster is 494 impressions across 29
 *    queries and no page targets it. Keyword Planner: "garage door cable" 30,
 *    "garage door cable replacement" 20, "garage door cable repair" 10 a month
 *    in Perth.
 *  - The live Perth SERP has no dedicated cable page: a repairer home page,
 *    two suburb pages, Facebook posts, Airtasker and a sister site's
 *    service-cost guide. PAA: cost to replace the cables, what happens when a
 *    cable breaks, how to fix a cable, the most common repair.
 *  - CRM: cable/bracket jobs are the second most common job after springs
 *    (Jane Brook, Byford, Forrestfield, Spearwood, Fremantle, Willetton,
 *    Bayswater, Kardinya) — all photo-backed case studies for "Recent work".
 *
 * No literal price appears in the prose: the live CMS page pins the catalog
 * rows ("Cable snapped or off the drum", "Door off track / stuck",
 * "After-hours / emergency call-out"); the costGuidance rows below are the
 * CMS_SERVICE_PAGES=off fallback and mirror pricing-data.ts.
 */
export const garageDoorCableRepairPerth: ServicePage = {
  serviceName: "Garage Door Cable Repair Perth",
  slug: "garage-door-cable-repair-perth",
  pageType: "service",

  hero: {
    h1: "Garage Door Cable Repair & Replacement Perth",
    subtitle:
      "Snapped, frayed or off-the-drum lift cables replaced in pairs, brackets and drums checked, and the door re-balanced so it lifts level again — same-day across Perth.",
    badges: [
      { icon: "Cable", label: "Cables Replaced in Pairs" },
      { icon: "Clock3", label: "Same-Day Call-Outs" },
      { icon: "ShieldCheck", label: "Brackets & Drums Checked" },
      { icon: "MapPin", label: "All Perth Suburbs" },
    ],
    image:
      "https://jadara-hub.b-cdn.net/capital-garage-door/gallery/garage-door-cable-replacement-willetton-perth.webp",
    imageAlt:
      "White sectional garage door in Willetton, Perth, running level again after both lift cables and bottom brackets were replaced",
    floatingCardLabel: "Fixed in One Visit",
  },

  directAnswer:
    "Capital Garage Doors repairs and replaces garage door lift cables across Perth. A cable that has snapped, frayed or jumped off its drum leaves a sectional door crooked, jammed or hanging on one side — we fit new cables as a matched pair, check the bottom brackets, drums and springs that caused the failure, then re-tension and balance the door so it runs level. Most cable jobs are finished in a single same-day visit, with the price agreed before any work starts.",

  intro: {
    heading: "Why Lift Cables Fail, and Why We Replace Them as a Pair",
    paragraphs: [
      "The lift cables are the two steel ropes that carry the door's weight from the bottom brackets up to the drums on the torsion shaft. They do the heaviest work on the door and they wear quietly: strands fray near the bottom bracket where the cable bends, rust sets in on doors near the coast or in damp garages, and a cable that has stretched slackens enough to jump off its drum the next time the door closes on something. When one finally lets go, the whole weight of the door lands on the other side and the door twists in the tracks.",
      "That is why we never fit a single cable. Both cables went on together and have done the same number of cycles, so the survivor is weeks away from the same failure. We fit a matched pair sized to the door, inspect the bottom brackets and cable drums for the wear that usually caused the break, and check the springs, because a broken or tired spring overloads the cables and will chew through new ones just as quickly.",
      "Our technicians carry cables, bottom brackets, drums and springs for the sectional and tilt doors Perth homes actually have, so a cable repair is normally done on the first visit. If the door has been jammed with a car inside or is stuck open to the street, tell us when you call and we prioritise it as an emergency job. The warning signs are covered in our guide to cable repair signs and costs, linked below, and the recent work on this page shows real Perth cable jobs.",
    ],
  },

  problems: [
    { label: "Cable snapped — door crooked or jammed", icon: "Cable" },
    { label: "Cable frayed near the bottom bracket", icon: "AlertTriangle" },
    { label: "Cable off the drum, door lopsided", icon: "Move" },
    { label: "Door drops or slams on one side", icon: "Siren" },
    { label: "Rusted cables on a coastal door", icon: "RefreshCw" },
    { label: "Loose cable after a spring broke", icon: "Settings" },
  ],

  includedItems: [
    "Both lift cables replaced as a matched pair",
    "Bottom brackets and cable drums inspected and replaced if worn",
    "Torsion and extension springs checked for the fault that caused the break",
    "Door re-tensioned and balanced so it lifts level",
    "Tracks, rollers and hinges checked while the door is open",
    "Opener force and safety-reverse limits reset after the repair",
    "Same-day call-outs across Perth, after-hours for jammed doors",
    "A fixed quote agreed before any work starts",
  ],

  processSteps: [
    {
      title: "Call or book with a photo",
      description:
        "A photo of the crooked door or the loose cable helps us bring the right cable length, brackets and drums the first time.",
      icon: "Camera",
    },
    {
      title: "Make the door safe",
      description:
        "A door hanging on one cable is under load. We release the tension properly before anyone touches the brackets or drums.",
      icon: "ShieldCheck",
    },
    {
      title: "Find the cause",
      description:
        "Worn bracket, damaged drum, broken spring or a door that has been forced — the cause decides what else needs replacing.",
      icon: "Search",
    },
    {
      title: "Fit the new pair",
      description:
        "Matched cables wound correctly onto the drums, new bottom brackets if the old ones have worn, and the shaft re-tensioned.",
      icon: "Wrench",
    },
    {
      title: "Balance and test",
      description:
        "The door is cycled by hand and under power, levelled in the tracks, and the opener's limits and safety reverse are reset.",
      icon: "BadgeCheck",
    },
  ],

  // Mirrors pricing-data.ts — the live CMS page pins the same catalog rows.
  costGuidance: {
    intro:
      "Straight from our price list — a cable job is priced as a pair, with the brackets and any spring work quoted on the spot once we see the door. As a guide:",
    rows: [
      {
        label: "Lift cables replaced (pair)",
        price: "$280–$550",
        note: "Both cables, re-tensioned and balanced; includes attendance",
      },
      {
        label: "Door off track / stuck",
        price: "$440–$770",
        note: "When the cable failure has twisted the door out of its tracks",
      },
      {
        label: "After-hours / emergency call-out",
        price: "+$500",
        note: "Surcharge on top of the repair for nights, weekends and public holidays",
      },
    ],
  },

  whyChoose: [
    {
      title: "Pairs only, no shortcuts",
      description:
        "We replace both cables and the worn brackets behind the failure, so you are not calling again in a month.",
      icon: "Cable",
    },
    {
      title: "Cause found, not just the symptom",
      description:
        "Springs, drums and brackets are checked on every cable job — the usual reason a cable let go.",
      icon: "Search",
    },
    {
      title: "Same-day, one visit",
      description:
        "Vans carry cables, brackets, drums and springs for Perth's common sectional and tilt doors.",
      icon: "Clock3",
    },
    {
      title: "Safe under tension",
      description:
        "A door on one cable is dangerous. Our technicians release and re-tension the system properly.",
      icon: "ShieldCheck",
    },
    {
      title: "Price agreed first",
      description:
        "The cable price is a listed pair price; anything extra is quoted and agreed before we start.",
      icon: "FileText",
    },
    {
      title: "All of Perth",
      description:
        "Northern suburbs to Mandurah, with after-hours call-outs for doors stuck open or jammed shut.",
      icon: "MapPin",
    },
  ],

  relatedServices: [
    {
      name: "Garage Door Spring Replacement Perth",
      href: "/garage-door-spring-repair-perth",
      description: "A broken or tired spring is the most common reason a cable fails.",
      icon: "Settings",
    },
    {
      name: "Garage Door Repair Cost Perth",
      href: "/garage-door-repair-cost-perth",
      description: "Every repair on our price list, cables included, with what each covers.",
      icon: "FileText",
    },
    {
      name: "Emergency Garage Door Repairs Perth",
      href: "/emergency-garage-door-repairs-perth",
      description: "Door jammed with the car inside or stuck open? After-hours call-outs.",
      icon: "Siren",
    },
    {
      name: "Garage Door Repairs Perth",
      href: "/garage-door-repairs-perth",
      description: "Springs, cables, motors, tracks and panels — the full repair service.",
      icon: "Wrench",
    },
    {
      name: "Broken Spring or Cable?",
      href: "/problems/garage-door-spring-or-cable-broken",
      description: "How to tell which one has gone, and what is safe to check yourself.",
      icon: "HelpCircle",
    },
    {
      name: "Cable Repair Signs & Costs",
      href: "/blog/garage-door-cable-repair-signs-and-cost",
      description: "The warning signs before a cable snaps, and what the fix involves.",
      icon: "Search",
    },
  ],

  serviceAreas: [
    "Willetton",
    "Bayswater",
    "Fremantle",
    "Midland",
    "Armadale",
    "Cockburn Central",
    "Joondalup",
    "Canning Vale",
    "Rockingham",
    "Mandurah",
  ],

  // Real Google reviews (the CMS page pins the same reviews by customer name).
  reviews: [
    {
      name: "Duane S.",
      rating: 5,
      text:
        "Good efficient work. One of the springs on my garage door snapped in half. Service was fast and efficient — both springs were replaced within an hour. Highly recommend for garage door troubles.",
      service: "Spring & Cable Repair",
    },
    {
      name: "Marty P.",
      rating: 5,
      text:
        "Sam and crew responded very quickly on the same day to fix my broken garage door panel. The door works even better now. Highly recommend them — will be booking them for the regular service from now on.",
      service: "Same-Day Repair",
    },
  ],

  faqs: [
    {
      question: "How much does it cost to replace garage door cables in Perth?",
      answer:
        "Cables are priced as a pair on our price list, and the guide-price table on this page shows the current range for a standard sectional or tilt door, with attendance included. The price moves within that range with the door's size and weight, and whether the bottom brackets or drums also need replacing. If a broken spring caused the cable to fail, the spring is quoted separately before we start, so there is no surprise on the invoice.",
    },
    {
      question: "What happens when a garage door cable breaks?",
      answer:
        "The door's weight is shared between two cables, so when one snaps the other side is suddenly carrying everything. The door twists, one corner drops, and it usually jams in the tracks part-way up or down. Sometimes the door drops hard on the broken side. Do not try to lift it or run the opener again: the remaining cable, the drum and the springs are all under uneven load, and forcing the door can snap the second cable or bend the tracks.",
    },
    {
      question: "Can I fix a garage door cable myself?",
      answer:
        "We advise against it. The cables wind onto drums on the torsion shaft, which is under spring tension even when the door is down, and re-fitting a cable means unloading and re-tensioning that spring. That is the step that injures people. A garage door technician releases the tension, fits the matched pair, re-tensions the shaft and balances the door in well under an hour, which is also why most of our cable jobs are a single same-day visit.",
    },
    {
      question: "Why do you replace both cables when only one broke?",
      answer:
        "Because they are the same age with the same number of cycles. Both cables were fitted together and wear at the same rate, so the one that is still holding is close to the same failure, and a second call-out costs more than fitting the pair now. Replacing both also lets us balance the door properly, as two new cables of equal length keep the door level in the tracks.",
    },
    {
      question: "Why did my garage door cable come off the drum?",
      answer:
        "Three usual reasons. The door closed on an object or a car bumper, which slackened the cable for a moment and let it jump its groove. A spring has broken or lost tension, so the cable is no longer kept taut. Or the cable has stretched or frayed with age. In each case the cable has to come off, the cause has to be fixed, and the cable is re-wound onto the drum under tension; if it is frayed we replace the pair rather than re-use it.",
    },
    {
      question: "Do you repair roller door cables as well?",
      answer:
        "Standard roller doors do not use lift cables: the curtain winds around a drum with springs inside it. If your roller door is jammed, lopsided or has come out of its guides, the fix is to the springs, the drum or the guides, and our roller door repairs team handles those. Sectional, panel-lift and tilt doors are the ones with cables, and those are what this page covers.",
    },
    {
      question: "Do you do emergency cable repairs after hours?",
      answer:
        "Yes. A door hanging on one cable will not close properly, which leaves the house open or traps the car inside, so we treat it as a priority job. After-hours call-outs on nights, weekends and public holidays carry the surcharge shown in the guide-price table, and we tell you the total on the phone before anyone drives out.",
    },
  ],

  cta: {
    heading: "Door Crooked, Jammed or Hanging on One Side?",
    subtitle:
      "Send a photo and we will bring the right cables, brackets and drums for a one-visit repair. Same-day across Perth.",
  },

  seo: {
    title: "Garage Door Cable Repair Perth | Snapped & Off-Drum Cables",
    description:
      "Snapped, frayed or off-the-drum garage door cables replaced in pairs across Perth. Brackets, drums & springs checked, door re-balanced. Same-day call-outs.",
  },
};
