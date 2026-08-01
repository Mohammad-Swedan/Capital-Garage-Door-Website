import type { ServiceSuburbPage, FAQ, LocalLink } from "@/types";

/**
 * Batch 2 (2026-08): 15 research-picked suburb pages, created in the CMS as
 * DRAFTS by scripts/import-suburb-pages-batch2.ts (the user publishes them from
 * /admin; scripts/finalize-suburb-pages-batch2.ts then wires the internal
 * links). Spread into the main registry in content/service-suburb-pages.ts.
 *
 * Selection data (GSC 28d/90d + DataForSEO 2026-08-01): Mandurah 420/mo,
 * Bayswater 70, Willetton/Belmont/Malaga 30, Stirling/Osborne Park/High
 * Wycombe/Port Kennedy 20, Maddington/Kingsley/Riverton ~10 + real GSC
 * impressions, Huntingdale 15 GSC impr, Duncraig/Kalamunda case-study proof.
 * Deliberately skipped: Cockburn (Success page targets it) and Victoria Park
 * (Lathlain page targets the inner east).
 *
 * NOTE: nearbySuburbs chips only link pages that are LIVE today — chips for
 * fellow batch-2 suburbs point at /service-areas and are repointed by the
 * finalize script once those pages are published.
 */

interface SuburbSpec {
  slug: string;
  suburb: string;
  region: string;
  /** Area phrase used in whyChooseUs copy, e.g. "the northern suburbs". */
  corridor: string;
  nearbySuburbs: LocalLink[];
  heroSubtitle: string;
  directAnswer: string;
  /** Four unique paragraphs; the last must contain the brands marker
   * "B&D, Steel-Line, Centurion" (idempotency marker shared with
   * scripts/enhance-suburb-pages.ts — never reuse it elsewhere). */
  localIntro: string[];
  /** One extra suburb-specific FAQ appended after the standard set. */
  specificFaq: FAQ;
  /** Salt-air suburb → corrosion variant of the common-problem FAQ. */
  coastal?: boolean;
  /** Industrial/commercial suburb → commercial emphasis in the services deck. */
  commercial?: boolean;
  caseStudySlugs?: string[];
  seo: { title: string; description: string };
}

const BRANDS_DOORS = "B&D, Steel-Line, Centurion, Gliderol and Dominator";
const BRANDS_OPENERS = "Merlin, ATA and Chamberlain";

