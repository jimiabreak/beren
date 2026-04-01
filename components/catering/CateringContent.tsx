'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { fadeInUp, fadeIn, staggerContainer } from '@/lib/animations'

export default function CateringContent() {
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
          Catering
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
              Unique Catering Experiences for Weddings, Private Gatherings, Engagement Celebrations, &amp; Cultural Occasions.
            </h2>
            <Link
              href="/contact"
              className="inline-block border border-accent text-foreground uppercase tracking-widest text-sm px-8 py-3.5 hover:bg-accent hover:text-background transition-colors"
            >
              Request a Quote
            </Link>
          </motion.div>

          {/* Right column */}
          <motion.div variants={fadeInUp} className="text-base text-muted-foreground leading-relaxed space-y-6">
            <p>
              At BEREN, our catering brings the warmth and richness of Turkish cuisine to life&apos;s most meaningful moments. From weddings and engagement celebrations to private gatherings and cultural occasions.
            </p>
            <p>
              Our menus showcase the depth of Anatolian cooking, featuring vibrant meze spreads, iconic street foods, slow-cooked mains, sizzling grills, and traditional desserts prepared with care and authenticity.
            </p>
            <p>
              Whether you&apos;re hosting an intimate dinner or a large celebration, we curate each menu to create a welcoming table that reflects the beauty of Turkish hospitality and brings people together through food, tradition, and shared experience.
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Image grid */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
      >
        {/* Row 1: Two equal images */}
        <div className="grid grid-cols-2 gap-3 md:gap-4 mb-3 md:mb-4">
          <motion.div variants={fadeInUp} className="relative aspect-[3/4] overflow-hidden">
            <Image
              src="/images/catering/Beren-21 3.jpg"
              alt="Lamb shank on blue plate"
              fill
              sizes="(max-width: 768px) 50vw, 45vw"
              className="object-cover"
            />
          </motion.div>
          <motion.div variants={fadeInUp} className="relative aspect-[3/4] overflow-hidden">
            <Image
              src="/images/catering/Beren-29 2.jpg"
              alt="Red sauce chicken with mint"
              fill
              sizes="(max-width: 768px) 50vw, 45vw"
              className="object-cover"
            />
          </motion.div>
        </div>

        {/* Rows 2-3: Left 2 stacked images, right 1 tall image */}
        <div className="grid grid-cols-[2fr_3fr] grid-rows-[1fr_1fr] gap-3 md:gap-4 mb-3 md:mb-4" style={{ height: 'clamp(500px, 60vw, 900px)' }}>
          {/* Top-left: kebab plate */}
          <motion.div variants={fadeInUp} className="relative overflow-hidden min-h-0">
            <Image
              src="/images/catering/Beren-28 2.jpg"
              alt="Grilled kebab plate"
              fill
              sizes="(max-width: 768px) 50vw, 35vw"
              className="object-cover"
            />
          </motion.div>

          {/* Right image spanning 2 rows */}
          <motion.div variants={fadeInUp} className="relative row-span-2 overflow-hidden min-h-0">
            <Image
              src="/images/catering/Beren-09 2.jpg"
              alt="Chicken skewer with radish and charred lemon"
              fill
              sizes="(max-width: 768px) 50vw, 55vw"
              className="object-cover"
            />
          </motion.div>

          {/* Bottom-left: ground meat with yogurt */}
          <motion.div variants={fadeInUp} className="relative overflow-hidden min-h-0">
            <Image
              src="/images/catering/Beren-27 2.jpg"
              alt="Ground meat with yogurt"
              fill
              sizes="(max-width: 768px) 50vw, 35vw"
              className="object-cover"
            />
          </motion.div>
        </div>

        {/* Full-width baklava */}
        <motion.div
          variants={fadeInUp}
          className="relative w-full aspect-[4/3] md:aspect-[8/5] overflow-hidden"
        >
          <Image
            src="/images/catering/Beren-39 1.jpg"
            alt="Fresh baklava closeup"
            fill
            sizes="100vw"
            className="object-cover"
          />
        </motion.div>
      </motion.div>

      {/* Bottom spacer */}
      <div className="pb-20 md:pb-28" />
    </>
  )
}
