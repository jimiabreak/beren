'use client'

import { motion } from 'framer-motion'
import { stegaClean } from '@sanity/client/stega'
import { fadeInUp, staggerContainer } from '@/lib/animations'
import type { SanityImageSource } from '@sanity/image-url'
import SanityImage from '@/components/sanity/SanityImage'
import Button from '@/components/ui/Button'
import { useIsVisualEditing } from '@/components/sanity/VisualEditingContext'
import { PortableText } from '@portabletext/react'
import type { PortableTextBlock } from '@portabletext/types'

interface CTAButton {
  _key: string
  label?: string
  url?: string
  variant?: 'primary' | 'secondary' | 'outline'
}

interface HomeAboutSectionProps {
  tagline?: string
  body?: PortableTextBlock[]
  image?: SanityImageSource
  ctaButtons?: CTAButton[]
}

export default function HomeAboutSection({
  tagline,
  body,
  image,
  ctaButtons,
}: HomeAboutSectionProps) {
  const isVisualEditing = useIsVisualEditing()

  return (
    <motion.section
      variants={staggerContainer}
      initial={isVisualEditing ? false : 'hidden'}
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      className="pt-20 md:pt-32 pb-16 md:pb-24"
    >
      {/* Tagline */}
      {tagline && (
        <motion.div variants={fadeInUp} className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-12 md:mb-16 text-center">
          <h2 className="text-4xl md:text-5xl lg:text-6xl tracking-wide text-foreground uppercase leading-[1.15]">
            {tagline.includes('\n')
              ? tagline.split('\n').map((line, i) => (
                  <span key={i}>
                    {i > 0 && <br />}
                    {line}
                  </span>
                ))
              : tagline}
          </h2>
        </motion.div>
      )}

      {/* Split: Image left + Text right */}
      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
          {/* Image */}
          <motion.div variants={fadeInUp} className="relative aspect-[2/3] md:aspect-[3/4] overflow-hidden">
            {image ? (
              <SanityImage
                image={image}
                alt="Beren cuisine"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            ) : (
              <img
                src="/images/home/Beren-39 1.jpg"
                alt="Hummus with sesame seeds and olive oil"
                className="w-full h-full object-cover"
              />
            )}
          </motion.div>

          {/* Text + CTAs */}
          <motion.div variants={fadeInUp} className="flex flex-col justify-center">
            {body && (
              <div className="text-base md:text-lg text-muted-foreground leading-relaxed space-y-6 [&_p]:mb-0">
                <PortableText value={body} />
              </div>
            )}

            {ctaButtons && ctaButtons.length > 0 && (
              <div className="flex flex-col gap-3 mt-10 md:mt-12">
                {ctaButtons.map((btn) => (
                  btn.label && btn.url && (
                    <Button
                      key={btn._key}
                      href={stegaClean(btn.url)}
                      variant={stegaClean(btn.variant) || 'outline'}
                      className="w-fit"
                    >
                      {btn.label}
                    </Button>
                  )
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </motion.section>
  )
}