function makeSuburbPage(spec: SuburbSpec): ServiceSuburbPage {
  const { suburb, corridor } = spec;
  const nearbyNames = spec.nearbySuburbs.map((l) => l.label);

  const availableServices = [
    spec.commercial
      ? {
          title: "Commercial Roller Door Repairs",
          description:
            "High-cycle roller doors and shutters for warehouses, workshops and shopfronts — repaired fast to keep your business moving.",
          icon: "Wrench",
        }
      : {
          title: "Garage Door Repairs",
          description:
            "Diagnosis and repair for doors that won't open, close, or run smoothly — residential and commercial.",
          icon: "Wrench",
        },
    {
      title: "Motor & Opener Replacement",
      description:
        "Repair or replace worn-out garage door motors and openers with quality, warranty-backed units.",
      icon: "Cpu",
    },
    {
      title: "Roller Door Repairs",
      description:
        "Realign, re-spring and service roller doors that stick, jam, or have lost their curtain tension.",
      icon: "Disc3",
    },
    {
      title: "Sectional Door Repairs",
      description:
        "Panel, hinge, roller and track repairs for sectional garage doors of all brands.",
      icon: "LayoutPanelTop",
    },
    {
      title: "Spring & Cable Repairs",
      description:
        "Safe replacement of broken torsion springs and frayed cables — the most common cause of a dead door.",
      icon: "Cable",
    },
    {
      title: "Emergency Repairs",
      description: `Door stuck open or shut? Priority response across ${suburb} to secure your home or business fast.`,
      icon: "Siren",
    },
    {
      title: "Servicing & Maintenance",
      description:
        "Routine tune-ups that keep your door quiet, balanced and reliable — and prevent costly breakdowns.",
      icon: "Settings",
    },
  ];

  const problems = [
    {
      title: "Door won't open",
      description:
        "Often a broken spring, snapped cable, or motor fault — we find the cause and get you moving again.",
      icon: "DoorClosed",
    },
    {
      title: "Remote not working",
      description:
        "Flat batteries, lost programming, or a failing receiver — we test, re-pair, or replace as needed.",
      icon: "BatteryWarning",
    },
    {
      title: "Door stuck halfway",
      description:
        "Usually an obstruction, off-track roller, or safety-sensor issue stopping the door mid-travel.",
      icon: "TrafficCone",
    },
    {
      title: "Loud or noisy operation",
      description:
        "Grinding, banging or squealing points to worn rollers, loose hardware, or springs needing attention.",
      icon: "Volume2",
    },
    {
      title: "Broken cable or spring",
      description:
        "High-tension parts wear out — we replace them safely with correctly rated components.",
      icon: "Cable",
    },
    {
      title: "Door off track",
      description:
        "A door that's jumped its tracks is a safety risk — we realign and repair the rollers and tracks.",
      icon: "Scale",
    },
  ];

  const whyChooseUs = [
    {
      title: "Local Perth specialists",
      description: `A Perth-based team that knows ${suburb} and ${corridor} — not a faceless call centre.`,
      icon: "MapPin",
    },
    {
      title: "Fast local response",
      description: `We're set up to reach ${suburb} and the surrounding suburbs quickly, with same-day options.`,
      icon: "Zap",
    },
    {
      title: "Clear, upfront quotes",
      description: "Honest pricing explained before we start — no hidden fees and no pressure.",
      icon: "FileText",
    },
    {
      title: "Quality parts",
      description: "We fit durable, correctly rated components so your repair actually lasts.",
      icon: "BadgeCheck",
    },
    {
      title: "After-service support",
      description: "Questions after we leave? We're a phone call away and happy to help.",
      icon: "LifeBuoy",
    },
    {
      title: "Warranty support",
      description: "Workmanship and parts backed by warranty for genuine peace of mind.",
      icon: "ShieldCheck",
    },
  ];

  const problemAnswer = spec.coastal
    ? `Broken torsion springs are the number one call-out everywhere in Perth — but in ${suburb} the coastal salt air adds rusted springs, corroded cables and pitted tracks to the usual list. We replace more corrosion-damaged hardware near the coast than anywhere else, and we fit corrosion-resistant parts to slow it happening again. Failed motors and doors off their tracks make up most of the remaining jobs, and all of these are usually same-day repairs.`
    : `Broken torsion springs are the number one call-out — they do the heavy lifting every time the door opens and eventually snap, usually without warning. Worn cables, failed motors and doors that have come off their tracks make up most of the rest. All of these are same-day repairs for our ${suburb} techs in most cases.`;

  const faqs: FAQ[] = [
    {
      question: `Do you repair garage doors in ${suburb}?`,
      answer: `Yes. Capital Garage Doors repairs residential and commercial garage doors throughout ${suburb} and the surrounding suburbs, including same-day and emergency repairs.`,
    },
    {
      question: `Can you repair garage door motors in ${suburb}?`,
      answer: `We do. We diagnose, repair and replace garage door motors and openers in ${suburb}, and can recommend a suitable replacement unit if yours has reached the end of its life.`,
    },
    {
      question: "Do you service nearby suburbs?",
      answer: `Yes — we regularly work across the wider area, including ${nearbyNames.slice(0, 6).join(", ")}.`,
    },
    {
      question: `Do you offer emergency garage door repair in ${suburb}?`,
      answer: `Yes. If your door is stuck open or shut and your home or business isn't secure, we offer priority emergency repairs across ${suburb} and nearby suburbs.`,
    },
    {
      question: `How much does garage door repair cost in ${suburb}?`,
      answer:
        "It depends on the problem, the parts needed, your door type and the urgency. We always provide a clear, upfront quote before starting — request a quote and describe the issue for an accurate estimate, and there are no surprise call-out fees.",
    },
    {
      question: `Which garage door brands do you repair in ${suburb}?`,
      answer: `All major Australian brands — ${BRANDS_DOORS} doors and more, plus openers and motors from ${BRANDS_OPENERS} and Grifco. If you're not sure what brand your door is, send a photo with your quote request and we'll identify it before we arrive.`,
    },
    {
      question: `Do you supply and install new garage doors in ${suburb}?`,
      answer: `Yes — as well as repairs, we supply and install new sectional, roller, tilt and custom garage doors across ${suburb}, including automatic openers. If your existing door is beyond economical repair we'll tell you straight, and give you a fixed written quote for a replacement after a free on-site measure.`,
    },
    {
      question: `What's the most common garage door problem in ${suburb}?`,
      answer: problemAnswer,
    },
    spec.specificFaq,
  ];

  return {
    slug: spec.slug,
    service: "Garage Door Repairs",
    suburb: spec.suburb,
    region: spec.region,
    nearbySuburbs: spec.nearbySuburbs,
    hero: {
      subtitle: spec.heroSubtitle,
      trustBadges: ["Local Perth Team", "Fast Response", "Emergency Repairs", "Warranty Support"],
    },
    directAnswer: spec.directAnswer,
    localIntro: spec.localIntro,
    availableServices,
    problems,
    costGuidance: {
      intro: `There's no flat rate for garage door repairs in ${suburb} — the cost depends on what's actually wrong and what your door needs. We give clear, upfront quotes before any work starts.`,
      factors: [
        "The type of problem (a remote re-pair is very different to a spring replacement)",
        "Parts required and their quality (genuine vs aftermarket components)",
        "Your door type — roller, sectional, tilt or custom",
        "Urgency — standard booking vs after-hours emergency call-out",
        "Site access and how the door is installed",
        "Whether a repair will last, or a replacement is the smarter long-term option",
      ],
      note: "Describe the issue in your quote request for a faster, more accurate estimate.",
    },
    whyChooseUs,
    relatedPages: spec.commercial
      ? [
          { label: "Garage Door Repairs Perth", href: "/garage-door-repairs-perth" },
          { label: "Commercial Roller Doors Perth", href: "/commercial-roller-doors-perth" },
          { label: "Emergency Garage Door Repairs Perth", href: "/emergency-garage-door-repairs-perth" },
          { label: "Garage Door Opener & Motor Repair Perth", href: "/garage-door-opener-repair-perth" },
          { label: "Garage Door Installation Perth", href: "/garage-door-installation-perth" },
        ]
      : [
          { label: "Garage Door Repairs Perth", href: "/garage-door-repairs-perth" },
          { label: "Garage Door Spring Repair Perth", href: "/garage-door-spring-repair-perth" },
          { label: "Emergency Garage Door Repairs Perth", href: "/emergency-garage-door-repairs-perth" },
          { label: "Garage Door Opener & Motor Repair Perth", href: "/garage-door-opener-repair-perth" },
          { label: "Garage Door Installation Perth", href: "/garage-door-installation-perth" },
        ],
    faqs,
    caseStudySlugs: spec.caseStudySlugs ?? [],
    seo: spec.seo,
  };
}

