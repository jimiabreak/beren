import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { sanityFetch } from '@/sanity/lib/live'
import { client } from '@/sanity/lib/client'
import {
  SITE_SETTINGS_QUERY,
  HEADER_QUERY,
  FOOTER_QUERY,
  MODULAR_PAGE_QUERY,
  MODULAR_PAGE_SLUGS_QUERY,
} from '@/sanity/lib/queries'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import SectionRenderer from '@/components/sections/SectionRenderer'
import JsonLd from '@/components/seo/JsonLd'
import { webPageJsonLd } from '@/lib/structuredData'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const { data: page } = await sanityFetch({
    query: MODULAR_PAGE_QUERY,
    params: { slug },
    tags: ['modularPages'],
  })
  if (!page) return {}

  return {
    title: page.seo?.metaTitle || page.title,
    description: page.seo?.metaDescription,
    openGraph: {
      title: page.seo?.metaTitle || page.title,
      description: page.seo?.metaDescription || undefined,
    },
  }
}

export async function generateStaticParams() {
  const pages = await client
    .withConfig({ stega: false })
    .fetch(MODULAR_PAGE_SLUGS_QUERY)
  return (pages || []).map((p: { slug: string }) => ({ slug: p.slug }))
}

export default async function ModularPage({ params }: PageProps) {
  const { slug } = await params
  const [{ data: settings }, { data: headerData }, { data: footerData }, { data: page }] = await Promise.all([
    sanityFetch({ query: SITE_SETTINGS_QUERY, tags: ['siteSettings'] }),
    sanityFetch({ query: HEADER_QUERY, tags: ['header'] }),
    sanityFetch({ query: FOOTER_QUERY, tags: ['footer'] }),
    sanityFetch({ query: MODULAR_PAGE_QUERY, params: { slug }, tags: ['modularPages'] }),
  ])

  if (!page) notFound()

  return (
    <>
      <Header siteSettings={settings} megaNavigation={headerData?.megaNavigation} secondaryNavigation={headerData?.secondaryNavigation} cta={headerData?.cta} />
      <main id="main">
        <SectionRenderer sections={page.sections} />
      </main>
      <Footer siteSettings={settings} footerData={footerData} />
      <JsonLd data={webPageJsonLd(page.title, page.seo?.metaDescription || undefined, `/${slug}`)} />
    </>
  )
}
