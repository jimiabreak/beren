'use client'

import { motion } from 'framer-motion'
import { fadeInUp, staggerContainer } from '@/lib/animations'
import Container from '@/components/layout/Container'
import { useIsVisualEditing } from '@/components/sanity/VisualEditingContext'

interface VideoSectionProps {
  heading?: string
  videoUrl?: string
  posterImage?: unknown
  autoplay?: boolean
}

function getEmbedUrl(url: string, autoplay: boolean): string | null {
  try {
    const parsed = new URL(url)
    const auto = autoplay ? '&autoplay=1&mute=1' : ''
    if (parsed.hostname.includes('youtube.com') || parsed.hostname.includes('youtu.be')) {
      const id = parsed.hostname.includes('youtu.be') ? parsed.pathname.slice(1) : parsed.searchParams.get('v')
      if (id) return `https://www.youtube-nocookie.com/embed/${id}?rel=0${auto}`
    }
    if (parsed.hostname.includes('vimeo.com')) {
      const id = parsed.pathname.split('/').filter(Boolean).pop()
      if (id) return `https://player.vimeo.com/video/${id}?${autoplay ? 'autoplay=1&muted=1' : ''}`
    }
  } catch {
    // invalid URL
  }
  return null
}

export default function VideoSection({ heading, videoUrl, autoplay = false }: VideoSectionProps) {
  const isVisualEditing = useIsVisualEditing()
  if (!videoUrl) return null
  const embedUrl = getEmbedUrl(videoUrl, autoplay)
  if (!embedUrl) return null

  return (
    <motion.section variants={staggerContainer} initial={isVisualEditing ? false : 'hidden'} whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="py-24 md:py-32">
      <Container>
        {heading && (
          <motion.h2 variants={fadeInUp} className="font-serif font-semibold text-3xl md:text-4xl tracking-tight text-center mb-12">
            {heading}
          </motion.h2>
        )}
        <motion.div variants={fadeInUp} className="max-w-5xl mx-auto">
          <div className="relative aspect-video border border-border overflow-hidden">
            <iframe
              src={embedUrl}
              title={heading || 'Video'}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>
        </motion.div>
      </Container>
    </motion.section>
  )
}
