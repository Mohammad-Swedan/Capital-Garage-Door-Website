import type { Article } from "@/types/article";

/**
 * /blog/how-to-fix-garage-door-sensor — help-hub post #4 (2026-08).
 *
 * Targets "how to fix garage door sensor" — 1,300/mo at KD 0 (!) in the
 * Semrush pull, the single cheapest high-volume question in the niche.
 * Funnels to opener repair; sensor price ($150–$300) is the pricing-data.ts
 * "Safety sensors / photo eyes" catalog range.
 */
export const howToFixGarageDoorSensor: Article = {
  title: "How to Fix a Garage Door Sensor (Door Won't Close?)",
  slug: "how-to-fix-garage-door-sensor",
  category: "Motors & Remotes",
  excerpt:
    "A garage door that won't close — or closes only while you hold the wall button — is almost always a safety sensor problem. How the photo eyes work, the five-minute fixes, and when a sensor genuinely needs replacing.",
  author: "Capital Garage Doors Team",
  authorTitle: "Licensed garage door technicians, Perth WA",
  authorBio:
    "Our technicians repair garage door openers and safety systems across Perth every day — and sensor faults are the most common 'broken door' that turns out to be a five-minute fix.",
  publishedAt: "2026-08-05",
  updatedAt: "2026-08-05",
  featuredImage:
    "https://jadara-hub.b-cdn.net/capital-garage-door/gallery/garage-door-motor-replacement-kardinya-perth.webp",
  featuredImageAlt: "Technician checking a garage door opener and its safety sensors during a repair in Perth",
  shortAnswer:
    "Garage door safety sensors are the two small photo eyes near the floor on each side of the opening — one sends an infrared beam, the other receives it, and if the beam is broken or misaligned the opener refuses to close the door. Nine times out of ten the fix is one of three things: clean the lenses (dust, webs, garden spray), realign the brackets until both indicator LEDs are solid, or clear whatever is blocking the beam — including afternoon sun shining straight into a lens. If the LEDs stay dark or flickering after that, check the low-voltage wiring back to the motor; an actually-failed sensor pair costs around $150–$300 replaced.",
  contentBlocks: [
    {
      type: "paragraph",
      text: "The door opens fine, but pressing close makes it start down, stop, and travel back up — usually with the opener's light flashing. Or it won't close at all unless you hold the wall button down. Both symptoms point at the same place: the safety sensors. They're the most-blamed and least-understood part on a garage door, and most 'failed' sensors are dirty, nudged or sun-struck rather than broken. Work through this in order and there's a good chance the door is closing normally in five minutes.",
    },
    { type: "heading", level: 2, text: "How the sensors work", id: "how-sensors-work" },
    {
      type: "paragraph",
      text: "Look at the bottom of your door's tracks, about 10–15 cm off the floor: a small box on each side, facing each other. One projects an invisible infrared beam; the other receives it. While the beam arrives, the opener knows the doorway is clear and will drive the door closed. Break the beam — a child, a pet, a bike wheel — and a closing door stops and reverses. That's the safety system doing its job, mandated on modern openers for good reason. Holding the wall button down bypasses the sensors on most models, which is why that works when the remote doesn't — useful for diagnosis, not a way to live.",
    },
    { type: "heading", level: 2, text: "Fix 1: Clean the lenses", id: "clean-the-lenses" },
    {
      type: "paragraph",
      text: "Perth's dust, spider webs, sprinkler over-spray and lawn clippings all end up on sensor lenses. Wipe both lenses with a soft dry cloth (a slightly damp one for grime, then dry). Check for webs behind and around the brackets too — a strand across a lens is enough. This alone resolves a remarkable share of sensor calls.",
    },
    { type: "heading", level: 2, text: "Fix 2: Check the indicator LEDs and realign", id: "realign" },
    {
      type: "list",
      ordered: true,
      items: [
        "Each sensor has a small LED. In a healthy pair, both are solidly lit (colours vary by brand — commonly one green, one amber/red).",
        "A dark or flickering receiver LED means the beam isn't landing. Sensors live at bumper-and-broom height, so brackets get knocked constantly.",
        "Loosen the wing nut or screw, aim the sensor squarely at its partner, and watch for the LED to go solid. Tighten gently — over-tightening twists the bracket off aim again.",
        "Confirm both LEDs solid, then test a normal close from the remote.",
      ],
    },
    {
      type: "callout",
      variant: "tip",
      title: "West-facing garage? Blame the sun",
      body: "Low afternoon sun shining directly into a receiver lens can drown the infrared beam — the classic Perth pattern is a door that refuses to close on summer evenings but behaves by morning. A sun shield (or swapping which side the receiver sits) fixes it permanently.",
    },
    { type: "heading", level: 2, text: "Fix 3: Check the wiring", id: "check-wiring" },
    {
      type: "paragraph",
      text: "Sensor wires are thin low-voltage cable running from each sensor up to the motor — stapled along the wall and ceiling, exactly where brooms, rakes and stacked boxes catch them. Look for a pulled-out staple, a nicked wire, or a loose terminal at the powerhead, and check where the wire kinks behind the sensor bracket. If one LED is dead and cleaning/realignment changed nothing, damaged wiring is the next most likely culprit — repairable, but at that point most people prefer a technician with a meter.",
    },
    { type: "heading", level: 2, text: "When the sensor really has failed", id: "when-failed" },
    {
      type: "paragraph",
      text: "Photo eyes do die — electronics age, coastal salt corrodes boards, and sun-baked housings crack. The tell: LEDs that stay dark or flicker with clean, aligned lenses and intact wiring, or a door that reverses intermittently at random (not at one repeatable spot — that's a track or force-setting problem instead). Replacement is quick and inexpensive as garage door repairs go: around $150–$300 fitted for a new pair, matched to your opener brand. We carry common pairs on the van, so it's [a same-visit fix](/garage-door-opener-repair-perth).",
    },
    {
      type: "callout",
      variant: "warning",
      title: "Don't bypass the sensors",
      body: "Online forums are full of instructions for jumping the sensor terminals so the door closes without them. That removes the one system standing between a closing door and a child, pet or car boot. If the sensors are faulty, fix or replace them — a working pair costs less than a panel repair, let alone what the bypass risks.",
    },
    {
      type: "paragraph",
      text: "Still stuck? If the LEDs are solid and the door still won't close, the fault has moved up the chain — force limits, logic board or a binding door. Our [common problems guide](/blog/common-garage-door-problems-and-fixes) covers the wider diagnosis, or [book a repair](/garage-door-repairs-perth) and we'll sort it on-site.",
    },
  ],
  expertTips: [
    {
      kind: "maintenance",
      title: "Add sensors to your yearly once-over",
      body: "Wipe the lenses and glance at both LEDs whenever you service the door (or we do). Ten seconds of cloth on lens prevents the most common closing fault there is.",
    },
    {
      kind: "technician",
      title: "One repeatable spot vs random reversing",
      body: "A door that reverses at the same point every time has a mechanical obstruction or track issue at that point. Random reversing at different heights is sensors or force settings. Telling us which one you have gets the right parts on the van.",
    },
  ],
  relatedServices: [
    {
      label: "Garage Door Opener Repair Perth",
      href: "/garage-door-opener-repair-perth",
      description: "Sensors, receivers, boards and motors — diagnosed and fixed.",
      icon: "Wrench",
    },
    {
      label: "Garage Door Repairs Perth",
      href: "/garage-door-repairs-perth",
      description: "The full repair service, same-day across Perth.",
      icon: "Hammer",
    },
    {
      label: "Garage Door Won't Close?",
      href: "/problems/garage-door-wont-close",
      description: "All the reasons a door refuses to close, in one place.",
      icon: "HelpCircle",
    },
  ],
  relatedArticles: [
    {
      slug: "how-to-reset-a-garage-door-opener-and-remote",
      title: "How to Reset a Garage Door Opener & Remote",
    },
    {
      slug: "common-garage-door-problems-and-fixes",
      title: "Common Garage Door Problems and Fixes",
    },
  ],
  faqs: [
    {
      question: "How do I know if my garage door sensors are misaligned?",
      answer:
        "Check the LEDs on both sensors: in a healthy pair both glow solidly. A dark or flickering light on the receiving sensor means the beam isn't landing on it — realign the bracket until the LED goes solid. A door that starts closing then reverses, with the opener light flashing, is the classic misalignment symptom.",
    },
    {
      question: "Why does my garage door only close when I hold the wall button?",
      answer:
        "Holding the wall button overrides the safety sensors on most openers, so if that's the only way the door closes, the sensor circuit is interrupted — dirty or misaligned lenses, a blocked beam, damaged wiring, or a failed sensor. Work through cleaning, realignment and wiring in that order; it's the sensor system in some form almost every time.",
    },
    {
      question: "Can I bypass my garage door sensors?",
      answer:
        "You shouldn't. The sensors are the system that stops a closing door meeting a child, pet or car — bypassing them (jumping the terminals) removes that protection and, on many modern openers, isn't accepted by the logic board anyway. A replacement sensor pair is around $150–$300 fitted; it isn't worth the risk to save that.",
    },
    {
      question: "How much does it cost to replace garage door sensors in Perth?",
      answer:
        "Around $150–$300 for a new pair supplied and fitted, matched to your opener brand — from our own price list. It's one of the cheaper garage door repairs, usually completed in a single short visit since common pairs are carried on the van.",
    },
    {
      question: "Why does my garage door close fine in the morning but not in the afternoon?",
      answer:
        "That daily pattern is almost always sun-strike: low afternoon sun shining directly into a west-facing receiver lens overwhelms the infrared beam, and the opener treats it as an obstruction. A sun shield over the receiver, or swapping the sender and receiver sides, cures it permanently.",
    },
  ],
  seo: {
    title: "How to Fix a Garage Door Sensor: Door Won't Close Guide",
    description:
      "Garage door won't close? Clean, realign and test the safety sensors in minutes — plus wiring checks, the sun-strike fix, and replacement costs in Perth.",
  },
};
