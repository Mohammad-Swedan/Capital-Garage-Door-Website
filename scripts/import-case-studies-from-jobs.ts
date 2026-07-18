/**
 * Imports real completed-job CASE STUDIES (built from the job photos we uploaded
 * to the gallery) into the CMS — one page per job at /case-studies/{slug}.
 *
 * Why this exists: the suburb pages' "Recent work" section now shows real case
 * studies (auto-matched by suburb), replacing the old placeholder cards. These
 * case studies supply that content AND stand alone as local-proof pages.
 *
 * Images: each `data.images[]` entry stores the REAL Bunny CDN `src` (the same
 * WebP assets scripts/add-gallery-images.ts uploaded) + a caption. The CMS
 * resolve payload round-trips the `data` blob verbatim and lib/cms/map-case-study-page.ts
 * reads `img.src`, so the photos render on the case-study page and the suburb
 * "Recent work" card (before-only / after-only / both, per the captions).
 *
 * Create-as-Published in a single POST (backend fires the ISR revalidation
 * webhook). Existing slugs return 409 and are skipped, so re-running is safe.
 *
 * Local CMS (default):   npx tsx scripts/import-case-studies-from-jobs.ts
 * Production (explicit): CMS_API_URL=https://cgd.runasp.net CMS_ADMIN_PASSWORD=… npx tsx scripts/import-case-studies-from-jobs.ts
 */

const CMS_API_URL = (process.env.CMS_API_URL ?? "http://localhost:5179").replace(/\/$/, "");
const ADMIN_EMAIL = process.env.CMS_ADMIN_EMAIL ?? "admin@capitalgaragedoor.local";
const ADMIN_PASSWORD = process.env.CMS_ADMIN_PASSWORD ?? "Admin#12345";

const CDN = "https://jadara-hub.b-cdn.net/capital-garage-door/gallery";

type Img = { src: string; alt: string; caption: string };
/** Main gallery asset for a slug. */
const after = (slug: string, alt: string, caption = "After"): Img => ({ src: `${CDN}/${slug}.webp`, alt, caption });
const before = (slug: string, alt: string): Img => ({ src: `${CDN}/${slug}-before.webp`, alt, caption: "Before" });
/** Single damage/before shot stored under the main slug. */
const beforeMain = (slug: string, alt: string): Img => ({ src: `${CDN}/${slug}.webp`, alt, caption: "Before" });

interface Block {
  intro: string;
  points: string[];
}
interface CaseStudy {
  slug: string;
  title: string;
  subtitle: string;
  service: string;
  suburb: string;
  doorType: string;
  jobType: string;
  result: string;
  summary: { problem: string; diagnosis: string; solution: string };
  problem: Block;
  diagnosis: Block;
  solution: Block;
  images: Img[];
  partsUsed: string[];
  relatedServices: { label: string; href: string }[];
  faqs: { question: string; answer: string }[];
  seo: { title: string; description: string };
}

