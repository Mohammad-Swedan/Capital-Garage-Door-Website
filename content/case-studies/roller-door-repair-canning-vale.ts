import type { CaseStudyPage } from "@/types/case-study";

export const rollerDoorRepairCanningVale: CaseStudyPage = {
  slug: "roller-door-repair-canning-vale",
  pageType: "case-study",

  title: "Roller Door Repair in Canning Vale",
  subtitle:
    "A local Perth roller door repair completed for a commercial property in Canning Vale.",

  service: "Roller Door Repair",
  suburb: "Canning Vale",
  doorType: "Roller Door",
  jobType: "Commercial",
  result: "Roller door restored to smooth, full-travel operation",

  summary: {
    problem: "Roller door was jamming partway through its travel and making a grinding noise.",
    diagnosis: "A bent guide track and worn rollers were causing the curtain to bind on one side.",
    solution: "Straightened the track, replaced worn rollers, and rebalanced the door.",
  },

  problem: {
    intro:
      "Staff at a Canning Vale warehouse reported the roller door catching partway through opening, with a noticeable grinding sound coming from one side of the door each time it moved.",
    points: [
      "Door jamming roughly halfway through its travel",
      "Grinding noise from one side of the roller curtain",
      "Door occasionally needed to be forced manually to fully open",
    ],
  },

  diagnosis: {
    intro:
      "Because the door was used multiple times daily, our technician prioritised identifying the exact point of friction rather than guessing at a general service.",
    points: [
      "Inspected guide tracks on both sides for straightness and fixing points",
      "Checked roller condition and bearing wear",
      "Tested the motor and control system for overload behaviour",
      "Inspected the curtain for damage at the binding point",
      "Checked overall door balance and tension",
    ],
  },

  solution: {
    intro:
      "The cause was a bent section of guide track combined with worn rollers, both contributing to the curtain binding. Both issues needed addressing together to fully resolve the jamming.",
    points: [
      "Straightened and re-secured the bent guide track section",
      "Replaced worn rollers along the affected side",
      "Rebalanced the door and retested full-travel operation",
      "Confirmed motor and control behaviour under normal load",
      "Briefed on-site staff on signs to watch for going forward",
    ],
  },

  images: [
    { src: "/images/case-studies/placeholder-before.jpg", alt: "Roller door before repair in Canning Vale", caption: "Before" },
    { src: "/images/case-studies/placeholder-after.jpg", alt: "Roller door after repair in Canning Vale", caption: "After" },
    { src: "/images/case-studies/placeholder-closeup.jpg", alt: "Close-up of repaired roller door track", caption: "Track Close-Up" },
    { src: "/images/case-studies/placeholder-finished.jpg", alt: "Finished roller door in Canning Vale", caption: "Finished Door" },
  ],

  partsUsed: [
    "Guide track straightening",
    "Roller replacement",
    "Door balance and tension check",
    "Motor and control test",
    "Final testing",
    "Warranty support",
  ],

  relatedServices: [
    { label: "Roller Door Repairs Perth", href: "/roller-door-repairs-perth" },
    { label: "Garage Door Repairs Canning Vale", href: "/garage-door-repairs-canning-vale" },
    { label: "Commercial Garage Door Servicing Perth", href: "/garage-door-servicing-perth" },
  ],

  faqs: [
    {
      question: "What causes a roller door to jam partway through opening?",
      answer:
        "Jamming is most often caused by a bent or misaligned guide track, worn rollers, or a curtain that's come slightly off-track. A proper inspection of the tracks, rollers, and curtain alignment is needed to pinpoint the exact cause.",
    },
    {
      question: "Can a roller door track be straightened, or does it need replacing?",
      answer:
        "Minor bends can usually be straightened and re-secured on-site. Severely damaged or rusted sections may need replacing — our technicians assess the track condition before recommending either option.",
    },
    {
      question: "How often should commercial roller doors be serviced?",
      answer:
        "High-use commercial roller doors are generally recommended for servicing every 6–12 months, depending on usage frequency, to catch wear on rollers, tracks, and balance before it causes a breakdown.",
    },
  ],

  seo: {
    title: "Roller Door Repair in Canning Vale | Capital Garage Door",
    description:
      "See how Capital Garage Door diagnosed and repaired a jamming commercial roller door in Canning Vale — track straightening, roller replacement, and full testing.",
  },

  updatedAt: "2026-04-28",
};
