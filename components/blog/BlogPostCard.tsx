'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { fadeInUp } from '@/lib/animations'
import SanityImage from '@/components/sanity/SanityImage'
import type { BlogPostCard as BlogPostCardType } from '@/types'

interface BlogPostCardProps {
  post: BlogPostCardType
}

export default function BlogPostCard({ post }: BlogPostCardProps) {
  const date = post.publishedAt
    ? new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(new Date(post.publishedAt))
    : null

  return (
    <motion.article variants={fadeInUp} className="group">
      <Link href={`/blog/${post.slug}`} className="block">
        {/* Image */}
        <div className="aspect-[3/2] overflow-hidden rounded-lg bg-muted mb-4">
          {post.highlightImage ? (
            <SanityImage
              image={post.highlightImage}
              alt={post.highlightImage.alt || post.title}
              width={600}
              height={400}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              No image
            </div>
          )}
        </div>

        {/* Category Badge */}
        {post.category && (
          <span
            className="inline-block text-xs font-semibold uppercase tracking-wider mb-2 px-2 py-1 rounded"
            style={{
              backgroundColor: post.category.color ? `${post.category.color}15` : undefined,
              color: post.category.color || undefined,
            }}
          >
            {post.category.title}
          </span>
        )}

        {/* Title */}
        <h3 className="font-serif text-lg sm:text-xl font-bold mb-2 group-hover:text-foreground transition-colors line-clamp-2">
          {post.title}
        </h3>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
            {post.excerpt}
          </p>
        )}

        {/* Meta */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {post.author && <span>{post.author}</span>}
          {post.author && date && <span aria-hidden="true">&middot;</span>}
          {date && <time dateTime={post.publishedAt}>{date}</time>}
        </div>
      </Link>
    </motion.article>
  )
}
