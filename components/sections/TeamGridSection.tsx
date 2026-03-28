'use client'

import { motion } from 'framer-motion'
import { fadeInUp, staggerContainer } from '@/lib/animations'
import type { SanityImageSource } from '@sanity/image-url'
import Container from '@/components/layout/Container'
import SanityImage from '@/components/sanity/SanityImage'
import { useIsVisualEditing } from '@/components/sanity/VisualEditingContext'

interface Member {
  _id: string
  name: string
  role?: string
  image: SanityImageSource
}

interface TeamGridSectionProps {
  heading?: string
  subheading?: string
  members?: Member[]
}

export default function TeamGridSection({ heading, subheading, members }: TeamGridSectionProps) {
  const isVisualEditing = useIsVisualEditing()
  if (!members || members.length === 0) return null
  return (
    <motion.section
      variants={staggerContainer}
      initial={isVisualEditing ? false : 'hidden'}
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      className="py-24 md:py-32"
    >
      <Container>
        {heading && (
          <motion.h2
            variants={fadeInUp}
            className="font-serif text-3xl md:text-4xl font-semibold tracking-tight text-center mb-4"
          >
            {heading}
          </motion.h2>
        )}
        {subheading && (
          <motion.p
            variants={fadeInUp}
            className="text-lg text-muted-foreground text-center max-w-2xl mx-auto mb-16"
          >
            {subheading}
          </motion.p>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {members.map((member) => (
            <motion.div key={member._id} variants={fadeInUp}>
              <div className="relative overflow-hidden aspect-[3/4]">
                {member.image ? (
                  <SanityImage
                    image={member.image}
                    alt={member.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover grayscale hover:grayscale-0 transition-all duration-700 ease-[cubic-bezier(.19,1,.22,1)]"
                  />
                ) : (
                  <div className="absolute inset-0 bg-muted flex items-end p-6">
                    <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Photo</span>
                  </div>
                )}
              </div>
              <h3 className="text-lg font-semibold mt-4">{member.name}</h3>
              {member.role && (
                <p className="text-sm font-mono text-muted-foreground uppercase tracking-wider">
                  {member.role}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      </Container>
    </motion.section>
  )
}
