import type { ServiceSuburbPage, FAQ, LocalLink, AvailableService, TrustReason } from "@/types";

/**
 * Batch 3 (2026-08) — 15 southern-corridor suburb pages, created in the CMS as
 * DRAFTS by scripts/import-suburb-pages-batch3.ts (with pricing pins). Spread
 * into the registry in content/service-suburb-pages.ts.
 *
 * Research behind the selection + copy (GSC 90d/28d, DataForSEO bulk volumes,
 * and a LIVE Perth SERP pulled for every one of the 15):
 *  - GSC proves real, uncaptured demand on five: Forrestdale 14 impressions
 *    (pos 10.9), Parkwood 10 (17.2), Piara Waters 9 (1.0), Harrisdale 6 (1.0),
 *    Langford 4 (1.0) — every one of them landing on the HOMEPAGE because no
 *    page existed.
 *  - Google Ads volume rounds most of these suburbs to zero (only "garage door
 *    repair langford" and "garage doors piara waters" register at 10/mo). The
 *    play is corridor coverage + "near me" matching, not per-suburb volume.
 *  - Every SERP is weak: generic Perth-wide pages (edenroc, otto's, gecko,
 *    24seven, a1) plus directories (hipages, ServiceSeeking, Airtasker). No
 *    competitor holds a dedicated page for any of these suburbs.
 *  - Every SERP's related searches show COST intent ("{suburb} cost / prices /
 *    price list") — which is why these pages carry a real guide-price table fed
 *    from the pricing catalog (see the import script's PRICING_PINS).
 *  - Recurring PAA questions across the 15 SERPs are answered verbatim in the
 *    per-suburb FAQs: "Is it worth repairing a garage door?", "What's the
 *    average lifespan of a garage door motor?", "Can a damaged garage door be
 *    repaired?", "What is the most common problem with garage doors?".
 *
 * Copy is deliberately distinct per suburb (housing stock, landmarks, who
 * lives there, what fails) — 15 templated clones would read as doorway pages.
 *
 * NOTE: no dollar figures in any copy. Prices only ever come from the catalog.
 */

const BRANDS_DOORS = "B&D, Steel-Line, Centurion, Gliderol and Dominator";
const BRANDS_OPENERS = "Merlin, ATA and Chamberlain";
/** Shared marker phrase — see scripts/enhance-suburb-pages.ts idempotency guard. */
const BRANDS_MARKER = "B&D, Steel-Line, Centurion";

type Flag = "riverside" | "estate" | "commercial" | "olderStock" | "rentals" | "boats";

interface SuburbSpec {
  slug: string;
  suburb: string;
  region: string;
  /** Used in the "local specialists" trust card, e.g. "the Canning River suburbs". */
  corridor: string;
  flags: Flag[];
  nearbySuburbs: LocalLink[];
  heroSubtitle: string;
  directAnswer: string;
  /** Five bespoke paragraphs; the last carries the brands marker. */
  localIntro: string[];
  /** 3–4 suburb-specific FAQs appended to the seven standard ones. */
  specificFaqs: FAQ[];
  caseStudySlugs: string[];
  seo: { title: string; description: string };
}

function buildServices(suburb: string, flags: Flag[]): AvailableService[] {
  const cards: AvailableService[] = [
    {
      title: "Garage Door Repairs",
      description: `Diagnosis and repair for doors that won't open, close or run smoothly — sectional, roller and tilt doors across ${suburb}.`,
      icon: "Wrench",
    },
    {
      title: "Spring & Cable Repairs",
      description:
        "Safe replacement of broken torsion springs and frayed lift cables — the single most common cause of a dead door.",
      icon: "Cable",
    },
    {
      title: "Motor & Opener Replacement",
      description:
        "Repair or replace worn-out openers with quality, warranty-backed motors, programmed and safety-tested.",
      icon: "Cpu",
    },
    {
      title: "Roller Door Repairs",
      description:
        "Realign, re-spring and service roller doors that stick, jam or have lost curtain tension.",
      icon: "Disc3",
    },
  ];

  if (flags.includes("commercial")) {
    cards.push({
      title: "Commercial & Industrial Doors",
      description:
        "High-cycle roller doors and shutters for warehouses, workshops and yards — repaired around your trading hours.",
      icon: "Building2",
    });
  }
  if (flags.includes("estate")) {
    cards.push({
      title: "Smart & Wi-Fi Opener Repairs",
      description:
        "App-controlled openers reprogrammed, re-paired and repaired — common on newer estate homes.",
      icon: "Cpu",
    });
  }
  if (flags.includes("olderStock")) {
    cards.push({
      title: "Older Tilt & Panel Doors",
      description:
        "Pivots, springs and hardware on decades-old tilt and single-panel doors — kept running, not needlessly replaced.",
      icon: "LayoutPanelTop",
    });
  }
  if (flags.includes("rentals")) {
    cards.push({
      title: "Rental & Landlord Repairs",
      description:
        "Fast turnaround for property managers and landlords, with clear written quotes and tax invoices.",
      icon: "FileText",
    });
  }
  if (flags.includes("boats")) {
    cards.push({
      title: "Oversized & Double Doors",
      description:
        "Wide and high openings for boats, caravans and dual-vehicle garages — correctly rated springs and motors.",
      icon: "Scale",
    });
  }

  cards.push(
    {
      title: "Emergency Repairs",
      description: `Door stuck open or shut? Priority response across ${suburb} to secure your home or business fast.`,
      icon: "Siren",
    },
    {
      title: "Servicing & Maintenance",
      description:
        "Routine tune-ups that keep your door quiet, balanced and safe — and stop small faults becoming breakdowns.",
      icon: "Settings",
    },
  );
  return cards;
}

function buildTrust(suburb: string, corridor: string, flags: Flag[]): TrustReason[] {
  const cards: TrustReason[] = [
    {
      title: "Genuinely local",
      description: `A Perth team that works ${corridor} every week — we know ${suburb}, and we're nearby rather than dispatched from across the city.`,
      icon: "MapPin",
    },
    {
      title: "Same-day response",
      description: `Most ${suburb} repairs are booked and finished the same day, with emergency call-outs prioritised.`,
      icon: "Zap",
    },
    {
      title: "Clear, upfront quotes",
      description:
        "Guide prices are published on this page and the final figure is confirmed before we start — no surprises on the invoice.",
      icon: "FileText",
    },
    {
      title: "One-visit repairs",
      description:
        "We arrive stocked for the common failures on all major brands, so you're not waiting days for a second visit.",
      icon: "BadgeCheck",
    },
  ];
  cards.push(
    flags.includes("olderStock")
      ? {
          title: "Honest repair-or-replace advice",
          description:
            "Older doors are usually worth repairing. We'll tell you plainly when they're not, and never push a new door you don't need.",
          icon: "LifeBuoy",
        }
      : {
          title: "After-service support",
          description: "Questions after we leave? We're a phone call away and happy to help.",
          icon: "LifeBuoy",
        },
  );
  cards.push({
    title: "Warranty support",
    description: "Workmanship and parts backed by warranty, with real people to call if anything needs a second look.",
    icon: "ShieldCheck",
  });
  return cards;
}

function buildProblems(flags: Flag[]) {
  const base = [
    {
      title: "Door won't open",
      description:
        "Usually a broken spring, snapped cable or motor fault — we find the real cause and get you moving again.",
      icon: "DoorClosed",
    },
    {
      title: "Door suddenly feels heavy",
      description:
        "The classic broken-spring symptom. Don't force it — the opener fails next. We replace springs in pairs and rebalance.",
      icon: "Scale",
    },
    {
      title: "Remote or keypad not working",
      description:
        "Flat batteries, lost programming or a failing receiver — we test, re-pair or replace, smart openers included.",
      icon: "BatteryWarning",
    },
    {
      title: "Door stuck halfway",
      description:
        "Often an obstruction, an off-track roller or a misaligned safety sensor stopping the door mid-travel.",
      icon: "TrafficCone",
    },
    {
      title: "Loud or noisy operation",
      description:
        "Grinding, banging or squealing points to worn rollers, loose hardware or springs needing attention.",
      icon: "Volume2",
    },
  ];
  base.push(
    flags.includes("commercial")
      ? {
          title: "Commercial door down",
          description:
            "A jammed roller stops trade — business call-outs are prioritised and scheduled around your hours.",
          icon: "Building2",
        }
      : {
          title: "Door off track",
          description:
            "A door that's jumped its tracks is a safety risk — we realign and repair the rollers and tracks.",
          icon: "Disc3",
        },
  );
  return base;
}

