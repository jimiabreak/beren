'use client'

import { useState } from 'react'
import { stegaClean } from '@sanity/client/stega'
import { PortableText } from '@portabletext/react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { fadeInUp, staggerContainer } from '@/lib/animations'

import type { PortableTextBlock } from '@portabletext/types'

interface FAQ {
  _id: string
  question: string
  answer: PortableTextBlock[]
  category?: string
}

function AccordionItem({
  faq,
  isOpen,
  onToggle,
}: {
  faq: FAQ
  isOpen: boolean
  onToggle: () => void
}) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <div className="border-b border-foreground/20">
      <button
        onClick={onToggle}
        className="w-full text-left py-6 flex items-center justify-between gap-4 hover:opacity-70 transition-opacity duration-300 active:opacity-70"
        aria-expanded={isOpen}
      >
        <h3 className="text-[20px] sm:text-[24px] md:text-[28px] lg:text-[33px] font-bold leading-tight tracking-[-0.03em] pr-8">
          {faq.question}
        </h3>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="flex-shrink-0"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={!prefersReducedMotion ? { height: 0 } : { height: 'auto' }}
            animate={{
              height: 'auto',
              transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
            }}
            exit={{
              height: 0,
              transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
            }}
            className="overflow-hidden"
          >
            <motion.div
              initial={!prefersReducedMotion ? { opacity: 0 } : { opacity: 1 }}
              animate={{
                opacity: 1,
                transition: { duration: 0.2, delay: 0.1 },
              }}
              exit={{
                opacity: 0,
                transition: { duration: 0.15 },
              }}
              className="pb-6"
            >
              <div className="prose prose-sm max-w-none text-muted-foreground">
                <PortableText value={faq.answer} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function FAQContent({ faqs }: { faqs: FAQ[] }) {
  const [openIds, setOpenIds] = useState<Set<string>>(new Set())

  const toggle = (id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  // Group by category if categories exist
  const categories = faqs.reduce<Record<string, FAQ[]>>((acc, faq) => {
    const cat = stegaClean(faq.category) || 'General'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(faq)
    return acc
  }, {})

  const categoryNames = Object.keys(categories)
  const hasCategories =
    categoryNames.length > 1 ||
    (categoryNames.length === 1 && categoryNames[0] !== 'General')

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="max-w-3xl mx-auto"
    >
      {hasCategories ? (
        categoryNames.map((cat) => (
          <motion.div key={cat} variants={fadeInUp} className="mb-12">
            <h2 className="font-serif text-2xl mb-6">{cat}</h2>
            <div>
              {categories[cat].map((faq) => (
                <AccordionItem
                  key={faq._id}
                  faq={faq}
                  isOpen={openIds.has(faq._id)}
                  onToggle={() => toggle(faq._id)}
                />
              ))}
            </div>
          </motion.div>
        ))
      ) : (
        <div>
          {faqs.map((faq) => (
            <motion.div key={faq._id} variants={fadeInUp}>
              <AccordionItem
                faq={faq}
                isOpen={openIds.has(faq._id)}
                onToggle={() => toggle(faq._id)}
              />
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  )
}
