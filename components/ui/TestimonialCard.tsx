'use client'

import { motion } from 'framer-motion'
import { fadeInUp } from '@/lib/animations'

interface TestimonialCardProps {
  author: string
  quote: string
  rating?: number
  source?: string
}

export default function TestimonialCard({ author, quote, rating, source }: TestimonialCardProps) {
  return (
    <motion.blockquote
      variants={fadeInUp}
      className="bg-muted p-6 sm:p-8 rounded-sm"
    >
      {rating && (
        <div className="flex gap-1 mb-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className={i < rating ? 'text-foreground' : 'text-border'}>★</span>
          ))}
        </div>
      )}
      <p className="font-serif text-lg italic leading-relaxed mb-4">&ldquo;{quote}&rdquo;</p>
      <footer className="text-sm">
        <span className="font-medium">{author}</span>
        {source && <span className="opacity-60 ml-2">· {source}</span>}
      </footer>
    </motion.blockquote>
  )
}
