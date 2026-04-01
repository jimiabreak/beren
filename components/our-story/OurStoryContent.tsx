'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { fadeInUp, fadeIn, staggerContainer } from '@/lib/animations'

const GRID_IMAGES = [
  { src: '/images/our-story/Beren-16 3.jpg', alt: 'Cherries and dip' },
  { src: '/images/our-story/Beren-16 4.jpg', alt: 'Sweet potato fries' },
  { src: '/images/our-story/Beren-16 2.jpg', alt: 'Grilled meat' },
  { src: '/images/our-story/Beren-01 1.jpg', alt: 'Green ceramic bowls' },
  { src: '/images/our-story/Beren-02 1.jpg', alt: 'Interior neon light' },
  { src: '/images/our-story/Beren-08 1.jpg', alt: 'Wall sconce' },
  { src: '/images/our-story/Beren-02 2.jpg', alt: 'Baklava' },
  { src: '/images/our-story/Beren-08 2.jpg', alt: 'Lemon salmon' },
  { src: '/images/our-story/Beren-01 2.jpg', alt: 'Beet yogurt dip' },
]

export default function OurStoryContent() {
  return (
    <>
      {/* Page heading */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-16 md:pt-28 pb-12 md:pb-16 text-center"
      >
        <h1 className="text-4xl md:text-5xl lg:text-6xl tracking-wide text-foreground uppercase">
          Our Story
        </h1>
      </motion.div>

      {/* Two-column text */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-20 md:pb-28"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
          {/* Left column */}
          <motion.div variants={fadeInUp} className="max-w-sm">
            <h2 className="text-lg md:text-xl text-foreground uppercase tracking-wide mb-6">
              A Taste of Tradition, Authentic Turkish Cuisine at Beren
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed">
              Learn more about our{' '}
              <Link href="/catering" className="underline decoration-accent underline-offset-4 hover:text-foreground transition-colors">
                catering offerings
              </Link>{' '}
              at BEREN,{' '}
              <Link href="/contact" className="underline decoration-accent underline-offset-4 hover:text-foreground transition-colors">
                make a reservation
              </Link>
              , or send{' '}
              <Link href="/contact" className="underline decoration-accent underline-offset-4 hover:text-foreground transition-colors">
                us a message
              </Link>
              .
            </p>
          </motion.div>

          {/* Right column */}
          <motion.div variants={fadeInUp} className="text-base text-muted-foreground leading-relaxed space-y-6">
            <p>
              BEREN Meze & Grill House was born from a deep love for Turkish cuisine and a desire to share its rich cultural heritage with our Texas community. What started as a dream, has blossomed into a cherished dining experience where tradition meets taste.
            </p>
            <p>
              At BEREN, we take pride in crafting every dish with the finest local ingredients, time-honored recipes, and a touch of contemporary flair. Each plate we serve tells a story of family, flavor, and the warmth of Turkish hospitality. More than just a meal, dining with us is an experience that celebrates the essence of Mediterranean living.
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Full-width team photo */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
      >
        <div className="relative w-full aspect-[4/3] md:aspect-[16/7] overflow-hidden">
          <Image
            src="/images/our-story/untitled_Gemini 3.1 Flash (Nano Banana 2)_2026-03-20_20-27-49 1.jpg"
            alt="BEREN team — founders and chef"
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>
      </motion.div>

      {/* 3×3 image grid */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="px-12 sm:px-20 md:px-28 lg:px-36 max-w-7xl mx-auto py-20 md:py-32"
      >
        <div className="grid grid-cols-3 gap-3 md:gap-4">
          {GRID_IMAGES.map((img, i) => (
            <motion.div
              key={img.src}
              variants={fadeInUp}
              className="relative aspect-[2/3] overflow-hidden"
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(max-width: 768px) 33vw, 30vw"
                className="object-cover"
              />
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Full-width building exterior */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-16 md:pb-24"
      >
        <div className="relative w-full aspect-[4/3] md:aspect-[16/7] overflow-hidden">
          <Image
            src="/images/our-story/Rectangle 10823.jpg"
            alt="BEREN restaurant exterior"
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>
      </motion.div>
    </>
  )
}