const CASE_STUDIES: CaseStudy[] = [
  {
    slug: "garage-door-cable-replacement-willetton-perth",
    title: "Garage Door Cable Replacement in Willetton",
    subtitle:
      "A Willetton sectional door had dropped a lift cable and jammed on one side. We fitted new cables and bottom brackets and rebalanced the door the same visit.",
    service: "Cable Replacement",
    suburb: "Willetton",
    doorType: "Sectional",
    jobType: "Repair",
    result: "New cables and bottom brackets fitted — door running true and level again.",
    summary: {
      problem: "Lift cable off the drum, door hanging out of level.",
      diagnosis: "Worn cables and a failing bottom bracket on one side.",
      solution: "Replaced both cables and bottom brackets, then rebalanced.",
    },
    problem: {
      intro:
        "The homeowner in Willetton found their sectional garage door sitting crooked and catching in the tracks — a classic sign a lift cable has come off its drum.",
      points: [
        "Door sitting higher on one side and binding in the vertical track",
        "A cable had unwound from the drum",
        "Bottom bracket showing signs of wear and pull-out",
      ],
    },
    diagnosis: {
      intro:
        "On inspection both lift cables were frayed near the bottom brackets and one bracket had started to lift away from the panel.",
      points: [
        "Both cables past their safe service life",
        "One bottom bracket loose and unsafe to re-tension",
        "Drums and shaft otherwise sound",
      ],
    },
    solution: {
      intro:
        "We fitted a matched pair of new lift cables and new bottom brackets, re-seated the cables on the drums and rebalanced the door.",
      points: [
        "New lift cables fitted both sides",
        "New bottom brackets installed",
        "Door rebalanced and safety-tested",
      ],
    },
    images: [after("garage-door-cable-replacement-willetton-perth", "White sectional garage door in Willetton after cable and bottom-bracket replacement", "After")],
    partsUsed: ["Lift cables (pair)", "Bottom brackets", "Drum re-set"],
    relatedServices: [
      { label: "Garage Door Repairs Perth", href: "/garage-door-repairs-perth" },
      { label: "Garage Door Spring Repair", href: "/garage-door-spring-repair-perth" },
    ],
    faqs: [
      {
        question: "How long does a garage door cable replacement take?",
        answer:
          "Most single-door cable replacements are completed in under an hour. We always replace cables in pairs and rebalance the door so both sides wear evenly.",
      },
      {
        question: "Is a door with a broken cable safe to use?",
        answer:
          "No — a door with a failed cable can drop or jam. Stop using it and book a repair; we can usually attend a Willetton property the same day.",
      },
    ],
    seo: {
      title: "Garage Door Cable Replacement in Willetton | Case Study",
      description:
        "How we replaced the lift cables and bottom brackets on a jammed Willetton sectional garage door and rebalanced it the same visit.",
    },
  },
  {
    slug: "steel-line-garage-door-installation-baldivis-perth",
    title: "New Steel-Line Garage Door Installed in Baldivis",
    subtitle:
      "Supply and install of a new Steel-Line sectional garage door for a Baldivis home — clean lines, smooth automatic operation and a fresh street frontage.",
    service: "New Door Installation",
    suburb: "Baldivis",
    doorType: "Sectional",
    jobType: "Installation",
    result: "New Steel-Line sectional door installed and automated — smooth, quiet operation.",
    summary: {
      problem: "Ageing door past its best, letting the frontage down.",
      diagnosis: "Beyond economical repair; a new door was the better value.",
      solution: "Installed a new Steel-Line sectional door with a quiet opener.",
    },
    problem: {
      intro:
        "The owners wanted to replace a tired, dated garage door on their Baldivis home with something clean, secure and low-maintenance.",
      points: [
        "Old door worn and noisy",
        "Owners wanted a modern, streamlined look",
        "Reliable automatic operation was a must",
      ],
    },
    diagnosis: {
      intro:
        "We measured the opening, confirmed the headroom and side-room, and helped the owners choose a Steel-Line sectional door to suit the home.",
      points: [
        "Opening measured and prepared",
        "Steel-Line panel and colour selected",
        "Opener and safety sensors specified",
      ],
    },
    solution: {
      intro:
        "We removed the old door and installed the new Steel-Line sectional door, fitted the opener and set the travel and force limits.",
      points: [
        "New Steel-Line sectional door installed",
        "Automatic opener fitted and tuned",
        "Safety reversal tested and handed over",
      ],
    },
    images: [after("steel-line-garage-door-installation-baldivis-perth", "New cream Steel-Line sectional garage door installed on a Baldivis home", "Finished")],
    partsUsed: ["Steel-Line sectional door", "Automatic opener", "Safety sensors"],
    relatedServices: [
      { label: "Garage Door Installation Perth", href: "/garage-door-installation-perth" },
      { label: "Garage Door Repairs Baldivis", href: "/garage-door-repairs-baldivis" },
    ],
    faqs: [
      {
        question: "How long does a new garage door installation take?",
        answer:
          "A standard sectional door and opener install is usually completed in a few hours. We remove the old door, fit the new one, automate it and test everything before handover.",
      },
      {
        question: "Do you install Steel-Line doors across Perth?",
        answer:
          "Yes. We supply and install Steel-Line and other quality sectional doors right across the Perth metro, including Baldivis and the southern suburbs.",
      },
    ],
    seo: {
      title: "New Steel-Line Garage Door Installed in Baldivis | Case Study",
      description:
        "Supply and install of a new Steel-Line sectional garage door and opener for a Baldivis home — smooth, quiet, automatic operation.",
    },
  },
  {
    slug: "garage-door-hinge-roller-replacement-morley-perth",
    title: "Garage Door Hinge & Roller Replacement in Morley",
    subtitle:
      "A seized, corroded hinge and roller was making a Morley door grind and jump in the track. We replaced the hardware — before and after speak for themselves.",
    service: "Hinge & Roller Replacement",
    suburb: "Morley",
    doorType: "Sectional",
    jobType: "Repair",
    result: "New hinge and roller fitted — smooth, quiet travel restored.",
    summary: {
      problem: "Grinding, jumpy door with a seized hinge and roller.",
      diagnosis: "Corroded hinge and worn roller bearing binding in the track.",
      solution: "Replaced the hinge and roller and re-aligned the panel.",
    },
    problem: {
      intro:
        "The door on this Morley home was noisy and catching mid-travel, with a visibly rusted hinge and roller at one panel join.",
      points: [
        "Loud grinding as the door moved",
        "Roller binding and jumping in the track",
        "Hinge heavily corroded",
      ],
    },
    diagnosis: {
      intro:
        "The roller bearing had collapsed and the hinge was rusted solid, dragging the panel out of line each cycle.",
      points: [
        "Seized, corroded hinge",
        "Worn-out roller bearing",
        "Panel pulled slightly out of alignment",
      ],
    },
    solution: {
      intro:
        "We fitted a new galvanised hinge and a new nylon roller, then re-aligned the panel so the door ran true and quiet again.",
      points: [
        "New hinge and nylon roller fitted",
        "Panel re-aligned in the track",
        "Full door cycle tested for smooth, quiet travel",
      ],
    },
    images: [
      before("garage-door-hinge-roller-replacement-morley-perth", "Worn, corroded garage door hinge and roller bracket before replacement in Morley"),
      after("garage-door-hinge-roller-replacement-morley-perth", "New black hinge and roller bracket fitted to a Morley garage door track", "After"),
    ],
    partsUsed: ["Galvanised hinge", "Nylon roller", "Track re-alignment"],
    relatedServices: [
      { label: "Garage Door Repairs Morley", href: "/garage-door-repairs-morley" },
      { label: "Garage Door Repairs Perth", href: "/garage-door-repairs-perth" },
    ],
    faqs: [
      {
        question: "Why is my garage door grinding and jumping?",
        answer:
          "Usually a worn roller or a seized hinge dragging the panel out of line. Left too long it wears the track; replacing the hardware early is a quick, low-cost fix.",
      },
      {
        question: "Do you replace all the rollers at once?",
        answer:
          "We inspect every roller and hinge and replace whatever is worn. If several are near the end of their life we'll recommend doing them together to save call-outs.",
      },
    ],
    seo: {
      title: "Garage Door Hinge & Roller Replacement in Morley | Case Study",
      description:
        "Before and after: replacing a seized hinge and worn roller on a noisy Morley garage door to restore smooth, quiet travel.",
    },
  },
  {
    slug: "rusted-garage-door-spring-repair-kalamunda-perth",
    title: "Rusted Garage Door Spring Repair in Kalamunda",
    subtitle:
      "Years of moisture had corroded the torsion spring on this Kalamunda door. We caught it before it snapped and replaced it with a new high-cycle spring.",
    service: "Spring Repair",
    suburb: "Kalamunda",
    doorType: "Sectional",
    jobType: "Repair",
    result: "Corroded spring replaced before failure — door balanced and safe.",
    summary: {
      problem: "Heavily rusted torsion spring at risk of snapping.",
      diagnosis: "Corrosion had weakened the coils past safe life.",
      solution: "Replaced with a new high-cycle spring and rebalanced.",
    },
    problem: {
      intro:
        "During a service the homeowner in Kalamunda pointed out how rusty the spring above the door had become — the hills climate is hard on garage hardware.",
      points: [
        "Torsion spring heavily surface-rusted",
        "Door starting to feel heavy to lift",
        "Owner concerned about it snapping",
      ],
    },
    diagnosis: {
      intro:
        "The corrosion had eaten into the coils, reducing the spring's strength and shortening its remaining life dramatically.",
      points: [
        "Coil corrosion beyond safe tolerance",
        "Spring no longer holding correct tension",
        "High risk of sudden failure",
      ],
    },
    solution: {
      intro:
        "We replaced the corroded spring with a new high-cycle torsion spring, re-tensioned it and rebalanced the door.",
      points: [
        "New high-cycle torsion spring fitted",
        "Correct tension set for the door weight",
        "Door balance and safety re-tested",
      ],
    },
    images: [beforeMain("rusted-garage-door-spring-repair-kalamunda-perth", "Heavily rusted garage door torsion spring in Kalamunda before replacement")],
    partsUsed: ["High-cycle torsion spring", "Bearings check", "Re-balance"],
    relatedServices: [
      { label: "Garage Door Spring Repair", href: "/garage-door-spring-repair-perth" },
      { label: "Garage Door Repairs Perth", href: "/garage-door-repairs-perth" },
    ],
    faqs: [
      {
        question: "How long do garage door springs last?",
        answer:
          "A standard spring lasts around 10,000 cycles (roughly 7–10 years). Coastal and hills moisture can shorten that, so a rusted spring is worth replacing before it fails.",
      },
      {
        question: "Can I replace a torsion spring myself?",
        answer:
          "We don't recommend it — torsion springs are under high tension and can cause serious injury. It's a job for a technician with the right winding tools.",
      },
    ],
    seo: {
      title: "Rusted Garage Door Spring Repair in Kalamunda | Case Study",
      description:
        "Replacing a corroded torsion spring on a Kalamunda garage door before it could snap — new high-cycle spring fitted and rebalanced.",
    },
  },
  {
    slug: "broken-garage-door-spring-replacement-duncraig-perth",
    title: "Broken Torsion Spring Replacement in Duncraig",
    subtitle:
      "One of the twin torsion springs had snapped on this Duncraig door, leaving it too heavy to lift. We replaced both as a set and rebalanced.",
    service: "Spring Replacement",
    suburb: "Duncraig",
    doorType: "Sectional",
    jobType: "Repair",
    result: "Both springs replaced as a set — door lifting evenly again.",
    summary: {
      problem: "A snapped torsion spring left the door jammed shut.",
      diagnosis: "One spring failed; the second was near the end of its life.",
      solution: "Replaced both springs as a matched set and rebalanced.",
    },
    problem: {
      intro:
        "The Duncraig homeowner woke to a garage door that wouldn't open and a loud bang they'd heard overnight — the tell-tale sign of a broken spring.",
      points: [
        "Door would not lift, even manually",
        "A clear gap in one of the torsion springs",
        "Opener straining and clicking",
      ],
    },
    diagnosis: {
      intro:
        "One spring had snapped and the second, of the same age, was close behind — replacing only one would have left the door unbalanced.",
      points: [
        "One torsion spring fully separated",
        "Matching spring at the same cycle count",
        "Opener protected from further strain",
      ],
    },
    solution: {
      intro:
        "We replaced both torsion springs as a matched set, set the correct tension and rebalanced the door for even, reliable lifting.",
      points: [
        "Both torsion springs replaced together",
        "Correct tension set for even lift",
        "Opener force re-checked after balancing",
      ],
    },
    images: [beforeMain("broken-garage-door-spring-replacement-duncraig-perth", "Twin garage door torsion springs on the shaft in Duncraig with one spring snapped")],
    partsUsed: ["Torsion springs (matched pair)", "Winding bars", "Re-balance"],
    relatedServices: [
      { label: "Garage Door Spring Repair", href: "/garage-door-spring-repair-perth" },
      { label: "Garage Door Repairs Perth", href: "/garage-door-repairs-perth" },
    ],
    faqs: [
      {
        question: "Should I replace both springs if only one broke?",
        answer:
          "On a two-spring door, yes. Both springs have done the same number of cycles, so replacing the pair avoids a second call-out and keeps the door balanced.",
      },
      {
        question: "Can I still open my door with a broken spring?",
        answer:
          "It's not safe to try — without the spring the door is extremely heavy and the opener can be damaged. Leave it closed and book a spring replacement.",
      },
    ],
    seo: {
      title: "Broken Torsion Spring Replacement in Duncraig | Case Study",
      description:
        "A snapped torsion spring left a Duncraig garage door jammed shut. We replaced both springs as a set and rebalanced the door.",
    },
  },
  {
    slug: "garage-door-cable-drum-repair-fremantle-perth",
    title: "Garage Door Cable & Drum Repair in Fremantle",
    subtitle:
      "A lift cable had jumped the drum and pulled this Fremantle door out of alignment. We re-wound the cables, re-tensioned and re-aligned the door.",
    service: "Cable & Drum Repair",
    suburb: "Fremantle",
    doorType: "Sectional",
    jobType: "Repair",
    result: "Cables re-seated on the drums — door square and running true.",
    summary: {
      problem: "Cable off the drum, door pulled out of alignment.",
      diagnosis: "Slack cable and a loose drum set-screw.",
      solution: "Re-wound and re-tensioned the cables and re-aligned the door.",
    },
    problem: {
      intro:
        "This Fremantle door had gone crooked and was catching badly, with a lift cable visibly hanging loose beside the drum.",
      points: [
        "Cable unwound from the drum",
        "Door sitting out of square",
        "Catching hard in the track",
      ],
    },
    diagnosis: {
      intro:
        "A drum set-screw had worked loose, letting the cable go slack and jump off — the door then racked out of alignment.",
      points: [
        "Loose drum set-screw",
        "Slack, partly frayed cable",
        "Door racked out of square",
      ],
    },
    solution: {
      intro:
        "We replaced the worn cable, re-wound both drums to equal tension, locked the set-screws and squared the door in its tracks.",
      points: [
        "Cable replaced and re-wound",
        "Both drums re-tensioned evenly",
        "Door squared and re-aligned",
      ],
    },
    images: [beforeMain("garage-door-cable-drum-repair-fremantle-perth", "Lift cable unwound from the cable drum on a Fremantle garage door out of alignment")],
    partsUsed: ["Lift cable", "Drum re-tension", "Track alignment"],
    relatedServices: [
      { label: "Garage Door Repairs Fremantle", href: "/garage-door-repairs-fremantle" },
      { label: "Garage Door Repairs Perth", href: "/garage-door-repairs-perth" },
    ],
    faqs: [
      {
        question: "Why did my garage door go crooked?",
        answer:
          "Most often a lift cable has come off its drum on one side, letting that corner drop. Re-seating and re-tensioning the cables squares the door back up.",
      },
      {
        question: "Do you service garage doors in Fremantle?",
        answer:
          "Yes, we cover Fremantle and the western suburbs for repairs, cable and spring work, and new door installations.",
      },
    ],
    seo: {
      title: "Garage Door Cable & Drum Repair in Fremantle | Case Study",
      description:
        "A lift cable had jumped the drum and pulled a Fremantle garage door out of alignment. We re-wound, re-tensioned and re-squared the door.",
    },
  },
  {
    slug: "garage-door-lift-cable-replacement-bayswater-perth",
    title: "Garage Door Lift Cable Replacement in Bayswater",
    subtitle:
      "A frayed lift cable was close to failing on this Bayswater door. We replaced it at the drum before it could snap and jam the door.",
    service: "Cable Replacement",
    suburb: "Bayswater",
    doorType: "Sectional",
    jobType: "Repair",
    result: "Frayed cable replaced before failure — door safe and smooth.",
    summary: {
      problem: "A frayed lift cable close to snapping.",
      diagnosis: "Cable strands failing where it wraps the drum.",
      solution: "Replaced the cable and rebalanced the door.",
    },
    problem: {
      intro:
        "During a routine tune-up in Bayswater we spotted a lift cable fraying where it coils onto the drum — a failure waiting to happen.",
      points: [
        "Visible broken strands on the cable",
        "Cable binding on the drum",
        "Door not far from jamming",
      ],
    },
    diagnosis: {
      intro:
        "The cable had worn through several strands at the drum and would soon have snapped, dropping that side of the door.",
      points: [
        "Multiple broken strands at the drum",
        "Remaining strands overloaded",
        "Drum and shaft otherwise sound",
      ],
    },
    solution: {
      intro:
        "We fitted a new lift cable, re-wound the drum to correct tension and rebalanced the door for safe, smooth travel.",
      points: [
        "New lift cable fitted",
        "Drum re-wound to correct tension",
        "Door rebalanced and tested",
      ],
    },
    images: [beforeMain("garage-door-lift-cable-replacement-bayswater-perth", "Frayed lift cable coiled around a red cable drum in a Bayswater garage")],
    partsUsed: ["Lift cable", "Drum re-tension", "Re-balance"],
    relatedServices: [
      { label: "Garage Door Repairs Perth", href: "/garage-door-repairs-perth" },
      { label: "Garage Door Spring Repair", href: "/garage-door-spring-repair-perth" },
    ],
    faqs: [
      {
        question: "How do I know if my garage door cable is failing?",
        answer:
          "Look for broken strands, rust, or a door that sits unevenly. A frayed cable should be replaced promptly — it's cheaper than the damage a snapped cable can cause.",
      },
      {
        question: "How often should garage door cables be checked?",
        answer:
          "We check cables during every service. An annual tune-up catches fraying early, before it turns into a jammed or dropped door.",
      },
    ],
    seo: {
      title: "Garage Door Lift Cable Replacement in Bayswater | Case Study",
      description:
        "Replacing a frayed lift cable on a Bayswater garage door before it could snap and jam the door — new cable fitted and rebalanced.",
    },
  },
  {
    slug: "roller-door-repair-midland-perth",
    title: "Roller Door Repair in Midland",
    subtitle:
      "The bottom slats on this older Midland roller door were dented and bowing. We straightened and re-tensioned it so the curtain rolls freely again.",
    service: "Roller Door Repair",
    suburb: "Midland",
    doorType: "Roller Door",
    jobType: "Repair",
    result: "Dented slats straightened and door re-tensioned — rolling freely.",
    summary: {
      problem: "Dented, bowing bottom slats catching as the door rolled.",
      diagnosis: "Impact damage to the bottom slats and slack spring tension.",
      solution: "Straightened the slats and re-tensioned the barrel.",
    },
    problem: {
      intro:
        "This Midland roller door was stiff to open and the bottom slats had clearly taken a knock, bowing out of shape.",
      points: [
        "Dented, bowed bottom slats",
        "Door stiff and catching",
        "Curtain not sitting flat",
      ],
    },
    diagnosis: {
      intro:
        "The impacted slats were binding in the guides and the barrel spring had lost tension over the years, making the door heavy.",
      points: [
        "Bottom slats bent out of profile",
        "Barrel spring under-tensioned",
        "Guides otherwise serviceable",
      ],
    },
    solution: {
      intro:
        "We straightened the damaged slats, re-seated the curtain in the guides and re-tensioned the barrel so the door rolls smoothly.",
      points: [
        "Bottom slats straightened",
        "Curtain re-seated in the guides",
        "Barrel spring re-tensioned",
      ],
    },
    images: [beforeMain("roller-door-repair-midland-perth", "Old cream roller shutter door in Midland with dented, bowed bottom slats")],
    partsUsed: ["Slat straightening", "Barrel re-tension", "Guide service"],
    relatedServices: [
      { label: "Roller Door Repairs Perth", href: "/roller-door-repairs-perth" },
      { label: "Garage Door Repairs Midland", href: "/garage-door-repairs-midland" },
    ],
    faqs: [
      {
        question: "Can a dented roller door be repaired or does it need replacing?",
        answer:
          "Minor slat damage can usually be straightened. If several slats are badly bent or split we'll advise a curtain replacement — often we can reuse the barrel and motor.",
      },
      {
        question: "Why is my roller door so heavy to lift?",
        answer:
          "Usually the barrel spring has lost tension. Re-tensioning restores the balance so a manual door lifts easily and a motor isn't overworked.",
      },
    ],
    seo: {
      title: "Roller Door Repair in Midland | Case Study",
      description:
        "Straightening dented bottom slats and re-tensioning an older Midland roller door so the curtain rolls smoothly and freely again.",
    },
  },
  {
    slug: "roller-door-off-track-repair-gosnells-perth",
    title: "Roller Door Off-Track Repair in Gosnells",
    subtitle:
      "This Gosnells roller door had jumped its side guide and creased the curtain. We refitted it into the track and corrected the damaged slats.",
    service: "Roller Door Repair",
    suburb: "Gosnells",
    doorType: "Roller Door",
    jobType: "Repair",
    result: "Curtain refitted to the guide and slats corrected — running true.",
    summary: {
      problem: "Curtain pulled out of its side guide, slats creased.",
      diagnosis: "Door forced against the guide, popping it free and bending slats.",
      solution: "Refitted the curtain and straightened the affected slats.",
    },
    problem: {
      intro:
        "The roller door at this Gosnells property had pulled out of one side guide and jammed, with the curtain creased along the edge.",
      points: [
        "Curtain out of the side guide",
        "Slats bent along one edge",
        "Door jammed part-open",
      ],
    },
    diagnosis: {
      intro:
        "The door had been forced while partly obstructed, popping the curtain out of the guide and creasing several slats.",
      points: [
        "Curtain dislodged from the guide",
        "Several slats creased",
        "Guide and barrel still sound",
      ],
    },
    solution: {
      intro:
        "We eased the curtain back into the guide, straightened the creased slats and tested the full travel to make sure it ran true.",
      points: [
        "Curtain refitted into the side guide",
        "Creased slats straightened",
        "Full travel tested",
      ],
    },
    images: [beforeMain("roller-door-off-track-repair-gosnells-perth", "White roller door curtain pulled out of its side guide with bent slats in Gosnells")],
    partsUsed: ["Curtain refit", "Slat straightening", "Guide check"],
    relatedServices: [
      { label: "Roller Door Repairs Perth", href: "/roller-door-repairs-perth" },
      { label: "Garage Door Repairs Gosnells", href: "/garage-door-repairs-gosnells" },
    ],
    faqs: [
      {
        question: "My roller door has come off its track — can you fix it?",
        answer:
          "Usually, yes. If the curtain has jumped a guide we can refit it and straighten minor slat damage. We'll only recommend a new curtain if the slats are badly deformed.",
      },
      {
        question: "How fast can you get to Gosnells?",
        answer:
          "We service Gosnells and the surrounding south-east suburbs regularly and can often attend the same day for a jammed or off-track door.",
      },
    ],
    seo: {
      title: "Roller Door Off-Track Repair in Gosnells | Case Study",
      description:
        "Refitting a Gosnells roller door that had jumped its side guide and straightening the creased slats so it runs true again.",
    },
  },
  {
    slug: "buckled-roller-door-repair-cannington-perth",
    title: "Buckled Roller Door Repair in Cannington",
    subtitle:
      "A charcoal roller door in Cannington had been forced out of its top guide. We re-seated the curtain and made the door safe and operational again.",
    service: "Roller Door Repair",
    suburb: "Cannington",
    doorType: "Roller Door",
    jobType: "Repair",
    result: "Curtain re-seated and door made safe — back in daily use.",
    summary: {
      problem: "Curtain buckled out of the top guide, door insecure.",
      diagnosis: "Door forced open under load, distorting the top of the curtain.",
      solution: "Re-seated the curtain and re-secured the door.",
    },
    problem: {
      intro:
        "The roller door on this Cannington premises had buckled out of its guides at the top and could no longer be closed securely.",
      points: [
        "Curtain forced out of the top guide",
        "Door would not close fully",
        "Security compromised",
      ],
    },
    diagnosis: {
      intro:
        "The door had been operated against an obstruction, distorting the top of the curtain and pulling it clear of the guide.",
      points: [
        "Top of the curtain distorted",
        "Curtain clear of the guide",
        "Barrel and motor undamaged",
      ],
    },
    solution: {
      intro:
        "We re-formed the affected slats, re-seated the curtain in the guides and re-secured the door so it opened and closed safely.",
      points: [
        "Distorted slats re-formed",
        "Curtain re-seated in the guides",
        "Door re-secured and tested",
      ],
    },
    images: [beforeMain("buckled-roller-door-repair-cannington-perth", "Charcoal roller door buckled out of its top guide beside a cracked wall in Cannington")],
    partsUsed: ["Slat re-forming", "Curtain refit", "Guide service"],
    relatedServices: [
      { label: "Roller Door Repairs Perth", href: "/roller-door-repairs-perth" },
      { label: "Garage Door Repairs Cannington", href: "/garage-door-repairs-cannington" },
    ],
    faqs: [
      {
        question: "Is a buckled roller door a security risk?",
        answer:
          "Yes — a door that won't close fully leaves the property exposed. We prioritise these repairs and can usually make the door safe on the first visit.",
      },
      {
        question: "Do you repair both home and business roller doors?",
        answer:
          "We do. From single garages to shopfront and warehouse shutters, we repair and service roller doors across Cannington and greater Perth.",
      },
    ],
    seo: {
      title: "Buckled Roller Door Repair in Cannington | Case Study",
      description:
        "Re-seating a Cannington roller door that had buckled out of its top guide and making it safe and operational again.",
    },
  },
  {
    slug: "corroded-torsion-spring-replacement-armadale-perth",
    title: "Corroded Torsion Spring Replacement in Armadale",
    subtitle:
      "This Armadale torsion spring was heavily corroded and well past its safe life. We replaced it with a new high-cycle spring and rebalanced the door.",
    service: "Spring Replacement",
    suburb: "Armadale",
    doorType: "Sectional",
    jobType: "Repair",
    result: "Corroded spring replaced — door balanced and safe to use.",
    summary: {
      problem: "A badly corroded torsion spring on borrowed time.",
      diagnosis: "Rust had eaten into the coils, weakening the spring.",
      solution: "Fitted a new high-cycle spring and rebalanced.",
    },
    problem: {
      intro:
        "The torsion spring on this Armadale door was rust-covered and flaking — the owner was right to be worried it would let go.",
      points: [
        "Spring heavily corroded",
        "Door feeling heavier over time",
        "Rust flaking from the coils",
      ],
    },
    diagnosis: {
      intro:
        "The corrosion had significantly weakened the spring and it was no longer holding the correct tension for the door's weight.",
      points: [
        "Coils weakened by rust",
        "Tension below spec",
        "High risk of imminent failure",
      ],
    },
    solution: {
      intro:
        "We replaced the corroded spring with a new high-cycle torsion spring, set the tension and rebalanced the door.",
      points: [
        "New high-cycle torsion spring fitted",
        "Correct tension set",
        "Door balanced and safety-tested",
      ],
    },
    images: [beforeMain("corroded-torsion-spring-replacement-armadale-perth", "Badly corroded, rust-covered garage door torsion spring in Armadale")],
    partsUsed: ["High-cycle torsion spring", "Bearings check", "Re-balance"],
    relatedServices: [
      { label: "Garage Door Spring Repair", href: "/garage-door-spring-repair-perth" },
      { label: "Garage Door Repairs Armadale", href: "/garage-door-repairs-armadale" },
    ],
    faqs: [
      {
        question: "Does a rusty spring need replacing straight away?",
        answer:
          "If the corrosion has reached the coils, yes — a weakened spring can snap without warning. Replacing it early avoids a jammed door and a potential injury.",
      },
      {
        question: "What's a high-cycle spring?",
        answer:
          "A spring rated for more open/close cycles than standard. On busy or double doors it lasts longer, which is why we often fit them as an upgrade.",
      },
    ],
    seo: {
      title: "Corroded Torsion Spring Replacement in Armadale | Case Study",
      description:
        "Replacing a heavily corroded torsion spring on an Armadale garage door with a new high-cycle spring, then rebalancing the door.",
    },
  },
  {
    slug: "emergency-garage-door-repair-southern-river-perth",
    title: "Emergency Garage Door Repair in Southern River",
    subtitle:
      "This Southern River sectional door buckled off its tracks and jammed. We attended urgently, secured it on the spot and repaired it to restore access.",
    service: "Emergency Repair",
    suburb: "Southern River",
    doorType: "Sectional",
    jobType: "Emergency",
    result: "Door secured and repaired same visit — access restored.",
    summary: {
      problem: "Door buckled off its tracks and jammed, blocking access.",
      diagnosis: "Panels forced out of the tracks, hardware bent.",
      solution: "Made safe on arrival, then realigned and repaired.",
    },
    problem: {
      intro:
        "We got an urgent call from a Southern River home after their sectional door buckled and jammed halfway, leaving the car trapped inside.",
      points: [
        "Door buckled out of its tracks",
        "Jammed halfway and unusable",
        "Vehicle locked in the garage",
      ],
    },
    diagnosis: {
      intro:
        "Several rollers had pulled out of the track and the top section was distorted, so the door couldn't be moved safely until it was supported.",
      points: [
        "Rollers out of the track",
        "Top section distorted",
        "Door unsafe to operate",
      ],
    },
    solution: {
      intro:
        "We made the door safe, freed the vehicle, then realigned the panels and replaced the bent hardware to get the door working again.",
      points: [
        "Door made safe and vehicle freed",
        "Panels realigned in the tracks",
        "Bent hardware replaced and tested",
      ],
    },
    images: [beforeMain("emergency-garage-door-repair-southern-river-perth", "White sectional garage door buckled and hanging out of its tracks in Southern River")],
    partsUsed: ["Rollers", "Bracket replacement", "Track realignment"],
    relatedServices: [
      { label: "Emergency Garage Door Repairs Perth", href: "/emergency-garage-door-repairs-perth" },
      { label: "Garage Door Repairs Southern River", href: "/garage-door-repairs-southern-river" },
    ],
    faqs: [
      {
        question: "Do you offer emergency garage door repairs?",
        answer:
          "Yes. For jammed, buckled or off-track doors we attend urgently across Perth, make the door safe and — where possible — complete the repair on the same visit.",
      },
      {
        question: "My car is stuck in the garage — can you help?",
        answer:
          "That's exactly the kind of call we prioritise. We'll safely release the door to get your vehicle out, then repair the door properly.",
      },
    ],
    seo: {
      title: "Emergency Garage Door Repair in Southern River | Case Study",
      description:
        "An urgent Southern River callout for a sectional door buckled off its tracks — made safe, vehicle freed, and the door repaired the same visit.",
    },
  },
  {
    slug: "emergency-sectional-door-repair-canning-vale-perth",
    title: "Emergency Sectional Door Repair in Canning Vale",
    subtitle:
      "An after-hours callout in Canning Vale for a sectional door that folded under load. We supported the panels and made the door safe the same visit.",
    service: "Emergency Repair",
    suburb: "Canning Vale",
    doorType: "Sectional",
    jobType: "Emergency",
    result: "Panels supported and door made safe — secured the same visit.",
    summary: {
      problem: "Sectional door folded under load and hung dangerously.",
      diagnosis: "Support hardware failed, letting the panels collapse.",
      solution: "Supported and secured the door, then repaired the hardware.",
    },
    problem: {
      intro:
        "This Canning Vale door had folded under its own weight and was hanging in the opening — an after-hours emergency for the homeowner.",
      points: [
        "Panels folded and sagging",
        "Door unsafe to touch",
        "Opening left insecure",
      ],
    },
    diagnosis: {
      intro:
        "A failure in the support hardware had let the panels collapse inward, and the door needed supporting before anything else.",
      points: [
        "Support hardware failed",
        "Panels collapsed inward",
        "Door had to be stabilised first",
      ],
    },
    solution: {
      intro:
        "We supported and secured the door to make the opening safe, then repaired the hardware so it could operate again.",
      points: [
        "Door supported and stabilised",
        "Opening made secure",
        "Hardware repaired and tested",
      ],
    },
    images: [beforeMain("emergency-sectional-door-repair-canning-vale-perth", "Sectional garage door with buckled panels hanging under a carport in Canning Vale")],
    partsUsed: ["Support hardware", "Bracket replacement", "Realignment"],
    relatedServices: [
      { label: "Emergency Garage Door Repairs Perth", href: "/emergency-garage-door-repairs-perth" },
      { label: "Garage Door Repairs Canning Vale", href: "/garage-door-repairs-canning-vale" },
    ],
    faqs: [
      {
        question: "What should I do if my garage door collapses?",
        answer:
          "Keep clear of it and don't try to force it — call us. We'll make the door safe first, then carry out the repair so no one is put at risk.",
      },
      {
        question: "Do you attend after hours in Canning Vale?",
        answer:
          "Yes, we take emergency callouts across Canning Vale and the southern suburbs for dangerous or insecure doors.",
      },
    ],
    seo: {
      title: "Emergency Sectional Door Repair in Canning Vale | Case Study",
      description:
        "An after-hours Canning Vale callout for a sectional door that folded under load — supported, secured and repaired the same visit.",
    },
  },
  {
    slug: "sectional-garage-door-repair-thornlie-perth",
    title: "Sectional Garage Door Repair in Thornlie",
    subtitle:
      "A bent panel had this Thornlie sectional door jamming mid-travel. We realigned and repaired it so it opens and closes cleanly again.",
    service: "Sectional Door Repair",
    suburb: "Thornlie",
    doorType: "Sectional",
    jobType: "Repair",
    result: "Bent panel repaired and realigned — opening cleanly again.",
    summary: {
      problem: "A bent panel jamming the door mid-travel.",
      diagnosis: "Panel and roller knocked out of line, binding in the track.",
      solution: "Realigned the panel and replaced the affected hardware.",
    },
    problem: {
      intro:
        "The sectional door on this Thornlie home was sticking halfway and had a visibly bent panel near one edge.",
      points: [
        "Door jamming mid-travel",
        "One panel bent out of line",
        "Roller binding in the track",
      ],
    },
    diagnosis: {
      intro:
        "The panel and its roller had been knocked out of alignment, so the door bound against the track each time it moved.",
      points: [
        "Panel bent out of alignment",
        "Roller catching in the track",
        "Hinge on that panel strained",
      ],
    },
    solution: {
      intro:
        "We straightened and realigned the panel, replaced the damaged roller and hinge, and tested the full travel.",
      points: [
        "Panel straightened and realigned",
        "Roller and hinge replaced",
        "Full travel tested for smooth operation",
      ],
    },
    images: [beforeMain("sectional-garage-door-repair-thornlie-perth", "Beige sectional garage door with a bent panel part-open under a carport in Thornlie")],
    partsUsed: ["Roller", "Hinge", "Panel realignment"],
    relatedServices: [
      { label: "Garage Door Repairs Thornlie", href: "/garage-door-repairs-thornlie" },
      { label: "Sectional Garage Doors Perth", href: "/sectional-garage-doors-perth" },
    ],
    faqs: [
      {
        question: "Can a bent garage door panel be repaired?",
        answer:
          "Often, yes — a single bent panel can be straightened and realigned. If a panel is split or badly deformed we can replace just that section rather than the whole door.",
      },
      {
        question: "Why does my door stick halfway?",
        answer:
          "Usually a bent panel, worn roller or track issue binding the door mid-travel. We diagnose the exact cause and fix it so the door runs cleanly end to end.",
      },
    ],
    seo: {
      title: "Sectional Garage Door Repair in Thornlie | Case Study",
      description:
        "Realigning a bent panel on a Thornlie sectional garage door that was jamming mid-travel so it opens and closes cleanly again.",
    },
  },
  {
    slug: "commercial-roller-shutter-service-malaga-perth",
    title: "Commercial Roller Shutter Service in Malaga",
    subtitle:
      "Servicing a full-height industrial roller shutter at a Malaga warehouse — barrel, motor and curtain checked to keep the loading bay running.",
    service: "Commercial Roller Door Service",
    suburb: "Malaga",
    doorType: "Commercial Roller Shutter",
    jobType: "Service",
    result: "Industrial shutter serviced — loading bay back to reliable operation.",
    summary: {
      problem: "A heavy industrial shutter due for service to avoid downtime.",
      diagnosis: "Barrel, motor and curtain inspected for wear.",
      solution: "Serviced the drive, lubricated and adjusted for reliability.",
    },
    problem: {
      intro:
        "This Malaga warehouse relies on its roller shutter for daily loading, so the business booked a service to head off unplanned downtime.",
      points: [
        "High-use industrial shutter",
        "Loading-bay downtime is costly",
        "Preventative service required",
      ],
    },
    diagnosis: {
      intro:
        "We inspected the full height of the shutter — barrel, drive motor, curtain and guides — for wear and correct operation.",
      points: [
        "Barrel and spring balance checked",
        "Drive motor and controls tested",
        "Curtain and guides inspected",
      ],
    },
    solution: {
      intro:
        "We serviced and adjusted the drive, lubricated the moving parts and confirmed safe, reliable operation for the loading bay.",
      points: [
        "Drive serviced and adjusted",
        "Moving parts lubricated",
        "Safe operation confirmed",
      ],
    },
    images: [after("commercial-roller-shutter-service-malaga-perth", "Extension ladder against a large galvanised industrial roller shutter in a Malaga warehouse", "On Site")],
    partsUsed: ["Drive service", "Lubrication", "Safety check"],
    relatedServices: [
      { label: "Commercial Roller Doors Perth", href: "/commercial-roller-doors-perth" },
      { label: "Roller Door Repairs Perth", href: "/roller-door-repairs-perth" },
    ],
    faqs: [
      {
        question: "Do you service commercial and industrial roller shutters?",
        answer:
          "Yes. We service and repair commercial roller shutters across Perth's industrial areas, from Malaga to Kewdale, and can schedule around your trading hours.",
      },
      {
        question: "How often should a commercial shutter be serviced?",
        answer:
          "For high-use doors we recommend a service at least annually — more often for heavy daily cycling — to prevent breakdowns and keep the bay running.",
      },
    ],
    seo: {
      title: "Commercial Roller Shutter Service in Malaga | Case Study",
      description:
        "Servicing a full-height industrial roller shutter at a Malaga warehouse — barrel, motor and curtain checked to keep the loading bay running.",
    },
  },
  {
    slug: "roller-door-repair-wanneroo-perth",
    title: "Roller Door Repair in Wanneroo",
    subtitle:
      "This Wanneroo roller door had pulled free of its guide and creased the curtain. We refitted, straightened and re-tensioned it for smooth operation.",
    service: "Roller Door Repair",
    suburb: "Wanneroo",
    doorType: "Roller Door",
    jobType: "Repair",
    result: "Curtain refitted and re-tensioned — operating smoothly again.",
    summary: {
      problem: "Curtain out of the guide with creased slats.",
      diagnosis: "Door dislodged from the guide, slats creased.",
      solution: "Refitted the curtain, straightened slats and re-tensioned.",
    },
    problem: {
      intro:
        "The roller door on this Wanneroo home had pulled free of its guide against the brick reveal and creased along one edge.",
      points: [
        "Curtain dislodged from the guide",
        "Slats creased along one edge",
        "Door stiff and catching",
      ],
    },
    diagnosis: {
      intro:
        "The curtain had jumped the guide and several slats were creased, with the barrel slightly under-tensioned.",
      points: [
        "Curtain clear of the guide",
        "Creased slats",
        "Barrel spring under-tensioned",
      ],
    },
    solution: {
      intro:
        "We refitted the curtain into the guide, straightened the creased slats and re-tensioned the barrel for smooth travel.",
      points: [
        "Curtain refitted into the guide",
        "Creased slats straightened",
        "Barrel re-tensioned",
      ],
    },
    images: [beforeMain("roller-door-repair-wanneroo-perth", "White roller door curtain dislodged from its guide against a brick wall in Wanneroo")],
    partsUsed: ["Curtain refit", "Slat straightening", "Barrel re-tension"],
    relatedServices: [
      { label: "Roller Door Repairs Perth", href: "/roller-door-repairs-perth" },
      { label: "Garage Door Repairs Wanneroo", href: "/garage-door-repairs-wanneroo" },
    ],
    faqs: [
      {
        question: "Why does my roller door keep coming out of its guide?",
        answer:
          "Often a bent guide, worn curtain edge, or the door being run while obstructed. We fix the underlying cause, not just refit the curtain, so it doesn't recur.",
      },
      {
        question: "Do you cover the northern suburbs?",
        answer:
          "Yes — Wanneroo, Joondalup and the northern corridor are part of our regular service area for roller and sectional doors.",
      },
    ],
    seo: {
      title: "Roller Door Repair in Wanneroo | Case Study",
      description:
        "Refitting a Wanneroo roller door that had pulled free of its guide, straightening the creased slats and re-tensioning it for smooth operation.",
    },
  },
  {
    slug: "garage-door-motor-installation-ellenbrook-perth",
    title: "Garage Door Motor Installation in Ellenbrook",
    subtitle:
      "A new belt-drive opener installed and tuned for this Ellenbrook garage — quiet, smooth automatic operation with safety sensors fitted.",
    service: "Motor Installation",
    suburb: "Ellenbrook",
    doorType: "Sectional",
    jobType: "Installation",
    result: "Belt-drive opener installed and tuned — quiet, automatic operation.",
    summary: {
      problem: "Manual door the owners wanted automated quietly.",
      diagnosis: "Door suited to a belt-drive opener for quiet operation.",
      solution: "Installed and tuned a belt-drive opener with safety sensors.",
    },
    problem: {
      intro:
        "The owners of this Ellenbrook home wanted to automate their sectional door and were keen on something quiet for a garage under living areas.",
      points: [
        "Manual door to be automated",
        "Quiet operation preferred",
        "Safety sensors wanted",
      ],
    },
    diagnosis: {
      intro:
        "The door was well balanced and in good order, making it an ideal candidate for a quiet belt-drive opener.",
      points: [
        "Door balance confirmed",
        "Belt-drive opener selected for quietness",
        "Safety sensor positions planned",
      ],
    },
    solution: {
      intro:
        "We mounted and wired the belt-drive opener, set the travel and force limits, and fitted photo-eye safety sensors before handover.",
      points: [
        "Belt-drive opener installed",
        "Travel and force limits tuned",
        "Photo-eye safety sensors fitted and tested",
      ],
    },
    images: [after("garage-door-motor-installation-ellenbrook-perth", "Belt-drive garage door opener mounted to the ceiling rail above a sectional door in Ellenbrook", "Installed")],
    partsUsed: ["Belt-drive opener", "Photo-eye safety sensors", "Remote controls"],
    relatedServices: [
      { label: "Garage Door Motors Perth", href: "/garage-door-motors-perth" },
      { label: "Garage Door Opener Repair", href: "/garage-door-opener-repair-perth" },
    ],
    faqs: [
      {
        question: "Which garage door opener is the quietest?",
        answer:
          "Belt-drive openers run noticeably quieter than chain-drive, which is why we often recommend them for garages beneath or beside bedrooms and living areas.",
      },
      {
        question: "Can you automate my existing garage door?",
        answer:
          "In most cases, yes. If the door is well balanced and in good condition we can fit an opener to it — we'll check the door over first.",
      },
    ],
    seo: {
      title: "Garage Door Motor Installation in Ellenbrook | Case Study",
      description:
        "Installing and tuning a quiet belt-drive opener with safety sensors on an Ellenbrook sectional garage door.",
    },
  },
  {
    slug: "commercial-roller-door-repair-kewdale-perth",
    title: "Commercial Roller Door Repair in Kewdale",
    subtitle:
      "A commercial roller shutter in Kewdale had been forced out of its guide above the loading bay. We re-seated it fast to keep the business secure and trading.",
    service: "Commercial Roller Door Repair",
    suburb: "Kewdale",
    doorType: "Commercial Roller Shutter",
    jobType: "Repair",
    result: "Shutter re-seated and secured — loading bay back in service.",
    summary: {
      problem: "Commercial shutter bowed out of its guide, bay insecure.",
      diagnosis: "Curtain forced from the guide under load.",
      solution: "Re-seated and re-secured the shutter, minimising downtime.",
    },
    problem: {
      intro:
        "This Kewdale unit's roller shutter had bowed out of its guide over the loading bay, leaving the premises unable to close up securely.",
      points: [
        "Shutter bowed out of the guide",
        "Loading bay insecure",
        "Business needing to keep trading",
      ],
    },
    diagnosis: {
      intro:
        "The curtain had been forced from the guide, distorting the edge — the fix needed to be quick to minimise downtime for the business.",
      points: [
        "Curtain out of the guide",
        "Edge distortion",
        "Barrel and motor intact",
      ],
    },
    solution: {
      intro:
        "We re-formed the affected slats, re-seated the curtain and re-secured the shutter so the loading bay was back in service the same visit.",
      points: [
        "Affected slats re-formed",
        "Curtain re-seated in the guide",
        "Shutter re-secured and tested",
      ],
    },
    images: [beforeMain("commercial-roller-door-repair-kewdale-perth", "Light-blue commercial roller shutter bowed out of its guide above a loading bay in Kewdale")],
    partsUsed: ["Slat re-forming", "Curtain refit", "Guide service"],
    relatedServices: [
      { label: "Commercial Roller Doors Perth", href: "/commercial-roller-doors-perth" },
      { label: "Roller Door Repairs Perth", href: "/roller-door-repairs-perth" },
    ],
    faqs: [
      {
        question: "Can you repair a commercial shutter without closing the business?",
        answer:
          "We work to minimise downtime and can often schedule around trading hours. For urgent security issues we attend fast and make the shutter safe first.",
      },
      {
        question: "Do you service industrial areas like Kewdale?",
        answer:
          "Yes — Kewdale, Welshpool and the surrounding industrial areas are a core part of our commercial roller-door service and repair coverage.",
      },
    ],
    seo: {
      title: "Commercial Roller Door Repair in Kewdale | Case Study",
      description:
        "Re-seating a Kewdale commercial roller shutter forced out of its guide above a loading bay to keep the business secure and trading.",
    },
  },
  {
    slug: "storm-damaged-garage-door-repair-mandurah-perth",
    title: "Storm-Damaged Garage Door Repair in Mandurah",
    subtitle:
      "Storm winds folded this Mandurah double garage door out of its opening. We attended urgently to make the site safe and plan the panel replacement.",
    service: "Storm Damage Repair",
    suburb: "Mandurah",
    doorType: "Sectional",
    jobType: "Emergency",
    result: "Site made safe after storm damage — repair and panels planned.",
    summary: {
      problem: "A double door blown out of its opening by storm winds.",
      diagnosis: "Panels and tracks distorted by wind load.",
      solution: "Made the site safe and scoped the panel replacement.",
    },
    problem: {
      intro:
        "After a Perth storm, this Mandurah homeowner found their double garage door collapsed and buckled out over the driveway.",
      points: [
        "Door blown out of its opening",
        "Panels badly buckled",
        "Home left exposed",
      ],
    },
    diagnosis: {
      intro:
        "The wind load had distorted the panels and racked the tracks, so the priority was making the opening safe and secure.",
      points: [
        "Panels distorted beyond straightening",
        "Tracks racked out of line",
        "Opening insecure",
      ],
    },
    solution: {
      intro:
        "We made the site safe, secured the opening, and scoped the panel and track replacement to get the door restored.",
      points: [
        "Site made safe and secured",
        "Damaged panels removed",
        "Panel and track replacement scoped",
      ],
    },
    images: [beforeMain("storm-damaged-garage-door-repair-mandurah-perth", "White double sectional garage door collapsed and buckled outward after storm damage in Mandurah")],
    partsUsed: ["Panels", "Tracks", "Make-safe"],
    relatedServices: [
      { label: "Emergency Garage Door Repairs Perth", href: "/emergency-garage-door-repairs-perth" },
      { label: "Garage Door Installation Perth", href: "/garage-door-installation-perth" },
    ],
    faqs: [
      {
        question: "My garage door was damaged in a storm — what now?",
        answer:
          "Call us and keep clear of the door. We'll make the opening safe and secure the property, then assess whether the door can be repaired or needs replacing.",
      },
      {
        question: "Do you handle insurance storm-damage repairs?",
        answer:
          "We can provide the assessment and quote you'll need for a claim, and carry out the repair or replacement once it's approved.",
      },
    ],
    seo: {
      title: "Storm-Damaged Garage Door Repair in Mandurah | Case Study",
      description:
        "An urgent Mandurah callout after storm winds folded a double garage door out of its opening — site made safe and the repair scoped.",
    },
  },
  {
    slug: "garage-door-spring-replacement-rockingham-perth",
    title: "Garage Door Spring Replacement in Rockingham",
    subtitle:
      "Before and after: a worn torsion spring replaced with a new high-cycle spring on this Rockingham door, then rebalanced and safety-checked.",
    service: "Spring Replacement",
    suburb: "Rockingham",
    doorType: "Sectional",
    jobType: "Repair",
    result: "New torsion spring fitted and rebalanced — smooth, even lift.",
    summary: {
      problem: "A worn torsion spring making the door heavy and uneven.",
      diagnosis: "Spring past its cycle life, losing tension.",
      solution: "Fitted a new high-cycle spring and rebalanced the door.",
    },
    problem: {
      intro:
        "The garage door at this Rockingham home had become heavy and slow, with an old torsion spring well past its best.",
      points: [
        "Door heavy and slow to lift",
        "Opener straining",
        "Worn torsion spring",
      ],
    },
    diagnosis: {
      intro:
        "The spring had lost tension after years of cycling and was no longer supporting the door weight correctly.",
      points: [
        "Spring past its cycle life",
        "Tension below spec",
        "Opener working too hard",
      ],
    },
    solution: {
      intro:
        "We replaced the worn spring with a new high-cycle torsion spring, set the correct tension and rebalanced the door — the before and after are night and day.",
      points: [
        "New high-cycle torsion spring fitted",
        "Correct tension set",
        "Door rebalanced and safety-checked",
      ],
    },
    images: [
      before("garage-door-spring-replacement-rockingham-perth", "Worn grey torsion spring on the shaft before replacement in Rockingham"),
      after("garage-door-spring-replacement-rockingham-perth", "Newly fitted torsion spring on the shaft above a Rockingham garage door", "After"),
    ],
    partsUsed: ["High-cycle torsion spring", "Winding bars", "Re-balance"],
    relatedServices: [
      { label: "Garage Door Spring Repair", href: "/garage-door-spring-repair-perth" },
      { label: "Garage Door Repairs Rockingham", href: "/garage-door-repairs-rockingham" },
    ],
    faqs: [
      {
        question: "What are the signs of a worn garage door spring?",
        answer:
          "A door that feels heavy, opens slowly, or won't stay half-open usually has a spring losing tension. Replacing it restores a smooth, even lift and protects the opener.",
      },
      {
        question: "Do you service Rockingham and the southern coast?",
        answer:
          "Yes — Rockingham, Baldivis and the southern coastal suburbs are part of our regular service area for spring, cable and door repairs.",
      },
    ],
    seo: {
      title: "Garage Door Spring Replacement in Rockingham | Case Study",
      description:
        "Before and after: replacing a worn torsion spring on a Rockingham garage door with a new high-cycle spring and rebalancing it.",
    },
  },
];

