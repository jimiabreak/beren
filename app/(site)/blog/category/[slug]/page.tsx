import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { sanityFetch } from '@/sanity/lib/live'
import { client } from '@/sanity/lib/client'
import {
  SITE_SETTINGS_QUERY,
  HEADER_QUERY,
  FOOTER_QUERY,
  CATEGORY_QUERY,
  CATEGORY_SLUGS_QUERY,
  TAGS_BY_CATEGORY_QUERY,
  BLOG_POSTS_BY_CATEGORY_QUERY,
  BLOG_POSTS_BY_CATEGORY_COUNT_QUERY,
} from '@/sanity/lib/queries'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import BlogPostGrid from '@/components/blog/BlogPostGrid'
import Pagination from '@/components/blog/Pagination'
import CategoryFilter from '@/components/blog/CategoryFilter'
import JsonLd from '@/components/seo/JsonLd'
import { webPageJsonLd } from '@/lib/structuredData'

const POSTS_PER_PAGE = 12

interface CategoryPageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ page?: string; tag?: string }>
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params
  const [{ data: category }, { data: settings }] = await Promise.all([
    sanityFetch({ query: CATEGORY_QUERY, params: { slug }, tags: ['categories'] }),
    sanityFetch({ query: SITE_SETTINGS_QUERY, tags: ['siteSettings'] }),
  ])
  if (!category) return {}
  return {
    title: `${category.title} — Blog — ${settings?.name || 'Blog'}`,
    description: category.description || `Posts in ${category.title}`,
  }
}

export async function generateStaticParams() {
  const categories = await client.withConfig({ stega: false }).fetch(CATEGORY_SLUGS_QUERY)
  return (categories || []).map((c: { slug: string }) => ({ slug: c.slug }))
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params
  const { page, tag } = await searchParams
  const currentPage = Math.max(1, parseInt(page || '1', 10) || 1)
  const start = (currentPage - 1) * POSTS_PER_PAGE
  const end = start + POSTS_PER_PAGE
  const tagSlug = tag || ''

  const [
    { data: settings },
    { data: headerData },
    { data: footerData },
    { data: category },
    { data: tags },
    { data: posts },
    { data: totalCount },
  ] = await Promise.all([
    sanityFetch({ query: SITE_SETTINGS_QUERY, tags: ['siteSettings'] }),
    sanityFetch({ query: HEADER_QUERY, tags: ['header'] }),
    sanityFetch({ query: FOOTER_QUERY, tags: ['footer'] }),
    sanityFetch({ query: CATEGORY_QUERY, params: { slug }, tags: ['categories'] }),
    sanityFetch({ query: TAGS_BY_CATEGORY_QUERY, params: { categorySlug: slug }, tags: ['tags'] }),
    sanityFetch({
      query: BLOG_POSTS_BY_CATEGORY_QUERY,
      params: { categorySlug: slug, tagSlug, start, end },
      tags: ['blogPosts'],
    }),
    sanityFetch({
      query: BLOG_POSTS_BY_CATEGORY_COUNT_QUERY,
      params: { categorySlug: slug, tagSlug },
      tags: ['blogPosts'],
    }),
  ])

  if (!category) notFound()

  const totalPages = Math.ceil((totalCount || 0) / POSTS_PER_PAGE)
  const basePath = `/blog/category/${slug}`
  const paginationParams = tag ? { tag } : undefined

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
            <h1 className="font-serif text-4xl sm:text-5xl font-bold mb-4">{category.title}</h1>
            {category.description && (
              <p className="text-muted-foreground text-lg mb-10 max-w-2xl">{category.description}</p>
            )}
            <CategoryFilter
              tags={tags || []}
              basePath={basePath}
              categoryColor={category.color}
            />
            <BlogPostGrid posts={posts || []} />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              basePath={basePath}
              searchParams={paginationParams}
            />
          </div>
        </section>
      </main>
      <Footer siteSettings={settings} footerData={footerData} />
      <JsonLd data={webPageJsonLd(category.title, category.description, basePath)} />
    </>
  )
}
