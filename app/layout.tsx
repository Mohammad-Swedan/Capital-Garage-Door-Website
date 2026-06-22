import type { Metadata } from "next";
import { Poppins, Open_Sans, Archivo_Black } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ScrollProgress } from "@/components/layout/scroll-progress";
import { GarageDoorLoader } from "@/components/motion/garage-door-loader";
import { LazyMotionProvider } from "@/components/motion/lazy-motion-provider";
import { JsonLd } from "@/components/seo/json-ld";
import { localBusinessSchema } from "@/lib/seo/schema";
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${heading.variable} ${body.variable} ${display.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col overflow-x-hidden">
        <JsonLd data={localBusinessSchema()} />
        {/* Hide the welcome intro before first paint if it has already played this session. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{if(sessionStorage.getItem('cgd:welcomed'))document.documentElement.classList.add('intro-seen')}catch(e){}",
          }}
        />
        <GarageDoorLoader />
        <LazyMotionProvider>
          <ScrollProgress />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </LazyMotionProvider>
      </body>
    </html>
  );
}
