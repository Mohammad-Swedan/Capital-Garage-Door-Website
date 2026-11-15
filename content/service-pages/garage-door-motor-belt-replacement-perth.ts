import type { ServicePage } from "@/types/service-page";

/**
 * /garage-door-motor-belt-replacement-perth — the opener's drive train: belt, chain, rail and drive gear.
 *
 * Owner request (2026-11-16): "Avanti / Centurion motor rail repair, Avanti belt repair, rail, belt,
 * cable replacement, belt snap, gear replacement of motor". Research the same day:
 *  - Primary: "garage door motor belt" 110/mo AU (Keyword Planner, HIGH competition, top bid $11.46)
 *    and "garage door belt replacement" 90/mo AU (10/mo Perth).
 *  - Secondary: "garage door opener belt replacement" 20/mo AU; "garage door rail replacement" 20/mo
 *    AU; "garage door belt snapped" 10; "garage door opener gear replacement" / "garage door motor
 *    gear" 10 each; "avanti garage door belt" 10. Every brand + part combination ("avanti belt
 *    replacement", "centurion euro 1250 belt", "centurion rail") returned no figure, so the brands are
 *    covered in body copy and FAQs here, not as separate pages.
 *  - GSC 90 days to 2026-11-14: "garage door belt replacement cost" 22 impressions @ 13.7 and
 *    "garage door gear replacement cost" 9 @ 23.4 land on /cost-guides — no page owns the intent.
 *  - Live Perth mobile SERP for "garage door motor belt replacement perth" (DataForSEO, 2026-11-16):
 *    AI Overview + local pack + a parts carousel (belts sold at $30–$100), then motor-repair pages
 *    (Dynasty, our /garage-door-motors-perth at #2 organic, Slide & Glide). PAA: cost to replace an
 *    opener belt; can you replace just the belt; cost to replace a motor in Perth.
 *  - Drive types verified on the manufacturers' own pages (2026-11-16): the Avanti SDO4 uses a belt
 *    on galvanised steel rails (avantigdo.com SDO4 page); the Centurion Euro 1250 is "belt-driven"
 *    (cgdoors.com.au Euro 1250 page). Nothing else about either opener is claimed.
 *
 * Cannibalisation guard: "opener repair" stays the job of /garage-door-opener-repair-perth and new
 * motors stay /garage-door-motors-perth; this page is part-level (belt, rail, gear) and links to both.
 *
 * PRICES: the catalog has no belt or rail row (owner to supply). The page pins the opener repair row
 * (its catalog note names gears) and the motor replacement row; the prose never says a belt or a rail
 * costs either range. No literal price in the prose; the rows below mirror pricing-data.ts.
 */