export const serviceSuburbPagesBatch2: ServiceSuburbPage[] = [
  /* ---- 1. Mandurah — 420/mo, the biggest uncovered keyword ---- */
  makeSuburbPage({
    slug: "garage-door-repairs-mandurah",
    suburb: "Mandurah",
    region: "Mandurah, WA",
    corridor: "the Peel region",
    coastal: true,
    nearbySuburbs: [
      { label: "Halls Head", href: "/service-areas" },
      { label: "Falcon", href: "/service-areas" },
      { label: "Greenfields", href: "/service-areas" },
      { label: "Meadow Springs", href: "/service-areas" },
      { label: "Lakelands", href: "/service-areas" },
      { label: "Dawesville", href: "/service-areas" },
      { label: "Pinjarra", href: "/service-areas" },
      { label: "Baldivis", href: "/garage-door-repairs-baldivis" },
    ],
    heroSubtitle:
      "Fast, reliable garage door repairs across Mandurah and the Peel region — storm damage, salt-air corrosion and everyday breakdowns fixed by a team that's on the road south every week.",
    directAnswer:
      "Capital Garage Doors provides garage door repairs across Mandurah and the Peel region, including broken springs and cables, storm-damaged doors, corroded coastal hardware, faulty motors and openers, and doors that won't open or close properly.",
    localIntro: [
      "Between the estuary, the canals and the ocean, Mandurah doors cop more weather than almost anywhere else we service — salt air rusts springs and cables, and winter storms can put a door out of action overnight. We're in Mandurah every week, so a repair here doesn't mean waiting days for someone to come down from Perth.",
      "We've handled everything from storm-damaged sectional doors to roller doors seized solid with corrosion, and we arrive stocked for the common coastal failures: rusted torsion springs, frayed lift cables, pitted tracks and motors that have given up. Insurance-related storm damage? We can document the damage and provide the written quote your insurer needs.",
      "Our same-day runs cover the whole Peel area — Halls Head, Falcon, Dawesville, Greenfields, Meadow Springs, Lakelands and out to Pinjarra — plus the corridor back through Baldivis toward Perth.",
      "Whatever the brand, we carry parts for all the major Australian doors, including B&D, Steel-Line, Centurion, Gliderol and Dominator, plus Merlin, ATA and Chamberlain openers, and we fit corrosion-resistant components as standard near the coast so the repair lasts.",
    ],
    specificFaq: {
      question: "Do you really service Mandurah from Perth?",
      answer:
        "Yes — Mandurah is part of our regular weekly run, not an occasional trip, so we can offer same-day and next-day slots like anywhere else we service. We've completed jobs across Mandurah, Halls Head, Falcon and Meadow Springs, including storm-damage repairs with the documentation your insurer needs.",
    },
    seo: {
      title: "Garage Door Repairs Mandurah | Same-Day Local Service",
      description:
        "Same-day garage door repairs in Mandurah — storm damage, rusted springs, motors & roller doors. Covering Halls Head, Falcon & Meadow Springs. Free quotes.",
    },
  }),

  /* ---- 2. Bayswater — 70/mo, real job photos ---- */
  makeSuburbPage({
    slug: "garage-door-repairs-bayswater",
    suburb: "Bayswater",
    region: "Perth, WA",
    corridor: "the inner north-east",
    nearbySuburbs: [
      { label: "Morley", href: "/garage-door-repairs-morley" },
      { label: "Maylands", href: "/service-areas" },
      { label: "Inglewood", href: "/service-areas" },
      { label: "Bedford", href: "/service-areas" },
      { label: "Embleton", href: "/service-areas" },
      { label: "Bassendean", href: "/service-areas" },
      { label: "Ashfield", href: "/service-areas" },
      { label: "Noranda", href: "/service-areas" },
    ],
    heroSubtitle:
      "Fast, reliable garage door repairs for Bayswater's character homes and newer builds — older tilt doors, tired springs and worn cables are our bread and butter here.",
    directAnswer:
      "Capital Garage Doors provides garage door repairs across Bayswater, including broken springs and lift cables, older tilt and roller doors, faulty motors and openers, noisy doors, and doors that won't open or close properly.",
    localIntro: [
      "Bayswater's mix of character homes near the river and newer builds up toward Morley means we see the full range here — original tilt doors that have been swinging since the 80s, and modern sectionals whose springs have quietly done ten thousand cycles.",
      "A snapped lift cable is one of our most common Bayswater call-outs (we've replaced them on homes right here — see the recent work below), and it's not a DIY job: the cables share load with the springs and let go violently. We replace cables and springs together where sensible so you're not paying for a second visit six months later.",
      "Same-day calls cover Bayswater, Maylands, Inglewood, Bedford, Embleton, Bassendean and Ashfield — and with our Morley coverage next door, someone is almost always nearby.",
      "We carry parts for all the major Australian brands, including B&D, Steel-Line, Centurion, Gliderol and Dominator, plus Merlin, ATA and Chamberlain openers, so most repairs are finished in a single visit.",
    ],
    specificFaq: {
      question: "Can you keep an older tilt door going, or does it need replacing?",
      answer:
        "Usually we can keep it going — worn pivots, tired springs and perished fittings on older tilt doors are all repairable, and Bayswater has plenty of them. If the door itself is rusted through or the frame has moved, we'll tell you straight and quote a replacement instead, but we never push a new door where a repair will do.",
    },
    seo: {
      title: "Garage Door Repairs Bayswater | Same-Day Local Service",
      description:
        "Same-day garage door repairs in Bayswater — springs, cables, motors & older tilt doors. Covering Maylands, Inglewood & Bassendean. Call for a free quote.",
    },
  }),

  /* ---- 3. Willetton — 30/mo + GSC, real job photos ---- */
  makeSuburbPage({
    slug: "garage-door-repairs-willetton",
    suburb: "Willetton",
    region: "Perth, WA",
    corridor: "the southern suburbs",
    nearbySuburbs: [
      { label: "Canning Vale", href: "/garage-door-repairs-canning-vale" },
      { label: "Bull Creek", href: "/service-areas" },
      { label: "Leeming", href: "/service-areas" },
      { label: "Riverton", href: "/service-areas" },
      { label: "Parkwood", href: "/service-areas" },
      { label: "Shelley", href: "/service-areas" },
      { label: "Rossmoyne", href: "/service-areas" },
    ],
    heroSubtitle:
      "Fast, reliable garage door repairs for Willetton families — when the door won't lift before the school run, we get you moving again, usually the same day.",
    directAnswer:
      "Capital Garage Doors provides garage door repairs across Willetton, including broken springs and cables, faulty motors and openers, off-track sectional doors, noisy doors, and doors that won't open or close properly.",
    localIntro: [
      "Willetton is one of Perth's classic family suburbs — big double garages, doors that cycle four or more times a day between school runs, sport and work — and that daily workload is exactly what wears out springs, cables and motors.",
      "We've done plenty of work in these streets (including the cable replacement in the recent work below), and the pattern is consistent: doors from the 90s and 2000s reaching the end of their first spring set, and openers that strain and reverse because the door has slowly gone out of balance.",
      "Same-day calls cover Willetton, Bull Creek, Leeming, Riverton, Shelley, Rossmoyne and Parkwood, with Canning Vale right next door already on our daily route.",
      "We carry parts for all the major Australian brands, including B&D, Steel-Line, Centurion, Gliderol and Dominator, plus Merlin, ATA and Chamberlain openers, so most repairs are completed on the spot.",
    ],
    specificFaq: {
      question: "My door is heavy to lift by hand — is that the springs?",
      answer:
        "Almost always, yes. A properly balanced door should lift with one hand; when the springs lose tension the motor takes the extra load until it fails too. If your Willetton door feels heavy, gets stuck, or the opener strains and reverses, book a spring check before it turns into a bigger repair.",
    },
    seo: {
      title: "Garage Door Repairs Willetton | Same-Day Local Service",
      description:
        "Same-day garage door repairs in Willetton — springs, motors, cables & sectional doors. Covering Bull Creek, Leeming & Rossmoyne. Call for a free quote.",
    },
  }),

  /* ---- 4. Belmont — 30/mo, CPC $88, airport/Kewdale corridor ---- */
  makeSuburbPage({
    slug: "garage-door-repairs-belmont",
    suburb: "Belmont",
    region: "Perth, WA",
    corridor: "the airport corridor",
    commercial: true,
    nearbySuburbs: [
      { label: "Cloverdale", href: "/service-areas" },
      { label: "Rivervale", href: "/service-areas" },
      { label: "Redcliffe", href: "/service-areas" },
      { label: "Ascot", href: "/service-areas" },
      { label: "Kewdale", href: "/service-areas" },
      { label: "Carlisle", href: "/service-areas" },
      { label: "Lathlain", href: "/garage-door-repairs-lathlain" },
    ],
    heroSubtitle:
      "Fast, reliable garage door repairs across Belmont and the airport corridor — homes in Cloverdale and Redcliffe, and commercial roller doors through the Kewdale freight precinct.",
    directAnswer:
      "Capital Garage Doors provides garage door repairs across Belmont, including broken springs and cables, faulty motors and openers, commercial roller doors and shutters, and doors that won't open or close properly.",
    localIntro: [
      "Belmont sits at the crossroads of homes and industry — established streets in Cloverdale and Redcliffe on one side, and the Kewdale freight and logistics precinct on the other — and we repair doors on both.",
      "For businesses, a roller door that won't open is lost money by the hour. We prioritise commercial call-outs through Belmont, Kewdale and Welshpool, repairing high-cycle rollers, shutters and industrial motors (see the Kewdale job in the recent work below). For homes, it's the usual Perth list: snapped springs, worn cables and openers that have done their time.",
      "Same-day calls cover Belmont, Cloverdale, Rivervale, Redcliffe, Ascot and Kewdale, with our Lathlain coverage minutes away across the river.",
      "We carry parts for all the major Australian brands, including B&D, Steel-Line, Centurion, Gliderol and Dominator, plus Merlin, ATA and Chamberlain openers — and heavy-duty commercial springs and motors for the industrial side of the suburb.",
    ],
    specificFaq: {
      question: "Do you repair commercial roller doors near the airport and Kewdale?",
      answer:
        "Yes — the Belmont–Kewdale–Welshpool corridor is one of our regular commercial areas. We repair high-cycle roller doors, shutters and industrial openers on warehouses, depots and workshops, and we can schedule around your operating hours so the door is back in service with minimal downtime.",
    },
    caseStudySlugs: [
      "commercial-roller-door-repair-kewdale-perth",
      "garage-door-lift-cable-replacement-bayswater-perth",
    ],
    seo: {
      title: "Garage Door Repairs Belmont | Same-Day Local Service",
      description:
        "Same-day garage door repairs in Belmont — springs, motors & commercial roller doors. Covering Cloverdale, Redcliffe, Ascot & Kewdale. Free quotes.",
    },
  }),

  /* ---- 5. Malaga — 30/mo, industrial, real commercial job photos ---- */
  makeSuburbPage({
    slug: "garage-door-repairs-malaga",
    suburb: "Malaga",
    region: "Perth, WA",
    corridor: "the north-east industrial corridor",
    commercial: true,
    nearbySuburbs: [
      { label: "Ballajura", href: "/service-areas" },
      { label: "Beechboro", href: "/service-areas" },
      { label: "Noranda", href: "/service-areas" },
      { label: "Morley", href: "/garage-door-repairs-morley" },
      { label: "Landsdale", href: "/service-areas" },
      { label: "Darch", href: "/service-areas" },
      { label: "Madeley", href: "/service-areas" },
      { label: "Wangara", href: "/service-areas" },
    ],
    heroSubtitle:
      "Commercial roller door and shutter repairs across the Malaga industrial area — plus home garage door repairs in Ballajura, Beechboro and the surrounding suburbs.",
    directAnswer:
      "Capital Garage Doors repairs commercial roller doors, shutters and industrial openers across the Malaga industrial area, plus residential garage doors in the surrounding suburbs — springs, cables, motors, tracks and doors that won't open or close.",
    localIntro: [
      "Malaga is wall-to-wall workshops, warehouses and showrooms, and its roller doors work harder than almost any in Perth — dozens of cycles a day, forklift knocks, and dust that gets into everything. When one fails, the business behind it stops.",
      "We service and repair high-cycle commercial rollers and shutters across the whole estate (see the Malaga shutter service in the recent work below) — re-tensioning curtains, replacing worn springs and barrels, fixing bent guides and swapping tired three-phase and single-phase motors. Planned servicing is available if you'd rather catch failures before they happen.",
      "Around the industrial area, our same-day residential runs cover Ballajura, Beechboro, Noranda, Landsdale, Darch and Madeley — with Morley and the Wangara units also on our regular route.",
      "We carry parts for all the major Australian brands, including B&D, Steel-Line, Centurion, Gliderol and Dominator, plus Merlin, ATA and Chamberlain openers, and commercial-grade springs, barrels and motors for industrial doors.",
    ],
    specificFaq: {
      question: "Can you service all the roller doors on our Malaga premises in one visit?",
      answer:
        "Yes — multi-door servicing is common in Malaga. We inspect and service every door on site in a single scheduled visit (springs, curtains, guides, motors and safety function), flag anything close to failure, and quote repairs before doing them. Ask about a recurring service schedule if door downtime hurts your operation.",
    },
    seo: {
      title: "Garage Door Repairs Malaga | Commercial & Same-Day",
      description:
        "Garage door & commercial roller shutter repairs in Malaga — high-cycle doors, motors & springs fixed fast. Also covering Ballajura & Beechboro. Free quotes.",
    },
  }),

  /* ---- 6. Stirling — 20/mo + 23 GSC impr landing on the homepage ---- */
  makeSuburbPage({
    slug: "garage-door-repairs-stirling",
    suburb: "Stirling",
    region: "Perth, WA",
    corridor: "the Stirling corridor",
    nearbySuburbs: [
      { label: "Balcatta", href: "/service-areas" },
      { label: "Osborne Park", href: "/service-areas" },
      { label: "Innaloo", href: "/service-areas" },
      { label: "Gwelup", href: "/service-areas" },
      { label: "Tuart Hill", href: "/service-areas" },
      { label: "Karrinyup", href: "/service-areas" },
      { label: "Scarborough", href: "/garage-door-repairs-scarborough" },
    ],
    heroSubtitle:
      "Fast, reliable garage door repairs for Stirling homes — established suburbs mean hard-working doors, and we keep them lifting smoothly.",
    directAnswer:
      "Capital Garage Doors provides garage door repairs across Stirling, including broken springs and cables, faulty motors and openers, off-track and noisy doors, and doors that won't open or close properly.",
    localIntro: [
      "Stirling and its neighbours sit in that band of established Perth suburbs where most garage doors went in decades ago — which means original springs, first-generation openers and hardware that's quietly reaching the end of its service life.",
      "Our common Stirling call-outs are exactly what you'd expect from doors of that age: torsion springs that snap without warning, doors that have drifted out of balance and strain the motor, and openers that grind, stall or reverse for no apparent reason. We diagnose the actual cause and fix it properly rather than patching symptoms.",
      "Same-day calls cover Stirling, Balcatta, Gwelup, Tuart Hill, Innaloo and Karrinyup — and with Scarborough and Osborne Park on our regular routes either side, we're rarely far away.",
      "We carry parts for all the major Australian brands, including B&D, Steel-Line, Centurion, Gliderol and Dominator, plus Merlin, ATA and Chamberlain openers, so most repairs are finished in a single visit.",
    ],
    specificFaq: {
      question: "My door was installed in the 90s — can you still get parts?",
      answer:
        "In almost every case, yes. Springs, cables, rollers and hinges are standardised enough that we can match correctly rated replacements for doors from the 80s and 90s, and where an obsolete opener can't be repaired we'll fit a modern unit to the existing door. A full door replacement is only needed when the door itself has failed — and we'll tell you honestly which situation you're in.",
    },
    caseStudySlugs: [
      "broken-garage-door-spring-replacement-duncraig-perth",
      "garage-door-hinge-roller-replacement-morley-perth",
    ],
    seo: {
      title: "Garage Door Repairs Stirling | Same-Day Local Service",
      description:
        "Same-day garage door repairs in Stirling — springs, motors, cables & roller doors. Covering Balcatta, Gwelup, Tuart Hill & Innaloo. Call for a free quote.",
    },
  }),

  /* ---- 7. Osborne Park — 20/mo, commercial strip ---- */
  makeSuburbPage({
    slug: "garage-door-repairs-osborne-park",
    suburb: "Osborne Park",
    region: "Perth, WA",
    corridor: "the Osborne Park business district",
    commercial: true,
    nearbySuburbs: [
      { label: "Stirling", href: "/service-areas" },
      { label: "Balcatta", href: "/service-areas" },
      { label: "Innaloo", href: "/service-areas" },
      { label: "Tuart Hill", href: "/service-areas" },
      { label: "Herdsman", href: "/service-areas" },
      { label: "Woodlands", href: "/service-areas" },
      { label: "Scarborough", href: "/garage-door-repairs-scarborough" },
    ],
    heroSubtitle:
      "Roller door and garage door repairs across Osborne Park — showrooms, workshops and warehouses by day, and the surrounding homes of Tuart Hill and Woodlands all the same.",
    directAnswer:
      "Capital Garage Doors repairs commercial roller doors and residential garage doors across Osborne Park, including high-cycle warehouse doors, showroom shutters, broken springs and cables, faulty motors, and doors that won't open or close.",
    localIntro: [
      "Osborne Park's streets of showrooms, trade suppliers and workshops run on roller doors — and when one jams first thing in the morning, deliveries stop and the day backs up fast. We prioritise commercial call-outs here for exactly that reason.",
      "We repair and service high-cycle rollers, shutters and industrial openers across the business district — worn curtain springs, bent guides from a reversing truck, and motors that trip or stall under load — and we can work before or after your trading hours when the door can't be out of action mid-day.",
      "Either side of the commercial strip, our same-day residential runs cover Tuart Hill, Woodlands, Herdsman, Innaloo, Balcatta and Stirling, with Scarborough on the coast side of our regular route.",
      "We carry parts for all the major Australian brands, including B&D, Steel-Line, Centurion, Gliderol and Dominator, plus Merlin, ATA and Chamberlain openers, and commercial-grade components for warehouse and showroom doors.",
    ],
    specificFaq: {
      question: "Can you repair our warehouse door outside trading hours?",
      answer:
        "Yes — early-morning and after-hours slots are available for Osborne Park businesses so the repair doesn't cost you a day's trade. For urgent failures (door stuck open overnight, or stuck shut with vehicles inside) we treat it as an emergency call-out and get someone there as fast as possible.",
    },
    caseStudySlugs: [
      "commercial-roller-shutter-service-malaga-perth",
      "garage-door-hinge-roller-replacement-morley-perth",
    ],
    seo: {
      title: "Garage Door Repairs Osborne Park | Commercial & Same-Day",
      description:
        "Garage door repairs in Osborne Park — commercial roller doors for workshops & showrooms plus home repairs in Tuart Hill & Woodlands. Same-day. Free quotes.",
    },
  }),

  /* ---- 8. High Wycombe — 20/mo, foothills cluster ---- */
  makeSuburbPage({
    slug: "garage-door-repairs-high-wycombe",
    suburb: "High Wycombe",
    region: "Perth, WA",
    corridor: "the foothills",
    nearbySuburbs: [
      { label: "Forrestfield", href: "/service-areas" },
      { label: "Maida Vale", href: "/service-areas" },
      { label: "Kalamunda", href: "/service-areas" },
      { label: "Wattle Grove", href: "/service-areas" },
      { label: "Kewdale", href: "/service-areas" },
      { label: "Midland", href: "/garage-door-repairs-midland" },
    ],
    heroSubtitle:
      "Fast, reliable garage door repairs for High Wycombe and the foothills — bigger blocks, shed roller doors and hard-working family garages all covered.",
    directAnswer:
      "Capital Garage Doors provides garage door repairs across High Wycombe, including broken springs and cables, shed and garage roller doors, faulty motors and openers, and doors that won't open or close properly.",
    localIntro: [
      "High Wycombe sits at the base of the hills with bigger blocks than most of Perth — which means more sheds, more roller doors, and doors that deal with summer dust and winter downpours coming off the scarp.",
      "Our regular work here splits between family garages (snapped torsion springs, stretched cables, openers past their prime) and the big shed rollers on larger properties — heavier curtains that need correctly rated springs and, often, a motor upgrade to handle the weight properly.",
      "Same-day calls cover High Wycombe, Forrestfield, Maida Vale, Wattle Grove and Kewdale, and our Midland route puts us minutes away most days; the Kalamunda hills run is close behind.",
      "We carry parts for all the major Australian brands, including B&D, Steel-Line, Centurion, Gliderol and Dominator, plus Merlin, ATA and Chamberlain openers — including heavy-duty springs for oversized shed doors.",
    ],
    specificFaq: {
      question: "Do you repair big shed roller doors, not just garage doors?",
      answer:
        "Yes — shed rollers are a big part of our foothills work. Larger curtains need heavier, correctly rated springs and sometimes a stronger motor; an under-sprung shed door wears out openers fast. We repair, re-tension and re-motor shed doors across High Wycombe and the surrounding semi-rural blocks.",
    },
    caseStudySlugs: [
      "rusted-garage-door-spring-repair-kalamunda-perth",
      "roller-door-repair-midland-perth",
    ],
    seo: {
      title: "Garage Door Repairs High Wycombe | Same-Day Service",
      description:
        "Same-day garage door repairs in High Wycombe — springs, motors, cables & shed roller doors. Covering Forrestfield, Maida Vale & Wattle Grove. Free quotes.",
    },
  }),

  /* ---- 9. Port Kennedy — 20/mo, south-coastal cluster ---- */
  makeSuburbPage({
    slug: "garage-door-repairs-port-kennedy",
    suburb: "Port Kennedy",
    region: "Perth, WA",
    corridor: "the southern coastal strip",
    coastal: true,
    nearbySuburbs: [
      { label: "Warnbro", href: "/service-areas" },
      { label: "Secret Harbour", href: "/service-areas" },
      { label: "Golden Bay", href: "/service-areas" },
      { label: "Safety Bay", href: "/service-areas" },
      { label: "Baldivis", href: "/garage-door-repairs-baldivis" },
      { label: "Rockingham", href: "/garage-door-repairs-rockingham" },
    ],
    heroSubtitle:
      "Fast, reliable garage door repairs for Port Kennedy and the southern beaches — salt-air corrosion is brutal down here, and we deal with it every week.",
    directAnswer:
      "Capital Garage Doors provides garage door repairs across Port Kennedy, including rusted and broken springs, corroded cables and tracks, faulty motors and openers, and doors that won't open or close properly.",
    localIntro: [
      "Port Kennedy doors live metres from the ocean, and it shows — springs rust through years earlier than inland, cables fray, and tracks pit until rollers grind and stick. It's the same story down the whole southern strip.",
      "Because we already run daily routes through Rockingham and Baldivis, Port Kennedy same-day calls are easy for us — and we arrive carrying the corrosion-resistant springs, cables and fittings this coast actually needs, not just standard parts that will rust out again.",
      "Coverage takes in Port Kennedy, Warnbro, Safety Bay, Secret Harbour and Golden Bay, with Rockingham and Baldivis minutes up the road.",
      "We repair all the major Australian brands, including B&D, Steel-Line, Centurion, Gliderol and Dominator doors, plus Merlin, ATA and Chamberlain openers, so most jobs are finished in one visit.",
    ],
    specificFaq: {
      question: "Why do garage door springs rust so fast near the beach?",
      answer:
        "Salt in the air settles on the spring's steel coils and eats through the protective coating, and the constant flexing opens hairline cracks that corrosion gets into. That's why beachside springs can fail in half the time of inland ones. We fit corrosion-resistant springs and hardware in Port Kennedy as standard, and an annual service (a light clean and lubricant film) meaningfully extends their life.",
    },
    caseStudySlugs: [
      "garage-door-spring-replacement-rockingham-perth",
      "steel-line-garage-door-installation-baldivis-perth",
    ],
    seo: {
      title: "Garage Door Repairs Port Kennedy | Same-Day Coastal",
      description:
        "Same-day garage door repairs in Port Kennedy — rusted springs, motors & coastal wear fixed fast. Covering Warnbro, Secret Harbour & Golden Bay. Free quotes.",
    },
  }),

  /* ---- 10. Maddington — 10/mo + 18 GSC impr ---- */
  makeSuburbPage({
    slug: "garage-door-repairs-maddington",
    suburb: "Maddington",
    region: "Perth, WA",
    corridor: "the south-east",
    nearbySuburbs: [
      { label: "Gosnells", href: "/garage-door-repairs-gosnells" },
      { label: "Thornlie", href: "/garage-door-repairs-thornlie" },
      { label: "Kenwick", href: "/service-areas" },
      { label: "Orange Grove", href: "/service-areas" },
      { label: "Huntingdale", href: "/service-areas" },
      { label: "Beckenham", href: "/service-areas" },
    ],
    heroSubtitle:
      "Fast, reliable garage door repairs across Maddington — from established family homes to the workshops and yards along Albany Highway.",
    directAnswer:
      "Capital Garage Doors provides garage door repairs across Maddington, including broken springs and cables, faulty motors and openers, commercial roller doors, noisy doors, and doors that won't open or close properly.",
    localIntro: [
      "Maddington is right in the middle of our busiest south-east patch — we're next door in Gosnells and Thornlie constantly, so a Maddington call-out slots straight into routes we already run every day.",
      "The suburb's mix keeps the work varied: established homes with doors on their original springs, newer builds toward Orange Grove, and the workshops and yards along Albany Highway whose roller doors take a commercial-grade beating.",
      "Same-day calls cover Maddington, Kenwick, Orange Grove and Beckenham, with Gosnells, Thornlie and Huntingdale immediately alongside.",
      "We carry parts for all the major Australian brands, including B&D, Steel-Line, Centurion, Gliderol and Dominator, plus Merlin, ATA and Chamberlain openers, so most repairs are finished in a single visit.",
    ],
    specificFaq: {
      question: "How fast can you get to Maddington?",
      answer:
        "Usually very fast — Maddington sits between Gosnells and Thornlie, two suburbs we work in daily, so a technician is often already minutes away. Same-day repair is the norm rather than the exception here, and emergency call-outs (door stuck open or shut) are prioritised.",
    },
    caseStudySlugs: [
      "roller-door-off-track-repair-gosnells-perth",
      "sectional-garage-door-repair-thornlie-perth",
    ],
    seo: {
      title: "Garage Door Repairs Maddington | Same-Day Local Service",
      description:
        "Same-day garage door repairs in Maddington — springs, motors, cables & roller doors. Covering Kenwick, Orange Grove & Beckenham. Call for a free quote.",
    },
  }),

  /* ---- 11. Huntingdale — 15 GSC impr, named on 3 live pages ---- */
  makeSuburbPage({
    slug: "garage-door-repairs-huntingdale",
    suburb: "Huntingdale",
    region: "Perth, WA",
    corridor: "the south-east",
    nearbySuburbs: [
      { label: "Gosnells", href: "/garage-door-repairs-gosnells" },
      { label: "Southern River", href: "/garage-door-repairs-southern-river" },
      { label: "Thornlie", href: "/garage-door-repairs-thornlie" },
      { label: "Canning Vale", href: "/garage-door-repairs-canning-vale" },
      { label: "Maddington", href: "/service-areas" },
    ],
    heroSubtitle:
      "Fast, reliable garage door repairs for Huntingdale homes — surrounded on every side by suburbs we service daily, so help is never far away.",
    directAnswer:
      "Capital Garage Doors provides garage door repairs across Huntingdale, including broken springs and cables, faulty motors and openers, off-track sectional doors, noisy doors, and doors that won't open or close properly.",
    localIntro: [
      "Huntingdale is surrounded by our home patch — Gosnells, Thornlie, Southern River and Canning Vale on every side — which makes it one of the quickest suburbs in Perth for us to reach.",
      "Most Huntingdale homes went up through the 80s and 90s, and their doors are now deep into the age where torsion springs snap, cables stretch and first-generation openers give up. If your door is suddenly too heavy to lift, that's the springs — don't force it, and don't let anyone talk you into a whole new door for what's a standard repair.",
      "Same-day coverage takes in Huntingdale and everything around it: Gosnells, Thornlie, Maddington, Southern River and Canning Vale.",
      "We carry parts for all the major Australian brands, including B&D, Steel-Line, Centurion, Gliderol and Dominator, plus Merlin, ATA and Chamberlain openers, so most repairs take one visit.",
    ],
    specificFaq: {
      question: "Is a broken spring worth repairing on an older Huntingdale door?",
      answer:
        "Almost always yes. Springs are a wear item — like tyres on a car — and replacing them restores the door completely when the panels and frame are sound, at a fraction of a new door's cost. We'll only recommend replacement when the door itself has failed (rusted panels, cracked stiles, bent frame), and we'll show you why.",
    },
    caseStudySlugs: [
      "roller-door-off-track-repair-gosnells-perth",
      "emergency-sectional-door-repair-canning-vale-perth",
    ],
    seo: {
      title: "Garage Door Repairs Huntingdale | Same-Day Service",
      description:
        "Same-day garage door repairs in Huntingdale — springs, motors, cables & sectional doors. Covering Gosnells, Thornlie & Southern River. Free quotes.",
    },
  }),

  /* ---- 12. Kingsley — 10/mo + 11 GSC impr, northern cluster ---- */
  makeSuburbPage({
    slug: "garage-door-repairs-kingsley",
    suburb: "Kingsley",
    region: "Perth, WA",
    corridor: "the northern suburbs",
    nearbySuburbs: [
      { label: "Woodvale", href: "/service-areas" },
      { label: "Greenwood", href: "/service-areas" },
      { label: "Warwick", href: "/service-areas" },
      { label: "Padbury", href: "/service-areas" },
      { label: "Duncraig", href: "/service-areas" },
      { label: "Joondalup", href: "/garage-door-repairs-joondalup" },
      { label: "Wanneroo", href: "/garage-door-repairs-wanneroo" },
    ],
    heroSubtitle:
      "Fast, reliable garage door repairs for Kingsley's leafy streets — doors from the 80s build boom, kept running by people who know them inside out.",
    directAnswer:
      "Capital Garage Doors provides garage door repairs across Kingsley, including broken springs and cables, faulty motors and openers, off-track and noisy doors, and doors that won't open or close properly.",
    localIntro: [
      "Kingsley grew up in the 80s and its garage doors show it — solid, well-built, and now decades into their working life. Springs, cables, rollers and openers from that era are all reaching replacement age at once.",
      "That makes our Kingsley work satisfying: most 'dead' doors here need a standard, well-priced repair — new springs, fresh cables, a modern opener on the existing door — not a replacement. We'll always tell you which is genuinely needed.",
      "Same-day calls cover Kingsley, Woodvale, Greenwood, Warwick and Padbury, with Joondalup and Wanneroo both on our daily northern routes.",
      "We carry parts for all the major Australian brands, including B&D, Steel-Line, Centurion, Gliderol and Dominator, plus Merlin, ATA and Chamberlain openers, so most repairs are finished on the first visit.",
    ],
    specificFaq: {
      question: "Can you fit a quiet modern opener to my existing Kingsley door?",
      answer:
        "Yes — that's one of our most popular jobs in suburbs like Kingsley. If the door itself is sound, we fit a modern belt-drive or quality chain-drive opener to it, program your remotes, set the travel limits and safety reverse, and take the old unit away. It transforms a noisy 90s setup for far less than a new door.",
    },
    caseStudySlugs: [
      "broken-garage-door-spring-replacement-duncraig-perth",
      "roller-door-repair-wanneroo-perth",
    ],
    seo: {
      title: "Garage Door Repairs Kingsley | Same-Day Local Service",
      description:
        "Same-day garage door repairs in Kingsley — springs, motors, cables & roller doors. Covering Woodvale, Greenwood, Warwick & Padbury. Call for a free quote.",
    },
  }),

  /* ---- 13. Riverton — 10/mo + 10 GSC impr ---- */
  makeSuburbPage({
    slug: "garage-door-repairs-riverton",
    suburb: "Riverton",
    region: "Perth, WA",
    corridor: "the southern river suburbs",
    nearbySuburbs: [
      { label: "Willetton", href: "/service-areas" },
      { label: "Shelley", href: "/service-areas" },
      { label: "Rossmoyne", href: "/service-areas" },
      { label: "Parkwood", href: "/service-areas" },
      { label: "Ferndale", href: "/service-areas" },
      { label: "Lynwood", href: "/service-areas" },
      { label: "Canning Vale", href: "/garage-door-repairs-canning-vale" },
    ],
    heroSubtitle:
      "Fast, reliable garage door repairs for Riverton and the river suburbs — same-day service from the team already working next door in Willetton and Canning Vale.",
    directAnswer:
      "Capital Garage Doors provides garage door repairs across Riverton, including broken springs and cables, faulty motors and openers, off-track sectional doors, noisy doors, and doors that won't open or close properly.",
    localIntro: [
      "Riverton's quiet streets between the river and Willetton hold a lot of well-kept homes — and a lot of garage doors quietly clocking up cycles until, one morning, a spring lets go and the car is stuck inside.",
      "When that happens, we're close: our Canning Vale and Willetton runs pass Riverton daily, so same-day repair is the norm. We fix the full range here — snapped torsion springs, stretched cables, doors that have jumped their tracks, and openers that strain, stall or ignore the remote.",
      "Same-day coverage takes in Riverton, Shelley, Rossmoyne, Parkwood, Ferndale and Lynwood, with Willetton and Canning Vale immediately alongside.",
      "We carry parts for all the major Australian brands, including B&D, Steel-Line, Centurion, Gliderol and Dominator, plus Merlin, ATA and Chamberlain openers, so most repairs are completed in one visit.",
    ],
    specificFaq: {
      question: "The power went out and my door won't open — what do I do?",
      answer:
        "Every opener has a manual release (usually a red cord) that disconnects the motor so you can lift the door by hand — but if the door is suddenly very heavy, stop: that usually means a broken spring, not just the power. Forcing it can bend panels and is dangerous. Give us a call and we'll talk you through it, then fix the actual cause.",
    },
    caseStudySlugs: [
      "garage-door-cable-replacement-willetton-perth",
      "emergency-sectional-door-repair-canning-vale-perth",
    ],
    seo: {
      title: "Garage Door Repairs Riverton | Same-Day Local Service",
      description:
        "Same-day garage door repairs in Riverton — springs, motors, cables & sectional doors. Covering Shelley, Rossmoyne, Parkwood & Lynwood. Free quotes.",
    },
  }),

  /* ---- 14. Duncraig — case-study suburb, referenced from 4 live pages ---- */
  makeSuburbPage({
    slug: "garage-door-repairs-duncraig",
    suburb: "Duncraig",
    region: "Perth, WA",
    corridor: "the northern coastal suburbs",
    coastal: true,
    nearbySuburbs: [
      { label: "Carine", href: "/service-areas" },
      { label: "Sorrento", href: "/service-areas" },
      { label: "Marmion", href: "/service-areas" },
      { label: "Hillarys", href: "/service-areas" },
      { label: "Greenwood", href: "/service-areas" },
      { label: "Warwick", href: "/service-areas" },
      { label: "Padbury", href: "/service-areas" },
      { label: "Scarborough", href: "/garage-door-repairs-scarborough" },
      { label: "Joondalup", href: "/garage-door-repairs-joondalup" },
    ],
    heroSubtitle:
      "Fast, reliable garage door repairs for Duncraig homes — established northern-coastal streets where sea air and door springs are old enemies.",
    directAnswer:
      "Capital Garage Doors provides garage door repairs across Duncraig, including broken and rusted springs, worn cables, faulty motors and openers, noisy doors, and doors that won't open or close properly.",
    localIntro: [
      "Duncraig's established homes sit just far enough from the ocean to feel leafy — but close enough that salt air still works away at garage door springs, cables and tracks year after year.",
      "We know these doors well: the broken-spring replacement in the recent work below is a Duncraig job, and it's typical of the suburb — a door from the 90s whose original springs finally let go. We replaced them with correctly rated, corrosion-resistant units and had the door balanced and running the same day.",
      "Same-day calls cover Duncraig, Carine, Sorrento, Marmion, Hillarys, Warwick, Greenwood and Padbury, with Joondalup and Scarborough on our daily routes either side.",
      "We carry parts for all the major Australian brands, including B&D, Steel-Line, Centurion, Gliderol and Dominator, plus Merlin, ATA and Chamberlain openers, so most repairs are finished on the first visit.",
    ],
    specificFaq: {
      question: "Have you actually done jobs in Duncraig?",
      answer:
        "Yes — including the broken torsion-spring replacement shown in the recent work on this page. Duncraig sits inside our daily northern runs between Scarborough and Joondalup, so we're in and around the suburb constantly, and same-day repair is the norm.",
    },
    seo: {
      title: "Garage Door Repairs Duncraig | Same-Day Local Service",
      description:
        "Same-day garage door repairs in Duncraig — springs, motors, cables & roller doors. Covering Carine, Sorrento, Hillarys & Padbury. Call for a free quote.",
    },
  }),

  /* ---- 15. Kalamunda — case-study suburb, hills gap ---- */
  makeSuburbPage({
    slug: "garage-door-repairs-kalamunda",
    suburb: "Kalamunda",
    region: "Perth, WA",
    corridor: "the Perth hills",
    nearbySuburbs: [
      { label: "Lesmurdie", href: "/service-areas" },
      { label: "Gooseberry Hill", href: "/service-areas" },
      { label: "Maida Vale", href: "/service-areas" },
      { label: "Forrestfield", href: "/service-areas" },
      { label: "High Wycombe", href: "/service-areas" },
      { label: "Walliston", href: "/service-areas" },
      { label: "Midland", href: "/garage-door-repairs-midland" },
    ],
    heroSubtitle:
      "Fast, reliable garage door repairs for Kalamunda and the hills — winter rain, morning mist and older homes make rust our most common enemy up here.",
    directAnswer:
      "Capital Garage Doors provides garage door repairs across Kalamunda and the Perth hills, including rusted and broken springs, worn cables, older tilt and roller doors, faulty motors and openers, and doors that won't open or close properly.",
    localIntro: [
      "The hills are their own climate — more rain, morning mist and cooler damp air than the flats below — and garage door hardware feels it. Rusted springs, seized hinges and corroded cables turn up in Kalamunda more than almost anywhere inland.",
      "The rusted-spring repair in the recent work below is a Kalamunda job, and it's the classic hills failure: a spring that corroded quietly for years and then snapped. We replaced it with correctly rated new springs and serviced the door's moving parts against the damp while we were there.",
      "Same-day calls cover Kalamunda, Lesmurdie, Gooseberry Hill, Walliston, Maida Vale and Forrestfield, and our Midland and High Wycombe coverage means we're already climbing the hill most days.",
      "We carry parts for all the major Australian brands, including B&D, Steel-Line, Centurion, Gliderol and Dominator, plus Merlin, ATA and Chamberlain openers, so most repairs are finished in a single visit.",
    ],
    specificFaq: {
      question: "Why do hills doors rust when we're nowhere near the beach?",
      answer:
        "It's the damp, not the salt. Kalamunda gets noticeably more rain and mist than the coastal plain, and moisture that sits on springs, hinges and cables corrodes them over the years — the same end result as sea air, just slower. An annual service (clean, inspect, lubricate) is the cheapest way to slow it down, and we fit corrosion-resistant parts when hardware does need replacing.",
    },
    seo: {
      title: "Garage Door Repairs Kalamunda | Same-Day Hills Service",
      description:
        "Same-day garage door repairs in Kalamunda — rusted springs, motors & older doors fixed fast. Covering Lesmurdie, Gooseberry Hill & Forrestfield. Free quotes.",
    },
  }),
];
