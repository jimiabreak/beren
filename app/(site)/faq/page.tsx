import type { Metadata } from 'next'
import { toPlainText } from '@portabletext/toolkit'
import { sanityFetch } from '@/sanity/lib/live'
import { SITE_SETTINGS_QUERY, HEADER_QUERY, FOOTER_QUERY, FAQ_QUERY } from '@/sanity/lib/queries'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Container from '@/components/layout/Container'
import FAQContent from './FAQContent'
import JsonLd from '@/components/seo/JsonLd'
import { faqPageJsonLd } from '@/lib/structuredData'

export const metadata: Metadata = {
  title: 'FAQ',
  description: 'Frequently asked questions about our business, services, and policies.',
}

export default async function FAQPage() {
  const [{ data: settings }, { data: headerData }, { data: footerData }, { data: faqs }] = await Promise.all([
    sanityFetch({ query: SITE_SETTINGS_QUERY, tags: ['siteSettings'] }),
    sanityFetch({ query: HEADER_QUERY, tags: ['header'] }),
    sanityFetch({ query: FOOTER_QUERY, tags: ['footer'] }),
    sanityFetch({ query: FAQ_QUERY, tags: ['faq'] }),
  ])

  const faqJsonLd = faqPageJsonLd(
    (faqs || []).map((faq: { question: string; answer: unknown }) => ({
      question: faq.question,
      answer: Array.isArray(faq.answer) ? toPlainText(faq.answer as never) : String(faq.answer || ''),
    }))
  )

  return (
    <>
      <Header siteSettings={settings} cta={headerData?.cta} />
      <main id="main" className="py-16 sm:py-24">
        <Container>
          <h1 className="font-serif text-4xl sm:text-5xl text-center mb-12">
            Frequently Asked Questions
          </h1>
          <FAQContent faqs={faqs || []} />
        </Container>
      </main>
      <Footer siteSettings={settings} footerData={footerData} />
      <JsonLd data={faqJsonLd} />
    </>
  )
}
