import type { Metadata } from 'next'
import { sanityFetch } from '@/sanity/lib/live'
import { SITE_SETTINGS_QUERY, HEADER_QUERY, FOOTER_QUERY, CONTACT_PAGE_QUERY } from '@/sanity/lib/queries'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import JsonLd from '@/components/seo/JsonLd'
import { webPageJsonLd } from '@/lib/structuredData'
import ContactContent from './ContactContent'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://berentexas.com'

export const metadata: Metadata = {
  title: 'Get In Touch',
  description: 'Contact BEREN Meze & Grill House — send us a message, find our location, parking, and hours in Fort Worth, Texas.',
  alternates: { canonical: `${siteUrl}/contact` },
  openGraph: {
    title: 'Get In Touch | BEREN Meze & Grill House',
    description: 'Contact BEREN Meze & Grill House — send us a message, find our location, parking, and hours in Fort Worth, Texas.',
    url: `${siteUrl}/contact`,
  },
}

export default async function ContactPage() {
  const [{ data: settings }, { data: headerData }, { data: footerData }, { data: pageData }] = await Promise.all([
    sanityFetch({ query: SITE_SETTINGS_QUERY, tags: ['siteSettings'] }),
    sanityFetch({ query: HEADER_QUERY, tags: ['header'] }),
    sanityFetch({ query: FOOTER_QUERY, tags: ['footer'] }),
    sanityFetch({ query: CONTACT_PAGE_QUERY, tags: ['contactPage'] }),
  ])

  return (
    <>
      <Header siteSettings={settings} cta={headerData?.cta} />
      <main id="main">
        <ContactContent pageData={pageData} />
      </main>
      <Footer siteSettings={settings} footerData={footerData} />
      <JsonLd data={webPageJsonLd('Get In Touch', 'Contact BEREN Meze & Grill House in Fort Worth, Texas.', '/contact')} />
    </>
  )
}
