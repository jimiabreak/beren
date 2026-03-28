'use client'

import { motion } from 'framer-motion'
import { fadeInUp, staggerContainer } from '@/lib/animations'
import Container from '@/components/layout/Container'
import { useIsVisualEditing } from '@/components/sanity/VisualEditingContext'

interface Stat {
  _key: string
  value: string
  label: string
  prefix?: string
  suffix?: string
}

interface StatsBarSectionProps {
  stats?: Stat[]
}

export default function StatsBarSection({ stats }: StatsBarSectionProps) {
  const isVisualEditing = useIsVisualEditing()
  if (!stats || stats.length === 0) return null

  const colClass =
    stats.length === 2 ? 'md:grid-cols-2' :
    stats.length === 3 ? 'md:grid-cols-3' :
    stats.length >= 4 ? 'md:grid-cols-4' :
    'md:grid-cols-1'

  return (
    <motion.section
      variants={staggerContainer}
      initial={isVisualEditing ? false : 'hidden'}
      whileInView="visible"
      viewport={{ once: true }}
      className="py-16 md:py-20 bg-foreground text-background"
    >
      <Container>
        <div className={`grid grid-cols-2 ${colClass} gap-y-12`}>
          {stats.map((stat, index) => (
            <motion.div
              key={stat._key}
              variants={fadeInUp}
              className={`text-center px-6 ${index < stats.length - 1 ? 'md:border-r md:border-background/20' : ''}`}
            >
              <p className="font-semibold text-4xl md:text-5xl tracking-tight text-background">
                {stat.prefix}{stat.value}{stat.suffix}
              </p>
              <p className="font-mono text-sm uppercase tracking-widest text-background/50 mt-3">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </Container>
    </motion.section>
  )
}
