'use client'

import { motion } from 'framer-motion'
import { stegaClean } from '@sanity/client/stega'
import { fadeInUp, staggerContainer } from '@/lib/animations'
import type { SanityImageSource } from '@sanity/image-url'
import Container from '@/components/layout/Container'
import SanityImage from '@/components/sanity/SanityImage'
import { useIsVisualEditing } from '@/components/sanity/VisualEditingContext'

interface GalleryImage {
  _key: string
  asset: SanityImageSource
  alt?: string
  caption?: string
}

interface ImageGallerySectionProps {
  heading?: string
  images?: GalleryImage[]
  layout?: 'grid' | 'carousel'
}

export default function ImageGallerySection({ heading, images, layout = 'grid' }: ImageGallerySectionProps) {
  const isVisualEditing = useIsVisualEditing()
  const hasImages = images && images.length > 0
  const cleanLayout = stegaClean(layout)

  return (
    <motion.section variants={staggerContainer} initial={isVisualEditing ? false : 'hidden'} animate="visible" className="py-24 md:py-32">
      <Container>
        {heading && (
          <motion.h2 variants={fadeInUp} className="font-serif font-semibold text-3xl md:text-4xl tracking-tight text-center mb-12">
            {heading}
          </motion.h2>
        )}
        {hasImages ? (
          cleanLayout === 'carousel' ? (
            <motion.div
              variants={fadeInUp}
              className="flex gap-4 overflow-x-auto snap-x snap-mandatory [&::-webkit-scrollbar]:hidden -mx-4 px-4"
            >
              {images.map((img) => (
                <div key={img._key} className="flex-shrink-0 w-[85vw] sm:w-[45vw] lg:w-[30vw] snap-start">
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <SanityImage image={img} alt={img.alt || ''} fill sizes="(max-width: 640px) 85vw, (max-width: 1024px) 45vw, 30vw" className="object-cover" />
                  </div>
                  {img.caption && <p className="font-mono text-xs text-muted-foreground mt-2">{img.caption}</p>}
                </div>
              ))}
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {images.map((img) => (
                <motion.div key={img._key} variants={fadeInUp}>
                  <div className="relative aspect-[4/5] overflow-hidden group">
                    <SanityImage
                      image={img}
                      alt={img.alt || ''}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-all duration-500 ease-[cubic-bezier(.19,1,.22,1)] group-hover:opacity-90"
                    />
                  </div>
                  {img.caption && <p className="font-mono text-xs text-muted-foreground mt-2">{img.caption}</p>}
                </motion.div>
              ))}
            </div>
          )
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((n) => (
              <motion.div key={`placeholder-${n}`} variants={fadeInUp}>
                <div className="relative aspect-[4/5] bg-muted flex items-end p-6">
                  <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Image {String(n).padStart(2, '0')}</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </Container>
    </motion.section>
  )
}
