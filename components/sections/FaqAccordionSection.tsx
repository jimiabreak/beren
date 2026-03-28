'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { PortableText } from '@portabletext/react'
import { fadeInUp, staggerContainer } from '@/lib/animations'
import Container from '@/components/layout/Container'
import { useIsVisualEditing } from '@/components/sanity/VisualEditingContext'

type PortableTextValue = Parameters<typeof PortableText>[0]['value']

interface FAQItem {
  _id: string
  question: string
  answer: PortableTextValue
}

interface FaqAccordionSectionProps {
  heading?: string
  items?: FAQItem[]
}

export default function FaqAccordionSection({ heading, items }: FaqAccordionSectionProps) {
  const isVisualEditing = useIsVisualEditing()
  const [openId, setOpenId] = useState<string | null>(null)
  if (!items || items.length === 0) return null

  return (
    <motion.section variants={staggerContainer} initial={isVisualEditing ? false : 'hidden'} whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="py-24 md:py-32">
      <Container>
        {heading && (
          <motion.h2 variants={fadeInUp} className="font-serif font-semibold text-3xl md:text-4xl tracking-tight text-center mb-12">
            {heading}
          </motion.h2>
        )}
        <div className="max-w-3xl mx-auto">
          {items.map((item, index) => (
            <motion.div
              key={item._id}
              variants={fadeInUp}
              className={`border-t border-border${index === items.length - 1 ? ' border-b' : ''}`}
            >
              <button
                onClick={() => setOpenId(openId === item._id ? null : item._id)}
                className="w-full flex items-center justify-between py-6 text-left"
                aria-expanded={openId === item._id}
              >
                <span className="text-lg font-medium pr-4">{item.question}</span>
                <span className="font-mono text-xl text-muted-foreground flex-shrink-0 transition-all duration-500 ease-[cubic-bezier(.19,1,.22,1)]">
                  {openId === item._id ? '\u2212' : '+'}
                </span>
              </button>
              <div
                className="grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(.19,1,.22,1)]"
                style={{ gridTemplateRows: openId === item._id ? '1fr' : '0fr' }}
              >
                <div className="overflow-hidden">
                  <div className="text-base text-foreground/80 leading-relaxed pb-6 prose prose-sm">
                    {Array.isArray(item.answer) ? <PortableText value={item.answer} /> : <p>{String(item.answer)}</p>}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </motion.section>
  )
}
