import type { Metadata } from "next";

import { draftMode } from "next/headers";
import { SanityLive } from "@/sanity/lib/live";
import { sanityFetch } from "@/sanity/lib/live";
import { SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";
import VisualEditing from "@/components/sanity/VisualEditing";
import { VisualEditingProvider } from "@/components/sanity/VisualEditingContext";
import MotionProvider from "@/components/MotionProvider";
import PageTransition from "@/components/animations/PageTransition";
import JsonLd from "@/components/seo/JsonLd";
import { organizationJsonLd, webSiteJsonLd } from "@/lib/structuredData";
import { PROMO_BANNER_QUERY } from "@/sanity/lib/queries";
import PromoBanner from "@/components/ui/PromoBanner";

import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import "../globals.css";


export const metadata: Metadata = {
  title: {
    default: "BEREN — A Taste of Turkey in Texas",
    template: "%s | BEREN Meze & Grill House",
  },
  description: "Authentic Turkish & Mediterranean cuisine in Fort Worth, Texas. Experience vibrant meze spreads, sizzling kebabs, fresh grills, and traditional desserts at BEREN Meze & Grill House.",
  keywords: ["Turkish restaurant", "Mediterranean food", "Fort Worth", "Texas", "kebab", "meze", "baklava", "Turkish cuisine", "BEREN"],
  authors: [{ name: "BEREN Meze & Grill House" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "BEREN Meze & Grill House",
    title: "BEREN — A Taste of Turkey in Texas",
    description: "Authentic Turkish & Mediterranean cuisine in Fort Worth, Texas. Vibrant meze spreads, sizzling kebabs, and traditional desserts.",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://berentexas.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "BEREN — A Taste of Turkey in Texas",
    description: "Authentic Turkish & Mediterranean cuisine in Fort Worth, Texas.",
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://berentexas.com"),
};

const isSanityConfigured = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID && process.env.NEXT_PUBLIC_SANITY_PROJECT_ID !== 'placeholder'

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let settings = null
  let banner = null

  if (isSanityConfigured) {
    try {
      const [s, b] = await Promise.all([
        sanityFetch({ query: SITE_SETTINGS_QUERY, tags: ['siteSettings'] }),
        sanityFetch({ query: PROMO_BANNER_QUERY, tags: ['promoBanner'] }),
      ])
      settings = s.data
      banner = b.data
    } catch {
      // Sanity unavailable — continue without CMS data
    }
  }

  return (
    <html lang="en">
      <body className="font-sans antialiased bg-background text-foreground max-w-[1440px] mx-auto">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:bg-foreground focus:text-background focus:px-4 focus:py-2 focus:text-sm focus:uppercase focus:tracking-wider"
        >
          Skip to content
        </a>
        {banner && (
          <PromoBanner
            id={banner._id}
            message={banner.message}
            ctaText={banner.ctaText}
            ctaUrl={banner.ctaUrl}
            backgroundColor={banner.backgroundColor}
            textColor={banner.textColor}
            dismissible={banner.dismissible}
            position={banner.position}
          />
        )}
        <VisualEditingProvider enabled={(await draftMode()).isEnabled}>
          <MotionProvider>
            <PageTransition>{children}</PageTransition>
          </MotionProvider>
        </VisualEditingProvider>
        {isSanityConfigured && <SanityLive />}
        {(await draftMode()).isEnabled && <VisualEditing />}

        <GoogleAnalytics />
        {settings && (
          <>
            <JsonLd data={organizationJsonLd(settings)} />
            <JsonLd data={webSiteJsonLd(settings)} />
          </>
        )}
      </body>
    </html>
  );
}
