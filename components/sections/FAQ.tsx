'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { PortableText } from '@portabletext/react'
import { fadeInUp, staggerContainer } from '@/lib/animations'
import Container from '@/components/layout/Container'
import { useIsVisualEditing } from '@/components/sanity/VisualEditingContext'

type PortableTextValue = Parameters<typeof PortableText>[0]['value']

interface FAQProps {
  heading?: string
  faqItems?: Array<{ _id: string; question: string; answer: PortableTextValue }>
}

export default function FAQ({ heading, faqItems }: FAQProps) {
  const isVisualEditing = useIsVisualEditing()
  const [openId, setOpenId] = useState<string | null>(null)
  if (!faqItems || faqItems.length === 0) return null
  return (
    <motion.section variants={staggerContainer} initial={isVisualEditing ? false : 'hidden'} whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="py-20 sm:py-28">
      <Container>
        <motion.h2 variants={fadeInUp} className="font-serif text-3xl sm:text-4xl text-center mb-12">{heading || 'Frequently Asked Questions'}</motion.h2>
        <div className="max-w-3xl mx-auto divide-y divide-border">
          {faqItems.map((item) => (
            <motion.div key={item._id} variants={fadeInUp}>
              <button onClick={() => setOpenId(openId === item._id ? null : item._id)} className="w-full flex items-center justify-between py-5 text-left" aria-expanded={openId === item._id}>
                <span className="font-medium text-lg pr-4">{item.question}</span>
                <svg className={`w-5 h-5 flex-shrink-0 transition-transform ${openId === item._id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div
                className="grid transition-[grid-template-rows] duration-200 ease-out"
                style={{ gridTemplateRows: openId === item._id ? '1fr' : '0fr' }}
              >
                <div className="overflow-hidden">
                  <div className="pb-5 prose prose-sm text-muted-foreground">
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
