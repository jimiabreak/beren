'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import Button from '@/components/ui/Button'

const MENU_TABS = [
  {
    key: 'lunch',
    label: 'Lunch',
    images: [{ src: '/menus/PNG/lunch.png', width: 1650, height: 4200 }],
  },
  {
    key: 'dinner',
    label: 'Dinner',
    images: [{ src: '/menus/PNG/dinner.png', width: 1650, height: 4200 }],
  },
  {
    key: 'dessert',
    label: 'Dessert',
    images: [{ src: '/menus/PNG/dessert.png', width: 1650, height: 1650 }],
  },
  {
    key: 'drink',
    label: 'Drink',
    images: [
      { src: '/menus/PNG/drinks.png', width: 1650, height: 3300 },
      { src: '/menus/PNG/wine.png', width: 1650, height: 3300 },
    ],
  },
  {
    key: 'specials',
    label: 'Specials',
    images: [{ src: '/menus/PNG/specials.png', width: 1650, height: 1650 }],
  },
]

export default function MenuTabs() {
  const [activeTab, setActiveTab] = useState('dinner')

  const activeImages =
    MENU_TABS.find((t) => t.key === activeTab)?.images || MENU_TABS[0].images

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

      {/* Menu images */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="w-full flex flex-col items-center gap-8"
        >
          {activeImages.map((img) => (
            <div
              key={img.src}
              className="w-full max-w-[1000px] border-2 border-accent"
            >
              <Image
                src={img.src}
                alt={`${activeTab} menu`}
                width={img.width}
                height={img.height}
                className="w-full h-auto block"
                unoptimized
                priority={activeTab === 'dinner'}
                sizes="(max-width: 768px) 100vw, 700px"
              />
            </div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* CTA */}
      <div className="flex justify-center mt-12 md:mt-16">
        <Button
          href="https://www.opentable.com/booking/restref/availability?lang=en-US&correlationId=e39a6023-80ca-40e2-89a8-4ddadff82c7e&restRef=1503940&otSource=Restaurant%20website"
          variant="outline"
          size="lg"
          target="_blank"
          rel="noopener noreferrer"
        >
          Make a Reservation
        </Button>
      </div>
    </div>
  )
}
