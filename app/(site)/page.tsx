import type { Metadata } from 'next'
import { sanityFetch } from '@/sanity/lib/live'
import { SITE_SETTINGS_QUERY, HEADER_QUERY, FOOTER_QUERY, HOME_PAGE_QUERY } from '@/sanity/lib/queries'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import SectionRenderer from '@/components/sections/SectionRenderer'
import JsonLd from '@/components/seo/JsonLd'
import { webPageJsonLd } from '@/lib/structuredData'

export async function generateMetadata(): Promise<Metadata> {
  const { data: page } = await sanityFetch({ query: HOME_PAGE_QUERY, tags: ['homePage'] })
  return {
    title: page?.seo?.metaTitle || 'Home',
    description: page?.seo?.metaDescription || undefined,
    openGraph: {
      title: page?.seo?.metaTitle || 'Home',
      description: page?.seo?.metaDescription || undefined,
    },
  }
}

export default async function HomePage() {
  const [{ data: settings }, { data: headerData }, { data: footerData }, { data: page }] = await Promise.all([
    sanityFetch({ query: SITE_SETTINGS_QUERY, tags: ['siteSettings'] }),
    sanityFetch({ query: HEADER_QUERY, tags: ['header'] }),
    sanityFetch({ query: FOOTER_QUERY, tags: ['footer'] }),
    sanityFetch({ query: HOME_PAGE_QUERY, tags: ['homePage'] }),
  ])

  return (
    <>
      <Header siteSettings={settings} cta={headerData?.cta} />
      <main id="main">
        <SectionRenderer sections={page?.sections} />
      </main>
      <Footer siteSettings={settings} footerData={footerData} />
      <JsonLd data={webPageJsonLd('Home', page?.seo?.metaDescription || undefined, '/')} />
    </>
  )
}
