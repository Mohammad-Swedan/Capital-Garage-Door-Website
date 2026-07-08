export const siteConfig = {
  name: "Capital Garage Door",
  shortName: "Capital Garage Door",
  tagline: "Trusted Garage Door Repair & Installation",
  description:
    "Capital Garage Door provides professional garage door repair, installation, and maintenance services. Licensed, insured, and available for same-day service.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://capitalgaragedoors.com.au",
  ogImage: "/images/og/default.jpg",
  locale: "en_AU",
  // GA4 measurement ID — rendered once in app/layout.tsx (production only),
  // which covers every route including CMS-created pages.
  googleAnalyticsId: "G-9FTLPLVPL0",

  business: {
    // Registered trading name. IMPORTANT: no invented corporate suffix here —
    // "LLC" is a US designation and was flagged in an SEO/trust audit. If the
    // registered entity is e.g. "... Pty Ltd", set it here and it flows to the
    // footer © line and all JSON-LD `legalName` fields.
    legalName: "Capital Garage Door",
    // Australian Business Number — displayed in the footer and emitted as
    // schema.org `taxID` once filled in (TODO: set the real ABN; "Licensed &
    // Insured" claims should be backed by a visible ABN/licence number).
    abn: "",
    phone: "+61475333335",
    phoneDisplay: "0475 333 335",
    email: "info@capitalgaragedoors.com.au",
    address: {
      streetAddress: "6 Carnegie Parade", // confirm exact street number/name matches the Google Business Profile
      addressLocality: "Southern River",
      addressRegion: "WA",
      postalCode: "6110",
      addressCountry: "AU",
    },
    geo: {
      // Exact pin from the Capital Garage Doors Google Business listing (Southern River, WA 6110).
      latitude: -32.1285079,
      longitude: 115.9323079,
    },
    priceRange: "$$",
    hours: [
      { day: "Monday", opens: "07:00", closes: "18:00" },
      { day: "Tuesday", opens: "07:00", closes: "18:00" },
      { day: "Wednesday", opens: "07:00", closes: "18:00" },
      { day: "Thursday", opens: "07:00", closes: "18:00" },
      { day: "Friday", opens: "07:00", closes: "18:00" },
      { day: "Saturday", opens: "08:00", closes: "16:00" },
      { day: "Sunday", opens: "08:00", closes: "16:00" },
    ],
  },

  social: {
    facebook: "https://www.facebook.com/p/Capital-Garage-Door-Repairs-61581857974729/",
    instagram: "https://www.instagram.com/capitalgaragedoorperth1",
    youtube: "https://www.youtube.com/@CapitalGarageDoors",
    // One canonical Google Business Profile link format sitewide — the same
    // vanity token content/reviews.ts uses (an audit flagged two different
    // g.page identifiers in play, which fragments the citation signal).
    google: "https://g.page/r/CapitalGarageDoorPerth/review",
    yelp: "",
  },

  nav: [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services" },
    { label: "Motors", href: "/garage-door-motors-perth" },
    { label: "Service Areas", href: "/service-areas" },
    { label: "Price Calculator", href: "/calculator" },
    { label: "Gallery", href: "/gallery" },
    { label: "Blog", href: "/blog" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],

  footerNav: [
    {
      title: "Company",
      links: [
        { label: "About Us", href: "/about" },
        { label: "Reviews", href: "/reviews" },
        { label: "Warranty", href: "/warranty" },
        { label: "Gallery", href: "/gallery" },
        { label: "Contact", href: "/contact" },
      ],
    },
    {
      // Sitewide inlinks for the content hubs — an audit found
      // /roller-door-vs-sectional-door orphaned (0 inlinks) and the problems/
      // case-studies hubs with a single inlink each.
      title: "Resources",
      links: [
        { label: "Blog", href: "/blog" },
        { label: "Cost Guides", href: "/cost-guides" },
        { label: "Common Problems", href: "/problems" },
        { label: "Case Studies", href: "/case-studies" },
        { label: "Roller vs Sectional Doors", href: "/roller-door-vs-sectional-door" },
        { label: "Price Calculator", href: "/calculator" },
      ],
    },
    {
      title: "Services",
      links: [
        { label: "Garage Door Repairs", href: "/garage-door-repairs-perth" },
        { label: "Garage Door Installation", href: "/garage-door-installation-perth" },
        { label: "Roller Door Installation", href: "/roller-door-installation-perth" },
        { label: "Sectional Garage Doors", href: "/sectional-garage-doors-perth" },
        { label: "Opener Repair", href: "/garage-door-opener-repair-perth" },
        { label: "Spring Repair", href: "/garage-door-spring-repair-perth" },
        { label: "Emergency Repairs", href: "/emergency-garage-door-repairs-perth" },
        { label: "Roller Door Repairs", href: "/roller-door-repairs-perth" },
        { label: "Commercial & Industrial Doors", href: "/commercial-garage-doors-perth" },
        { label: "Maintenance", href: "/garage-door-maintenance-perth" },
        { label: "Garage Door Motors", href: "/garage-door-motors-perth" },
        { label: "All Services", href: "/services" },
        { label: "Service Areas", href: "/service-areas" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Terms of Service", href: "/terms" },
      ],
    },
  ],
} as const;

export type SiteConfig = typeof siteConfig;
