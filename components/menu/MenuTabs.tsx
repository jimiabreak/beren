'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import Button from '@/components/ui/Button'

const MENU_TABS = [
  { key: 'lunch', label: 'Lunch', pdf: '/images/menu/menu.pdf' },
  { key: 'dinner', label: 'Dinner', pdf: '/images/menu/menu.pdf' },
  { key: 'dessert', label: 'Dessert', pdf: '/images/menu/menu.pdf' },
  { key: 'drink', label: 'Drink', pdf: '/images/menu/menu.pdf' },
  { key: 'specials', label: 'Specials', pdf: '/images/menu/menu.pdf' },
]

// PDF aspect ratio: 1175.44 x 2976.93 points
const PDF_ASPECT = 1175.44 / 2976.93

export default function MenuTabs() {
  const [activeTab, setActiveTab] = useState('dinner')

  const activePdf = MENU_TABS.find((t) => t.key === activeTab)?.pdf || MENU_TABS[0].pdf

  return (
    <div>
      {/* Tab buttons */}
      <div className="flex flex-wrap gap-2 md:gap-3 justify-center mb-10 md:mb-14">
        {MENU_TABS.map((tab) => {
          const isActive = tab.key === activeTab
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`
                px-5 py-2.5 text-sm uppercase tracking-wider transition-colors duration-200 min-h-touch
                ${isActive
                  ? 'bg-accent text-background border border-accent'
                  : 'bg-transparent text-foreground border border-accent hover:bg-accent/10'
                }
              `}
            >
              {tab.label}
            </button>
          )
        })}
        <Link
          href="/catering"
          className="px-5 py-2.5 text-sm uppercase tracking-wider transition-colors duration-200 min-h-touch bg-transparent text-foreground border border-accent hover:bg-accent/10"
        >
          Catering
        </Link>
      </div>

      {/* PDF viewer — uses <img> for the PDF rendered as image,
           with fallback to <embed> for browsers that support it */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="w-full"
          style={{ aspectRatio: PDF_ASPECT, backgroundColor: '#E8E7DC' }}
        >
          <embed
            src={`${activePdf}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
            type="application/pdf"
            className="w-full h-full border-3 border-accent"
            style={{ border: '3px solid var(--color-accent)' }}
          />
        </motion.div>
      </AnimatePresence>

      {/* CTA */}
      <div className="flex justify-center mt-12 md:mt-16">
        <Button href="/contact" variant="outline" size="lg">
          Make a Reservation
        </Button>
      </div>
    </div>
  )
}
