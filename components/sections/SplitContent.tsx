'use client'

import { motion } from 'framer-motion'
import { stegaClean } from '@sanity/client/stega'
import { PortableText } from '@portabletext/react'
import { fadeInUp, staggerContainer } from '@/lib/animations'
import type { SanityImageSource } from '@sanity/image-url'
import Container from '@/components/layout/Container'
import SanityImage from '@/components/sanity/SanityImage'
import { useIsVisualEditing } from '@/components/sanity/VisualEditingContext'

type PortableTextValue = Parameters<typeof PortableText>[0]['value']

interface SplitContentProps {
  heading?: string
  body?: PortableTextValue
  image?: SanityImageSource
  imagePosition?: 'left' | 'right'
  cta?: { label?: string; href?: string }
}

export default function SplitContent({ heading, body, image, imagePosition = 'right', cta }: SplitContentProps) {
  const isVisualEditing = useIsVisualEditing()
  const isImageLeft = stegaClean(imagePosition) === 'left'

  const textBlock = (
    <motion.div variants={fadeInUp} className={`self-center ${isImageLeft ? 'lg:order-2' : 'lg:order-1'}`}>
      {heading && (
        <h2 className="font-serif text-3xl md:text-4xl font-semibold tracking-tight mb-6">
          {heading}
        </h2>
      )}
      {body && (
        <div className="text-base md:text-lg leading-relaxed text-foreground/80">
          {Array.isArray(body) ? <PortableText value={body} /> : <p>{String(body)}</p>}
        </div>
      )}
      {cta?.label && cta?.href && (
        <div className="mt-8">
          <a
            href={stegaClean(cta.href)}
            className="inline-flex items-center font-medium underline underline-offset-4 transition-all duration-500 ease-[cubic-bezier(.19,1,.22,1)] hover:underline-offset-8"
          >
            {cta.label}
            <span className="ml-1" aria-hidden="true">&rarr;</span>
          </a>
        </div>
      )}
    </motion.div>
  )

  const imageBlock = (
    <motion.div
      variants={fadeInUp}
      className={`overflow-hidden ${isImageLeft ? 'lg:order-1' : 'lg:order-2'}`}
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        {image ? (
          <SanityImage
            image={image}
            alt={heading || 'Content image'}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover transition-transform duration-700 ease-[cubic-bezier(.19,1,.22,1)] hover:scale-[1.02]"
          />
        ) : (
          <div className="absolute inset-0 bg-muted flex items-end p-6">
            <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Image</span>
          </div>
        )}
      </div>
    </motion.div>
  )

  return (
    <motion.section
      variants={staggerContainer}
      initial={isVisualEditing ? false : 'hidden'}
      animate="visible"
      className="py-24 md:py-32"
    >
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {textBlock}
          {imageBlock}
        </div>
      </Container>
    </motion.section>
  )
}
