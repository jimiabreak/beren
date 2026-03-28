import type { Metadata } from 'next'
import { sanityFetch } from '@/sanity/lib/live'
import {
  SITE_SETTINGS_QUERY,
  HEADER_QUERY,
  FOOTER_QUERY,
  BLOG_POSTS_QUERY,
  BLOG_POSTS_COUNT_QUERY,
} from '@/sanity/lib/queries'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import BlogPostGrid from '@/components/blog/BlogPostGrid'
import Pagination from '@/components/blog/Pagination'
import JsonLd from '@/components/seo/JsonLd'
import { webPageJsonLd } from '@/lib/structuredData'

const POSTS_PER_PAGE = 12

interface BlogPageProps {
  searchParams: Promise<{ page?: string }>
}

export async function generateMetadata(): Promise<Metadata> {
  const { data: settings } = await sanityFetch({ query: SITE_SETTINGS_QUERY, tags: ['siteSettings'] })
  return {
    title: `Blog — ${settings?.name || 'Blog'}`,
    description: `Latest posts from ${settings?.name || 'our blog'}`,
  }
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const { page } = await searchParams
  const currentPage = Math.max(1, parseInt(page || '1', 10) || 1)
  const start = (currentPage - 1) * POSTS_PER_PAGE
  const end = start + POSTS_PER_PAGE

  const [{ data: settings }, { data: headerData }, { data: footerData }, { data: posts }, { data: totalCount }] =
    await Promise.all([
      sanityFetch({ query: SITE_SETTINGS_QUERY, tags: ['siteSettings'] }),
      sanityFetch({ query: HEADER_QUERY, tags: ['header'] }),
      sanityFetch({ query: FOOTER_QUERY, tags: ['footer'] }),
      sanityFetch({ query: BLOG_POSTS_QUERY, params: { start, end }, tags: ['blogPosts'] }),
      sanityFetch({ query: BLOG_POSTS_COUNT_QUERY, tags: ['blogPosts'] }),
    ])

  const totalPages = Math.ceil((totalCount || 0) / POSTS_PER_PAGE)

  return (
    <>
      <Header
        siteSettings={settings}
        megaNavigation={headerData?.megaNavigation}
        secondaryNavigation={headerData?.secondaryNavigation}
        cta={headerData?.cta}
      />
      <main id="main">
        <section className="py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="font-serif text-4xl sm:text-5xl font-bold mb-12">Blog</h1>
            <BlogPostGrid posts={posts || []} />
            <Pagination currentPage={currentPage} totalPages={totalPages} basePath="/blog" />
          </div>
        </section>
      </main>
      <Footer siteSettings={settings} footerData={footerData} />
      <JsonLd data={webPageJsonLd('Blog', `Latest posts from ${settings?.name || 'our blog'}`, '/blog')} />
    </>
  )
}
