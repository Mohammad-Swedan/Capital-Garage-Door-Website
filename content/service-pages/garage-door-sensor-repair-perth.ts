import type { ServicePage } from "@/types/service-page";

/**
 * /garage-door-sensor-repair-perth — safety sensors (photo eyes) and the "door won't close" fault.
 *
 * Why this page exists (2026-11-01 research, docs/seo/serp-pulls-2026-11-01.md):
 *  - Our how-to post /blog/how-to-fix-garage-door-sensor draws 2,396 AU impressions a quarter at
 *    position 5.9 for 1 click (the AI Overview answers the DIY question). The LOCAL tail has no
 *    page: "garage door sensor repair" 32 impressions @ 11.5 and "garage door sensor" 113 @ 26
 *    land on the opener page and the blog post.
 *  - This is the booking page the blog post hands over to ("when to call a pro"), pinned to the
 *    catalog's "Safety sensors / photo eyes" and "Motor / opener not working (repair)" rows.
 *  - Supporting page by design (the plan's small-page set).
 *
 * No literal price in the prose; the costGuidance rows below are the CMS_SERVICE_PAGES=off
 * fallback and mirror pricing-data.ts.
 */
export const garageDoorSensorRepairPerth: ServicePage = {
  serviceName: "Garage Door Sensor Repair Perth",
  slug: "garage-door-sensor-repair-perth",
  pageType: "service",

  hero: {
    h1: "Garage Door Sensor Repair & Replacement Perth",
    subtitle:
      "Door won't close, reverses halfway or the opener light flashes? We realign, rewire or replace the safety sensors and reset the opener so the door closes first time, across Perth.",
    badges: [
      { icon: "ScanEye", label: "Photo-Eye Sensors" },
      { icon: "Clock3", label: "Same-Day Visits" },
      { icon: "ShieldCheck", label: "Safety Reverse Tested" },
      { icon: "MapPin", label: "All Perth Suburbs" },
    ],
    image:
      "https://jadara-hub.b-cdn.net/capital-garage-door/gallery/garage-door-motor-installation-perth.webp",
    imageAlt: "New belt-drive garage door opener fitted in a Perth garage with the safety sensors set up at the door opening",
    floatingCardLabel: "Closes First Time",
  },

  directAnswer:
    "Capital Garage Doors repairs and replaces garage door safety sensors across Perth. The two photo-eye sensors at the bottom of the door opening are the usual reason a door refuses to close, stops and reverses, or closes only while the wall button is held down. We realign and clean the sensors, repair chewed or corroded wiring, replace a failed sensor pair with one matched to your opener, and reset the opener's force and travel limits, then prove the safety reverse before we leave. If the fault is the opener's board rather than the sensors, we repair that on the same visit.",

  intro: {
    heading: "Why Garage Door Sensors Fail, and How We Fix Them Properly",
    paragraphs: [
      "The safety sensors are a transmitter and a receiver mounted a hand's width above the floor on each side of the opening. They throw an invisible beam across the doorway and the opener will not close the door unless the beam is unbroken. It is a simple system and that is its weakness: a wheelie bin, a leaf blower's dust, afternoon sun straight into the receiver, a bracket knocked by a car bumper or a wire nicked by a rake will all break the beam, and the door behaves as if something is in the way.",
      "Most sensor call-outs in Perth are alignment and wiring. One bracket has been bent so the beam misses, or the low-voltage wire that runs up to the motor has corroded at a joint, been crushed under a wheel or eaten through by a rodent. We re-set the brackets so both indicator lights hold steady, repair or re-run the wiring in conduit where it keeps getting damaged, and shield a receiver that faces the setting sun. When a sensor has genuinely failed we fit a pair matched to the opener's brand, because a mismatched generic pair is the second most common reason a door still will not close after a DIY fix.",
      "Sometimes the sensors are fine and the opener is the problem: a logic board that no longer reads the sensor circuit, or force and limit settings that make the door reverse before it reaches the floor. Our technicians carry sensors, boards and remotes for the common Perth openers, so the visit ends with a door that closes, not a second appointment. If you would rather try the easy checks first, our guide to fixing a garage door sensor is linked below.",
    ],
  },

  problems: [
    { label: "Door won't close, opener light flashes", icon: "XCircle" },
    { label: "Door closes, then reverses halfway", icon: "RefreshCw" },
    { label: "Closes only while holding the wall button", icon: "PauseCircle" },
    { label: "Sensor light off or blinking", icon: "ScanEye" },
    { label: "Sensor wire cut, chewed or corroded", icon: "Cable" },
    { label: "Sensors fine but the opener board has failed", icon: "Cpu" },
  ],

  includedItems: [
    "Sensors cleaned, realigned and brackets re-set",
    "Low-voltage sensor wiring repaired or re-run in conduit",
    "Failed sensor pair replaced with one matched to your opener",
    "Sun-glare shielding where the receiver faces the afternoon sun",
    "Opener force and travel limits reset after the repair",
    "Safety reverse tested with a block under the door",
    "Logic board or opener repair on the same visit if that is the fault",
    "Same-day visits across Perth; a fixed quote agreed first",
  ],

  processSteps: [
    {
      title: "Tell us what the door does",
      description:
        "Won't close at all, reverses part-way, or closes only with the button held: each points to a different fault and we bring the right parts.",
      icon: "Camera",
    },
    {
      title: "Check the beam",
      description:
        "Both sensor lights are read at the door and at the motor to separate an alignment or wiring fault from a failed sensor or board.",
      icon: "ScanEye",
    },
    {
      title: "Fix the cause",
      description:
        "Brackets re-set, wiring repaired or re-run, or a matched sensor pair fitted; a failed board is repaired or replaced.",
      icon: "Wrench",
    },
    {
      title: "Reset the opener",
      description:
        "Force and travel limits are set so the door reaches the floor and seals without reversing.",
      icon: "Settings",
    },
    {
      title: "Prove the safety reverse",
      description:
        "The door is closed on a block and must reverse; a door that does not is not safe to leave.",
      icon: "ShieldCheck",
    },
  ],

  // Mirrors pricing-data.ts — the live CMS page pins the same catalog rows.
  costGuidance: {
    intro:
      "Straight from our price list. Sensor work is priced as a pair with attendance included; if the opener's board turns out to be the fault, the repair row applies instead. As a guide:",
    rows: [
      {
        label: "Safety sensors / photo eyes",
        price: "$180–$280",
        note: "Pair supplied and fitted, aligned, wired and tested",
      },
      {
        label: "Motor / opener repair",
        price: "$380–$490",
        note: "When the logic board or the opener itself is the fault",
      },
    ],
  },

  whyChoose: [
    {
      title: "Cause, not symptom",
      description: "We read the sensor circuit at the door and at the motor, so a wiring or board fault is not misdiagnosed as a sensor.",
      icon: "Search",
    },
    {
      title: "Matched sensors",
      description: "Replacement pairs are matched to the opener's brand, which is why they keep working.",
      icon: "BadgeCheck",
    },
    {
      title: "Wiring done once",
      description: "Damaged runs are re-run in conduit so the same fault does not come back next summer.",
      icon: "Cable",
    },
    {
      title: "Safety proven",
      description: "Every visit ends with the safety reverse tested; a door that will not reverse is not left in service.",
      icon: "ShieldCheck",
    },
    {
      title: "Opener expertise",
      description: "If the sensors are fine and the board has failed, the same technician fixes the opener on the spot.",
      icon: "Cpu",
    },
    {
      title: "All of Perth, same-day",
      description: "A door that will not close is a security problem, so sensor jobs are booked as priority visits.",
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
      name: "How to Fix a Garage Door Sensor",
      href: "/blog/how-to-fix-garage-door-sensor",
      description: "The safe checks to try yourself before booking a visit.",
      icon: "HelpCircle",
    },
    {
      name: "Garage Door Won't Close?",
      href: "/problems/garage-door-wont-close",
      description: "Every reason a door refuses to close, from sensors to springs.",
      icon: "XCircle",
    },
    {
      name: "Garage Door Repairs Perth",
      href: "/garage-door-repairs-perth",
      description: "Springs, cables, motors, tracks and panels — the full repair service.",
      icon: "Wrench",
    },
    {
      name: "Garage Door Motor Replacement Cost",
      href: "/garage-door-motor-replacement-cost-perth",
      description: "What a new opener costs when an old board is not worth repairing.",
      icon: "FileText",
    },
    {
      name: "Garage Door Servicing Perth",
      href: "/garage-door-maintenance-perth",
      description: "Sensors, limits and the safety reverse are checked on every service.",
      icon: "ShieldCheck",
    },
  ],

  serviceAreas: [
    "Ellenbrook",
    "Joondalup",
    "Morley",
    "Midland",
    "Canning Vale",
    "Thornlie",
    "Cockburn Central",
    "Fremantle",
    "Rockingham",
    "Mandurah",
  ],

  // Real Google reviews (the CMS page pins the same reviews by customer name).
  reviews: [
    {
      name: "Ross L.",
      rating: 5,
      text: "Great service. The team attended super quickly and solved the problem in minutes. They also previously replaced our motor and that was the same — quick, friendly and professional.",
      service: "Opener Repair",
    },
    {
      name: "Jacques D.",
      rating: 5,
      text: "Had an issue with the motor on an old SDO-1 unit. Called on a Monday, asked for Wednesday morning, and he came in early and gave me options. Quick and easy, with no issues.",
      service: "Motor Replacement",
    },
  ],

  faqs: [
    {
      question: "How much does it cost to replace garage door sensors in Perth?",
      answer:
        "Sensors are priced as a pair on our price list, and the guide-price table on this page shows the current figure, which includes attendance, fitting, wiring and alignment. Many sensor call-outs do not need new sensors at all: a realignment or a wiring repair is charged at the lower end. If the opener's logic board is the real fault, the opener repair row applies instead, and we tell you which it is before any work starts.",
    },
    {
      question: "Why won't my garage door close when nothing is in the way?",
      answer:
        "Because the opener thinks something is. The sensors' beam is broken or they cannot see each other: one bracket has been knocked out of line, the lens is dusty or covered in cobwebs, afternoon sun is flooding the receiver, or the wire to the motor has corroded or been cut. The opener light usually flashes to tell you. Clean the lenses and check that both indicator lights are steady; if they are not, or the door still reverses, the sensors or the wiring need attention.",
    },
    {
      question: "Can I bypass the garage door sensors?",
      answer:
        "You can close the door by holding the wall button down, which is the built-in override, but you should not wire the sensors out permanently. The sensors are what stops the door closing on a child, a pet or a car, and an opener running without working sensors is unsafe and, on a rental or a strata property, a liability. A sensor fault is one of the cheaper garage door repairs, so it is not worth the risk.",
    },
    {
      question: "Do you replace sensors on all brands of opener?",
      answer:
        "Yes. We carry and fit sensor pairs matched to the openers Perth homes actually have, including Merlin, Chamberlain, B&D, ATA, Centurion, Avanti, Gliderol, Steel-Line, Superlift and Boss, plus universal pairs for older motors whose originals are no longer made. Brand matching matters: a generic pair wired to the wrong opener will often pair but keep tripping, which is the usual reason a DIY sensor replacement does not fix the problem.",
    },
    {
      question: "How do I tell if the sensors or the motor are faulty?",
      answer:
        "If the door opens normally but will not close, or closes and reverses, with the opener light flashing, the sensor circuit is the first suspect. If the door does nothing at all, or runs for a second and stops in both directions, the motor or its board is more likely. If the door closes only while the wall button is held, the opener is telling you the beam is broken. We check the circuit at both ends on the visit, so you do not pay for sensors a board fault would not fix.",
    },
    {
      question: "Why does my garage door reverse only in the afternoon?",
      answer:
        "Sun glare. On west- and north-west-facing garages in Perth the setting sun shines straight into the receiver and overwhelms the beam, so the door behaves as if something is in the way for an hour or two each day. The fix is to swap the transmitter and receiver sides, fit a sun hood to the receiver, or move the pair a little further into the opening. It is a quick job and part of a standard sensor visit.",
    },
  ],

  cta: {
    heading: "Door Won't Close? Book a Sensor Visit",
    subtitle:
      "Tell us what the door does and we will bring matched sensors, wiring and the common opener boards for a one-visit fix anywhere in Perth.",
  },

  seo: {
    title: "Garage Door Sensor Repair Perth | Safety Beam Faults",
    description:
      "Garage door won't close or reverses halfway? Safety sensors realigned, rewired or replaced across Perth and the opener reset the same day. Fixed quote first.",
  },
};
