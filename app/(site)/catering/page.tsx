import type { Metadata } from 'next'
import { sanityFetch } from '@/sanity/lib/live'
import { SITE_SETTINGS_QUERY, HEADER_QUERY, FOOTER_QUERY } from '@/sanity/lib/queries'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import JsonLd from '@/components/seo/JsonLd'
import { webPageJsonLd } from '@/lib/structuredData'
import CateringContent from '@/components/catering/CateringContent'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://berentexas.com'

export const metadata: Metadata = {
  title: 'Catering',
  description: 'Unique catering experiences by BEREN — Turkish cuisine for weddings, private gatherings, engagement celebrations, and cultural occasions in Fort Worth, Texas.',
  alternates: { canonical: `${siteUrl}/catering` },
  openGraph: {
    title: 'Catering | BEREN Meze & Grill House',
    description: 'Unique catering experiences by BEREN — Turkish cuisine for weddings, private gatherings, and cultural occasions in Fort Worth, Texas.',
    url: `${siteUrl}/catering`,
  },
}

export default async function CateringPage() {
  const [{ data: settings }, { data: headerData }, { data: footerData }] = await Promise.all([
    sanityFetch({ query: SITE_SETTINGS_QUERY, tags: ['siteSettings'] }),
    sanityFetch({ query: HEADER_QUERY, tags: ['header'] }),
    sanityFetch({ query: FOOTER_QUERY, tags: ['footer'] }),
  ])

  return (
    <>
      <Header siteSettings={settings} cta={headerData?.cta} />
      <main id="main">
        <CateringContent />
      </main>
      <Footer siteSettings={settings} footerData={footerData} />
      <JsonLd data={webPageJsonLd('Catering', 'Unique catering experiences by BEREN — Turkish cuisine for weddings, private gatherings, and cultural occasions.', '/catering')} />
    </>
  )
}
