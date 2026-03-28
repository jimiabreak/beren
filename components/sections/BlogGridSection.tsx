import Link from 'next/link'
import { sanityFetch } from '@/sanity/lib/live'
import { BLOG_POSTS_QUERY } from '@/sanity/lib/queries'
import BlogPostGrid from '@/components/blog/BlogPostGrid'

interface BlogGridSectionProps {
  heading?: string
  source?: 'latest' | 'category' | 'manual'
  category?: { _id: string; title: string; slug: string; color?: string }
  posts?: Array<{
    _id: string
    _type: 'blogPost'
    title: string
    slug: string
    publishedAt: string
    excerpt?: string
    highlightImage?: { _type: 'image'; asset: { _ref: string; _type: 'reference' }; alt?: string }
    author?: string
    category: { title: string; slug: string; color?: string }
  }>
  limit?: number
  showViewAll?: boolean
  viewAllHref?: string
}

export default async function BlogGridSection({
  heading,
  source = 'latest',
  category,
  posts: manualPosts,
  limit = 3,
  showViewAll,
  viewAllHref,
}: BlogGridSectionProps) {
  let posts = manualPosts || []

  if (source === 'latest') {
    const { data } = await sanityFetch({
      query: BLOG_POSTS_QUERY,
      params: { start: 0, end: limit },
      tags: ['blogPosts'],
    })
    posts = data || []
  } else if (source === 'category' && category?.slug) {
    const { defineQuery } = await import('next-sanity')
    const CATEGORY_POSTS = defineQuery(`
      *[_type == "blogPost" && category->slug.current == $categorySlug] | order(publishedAt desc) [0...$limit] {
        _id, _type, title, "slug": slug.current, publishedAt, excerpt, highlightImage, author,
        category-> { title, "slug": slug.current, color }
      }
    `)
    const { data } = await sanityFetch({
      query: CATEGORY_POSTS,
      params: { categorySlug: category.slug, limit },
      tags: ['blogPosts'],
    })
    posts = data || []
  }
  // source === 'manual': posts already resolved from GROQ projection

  return (
    <section className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {(heading || showViewAll) && (
          <div className="flex items-baseline justify-between mb-12">
            {heading && (
              <h2 className="font-serif text-3xl md:text-4xl font-semibold tracking-tight">
                {heading}
              </h2>
            )}
            {showViewAll && viewAllHref && (
              <Link
                href={viewAllHref}
                className="font-mono text-sm uppercase tracking-widest text-muted-foreground hover:text-foreground transition-all duration-500 ease-[cubic-bezier(.19,1,.22,1)]"
              >
                View All &rarr;
              </Link>
            )}
          </div>
        )}
        <BlogPostGrid posts={posts} />
      </div>
    </section>
  )
}
