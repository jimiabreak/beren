import type { Metadata } from 'next'
import { sanityFetch } from '@/sanity/lib/live'
import { SITE_SETTINGS_QUERY, HEADER_QUERY, FOOTER_QUERY } from '@/sanity/lib/queries'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ContactContent from './ContactContent'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with us. Find our hours, location, and send us a message.',
}

export default async function ContactPage() {
  const [{ data: settings }, { data: headerData }, { data: footerData }] = await Promise.all([
    sanityFetch({ query: SITE_SETTINGS_QUERY, tags: ['siteSettings'] }),
    sanityFetch({ query: HEADER_QUERY, tags: ['header'] }),
    sanityFetch({ query: FOOTER_QUERY, tags: ['footer'] }),
  ])

  return (
    <>
      <Header siteSettings={settings} megaNavigation={headerData?.megaNavigation} secondaryNavigation={headerData?.secondaryNavigation} cta={headerData?.cta} />
      <main id="main" className="py-16 sm:py-24">
        <ContactContent settings={settings} />
      </main>
      <Footer siteSettings={settings} footerData={footerData} />
    </>
  )
}
