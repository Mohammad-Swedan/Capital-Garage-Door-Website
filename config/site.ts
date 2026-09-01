import type { NavMenuKey } from "@/config/nav-menus";

export const siteConfig = {
  name: "Capital Garage Doors",
  shortName: "Capital Garage Doors",
  tagline: "Trusted Garage Door Repair & Installation",
  description:
    "Capital Garage Doors provides professional garage door repair, installation, and maintenance services. Licensed, insured, and available for same-day service.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://capitalgaragedoors.com.au",
  ogImage: "/images/og/default.jpg",
  locale: "en_AU",
  // GA4 measurement ID — rendered once in app/layout.tsx (production only),
  // which covers every route including CMS-created pages.
  googleAnalyticsId: "G-9FTLPLVPL0",
  // Microsoft Clarity project ID — session recordings + heatmaps. Loaded the
  // same deferred (requestIdleCallback), production-only way as GA4 so it stays
  // off the hydration/LCP critical path (see components/analytics).
  microsoftClarityId: "xt3rqfr3i5",
  // Google Tag Manager container — reads the plain-object dataLayer pushes that
  // lib/analytics.ts track() has emitted since day one (they were inert until
  // this container existed). Loaded deferred + production-only like GA4.
  googleTagManagerId: "GTM-PLPC3F3L",

  business: {
    // Registered entity name, verified against the ABR (abr.business.gov.au,
    // ABN 86 689 651 643 → "CAPITAL GARAGE DOOR PTY LTD"). Flows to the footer
    // © line and all JSON-LD `legalName` fields.
    legalName: "Capital Garage Door Pty Ltd",
    // Australian Business Number — displayed in the footer and emitted as
    // schema.org `taxID` (digits only there; see lib/seo/schema.ts).
    abn: "86 689 651 643",
    phone: "+61475333335",
    phoneDisplay: "0475 333 335",
    email: "info@capitalgaragedoors.com.au",
    address: {
      // Must match the Google Business Profile EXACTLY — a NAP mismatch between
      // the site and the GBP weakens local/map-pack ranking. Verified against
      // the live GBP on 2026-08-01 ("13 Amrock Street, Southern River WA 6110");
      // the previous value here ("6 Carnegie Parade") did not match.
      streetAddress: "13 Amrock Street",
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
    // One canonical Google Business Profile link sitewide — the verified CID
    // URL (same as content/reviews.ts + the citations pack). The previous
    // g.page vanity token didn't resolve (Semrush broken-link, 2026-08-05).
    google: "https://www.google.com/maps?cid=14180702000236315157",
    yelp: "",
  },

  // 10 items. `menu` opts an item into a header mega-menu — the panel's content
  // lives in config/nav-menus.ts (NAV_MENUS), keyed by this value, never by the
  // label. `Home` is hidden below `xl` in the desktop nav (the logo links home)
  // so the row never wraps at 1024 px — re-measure at 1024/1280 before adding an
  // 11th item.
  nav: [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services", menu: "services" },
    { label: "Doors", href: "/garage-doors-perth", menu: "doors" },
    { label: "Motors", href: "/garage-door-motors-perth", menu: "motors" },
    { label: "Service Areas", href: "/service-areas" },
    { label: "Pricing", href: "/calculator" },
    // Gallery/Blog/About/Warranty/Reviews live in the "More" dropdown (config/nav-menus.ts) —
    // on mobile they render flat. The href below is only a React key for the trigger.
    { label: "More", href: "/about", menu: "more" },
    { label: "Contact", href: "/contact" },
  ] as const satisfies readonly { label: string; href: string; menu?: NavMenuKey }[],

  footerNav: [
    {
      title: "Company",
      links: [
        { label: "About Us", href: "/about" },
        { label: "Reviews", href: "/reviews" },
        { label: "Warranty", href: "/warranty" },
        { label: "Gallery", href: "/gallery" },
        { label: "Get a Quote", href: "/quote" },
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
        { label: "Garage Door Brands", href: "/garage-door-brands-perth" },
        { label: "Motor Brands", href: "/garage-door-motor-brands-perth" },
      ],
    },
    {
      title: "Services",
      links: [
        { label: "Garage Door Repairs", href: "/garage-door-repairs-perth" },
        { label: "Garage Door Installation", href: "/garage-door-installation-perth" },
        { label: "Roller Door Installation", href: "/roller-door-installation-perth" },
        { label: "Sectional Garage Doors", href: "/sectional-garage-doors-perth" },
        { label: "Roller Doors", href: "/roller-doors-perth" },
        { label: "Tilt Garage Doors", href: "/tilt-garage-doors-perth" },
        { label: "Custom Garage Doors", href: "/custom-garage-doors-perth" },
        { label: "Opener Repair", href: "/garage-door-opener-repair-perth" },
        { label: "Spring Repair", href: "/garage-door-spring-repair-perth" },
        { label: "Emergency Repairs", href: "/emergency-garage-door-repairs-perth" },
        { label: "Roller Door Repairs", href: "/roller-door-repairs-perth" },
        { label: "Commercial & Industrial Doors", href: "/commercial-garage-doors-perth" },
        { label: "Commercial Roller Doors", href: "/commercial-roller-doors-perth" },
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
