import type { Metadata } from 'next'
import { sanityFetch } from '@/sanity/lib/live'
import { SITE_SETTINGS_QUERY, HEADER_QUERY, FOOTER_QUERY } from '@/sanity/lib/queries'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import MenuTabs from '@/components/menu/MenuTabs'
import JsonLd from '@/components/seo/JsonLd'
import { webPageJsonLd } from '@/lib/structuredData'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://berentexas.com'

export const metadata: Metadata = {
  title: 'Our Menu',
  description: 'Explore the BEREN menu — authentic Turkish and Mediterranean dishes crafted with locally-sourced ingredients.',
  alternates: { canonical: `${siteUrl}/menu` },
  openGraph: {
    title: 'Our Menu | BEREN Meze & Grill House',
    description: 'Explore the BEREN menu — authentic Turkish and Mediterranean dishes crafted with locally-sourced ingredients.',
    url: `${siteUrl}/menu`,
  },
}

export default async function MenuPage() {
  const [{ data: settings }, { data: headerData }, { data: footerData }] = await Promise.all([
    sanityFetch({ query: SITE_SETTINGS_QUERY, tags: ['siteSettings'] }),
    sanityFetch({ query: HEADER_QUERY, tags: ['header'] }),
    sanityFetch({ query: FOOTER_QUERY, tags: ['footer'] }),
  ])

  return (
    <>
      <Header siteSettings={settings} cta={headerData?.cta} />
      <main id="main" className="pb-16 md:pb-24">
        {/* Page heading */}
        <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-12 md:pt-20 pb-8 md:pb-12 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl tracking-wide text-foreground uppercase">
            Our Menu
          </h1>
        </div>

        {/* Tabs + PDF viewer */}
        <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <MenuTabs />
        </div>
      </main>
      <Footer siteSettings={settings} footerData={footerData} />
      <JsonLd data={webPageJsonLd('Our Menu', 'Explore the BEREN menu', '/menu')} />
    </>
  )
}
