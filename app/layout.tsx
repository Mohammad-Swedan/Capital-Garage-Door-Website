import type { Metadata } from "next";
import { Poppins, Open_Sans, Archivo_Black } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { SiteChrome } from "@/components/layout/site-chrome";
import { LazyMotionProvider } from "@/components/motion/lazy-motion-provider";
import { JsonLd } from "@/components/seo/json-ld";
import { localBusinessSchema, organizationSchema, webSiteSchema } from "@/lib/seo/schema";
import { getReviewsSummary } from "@/lib/data/reviews";
import { getServiceAreaRegions } from "@/lib/data/service-area-regions";
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
    default: `${siteConfig.name} | ${siteConfig.tagline}`,
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
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Live review aggregate → embedded in the site-wide LocalBusiness for ⭐ star rich snippets.
  const summary = await getReviewsSummary();
  // Served-suburb list → site-wide LocalBusiness areaServed (multi-suburb local signal).
  const regions = await getServiceAreaRegions();
  const suburbNames = Array.from(new Set(regions.flatMap((r) => r.suburbs.map((s) => s.name))));

  return (
    <html
      lang="en"
      className={`${heading.variable} ${body.variable} ${display.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col overflow-x-hidden">
        <JsonLd
          data={localBusinessSchema(
            {
              ratingValue: summary.averageRating,
              reviewCount: summary.totalReviews,
            },
            suburbNames,
          )}
        />
        <JsonLd data={organizationSchema()} />
        <JsonLd data={webSiteSchema()} />
        {/* Hide the welcome intro before first paint if it has already played this session. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{if(sessionStorage.getItem('cgd:welcomed'))document.documentElement.classList.add('intro-seen')}catch(e){}",
          }}
        />
        <LazyMotionProvider>
          <SiteChrome header={<Header />} footer={<Footer />}>
            {children}
          </SiteChrome>
        </LazyMotionProvider>
      </body>
    </html>
  );
}
