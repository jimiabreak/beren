'use client'

import { motion } from 'framer-motion'
import { stegaClean } from '@sanity/client/stega'
import { fadeInUp, staggerContainer } from '@/lib/animations'
import Container from '@/components/layout/Container'
import { useIsVisualEditing } from '@/components/sanity/VisualEditingContext'

interface Feature {
  _key: string
  icon?: string
  title?: string
  description?: string
}

interface FeatureGridSectionProps {
  heading?: string
  subheading?: string
  features?: Feature[]
  columns?: 2 | 3 | 4
}

export default function FeatureGridSection({ heading, subheading, features, columns = 3 }: FeatureGridSectionProps) {
  const isVisualEditing = useIsVisualEditing()
  if (!features || features.length === 0) return null
  const cols = stegaClean(columns)
  const gridCols =
    cols === 2
      ? 'md:grid-cols-2'
      : cols === 4
        ? 'md:grid-cols-2 lg:grid-cols-4'
        : 'md:grid-cols-2 lg:grid-cols-3'

  return (
    <motion.section
      variants={staggerContainer}
      initial={isVisualEditing ? false : 'hidden'}
      animate="visible"
      className="py-24 md:py-32"
    >
      <Container>
        {heading && (
          <motion.h2
            variants={fadeInUp}
            className="font-serif text-3xl md:text-4xl font-semibold tracking-tight text-center mb-4"
          >
            {heading}
          </motion.h2>
        )}
        {subheading && (
          <motion.p
            variants={fadeInUp}
            className="text-lg text-muted-foreground max-w-2xl mx-auto text-center mb-16"
          >
            {subheading}
          </motion.p>
        )}
        <div className={`grid grid-cols-1 ${gridCols} gap-8 md:gap-12`}>
          {features.map((feature, index) => (
            <motion.div
              key={feature._key}
              variants={fadeInUp}
              className="border-t border-border pt-6"
            >
              {feature.icon ? (
                <span className="text-2xl mb-4 block">{feature.icon}</span>
              ) : (
                <span className="font-mono text-sm text-muted-foreground mb-4 block">
                  {String(index + 1).padStart(2, '0')}
                </span>
              )}
              {feature.title && (
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              )}
              {feature.description && (
                <p className="text-muted-foreground text-base leading-relaxed">
                  {feature.description}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      </Container>
    </motion.section>
  )
}
