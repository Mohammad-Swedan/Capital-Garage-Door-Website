import type { Problem } from "@/types";

export const problems: Problem[] = [
  {
    slug: "garage-door-wont-open",
    name: "Garage Door Won't Open",
    h1: "Garage Door Won't Open?",
    heroSubtitle:
      "If your garage door is stuck, not responding, or refusing to open, Capital Garage Door can inspect and repair the issue across Perth — same-day, in most cases.",
    metaTitle: "Garage Door Won't Open? Causes, Fixes & Repairs Perth",
    metaDescription:
      "Garage door won't open? Common causes — broken springs, motor faults, snapped cables — what's safe to check yourself, and when to call. Same-day Perth repairs.",
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
    // Ranges mirror pricing-data.ts (the pricing source of truth); the live
    // CMS page renders the same figures from relational pricing pins.
    costRows: [
      { scenario: "Remote (extra / replacement)", priceRange: "$95 each + $120 to attend & program", note: "Often the simplest fix when the door won't respond" },
      { scenario: "Motor / opener repair", priceRange: "$380–$490", note: "Full replacement $770–$990 supplied & installed" },
      { scenario: "Broken spring (single)", priceRange: "$240–$280", note: "Pairs $440–$550 — springs often fail together" },
      { scenario: "Cable snapped or off the drum", priceRange: "$280–$550", note: "One or both cables, re-seated on the drum" },
      { scenario: "After-hours emergency call-out", priceRange: "+$500", note: "Flat surcharge on the repair price, confirmed before dispatch" },
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
        question: "What should I describe when I request help?",
        answer:
          "Tell us what the door is doing (won't open, off its tracks, grinding noise, etc.) and roughly how long it's been happening — the more detail you give our technicians, the faster they can diagnose the issue and arrive with the right parts.",
      },
      {
        question: "Do you service all Perth suburbs?",
        answer:
          "Yes, Capital Garage Door provides repairs and installations across all Perth suburbs, with same-day service available in most areas.",
      },
    ],
    updatedAt: "2026-06-22",
    heroImage: "https://jadara-hub.b-cdn.net/capital-garage-door/422b9b76bdc5448b9ebb2c058509746c.png",
  },

  {
    slug: "garage-door-stuck-halfway",
    name: "Garage Door Stuck Halfway",
    h1: "Garage Door Stuck Halfway?",
    heroSubtitle:
      "A door frozen part-way up is usually a track, cable or balance problem — and using it can make the damage worse. We diagnose and fix stuck doors across Perth, same-day in most cases.",
    metaTitle: "Garage Door Stuck Halfway? Causes & Fixes | Perth",
    metaDescription:
      "Garage door stuck halfway up or down? The common causes — track damage, snapped cables, spring trouble — what's safe to check, and typical Perth repair costs.",
    directAnswer:
      "A garage door gets stuck halfway when something physically blocks its travel or the lifting system loses balance: a bent track, worn or jammed rollers, a snapped or off-drum cable, a failing spring, or opener travel limits that have drifted. Stop operating the door — repeatedly driving it against the obstruction strains the motor and can bend panels — and have a technician re-seat and rebalance it.",
    causes: [
      {
        icon: "TrafficCone",
        title: "Track obstruction or damage",
        description:
          "Debris in the track, or a kink from an impact, physically stops the rollers at the same point every time.",
      },
      {
        icon: "Disc3",
        title: "Worn or jammed rollers",
        description:
          "Flat-spotted or seized rollers drag in the track instead of rolling, and the door binds part-way through its travel.",
      },
      {
        icon: "Cable",
        title: "Cable off the drum",
        description:
          "A cable that has slipped its drum makes the door lift crooked until it wedges itself in the tracks.",
      },
      {
        icon: "Settings",
        title: "Spring losing tension",
        description:
          "A fatigued spring can lift the door part-way before running out of stored energy, leaving it stranded mid-travel.",
      },
      {
        icon: "Cpu",
        title: "Opener travel limits drifted",
        description:
          "The opener's programmed open/close limits can drift, telling the motor to stop before the door finishes its travel.",
      },
      {
        icon: "Scale",
        title: "Door out of balance",
        description:
          "An unbalanced door gets heavier through part of its travel, and the opener's safety cut-out stops rather than forces it.",
      },
    ],
    safeChecks: [
      "Look along both tracks for debris, dents or anything wedged in them",
      "Check whether the door sits level or one side hangs lower (crooked = cable/spring issue)",
      "Try the wall switch as well as the remote to rule out a signal problem",
      "Watch and listen for where exactly the door stops — the same spot every time points to the track",
    ],
    doNotDo: [
      "Do not keep pressing the button to force the door past the sticking point",
      "Do not pull the red release cord while the door is halfway up — it can slam down",
      "Do not touch the springs, cables or drums",
    ],
    callTechnicianSigns: [
      "The door is visibly crooked in the opening",
      "A cable looks slack, frayed or off its drum",
      "The door stops at the same spot every time",
      "It grinds or bangs at the sticking point",
      "The door feels very heavy when moved by hand",
      "The tracks look bent or pulled away from the wall",
    ],
    relatedServices: [
      { slug: "garage-door-repair", label: "Garage Door Repairs Perth" },
      { slug: "spring-repair", label: "Garage Door Spring Repair" },
      { slug: "emergency-garage-door-service", label: "Emergency Garage Door Repairs" },
      { slug: "garage-door-maintenance", label: "Garage Door Servicing & Maintenance" },
    ],
    costRows: [
      { scenario: "Door off track / stuck", priceRange: "$440–$770", note: "Re-seat door, straighten tracks, check rollers" },
      { scenario: "Cable snapped or off the drum", priceRange: "$280–$550", note: "One or both cables, re-seated on the drum" },
      { scenario: "Hinges & rollers / wheels", priceRange: "$30 each + $140 call-out", note: "Worn rollers are a common sticking cause" },
      { scenario: "Spring re-fit / re-tension", priceRange: "$280–$330", note: "Restores the door's balance through full travel" },
      { scenario: "After-hours emergency call-out", priceRange: "+$500", note: "Flat surcharge on the repair price" },
    ],
    emergency: {
      heading: "Door stuck half-open and can't secure your home?",
      body: "A half-open garage door is an open invitation. Our emergency team can make the door safe and secure fast, any day of the week.",
    },
    faqs: [
      {
        question: "Why is my garage door stuck halfway?",
        answer:
          "The usual culprits are a bent or blocked track, worn rollers, a cable that has slipped its drum, a spring losing tension, or opener limits that have drifted. If the door stops at the same point every time, the track or rollers are the first place to look.",
      },
      {
        question: "Can I force the door the rest of the way?",
        answer:
          "No. Forcing a stuck door — with the opener or by hand — bends panels, strains the motor and can pull cables off their drums. If it doesn't move freely, stop and have it looked at.",
      },
      {
        question: "Is it safe to use the manual release when the door is halfway?",
        answer:
          "Be careful: pulling the release cord disconnects the door from the opener, and if a spring or cable has failed the door can slam down under its own weight. Only use the release when the door is fully closed, or leave it to a technician.",
      },
      {
        question: "How much does it cost to fix a door stuck halfway in Perth?",
        answer:
          "Getting a door back on track and running is typically $440–$770, worn rollers are $30 each plus a $140 call-out, and cable repairs run $280–$550. We confirm the exact price upfront after inspecting the door.",
      },
      {
        question: "Can you fix it the same day?",
        answer:
          "In most cases, yes. Our vans carry tracks, rollers, cables and springs for the common door types, so most stuck doors are freed and rebalanced on the first visit.",
      },
    ],
    updatedAt: "2026-07-09",
    heroImage: "https://jadara-hub.b-cdn.net/capital-garage-door/gallery/garage-door-cable-track-repair-perth.webp",
  },

  {
    slug: "garage-door-remote-not-working",
    name: "Garage Door Remote Not Working",
    h1: "Garage Door Remote Not Working?",
    heroSubtitle:
      "Nine times out of ten it's the battery, the pairing or the receiver — all quick fixes. Here's what to check before you call, and what we can sort out on a single visit.",
    metaTitle: "Garage Door Remote Not Working? Fixes | Perth",
    metaDescription:
      "Garage door remote not working? Battery, pairing and receiver checks you can do yourself, when the opener itself is at fault, and Perth repair costs explained.",
    directAnswer:
      "When a garage door remote stops working the cause is usually simple: a flat battery, lost pairing with the opener, a stuck lock/vacation mode, signal interference, or a worn remote. If the wall switch still operates the door, the fault is in the remote or receiver rather than the opener — a new remote supplied, programmed and tested is $95 plus a $120 visit.",
    causes: [
      {
        icon: "BatteryWarning",
        title: "Flat remote battery",
        description:
          "The most common cause by far. A weak battery may still light the LED but lack the range to reach the opener.",
      },
      {
        icon: "Radio",
        title: "Lost pairing",
        description:
          "Power flickers and failed re-programs can wipe the remote's code from the opener's memory, so presses do nothing.",
      },
      {
        icon: "ShieldCheck",
        title: "Lock / vacation mode on",
        description:
          "Many wall consoles have a lock mode that deliberately ignores remotes — easy to switch on without noticing.",
      },
      {
        icon: "Zap",
        title: "Signal interference",
        description:
          "LED lights, solar inverters and other electronics near the opener can drown out the remote's signal.",
      },
      {
        icon: "Cpu",
        title: "Receiver or logic-board fault",
        description:
          "If no remote works but the wall switch does, the opener's receiver or board may need repair or replacement.",
      },
      {
        icon: "Settings",
        title: "Worn-out remote",
        description:
          "Buttons and contacts wear out. A remote that only works when squeezed hard is telling you it's done.",
      },
    ],
    safeChecks: [
      "Replace the remote battery with a fresh one (check it's seated the right way up)",
      "Test the wall-mounted switch — if it works, the opener itself is fine",
      "Check the wall console isn't in lock/vacation mode",
      "Try the remote from close range to rule out interference",
      "Test a second remote or the keypad if you have one",
    ],
    doNotDo: [
      "Do not open the opener head unit to poke at the receiver board",
      "Do not factory-reset the opener unless you know how to re-pair every remote",
      "Do not buy a generic remote before confirming it suits your opener model",
    ],
    callTechnicianSigns: [
      "No remote works but the wall switch does",
      "Remotes lose their pairing again after a day or two",
      "The door responds intermittently or only from very close range",
      "The opener clicks but the door doesn't move",
      "You want extra remotes or smartphone control set up properly",
    ],
    relatedServices: [
      { slug: "garage-door-opener-repair", label: "Garage Door Opener Repair Perth" },
      { slug: "garage-door-repair", label: "Garage Door Repairs Perth" },
      { slug: "garage-door-maintenance", label: "Garage Door Servicing & Maintenance" },
    ],
    costRows: [
      { scenario: "Remote (extra / replacement)", priceRange: "$95 each + $120 to attend & program", note: "Supplied, paired and tested on the day" },
      { scenario: "Safety sensors / photo eyes", priceRange: "$150–$300", note: "A sensor fault can mimic a remote problem" },
      { scenario: "Motor / opener repair", priceRange: "$380–$490", note: "Receiver or logic-board faults" },
      { scenario: "WiFi / smart control (supply & install)", priceRange: "$280–$380", note: "Open and check the door from your phone" },
    ],
    emergency: {
      heading: "Locked out with a car inside?",
      body: "If the remote has failed and you can't get into the garage at all, call us — we can get you in safely and have the door working again fast.",
    },
    faqs: [
      {
        question: "Why has my garage door remote stopped working?",
        answer:
          "Start with the battery — it's the cause more often than everything else combined. After that: lost pairing, the wall console's lock mode, signal interference from nearby electronics, or a worn-out remote. If the wall switch works, the opener itself is fine.",
      },
      {
        question: "How do I re-pair my remote to the opener?",
        answer:
          "Most openers have a learn button on the head unit — press it, then press the remote button within about 30 seconds. The exact steps vary by brand and model, so check the opener's manual. If pairing won't hold, the receiver may be at fault.",
      },
      {
        question: "How much does a replacement garage remote cost in Perth?",
        answer:
          "We supply, program and test genuine-compatible remotes for $95 each plus $120 to attend, covering as many remotes as you need in the one visit. We can also add a wall keypad or Wi-Fi smartphone control ($280–$380) at the same time.",
      },
      {
        question: "The remote only works right next to the door — why?",
        answer:
          "Short range usually means a weak battery, an aging receiver, or interference from LED lighting or a solar inverter mounted near the opener. Swap the battery first; if range stays poor, the receiver is worth testing.",
      },
      {
        question: "Can any universal remote work with my door?",
        answer:
          "Not reliably. Openers use different frequencies and rolling-code systems, and many universal remotes don't support Australian brands properly. A remote matched to your opener model avoids the trial-and-error.",
      },
    ],
    updatedAt: "2026-07-09",
    heroImage: "https://jadara-hub.b-cdn.net/capital-garage-door/gallery/garage-door-motor-installation-perth.webp",
  },

  {
    slug: "garage-door-motor-not-responding",
    name: "Garage Door Motor Not Responding",
    h1: "Garage Door Motor Not Responding?",
    heroSubtitle:
      "Dead silence, a hum with no movement, or clicking that goes nowhere — opener faults have a short list of causes. We diagnose and repair all major brands across Perth.",
    metaTitle: "Garage Door Motor Not Responding? | Perth Fixes",
    metaDescription:
      "Garage door motor not responding? Power, capacitor and board faults explained — what to check safely, repair vs replace ($380–$990), same-day Perth service.",
    directAnswer:
      "A garage door motor that won't respond usually has a power problem (tripped breaker, dead outlet), a failed capacitor (hums but doesn't lift), a burnt-out logic board, a stripped drive gear (motor runs, door doesn't move), or has simply reached end of life. Repairs typically cost $380–$490; a full replacement is $770–$990 supplied and installed. If the motor hums or clicks, stop pressing the button — that's how windings burn out.",
    causes: [
      {
        icon: "Plug",
        title: "No power to the opener",
        description:
          "A tripped switchboard breaker, a dead GPO or a dislodged plug is the first thing to rule out — and the cheapest.",
      },
      {
        icon: "Zap",
        title: "Failed capacitor",
        description:
          "A motor that hums without moving often has a failed start capacitor — a common, repairable fault on older units.",
      },
      {
        icon: "Cpu",
        title: "Logic board failure",
        description:
          "Power surges and age kill opener circuit boards. The lights may still work while the motor ignores every command.",
      },
      {
        icon: "Settings",
        title: "Stripped drive gear",
        description:
          "If the motor runs but the door doesn't move, the nylon drive gear has likely stripped — replaceable without a new opener.",
      },
      {
        icon: "Scale",
        title: "Overload from an unbalanced door",
        description:
          "A failing spring makes the door too heavy; the opener's thermal protection shuts the motor down to save it.",
      },
      {
        icon: "Clock3",
        title: "End of motor life",
        description:
          "Openers last roughly 10–15 years. Past that, worn brushes and windings make faults frequent and replacement better value.",
      },
    ],
    safeChecks: [
      "Check the switchboard for a tripped breaker and reset it once",
      "Test the opener's power outlet with another appliance (e.g. a lamp)",
      "Try the wall switch as well as the remote",
      "Listen: silence, humming or clicking each point to different faults — note which you hear",
    ],
    doNotDo: [
      "Do not keep pressing the button while the motor hums — that burns out the windings",
      "Do not open the motor housing; capacitors hold charge even when unplugged",
      "Do not use the manual release and force the door if it feels heavy — that points to a spring fault",
    ],
    callTechnicianSigns: [
      "The motor hums or clicks but the door doesn't move",
      "The opener's light works but the motor never runs",
      "It trips the breaker when it tries to start",
      "The motor runs but the door stays still (stripped gear)",
      "The opener is 10+ years old and faults keep recurring",
      "The door is too heavy to lift by hand with the release pulled",
    ],
    relatedServices: [
      { slug: "garage-door-opener-repair", label: "Garage Door Opener Repair Perth" },
      { slug: "garage-door-repair", label: "Garage Door Repairs Perth" },
      { slug: "spring-repair", label: "Garage Door Spring Repair" },
      { slug: "emergency-garage-door-service", label: "Emergency Garage Door Repairs" },
    ],
    costRows: [
      { scenario: "Motor / opener repair", priceRange: "$380–$490", note: "Capacitors, gears, boards on all major brands" },
      { scenario: "Motor / opener replacement", priceRange: "$770–$990", note: "Supplied & installed, remotes programmed" },
      { scenario: "Remote (extra / replacement)", priceRange: "$95 each + $120 to attend & program", note: "If the fault turns out to be the remote" },
      { scenario: "After-hours emergency call-out", priceRange: "+$500", note: "Flat surcharge on the repair price" },
    ],
    emergency: {
      heading: "Car trapped behind a dead opener?",
      body: "We can release the door safely, get you moving, and repair or replace the opener — often on the same visit.",
    },
    faqs: [
      {
        question: "Why is my garage door motor not responding at all?",
        answer:
          "Complete silence usually means a power problem — a tripped breaker, dead outlet or failed transformer — or a dead logic board. Rule out the power first: test the outlet with a lamp and reset the breaker once. If power is fine, the opener needs a technician's diagnosis.",
      },
      {
        question: "The motor hums but the door doesn't move — what is it?",
        answer:
          "A humming motor is usually a failed start capacitor or a motor straining against a door made heavy by a broken spring. Stop pressing the button — running a stalled motor burns out the windings — and have both the opener and the springs checked.",
      },
      {
        question: "Should I repair or replace the opener?",
        answer:
          "If the opener is under about ten years old and the fault is a capacitor, gear or receiver, a $380–$490 repair usually makes sense. If it's older, noisy, or on its second fault, a new unit at $770–$990 supplied and installed is better value — quieter, safer and with smartphone control.",
      },
      {
        question: "Can I still open the door with a dead motor?",
        answer:
          "Yes — with the door fully closed, pull the red manual release cord and lift the door by hand. If it feels very heavy or won't stay up, a spring has likely failed too: stop and call, because that's the dangerous kind of fault.",
      },
      {
        question: "Do you repair all opener brands?",
        answer:
          "Yes — our technicians carry parts for the major Australian brands and can service chain, belt and roller-door openers. If yours is beyond economical repair, we supply and fit our Capital 1100N and 1500N belt-drive motors with factory warranties.",
      },
    ],
    updatedAt: "2026-07-09",
    heroImage: "https://jadara-hub.b-cdn.net/capital-garage-door/gallery/garage-door-motor-gear-replacement-perth.webp",
  },

  {
    slug: "garage-door-spring-or-cable-broken",
    name: "Broken Garage Door Spring or Cable",
    h1: "Broken Garage Door Spring or Cable?",
    heroSubtitle:
      "A loud bang from the garage, a door that suddenly weighs a ton, or a cable hanging loose — this is the one garage door fault you should never touch yourself.",
    metaTitle: "Broken Garage Door Spring or Cable? | Perth Repairs",
    metaDescription:
      "Snapped garage door spring or cable? Why the door goes heavy or crooked, why DIY is dangerous, and Perth replacement costs ($240–$1,000). Same-day repairs.",
    directAnswer:
      "Springs and cables carry your garage door's full weight — often well over 100 kg. When a spring snaps (usually with a loud bang) the door becomes too heavy to lift; when a cable fails the door lifts crooked or drops on one side. Both are under extreme tension and are the most dangerous garage door parts to handle: leave the door where it is and call a technician. Replacement runs $240–$1,000 for springs and $280–$550 for cables, quoted upfront.",
    causes: [
      {
        icon: "Clock3",
        title: "Metal fatigue from normal use",
        description:
          "Springs are rated in cycles — roughly 10,000 opens and closes, or 7–12 years of typical use — then they let go.",
      },
      {
        icon: "AlertTriangle",
        title: "Rust and corrosion",
        description:
          "Coastal salt air and moisture pit the steel, concentrating stress until a coil or cable strand fails early.",
      },
      {
        icon: "Cable",
        title: "Fraying at the drum",
        description:
          "Cables wear where they wind onto the drum; a few broken strands quickly become a snapped cable under load.",
      },
      {
        icon: "Scale",
        title: "Unbalanced door loading one side",
        description:
          "When one spring weakens, its partner and both cables carry extra load — which is why failures come in pairs.",
      },
      {
        icon: "Settings",
        title: "Wrong spring for the door",
        description:
          "A previous repair with an undersized spring leaves it working past its rating on every single cycle.",
      },
      {
        icon: "Wrench",
        title: "Missed servicing",
        description:
          "Annual servicing catches stretched coils, rust and fraying strands before they turn into a bang at 6 am.",
      },
    ],
    safeChecks: [
      "From a safe distance, look for a visible gap in the spring coil above the door",
      "Check whether the door hangs crooked or a cable dangles loose",
      "If the door is closed, leave it closed — don't test-lift a suspected broken spring",
      "Keep people, pets and cars clear of the door until it's repaired",
    ],
    doNotDo: [
      "Do not attempt to lift the door — a sprung door can weigh over 100 kg",
      "Do not touch, unwind or adjust springs, cables or drums under any circumstances",
      "Do not run the opener against a broken spring — it will burn out the motor and bend panels",
    ],
    callTechnicianSigns: [
      "You heard a loud bang from the garage",
      "There's a visible gap or separation in a spring",
      "A cable is slack, frayed or hanging off its drum",
      "The door lifts a few centimetres then stops or slams back down",
      "The door sits crooked in its opening",
      "The door feels far heavier than it used to",
    ],
    relatedServices: [
      { slug: "spring-repair", label: "Garage Door Spring Repair Perth" },
      { slug: "garage-door-repair", label: "Garage Door Repairs Perth" },
      { slug: "emergency-garage-door-service", label: "Emergency Garage Door Repairs" },
      { slug: "garage-door-maintenance", label: "Garage Door Servicing & Maintenance" },
    ],
    costRows: [
      { scenario: "Broken spring (single)", priceRange: "$240–$280", note: "Supplied, fitted, re-tensioned and balance-tested" },
      { scenario: "Broken springs (pair)", priceRange: "$440–$550", note: "Springs age together — pairs are usually replaced together" },
      { scenario: "Cable snapped or off the drum", priceRange: "$280–$550", note: "One or both cables, re-seated on the drum" },
      { scenario: "Spring re-fit / re-tension", priceRange: "$280–$330", note: "When the spring has slipped rather than snapped" },
      { scenario: "After-hours emergency call-out", priceRange: "+$500", note: "Flat surcharge on the repair price" },
    ],
    emergency: {
      heading: "Spring gone and your car's trapped inside?",
      body: "Don't try to lift the door. Our emergency team carries springs and cables for the common Perth door types and can have you moving again fast — 24/7.",
    },
    faqs: [
      {
        question: "How do I know if my garage door spring is broken?",
        answer:
          "The classic signs: a loud bang from the garage, a visible gap in the spring coil above the door, a door that feels enormously heavy, or one that lifts a few centimetres and stops. On cable failures the door typically hangs crooked or a cable dangles visibly loose.",
      },
      {
        question: "Why is a broken spring dangerous to fix yourself?",
        answer:
          "Torsion springs store the energy needed to lift 100+ kg of door, and they release it instantly if mishandled — winding bars, not willpower, are what keep technicians safe. Spring injuries are among the most serious in home DIY. It's genuinely not worth it for a $240–$550 professional repair.",
      },
      {
        question: "Should I replace both springs if only one broke?",
        answer:
          "Usually yes. Both springs have done the same number of cycles, so the survivor is close behind — and a new spring paired with a fatigued one leaves the door unbalanced. Replacing the pair ($440–$550) avoids a second call-out within months.",
      },
      {
        question: "How long do garage door springs last?",
        answer:
          "Around 10,000 cycles — 7–12 years of typical use. Heavy daily use shortens that; annual servicing and coastal-suburb corrosion checks extend it. If your springs are approaching a decade old, budget for replacement before they choose the timing for you.",
      },
      {
        question: "Can you replace springs and cables the same day?",
        answer:
          "In most cases, yes — our vans carry torsion and extension springs and cables for the common Perth door types, so the repair, re-tension and balance test are done in a single visit.",
      },
    ],
    updatedAt: "2026-07-09",
    heroImage: "https://jadara-hub.b-cdn.net/capital-garage-door/gallery/garage-door-torsion-spring-replacement-perth.webp",
  },

  {
    slug: "garage-door-off-track",
    name: "Garage Door Off Track",
    h1: "Garage Door Off Its Tracks?",
    heroSubtitle:
      "Rollers out of their guides, panels leaning at an angle — an off-track door is one strong gust or one more press of the button away from real damage. Stop using it and we'll re-seat it properly.",
    metaTitle: "Garage Door Off Track? Causes & Repair | Perth",
    metaDescription:
      "Garage door come off its tracks? What causes it, why you should stop using the door immediately, and Perth repair costs ($440–$770). Same-day response.",
    directAnswer:
      "A garage door comes off its tracks when rollers are forced out of their guides — usually after hitting an obstruction, a vehicle bump, a snapped cable unloading one side, or worn rollers and bent track finally letting go. An off-track door can fall, so stop operating it immediately. Re-seating the door, straightening the track and checking every roller typically costs $440–$770 in Perth, and most jobs are done in a single visit.",
    causes: [
      {
        icon: "AlertTriangle",
        title: "Hitting an obstruction",
        description:
          "Closing onto a bin, broom or bumper twists the door in its guides — the most common way rollers jump the track.",
      },
      {
        icon: "TrafficCone",
        title: "Vehicle bump",
        description:
          "Even a light touch from a car knocks the bottom panels out of alignment and levers the rollers out.",
      },
      {
        icon: "Cable",
        title: "Snapped or slipped cable",
        description:
          "When one cable lets go, the door's weight shifts to one side and the unloaded side climbs out of its track.",
      },
      {
        icon: "Disc3",
        title: "Worn rollers",
        description:
          "Cracked or flat-spotted rollers wobble in the guide until one pops out under load.",
      },
      {
        icon: "Move",
        title: "Bent or loose track",
        description:
          "A track knocked out of line, or one with loose mounting brackets, lets rollers escape at the weak point.",
      },
      {
        icon: "Scale",
        title: "Unbalanced operation",
        description:
          "A door that has been running crooked for weeks eventually works its rollers loose on the stressed side.",
      },
    ],
    safeChecks: [
      "Stop using the door immediately — don't press the button 'one more time'",
      "From a distance, note which rollers are out and whether a cable is loose",
      "Keep people, pets and cars away from and out from under the door",
      "If it's safe to reach, unplug the opener so nobody operates the door by habit",
    ],
    doNotDo: [
      "Do not run the opener to try to straighten the door",
      "Do not try to lever the rollers back into the track yourself",
      "Do not pull the manual release — an off-track door can fall once disconnected",
    ],
    callTechnicianSigns: [
      "Any roller is visibly out of its track",
      "The door hangs at an angle or has come away from the opening",
      "A cable is slack or off its drum on one side",
      "The track is bent, twisted or pulled off the wall",
      "The door jams and grinds at the same point in its travel",
    ],
    relatedServices: [
      { slug: "garage-door-repair", label: "Garage Door Repairs Perth" },
      { slug: "emergency-garage-door-service", label: "Emergency Garage Door Repairs" },
      { slug: "spring-repair", label: "Garage Door Spring Repair" },
      { slug: "garage-door-maintenance", label: "Garage Door Servicing & Maintenance" },
    ],
    costRows: [
      { scenario: "Door off track / stuck", priceRange: "$440–$770", note: "Re-seat door, straighten tracks, check rollers" },
      { scenario: "Hinges & rollers / wheels", priceRange: "$30 each + $140 call-out", note: "Worn rollers replaced while the door is down" },
      { scenario: "Cable snapped or off the drum", priceRange: "$280–$550", note: "Often the trigger for one side jumping the track" },
      { scenario: "Damaged panel / section", priceRange: "$550–$1,100", note: "If panels were bent while running off-track" },
      { scenario: "After-hours emergency call-out", priceRange: "+$500", note: "Flat surcharge on the repair price" },
    ],
    emergency: {
      heading: "Door hanging off its tracks right now?",
      body: "An off-track door can fall without warning. Keep everyone clear and call us — our emergency team secures and re-seats doors across Perth, 24/7.",
    },
    faqs: [
      {
        question: "Can I put my garage door back on track myself?",
        answer:
          "It's not worth the risk. The door's full weight is involved, and levering rollers back without supporting the door properly is how doors fall and fingers get caught. A technician supports the door, re-seats every roller, straightens the track and finds the cause so it doesn't repeat.",
      },
      {
        question: "How much does off-track garage door repair cost in Perth?",
        answer:
          "Typically $440–$770 to re-seat the door, straighten the tracks and check the rollers and cables. Worn rollers add $30 each, and if panels were bent while the door ran crooked, panel replacement runs $550–$1,100. Everything is quoted before work starts.",
      },
      {
        question: "Why did my door come off its tracks?",
        answer:
          "The big three: the door closed onto an obstruction, a vehicle bumped it, or a cable failed and shifted the door's weight to one side. Worn rollers and loose tracks make all three far more likely — which is what an annual service is for.",
      },
      {
        question: "Is an off-track door really that urgent?",
        answer:
          "Yes. The rollers are what hold the door in its guides; with some already out, the remaining ones carry loads they weren't designed for, and the door can drop. Treat it like a car with a wheel half off — stop using it now.",
      },
      {
        question: "Will the door need new parts?",
        answer:
          "Often just re-seating and adjustment. If rollers are worn, tracks are kinked, or a cable triggered the failure, we replace those on the spot — our vans carry the common sizes, so it's still usually a single visit.",
      },
    ],
    updatedAt: "2026-07-09",
    heroImage: "https://jadara-hub.b-cdn.net/capital-garage-door/gallery/garage-door-off-track-repair-perth.webp",
  },

  {
    slug: "noisy-garage-door",
    name: "Noisy Garage Door",
    h1: "Noisy Garage Door?",
    heroSubtitle:
      "Squealing, grinding, rattling or banging — each noise points to a different part. Most are cheap to fix now and expensive to ignore.",
    metaTitle: "Noisy Garage Door? Causes & Fixes | Perth",
    metaDescription:
      "Grinding, squeaking or banging garage door? What each noise means — rollers, springs, chain drive — the fixes, and when a $140 service solves it for good.",
    directAnswer:
      "Garage door noises are diagnostic: squealing usually means dry rollers or hinges, grinding points to worn rollers or a straining opener, rattling to loose hardware, and a single loud bang to a snapped spring. Most noise is cured by a professional service — lubrication, re-tensioning and hardware tightening from $140 plus parts — while a bang or scraping noise needs a repair visit before something lets go completely.",
    causes: [
      {
        icon: "Disc3",
        title: "Dry or worn rollers",
        description:
          "Squealing and grinding as the door moves usually starts at the rollers — dry bearings first, worn wheels next.",
      },
      {
        icon: "Wrench",
        title: "Loose hardware",
        description:
          "Hundreds of open-close cycles vibrate hinges, brackets and track bolts loose — that's the rattle you hear.",
      },
      {
        icon: "Settings",
        title: "Springs needing attention",
        description:
          "Groaning or popping springs are dry or fatigued; one loud bang means one has already snapped.",
      },
      {
        icon: "Cpu",
        title: "Chain-drive opener wear",
        description:
          "A slapping or clattering chain needs tension and lubrication — or the quieter fix, a belt-drive replacement.",
      },
      {
        icon: "Scale",
        title: "Door out of balance",
        description:
          "An unbalanced door makes the opener labour loudly and wears every other component faster.",
      },
      {
        icon: "Move",
        title: "Track misalignment",
        description:
          "Rubbing or scraping along the door's travel means rollers are binding against a track that's out of line.",
      },
    ],
    safeChecks: [
      "Note when the noise happens — opening, closing, or at one spot in the travel",
      "Look for obviously loose bolts on hinges and track brackets (look, don't re-torque the ones near cables)",
      "Check whether the noise follows the door (rollers/hinges) or stays at the motor (opener)",
      "If you hear one loud bang, stop — treat it as a broken spring and don't operate the door",
    ],
    doNotDo: [
      "Do not lubricate the tracks themselves — grease in the track makes rollers slide and bind, not roll",
      "Do not adjust spring tension or any bolt attached to the spring system",
      "Do not ignore a bang, scrape or grind that's getting worse — that's a part about to fail",
    ],
    callTechnicianSigns: [
      "A single loud bang came from the garage",
      "Grinding continues after the rollers have been lubricated",
      "The opener strains or the door hesitates during travel",
      "Scraping at the same point every cycle",
      "The door is loud enough to hear from inside the house and getting worse",
    ],
    relatedServices: [
      { slug: "garage-door-maintenance", label: "Garage Door Servicing & Maintenance" },
      { slug: "garage-door-repair", label: "Garage Door Repairs Perth" },
      { slug: "garage-door-opener-repair", label: "Garage Door Opener Repair Perth" },
      { slug: "spring-repair", label: "Garage Door Spring Repair" },
    ],
    costRows: [
      { scenario: "Service / tune-up", priceRange: "From $140 + parts", note: "Lubricate, re-tension, tighten — fixes most noise" },
      { scenario: "Hinges & rollers / wheels", priceRange: "$30 each + $140 call-out", note: "Nylon rollers are the quiet upgrade" },
      { scenario: "Spring re-fit / re-tension", priceRange: "$280–$330", note: "For groaning, popping or unbalanced springs" },
      { scenario: "Motor / opener repair", priceRange: "$380–$490", note: "Chain tension, drive gear and motor noise" },
    ],
    emergency: {
      heading: "Heard a bang and now the door won't lift?",
      body: "That's the sound of a spring letting go — don't force the door. We replace springs across Perth, usually same-day.",
    },
    faqs: [
      {
        question: "Why is my garage door so noisy?",
        answer:
          "Match the sound to the source: squealing is dry rollers or hinges, grinding is worn rollers or a straining opener, rattling is loose hardware, chain-slap is the opener drive, and one loud bang is a snapped spring. Age and missed servicing sit behind most of them.",
      },
      {
        question: "Can I lubricate the door myself?",
        answer:
          "Lightly, yes — a garage-door lubricant (not general-purpose grease) on roller bearings, hinges and the spring surface helps. Never lubricate inside the tracks: rollers need to roll, not slide. If noise returns within weeks, parts are worn and lubricant is only masking it.",
      },
      {
        question: "How much does it cost to quieten a garage door?",
        answer:
          "A professional service from $140 plus parts cures most noisy doors — it covers lubrication, re-tensioning, balance and tightening every fixing. Worn rollers add $30 each. If the noise is the opener itself, repairs run $380–$490, or a quiet belt-drive replacement is $770–$990.",
      },
      {
        question: "Is a noisy door actually a problem, or just annoying?",
        answer:
          "Noise is wear announcing itself. Dry rollers become worn rollers, loose bolts become misaligned tracks, and straining openers burn out early. A service now is almost always cheaper than the repair the noise eventually turns into.",
      },
      {
        question: "What's the quietest garage door setup?",
        answer:
          "A well-balanced sectional door on nylon rollers, driven by a belt-drive opener. If your bedroom sits over the garage, that combination — plus an annual service — is the difference between hearing the door and not.",
      },
    ],
    updatedAt: "2026-07-09",
    heroImage: "https://jadara-hub.b-cdn.net/capital-garage-door/gallery/garage-door-spring-repair-perth.webp",
  },

  {
    slug: "garage-door-wont-close",
    name: "Garage Door Won't Close",
    h1: "Garage Door Won't Close?",
    heroSubtitle:
      "A door that reverses, stops short, or refuses to seal leaves your home open. It's usually the sensors — and usually fixable fast.",
    metaTitle: "Garage Door Won't Close? Causes & Fixes | Perth",
    metaDescription:
      "Garage door won't close or reverses back up? Sensor, track and limit issues explained — what's safe to check yourself, plus Perth repair costs. Same-day help.",
    directAnswer:
      "When a garage door won't close, the safety sensors are the prime suspect: if the two photo eyes near the floor are blocked, dirty or knocked out of alignment, the door refuses to close or reverses immediately — that's them doing their job. Other causes include drifted opener limits, an obstruction in the tracks, and cable or spring faults. Sensor repairs run $150–$300 in Perth; a door that won't secure your home overnight is worth an emergency call.",
    causes: [
      {
        icon: "ScanEye",
        title: "Safety sensors blocked or misaligned",
        description:
          "The photo eyes near the floor must see each other. A bin, cobweb, dirt or a knocked bracket stops the door closing.",
      },
      {
        icon: "Zap",
        title: "Sunlight on a sensor",
        description:
          "Low afternoon sun shining straight into one photo eye can blind it — a classic west-facing Perth garage problem.",
      },
      {
        icon: "Cpu",
        title: "Travel limits drifted",
        description:
          "If the opener thinks 'closed' is higher than the floor, the door stops short or touches down and reverses.",
      },
      {
        icon: "TrafficCone",
        title: "Obstruction in the track or under the door",
        description:
          "The door reverses when it meets resistance — check the tracks and the floor line for anything in the way.",
      },
      {
        icon: "Cable",
        title: "Cable or spring fault",
        description:
          "A slack cable or tired spring changes the force profile mid-travel, tripping the opener's safety reverse.",
      },
      {
        icon: "Settings",
        title: "Worn rollers binding",
        description:
          "Rollers that bind on the way down read as an obstruction to the opener, which stops and lifts the door again.",
      },
    ],
    safeChecks: [
      "Clear and clean both safety sensors near the floor and check their brackets point at each other",
      "Check the sensor indicator lights — most show solid when aligned, blinking when blocked",
      "Remove anything on the floor line or in the tracks",
      "Hold the wall button down — many openers force-close past a sensor fault while the button is held, confirming the sensors are the cause",
    ],
    doNotDo: [
      "Do not disconnect or bypass the safety sensors so the door will close — they're what stops the door closing on a person or pet",
      "Do not force the door down with the manual release if it resists",
      "Do not adjust the opener's force settings to push through an unknown obstruction",
    ],
    callTechnicianSigns: [
      "The sensors are clean and aligned but the door still reverses",
      "The door stops at a different height each time",
      "It closes fully only when you hold the wall button",
      "The door slams the last stretch or bounces off the floor",
      "A cable looks slack or the door sits crooked",
      "You need the door secured tonight and it won't close at all",
    ],
    relatedServices: [
      { slug: "garage-door-repair", label: "Garage Door Repairs Perth" },
      { slug: "emergency-garage-door-service", label: "Emergency Garage Door Repairs" },
      { slug: "garage-door-opener-repair", label: "Garage Door Opener Repair Perth" },
      { slug: "garage-door-maintenance", label: "Garage Door Servicing & Maintenance" },
    ],
    costRows: [
      { scenario: "Safety sensors / photo eyes", priceRange: "$150–$300", note: "Realign, rewire or replace the photo eyes" },
      { scenario: "Door off track / stuck", priceRange: "$440–$770", note: "If binding in the tracks is tripping the reverse" },
      { scenario: "Cable snapped or off the drum", priceRange: "$280–$550", note: "Slack cables change the door's closing force" },
      { scenario: "Service / tune-up", priceRange: "From $140 + parts", note: "Limits, balance and travel reset properly" },
      { scenario: "After-hours emergency call-out", priceRange: "+$500", note: "For a door that won't secure overnight" },
    ],
    emergency: {
      heading: "Door won't close and you're heading to bed?",
      body: "An open garage is an open house. Our emergency team can secure the door tonight and fix the cause — 24/7 across Perth.",
    },
    faqs: [
      {
        question: "Why does my garage door start closing then go back up?",
        answer:
          "That's the safety reverse. Either the photo-eye sensors lost sight of each other mid-travel, or the door met resistance — an obstruction, binding rollers, or a force/limit setting that's drifted. Clean and align the sensors first; if it still reverses, the mechanics need checking.",
      },
      {
        question: "How do I check my garage door sensors?",
        answer:
          "Look for the two small photo eyes about 10–15 cm off the floor on each side. Clear anything between them, wipe the lenses, and check both indicator lights are solid (not blinking). If a bracket is bent out of line, a gentle nudge back can restore alignment — beyond that, leave the wiring to a technician.",
      },
      {
        question: "Can I bypass the sensors to force the door closed?",
        answer:
          "Don't. The sensors are the legally-required safety system that stops the door closing on a child, pet or car. Holding the wall button to close the door once is a diagnostic; wiring the sensors out permanently is how doors injure people. Fix the sensors — it's a $150–$300 job.",
      },
      {
        question: "The door closes but won't seal against the floor — why?",
        answer:
          "Usually the closed travel limit has drifted, the floor threshold or weather seal has worn, or the door has settled out of level. A service visit resets the limits and checks the seal; a new weather seal is $280–$480 if yours has perished.",
      },
      {
        question: "Is a door that won't close an emergency?",
        answer:
          "If it's stuck open, yes — your home, car and tools are exposed. That's exactly what our 24/7 emergency service is for: we secure the door first, then repair the cause, with the after-hours surcharge confirmed before anyone is dispatched.",
      },
    ],
    updatedAt: "2026-07-09",
    heroImage: "https://jadara-hub.b-cdn.net/capital-garage-door/gallery/emergency-garage-door-make-safe-perth.webp",
  },
];