function makeSuburbPageV2(spec: SuburbSpec): ServiceSuburbPage {
  const { suburb, flags } = spec;
  const nearbyNames = spec.nearbySuburbs.map((l) => l.label);

  const standardFaqs: FAQ[] = [
    {
      question: `Do you repair garage doors in ${suburb}?`,
      answer: `Yes. Capital Garage Doors repairs residential${flags.includes("commercial") ? " and commercial" : ""} garage doors throughout ${suburb} and the surrounding suburbs, including same-day and emergency repairs — broken springs and cables, faulty motors and openers, off-track and noisy doors, and doors that won't open or close.`,
    },
    {
      question: `Can you repair garage door motors in ${suburb}?`,
      answer: `We do. We diagnose, repair and replace garage door motors and openers in ${suburb}, reprogram remotes and reset travel limits, and can recommend a suitable replacement unit if yours has reached the end of its life.`,
    },
    {
      question: "Do you service nearby suburbs?",
      answer: `Yes — we regularly work right across the area, including ${nearbyNames.slice(0, 6).join(", ")}.`,
    },
    {
      question: `How much does garage door repair cost in ${suburb}?`,
      answer:
        "The guide prices on this page cover our most common repairs, and they come straight from our current price list rather than being estimates. What you pay depends on the actual fault, the parts needed, your door type and whether it's an after-hours call-out — we confirm the final figure before starting any work.",
    },
    {
      question: `Do you offer emergency garage door repair in ${suburb}?`,
      answer: `Yes. If your door is stuck open and your home isn't secure, or stuck shut with a car trapped inside, tell us when you call — those are treated as emergency call-outs across ${suburb} and pushed to the front of the queue.`,
    },
    {
      question: `Which garage door brands do you repair in ${suburb}?`,
      answer: `All major Australian brands — ${BRANDS_DOORS} doors and more, plus openers and motors from ${BRANDS_OPENERS} and Grifco. If you're not sure what brand you have, send a photo with your quote request and we'll identify it and bring the right parts.`,
    },
    {
      question: `Do you supply and install new garage doors in ${suburb}?`,
      answer: `Yes — as well as repairs we supply and install new sectional, roller, tilt and custom garage doors across ${suburb}, including automatic openers. If a door is genuinely beyond economical repair we'll say so and quote a replacement after a free on-site measure.`,
    },
  ];

  return {
    slug: spec.slug,
    service: "Garage Door Repairs",
    suburb: spec.suburb,
    region: spec.region,
    nearbySuburbs: spec.nearbySuburbs,
    hero: {
      subtitle: spec.heroSubtitle,
      trustBadges: ["Local Perth Team", "Same-Day Response", "Emergency Repairs", "Warranty Support"],
    },
    directAnswer: spec.directAnswer,
    localIntro: spec.localIntro,
    availableServices: buildServices(suburb, flags),
    problems: buildProblems(flags),
    costGuidance: {
      intro: `The table above lists guide prices for the repairs we do most often in ${suburb}, taken from our current price list. What your job actually costs depends on the fault, the parts and your door — and we confirm it before any work starts.`,
      factors: [
        "The type of problem (a remote re-pair is very different to a spring replacement)",
        "Parts required and their quality (genuine vs aftermarket components)",
        "Your door type — sectional, roller, tilt or custom",
        "Single vs double door, and whether springs are replaced as a pair",
        "Urgency — standard booking vs after-hours emergency call-out",
        "Whether a repair will last, or a replacement is the smarter long-term option",
      ],
      note: "Describe the issue (or send a photo) with your quote request for a faster, more accurate estimate.",
    },
    whyChooseUs: buildTrust(suburb, spec.corridor, flags),
    relatedPages: [
      { label: "Garage Door Repairs Perth", href: "/garage-door-repairs-perth" },
      { label: "Garage Door Repair Cost Perth", href: "/garage-door-repair-cost-perth" },
      { label: "Emergency Garage Door Repairs Perth", href: "/emergency-garage-door-repairs-perth" },
      { label: "Garage Door Spring Repair Perth", href: "/garage-door-spring-repair-perth" },
      { label: "Garage Door Opener & Motor Repair Perth", href: "/garage-door-opener-repair-perth" },
      ...(flags.includes("commercial")
        ? [{ label: "Commercial Roller Doors Perth", href: "/commercial-roller-doors-perth" }]
        : []),
      { label: "Garage Door Installation Perth", href: "/garage-door-installation-perth" },
    ],
    faqs: [...standardFaqs, ...spec.specificFaqs],
    caseStudySlugs: spec.caseStudySlugs,
    seo: spec.seo,
  };
}

/* ------------------------------------------------------------------ *
 * Corridor shorthands
 * ------------------------------------------------------------------ */

const CANNING_CASES = [
  "garage-door-cable-replacement-willetton-perth",
  "buckled-roller-door-repair-cannington-perth",
  "sectional-garage-door-repair-thornlie-perth",
];
const SOUTHERN_CASES = [
  "emergency-garage-door-repair-southern-river-perth",
  "emergency-sectional-door-repair-canning-vale-perth",
  "roller-door-off-track-repair-gosnells-perth",
];
const ARMADALE_CASES = [
  "corroded-torsion-spring-replacement-armadale-perth",
  "roller-door-off-track-repair-gosnells-perth",
  "rusted-garage-door-spring-repair-kalamunda-perth",
];

