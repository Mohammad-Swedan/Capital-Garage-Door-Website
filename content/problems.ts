import type { Problem } from "@/types";

export const problems: Problem[] = [
  {
    slug: "garage-door-wont-open",
    name: "Garage Door Won't Open",
    h1: "Garage Door Won't Open?",
    heroSubtitle:
      "If your garage door is stuck, not responding, or refusing to open, Capital Garage Door can inspect and repair the issue across Perth — same-day, in most cases.",
    metaTitle: "Garage Door Won't Open? Causes, Fixes & Same-Day Repair Perth",
    metaDescription:
      "Garage door won't open? Learn the common causes — broken springs, motor faults, snapped cables — what's safe to check yourself, and when to call a technician. Same-day repairs across Perth.",
    directAnswer:
      "A garage door may not open because of a motor issue, broken spring, snapped cable, blocked sensor, remote problem, power issue, or track obstruction. If the door feels heavy, is stuck, or looks damaged, avoid forcing it and contact a garage door technician.",
    causes: [
      {
        icon: "Cpu",
        title: "Motor not responding",
        description:
          "The opener motor may have tripped a breaker, burnt out a capacitor, or simply reached the end of its life.",
      },
      {
        icon: "Settings",
        title: "Broken spring",
        description:
          "Torsion or extension springs carry the door's full weight. A snapped spring makes the door too heavy to lift safely.",
      },
      {
        icon: "Cable",
        title: "Cable snapped",
        description:
          "A frayed or snapped lift cable can let the door drop suddenly or jam it part-way through its travel.",
      },
      {
        icon: "BatteryWarning",
        title: "Remote battery / signal issue",
        description:
          "A flat battery, lost pairing, or signal interference is one of the most common — and easiest to fix — causes.",
      },
      {
        icon: "ScanEye",
        title: "Sensor obstruction",
        description:
          "Dirty, misaligned, or blocked safety sensors will stop the door from closing or opening as a safety precaution.",
      },
      {
        icon: "TrafficCone",
        title: "Track obstruction",
        description:
          "Debris, a bent track, or worn rollers can physically jam the door partway through its travel.",
      },
      {
        icon: "Plug",
        title: "Power supply issue",
        description:
          "A tripped switchboard breaker, faulty outlet, or disconnected power lead will stop the opener dead.",
      },
      {
        icon: "Scale",
        title: "Door out of balance",
        description:
          "An unbalanced door puts extra strain on the opener and springs, eventually causing it to stop moving altogether.",
      },
    ],
    safeChecks: [
      "Check the remote battery and try a spare remote or the wall switch",
      "Check the power outlet the opener is plugged into",
      "Check the wall-mounted control switch is working",
      "Look for any visible obstruction along the door's track",
      "Check whether the safety sensors near the floor are blocked or dirty",
    ],
    doNotDo: [
      "Do not force the door open or closed manually",
      "Do not touch or attempt to adjust the springs",
      "Do not touch or attempt to adjust the lift cables",
    ],
    callTechnicianSigns: [
      "The door feels unusually heavy when moved by hand",
      "You heard a loud bang before the door stopped working",
      "A cable looks loose, frayed, or disconnected",
      "You can see a spring is broken or stretched apart",
      "The motor hums but the door doesn't move",
      "The door looks crooked or off-track",
      "The door is stuck fully open or fully closed",
    ],
    relatedServices: [
      { slug: "garage-door-repair", label: "Garage Door Repairs Perth" },
      { slug: "garage-door-opener-repair", label: "Garage Door Motor Replacement Perth" },
      { slug: "spring-repair", label: "Garage Door Spring Replacement" },
      { slug: "emergency-garage-door-service", label: "Emergency Garage Door Repairs Perth" },
    ],
    costRows: [
      { scenario: "Remote / simple issue", priceRange: "$0 – $99", note: "Often resolved on the call-out alone" },
      { scenario: "Motor issue", priceRange: "$150 – $450", note: "Depends on repair vs. full replacement" },
      { scenario: "Spring or cable issue", priceRange: "$180 – $420", note: "Pricing depends on door size and spring type" },
      { scenario: "Track or roller issue", priceRange: "$120 – $350", note: "Realignment vs. roller/track replacement" },
      { scenario: "Emergency repair (after-hours)", priceRange: "From $129 call-out", note: "Same-day or after-hours response" },
    ],
    emergency: {
      heading: "Door stuck open or creating a security risk?",
      body: "A garage door that won't close is a security and safety risk for your home. Our emergency team can be on-site fast, any day of the week.",
    },
    faqs: [
      {
        question: "Why won't my garage door open?",
        answer:
          "The most common causes are a broken spring, a faulty motor, a snapped cable, a blocked safety sensor, a flat remote battery, or a power supply issue. A visual check of the remote, power outlet, and sensors will rule out the simplest causes first.",
      },
      {
        question: "Should I force my garage door open?",
        answer:
          "No. Forcing a stuck door can cause further damage to the opener, track, or springs, and can be dangerous if a spring or cable has failed. If the door doesn't move freely, stop and call a technician.",
      },
      {
        question: "Can a broken spring stop the door from opening?",
        answer:
          "Yes. Springs counterbalance the door's weight, so a broken spring makes the door too heavy for the opener (or a person) to lift. This is one of the most common reasons a door won't open.",
      },
      {
        question: "Can you repair the motor?",
        answer:
          "In most cases, yes. Our technicians can diagnose and repair common opener motor faults on-site. If the motor is beyond economical repair, we can supply and install a replacement the same day in many cases.",
      },
      {
        question: "Can I send a video of the issue?",
        answer:
          "Yes — uploading a photo or short video of the door when you request help lets our technicians diagnose the issue faster and arrive with the right parts.",
      },
      {
        question: "Do you service all Perth suburbs?",
        answer:
          "Yes, Capital Garage Door provides repairs and installations across all Perth suburbs, with same-day service available in most areas.",
      },
    ],
    updatedAt: "2026-06-22",
    heroImage: "/images/services/garage-door-repair.webp",
  },
];
