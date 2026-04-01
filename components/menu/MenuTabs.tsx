'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import Button from '@/components/ui/Button'

const MENU_TABS = [
  { key: 'lunch', label: 'Lunch', pdfs: ['/menus/lunch.pdf'] },
  { key: 'dinner', label: 'Dinner', pdfs: ['/menus/dinner.pdf'] },
  { key: 'dessert', label: 'Dessert', pdfs: ['/menus/dessert.pdf'] },
  { key: 'drink', label: 'Drink', pdfs: ['/menus/drinks.pdf', '/menus/wine.pdf'] },
  { key: 'specials', label: 'Specials', pdfs: ['/menus/specials.pdf'] },
]

// PDF aspect ratio: 1175.44 x 2976.93 points
const PDF_ASPECT = 1175.44 / 2976.93

export default function MenuTabs() {
  const [activeTab, setActiveTab] = useState('dinner')

  const activePdfs = MENU_TABS.find((t) => t.key === activeTab)?.pdfs || MENU_TABS[0].pdfs

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
                  ? 'bg-accent text-background border-2 border-accent'
                  : 'bg-transparent text-foreground border-2 border-accent hover:bg-accent/10'
                }
              `}
            >
              {tab.label}
            </button>
          )
        })}
        <Link
          href="/catering"
          className="px-5 py-2.5 text-sm uppercase tracking-wider transition-colors duration-200 min-h-touch bg-transparent text-foreground border-2 border-accent hover:bg-accent/10"
        >
          Catering
        </Link>
      </div>

      {/* PDF viewer — stacks multiple PDFs vertically for combined tabs */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="w-full flex flex-col"
        >
          {activePdfs.map((pdf) => (
            <div
              key={pdf}
              style={{ aspectRatio: PDF_ASPECT, backgroundColor: '#E8E7DC' }}
            >
              <embed
                src={`${pdf}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
                type="application/pdf"
                className="w-full h-full"
              />
            </div>
          ))}
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