export const garageDoorMotorBeltReplacementPerth: ServicePage = {
  serviceName: "Garage Door Motor Belt Replacement Perth",
  slug: "garage-door-motor-belt-replacement-perth",
  pageType: "service",

  hero: {
    h1: "Garage Door Motor Belt, Rail & Gear Replacement in Perth",
    subtitle:
      "Motor runs but the door won't move? Snapped belts and chains, bent rails and stripped drive gears replaced on Avanti, Centurion, Merlin, B&D and most other openers, any time of day across Perth.",
    badges: [
      { icon: "Wrench", label: "Belts, Chains & Gears" },
      { icon: "Clock3", label: "Open 24/7" },
      { icon: "ShieldCheck", label: "Safety Reverse Tested" },
      { icon: "MapPin", label: "All Perth Suburbs" },
    ],
    image:
      "https://jadara-hub.b-cdn.net/capital-garage-door/gallery/garage-door-motor-installation-perth.webp",
    imageAlt: "Belt-drive garage door opener and rail fitted to the ceiling of a Perth garage",
    floatingCardLabel: "Door Moving Again",
  },

  directAnswer:
    "Capital Garage Doors replaces garage door motor belts, chains, rails and drive gears across Perth. When the opener hums, clicks or runs but the door stays put, the cause is usually a snapped or slipping belt, a stripped drive gear inside the motor head, or a rail bent out of line. We find which part has failed, fit the replacement for your opener's brand, re-tension the belt, reset the travel limits and test the safety reverse. If the head unit itself has failed, we quote a new motor instead, and you get the price before any work starts.",

  intro: {
    heading: "Snapped Belt, Stripped Gear or Bent Rail: Fixing the Opener's Drive",
    paragraphs: [
      "A garage door opener has two halves. The motor head on the ceiling turns a drive gear, and the gear pulls a belt or chain along a steel rail; a carriage on that belt is what actually moves the door. Most belt-drive openers in Perth homes, including the Avanti SDO4 and the Centurion Euro 1250, work this way, and older units such as the Guardian and early Merlin models use a chain instead. When any link in that chain of parts fails, the motor can still sound healthy while the door goes nowhere.",
      "A snapped garage door belt is the clearest case: the motor runs, the belt hangs loose or lies on the floor, and the door won't open from the remote. A stretched belt slips and jumps teeth, so the door judders or stops part-way. A stripped drive gear sounds different. The motor hums or clicks but the carriage never moves, because the plastic gear inside the head has worn its teeth off, usually after years of lifting a door whose springs have lost tension. A bent rail comes from a car nudging the door or a manual release pulled with the door under load, and it makes the carriage bind or the door close crooked.",
      "We replace the failed part rather than the whole opener whenever the motor itself is sound: a new belt or chain cut and tensioned to the rail, a drive gear kit fitted to the head, or a straightened or replaced rail section. Before reconnecting anything we check the door's springs and balance, because a heavy door is what snaps belts and strips gears in the first place, and fixing the drive without fixing the door just buys a second call-out. On a Kingsley job, an old Guardian chain-drive opener had snapped its chain and was past saving, so it was replaced with a new opener on the same visit; when the motor is worth keeping, we keep it.",
      "Our phone is answered 24 hours a day, 7 days a week, so a door stuck shut with the car inside, or stuck open overnight, gets a technician sent out at any hour. Work outside standard hours carries the after-hours surcharge from our price list, which we confirm with you before anyone is sent.",
    ],
  },

  problems: [
    { label: "Motor runs but the door won't move", icon: "Cpu" },
    { label: "Belt or chain snapped or hanging loose", icon: "XCircle" },
    { label: "Motor hums or clicks: stripped drive gear", icon: "Volume2" },
    { label: "Door judders or stops part-way: slipping belt", icon: "PauseCircle" },
    { label: "Rail bent, cracked or pulled off the ceiling", icon: "AlertTriangle" },
    { label: "Door closes crooked or the carriage binds", icon: "RefreshCw" },
  ],

  includedItems: [
    "Diagnosis of belt, chain, drive gear, rail and motor head",
    "Replacement belt or chain matched to your opener and rail length",
    "Drive gear kit fitted when the gear has stripped",
    "Bent rail straightened or a damaged section replaced",
    "Belt or chain tension set and the carriage reconnected",
    "Door springs and balance checked before the opener is reconnected",
    "Travel limits and force reset, safety reverse tested",
    "Open 24/7 across Perth; a fixed price agreed before work starts",
  ],

  processSteps: [
    {
      title: "Tell us what the motor does",
      description:
        "Runs with no movement, hums without turning, judders or stops part-way: each points to a different part, so we bring the right one.",
      icon: "Camera",
    },
    {
      title: "Find the failed part",
      description:
        "The belt or chain, drive gear, rail and carriage are checked, and the door is lifted by hand to test its balance.",
      icon: "Search",
    },
    {
      title: "Replace or repair it",
      description:
        "A new belt, chain or gear kit is fitted, or the rail is straightened or replaced; a failed head unit is quoted as a new motor.",
      icon: "Wrench",
    },
    {
      title: "Tension and reset",
      description:
        "Belt tension is set, the carriage is reconnected and the travel limits and force are reset for the door.",
      icon: "Settings",
    },
    {
      title: "Prove it's safe",
      description:
        "The door is run through full cycles and closed on a block to prove the safety reverse before we leave.",
      icon: "ShieldCheck",
    },
  ],

  // Mirrors pricing-data.ts — the live CMS page pins the same catalog rows.
  costGuidance: {
    intro:
      "Belt, chain and rail replacements are priced once we have seen the opener, because the part and the rail length differ from brand to brand; the price is agreed before any work starts. A stripped drive gear is repaired as part of an opener repair, and when the motor head itself has failed the replacement row applies. As a guide:",
    rows: [
      {
        label: "Motor / opener repair",
        price: "$380–$490",
        note: "Diagnose and repair the opener, including gears, board, capacitor or limit switches",
      },
      {
        label: "Motor / opener replacement",
        price: "$770–$990",
        note: "New opener supplied, installed and programmed, including remotes",
      },
    ],
  },

  whyChoose: [
    {
      title: "Part, not the whole motor",
      description: "A snapped belt or stripped gear is replaced on its own when the motor head is still sound.",
      icon: "Wrench",
    },
    {
      title: "Matched to your opener",
      description: "Belts, chains and gear kits are matched to the opener's brand and rail length, not a universal guess.",
      icon: "BadgeCheck",
    },
    {
      title: "Door checked first",
      description: "Springs and balance are checked before reconnecting, so the new belt isn't lifting a door it shouldn't.",
      icon: "Search",
    },
    {
      title: "Honest repair-or-replace call",
      description: "If the head unit has failed, we say so and quote a new motor rather than fitting parts to a dying opener.",
      icon: "Scale",
    },
    {
      title: "Safety reverse proven",
      description: "Every visit ends with the travel limits reset and the safety reverse tested on a block.",
      icon: "ShieldCheck",
    },
    {
      title: "Open 24/7",
      description: "The phone is answered day and night, every day, for a door stuck shut or stuck open.",
      icon: "Clock3",
    },
  ],

  relatedServices: [
    {
      name: "Garage Door Opener Repair Perth",
      href: "/garage-door-opener-repair-perth",
      description: "Motors, logic boards, receivers and remotes diagnosed and repaired.",
      icon: "Cpu",
    },
    {
      name: "Garage Door Motors Perth",
      href: "/garage-door-motors-perth",
      description: "Capital 1100N and 1500N belt-drive openers supplied and installed.",
      icon: "Cpu",
    },
    {
      name: "Avanti Garage Door Openers",
      href: "/avanti-garage-door-motors-perth",
      description: "SDO4 and RDO openers supplied, repaired and serviced across Perth.",
      icon: "Radio",
    },
    {
      name: "Centurion Euro 1250 Opener Repairs",
      href: "/centurion-garage-door-motors-perth",
      description: "Belt, gear and remote faults on Centurion's own opener.",
      icon: "Radio",
    },
    {
      name: "Garage Door Cable Repair Perth",
      href: "/garage-door-cable-repair-perth",
      description: "Snapped and off-drum lift cables on the door itself, replaced as a pair.",
      icon: "Cable",
    },
    {
      name: "Garage Door Motor Replacement Cost",
      href: "/garage-door-motor-replacement-cost-perth",
      description: "What a new opener costs when the old head unit is not worth repairing.",
      icon: "FileText",
    },
  ],

  serviceAreas: [
    "Joondalup",
    "Wanneroo",
    "Ellenbrook",
    "Morley",
    "Midland",
    "Canning Vale",
    "Southern River",
    "Cockburn Central",
    "Rockingham",
    "Mandurah",
  ],

  // Real Google reviews (the CMS page pins the same reviews by customer name).
  reviews: [
    {
      name: "Jacques D.",
      rating: 5,
      text:
        "Had an issue with the motor on an old SDO-1 unit. Called on a Monday, asked for Wednesday morning, and he came in early and gave me options. I chose to fully replace my system and rollers, and he removed the old system and rails too. Quick and easy — not even 45 minutes, with no issues.",
      service: "Motor Replacement",
    },
    {
      name: "Ross L.",
      rating: 5,
      text:
        "Great service. The team attended super quickly and solved the problem in minutes. They also previously replaced a broken motor in very quick time and at a very reasonable price. Can't recommend highly enough.",
      service: "Opener Repair",
    },
  ],

  faqs: [
    {
      question: "How much does it cost to replace a garage door opener belt in Perth?",
      answer:
        "It depends on the opener and the rail length, so we price a belt replacement once we have seen the unit, and you agree the figure before any work starts. The belt itself is a modest part; most of the cost is fitting it, setting its tension and resetting the opener. If the motor head has also failed, a new opener is usually better value, and the guide-price table on this page shows both the opener repair and the replacement figures.",
    },
    {
      question: "Can you replace just the belt on a garage door opener?",
      answer:
        "Yes, when the motor head is still sound. A snapped or stretched belt is replaced on its own, tensioned on the existing rail and the carriage reconnected, then the travel limits are reset. We check the door's springs and balance first, because a door that is too heavy is the usual reason a belt fails early, and replacing the belt without fixing that only brings the same fault back.",
    },
    {
      question: "My garage door belt snapped. Can I still open the door?",
      answer:
        "Yes. Pull the red emergency-release cord hanging from the carriage to disconnect the door from the opener, then lift the door by hand. If it is too heavy to lift or won't stay up, a spring has probably lost tension or broken too, so leave it down and call us. Don't run the motor with the belt off, and keep hands clear of the rail while the door is moving.",
    },
    {
      question: "Why does my garage door motor hum or click but the door won't move?",
      answer:
        "The three usual causes are a stripped drive gear inside the motor head, a snapped or slipping belt or chain, and a door that is still disconnected after someone pulled the manual release. A seized or badly unbalanced door can do the same, because the motor can't lift it. We check all of them on the visit; a gear repair falls under the opener repair row in the table on this page.",
    },
    {
      question: "Do you repair the rail on Avanti and Centurion openers?",
      answer:
        "Yes. The Avanti SDO4 runs a belt along a galvanised steel rail and the Centurion Euro 1250 is belt-driven too, and both rails can be bent by a car or by a manual release pulled with the door under load. We straighten a rail that is only out of line, replace a cracked or kinked section, re-fix a rail pulled away from the ceiling bracket, and re-tension the belt afterwards. We do the same on Merlin, B&D, Gliderol, Steel-Line, Boss and most other openers.",
    },
    {
      question: "Is it worth replacing the belt or gear, or should I get a new motor?",
      answer:
        "If the opener is under about ten years old, the motor runs strongly and only the belt, chain or gear has failed, a repair is usually the better value. If the head unit has burnt out, the logic board has failed as well, or parts for the model are no longer made, a new motor makes more sense and resets the warranty. We give you both prices on the visit and let you choose.",
    },
    {
      question: "Are you open after hours for a garage door that's stuck?",
      answer:
        "Yes. Our phone is answered 24 hours a day, 7 days a week, and a technician can be sent at night, on weekends and on public holidays when the door is stuck shut with the car inside or stuck open overnight. Work outside standard hours carries the after-hours surcharge listed on our price list, and we confirm it with you before anyone is sent.",
    },
  ],

  cta: {
    heading: "Motor Running but the Door Won't Move?",
    subtitle:
      "Tell us your opener's brand and what it is doing, and we'll bring the matching belt, chain or gear kit for a one-visit fix anywhere in Perth, any time of day.",
  },

  seo: {
    title: "Garage Door Motor Belt Replacement Perth | Rail & Gear",
    description:
      "Garage door belt snapped or motor humming but the door won't move? Belts, chains, rails and drive gears replaced on Avanti, Centurion and more. Open 24/7.",
  },
};
