'use client'

import { motion } from 'framer-motion'
import { fadeIn, fadeInUp, staggerContainer } from '@/lib/animations'
import type { SanityImageSource } from '@sanity/image-url'
import SanityImage from '@/components/sanity/SanityImage'
import { useIsVisualEditing } from '@/components/sanity/VisualEditingContext'

interface LocationTeaserSectionProps {
  heading?: string
  subtitle?: string
  backgroundImage?: SanityImageSource
}

export default function LocationTeaserSection({
  heading,
  subtitle,
  backgroundImage,
}: LocationTeaserSectionProps) {
  const isVisualEditing = useIsVisualEditing()
  void subtitle

  return (
    <motion.section
      variants={staggerContainer}
      initial={isVisualEditing ? false : 'hidden'}
      animate="visible"
      className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-16 md:pt-24"
    >
      {/* Accent tagline */}
      <motion.p
        variants={fadeInUp}
        className="text-sm md:text-base tracking-[0.2em] text-accent uppercase leading-relaxed mb-4 md:mb-6 text-center"
      >
        Ancestral Mediterranean Cooking from the Land of Sun, Sea &amp; Olive Trees.
      </motion.p>

      {/* Cityscape image — constrained to container, with orange border from global CSS */}
      <motion.div variants={fadeIn} className="w-full">
        {backgroundImage ? (
          <div className="relative w-full aspect-[5/3] md:aspect-[3.5/1] overflow-hidden">
            <SanityImage
              image={backgroundImage}
              alt="Turkish cityscape"
              fill
              sizes="100vw"
              className="object-cover"
            />
          </div>
        ) : (
          <div className="relative w-full aspect-[5/3] md:aspect-[3.5/1] overflow-hidden">
            <img
              src="/images/home/home-bottom.png"
              alt="Turkish cityscape"
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </motion.div>
    </motion.section>
  )
}
