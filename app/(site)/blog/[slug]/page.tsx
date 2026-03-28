import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { sanityFetch } from '@/sanity/lib/live'
import { client } from '@/sanity/lib/client'
import {
  SITE_SETTINGS_QUERY,
  HEADER_QUERY,
  FOOTER_QUERY,
  BLOG_POST_QUERY,
  BLOG_POST_SLUGS_QUERY,
} from '@/sanity/lib/queries'
import { urlFor } from '@/sanity/lib/image'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import SanityImage from '@/components/sanity/SanityImage'
import { PortableText } from '@portabletext/react'
import { portableTextComponents } from '@/components/sanity/PortableTextComponents'
import BlogPostGrid from '@/components/blog/BlogPostGrid'
import JsonLd from '@/components/seo/JsonLd'
import { blogPostJsonLd } from '@/lib/structuredData'

interface PostPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params
  const { data: post } = await sanityFetch({
    query: BLOG_POST_QUERY,
    params: { slug },
    tags: ['blogPosts'],
  })
  if (!post) return {}

  const ogImage = post.seo?.ogImage || post.highlightImage
  return {
    title: post.seo?.metaTitle || post.title,
    description: post.seo?.metaDescription || post.excerpt,
    openGraph: {
      title: post.seo?.metaTitle || post.title,
      description: post.seo?.metaDescription || post.excerpt || undefined,
      ...(ogImage && { images: [{ url: urlFor(ogImage).width(1200).height(630).url() }] }),
    },
  }
}

export async function generateStaticParams() {
  const posts = await client.withConfig({ stega: false }).fetch(BLOG_POST_SLUGS_QUERY)
  return (posts || []).map((p: { slug: string }) => ({ slug: p.slug }))
}

export default async function BlogPostPage({ params }: PostPageProps) {
  const { slug } = await params
  const [{ data: settings }, { data: headerData }, { data: footerData }, { data: post }] = await Promise.all([
    sanityFetch({ query: SITE_SETTINGS_QUERY, tags: ['siteSettings'] }),
    sanityFetch({ query: HEADER_QUERY, tags: ['header'] }),
    sanityFetch({ query: FOOTER_QUERY, tags: ['footer'] }),
    sanityFetch({ query: BLOG_POST_QUERY, params: { slug }, tags: ['blogPosts'] }),
  ])

  if (!post) notFound()

  const date = post.publishedAt
    ? new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(new Date(post.publishedAt))
    : null

  const jsonLd = blogPostJsonLd(
    {
      title: post.title,
      excerpt: post.excerpt,
      publishedAt: post.publishedAt,
      updatedAt: post._updatedAt,
      author: post.author,
      image: post.highlightImage ? urlFor(post.highlightImage).width(1200).height(630).url() : undefined,
      slug: post.slug,
    },
    settings?.name || 'Blog',
  )

  return (
    <>
      <Header
        siteSettings={settings}
        megaNavigation={headerData?.megaNavigation}
        secondaryNavigation={headerData?.secondaryNavigation}
        cta={headerData?.cta}
      />
      <main id="main">
        <article className="py-16 sm:py-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Category + Date */}
            <div className="flex items-center gap-3 mb-6">
              {post.category && (
                <Link
                  href={`/blog/category/${post.category.slug}`}
                  className="text-xs font-semibold uppercase tracking-wider px-2 py-1 rounded hover:opacity-80 transition-opacity"
                  style={{
                    backgroundColor: post.category.color ? `${post.category.color}15` : undefined,
                    color: post.category.color || undefined,
                  }}
                >
                  {post.category.title}
                </Link>
              )}
              {date && (
                <time dateTime={post.publishedAt} className="text-sm text-muted-foreground">
                  {date}
                </time>
              )}
            </div>

            {/* Title */}
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-balance">
              {post.title}
            </h1>

            {/* Author */}
            {post.author && (
              <p className="text-muted-foreground mb-8">By {post.author}</p>
            )}

            {/* Highlight Image */}
            {post.highlightImage && (
              <div className="aspect-[16/9] overflow-hidden rounded-lg bg-muted mb-10">
                <SanityImage
                  image={post.highlightImage}
                  alt={post.highlightImage.alt || post.title}
                  width={1200}
                  height={675}
                  className="w-full h-full object-cover"
                  priority
                />
              </div>
            )}

            {/* Content */}
            {post.content && (
              <div className="prose prose-lg max-w-none">
                <PortableText value={post.content} components={portableTextComponents} />
              </div>
            )}

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-10 pt-8 border-t border-border">
                {post.tags.map((tag: { _id: string; title: string; slug: string }) => (
                  <Link
                    key={tag._id}
                    href={`/blog/category/${post.category?.slug}?tag=${tag.slug}`}
                    className="px-3 py-1 text-sm bg-muted rounded-full hover:bg-border transition-colors"
                  >
                    {tag.title}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Related Posts */}
          {post.relatedPosts && post.relatedPosts.length > 0 && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-16 border-t border-border">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold mb-10">Related Posts</h2>
              <BlogPostGrid posts={post.relatedPosts} />
            </div>
          )}
        </article>
      </main>
      <Footer siteSettings={settings} footerData={footerData} />
      <JsonLd data={jsonLd} />
    </>
  )
}
