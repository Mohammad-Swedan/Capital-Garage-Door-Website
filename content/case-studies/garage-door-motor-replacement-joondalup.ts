import type { CaseStudyPage } from "@/types/case-study";

export const garageDoorMotorReplacementJoondalup: CaseStudyPage = {
  slug: "garage-door-motor-replacement-joondalup",
  pageType: "case-study",

  title: "Garage Door Motor Replacement in Joondalup",
  subtitle:
    "A local Perth garage door motor replacement completed for a residential property in Joondalup.",

  service: "Motor Replacement",
  suburb: "Joondalup",
  doorType: "Sectional Door",
  jobType: "Residential",
  result: "Smooth automatic operation restored",

  summary: {
    problem: "Motor had stopped responding to remotes, leaving the door difficult to open by hand.",
    diagnosis: "Motor unit had failed internally; tracks, sensors, and door balance were all sound.",
    solution: "Replaced the motor with a suitable unit, configured remotes, and safety-tested the door.",
  },

  problem: {
    intro:
      "The homeowner contacted us after their automatic garage door stopped responding reliably to the remote. What started as occasional missed signals had progressed to the motor not engaging at all, forcing the household to lift the heavy sectional door by hand.",
    points: [
      "Motor not responding to wall switch or remote",
      "Door struggling to open, sometimes stalling halfway",
      "Remote control appeared to pair but didn't trigger the opener",
    ],
  },

  diagnosis: {
    intro:
      "Our technician carried out a full inspection before recommending any work, to confirm the motor was genuinely at fault rather than a cheaper fix being available.",
    points: [
      "Tested the motor unit's power supply and internal drive components",
      "Checked the opener's logic board and learn/programming function",
      "Tested remote control signal and receiver response",
      "Inspected tracks and rollers for obstruction or wear",
      "Checked safety sensor alignment and operation",
      "Verified door balance and spring tension",
    ],
  },

  solution: {
    intro:
      "With the motor confirmed as the cause and the door itself in good condition, the fix was straightforward — replace the failed unit and make sure everything was working safely before handing back to the customer.",
    points: [
      "Removed the old, failed motor unit",
      "Installed a suitable replacement motor matched to the door size and weight",
      "Configured and paired the existing remote controls",
      "Safety-tested auto-reverse and sensor function",
      "Walked the customer through everyday use and remote programming",
    ],
  },

  images: [
    { src: "/images/case-studies/placeholder-before.jpg", alt: "Garage door motor before replacement in Joondalup", caption: "Before" },
    { src: "/images/case-studies/placeholder-after.jpg", alt: "Garage door motor after replacement in Joondalup", caption: "After" },
    { src: "/images/case-studies/placeholder-closeup.jpg", alt: "Close-up of newly installed garage door motor", caption: "Motor Close-Up" },
    { src: "/images/case-studies/placeholder-finished.jpg", alt: "Finished sectional garage door in Joondalup", caption: "Finished Door" },
  ],

  partsUsed: [
    "Motor replacement",
    "Remote setup",
    "Safety sensor check",
    "Door balance check",
    "Final testing",
    "Warranty support",
  ],

  relatedServices: [
    { label: "Garage Door Motor Replacement Perth", href: "/garage-door-motor-replacement-perth" },
    { label: "Garage Door Repairs Joondalup", href: "/garage-door-repairs-joondalup" },
    { label: "Garage Door Servicing Perth", href: "/garage-door-servicing-perth" },
  ],

  faqs: [
    {
      question: "How do I know if my garage door motor needs replacing rather than repairing?",
      answer:
        "If the motor doesn't respond at all to the remote or wall switch, makes a humming noise without movement, or has visible internal damage, replacement is usually more reliable than repair. Our technicians always inspect the motor, opener logic, and remotes first to confirm it's the motor itself before recommending a replacement.",
    },
    {
      question: "Will a new motor work with my existing remote controls?",
      answer:
        "In most cases yes — we configure and pair your existing remotes with the new motor as part of the installation. If your remotes are very old or incompatible with the replacement unit, we'll let you know and supply compatible ones.",
    },
    {
      question: "How long does a garage door motor replacement take?",
      answer:
        "A standard residential motor replacement, including removal, installation, remote setup, and safety testing, is typically completed within a single visit, usually 1–2 hours depending on the door type and mounting.",
    },
    {
      question: "Is the new motor covered by warranty?",
      answer:
        "Yes, replacement motors come with warranty support. We'll confirm the exact warranty terms for your specific motor and installation at the time of the job.",
    },
  ],

  seo: {
    title: "Garage Door Motor Replacement in Joondalup | Capital Garage Door",
    description:
      "See how Capital Garage Door replaced a failed garage door motor for a residential customer in Joondalup — full diagnosis, solution, and completed work.",
  },

  updatedAt: "2026-05-12",
};
