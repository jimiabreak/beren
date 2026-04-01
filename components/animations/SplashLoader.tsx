'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const ICONS = [
  { src: '/images/nav/Vector 76.svg', width: 28, height: 28 },   // Sun
  { src: '/images/nav/Vector 77.svg', width: 32, height: 11 },   // Mountains
  { src: '/images/nav/Group 1000002677.svg', width: 29, height: 31 }, // Olive branch
]

export default function SplashLoader() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(true)
    const timer = setTimeout(() => setVisible(false), 2000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="splash"
          initial={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center"
          style={{ backgroundColor: '#86351C' }}
        >
          {/* 3 Icons */}
          <div className="flex items-center gap-12 md:gap-16">
            {ICONS.map((icon, i) => (
              <motion.div
                key={icon.src}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                transition={{
                  delay: 0.2 + i * 0.15,
                  type: 'spring',
                  stiffness: 400,
                  damping: 25,
                  mass: 0.8,
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={icon.src}
                  alt=""
                  width={icon.width}
                  height={icon.height}
                  className="w-10 h-10 md:w-12 md:h-12"
                  aria-hidden="true"
                />
              </motion.div>
            ))}
          </div>

          {/* Tagline text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.4, ease: 'easeOut' }}
            className="mt-8 flex flex-col items-center"
          >
            <span className="text-foreground uppercase tracking-[0.2em] text-[10px] md:text-xs leading-tight">
              Ancestral Mediterranean Cooking
            </span>
            <span className="text-foreground uppercase tracking-[0.2em] text-[10px] md:text-xs leading-tight mt-1">
              Meze &amp; Grill House
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