let token = "";

async function api<T>(path: string, init: RequestInit = {}): Promise<{ status: number; body: T }> {
  const res = await fetch(`${CMS_API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(init.headers ?? {}),
    },
  });
  const text = await res.text();
  let body: unknown;
  try {
    body = text ? JSON.parse(text) : undefined;
  } catch {
    body = text;
  }
  if (!res.ok && res.status !== 409) {
    throw new Error(`${init.method ?? "GET"} ${path} failed (${res.status}): ${text.slice(0, 300)}`);
  }
  return { status: res.status, body: body as T };
}

async function login(): Promise<void> {
  const res = await fetch(`${CMS_API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
  });
  if (!res.ok) throw new Error(`Login failed (${res.status}) at ${CMS_API_URL}.`);
  const data = (await res.json()) as { token?: string };
  if (!data.token) throw new Error("Login succeeded but no token was returned.");
  token = data.token;
}

function staticLink(href: string, label: string, linkGroup: string, sortOrder: number) {
  return { targetPageId: null, staticHref: href, labelOverride: label, linkGroup, sortOrder };
}

function toPayload(cs: CaseStudy) {
  const data = {
    title: cs.title,
    subtitle: cs.subtitle,
    service: cs.service,
    suburb: cs.suburb,
    doorType: cs.doorType,
    jobType: cs.jobType,
    result: cs.result,
    summary: cs.summary,
    problem: cs.problem,
    diagnosis: cs.diagnosis,
    solution: cs.solution,
    // Store the REAL CDN src (not an assetId) so the resolve mapper's img.src resolves.
    images: cs.images.map((img) => ({ src: img.src, alt: img.alt, caption: img.caption })),
    partsUsed: cs.partsUsed,
  };

  return {
    templateType: "CaseStudyPage",
    routeGroup: "CaseStudies",
    slug: cs.slug,
    title: cs.title,
    seoTitle: cs.seo.title,
    seoDescription: cs.seo.description,
    noIndex: false,
    status: "Published" as const,
    heroImageAssetId: null,
    data,
    faqs: cs.faqs.map((f, i) => ({ question: f.question, answer: f.answer, sortOrder: i })),
    relatedLinks: cs.relatedServices.map((l, i) => staticLink(l.href, l.label, "RelatedServices", i)),
    pricingRows: [],
    reviews: [],
    services: [],
  };
}

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  console.log(`Importing ${CASE_STUDIES.length} case studies into ${CMS_API_URL}${dryRun ? " (DRY RUN)" : ""}`);
  if (dryRun) {
    for (const cs of CASE_STUDIES) {
      const kinds = cs.images.map((i) => i.caption).join(" + ");
      console.log(`  would create /case-studies/${cs.slug} — ${cs.suburb} [${kinds}]`);
    }
    console.log("Dry run complete — no CMS changes made.");
    return;
  }

  await login();
  console.log("✓ logged in");

  let created = 0;
  let skipped = 0;
  for (const cs of CASE_STUDIES) {
    const { status } = await api<{ id: number }>(`/api/admin/pages`, {
      method: "POST",
      body: JSON.stringify(toPayload(cs)),
    });
    if (status === 409) {
      skipped++;
      console.log(`  = ${cs.slug} already exists (skipped)`);
    } else {
      created++;
      console.log(`  ✓ ${cs.slug} created (${cs.suburb})`);
    }
  }

  console.log(`Done: ${created} created, ${skipped} skipped.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
