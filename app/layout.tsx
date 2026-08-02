import type { Metadata } from "next";
import { DeferredGoogleAnalytics, DeferredMicrosoftClarity } from "@/components/analytics/deferred-analytics";
import { InteractionTracking } from "@/components/analytics/interaction-tracking";
import { Poppins, Open_Sans, Archivo_Black } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { SiteChrome } from "@/components/layout/site-chrome";
import { LazyMotionProvider } from "@/components/motion/lazy-motion-provider";
import { JsonLd } from "@/components/seo/json-ld";
import { siteGraphSchema } from "@/lib/seo/schema";
import { getReviewsSummary } from "@/lib/data/reviews";
import { siteConfig } from "@/config/site";

const heading = Poppins({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["600", "700"],
});

const body = Open_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const display = Archivo_Black({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    // Home <title>: keyword-first and ≤60 chars (Category 1). The template
    // applies to any page that sets a bare string title; buildMetadata opts out
    // via title.absolute so content pages aren't double-branded past 60 chars.
    default: `Garage Door Repairs Perth | ${siteConfig.name}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  alternates: {
    canonical: siteConfig.url,
  },
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
  },
  // Search-engine site verification. Bing also has public/BingSiteAuth.xml
  // (same token) — either method satisfies its check.
  verification: {
    other: {
      "msvalidate.01": "F65D580A0C2790DBD98822EC527E8365",
    },
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Live review aggregate → embedded in the site-wide business node for ⭐ star
  // rich snippets. This is the SAME figure the /reviews page and any on-page
  // rating widget display (single source of truth — schema and visible numbers
  // must never diverge; Google treats that as a structured-data violation).
  const summary = await getReviewsSummary();

  return (
    <html
      lang="en"
      className={`${heading.variable} ${body.variable} ${display.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col overflow-x-hidden">
        <JsonLd
          data={siteGraphSchema({
            ratingValue: summary.averageRating,
            reviewCount: summary.totalReviews,
          })}
        />
        {/* Before first paint, add `.intro-seen` (which hides the welcome intro and
            skips the page-reveal animation) once it has already played this session
            (`cgd:welcomed`). The intro now plays on the first visit of every session
            on ALL devices, phones included.

            History/tradeoff: the intro used to be skipped on touch / mobile devices
            too, because the closed door covers the hero on first paint and so delayed
            mobile LCP / Core Web Vitals. That mobile gate was intentionally removed
            (product decision) so the brand moment also shows on phones — at a known
            mobile-LCP cost. Re-add a `matchMedia('(pointer:coarse)')` / mobile-UA
            check here to bring the mobile skip back. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{var d=document.documentElement;if(sessionStorage.getItem('cgd:welcomed'))d.classList.add('intro-seen')}catch(e){}",
          }}
        />
        <LazyMotionProvider>
          <SiteChrome header={<Header />} footer={<Footer />}>
            {children}
          </SiteChrome>
        </LazyMotionProvider>
        {/* One delegated listener that tracks every tel:/mailto: click site-wide.
            Renders nothing; mounted outside the production-only analytics gate
            below so the events can be verified in dev. */}
        <InteractionTracking />
      </body>
      {/* gtag.js loads on requestIdleCallback (was afterInteractive) — it was
          the top unused-JS contributor and long-task source on mobile. The
          pageview is queued synchronously so nothing is lost. Production-only
          so dev traffic never pollutes GA. */}
      {process.env.NODE_ENV === "production" && (
        <>
          <DeferredGoogleAnalytics gaId={siteConfig.googleAnalyticsId} />
          <DeferredMicrosoftClarity clarityId={siteConfig.microsoftClarityId} />
        </>
      )}
    </html>
  );
}
