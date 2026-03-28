'use client'

import { motion } from 'framer-motion'
import { staggerContainer, fadeInUp } from '@/lib/animations'
import type { SanityImageSource } from '@sanity/image-url'
import SanityImage from '@/components/sanity/SanityImage'

interface GalleryImage {
  _id: string
  image: SanityImageSource
  alt: string
  caption?: string
}

interface GalleryGridProps {
  images: GalleryImage[]
}

export default function GalleryGrid({ images }: GalleryGridProps) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      className="columns-1 sm:columns-2 lg:columns-3 gap-4"
    >
      {images.map((item) => (
        <motion.figure key={item._id} variants={fadeInUp} className="mb-4 break-inside-avoid">
          <div className="overflow-hidden rounded-sm">
            <SanityImage
              image={item.image}
              alt={item.alt}
              width={600}
              height={400}
              className="w-full h-auto hover:scale-105 transition-transform duration-500"
            />
          </div>
          {item.caption && (
            <figcaption className="text-sm text-muted-foreground mt-2">{item.caption}</figcaption>
          )}
        </motion.figure>
      ))}
    </motion.div>
  )
}
