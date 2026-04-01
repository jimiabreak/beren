'use client'

import { motion } from 'framer-motion'
import { fadeInUp, staggerContainer } from '@/lib/animations'
import Container from '@/components/layout/Container'
import NewsletterSignup from '@/components/ui/NewsletterSignup'
import { useIsVisualEditing } from '@/components/sanity/VisualEditingContext'

interface NewsletterSectionBlockProps {
  heading?: string
  subheading?: string
  placeholder?: string
  buttonText?: string
  backgroundColor?: string
}

export default function NewsletterSectionBlock({
  heading,
  subheading,
  placeholder,
  buttonText,
}: NewsletterSectionBlockProps) {
  const isVisualEditing = useIsVisualEditing()
  return (
    <motion.section
      variants={staggerContainer}
      initial={isVisualEditing ? false : 'hidden'}
      animate="visible"
      className="py-24 md:py-32 bg-foreground text-background"
    >
      <Container>
        <div className="max-w-2xl mx-auto text-center">
          {heading && (
            <motion.h2
              variants={fadeInUp}
              className="font-serif text-3xl md:text-4xl font-semibold tracking-tight text-background"
            >
              {heading}
            </motion.h2>
          )}
          {subheading && (
            <motion.p
              variants={fadeInUp}
              className="text-base text-background/60 mt-4 mb-10"
            >
              {subheading}
            </motion.p>
          )}
          {!subheading && heading && <div className="mb-10" />}
          <motion.div variants={fadeInUp}>
            <NewsletterSignup />
          </motion.div>
        </div>
      </Container>
    </motion.section>
  )
}
