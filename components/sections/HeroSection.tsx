'use client'

import { motion } from 'framer-motion'
import { stegaClean } from '@sanity/client/stega'
import { fadeInUp, staggerContainer } from '@/lib/animations'
import type { SanityImageSource } from '@sanity/image-url'
import SanityImage from '@/components/sanity/SanityImage'
import Button from '@/components/ui/Button'
import Container from '@/components/layout/Container'
import { useIsVisualEditing } from '@/components/sanity/VisualEditingContext'

interface CTAButton {
  _key: string
  label?: string
  url?: string
  variant?: 'primary' | 'secondary' | 'outline'
}

interface HeroSectionProps {
  headline?: string
  subheadline?: string
  ctaButtons?: CTAButton[]
  backgroundImage?: SanityImageSource
  layout?: 'centered' | 'left-aligned' | 'split'
}

export default function HeroSection({ headline, subheadline, ctaButtons, backgroundImage, layout = 'centered' }: HeroSectionProps) {
  const isVisualEditing = useIsVisualEditing()
  const cleanLayout = stegaClean(layout)

  if (cleanLayout === 'split') {
    return (
      <section className="min-h-[80vh]">
        <div className="grid grid-cols-1 md:grid-cols-2 min-h-[80vh]">
          <motion.div
            variants={staggerContainer}
            initial={isVisualEditing ? false : 'hidden'}
            animate="visible"
            className="flex items-center px-8 md:px-16 lg:px-24 py-24 md:py-32"
          >
            <div className="max-w-xl">
              <motion.h1
                variants={fadeInUp}
                className="font-semibold text-5xl md:text-7xl lg:text-8xl tracking-tight leading-[0.95] text-foreground"
              >
                {headline || 'Welcome'}
              </motion.h1>
              {subheadline && (
                <motion.p
                  variants={fadeInUp}
                  className="text-lg md:text-xl text-muted-foreground mt-8 max-w-md"
                >
                  {subheadline}
                </motion.p>
              )}
              {ctaButtons && ctaButtons.length > 0 && (
                <motion.div variants={fadeInUp} className="flex flex-wrap gap-4 mt-12">
                  {ctaButtons.map((btn) => (
                    btn.label && btn.url && (
                      <Button key={btn._key} href={stegaClean(btn.url)} variant={stegaClean(btn.variant) || 'primary'}>
                        {btn.label}
                      </Button>
                    )
                  ))}
                </motion.div>
              )}
            </div>
          </motion.div>
          {backgroundImage && (
            <div className="relative min-h-[50vh] md:min-h-full overflow-hidden group">
              <SanityImage
                image={backgroundImage}
                alt={headline || 'Hero'}
                fill
                sizes="50vw"
                className="object-cover transition-transform duration-700 ease-[cubic-bezier(.19,1,.22,1)] group-hover:scale-[1.03]"
                priority
              />
            </div>
          )}
        </div>
      </section>
    )
  }

  const isCentered = cleanLayout !== 'left-aligned'
  const hasBackgroundImage = !!backgroundImage

  return (
    <section className="relative min-h-[80vh] flex items-center">
      {hasBackgroundImage && (
        <div className="absolute inset-0">
          <SanityImage image={backgroundImage} alt={headline || 'Hero'} fill sizes="100vw" className="object-cover" priority />
          <div className="absolute inset-0 bg-foreground/40" />
        </div>
      )}
      <Container>
        <motion.div
          variants={staggerContainer}
          initial={isVisualEditing ? false : 'hidden'}
          animate="visible"
          className={`relative z-10 py-24 md:py-32 flex flex-col ${isCentered ? 'items-center text-center' : 'items-start text-left'}`}
        >
          <motion.h1
            variants={fadeInUp}
            className={`font-semibold text-5xl md:text-7xl lg:text-8xl tracking-tight leading-[0.95] ${hasBackgroundImage ? 'text-background' : 'text-foreground'}`}
          >
            {headline || 'Welcome'}
          </motion.h1>
          {subheadline && (
            <motion.p
              variants={fadeInUp}
              className={`text-lg md:text-xl mt-8 max-w-2xl ${hasBackgroundImage ? 'text-background/80' : 'text-muted-foreground'} ${isCentered ? 'mx-auto' : ''}`}
            >
              {subheadline}
            </motion.p>
          )}
          {ctaButtons && ctaButtons.length > 0 && (
            <motion.div variants={fadeInUp} className={`flex flex-wrap gap-4 mt-12 ${isCentered ? 'justify-center' : ''}`}>
              {ctaButtons.map((btn) => (
                btn.label && btn.url && (
                  <Button
                    key={btn._key}
                    href={stegaClean(btn.url)}
                    variant={hasBackgroundImage ? 'outline' : (stegaClean(btn.variant) || 'primary')}
                    size="lg"
                    className={hasBackgroundImage ? 'border-background text-background hover:bg-background hover:text-foreground' : ''}
                  >
                    {btn.label}
                  </Button>
                )
              ))}
            </motion.div>
          )}
        </motion.div>
      </Container>
    </section>
  )
}