export const serviceSuburbPagesBatch3: ServiceSuburbPage[] = [
  /* ================= CANNING RIVER CORRIDOR ================= */

  makeSuburbPageV2({
    slug: "garage-door-repairs-shelley",
    suburb: "Shelley",
    region: "Perth, WA",
    corridor: "the Canning River suburbs",
    flags: ["riverside", "boats"],
    nearbySuburbs: [
      { label: "Rossmoyne", href: "/service-areas" },
      { label: "Riverton", href: "/service-areas" },
      { label: "Willetton", href: "/service-areas" },
      { label: "Wilson", href: "/service-areas" },
      { label: "Ferndale", href: "/service-areas" },
      { label: "Cannington", href: "/garage-door-repairs-cannington" },
      { label: "Canning Vale", href: "/garage-door-repairs-canning-vale" },
    ],
    heroSubtitle:
      "Same-day garage door repairs for Shelley's riverside homes — including the wide, high openings that boats, caravans and dual-vehicle garages need.",
    directAnswer:
      "Capital Garage Doors provides same-day garage door repairs in Shelley, including broken springs and cables on wide double doors, faulty motors and openers, off-track and noisy doors, and doors that won't open or close.",
    localIntro: [
      "Shelley's streets curve down to the Canning River foreshore, and the homes here reflect it — generous 1970s and 80s builds on big blocks, many extended or rebuilt, and a lot of them housing a boat or caravan alongside the cars. Wide, high garage openings are far more common in Shelley than in most Perth suburbs.",
      "That matters for repairs. A double-width door carries considerably more weight than a standard single, so its springs work harder and fail sooner, and an under-rated spring or motor fitted by someone cutting corners will keep failing. We size springs to the actual door and fit motors rated for the load, which is why our Shelley repairs tend to stay fixed.",
      "Being close to the water adds a second factor: the damp air rolling off the river and the foreshore reserve accelerates surface rust on springs, cables and track hardware, particularly on doors that spend the day in shade. We check and treat that as part of any visit rather than leaving it for you to discover next year.",
      "We're through this pocket constantly — Shelley, Rossmoyne, Riverton, Willetton, Wilson and Ferndale sit within a couple of minutes of each other, and Cannington and Canning Vale are on our daily run — so same-day bookings here are routine rather than a promise we hope to keep.",
      `Whatever's on your door, we carry parts for the major Australian brands, including ${BRANDS_MARKER}, Gliderol and Dominator, plus ${BRANDS_OPENERS} openers and motors, so most Shelley repairs are diagnosed and finished in a single visit.`,
    ],
    specificFaqs: [
      {
        question: "Can you repair extra-wide or high garage doors in Shelley?",
        answer:
          "Yes — oversized openings are common in Shelley and they're routine work for us. Wider and taller doors need heavier, correctly rated springs and a motor with enough pulling power; fitting standard parts to an oversized door is the main reason they keep failing. We measure and match the hardware to your actual door.",
      },
      {
        question: "Does being near the river affect my garage door?",
        answer:
          "It does. Damp air off the Canning River and the foreshore settles on springs, cables and track hardware and works away at the protective coating, so rust shows up earlier here than it does further inland. A yearly service — clean, inspect, lubricate — is the cheapest way to slow it, and we fit corrosion-resistant components where hardware needs replacing.",
      },
      {
        question: "How much does it cost to have a garage door serviced?",
        answer:
          "Our current service and tune-up price is listed in the guide-price table on this page. A service covers a full safety and balance check, adjusting the springs and travel limits, lubricating moving parts and tightening hardware — it's the step that keeps a door out of the repair queue, and it's the cheapest visit we do.",
      },
    ],
    caseStudySlugs: CANNING_CASES,
    seo: {
      title: "Garage Door Repairs Shelley | Same-Day Local Service",
      description:
        "Same-day garage door repairs in Shelley — springs, motors, cables & wide double doors. Guide prices listed. Covering Rossmoyne, Riverton & Wilson.",
    },
  }),

  makeSuburbPageV2({
    slug: "garage-door-repairs-rossmoyne",
    suburb: "Rossmoyne",
    region: "Perth, WA",
    corridor: "the Canning River suburbs",
    flags: ["riverside"],
    nearbySuburbs: [
      { label: "Shelley", href: "/service-areas" },
      { label: "Riverton", href: "/service-areas" },
      { label: "Willetton", href: "/service-areas" },
      { label: "Bull Creek", href: "/service-areas" },
      { label: "Ferndale", href: "/service-areas" },
      { label: "Cannington", href: "/garage-door-repairs-cannington" },
      { label: "Canning Vale", href: "/garage-door-repairs-canning-vale" },
    ],
    heroSubtitle:
      "Same-day garage door repairs for Rossmoyne — busy family homes, renovated properties and double doors that cycle half a dozen times a day.",
    directAnswer:
      "Capital Garage Doors provides same-day garage door repairs in Rossmoyne, including broken springs and cables, faulty motors and smart openers, doors that have gone out of balance, and doors that won't open or close.",
    localIntro: [
      "Rossmoyne is a suburb people move into and stay in — the school catchment keeps family homes tightly held, and that shows up in the garages. Doors here work hard: school runs, sport, the commute over the Leach Highway, often five or six cycles a day, every day, for years.",
      "High cycle counts are the reason springs fail. A torsion spring has a rated life measured in cycles, not years, so a Rossmoyne family door reaches that number far sooner than a quiet single-car garage would. The tell-tale signs are a door that's slowly become heavy to lift by hand, or an opener that strains and reverses — both worth acting on before the spring lets go entirely.",
      "The other pattern here is renovation. A lot of Rossmoyne homes have been extended or rebuilt, which often means a brand-new sectional door and smart opener bolted to an older frame and opening. When those installs go wrong it's usually alignment, not the door — we re-square the tracks and rebalance rather than replacing perfectly good hardware.",
      "We work this riverside pocket continually, so Rossmoyne, Shelley, Riverton, Willetton, Bull Creek and Ferndale are all easy same-day calls, with Cannington and Canning Vale on our regular route.",
      `We carry parts for all the major Australian brands, including ${BRANDS_MARKER}, Gliderol and Dominator, plus ${BRANDS_OPENERS} openers, so most Rossmoyne repairs are completed in one visit.`,
    ],
    specificFaqs: [
      {
        question: "Is it worth repairing a garage door, or should I replace it?",
        answer:
          "If the door panels and frame are sound, repairing is almost always the better value — springs, cables, rollers and openers are wear items, and replacing them restores the door completely for a fraction of a new one. Replacement genuinely makes sense when panels are rusted or cracked, the door has been badly bent, or you want a different style. We'll show you which situation you're in rather than just quoting a new door.",
      },
      {
        question: "My door has slowly become heavy to lift — what does that mean?",
        answer:
          "That's spring fatigue, and it's the most common problem we see on busy Rossmoyne family doors. A correctly balanced door should lift easily by hand; as the springs weaken the motor takes up the extra load until it burns out too. Getting the springs replaced at that point is a straightforward job — waiting until one snaps often adds an opener to the bill.",
      },
      {
        question: "Can you work on a new door fitted during a renovation?",
        answer:
          "Yes. We regularly service and correct doors installed as part of a renovation, including re-squaring tracks on an older opening, rebalancing after a rebuild, and reprogramming or replacing openers. If your door is still within a builder's or installer's warranty we'll tell you so you can claim it rather than pay us.",
      },
    ],
    caseStudySlugs: CANNING_CASES,
    seo: {
      title: "Garage Door Repairs Rossmoyne | Same-Day Local Service",
      description:
        "Same-day garage door repairs in Rossmoyne — springs, motors, cables & smart openers. Guide prices listed. Covering Shelley, Riverton & Bull Creek.",
    },
  }),

  makeSuburbPageV2({
    slug: "garage-door-repairs-parkwood",
    suburb: "Parkwood",
    region: "Perth, WA",
    corridor: "the Canning River suburbs",
    flags: ["olderStock"],
    nearbySuburbs: [
      { label: "Lynwood", href: "/service-areas" },
      { label: "Ferndale", href: "/service-areas" },
      { label: "Riverton", href: "/service-areas" },
      { label: "Langford", href: "/service-areas" },
      { label: "Willetton", href: "/service-areas" },
      { label: "Thornlie", href: "/garage-door-repairs-thornlie" },
      { label: "Cannington", href: "/garage-door-repairs-cannington" },
      { label: "Canning Vale", href: "/garage-door-repairs-canning-vale" },
    ],
    heroSubtitle:
      "Same-day garage door repairs in Parkwood — original 1970s and 80s doors kept running, and replaced honestly only when they're genuinely finished.",
    directAnswer:
      "Capital Garage Doors provides same-day garage door repairs in Parkwood, including broken springs and cables, worn tilt and roller doors, failing motors and openers, and doors that won't open or close properly.",
    localIntro: [
      "Parkwood was built out through the 1970s and 80s, and a surprising number of its garage doors are still the originals. Forty-year-old hardware doesn't fail dramatically — it fades: the door gets heavier, the opener gets louder, the travel gets jerkier, and then one morning a spring goes and nothing moves at all.",
      "That means most of our Parkwood work is wear-item replacement rather than anything exotic — springs that have run out of cycles, cables that have stretched and frayed at the drum, rollers worn flat, and openers from an era when nobody expected them to still be running. Nearly all of it is repairable, and repairing is nearly always the better value.",
      "We're straight with people here about repair versus replace, because Parkwood doors sit right at the age where some companies will quote a whole new door by default. If your panels and frame are sound, you don't need one — and if the door genuinely is finished, we'll show you why rather than just handing over a number.",
      "Same-day calls cover Parkwood, Lynwood, Ferndale, Riverton and Langford, with Thornlie, Cannington and Canning Vale all on routes we already drive daily.",
      `We carry parts for all the major Australian brands, including ${BRANDS_MARKER}, Gliderol and Dominator, plus ${BRANDS_OPENERS} openers — including for older doors people assume are unserviceable.`,
    ],
    specificFaqs: [
      {
        question: "My door was installed in the 1980s — can you still get parts?",
        answer:
          "Almost always, yes. Springs, cables, rollers and hinges are standardised enough that we can match correctly rated replacements for doors from the 70s and 80s, and where an obsolete opener can't be repaired we fit a modern unit to the existing door. A full replacement is only necessary when the door itself has failed.",
      },
      {
        question: "Is it worth repairing a garage door this old?",
        answer:
          "Usually yes. Age alone doesn't write off a door — what matters is whether the panels, frame and tracks are structurally sound. Older Parkwood doors were solidly built, and a spring and cable replacement typically brings one back to running like new for a fraction of a replacement. We'll only recommend a new door when repair genuinely isn't the sensible option.",
      },
      {
        question: "What's the average lifespan of a garage door motor?",
        answer:
          "Most openers last somewhere between ten and fifteen years, though that depends heavily on how many times a day the door cycles and whether the door has been kept balanced. An opener forced to haul a door with weak springs will die years early — which is why we always check the springs before condemning a motor.",
      },
    ],
    caseStudySlugs: CANNING_CASES,
    seo: {
      title: "Garage Door Repairs Parkwood | Same-Day Local Service",
      description:
        "Same-day garage door repairs in Parkwood — springs, cables, motors & older tilt doors. Guide prices listed. Covering Lynwood, Ferndale & Riverton.",
    },
  }),

  makeSuburbPageV2({
    slug: "garage-door-repairs-langford",
    suburb: "Langford",
    region: "Perth, WA",
    corridor: "the Canning suburbs",
    flags: ["olderStock", "rentals"],
    nearbySuburbs: [
      { label: "Lynwood", href: "/service-areas" },
      { label: "Parkwood", href: "/service-areas" },
      { label: "Ferndale", href: "/service-areas" },
      { label: "Thornlie", href: "/garage-door-repairs-thornlie" },
      { label: "Cannington", href: "/garage-door-repairs-cannington" },
      { label: "Gosnells", href: "/garage-door-repairs-gosnells" },
      { label: "Canning Vale", href: "/garage-door-repairs-canning-vale" },
    ],
    heroSubtitle:
      "Same-day garage door repairs in Langford for homeowners, landlords and property managers — clear written quotes, fast turnaround, tax invoices supplied.",
    directAnswer:
      "Capital Garage Doors provides same-day garage door repairs in Langford, including broken springs and cables, worn motors and openers, older tilt and roller doors, and doors that won't open or close properly.",
    localIntro: [
      "Langford sits between Thornlie and Cannington on the Nicholson Road corridor, and it's a suburb of solid, unpretentious homes — many built in the 70s and 80s, and a good number of them tenanted. That mix shapes the work we do here.",
      "For owner-occupiers it's the familiar list: springs that have run out of cycles, cables fraying at the drum, an opener that's grown loud and slow, or a door that's dropped off its track. Most of it is same-day work, and most of it is far cheaper than people expect — which is why the guide prices are published on this page rather than hidden behind a phone call.",
      "For landlords and property managers, the job is really about turnaround and paperwork. A garage door that won't close is an urgent security problem for a tenant, so we prioritise those calls, quote in writing before proceeding, and supply a proper tax invoice — no chasing us for documentation afterwards.",
      "We're in this corridor daily, so Langford, Lynwood, Parkwood and Ferndale are quick calls, with Thornlie, Cannington, Gosnells and Canning Vale on our regular runs.",
      `We carry parts for all the major Australian brands, including ${BRANDS_MARKER}, Gliderol and Dominator, plus ${BRANDS_OPENERS} openers, so most Langford repairs are completed on the first visit.`,
    ],
    specificFaqs: [
      {
        question: "Do you work with landlords and property managers in Langford?",
        answer:
          "Regularly. We can liaise directly with the tenant to arrange access, send the written quote to the owner or manager for approval before doing the work, and issue a tax invoice on completion. Urgent jobs — a door that won't close and leaves the property insecure — are treated as priority call-outs.",
      },
      {
        question: "Can a damaged garage door be repaired, or does the whole door need replacing?",
        answer:
          "Individual sections can usually be repaired or replaced without touching the rest of the door. A single dented or split panel on a sectional door can often be swapped, a bent roller-door curtain can sometimes be straightened, and off-track doors are realigned rather than replaced. Full replacement is only necessary when the damage runs across multiple panels or has distorted the frame.",
      },
      {
        question: "How quickly can you get to Langford?",
        answer:
          "Usually the same day. Langford sits in the middle of a corridor we drive constantly — Thornlie, Cannington and Gosnells are all minutes away — so there's often a technician nearby already. Emergency call-outs where the property isn't secure are prioritised.",
      },
    ],
    caseStudySlugs: CANNING_CASES,
    seo: {
      title: "Garage Door Repairs Langford | Same-Day Local Service",
      description:
        "Same-day garage door repairs in Langford — springs, motors, cables & roller doors. Guide prices listed, landlord invoices supplied. Covering Lynwood & Parkwood.",
    },
  }),

  makeSuburbPageV2({
    slug: "garage-door-repairs-lynwood",
    suburb: "Lynwood",
    region: "Perth, WA",
    corridor: "the Canning suburbs",
    flags: ["olderStock"],
    nearbySuburbs: [
      { label: "Langford", href: "/service-areas" },
      { label: "Parkwood", href: "/service-areas" },
      { label: "Ferndale", href: "/service-areas" },
      { label: "Riverton", href: "/service-areas" },
      { label: "Thornlie", href: "/garage-door-repairs-thornlie" },
      { label: "Cannington", href: "/garage-door-repairs-cannington" },
      { label: "Canning Vale", href: "/garage-door-repairs-canning-vale" },
    ],
    heroSubtitle:
      "Same-day garage door repairs in Lynwood — original tilt doors, tired springs and worn openers on established family homes, fixed properly.",
    directAnswer:
      "Capital Garage Doors provides same-day garage door repairs in Lynwood, including broken springs and cables, older tilt and single-panel doors, failing motors and openers, and doors that won't open or close.",
    localIntro: [
      "Lynwood is one of those established Canning suburbs where the housing stock barely changes — brick-and-tile family homes built through the 70s, wide streets, and garages that were designed for one car and now do duty for two plus everything else.",
      "The doors reflect that era. We still see plenty of original one-piece tilt doors here, along with early sectional doors and openers that predate most safety features now taken for granted. They're repairable — tilt-door pivots, arms and springs are all replaceable — but they need someone who's actually worked on them before, not someone who reaches for a replacement quote by default.",
      "The other Lynwood job we do often is the opener upgrade: the door itself is sound but the motor is loud, slow and has no auto-reverse. Fitting a modern quiet opener to a good existing door transforms it, adds a proper safety stop, and costs a fraction of a full replacement.",
      "Same-day calls cover Lynwood, Langford, Parkwood, Ferndale and Riverton, with Thornlie, Cannington and Canning Vale on daily routes.",
      `We carry parts for all the major Australian brands, including ${BRANDS_MARKER}, Gliderol and Dominator, plus ${BRANDS_OPENERS} openers, so most Lynwood repairs are finished in a single visit.`,
    ],
    specificFaqs: [
      {
        question: "Can you still repair an old one-piece tilt door?",
        answer:
          "Yes — tilt doors are very repairable. The pivots, arms, springs and cables are all replaceable parts, and provided the door panel itself hasn't rusted through or been bent out of shape, a tilt door can usually be brought back to smooth operation. We've kept plenty of Lynwood tilt doors going long past the point other companies would have written them off.",
      },
      {
        question: "Can I fit a modern opener to my existing door?",
        answer:
          "In most cases, yes — and it's one of the most worthwhile upgrades on an older Lynwood door. If the door is structurally sound and balances correctly, we fit a modern quiet opener, program your remotes, set the travel limits and safety reverse, and take the old unit away. You get a far better door for a fraction of the cost of replacing it.",
      },
      {
        question: "What's the average lifespan of a garage door motor?",
        answer:
          "Ten to fifteen years is typical, but it depends on how hard the motor has had to work. An opener dragging a door whose springs have weakened wears out much faster, so a motor that's failed early is often a symptom rather than the root cause. We always check the door's balance before recommending a new opener.",
      },
    ],
    caseStudySlugs: CANNING_CASES,
    seo: {
      title: "Garage Door Repairs Lynwood | Same-Day Local Service",
      description:
        "Same-day garage door repairs in Lynwood — springs, motors, cables & older tilt doors. Guide prices listed. Covering Langford, Parkwood & Ferndale.",
    },
  }),

  makeSuburbPageV2({
    slug: "garage-door-repairs-ferndale",
    suburb: "Ferndale",
    region: "Perth, WA",
    corridor: "the Canning River suburbs",
    flags: ["olderStock"],
    nearbySuburbs: [
      { label: "Lynwood", href: "/service-areas" },
      { label: "Riverton", href: "/service-areas" },
      { label: "Parkwood", href: "/service-areas" },
      { label: "Shelley", href: "/service-areas" },
      { label: "Wilson", href: "/service-areas" },
      { label: "Cannington", href: "/garage-door-repairs-cannington" },
      { label: "Thornlie", href: "/garage-door-repairs-thornlie" },
    ],
    heroSubtitle:
      "Same-day garage door repairs in Ferndale — a small suburb we pass through constantly, so help is usually only minutes away.",
    directAnswer:
      "Capital Garage Doors provides same-day garage door repairs in Ferndale, including broken springs and cables, worn motors and openers, off-track and noisy doors, and doors that won't open or close properly.",
    localIntro: [
      "Ferndale is a compact pocket tucked between Lynwood, Riverton and the Canning River, and it's easy to overlook — which is exactly why a lot of Perth-wide companies treat it as an afterthought and quote long lead times. We're through here constantly on the way to Cannington and Riverton, so Ferndale calls are genuinely quick for us.",
      "The homes are mostly 70s and 80s, on modest blocks with single or narrow double garages, and the doors show typical wear for that age: springs at the end of their cycle life, cables frayed where they wind onto the drum, rollers worn enough to make the door grumble, and openers well past their intended service life.",
      "Tight driveways are worth mentioning too. Several Ferndale garages open almost straight onto the street, so a door stuck halfway is more than an inconvenience — it can block the car in and leave the house open. Those are the calls we push to the front of the queue.",
      "Same-day coverage takes in Ferndale, Lynwood, Riverton, Parkwood, Shelley and Wilson, with Cannington and Thornlie on our daily runs.",
      `We carry parts for all the major Australian brands, including ${BRANDS_MARKER}, Gliderol and Dominator, plus ${BRANDS_OPENERS} openers, so most Ferndale repairs are done in one visit.`,
    ],
    specificFaqs: [
      {
        question: "Do you actually service Ferndale, or just the bigger suburbs nearby?",
        answer:
          "We genuinely service Ferndale — it sits directly between Lynwood, Riverton and Cannington, all suburbs we work in daily, so there's usually a technician within a few minutes. Small suburbs often get long lead times from Perth-wide operators; that's not the case here.",
      },
      {
        question: "Can a damaged garage door be repaired?",
        answer:
          "Usually, yes. Dented or split individual panels on a sectional door can often be replaced on their own, roller-door curtains can sometimes be straightened, and a door that's come off its tracks is realigned rather than replaced. We only recommend a full replacement when damage spans several panels or has distorted the frame.",
      },
      {
        question: "My door is stuck halfway and blocking the driveway — can you come today?",
        answer:
          "Yes, that's exactly the kind of call we prioritise. A door stuck part-open blocks your car in and leaves the house insecure, so tell us that when you get in touch. Please don't force it — a door stuck mid-travel usually means a broken spring, an off-track roller or a sensor fault, and forcing it can bend panels and make the repair bigger.",
      },
    ],
    caseStudySlugs: CANNING_CASES,
    seo: {
      title: "Garage Door Repairs Ferndale | Same-Day Local Service",
      description:
        "Same-day garage door repairs in Ferndale — springs, motors, cables & roller doors. Guide prices listed. Covering Lynwood, Riverton, Parkwood & Shelley.",
    },
  }),

  makeSuburbPageV2({
    slug: "garage-door-repairs-wilson",
    suburb: "Wilson",
    region: "Perth, WA",
    corridor: "the Canning River suburbs",
    flags: ["rentals", "riverside"],
    nearbySuburbs: [
      { label: "Shelley", href: "/service-areas" },
      { label: "Ferndale", href: "/service-areas" },
      { label: "Bentley", href: "/service-areas" },
      { label: "St James", href: "/service-areas" },
      { label: "Cannington", href: "/garage-door-repairs-cannington" },
      { label: "Lathlain", href: "/garage-door-repairs-lathlain" },
      { label: "Thornlie", href: "/garage-door-repairs-thornlie" },
    ],
    heroSubtitle:
      "Same-day garage door repairs in Wilson — owner-occupied homes and Curtin-adjacent rentals alike, with written quotes and fast turnaround.",
    directAnswer:
      "Capital Garage Doors provides same-day garage door repairs in Wilson, including broken springs and cables, faulty motors and openers, doors that won't close and leave a property insecure, and doors off their tracks.",
    localIntro: [
      "Wilson wraps around the Canning River Regional Park with Curtin University just up the road, and that combination gives it an unusual mix: long-held family homes alongside a substantial number of rentals and investment properties.",
      "For owners, the work is the familiar Perth list — torsion springs that have reached the end of their cycle life, cables frayed at the drum, openers that have grown loud and unreliable, and doors that have drifted off their tracks. For investors and property managers, the priority is different: a door that won't close is a security problem for the tenant, so it needs a fast fix, a written quote before the work, and a proper invoice afterwards. We handle it that way as standard.",
      "Backing onto the regional park brings a bit of extra damp, particularly on doors that sit in shade most of the day, so surface rust on springs and track hardware shows up earlier here than on drier blocks. We check for it while we're on site rather than leaving it to surprise you later.",
      "Same-day calls cover Wilson, Shelley, Ferndale, Bentley and St James, with Cannington, Lathlain and Thornlie on our regular routes.",
      `We carry parts for all the major Australian brands, including ${BRANDS_MARKER}, Gliderol and Dominator, plus ${BRANDS_OPENERS} openers, so most Wilson repairs are completed on the first visit.`,
    ],
    specificFaqs: [
      {
        question: "Do you handle repairs on rental properties in Wilson?",
        answer:
          "Yes, regularly. We can arrange access directly with the tenant, send the written quote to the owner or property manager for approval before starting, and provide a tax invoice on completion. If the door won't close and the property is insecure, tell us — that's a priority call-out.",
      },
      {
        question: "What is the most common problem with garage doors?",
        answer:
          "Broken torsion springs, by a wide margin. They carry the door's weight on every single cycle and eventually fail, almost always without warning — the door suddenly feels extremely heavy or won't lift at all. Worn cables, failed openers and doors off their tracks account for most of the rest. All are typically same-day repairs.",
      },
      {
        question: "My garage door won't close and the house isn't secure — what should I do?",
        answer:
          "Call us and say that up front; we treat an insecure property as an emergency. In the meantime, check nothing is blocking the safety sensors near the floor and that their lights are aligned, as a misaligned sensor is a common and quick fix. Don't leave the door propped or forced — if a spring or cable has failed, the door can drop.",
      },
    ],
    caseStudySlugs: CANNING_CASES,
    seo: {
      title: "Garage Door Repairs Wilson | Same-Day Local Service",
      description:
        "Same-day garage door repairs in Wilson — springs, motors, cables & roller doors. Guide prices listed, landlord invoices supplied. Covering Shelley & Bentley.",
    },
  }),

  /* ================= SOUTHERN GROWTH CORRIDOR ================= */

  makeSuburbPageV2({
    slug: "garage-door-repairs-harrisdale",
    suburb: "Harrisdale",
    region: "Perth, WA",
    corridor: "the southern growth corridor",
    flags: ["estate"],
    nearbySuburbs: [
      { label: "Piara Waters", href: "/service-areas" },
      { label: "Forrestdale", href: "/service-areas" },
      { label: "Southern River", href: "/garage-door-repairs-southern-river" },
      { label: "Canning Vale", href: "/garage-door-repairs-canning-vale" },
      { label: "Treeby", href: "/service-areas" },
      { label: "Armadale", href: "/garage-door-repairs-armadale" },
      { label: "Thornlie", href: "/garage-door-repairs-thornlie" },
    ],
    heroSubtitle:
      "Same-day garage door repairs in Harrisdale — big double doors and smart Wi-Fi openers on newer estate homes, fixed by technicians who work here weekly.",
    directAnswer:
      "Capital Garage Doors provides same-day garage door repairs in Harrisdale, including broken springs and cables on large double doors, smart and Wi-Fi opener faults, safety-sensor problems, and doors that won't open or close.",
    localIntro: [
      "Harrisdale is one of Perth's newer suburbs and it's built at scale — wide streets of family homes off Nicholson and Ranford Roads, almost all with big double sectional doors and an automatic opener fitted from day one.",
      "Newer doesn't mean trouble-free, it just changes what breaks. Estate doors are large and heavy, they cycle constantly with two working adults and school runs, and the builder-grade springs fitted at handover typically reach the end of their cycle life somewhere between year five and year ten. That's exactly the age much of Harrisdale is hitting now, which is why spring replacements are our most common job here.",
      "The other Harrisdale speciality is smart openers. Wi-Fi and app-controlled units are standard on these homes, and when they misbehave it's often not the motor at all — it's lost pairing, a dropped network connection, or safety sensors nudged out of alignment by a bike or bin. We diagnose those properly instead of selling you a replacement motor you don't need.",
      "We're through this corridor every week, so Harrisdale, Piara Waters, Forrestdale and Treeby are easy same-day calls, with Southern River, Canning Vale, Armadale and Thornlie on our regular routes.",
      `We carry parts for all the major Australian brands, including ${BRANDS_MARKER}, Gliderol and Dominator, plus ${BRANDS_OPENERS} openers, so most Harrisdale repairs are finished in one visit.`,
    ],
    specificFaqs: [
      {
        question: "My house is only a few years old — why has the garage door already failed?",
        answer:
          "Because springs wear by cycles, not years. A large double door on a busy Harrisdale family home can easily cycle four or five times a day, so the builder-fitted springs reach the end of their rated life much sooner than most people expect — commonly between five and ten years. It's normal wear rather than a fault, and replacing the springs restores the door completely.",
      },
      {
        question: "Can you fix a smart or Wi-Fi garage door opener?",
        answer:
          "Yes — they're everyday work in Harrisdale. We re-pair remotes and phone apps, reconnect units that have dropped off the network, reset travel limits, realign safety sensors and repair or replace the motor itself when that's genuinely the fault. Very often the motor is fine and the problem is pairing or sensors.",
      },
      {
        question: "Is my garage door still under builder's warranty?",
        answer:
          "It might be, and we'll tell you if we think so rather than charging you. Doors and openers on newer estate homes often carry a manufacturer or installer warranty for several years, though that usually excludes normal wear items and damage. If your door looks like a warranty claim, we'll say so before doing any chargeable work.",
      },
      {
        question: "What is the most common problem with garage doors?",
        answer:
          "Broken torsion springs are the number one call-out everywhere in Perth, and in newer estates like Harrisdale they arrive right on schedule as the original springs run out of cycles. After that it's opener and sensor faults, worn cables, and doors knocked off their tracks. Nearly all of these are same-day repairs.",
      },
    ],
    caseStudySlugs: SOUTHERN_CASES,
    seo: {
      // 2026-08-25 pre-publish refactor — lockstep with scripts/enhance-harrisdale-page.ts
      // (HARRISDALE_SEO). Same price-transparency battleground as Piara Waters
      // (Jim's ranks on "No hidden fees, upfront pricing"); "fixed price" also
      // differentiates the title from the neighbouring Piara Waters page.
      title: "Garage Door Repairs Harrisdale | Same-Day, Fixed Prices",
      description:
        "Same-day garage door repairs in Harrisdale — estate-home springs, cables and smart Wi-Fi openers, quoted as a fixed price. Also Piara Waters & Forrestdale.",
    },
  }),

  makeSuburbPageV2({
    slug: "garage-door-repairs-piara-waters",
    suburb: "Piara Waters",
    region: "Perth, WA",
    corridor: "the southern growth corridor",
    flags: ["estate"],
    nearbySuburbs: [
      { label: "Harrisdale", href: "/service-areas" },
      { label: "Forrestdale", href: "/service-areas" },
      { label: "Treeby", href: "/service-areas" },
      { label: "Southern River", href: "/garage-door-repairs-southern-river" },
      { label: "Canning Vale", href: "/garage-door-repairs-canning-vale" },
      { label: "Armadale", href: "/garage-door-repairs-armadale" },
      { label: "Success", href: "/garage-door-repairs-success" },
    ],
    heroSubtitle:
      "Same-day garage door repairs in Piara Waters — newer estate homes, heavy double doors and app-controlled openers, all handled locally.",
    directAnswer:
      "Capital Garage Doors provides same-day garage door repairs in Piara Waters, including broken springs on large double doors, smart and Wi-Fi opener faults, safety-sensor issues, noisy doors, and doors that won't open or close.",
    localIntro: [
      "Piara Waters is about as new as Perth suburbs get — estate after estate of family homes off Armadale Road, most fitted with wide double sectional doors and an automatic opener from the day the keys were handed over.",
      "The earliest of those estates are now well past the ten-year mark, and that's when the original hardware starts asking for attention. Builder-grade springs reach the end of their rated cycle life, cables begin fraying where they wind onto the drum, and openers that have hauled a heavy door several times a day for a decade start straining or reversing for no obvious reason.",
      "Ongoing construction nearby adds a wrinkle that's specific to growth suburbs: fine sand and site dust settle into tracks, rollers and photo-eye sensors. We see doors here that grind or stop mid-travel purely because the tracks are packed with grit and the sensors are dusted over — a clean and realign fixes it, and no parts are needed at all.",
      "We work this corridor weekly, so Piara Waters, Harrisdale, Forrestdale and Treeby are straightforward same-day calls, with Southern River, Canning Vale, Armadale and Success on our regular routes.",
      `We carry parts for all the major Australian brands, including ${BRANDS_MARKER}, Gliderol and Dominator, plus ${BRANDS_OPENERS} openers, so most Piara Waters repairs are completed in a single visit.`,
    ],
    specificFaqs: [
      {
        question: "Do you cover Piara Waters, or is it too far out?",
        answer:
          "We cover it properly — Piara Waters sits in a corridor we service every week alongside Harrisdale, Forrestdale, Southern River and Armadale, so same-day appointments are normal rather than exceptional. Being an outer suburb doesn't mean waiting days for us.",
      },
      {
        question: "My door grinds or stops halfway but nothing looks broken — why?",
        answer:
          "In newer estates this is very often sand and building dust rather than a mechanical failure. Grit packs into the tracks and rollers, making the door drag until the opener's safety cut-out stops it, and dust on the photo-eye sensors can stop the door closing at all. A clean, realign and lubricate usually fixes it without replacing a single part.",
      },
      {
        question: "Can you repair app-controlled and Wi-Fi openers?",
        answer:
          "Yes. Nearly every home here has one, and most of the faults we attend are pairing, connectivity or sensor alignment rather than a failed motor. We re-pair remotes and apps, reconnect units to the network, reset travel limits and realign sensors — and repair or replace the motor only when it genuinely is the problem.",
      },
      {
        question: "How long do garage door springs last on a new home?",
        answer:
          "Springs are rated in cycles rather than years, so it depends on how often the door opens. On a busy Piara Waters family home cycling four or five times a day, the original builder-fitted springs commonly reach their limit somewhere between five and ten years. That's normal wear, and replacing them brings the door back to as-new operation.",
      },
    ],
    caseStudySlugs: SOUTHERN_CASES,
    seo: {
      // 2026-08-23 pre-publish refactor — lockstep with scripts/enhance-piara-waters-page.ts
      // (PIARA_WATERS_SEO). This SERP competes on price transparency (Jim's ranks on
      // "No hidden fees, upfront pricing"), which the old title never mentioned.
      title: "Garage Door Repairs Piara Waters | Same-Day, Upfront Prices",
      description:
        "Same-day garage door repairs in Piara Waters — estate-home springs, cables, motors and dusty sensors, guide prices listed. Also Harrisdale & Forrestdale.",
    },
  }),

  makeSuburbPageV2({
    slug: "garage-door-repairs-forrestdale",
    suburb: "Forrestdale",
    region: "Perth, WA",
    corridor: "the southern growth corridor",
    flags: ["commercial", "estate"],
    nearbySuburbs: [
      { label: "Harrisdale", href: "/service-areas" },
      { label: "Piara Waters", href: "/service-areas" },
      { label: "Haynes", href: "/service-areas" },
      { label: "Hilbert", href: "/service-areas" },
      { label: "Armadale", href: "/garage-door-repairs-armadale" },
      { label: "Southern River", href: "/garage-door-repairs-southern-river" },
      { label: "Canning Vale", href: "/garage-door-repairs-canning-vale" },
    ],
    heroSubtitle:
      "Garage door and commercial roller door repairs in Forrestdale — from big shed doors on semi-rural blocks to high-cycle units in the Forrestdale Business Park.",
    directAnswer:
      "Capital Garage Doors repairs residential garage doors, large shed roller doors and commercial roller doors and shutters across Forrestdale, including broken springs and cables, failed motors, damaged guides, and doors that won't open or close.",
    localIntro: [
      "Forrestdale is really three places at once, and each one needs something different from us. There's the Forrestdale Business Park with its warehouses and workshops, the semi-rural blocks around Forrestdale Lake with their big sheds and workshops, and the newer housing spilling across from Harrisdale, Haynes and Hilbert.",
      "In the Business Park, roller doors and shutters are production equipment — they cycle dozens of times a day, cop the occasional forklift or truck knock, and cost real money for every hour they're out of action. We repair and re-tension curtains, replace worn barrels and springs, straighten bent guides and service or replace industrial motors, and we can schedule outside your operating hours so a repair doesn't shut you down mid-trade.",
      "On the semi-rural blocks it's the big shed doors: wide, heavy curtains that need correctly rated springs and a motor with the pulling power to match. Under-sprung shed doors chew through openers, so getting the balance right is usually the actual fix rather than fitting yet another motor.",
      "And in the newer housing pockets it's the standard estate pattern — original springs reaching the end of their cycle life, dusty tracks and sensors from nearby construction, and smart openers that have lost their pairing.",
      `Whatever the door, we carry parts for the major Australian brands, including ${BRANDS_MARKER}, Gliderol and Dominator, plus ${BRANDS_OPENERS} openers, along with commercial-grade springs, barrels and motors for industrial doors.`,
    ],
    specificFaqs: [
      {
        question: "Do you repair commercial roller doors in the Forrestdale Business Park?",
        answer:
          "Yes — the Business Park is regular work for us. We repair and re-tension roller curtains, replace worn springs and barrels, straighten guides after forklift or vehicle damage, and service or replace industrial motors. We can also set up a recurring service schedule if door downtime seriously disrupts your operation.",
      },
      {
        question: "Can you service several doors on one site in a single visit?",
        answer:
          "Yes, and it's the sensible way to do it. We inspect and service every door on the premises in one scheduled visit — springs, curtains, guides, motors and safety function — flag anything close to failure, and quote any repairs before carrying them out, so you get one visit and one invoice instead of a series of emergencies.",
      },
      {
        question: "Do you repair large shed and workshop roller doors?",
        answer:
          "Regularly — they're a big part of our Forrestdale work. Oversized curtains need heavier, correctly rated springs, and often a stronger motor than a standard domestic unit. An under-sprung shed door destroys openers, so we correct the balance rather than just fitting another motor and hoping.",
      },
      {
        question: "Can you work outside our business hours?",
        answer:
          "Yes. Early-morning, after-hours and weekend slots are available for Forrestdale businesses so a repair doesn't cost you a day's trade. For urgent failures — a door stuck open overnight, or stuck shut with vehicles or stock inside — we treat it as an emergency call-out.",
      },
    ],
    caseStudySlugs: [
      "commercial-roller-door-repair-kewdale-perth",
      "emergency-garage-door-repair-southern-river-perth",
      "roller-door-off-track-repair-gosnells-perth",
    ],
    seo: {
      // 2026-08-22 pre-publish refactor — lockstep with scripts/enhance-forrestdale-page.ts
      // (FORRESTDALE_SEO). The SERP's top related search is "RESIDENTIAL garage door
      // repairs forrestdale", so the title now carries homes as well as commercial.
      title: "Garage Door Repairs Forrestdale WA | Homes & Commercial",
      description:
        "Mobile garage door repairs in Forrestdale WA — homes, sheds and Business Park roller doors, with guide prices listed. Also Harrisdale, Piara Waters & Haynes.",
    },
  }),

  /* ================= ARMADALE CORRIDOR ================= */

  makeSuburbPageV2({
    slug: "garage-door-repairs-kelmscott",
    suburb: "Kelmscott",
    region: "Perth, WA",
    corridor: "the Armadale corridor",
    flags: ["olderStock"],
    nearbySuburbs: [
      { label: "Camillo", href: "/service-areas" },
      { label: "Champion Lakes", href: "/service-areas" },
      { label: "Seville Grove", href: "/service-areas" },
      { label: "Roleystone", href: "/service-areas" },
      { label: "Armadale", href: "/garage-door-repairs-armadale" },
      { label: "Gosnells", href: "/garage-door-repairs-gosnells" },
      { label: "Thornlie", href: "/garage-door-repairs-thornlie" },
    ],
    heroSubtitle:
      "Same-day garage door repairs in Kelmscott — hills-fringe damp, older doors and newer subdivisions, all covered by a team that works this corridor daily.",
    directAnswer:
      "Capital Garage Doors provides same-day garage door repairs in Kelmscott, including rusted and broken springs, worn cables, older tilt and roller doors, failing motors and openers, and doors that won't open or close.",
    localIntro: [
      "Kelmscott sits where the plain meets the hills, and that geography shows up in its garage doors. The suburb gets noticeably more rain and morning damp than suburbs a few kilometres west, and moisture sitting on springs, cables and track hardware corrodes them years earlier than on drier blocks.",
      "The housing is a genuine mix — established homes around the town centre and the train station, newer subdivisions filling in around them, and larger blocks climbing toward Roleystone. So in a single day here we might replace rusted springs on a 1980s tilt door, service a big shed roller on an acreage block, and reprogram a smart opener on a five-year-old build.",
      "Rust is the thread running through most of it. A corroded spring rarely gives warning — it fails suddenly and the door becomes immovable — so when we're on site we check the whole assembly for corrosion rather than just fixing the part that failed, and we fit corrosion-resistant components where it makes sense.",
      "Kelmscott, Camillo, Champion Lakes, Seville Grove and Roleystone are all easy same-day calls for us, with Armadale, Gosnells and Thornlie on routes we drive daily.",
      `We carry parts for all the major Australian brands, including ${BRANDS_MARKER}, Gliderol and Dominator, plus ${BRANDS_OPENERS} openers, so most Kelmscott repairs are completed on the first visit.`,
    ],
    specificFaqs: [
      {
        question: "Why do garage doors rust in Kelmscott when we're nowhere near the beach?",
        answer:
          "It's damp rather than salt. The hills fringe gets more rainfall and heavier morning moisture than the coastal plain, and water sitting on springs, cables and hinges works through the protective coating over the years — the same end result as sea air, just by a different route. An annual service and lubrication is the cheapest way to slow it down.",
      },
      {
        question: "How much should I budget for a new garage door?",
        answer:
          "It varies a lot with size, material, insulation and whether you need an opener, so we don't quote a figure sight-unseen. What we can say is that most doors we're called to don't need replacing at all — the guide prices on this page cover the repairs that fix the overwhelming majority of faults. If your door genuinely is finished, we measure on site and give you a fixed written quote.",
      },
      {
        question: "Do you cover the larger blocks toward Roleystone?",
        answer:
          "Yes. Acreage and semi-rural properties around Kelmscott and Roleystone often have oversized shed doors as well as a house garage, and both are routine work for us. Bigger doors need heavier, correctly rated springs and a motor with the power to match — fitting standard domestic parts to a large shed door is why they keep failing.",
      },
    ],
    caseStudySlugs: ARMADALE_CASES,
    seo: {
      title: "Garage Door Repairs Kelmscott | Same-Day Local Service",
      description:
        "Same-day garage door repairs in Kelmscott — rusted springs, motors, cables & older doors. Guide prices listed. Covering Camillo, Seville Grove & Roleystone.",
    },
  }),

  makeSuburbPageV2({
    slug: "garage-door-repairs-camillo",
    suburb: "Camillo",
    region: "Perth, WA",
    corridor: "the Armadale corridor",
    flags: ["olderStock"],
    nearbySuburbs: [
      { label: "Kelmscott", href: "/service-areas" },
      { label: "Seville Grove", href: "/service-areas" },
      { label: "Champion Lakes", href: "/service-areas" },
      { label: "Brookdale", href: "/service-areas" },
      { label: "Armadale", href: "/garage-door-repairs-armadale" },
      { label: "Gosnells", href: "/garage-door-repairs-gosnells" },
    ],
    heroSubtitle:
      "Same-day garage door repairs in Camillo — straight answers, published guide prices, and repairs rather than unnecessary replacements.",
    directAnswer:
      "Capital Garage Doors provides same-day garage door repairs in Camillo, including broken springs and cables, worn tilt and roller doors, failing motors and openers, and doors that won't open or close properly.",
    localIntro: [
      "Camillo is a small, settled pocket between Kelmscott and Armadale, built out largely in the 1970s and 80s and still full of the original homes — and, in plenty of cases, the original garage doors.",
      "Doors of that vintage fail in predictable ways: springs that have simply run out of cycles, cables worn thin where they wind onto the drum, rollers flattened enough to make the whole door grumble, and openers that were never designed to still be working four decades on. All of it is standard wear, and nearly all of it is repairable.",
      "We're deliberately straight with people here about repair versus replace. Older doors attract quotes for a full replacement from companies that would rather sell a new door than fit a set of springs, and that's rarely what's actually needed. If your panels and frame are sound, a repair will restore the door properly — and we've published our guide prices on this page so you can see what that costs before you call.",
      "Camillo, Kelmscott, Seville Grove, Champion Lakes and Brookdale are all quick same-day calls, with Armadale and Gosnells on our daily routes.",
      `We carry parts for all the major Australian brands, including ${BRANDS_MARKER}, Gliderol and Dominator, plus ${BRANDS_OPENERS} openers — including for older doors other companies write off as unserviceable.`,
    ],
    specificFaqs: [
      {
        question: "Is it worth repairing a garage door, or am I better off replacing it?",
        answer:
          "If the panels, frame and tracks are structurally sound, repairing is almost always better value — springs, cables, rollers and openers are wear items, and replacing them returns the door to proper operation for a fraction of a new one. Replacement genuinely makes sense when panels are rusted through or cracked, or the frame has been distorted. We'll show you which applies to your door.",
      },
      {
        question: "I've been quoted for a whole new door — should I get a second opinion?",
        answer:
          "It's usually worth it. A large share of the older doors we're called to in Camillo need springs, cables or an opener rather than replacement, and the difference in cost is substantial. We'll assess the door honestly, tell you plainly if it really is finished, and quote the repair if it isn't.",
      },
      {
        question: "How much does it cost to have a garage door lubricated or serviced?",
        answer:
          "Our current service and tune-up price is in the guide-price table on this page. A service is a full safety and balance check with the springs and travel limits adjusted, moving parts lubricated and hardware tightened — on an older Camillo door it's the single cheapest thing you can do to delay a bigger repair.",
      },
    ],
    caseStudySlugs: ARMADALE_CASES,
    seo: {
      title: "Garage Door Repairs Camillo | Same-Day Local Service",
      description:
        "Same-day garage door repairs in Camillo — springs, cables, motors & older doors. Guide prices listed, honest repair-or-replace advice. Covering Kelmscott.",
    },
  }),

  makeSuburbPageV2({
    slug: "garage-door-repairs-champion-lakes",
    suburb: "Champion Lakes",
    region: "Perth, WA",
    corridor: "the Armadale corridor",
    flags: ["estate", "boats"],
    nearbySuburbs: [
      { label: "Kelmscott", href: "/service-areas" },
      { label: "Camillo", href: "/service-areas" },
      { label: "Seville Grove", href: "/service-areas" },
      { label: "Brookdale", href: "/service-areas" },
      { label: "Armadale", href: "/garage-door-repairs-armadale" },
      { label: "Gosnells", href: "/garage-door-repairs-gosnells" },
    ],
    heroSubtitle:
      "Same-day garage door repairs in Champion Lakes — newer estate homes around the regatta centre, with doors sized for boats, trailers and two cars.",
    directAnswer:
      "Capital Garage Doors provides same-day garage door repairs in Champion Lakes, including broken springs on large double doors, smart opener faults, worn cables, noisy doors, and doors that won't open or close.",
    localIntro: [
      "Champion Lakes grew up around the regatta centre, and it's one of the newer pockets in the Armadale corridor — modern homes, wide double garages, and an unusually high number of households with a boat, ski gear or a trailer sharing the space with the cars.",
      "That combination puts real load on a door. Wide double openings carry substantially more weight than a standard single, and when the garage doubles as boat and gear storage the door gets opened far more often than average. Springs are rated in cycles, so they reach the end of their life faster here than the age of the homes would suggest.",
      "Because the estate is newer, most of the doors are sectional units with automatic — often app-controlled — openers. A good share of the call-outs we attend turn out to be pairing, connectivity or safety-sensor alignment rather than a failed motor, which is a much cheaper fix once it's diagnosed properly rather than guessed at.",
      "We're in this corridor daily, and Champion Lakes, Kelmscott, Camillo, Seville Grove and Brookdale are all straightforward same-day calls, with Armadale and Gosnells on our regular routes.",
      `We carry parts for all the major Australian brands, including ${BRANDS_MARKER}, Gliderol and Dominator, plus ${BRANDS_OPENERS} openers, so most Champion Lakes repairs are finished in a single visit.`,
    ],
    specificFaqs: [
      {
        question: "Can you repair the wide double doors common in Champion Lakes?",
        answer:
          "Yes — they're standard work for us. Wider doors weigh considerably more, so they need heavier, correctly rated springs and a motor with the pulling power to match. Fitting standard-sized parts to an oversized door is the most common reason one keeps failing, so we size the hardware to your actual door.",
      },
      {
        question: "The garage is full of boat and trailer gear — will that affect the door?",
        answer:
          "Indirectly, yes, in two ways. A garage in constant use means many more door cycles, so springs reach the end of their rated life sooner. And gear stored near the opening can knock the safety sensors out of alignment or foul the tracks, which typically shows up as a door that stops part-way or refuses to close. Both are quick fixes when correctly diagnosed.",
      },
      {
        question: "My opener won't respond but the motor seems fine — what's wrong?",
        answer:
          "On newer estate homes it's usually not the motor. Lost remote or app pairing, a unit that's dropped off the Wi-Fi, misaligned photo-eye sensors, or travel limits that have drifted will all stop a door working while the motor itself is perfectly healthy. We test all of those before recommending any replacement.",
      },
    ],
    caseStudySlugs: ARMADALE_CASES,
    seo: {
      title: "Garage Door Repairs Champion Lakes | Same-Day Service",
      description:
        "Same-day garage door repairs in Champion Lakes — springs, motors & wide double doors on estate homes. Guide prices listed. Covering Kelmscott & Seville Grove.",
    },
  }),

  makeSuburbPageV2({
    slug: "garage-door-repairs-seville-grove",
    suburb: "Seville Grove",
    region: "Perth, WA",
    corridor: "the Armadale corridor",
    flags: ["olderStock"],
    nearbySuburbs: [
      { label: "Armadale", href: "/garage-door-repairs-armadale" },
      { label: "Camillo", href: "/service-areas" },
      { label: "Champion Lakes", href: "/service-areas" },
      { label: "Kelmscott", href: "/service-areas" },
      { label: "Brookdale", href: "/service-areas" },
      { label: "Gosnells", href: "/garage-door-repairs-gosnells" },
    ],
    heroSubtitle:
      "Same-day garage door repairs in Seville Grove — established family homes whose original springs and openers are now reaching the end of the line.",
    directAnswer:
      "Capital Garage Doors provides same-day garage door repairs in Seville Grove, including broken springs and cables, worn motors and openers, off-track and noisy doors, and doors that won't open or close properly.",
    localIntro: [
      "Seville Grove filled in through the late 1980s and 90s, which puts its garage doors at a very particular stage of life: most are on their second set of springs, or overdue for one, and the openers fitted when the homes were built are well past their expected service life.",
      "That produces a recognisable pattern of call-outs. A door that has quietly become heavy to lift by hand. An opener that hums, strains and then reverses without obvious reason. Cables frayed where they wind onto the drum. Rollers worn enough that the whole door announces itself to the street every morning. None of it is dramatic, and all of it is repairable.",
      "It's worth acting on those early signs rather than waiting. Once a spring actually snaps, the opener has usually been over-working for months and often fails soon after — so what could have been a spring replacement becomes a spring and motor job. Our guide prices are published on this page so you can weigh that up honestly.",
      "Seville Grove sits right beside Armadale, which we service daily, so same-day appointments here are routine, along with Camillo, Champion Lakes, Kelmscott, Brookdale and Gosnells.",
      `We carry parts for all the major Australian brands, including ${BRANDS_MARKER}, Gliderol and Dominator, plus ${BRANDS_OPENERS} openers, so most Seville Grove repairs are completed on the first visit.`,
    ],
    specificFaqs: [
      {
        question: "What's the average lifespan of a garage door motor?",
        answer:
          "Ten to fifteen years is typical, and a lot of Seville Grove homes are past that on their original opener. Lifespan depends heavily on how hard the motor has worked — an opener dragging a door with weakening springs fails much earlier, so a motor that's died young is often a symptom of an unbalanced door rather than the root problem.",
      },
      {
        question: "How do I know if my springs are about to fail?",
        answer:
          "The clearest sign is weight: disconnect the opener using the manual release cord and lift the door by hand — a healthy door lifts easily and stays put when you let go halfway. If it's heavy, slams down, or the opener strains and reverses during normal use, the springs are on the way out. Visible gaps or rust flaking on the spring coils are also warnings.",
      },
      {
        question: "Should I replace the springs and the opener at the same time?",
        answer:
          "Not automatically. If the opener is still running well, replacing the springs alone will often restore normal operation and take the strain off the motor. But if the opener is already old, noisy and has been hauling an unbalanced door for a long time, doing both in one visit saves you a second call-out fee — we'll give you the honest assessment on site.",
      },
    ],
    caseStudySlugs: ARMADALE_CASES,
    seo: {
      title: "Garage Door Repairs Seville Grove | Same-Day Service",
      description:
        "Same-day garage door repairs in Seville Grove — springs, cables, motors & roller doors. Guide prices listed. Covering Armadale, Camillo & Champion Lakes.",
    },
  }),

  makeSuburbPageV2({
    slug: "garage-door-repairs-brookdale",
    suburb: "Brookdale",
    region: "Perth, WA",
    corridor: "the Armadale corridor",
    flags: ["olderStock", "commercial"],
    nearbySuburbs: [
      { label: "Armadale", href: "/garage-door-repairs-armadale" },
      { label: "Seville Grove", href: "/service-areas" },
      { label: "Camillo", href: "/service-areas" },
      { label: "Champion Lakes", href: "/service-areas" },
      { label: "Wungong", href: "/service-areas" },
      { label: "Gosnells", href: "/garage-door-repairs-gosnells" },
    ],
    heroSubtitle:
      "Same-day garage door repairs in Brookdale — house garages, big shed doors on larger blocks, and workshop rollers, from a team already working next door in Armadale.",
    directAnswer:
      "Capital Garage Doors provides same-day garage door repairs in Brookdale, including broken springs and cables, large shed and workshop roller doors, worn motors and openers, and doors that won't open or close.",
    localIntro: [
      "Brookdale is a small pocket on the southern edge of Armadale, and it's the kind of suburb Perth-wide companies quote long lead times for. We don't — Armadale is on our daily route and Brookdale is minutes further, so same-day appointments here are normal.",
      "Block sizes here are generous by metro standards, and that changes the work. Alongside standard house garages we're regularly repairing large shed and workshop roller doors — heavier curtains that need correctly rated springs and a motor with the pulling power to match. An under-sprung shed door destroys openers, so correcting the balance is usually the real fix rather than fitting yet another motor.",
      "The housing itself is mostly established, so the familiar wear items dominate: springs at the end of their cycle life, cables frayed at the drum, worn rollers making the door grumble, and openers running well beyond their intended service life. Nearly all of it is repairable, and we'll tell you honestly when a door genuinely isn't worth saving.",
      "Same-day coverage takes in Brookdale, Armadale, Seville Grove, Camillo, Champion Lakes and Wungong, with Gosnells on our regular run.",
      `We carry parts for all the major Australian brands, including ${BRANDS_MARKER}, Gliderol and Dominator, plus ${BRANDS_OPENERS} openers, along with heavy-duty springs and motors for oversized shed doors.`,
    ],
    specificFaqs: [
      {
        question: "Do you really service Brookdale?",
        answer:
          "Yes, properly. Brookdale sits directly beside Armadale, which our technicians work in daily, so it's a few minutes further rather than a special trip. Small outer suburbs often get long lead times from Perth-wide operators — that's not how we treat this one.",
      },
      {
        question: "Can you repair large shed and workshop roller doors?",
        answer:
          "Yes — larger blocks around Brookdale mean shed doors are a regular part of our work here. Oversized curtains need heavier, correctly rated springs and often a stronger motor than a standard domestic unit. If a shed door keeps burning out openers, the balance is almost always the underlying cause.",
      },
      {
        question: "Can a damaged garage door be repaired?",
        answer:
          "In most cases, yes. A single dented or split panel on a sectional door can often be replaced on its own, a bent roller-door curtain can sometimes be straightened, and a door knocked off its tracks is realigned rather than replaced. Full replacement is only necessary when damage runs across several panels or the frame itself has been distorted.",
      },
    ],
    caseStudySlugs: ARMADALE_CASES,
    seo: {
      title: "Garage Door Repairs Brookdale | Same-Day Local Service",
      description:
        "Same-day garage door repairs in Brookdale — springs, motors, cables & big shed roller doors. Guide prices listed. Covering Armadale, Seville Grove & Wungong.",
    },
  }),
];
