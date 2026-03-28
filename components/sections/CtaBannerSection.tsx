'use client'

import { motion } from 'framer-motion'
import { stegaClean } from '@sanity/client/stega'
import { fadeInUp, staggerContainer } from '@/lib/animations'
import Container from '@/components/layout/Container'
import Button from '@/components/ui/Button'
import { useIsVisualEditing } from '@/components/sanity/VisualEditingContext'

interface CTAButton {
  _key: string
  label?: string
  url?: string
  variant?: 'primary' | 'secondary' | 'outline'
}

interface CtaBannerSectionProps {
  heading?: string
  body?: string
  buttons?: CTAButton[]
  backgroundColor?: string
  textColor?: string
}

export default function CtaBannerSection({ heading, body, buttons, backgroundColor, textColor }: CtaBannerSectionProps) {
  const isVisualEditing = useIsVisualEditing()
  // Props kept for backwards compat but visually ignored — always inverted
  void backgroundColor
  void textColor

  return (
    <motion.section
      variants={staggerContainer}
      initial={isVisualEditing ? false : 'hidden'}
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      className="py-24 md:py-32 bg-foreground text-background"
    >
      <Container>
        <div className="text-center max-w-3xl mx-auto">
          {heading && (
            <motion.h2
              variants={fadeInUp}
              className="font-semibold text-3xl md:text-5xl tracking-tight text-background"
            >
              {heading}
            </motion.h2>
          )}
          {body && (
            <motion.p
              variants={fadeInUp}
              className="text-lg text-background/70 mt-6"
            >
              {body}
            </motion.p>
          )}
          {buttons && buttons.length > 0 && (
            <motion.div variants={fadeInUp} className="flex flex-wrap justify-center gap-4 mt-12">
              {buttons.map((btn) => (
                btn.label && btn.url && (
                  <Button
                    key={btn._key}
                    href={stegaClean(btn.url)}
                    variant="outline"
                    className="border-background text-background hover:bg-background hover:text-foreground"
                  >
                    {btn.label}
                  </Button>
                )
              ))}
            </motion.div>
          )}
        </div>
      </Container>
    </motion.section>
  )
}
