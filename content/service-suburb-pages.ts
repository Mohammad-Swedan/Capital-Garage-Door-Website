import type { ServiceSuburbPage } from "@/types";
import { serviceSuburbPagesBatch2 } from "@/content/service-suburb-pages-batch2";
import { cockburnCentralPage } from "@/content/service-suburb-pages-cockburn-central";

/**
 * Service + Suburb landing pages (Page Type 2).
 *
 * Each entry powers a reusable "[Service] in [Suburb]" local-SEO page at a flat
 * URL (e.g. /garage-door-repairs-joondalup). Keep copy unique per suburb — vary
 * the intro, nearby suburbs, and problems so pages don't read as duplicates.
 *
 * CMS-ready: this array is the only thing a new suburb page needs. Swap this
 * module for a CMS/API fetch inside lib/data/service-suburb-pages.ts without
 * touching the template or components.
 *
 * NOTE: `localProof` entries are placeholders — wire them to real CRM job /
 * case-study data (service performed, suburb, before/after photos) once that
 * integration is available.
 */
export const serviceSuburbPages: ServiceSuburbPage[] = [
  {
    slug: "garage-door-repairs-joondalup",
    service: "Garage Door Repairs",
    suburb: "Joondalup",
    region: "Perth, WA",

    // Dedicated pages for these suburbs don't exist yet — link to the
    // service-areas index instead of a flat URL that would 404.
    nearbySuburbs: [
      { label: "Edgewater", href: "/service-areas" },
      { label: "Currambine", href: "/service-areas" },
      { label: "Heathridge", href: "/service-areas" },
      { label: "Connolly", href: "/service-areas" },
      { label: "Ocean Reef", href: "/service-areas" },
      { label: "Mullaloo", href: "/service-areas" },
      { label: "Wanneroo", href: "/service-areas" },
      { label: "Woodvale", href: "/service-areas" },
    ],

    hero: {
      subtitle:
        "Fast, reliable garage door repair services for homes and businesses in Joondalup and nearby Perth suburbs.",
      trustBadges: [
        "Local Perth Team",
        "Fast Response",
        "Emergency Repairs",
        "Warranty Support",
      ],
    },

    directAnswer:
      "Capital Garage Doors provides garage door repairs in Joondalup, including motor issues, broken springs, damaged tracks, noisy doors, remote problems, and doors that won't open or close properly.",

    localIntro: [
      "From family homes near Lakeside Joondalup to businesses around the Joondalup CBD, a faulty garage door is more than an inconvenience — it affects your security, your daily routine, and the look of your property. Our local Perth technicians repair residential and commercial garage doors across Joondalup, with same-day and emergency options when you need to get moving fast.",
      "Whether it's a sudden breakdown — a door that won't open before the morning commute — or a slow-developing issue like grinding noise, jerky movement, or a remote that's stopped responding, we diagnose the real cause and fix it properly the first time. We regularly service the wider northern corridor too, including Edgewater, Currambine, Ocean Reef and Wanneroo.",
      "Not sure what's wrong? Tell us what you're seeing when you request a quote and we'll give you a clear idea of the likely fix and an honest estimate before we arrive — no guesswork, no surprise call-out fees.",
    ],

    availableServices: [
      {
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
        description:
          "Door stuck open or shut? Priority response across Joondalup to secure your home or business fast.",
        icon: "Siren",
      },
      {
        title: "Servicing & Maintenance",
        description:
          "Routine tune-ups that keep your door quiet, balanced and reliable — and prevent costly breakdowns.",
        icon: "Settings",
      },
    ],

    problems: [
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
    ],

    costGuidance: {
      intro:
        "There's no flat rate for garage door repairs in Joondalup — the cost depends on what's actually wrong and what your door needs. We give clear, upfront quotes before any work starts.",
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

    whyChooseUs: [
      {
        title: "Local Perth specialists",
        description:
          "A Perth-based team that knows Joondalup and the northern suburbs — not a faceless call centre.",
        icon: "MapPin",
      },
      {
        title: "Fast response up north",
        description:
          "We're set up to reach Joondalup and surrounding suburbs quickly, with same-day options.",
        icon: "Zap",
      },
      {
        title: "Clear, upfront quotes",
        description:
          "Honest pricing explained before we start — no hidden fees and no pressure.",
        icon: "FileText",
      },
      {
        title: "Quality parts",
        description:
          "We fit durable, correctly rated components so your repair actually lasts.",
        icon: "BadgeCheck",
      },
      {
        title: "After-service support",
        description:
          "Questions after we leave? We're a phone call away and happy to help.",
        icon: "LifeBuoy",
      },
      {
        title: "Warranty support",
        description:
          "Workmanship and parts backed by warranty for genuine peace of mind.",
        icon: "ShieldCheck",
      },
    ],

    relatedPages: [
      { label: "Garage Door Repairs Perth", href: "/garage-door-repairs-perth" },
      { label: "Garage Door Motor Replacement Perth", href: "/garage-door-repairs-perth" },
      { label: "Roller Door Repairs Perth", href: "/garage-door-repairs-perth" },
      { label: "Garage Door Installation Perth", href: "/garage-door-repairs-perth" },
      { label: "Emergency Garage Door Repairs Perth", href: "/garage-door-repairs-perth" },
    ],

    faqs: [
      {
        question: "Do you repair garage doors in Joondalup?",
        answer:
          "Yes. Capital Garage Doors repairs residential and commercial garage doors throughout Joondalup and the surrounding northern Perth suburbs, including same-day and emergency repairs.",
      },
      {
        question: "Can you repair garage door motors in Joondalup?",
        answer:
          "We do. We diagnose, repair and replace garage door motors and openers in Joondalup, and can recommend a suitable replacement unit if yours has reached the end of its life.",
      },
      {
        question: "Do you service nearby suburbs?",
        answer:
          "Yes — we regularly work across the northern corridor, including Edgewater, Currambine, Heathridge, Connolly, Ocean Reef, Mullaloo, Wanneroo and Woodvale.",
      },
      {
        question: "Can I get an estimate before booking?",
        answer:
          "Yes — describe the issue in our quote form and we'll give you a clearer idea of the likely repair and an estimate before we arrive.",
      },
      {
        question: "Do you offer emergency garage door repair?",
        answer:
          "Yes. If your door is stuck open or shut and your home or business isn't secure, we offer priority emergency repairs across Joondalup.",
      },
      {
        question: "How much does garage door repair cost in Joondalup?",
        answer:
          "It depends on the problem, the parts needed, your door type and the urgency. We always provide a clear, upfront quote before starting — request a quote and describe the issue for an accurate estimate.",
      },
    ],

    // PLACEHOLDER DATA — replace with real CRM job / case-study records
    // (service performed, suburb, problem, solution, before/after photos).
    localProof: [
      {
        serviceType: "Spring Replacement",
        suburb: "Joondalup",
        problem: "Door wouldn't lift after a torsion spring snapped overnight.",
        solution: "Replaced both springs with correctly rated units and rebalanced the door — same day.",
      },
      {
        serviceType: "Motor Replacement",
        suburb: "Edgewater",
        problem: "Ageing opener was straining, reversing randomly and running loudly.",
        solution: "Fitted a quiet, warranty-backed motor and re-tuned the travel limits.",
      },
      {
        serviceType: "Off-Track Repair",
        suburb: "Ocean Reef",
        problem: "Door jumped its tracks and jammed at an angle after a knock.",
        solution: "Realigned the tracks, replaced two damaged rollers and tested full travel.",
      },
    ],

    seo: {
      title: "Garage Door Repairs Joondalup | Fast Local Repairs",
      description:
        "Fast, reliable garage door repairs in Joondalup, Perth. Broken springs, motors, tracks, remotes & noisy doors fixed by a local team. Emergency repairs & free quotes.",
    },
  },

  {
    slug: "garage-door-repairs-gosnells",
    service: "Garage Door Repairs",
    suburb: "Gosnells",
    region: "Perth, WA",

    // Southern River has its own live page; the rest link to the
    // service-areas index instead of a flat URL that would 404.
    nearbySuburbs: [
      { label: "Southern River", href: "/garage-door-repairs-southern-river" },
      { label: "Thornlie", href: "/service-areas" },
      { label: "Huntingdale", href: "/service-areas" },
      { label: "Maddington", href: "/service-areas" },
      { label: "Canning Vale", href: "/service-areas" },
      { label: "Kenwick", href: "/service-areas" },
      { label: "Armadale", href: "/service-areas" },
      { label: "Martin", href: "/service-areas" },
    ],

    hero: {
      subtitle:
        "Fast, reliable garage door repairs for homes and businesses across Gosnells — from a local team based right next door in Southern River.",
      trustBadges: [
        "Local Perth Team",
        "Fast Response",
        "Emergency Repairs",
        "Warranty Support",
      ],
    },

    directAnswer:
      "Capital Garage Doors provides garage door repairs across Gosnells, including broken springs and cables, worn motors and openers, off-track and noisy doors, faulty remotes, and doors that won't open or close properly.",

    localIntro: [
      "From the established streets around the Gosnells town centre to the newer family homes near Sutherlands Park and Mary Carroll Wetland, a garage door that won't cooperate is more than an annoyance — it affects your security, your morning routine and the kerbside look of your home. Because we're based just next door in Southern River, our technicians reach Gosnells fast, with same-day and emergency options when you're stuck.",
      "Gosnells has a real mix of homes — older brick-and-tile places with tilt or roller doors, and modern sectional doors on newer builds — so we see everything from snapped torsion springs and frayed cables to tired motors, jammed rollers and remotes that have simply stopped responding. We diagnose the real cause and fix it properly the first time, and we regularly service the wider area too, including Thornlie, Huntingdale, Maddington and Canning Vale.",
      "Not sure what's wrong? Tell us what you're seeing when you request a quote and we'll give you a clear idea of the likely repair and an honest estimate before we arrive — no guesswork and no surprise call-out fees.",
    ],

    availableServices: [
      {
        title: "Garage Door Repairs",
        description:
          "Diagnosis and repair for doors that won't open, close, or run smoothly — residential and commercial.",
        icon: "Wrench",
        href: "/garage-door-repairs-perth",
      },
      {
        title: "Motor & Opener Repairs",
        description:
          "Repair or replace worn-out garage door motors and openers with quality, warranty-backed units.",
        icon: "Cpu",
        href: "/garage-door-opener-repair-perth",
      },
      {
        title: "Spring & Cable Repairs",
        description:
          "Safe replacement of broken torsion springs and frayed cables — the most common cause of a dead door.",
        icon: "Cable",
        href: "/garage-door-spring-repair-perth",
      },
      {
        title: "Roller Door Repairs",
        description:
          "Realign, re-spring and service roller doors that stick, jam, or have lost their curtain tension.",
        icon: "Disc3",
        href: "/roller-door-repairs-perth",
      },
      {
        title: "Garage Door Installation",
        description:
          "Supply and install new roller, sectional, tilt and custom doors when a repair no longer stacks up.",
        icon: "LayoutPanelTop",
        href: "/garage-door-installation-perth",
      },
      {
        title: "Emergency Repairs",
        description:
          "Door stuck open or shut? Priority response across Gosnells to secure your home or business fast.",
        icon: "Siren",
        href: "/emergency-garage-door-repairs-perth",
      },
      {
        title: "Servicing & Maintenance",
        description:
          "Routine tune-ups that keep your door quiet, balanced and reliable — and prevent costly breakdowns.",
        icon: "Settings",
        href: "/garage-door-maintenance-perth",
      },
    ],

    problems: [
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
    ],

    costGuidance: {
      intro:
        "There's no flat rate for garage door repairs in Gosnells — the cost depends on what's actually wrong and what your door needs. We give clear, upfront quotes before any work starts.",
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

    whyChooseUs: [
      {
        title: "Based right next door",
        description:
          "Our workshop is in Southern River, minutes from Gosnells — so you get genuine local response times, not a call centre.",
        icon: "MapPin",
      },
      {
        title: "Fast, same-day options",
        description:
          "We're set up to reach Gosnells and the surrounding suburbs quickly, with same-day and emergency slots.",
        icon: "Zap",
      },
      {
        title: "Clear, upfront quotes",
        description:
          "Honest pricing explained before we start — no hidden fees and no pressure.",
        icon: "FileText",
      },
      {
        title: "Quality parts",
        description:
          "We fit durable, correctly rated components so your repair actually lasts.",
        icon: "BadgeCheck",
      },
      {
        title: "After-service support",
        description:
          "Questions after we leave? We're a phone call away and happy to help.",
        icon: "LifeBuoy",
      },
      {
        title: "Warranty support",
        description:
          "Workmanship and parts backed by warranty for genuine peace of mind.",
        icon: "ShieldCheck",
      },
    ],

    relatedPages: [
      { label: "Garage Door Repairs Perth", href: "/garage-door-repairs-perth" },
      { label: "Garage Door Spring Repair Perth", href: "/garage-door-spring-repair-perth" },
      { label: "Garage Door Opener & Motor Repair", href: "/garage-door-opener-repair-perth" },
      { label: "Emergency Garage Door Repairs", href: "/emergency-garage-door-repairs-perth" },
      { label: "Garage Door Installation Perth", href: "/garage-door-installation-perth" },
    ],

    faqs: [
      {
        question: "Do you repair garage doors in Gosnells?",
        answer:
          "Yes. Capital Garage Doors repairs residential and commercial garage doors throughout Gosnells and the surrounding south-east Perth suburbs, including same-day and emergency repairs.",
      },
      {
        question: "How quickly can you get to Gosnells?",
        answer:
          "Quickly — our workshop is next door in Southern River, so Gosnells is one of our closest service areas. We offer same-day bookings and priority emergency response when your door isn't secure.",
      },
      {
        question: "Can you repair garage door motors and springs in Gosnells?",
        answer:
          "We do. We diagnose, repair and replace garage door motors, openers, torsion springs and cables in Gosnells, and can recommend a suitable replacement unit if yours has reached the end of its life.",
      },
      {
        question: "Do you service suburbs near Gosnells?",
        answer:
          "Yes — we regularly work across the wider area, including Southern River, Thornlie, Huntingdale, Maddington, Canning Vale, Kenwick and Armadale.",
      },
      {
        question: "Do you offer emergency garage door repair in Gosnells?",
        answer:
          "Yes. If your door is stuck open or shut and your home or business isn't secure, we offer priority emergency repairs across Gosnells.",
      },
      {
        question: "How much does garage door repair cost in Gosnells?",
        answer:
          "It depends on the problem, the parts needed, your door type and the urgency. We always provide a clear, upfront quote before starting — request a quote and describe the issue for an accurate estimate.",
      },
    ],

    // PLACEHOLDER DATA — replace with real CRM job / case-study records
    // (service performed, suburb, problem, solution, before/after photos).
    localProof: [
      {
        serviceType: "Spring Replacement",
        suburb: "Gosnells",
        problem: "Door wouldn't lift after a torsion spring snapped overnight.",
        solution: "Replaced both springs with correctly rated units and rebalanced the door — same day.",
      },
      {
        serviceType: "Motor Replacement",
        suburb: "Thornlie",
        problem: "Ageing opener was straining, reversing randomly and running loudly.",
        solution: "Fitted a quiet, warranty-backed motor and re-tuned the travel limits.",
      },
      {
        serviceType: "Off-Track Repair",
        suburb: "Huntingdale",
        problem: "Door jumped its tracks and jammed at an angle after a knock.",
        solution: "Realigned the tracks, replaced two damaged rollers and tested full travel.",
      },
    ],

    seo: {
      title: "Garage Door Repairs Gosnells | Fast Local Service",
      description:
        "Fast, local garage door repairs in Gosnells, Perth. Broken springs, motors, tracks, remotes & noisy doors fixed same-day by a team based next door. Free quotes.",
    },
  },

  {
    slug: "garage-door-repairs-cannington",
    service: "Garage Door Repairs",
    suburb: "Cannington",
    region: "Perth, WA",

    nearbySuburbs: [
      { label: "Wilson", href: "/service-areas" },
      { label: "Bentley", href: "/service-areas" },
      { label: "Beckenham", href: "/service-areas" },
      { label: "Welshpool", href: "/service-areas" },
      { label: "Queens Park", href: "/service-areas" },
      { label: "East Cannington", href: "/service-areas" },
      { label: "Victoria Park", href: "/service-areas" },
      { label: "Willetton", href: "/service-areas" },
    ],

    hero: {
      subtitle:
        "Fast, reliable garage door repairs and new-door installation for homes and businesses across Cannington and the surrounding Perth suburbs.",
      trustBadges: [
        "Local Perth Team",
        "Fast Response",
        "Emergency Repairs",
        "Warranty Support",
      ],
    },

    directAnswer:
      "Capital Garage Doors provides garage door repairs and installation across Cannington, including broken springs and cables, worn motors and openers, off-track and noisy doors, faulty remotes, and doors that won't open or close properly.",

    localIntro: [
      "Cannington is one of the south-east corridor's busiest hubs — home to Westfield Carousel, the Leisureplex and a steady mix of retail, light-industrial and residential streets around Queens Park and the Canning River. A garage door that jams or won't close is a security and productivity problem whether it's on a family home or a business roller shutter, and our local Perth technicians handle both, with same-day and emergency options.",
      "We repair every door type you'll find around Cannington — older tilt and roller doors on established homes, sectional doors on newer builds, and larger commercial roller doors on units near Welshpool and East Cannington. From snapped springs and tired motors to off-track rollers and dead remotes, we diagnose the real cause and fix it right the first time. When a door is past repair, we also supply and install new units. We regularly service the surrounding area too, including Wilson, Bentley, Beckenham and Victoria Park.",
      "Not sure whether you need a repair or a replacement? Tell us what you're seeing when you request a quote and we'll give you a clear recommendation and an honest estimate before we arrive — no guesswork, no surprise call-out fees.",
    ],

    availableServices: [
      {
        title: "Garage Door Repairs",
        description:
          "Diagnosis and repair for doors that won't open, close, or run smoothly — residential and commercial.",
        icon: "Wrench",
        href: "/garage-door-repairs-perth",
      },
      {
        title: "Motor & Opener Repairs",
        description:
          "Repair or replace worn-out garage door motors and openers with quality, warranty-backed units.",
        icon: "Cpu",
        href: "/garage-door-opener-repair-perth",
      },
      {
        title: "Spring & Cable Repairs",
        description:
          "Safe replacement of broken torsion springs and frayed cables — the most common cause of a dead door.",
        icon: "Cable",
        href: "/garage-door-spring-repair-perth",
      },
      {
        title: "Roller Door Repairs",
        description:
          "Realign, re-spring and service roller doors that stick, jam, or have lost their curtain tension.",
        icon: "Disc3",
        href: "/roller-door-repairs-perth",
      },
      {
        title: "Garage Door Installation",
        description:
          "Supply and install new roller, sectional, tilt and custom doors for Cannington homes and businesses.",
        icon: "LayoutPanelTop",
        href: "/garage-door-installation-perth",
      },
      {
        title: "Emergency Repairs",
        description:
          "Door stuck open or shut? Priority response across Cannington to secure your home or business fast.",
        icon: "Siren",
        href: "/emergency-garage-door-repairs-perth",
      },
      {
        title: "Servicing & Maintenance",
        description:
          "Routine tune-ups that keep your door quiet, balanced and reliable — and prevent costly breakdowns.",
        icon: "Settings",
        href: "/garage-door-maintenance-perth",
      },
    ],

    problems: [
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
    ],

    costGuidance: {
      intro:
        "There's no flat rate for garage door repairs in Cannington — the cost depends on what's actually wrong and what your door needs. We give clear, upfront quotes before any work starts, for both homes and businesses.",
      factors: [
        "The type of problem (a remote re-pair is very different to a spring replacement)",
        "Parts required and their quality (genuine vs aftermarket components)",
        "Your door type — roller, sectional, tilt, custom or commercial",
        "Urgency — standard booking vs after-hours emergency call-out",
        "Site access and how the door is installed",
        "Whether a repair will last, or a new installation is the smarter long-term option",
      ],
      note: "Describe the issue in your quote request for a faster, more accurate estimate.",
    },

    whyChooseUs: [
      {
        title: "Local Perth specialists",
        description:
          "A Perth-based team that knows Cannington and the south-east corridor — not a faceless call centre.",
        icon: "MapPin",
      },
      {
        title: "Homes and businesses",
        description:
          "Residential doors and commercial roller shutters alike — we're set up for both around Cannington.",
        icon: "Zap",
      },
      {
        title: "Clear, upfront quotes",
        description:
          "Honest pricing explained before we start — no hidden fees and no pressure.",
        icon: "FileText",
      },
      {
        title: "Quality parts",
        description:
          "We fit durable, correctly rated components so your repair actually lasts.",
        icon: "BadgeCheck",
      },
      {
        title: "Repair or replace advice",
        description:
          "We'll tell you honestly when a repair makes sense and when a new door is the better value.",
        icon: "LifeBuoy",
      },
      {
        title: "Warranty support",
        description:
          "Workmanship and parts backed by warranty for genuine peace of mind.",
        icon: "ShieldCheck",
      },
    ],

    relatedPages: [
      { label: "Garage Door Repairs Perth", href: "/garage-door-repairs-perth" },
      { label: "Garage Door Spring Repair Perth", href: "/garage-door-spring-repair-perth" },
      { label: "Garage Door Opener & Motor Repair", href: "/garage-door-opener-repair-perth" },
      { label: "Emergency Garage Door Repairs", href: "/emergency-garage-door-repairs-perth" },
      { label: "Garage Door Installation Perth", href: "/garage-door-installation-perth" },
    ],

    faqs: [
      {
        question: "Do you repair garage doors in Cannington?",
        answer:
          "Yes. Capital Garage Doors repairs residential and commercial garage doors throughout Cannington and the surrounding south-east Perth suburbs, including same-day and emergency repairs.",
      },
      {
        question: "Do you install new garage doors in Cannington?",
        answer:
          "We do. As well as repairs, we supply and install new roller, sectional, tilt and custom garage doors in Cannington — a good option when an older door is past economical repair.",
      },
      {
        question: "Can you repair commercial roller doors in Cannington?",
        answer:
          "Yes. We service commercial roller shutters and industrial doors around Cannington, Welshpool and East Cannington, as well as residential garage doors.",
      },
      {
        question: "Do you service suburbs near Cannington?",
        answer:
          "Yes — we regularly work across the wider area, including Wilson, Bentley, Beckenham, Welshpool, Queens Park, Victoria Park and Willetton.",
      },
      {
        question: "Do you offer emergency garage door repair in Cannington?",
        answer:
          "Yes. If your door is stuck open or shut and your home or business isn't secure, we offer priority emergency repairs across Cannington.",
      },
      {
        question: "How much does garage door repair cost in Cannington?",
        answer:
          "It depends on the problem, the parts needed, your door type and the urgency. We always provide a clear, upfront quote before starting — request a quote and describe the issue for an accurate estimate.",
      },
    ],

    // PLACEHOLDER DATA — replace with real CRM job / case-study records
    // (service performed, suburb, problem, solution, before/after photos).
    localProof: [
      {
        serviceType: "Commercial Roller Repair",
        suburb: "Cannington",
        problem: "Business roller shutter jammed halfway and wouldn't secure the unit overnight.",
        solution: "Freed the curtain, replaced worn guides and re-tensioned the barrel — same day.",
      },
      {
        serviceType: "Spring Replacement",
        suburb: "Wilson",
        problem: "Sectional door dropped and wouldn't lift after a torsion spring failed.",
        solution: "Replaced both springs with correctly rated units and rebalanced the door.",
      },
      {
        serviceType: "New Door Installation",
        suburb: "Beckenham",
        problem: "Old tilt door was warped, noisy and beyond economical repair.",
        solution: "Removed the old door and installed a new insulated sectional door with a quiet motor.",
      },
    ],

    seo: {
      title: "Garage Door Repairs Cannington | Same-Day Perth",
      description:
        "Garage door repairs & installation in Cannington, Perth. Springs, motors, tracks, remotes & roller shutters fixed same-day for homes & businesses. Free quotes.",
    },
  },

  {
    slug: "garage-door-repairs-lathlain",
    service: "Garage Door Repairs",
    suburb: "Lathlain",
    region: "Perth, WA",

    nearbySuburbs: [
      { label: "Victoria Park", href: "/service-areas" },
      { label: "Carlisle", href: "/service-areas" },
      { label: "East Victoria Park", href: "/service-areas" },
      { label: "Burswood", href: "/service-areas" },
      { label: "Rivervale", href: "/service-areas" },
      { label: "Kensington", href: "/service-areas" },
      { label: "Bentley", href: "/service-areas" },
      { label: "Belmont", href: "/service-areas" },
    ],

    hero: {
      subtitle:
        "Fast, reliable garage door repairs for the character homes and modern builds of Lathlain and the inner south-east Perth suburbs.",
      trustBadges: [
        "Local Perth Team",
        "Fast Response",
        "Emergency Repairs",
        "Warranty Support",
      ],
    },

    directAnswer:
      "Capital Garage Doors provides garage door repairs across Lathlain, including broken springs and cables, worn motors and openers, off-track and noisy doors, faulty remotes, and doors that won't open or close properly.",

    localIntro: [
      "Lathlain is a tightly held inner south-east pocket close to the city — leafy streets of character homes around Lathlain Park and Mineral Resources Park, with newer townhouses filling in between. Many of these homes have older tilt and roller doors that have been opening and closing for decades, so worn springs, tired motors and off-track rollers are common. Our local Perth technicians repair residential and commercial doors across Lathlain, with same-day and emergency options.",
      "Whether it's a sudden breakdown — a door that won't open before the drive into the CBD — or a slow-developing issue like grinding noise, jerky travel or a remote that's stopped responding, we diagnose the real cause and fix it properly the first time. We work throughout the surrounding area too, including Victoria Park, Carlisle, East Victoria Park and Rivervale.",
      "Not sure what's wrong? Tell us what you're seeing when you request a quote and we'll give you a clear idea of the likely repair and an honest estimate before we arrive — no guesswork and no surprise call-out fees.",
    ],

    availableServices: [
      {
        title: "Garage Door Repairs",
        description:
          "Diagnosis and repair for doors that won't open, close, or run smoothly — residential and commercial.",
        icon: "Wrench",
        href: "/garage-door-repairs-perth",
      },
      {
        title: "Motor & Opener Repairs",
        description:
          "Repair or replace worn-out garage door motors and openers with quality, warranty-backed units.",
        icon: "Cpu",
        href: "/garage-door-opener-repair-perth",
      },
      {
        title: "Spring & Cable Repairs",
        description:
          "Safe replacement of broken torsion springs and frayed cables — the most common cause of a dead door.",
        icon: "Cable",
        href: "/garage-door-spring-repair-perth",
      },
      {
        title: "Roller Door Repairs",
        description:
          "Realign, re-spring and service roller doors that stick, jam, or have lost their curtain tension.",
        icon: "Disc3",
        href: "/roller-door-repairs-perth",
      },
      {
        title: "Garage Door Installation",
        description:
          "Supply and install new roller, sectional, tilt and custom doors when a repair no longer stacks up.",
        icon: "LayoutPanelTop",
        href: "/garage-door-installation-perth",
      },
      {
        title: "Emergency Repairs",
        description:
          "Door stuck open or shut? Priority response across Lathlain to secure your home fast.",
        icon: "Siren",
        href: "/emergency-garage-door-repairs-perth",
      },
      {
        title: "Servicing & Maintenance",
        description:
          "Routine tune-ups that keep your door quiet, balanced and reliable — and prevent costly breakdowns.",
        icon: "Settings",
        href: "/garage-door-maintenance-perth",
      },
    ],

    problems: [
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
    ],

    costGuidance: {
      intro:
        "There's no flat rate for garage door repairs in Lathlain — the cost depends on what's actually wrong and what your door needs. We give clear, upfront quotes before any work starts.",
      factors: [
        "The type of problem (a remote re-pair is very different to a spring replacement)",
        "Parts required and their quality (genuine vs aftermarket components)",
        "Your door type — older tilt, roller, sectional or custom",
        "Urgency — standard booking vs after-hours emergency call-out",
        "Site access and how the door is installed",
        "Whether a repair will last, or a replacement is the smarter long-term option",
      ],
      note: "Describe the issue in your quote request for a faster, more accurate estimate.",
    },

    whyChooseUs: [
      {
        title: "Local Perth specialists",
        description:
          "A Perth-based team that knows Lathlain and the inner south-east — not a faceless call centre.",
        icon: "MapPin",
      },
      {
        title: "Good with older doors",
        description:
          "We're experienced with the tilt and roller doors common on Lathlain's established homes.",
        icon: "Zap",
      },
      {
        title: "Clear, upfront quotes",
        description:
          "Honest pricing explained before we start — no hidden fees and no pressure.",
        icon: "FileText",
      },
      {
        title: "Quality parts",
        description:
          "We fit durable, correctly rated components so your repair actually lasts.",
        icon: "BadgeCheck",
      },
      {
        title: "After-service support",
        description:
          "Questions after we leave? We're a phone call away and happy to help.",
        icon: "LifeBuoy",
      },
      {
        title: "Warranty support",
        description:
          "Workmanship and parts backed by warranty for genuine peace of mind.",
        icon: "ShieldCheck",
      },
    ],

    relatedPages: [
      { label: "Garage Door Repairs Perth", href: "/garage-door-repairs-perth" },
      { label: "Garage Door Spring Repair Perth", href: "/garage-door-spring-repair-perth" },
      { label: "Garage Door Opener & Motor Repair", href: "/garage-door-opener-repair-perth" },
      { label: "Emergency Garage Door Repairs", href: "/emergency-garage-door-repairs-perth" },
      { label: "Garage Door Installation Perth", href: "/garage-door-installation-perth" },
    ],

    faqs: [
      {
        question: "Do you repair garage doors in Lathlain?",
        answer:
          "Yes. Capital Garage Doors repairs residential and commercial garage doors throughout Lathlain and the surrounding inner south-east Perth suburbs, including same-day and emergency repairs.",
      },
      {
        question: "Can you repair older tilt and roller doors in Lathlain?",
        answer:
          "We can. Many Lathlain homes have older tilt or roller doors, and we're experienced in repairing, re-springing and servicing them — or replacing them when that's the better long-term value.",
      },
      {
        question: "Can you repair garage door motors in Lathlain?",
        answer:
          "Yes. We diagnose, repair and replace garage door motors and openers in Lathlain, and can recommend a suitable replacement unit if yours has reached the end of its life.",
      },
      {
        question: "Do you service suburbs near Lathlain?",
        answer:
          "Yes — we regularly work across the wider area, including Victoria Park, Carlisle, East Victoria Park, Burswood, Rivervale and Kensington.",
      },
      {
        question: "Do you offer emergency garage door repair in Lathlain?",
        answer:
          "Yes. If your door is stuck open or shut and your home isn't secure, we offer priority emergency repairs across Lathlain.",
      },
      {
        question: "How much does garage door repair cost in Lathlain?",
        answer:
          "It depends on the problem, the parts needed, your door type and the urgency. We always provide a clear, upfront quote before starting — request a quote and describe the issue for an accurate estimate.",
      },
    ],

    // PLACEHOLDER DATA — replace with real CRM job / case-study records
    // (service performed, suburb, problem, solution, before/after photos).
    localProof: [
      {
        serviceType: "Spring Replacement",
        suburb: "Lathlain",
        problem: "Older tilt door wouldn't lift after a spring snapped overnight.",
        solution: "Replaced the springs with correctly rated units and rebalanced the door — same day.",
      },
      {
        serviceType: "Motor Replacement",
        suburb: "Victoria Park",
        problem: "Ageing opener was straining, reversing randomly and running loudly.",
        solution: "Fitted a quiet, warranty-backed motor and re-tuned the travel limits.",
      },
      {
        serviceType: "Off-Track Repair",
        suburb: "Carlisle",
        problem: "Roller door jumped its tracks and jammed at an angle.",
        solution: "Realigned the tracks, replaced two damaged rollers and tested full travel.",
      },
    ],

    seo: {
      title: "Garage Door Repairs Lathlain | Local Perth Team",
      description:
        "Fast, reliable garage door repairs in Lathlain, Perth. Broken springs, motors, tracks, remotes & noisy doors fixed by a local team. Emergency repairs & free quotes.",
    },
  },

  {
    slug: "garage-door-repairs-southern-river",
    service: "Garage Door Repairs",
    suburb: "Southern River",
    region: "Perth, WA",

    nearbySuburbs: [
      { label: "Gosnells", href: "/garage-door-repairs-gosnells" },
      { label: "Canning Vale", href: "/service-areas" },
      { label: "Huntingdale", href: "/service-areas" },
      { label: "Thornlie", href: "/service-areas" },
      { label: "Piara Waters", href: "/service-areas" },
      { label: "Harrisdale", href: "/service-areas" },
      { label: "Forrestdale", href: "/service-areas" },
      { label: "Maddington", href: "/service-areas" },
    ],

    hero: {
      subtitle:
        "Garage door repairs and installation from a team based right here in Southern River — fast, local service for your home or business.",
      trustBadges: [
        "Based in Southern River",
        "Fast Response",
        "Emergency Repairs",
        "Warranty Support",
      ],
    },

    directAnswer:
      "Capital Garage Doors is based in Southern River and provides garage door repairs and installation across the suburb, including broken springs and cables, worn motors and openers, off-track and noisy doors, faulty remotes, and doors that won't open or close properly.",

    localIntro: [
      "Southern River is our home suburb — our workshop is right here on Carnegie Parade, so there's no closer garage door team for local residents. From the newer estates near Southern River College to the larger semi-rural blocks toward the wetlands, we know the area's homes and the doors on them, and we can usually be on site fast with same-day and emergency options.",
      "Because Southern River has so many newer homes, we see a lot of modern sectional doors and automatic openers — along with the occasional larger custom or double door on the bigger blocks. Whether it's a snapped spring, a tired motor, an off-track roller or a remote that's stopped responding, we diagnose the real cause and fix it properly the first time. When a door is past its best, we also supply and install new units. We regularly service the neighbouring suburbs too, including Gosnells, Canning Vale, Huntingdale and Thornlie.",
      "Not sure whether you need a repair or a replacement? Tell us what you're seeing when you request a quote and we'll give you a clear recommendation and an honest estimate before we arrive — no guesswork and no surprise call-out fees.",
    ],

    availableServices: [
      {
        title: "Garage Door Repairs",
        description:
          "Diagnosis and repair for doors that won't open, close, or run smoothly — residential and commercial.",
        icon: "Wrench",
        href: "/garage-door-repairs-perth",
      },
      {
        title: "Motor & Opener Repairs",
        description:
          "Repair or replace worn-out garage door motors and openers with quality, warranty-backed units.",
        icon: "Cpu",
        href: "/garage-door-opener-repair-perth",
      },
      {
        title: "Spring & Cable Repairs",
        description:
          "Safe replacement of broken torsion springs and frayed cables — the most common cause of a dead door.",
        icon: "Cable",
        href: "/garage-door-spring-repair-perth",
      },
      {
        title: "Roller Door Repairs",
        description:
          "Realign, re-spring and service roller doors that stick, jam, or have lost their curtain tension.",
        icon: "Disc3",
        href: "/roller-door-repairs-perth",
      },
      {
        title: "Garage Door Installation",
        description:
          "Supply and install new roller, sectional, tilt and custom doors for Southern River homes.",
        icon: "LayoutPanelTop",
        href: "/garage-door-installation-perth",
      },
      {
        title: "Emergency Repairs",
        description:
          "Door stuck open or shut? Priority local response across Southern River to secure your home fast.",
        icon: "Siren",
        href: "/emergency-garage-door-repairs-perth",
      },
      {
        title: "Servicing & Maintenance",
        description:
          "Routine tune-ups that keep your door quiet, balanced and reliable — and prevent costly breakdowns.",
        icon: "Settings",
        href: "/garage-door-maintenance-perth",
      },
    ],

    problems: [
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
    ],

    costGuidance: {
      intro:
        "There's no flat rate for garage door repairs in Southern River — the cost depends on what's actually wrong and what your door needs. As your local team, we give clear, upfront quotes before any work starts.",
      factors: [
        "The type of problem (a remote re-pair is very different to a spring replacement)",
        "Parts required and their quality (genuine vs aftermarket components)",
        "Your door type — roller, sectional, tilt or custom",
        "Urgency — standard booking vs after-hours emergency call-out",
        "Site access and how the door is installed",
        "Whether a repair will last, or a new installation is the smarter long-term option",
      ],
      note: "Describe the issue in your quote request for a faster, more accurate estimate.",
    },

    whyChooseUs: [
      {
        title: "Your local team",
        description:
          "Our workshop is right here in Southern River — you won't find a closer or more genuinely local garage door service.",
        icon: "MapPin",
      },
      {
        title: "Fast local response",
        description:
          "Being based in the suburb means short travel times and easy same-day and emergency bookings.",
        icon: "Zap",
      },
      {
        title: "Clear, upfront quotes",
        description:
          "Honest pricing explained before we start — no hidden fees and no pressure.",
        icon: "FileText",
      },
      {
        title: "Quality parts",
        description:
          "We fit durable, correctly rated components so your repair actually lasts.",
        icon: "BadgeCheck",
      },
      {
        title: "Repair or install",
        description:
          "From a quick fix to a full new-door installation, we handle it all locally.",
        icon: "LifeBuoy",
      },
      {
        title: "Warranty support",
        description:
          "Workmanship and parts backed by warranty for genuine peace of mind.",
        icon: "ShieldCheck",
      },
    ],

    relatedPages: [
      { label: "Garage Door Repairs Perth", href: "/garage-door-repairs-perth" },
      { label: "Garage Door Spring Repair Perth", href: "/garage-door-spring-repair-perth" },
      { label: "Garage Door Opener & Motor Repair", href: "/garage-door-opener-repair-perth" },
      { label: "Emergency Garage Door Repairs", href: "/emergency-garage-door-repairs-perth" },
      { label: "Garage Door Installation Perth", href: "/garage-door-installation-perth" },
    ],

    faqs: [
      {
        question: "Are you based in Southern River?",
        answer:
          "Yes. Capital Garage Doors is based in Southern River, on Carnegie Parade — so for local residents we're about as close as a garage door team gets, with fast same-day and emergency response.",
      },
      {
        question: "Do you repair and install garage doors in Southern River?",
        answer:
          "We do both. As well as repairing broken springs, motors, tracks and remotes, we supply and install new roller, sectional, tilt and custom garage doors across Southern River.",
      },
      {
        question: "Can you repair garage door motors and springs in Southern River?",
        answer:
          "Yes. We diagnose, repair and replace garage door motors, openers, torsion springs and cables in Southern River, and can recommend a suitable replacement unit if yours is worn out.",
      },
      {
        question: "Do you service suburbs near Southern River?",
        answer:
          "Yes — we regularly work across the neighbouring suburbs, including Gosnells, Canning Vale, Huntingdale, Thornlie, Piara Waters, Harrisdale and Forrestdale.",
      },
      {
        question: "Do you offer emergency garage door repair in Southern River?",
        answer:
          "Yes. If your door is stuck open or shut and your home isn't secure, we offer priority emergency repairs across Southern River — and being local, we can usually get there quickly.",
      },
      {
        question: "How much does garage door repair cost in Southern River?",
        answer:
          "It depends on the problem, the parts needed, your door type and the urgency. We always provide a clear, upfront quote before starting — request a quote and describe the issue for an accurate estimate.",
      },
    ],

    // PLACEHOLDER DATA — replace with real CRM job / case-study records
    // (service performed, suburb, problem, solution, before/after photos).
    localProof: [
      {
        serviceType: "Spring Replacement",
        suburb: "Southern River",
        problem: "Sectional door wouldn't lift after a torsion spring snapped overnight.",
        solution: "Replaced both springs with correctly rated units and rebalanced the door — same day.",
      },
      {
        serviceType: "New Door Installation",
        suburb: "Canning Vale",
        problem: "Builder's basic door was noisy and poorly insulated on a newer home.",
        solution: "Installed an insulated sectional door with a quiet, warranty-backed opener.",
      },
      {
        serviceType: "Motor Replacement",
        suburb: "Huntingdale",
        problem: "Ageing opener was straining, reversing randomly and running loudly.",
        solution: "Fitted a quiet, warranty-backed motor and re-tuned the travel limits.",
      },
    ],

    seo: {
      title: "Garage Door Repairs Southern River | Local Team",
      description:
        "Local garage door repairs & installation in Southern River, Perth — we're based right here. Springs, motors, tracks & remotes fixed fast. Free quotes.",
    },
  },

  // Batch 2 (2026-08): 15 research-picked suburbs, defined in
  // content/service-suburb-pages-batch2.ts (created in the CMS as drafts by
  // scripts/import-suburb-pages-batch2.ts).
  ...serviceSuburbPagesBatch2,

  // Cockburn Central (2026-08): built from dedicated keyword research; owns the
  // "cockburn" terms the Success page used to claim.
  cockburnCentralPage,
];
