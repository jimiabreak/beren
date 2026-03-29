import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { sanityFetch } from '@/sanity/lib/live'
import { SITE_SETTINGS_QUERY, HEADER_QUERY, FOOTER_QUERY } from '@/sanity/lib/queries'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import JsonLd from '@/components/seo/JsonLd'
import { webPageJsonLd } from '@/lib/structuredData'
import OurStoryContent from '@/components/our-story/OurStoryContent'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://berentexas.com'

export const metadata: Metadata = {
  title: 'Our Story',
  description: 'The story behind BEREN Meze & Grill House — a taste of tradition, authentic Turkish cuisine in Fort Worth, Texas.',
  alternates: { canonical: `${siteUrl}/our-story` },
  openGraph: {
    title: 'Our Story | BEREN Meze & Grill House',
    description: 'The story behind BEREN Meze & Grill House — a taste of tradition, authentic Turkish cuisine in Fort Worth, Texas.',
    url: `${siteUrl}/our-story`,
  },
}

export default async function OurStoryPage() {
  const [{ data: settings }, { data: headerData }, { data: footerData }] = await Promise.all([
    sanityFetch({ query: SITE_SETTINGS_QUERY, tags: ['siteSettings'] }),
    sanityFetch({ query: HEADER_QUERY, tags: ['header'] }),
    sanityFetch({ query: FOOTER_QUERY, tags: ['footer'] }),
  ])

  return (
    <>
      <Header siteSettings={settings} cta={headerData?.cta} />
      <main id="main">
        <OurStoryContent />
      </main>
      <Footer siteSettings={settings} footerData={footerData} />
      <JsonLd data={webPageJsonLd('Our Story', 'The story behind BEREN Meze & Grill House', '/our-story')} />
    </>
  )
}
