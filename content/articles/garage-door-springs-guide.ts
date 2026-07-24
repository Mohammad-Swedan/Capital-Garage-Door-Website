import type { Article } from "@/types/article";

/**
 * Recreates the highest-ranking page the old site had. The pre-rebuild URL
 * /blogs/garage-door-springs-guide held 1,834 impressions at avg position 10.7
 * over the 3 months to 2026-07-22 (GSC) — the best-performing substantial page
 * on the domain — and has been 404ing since the rebuild. next.config.ts already
 * 301s /blogs/<slug> → /blog/<slug>, so publishing this slug is what makes that
 * redirect land somewhere real.
 *
 * Every price here is taken from the live price list (pricing-data.ts / CMS
 * PricingItems) — single spring $240–$280, pair $440–$550, ×3 $660–$770,
 * ×4 $880–$1,000, re-fit $280–$330, cable $280–$550, safety check $120,
 * service from $140 + parts, after-hours +$500. Do not invent figures here:
 * three existing spring posts quote lower, contradictory numbers and are
 * scheduled for correction against this same source.
 */
export const garageDoorSpringsGuide: Article = {
  title: "Garage Door Springs: The Complete Perth Guide",
  slug: "garage-door-springs-guide",
  category: "Springs & Cables",
  excerpt:
    "How garage door springs work, how long they last, what replacement costs in Perth, and why they're the one component you should never adjust yourself.",
  author: "Capital Garage Doors Team",
  authorTitle: "Licensed garage door technicians, Perth WA",
  authorBio:
    "Capital Garage Doors is a Perth-based garage door repair and installation team servicing homes and businesses across the metro area. We replace broken springs same-day, every day of the week.",
  publishedAt: "2026-07-24",
  updatedAt: "2026-07-24",
  featuredImage: "https://jadara-hub.b-cdn.net/capital-garage-door/4d804e09b10b497da43d4d92e26eea1b.png",
  featuredImageAlt: "Garage door torsion spring above the door tracks on a Perth home",

  shortAnswer:
    "Garage door springs counterbalance the weight of the door so the motor only has to guide it. Most last 7–12 years, or roughly 10,000 open-close cycles. In Perth, one broken spring supplied and fitted is $240–$280, a matched pair is $440–$550, and larger doors needing three or four springs run $660–$1,000. Springs are under extreme tension and are not a DIY repair — a snapped torsion spring stores enough force to cause serious injury.",

  tableOfContents: [
    { id: "what-springs-do", label: "What garage door springs actually do" },
    { id: "torsion-vs-extension", label: "Torsion vs extension springs" },
    { id: "how-long-they-last", label: "How long garage door springs last" },
    { id: "warning-signs", label: "Warning signs a spring is failing" },
    { id: "are-they-dangerous", label: "Are garage door springs dangerous?" },
    { id: "cost", label: "Spring replacement cost in Perth" },
    { id: "repair-or-replace", label: "Repair, re-tension, or replace?" },
    { id: "making-them-last", label: "Making your springs last longer" },
  ],

  contentBlocks: [
    {
      type: "paragraph",
      text:
        "A garage door spring is the hardest-working part of your door and the one almost nobody thinks about until it snaps. It is also the single most common garage door repair we're called out to across Perth — usually with the door stuck shut and a car trapped inside.",
    },
    {
      type: "paragraph",
      text:
        "This guide covers how springs work, the two types you'll find on Perth homes, how long they realistically last, what replacement costs, and why this is the one repair you genuinely should not attempt yourself.",
    },

    { type: "heading", level: 2, id: "what-springs-do", text: "What garage door springs actually do" },
    {
      type: "paragraph",
      text:
        "A typical sectional garage door weighs between 80 kg and 180 kg. Your motor does not lift that weight — it couldn't. The springs do. They store energy when the door closes and release it when the door opens, counterbalancing the door so it behaves as if it weighs only a few kilograms. The motor's job is just to guide it and hold it in place.",
    },
    {
      type: "paragraph",
      text:
        "That's why a broken spring feels like a motor problem. The opener strains, grinds, or gives up entirely, because it is suddenly being asked to lift the door's full weight on its own. Replacing the opener at that point fixes nothing — and burns out the new motor too.",
    },
    {
      type: "callout",
      variant: "info",
      title: "Quick test",
      body:
        "Pull the manual release cord and lift the door by hand. A correctly balanced door will feel light and stay put roughly halfway up. If it slams down or takes real effort to lift, the springs have lost tension or one has broken.",
    },

    { type: "heading", level: 2, id: "torsion-vs-extension", text: "Torsion vs extension springs" },
    {
      type: "paragraph",
      text:
        "Perth homes use one of two systems, and knowing which you have tells you a lot about what a repair involves.",
    },
    {
      type: "heading",
      level: 3,
      id: "torsion-springs",
      text: "Torsion springs",
    },
    {
      type: "paragraph",
      text:
        "Mounted on a steel shaft above the door opening, torsion springs twist to store energy. They're the standard on modern sectional doors, last longer, give smoother and more controlled movement, and fail more predictably. Most doors run one or two; wider or insulated doors may need three or four.",
    },
    {
      type: "heading",
      level: 3,
      id: "extension-springs",
      text: "Extension springs",
    },
    {
      type: "paragraph",
      text:
        "Mounted along the horizontal tracks either side of the door, extension springs stretch rather than twist. They're common on older tilt doors and cheaper installs. They wear faster, and without an intact safety containment cable a failing extension spring can become a projectile.",
    },
    {
      type: "list",
      items: [
        "Torsion — above the door, longer life, better balance, safer failure mode, standard on sectional doors",
        "Extension — beside the tracks, shorter life, needs containment cables, common on older tilt doors",
        "Roller doors — usually a spring assembly inside the barrel, replaced as a unit rather than as loose springs",
      ],
    },
    {
      type: "paragraph",
      text:
        "For a deeper side-by-side, see our breakdown of [torsion vs extension springs](/blog/garage-door-spring-types-torsion-vs-extension).",
    },

    { type: "heading", level: 2, id: "how-long-they-last", text: "How long garage door springs last" },
    {
      type: "paragraph",
      text:
        "Springs are rated in cycles, not years. One cycle is one full open and close. A standard spring is rated to around 10,000 cycles, and high-cycle springs to 20,000 or more.",
    },
    {
      type: "paragraph",
      text:
        "What that means in real time depends entirely on how much you use the door:",
    },
    {
      type: "checklist",
      title: "Expected spring life by usage",
      items: [
        "Two cycles a day (typical single-car household): 12–14 years",
        "Four cycles a day (most families): 7–9 years",
        "Six or more cycles a day (large families, home businesses): 4–6 years",
        "Commercial or strata doors: often under 3 years without high-cycle springs",
      ],
    },
    {
      type: "paragraph",
      text:
        "Perth adds one factor worth knowing about: salt air. Doors within a few kilometres of the coast — Scarborough, Fremantle, Hillarys, Mandurah — corrode noticeably faster, and a rusted spring fails well short of its cycle rating. Galvanised or coated springs are worth the small extra cost near the beach.",
    },
    {
      type: "callout",
      variant: "tip",
      title: "Springs fail in pairs",
      body:
        "If your door has two springs of the same age and one breaks, the second is at the end of its life too. Replacing both at once costs $440–$550 rather than paying two separate call-outs within months, and keeps the door properly balanced.",
    },

    { type: "heading", level: 2, id: "warning-signs", text: "Warning signs a spring is failing" },
    {
      type: "paragraph",
      text:
        "Springs almost always warn you before they go. Any of these means it's time to get the door looked at:",
    },
    {
      type: "list",
      items: [
        "A loud bang from the garage, often mistaken for something falling — this is usually the spring letting go",
        "A visible gap in the coil of the torsion spring above the door",
        "The door opens a few centimetres then stops, or the motor strains and reverses",
        "The door feels very heavy to lift by hand, or slams shut when released",
        "The door sits crooked, or one side lifts before the other",
        "Cables hanging loose, frayed, or off the drums",
        "Noticeably jerky movement, or new grinding and squealing",
      ],
    },
    {
      type: "callout",
      variant: "warning",
      title: "Stop using the door",
      body:
        "If you suspect a broken spring, don't keep operating the door — including with the opener. Every attempt puts the door's full weight through the motor, cables, and brackets, and turns a $240 spring replacement into a much larger repair. Park outside and call us.",
    },
    {
      type: "paragraph",
      text:
        "If the door is already stuck, our [garage door spring repair](/garage-door-spring-repair-perth) team carries the common spring sizes on the van and can usually fix it the same day. For a door jammed shut out of hours, see [emergency garage door repairs](/emergency-garage-door-repairs-perth).",
    },

    { type: "heading", level: 2, id: "are-they-dangerous", text: "Are garage door springs dangerous?" },
    {
      type: "paragraph",
      text:
        "Yes — genuinely, and this isn't a sales line. A torsion spring on a double garage door holds several hundred newton-metres of stored energy. Released without control, it can break bones, take fingers, or worse. Garage door springs and cables cause serious injuries in Australia every year, most of them during DIY attempts.",
    },
    {
      type: "paragraph",
      text:
        "Three specific things make it dangerous work: the tension is invisible, the correct winding bars are not something most households own (a screwdriver is not a substitute), and the door itself can drop while you're underneath it. Replacing a spring also requires setting the exact tension for that door's weight — get it wrong and the door either won't stay up or slams.",
    },
    {
      type: "paragraph",
      text:
        "The safety requirements for powered garage doors sit under Australian Standard AS/NZS 60335.2.95, published by [Standards Australia](https://www.standards.org.au/), and [WorkSafe WA](https://www.worksafe.wa.gov.au/) treats high-tension spring work as a task for competent, properly equipped operators. If you want the detail on the risk itself, we've written it up in [are garage door springs dangerous?](/blog/are-garage-door-springs-dangerous)",
    },
    {
      type: "callout",
      variant: "safety",
      title: "What you can safely do yourself",
      body:
        "Look, listen, and test the balance with the door disconnected. Keep the tracks clear. Never loosen a bracket, unwind a spring, adjust a cable drum, or remove a containment cable. Anything that involves releasing tension is a technician's job.",
    },

    { type: "heading", level: 2, id: "cost", text: "Spring replacement cost in Perth" },
    {
      type: "paragraph",
      text:
        "These are our actual price-list ranges, supplied and fitted, including removing the old spring and re-balancing the door:",
    },
    {
      type: "list",
      items: [
        "One broken spring — $240–$280. The most common same-day repair.",
        "A matched pair (×2) — $440–$550. Recommended when both springs are the same age.",
        "Three springs — $660–$770. Larger or heavier doors.",
        "Four springs — $880–$1,000. Oversized, insulated, or commercial doors.",
        "Re-fit or re-tension existing springs — $280–$330. When the springs are sound and only tension has drifted.",
        "Lift cable replaced or re-seated — $280–$550. Often needed alongside a spring failure.",
        "After-hours or emergency attendance — add $500.",
      ],
    },
    {
      type: "paragraph",
      text:
        "What moves the price within those ranges is door size and weight, how many springs the door runs, spring gauge, and whether the cables, drums, or brackets were damaged when the spring went. There's no call-out fee to quote, and the price is confirmed before any work starts. Full breakdown on our [spring replacement cost](/garage-door-spring-replacement-cost-perth) page, or get an instant range from the [price calculator](/calculator).",
    },
    {
      type: "callout",
      variant: "info",
      title: "Be careful with cheap quotes",
      body:
        "A spring priced well under $200 fitted usually means a light-gauge spring that won't reach its cycle rating, or a re-tension of the spring that just failed. Ask what gauge and cycle rating you're getting, and what the warranty covers.",
    },

    { type: "heading", level: 2, id: "repair-or-replace", text: "Repair, re-tension, or replace?" },
    {
      type: "paragraph",
      text:
        "A broken spring cannot be repaired — once the coil has failed, it's replaced. What is worth deciding is scope:",
    },
    {
      type: "list",
      ordered: true,
      items: [
        "Re-tension only — the springs are intact and in good condition, but the door has drifted out of balance. $280–$330, and the cheapest correct outcome.",
        "Replace the broken spring alone — sensible if the springs are different ages, or the other is recent.",
        "Replace as a matched pair — the default recommendation on a door where both springs are the same age. Better balance, one call-out.",
        "Upgrade to high-cycle springs — worth it on a busy household or commercial door: roughly double the rated life for a modest increase in price.",
      ],
    },
    {
      type: "paragraph",
      text:
        "If the door is over 20 years old and the springs, cables, rollers and drums are all worn, put the repair cost against a new door before spending. Our [garage door repair cost](/garage-door-repair-cost-perth) guide covers where that line usually sits.",
    },

    { type: "heading", level: 2, id: "making-them-last", text: "Making your springs last longer" },
    {
      type: "paragraph",
      text:
        "You can't extend a spring's cycle rating, but you can stop it failing early — and early failure is nearly always caused by something else on the door working against it.",
    },
    {
      type: "checklist",
      title: "What actually helps",
      items: [
        "Keep the door balanced — an unbalanced door loads one spring harder than the other",
        "Replace worn rollers; stiff rollers make the springs work against friction",
        "Lubricate the torsion shaft bearings, rollers, and hinges with a garage-door-specific lubricant twice a year (never grease the tracks)",
        "Fix a noisy or jerky door promptly instead of living with it",
        "Near the coast, rinse salt off the door and specify galvanised springs at replacement",
        "Have the door serviced annually — $120 for a safety check-up, or from $140 plus parts for a full service",
      ],
    },
    {
      type: "paragraph",
      text:
        "An annual service is the cheapest insurance available on a garage door: it catches spring fatigue, cable wear, and balance drift before any of them strands you. See [how often you should service a garage door](/blog/how-often-should-you-service-a-garage-door) and our [garage door maintenance](/garage-door-maintenance-perth) service.",
    },
    {
      type: "quote",
      text:
        "Nine out of ten \"my motor's dead\" call-outs turn out to be a broken spring. The motor was never the problem — it was just the part that gave up last.",
      cite: "Capital Garage Doors, Perth",
    },
  ],

  expertTips: [
    {
      kind: "safety",
      title: "One bang, then nothing",
      body:
        "If you heard a single loud bang and the door won't open, assume a broken spring and stop using the opener. Continuing to run it is what turns a spring replacement into a spring, cable, and bracket replacement.",
    },
    {
      kind: "cost",
      title: "Two springs, one call-out",
      body:
        "Replacing both springs at $440–$550 while we're already on site is cheaper than two separate $240–$280 jobs a few months apart — and same-age springs almost always fail close together.",
    },
    {
      kind: "technician",
      title: "Ask for the cycle rating",
      body:
        "Springs are rated in cycles, not years. On a busy door, high-cycle springs roughly double the service life for a small price difference. It's worth asking what's being fitted.",
    },
    {
      kind: "maintenance",
      title: "Test the balance twice a year",
      body:
        "Release the door and lift it by hand to waist height. It should hold position. If it drifts down or shoots up, the tension needs adjusting before it wears the springs unevenly.",
    },
  ],

  relatedServices: [
    {
      label: "Garage Door Spring Repair Perth",
      href: "/garage-door-spring-repair-perth",
      description: "Same-day broken spring replacement across the Perth metro area.",
      icon: "Wrench",
    },
    {
      label: "Spring Replacement Cost Perth",
      href: "/garage-door-spring-replacement-cost-perth",
      description: "Full price list for springs, cables, and re-tensioning.",
      icon: "Calculator",
    },
    {
      label: "Broken Spring or Cable?",
      href: "/problems/garage-door-spring-or-cable-broken",
      description: "Diagnose the fault and see what the repair involves.",
      icon: "AlertTriangle",
    },
    {
      label: "Emergency Garage Door Repairs",
      href: "/emergency-garage-door-repairs-perth",
      description: "Door stuck shut? After-hours response across Perth.",
      icon: "Siren",
    },
  ],

  relatedArticles: [
    {
      slug: "how-long-do-garage-door-springs-last",
      title: "How Long Do Garage Door Springs Last?",
      category: "Springs & Cables",
    },
    {
      slug: "garage-door-spring-types-torsion-vs-extension",
      title: "Garage Door Spring Types: Torsion vs Extension",
      category: "Springs & Cables",
    },
    {
      slug: "are-garage-door-springs-dangerous",
      title: "Are Garage Door Springs Dangerous?",
      category: "Safety",
    },
    {
      slug: "garage-door-cable-repair-signs-and-cost",
      title: "Garage Door Cable Repair: Signs and Cost",
      category: "Springs & Cables",
    },
  ],

  faqs: [
    {
      question: "How much does it cost to replace a garage door spring in Perth?",
      answer:
        "One spring supplied and fitted is $240–$280. A matched pair is $440–$550, three springs $660–$770, and four $880–$1,000 for oversized or commercial doors. Re-tensioning sound springs instead of replacing them is $280–$330. After-hours attendance adds $500. There's no call-out fee to quote.",
    },
    {
      question: "How long do garage door springs last?",
      answer:
        "Springs are rated in cycles rather than years — around 10,000 for a standard spring. At two openings a day that's 12–14 years; at four a day it's 7–9 years; at six or more it can be 4–6 years. Coastal Perth doors corrode faster and often fall short of the rating.",
    },
    {
      question: "Can I replace a garage door spring myself?",
      answer:
        "You shouldn't. A torsion spring holds several hundred newton-metres of stored energy and needs proper winding bars to release safely, and the new spring has to be tensioned to your specific door's weight. It's the repair that causes the most DIY injuries on garage doors.",
    },
    {
      question: "Should I replace one spring or both?",
      answer:
        "If both springs are the same age and one has broken, replace both. The second is at the same point in its cycle life and typically fails within months. Doing both at once costs $440–$550 instead of two separate call-outs, and keeps the door balanced.",
    },
    {
      question: "Is my problem the spring or the motor?",
      answer:
        "Pull the manual release and lift the door by hand. If it's very heavy or won't stay up, it's the springs — the motor was only struggling because it was lifting the whole door. If the door lifts easily by hand but the opener won't run, the fault is in the motor or its electronics.",
    },
    {
      question: "Can you replace a broken spring the same day?",
      answer:
        "Usually yes. We carry the common torsion spring sizes on the van, so most Perth spring replacements are done on the first visit. Larger doors needing three or four springs, or unusual gauges, may need a part ordered.",
    },
    {
      question: "What happens if I keep using a door with a broken spring?",
      answer:
        "The opener carries the door's full weight, which can burn out the motor, stretch or snap the lift cables, bend brackets, and pull the door out of alignment. It also risks the door dropping. Stop using it and get the spring replaced.",
    },
  ],

  seo: {
    title: "Garage Door Springs Guide Perth | Costs, Life & Safety",
    description:
      "How garage door springs work, how long they last, and what replacement costs in Perth — $240–$280 for one spring, $440–$550 a pair. Same-day repairs.",
  },
};
