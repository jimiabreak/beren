'use client'

import { motion } from 'framer-motion'
import { staggerContainer } from '@/lib/animations'
import BlogPostCard from './BlogPostCard'
import type { BlogPostCard as BlogPostCardType } from '@/types'

interface BlogPostGridProps {
  posts: BlogPostCardType[]
}

export default function BlogPostGrid({ posts }: BlogPostGridProps) {
  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">No posts found.</p>
      </div>
    )
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
    >
      {posts.map((post) => (
        <BlogPostCard key={post._id} post={post} />
      ))}
    </motion.div>
  )
}
