'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { fadeInUp, staggerContainer } from '@/lib/animations'
import Container from '@/components/layout/Container'
import { useIsVisualEditing } from '@/components/sanity/VisualEditingContext'

interface Testimonial {
  _id: string
  author: string
  quote: string
  rating?: number
  source?: string
}

interface TestimonialCarouselSectionProps {
  heading?: string
  testimonials?: Testimonial[]
  autoPlay?: boolean
}

export default function TestimonialCarouselSection({ heading, testimonials, autoPlay = false }: TestimonialCarouselSectionProps) {
  const isVisualEditing = useIsVisualEditing()
  const [current, setCurrent] = useState(0)
  const length = testimonials?.length || 0

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % length)
  }, [length])

  const prev = useCallback(() => {
    setCurrent((p) => (p - 1 + length) % length)
  }, [length])

  useEffect(() => {
    if (!autoPlay || length === 0) return
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return
    const id = setInterval(next, 6000)
    return () => clearInterval(id)
  }, [autoPlay, next, length])

  if (!testimonials || testimonials.length === 0) return null
  const t = testimonials[current]

  return (
    <motion.section variants={staggerContainer} initial={isVisualEditing ? false : 'hidden'} whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="py-24 md:py-32">
      <Container>
        {heading && (
          <motion.h2 variants={fadeInUp} className="font-serif font-semibold text-3xl md:text-4xl tracking-tight text-center mb-16">
            {heading}
          </motion.h2>
        )}
        <div className="relative max-w-4xl mx-auto">
          {testimonials.length > 1 && (
            <button
              onClick={prev}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 text-muted-foreground hover:text-foreground transition-all duration-500 ease-[cubic-bezier(.19,1,.22,1)] p-2"
              aria-label="Previous testimonial"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M15 4l-8 8 8 8" />
              </svg>
            </button>
          )}

          <div className="text-center px-8 md:px-16">
            <AnimatePresence mode="wait">
              <motion.div
                key={t._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
              >
                <blockquote className="text-2xl md:text-3xl lg:text-4xl font-normal leading-snug tracking-tight text-foreground mb-8">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <p className="font-mono text-sm uppercase tracking-widest text-muted-foreground">
                  {t.author}
                  {t.source && <span>&ensp;&mdash;&ensp;{t.source}</span>}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {testimonials.length > 1 && (
            <button
              onClick={next}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 text-muted-foreground hover:text-foreground transition-all duration-500 ease-[cubic-bezier(.19,1,.22,1)] p-2"
              aria-label="Next testimonial"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M9 4l8 8-8 8" />
              </svg>
            </button>
          )}
        </div>
      </Container>
    </motion.section>
  )
}
